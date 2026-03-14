import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import { getSession } from '@/lib/auth';
import { encryptData, decryptData } from '@/lib/crypto';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    await connectDB();

    const query: any = { userId: session.userId };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);
    
    // Get stats for all user tasks (not just current page)
    let stats: any[] = [];
    try {
      const aggId = typeof session.userId === 'string' ? 
        new mongoose.Types.ObjectId(session.userId) : 
        session.userId;
        
      stats = await Task.aggregate([
        { $match: { userId: aggId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
    } catch (aggError) {
      console.error('Aggregation failed:', aggError);
      // Fallback: manually count if aggregation fails (unlikely now)
      const allTasks = await Task.find({ userId: session.userId }).select('status');
      const counts: any = {};
      allTasks.forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1; });
      stats = Object.entries(counts).map(([_id, count]) => ({ _id, count: count as number }));
    }

    const statsMap = {
      total: stats.reduce((acc, curr) => acc + curr.count, 0),
      pending: stats.find(s => s._id === 'pending')?.count || 0,
      inProgress: stats.find(s => s._id === 'in-progress')?.count || 0,
      completed: stats.find(s => s._id === 'completed')?.count || 0,
    };

    // Decrypt descriptions for the response
    const decryptedTasks = tasks.map(task => {
      const taskObj = task.toObject();
      if (taskObj.description) {
        taskObj.description = decryptData(taskObj.description);
      }
      return taskObj;
    });

    return NextResponse.json({
      tasks: decryptedTasks,
      stats: statsMap,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Task fetch error:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error.message || 'Unknown database error' 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, status } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    await connectDB();

    // Encrypt description before saving to DB as a "sensitive field"
    const encryptedDescription = description ? encryptData(description) : '';

    const task = await Task.create({
      title,
      description: encryptedDescription,
      status: status || 'pending',
      userId: session.userId
    });

    const taskObj = task.toObject();
    taskObj.description = description; // Return original to client

    return NextResponse.json(taskObj, { status: 201 });

  } catch (error: any) {
    console.error('Task creation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
