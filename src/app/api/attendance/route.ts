import Attendance from '@/models/attendance';
import { connectToDatabase } from '@/utils/services/database';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const {
      studentIds,
      date,
      lecture
    }: {
      studentIds: mongoose.Types.ObjectId[];
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
    const existingAttendance = await Attendance.findOne({ date });
    if (existingAttendance) {
      existingAttendance.studentId = Array.from(
        new Set([...(existingAttendance.studentId ?? []), ...studentIds])
      );
      await existingAttendance.save();
      return NextResponse.json(
        {
          message: 'Attendance updated successfully',
          attendance: existingAttendance
        },
        { status: 200 }
      );
    } else {
      const newAttendance = new Attendance({
        studentId: studentIds,
        date,
        lecture
      });
      await newAttendance.save();
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
  }
}
