import prisma, { disconnectPrisma } from '@/utils/services/prismaProvider';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();
    const existingUser = await prisma!.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists.' },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma!.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });
    return NextResponse.json({ message: 'User Signup Successfully' });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  } finally {
    disconnectPrisma();
  }
}
