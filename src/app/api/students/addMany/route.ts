import Student from '@/models/student';
import { connectToDatabase } from '@/utils/services/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const students = await request.json();
    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { message: 'No students provided in the request.' },
        { status: 400 }
      );
    }
    const studentsToInsert = [];
    for (const studentData of students) {
      const {
        enrollmentNumber,
        firstName,
        lastName,
        fatherName,
        division,
        program,
        mobileNumber,
        rollNo
      } = studentData;
      try {
        const existingStudent = await Student.findOne({
          enrollmentNumber,
          program
        });
        if (existingStudent) {
          console.log(
            `Student with enrollment number ${enrollmentNumber} in program ${program} already exists. Skipping.`
          );
          continue;
        }
        studentsToInsert.push({
          enrollmentNumber,
          firstName,
          lastName,
          fatherName,
          division,
          program,
          mobileNumber,
          rollNo
        });
      } catch (err) {
        console.error(
          `Error processing student with enrollment number ${enrollmentNumber}:`,
          err
        );
      }
    }
    if (studentsToInsert.length > 0) {
      await Student.insertMany(studentsToInsert);
      console.log(`${studentsToInsert.length} new students inserted.`);
    } else {
      console.log('No new students to insert.');
    }
    return NextResponse.json(
      { message: 'Processing completed.' },
      { status: 207 }
    );
  } catch (error: unknown) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
