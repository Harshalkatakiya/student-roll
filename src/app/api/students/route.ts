import prisma, { disconnectPrisma } from '@/utils/services/prismaProvider';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
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

    const existingStudent = await prisma!.student.findFirst({
      where: {
        firstName,
        lastName
      }
    });
    if (existingStudent) {
      return NextResponse.json(
        { message: 'Student Already Exists.' },
        { status: 409 }
      );
    }
    await prisma!.student.create({
      data: {
        enrollmentNumber,
        firstName,
        lastName,
        fatherName,
        division,
        program,
        mobileNumber,
        rollNo
      }
    });
    return NextResponse.json(
      { message: 'Student added Successfully' },
      { status: 201 }
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

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    let page = parseInt(url.searchParams.get('page') || '1', 10);
    let limit = parseInt(url.searchParams.get('limit') || '10', 10);
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('search') || '';
    const division = url.searchParams.get('division');
    const program = url.searchParams.get('program');
    const sortBy = url.searchParams.get('sortBy') || 'firstName';
    const order = url.searchParams.get('order') === 'desc' ? 'desc' : 'asc';
    const validSortFields = [
      'firstName',
      'lastName',
      'enrollmentNumber',
      'rollNo',
      'program',
      'division'
    ];
    const sortCondition =
      validSortFields.includes(sortBy) ?
        { [sortBy]: order as Prisma.SortOrder }
      : { firstName: 'asc' as Prisma.SortOrder };
    const whereConditions: Record<string, any> = {
      AND: []
    };
    if (searchQuery) {
      whereConditions.AND.push({
        OR: [
          { firstName: { contains: searchQuery, mode: 'insensitive' } },
          { lastName: { contains: searchQuery, mode: 'insensitive' } }
        ]
      });
      if (!isNaN(Number(searchQuery))) {
        whereConditions.AND.push({
          OR: [
            { enrollmentNumber: parseInt(searchQuery, 10) },
            { rollNo: parseInt(searchQuery, 10) }
          ]
        });
      }
    }
    if (division) {
      whereConditions.AND.push({ division });
    }
    if (program) {
      whereConditions.AND.push({ program });
    }
    const students = await prisma!.student.findMany({
      where: whereConditions,
      orderBy: sortCondition,
      skip,
      take: limit
    });
    const totalStudents = await prisma!.student.count({
      where: whereConditions
    });
    if (!students || students.length === 0) {
      return NextResponse.json(
        { message: 'No profiles found' },
        { status: 404 }
      );
    }
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
  } finally {
    disconnectPrisma();
  }
}
