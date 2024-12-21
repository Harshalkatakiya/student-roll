import Student from '@/models/student';
import { connectToDatabase } from '@/utils/services/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const {
      enrollmentNumber,
      firstName,
      lastName,
      fatherName,
      division,
      program,
      mobileNumber,
      rollNo
    } = await request.json();
    const student = await Student.findOne({ enrollmentNumber, program });
    if (student) {
      return NextResponse.json(
        { message: 'Student Already Exists.' },
        { status: 409 }
      );
    }
    const newStudent = await Student.create({
      enrollmentNumber,
      firstName,
      lastName,
      fatherName,
      division,
      program,
      mobileNumber,
      rollNo
    });
    await newStudent.save();
    return NextResponse.json(
      { message: 'Student added Successfully' },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('search') || '';
    const division = url.searchParams.get('division');
    const program = url.searchParams.get('program');
    const searchFields = [
      'enrollmentNumber',
      'firstName',
      'lastName',
      'rollNo'
    ];
    const searchConditions = searchFields.map((field) => ({
      [field]: { $regex: searchQuery, $options: 'i' }
    }));
    const filterConditions: Record<string, unknown>[] = [];
    if (division) filterConditions.push({ division });
    if (program) filterConditions.push({ program });
    const queryCondition = {
      $and: [searchQuery ? { $or: searchConditions } : {}, ...filterConditions]
    };
    const students = await Student.find(queryCondition).skip(skip).limit(limit);
    if (!students || students.length === 0) {
      return NextResponse.json(
        { message: 'No profiles found' },
        { status: 404 }
      );
    }
    const totalStudents = await Student.countDocuments(queryCondition);
    return NextResponse.json(
      {
        totalStudents,
        currentPage: page,
        totalPages: Math.ceil(totalStudents / limit),
        students
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
