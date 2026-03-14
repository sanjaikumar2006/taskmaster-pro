import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import { getSession } from '@/lib/auth';
import { encryptData, decryptData } from '@/lib/crypto';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, description, status } = await req.json();

    await connectDB();

    const encryptedDescription = description ? encryptData(description) : undefined;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: session.userId },
      { title, description: encryptedDescription, status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
    }

    const taskObj = task.toObject();
    taskObj.description = description;

    return NextResponse.json(taskObj);

  } catch (error: any) {
    console.error('Task update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const task = await Task.findOneAndDelete({ _id: id, userId: session.userId });

    if (!task) {
      return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });

  } catch (error: any) {
    console.error('Task deletion error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
