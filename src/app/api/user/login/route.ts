import User from '@/models/user';
import {
  COOKIE_NAME,
  JWT_SECRET_KEY,
  NODE_ENV
} from '@/utils/constants/app.constant';
import { connectToDatabase } from '@/utils/services/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password, role } = await request.json();
    const user = await User.findOne({ email, role });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials.' },
        { status: 401 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials.' },
        { status: 401 }
      );
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET_KEY,
      { expiresIn: '30d' }
    );
    const response = NextResponse.json({
      message: 'User Login Successfully'
    });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    });
    return response;
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
