import prisma, { disconnectPrisma } from '@/utils/services/prismaProvider';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {
      studentIds,
      date,
      lecture
    }: {
      studentIds: string[];
      date: string;
      lecture?: string;
    } = await request.json();
    if (!date || !Array.isArray(studentIds)) {
      return NextResponse.json(
        {
          message: 'Invalid data.'
        },
        { status: 400 }
      );
    }
    const existingAttendance = await prisma!.attendance.findFirst({
      where: { date }
    });
    if (existingAttendance) {
      const updatedStudentIds = Array.from(
        new Set([...(existingAttendance.studentIds ?? []), ...studentIds])
      );
      await prisma!.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          studentIds: updatedStudentIds
        }
      });
      return NextResponse.json(
        {
          message: 'Attendance updated successfully',
          attendance: existingAttendance
        },
        { status: 200 }
      );
    } else {
      const newAttendance = await prisma!.attendance.create({
        data: {
          studentIds,
          date,
          lecture
        }
      });
      return NextResponse.json(
        {
          message: 'Attendance marked successfully',
          attendance: newAttendance
        },
        { status: 201 }
      );
    }
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  } finally {
    disconnectPrisma();
  }
}
