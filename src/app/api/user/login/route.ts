import {
  COOKIE_NAME,
  JWT_SECRET_KEY,
  NODE_ENV
} from '@/utils/constants/app.constant';
import prisma, { disconnectPrisma } from '@/utils/services/prismaProvider';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const user = await prisma!.user.findUnique({ where: { email } });
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
      { userId: user.id, role: user.role },
      JWT_SECRET_KEY,
      { expiresIn: '30d' }
    );
    const response = NextResponse.json(
      {
        message: 'User Login Successfully'
      },
      { status: 200 }
    );
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
  } finally {
    disconnectPrisma();
  }
}
