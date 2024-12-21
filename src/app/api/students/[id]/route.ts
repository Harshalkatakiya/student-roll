import Student from "@/models/student";
import { connectToDatabase } from "@/utils/services/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params: { id } }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const student = await Student.findById(id);
        if (!student) {
            return NextResponse.json(
                { message: "Student not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(student, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json(
            { message: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params: { id } }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        await Student.findByIdAndDelete(id);
        return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json(
            { message: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params: { id } }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const student = await Student.findByIdAndUpdate(id, await request.json());
        if (!student) {
            return NextResponse.json(
                { message: "Student not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ message: "Student updated successfully" }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json(
            { message: (error as Error).message },
            { status: 500 }
        );
    }
}