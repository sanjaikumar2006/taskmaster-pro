import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const user = await User.create({ name, email, password });
    
    return NextResponse.json({ 
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email } 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    // Explicitly return the error message to help the user debug
    return NextResponse.json({ 
      error: 'Registration failed', 
      details: error.message || 'Unknown server error' 
    }, { status: 500 });
  }
}
