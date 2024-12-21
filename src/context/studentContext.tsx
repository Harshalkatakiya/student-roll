'use client';
import { IStudent } from '@/models/student';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

export interface StudentsData {
  students: IStudent[];
  totalPages: number;
  currentPage: number;
  totalStudents: number;
}

interface StudentContextProps {
  students: StudentsData;
  setStudents: Dispatch<SetStateAction<StudentsData>>;
}

export const StudentContext = createContext<StudentContextProps>({
  students: {
    students: [],
    totalPages: 0,
    currentPage: 0,
    totalStudents: 0
  },
  setStudents: () => {}
});

export const StudentProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [students, setStudents] = useState<StudentsData>({
    students: [],
    totalPages: 0,
    currentPage: 0,
    totalStudents: 0
  });
  return (
    <StudentContext value={{ students, setStudents }}>
      {children}
    </StudentContext>
  );
};

export default StudentProvider;
