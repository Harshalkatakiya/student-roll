import prisma, { disconnectPrisma } from '@/utils/services/prismaProvider';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const student = await prisma!.student.findUnique({
      where: { id: (await params).id }
    });
    if (!student) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(student, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  } finally {
    disconnectPrisma();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const deletedStudent = await prisma!.student.delete({
      where: { id: (await params).id }
    });
    if (!deletedStudent) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Student deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  } finally {
    disconnectPrisma();
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData = await request.json();
    const updatedStudent = await prisma!.student.update({
      where: { id },
      data: updateData
    });
    if (!updatedStudent) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Student updated successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log((error as Error).message);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  } finally {
    disconnectPrisma();
  }
}
