import User from '@/models/user';
import { connectToDatabase } from '@/utils/services/database';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, password, role } = await request.json();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists.' },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = new User({ name, email, password: hashedPassword, role });
    await data.save();
    return NextResponse.json({ message: 'User Signup Successfully' });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
