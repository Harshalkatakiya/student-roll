'use client';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

export interface Student {
  id: string;
  enrollmentNumber?: number | string;
  firstName: string;
  lastName: string;
  fatherName?: string;
  division: string;
  program: string;
  mobileNumber?: number | string;
  rollNo?: number | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StudentsData {
  students: Student[];
  totalPages: number;
  currentPage: number;
  limit: number;
  totalStudents: number;
}
interface showFormProps {
  show: boolean;
  mode: string;
  id: string | null;
}
interface StudentContextProps {
  students: StudentsData;
  setStudents: Dispatch<SetStateAction<StudentsData>>;
  showForm: showFormProps;
  setShowForm: Dispatch<SetStateAction<showFormProps>>;
}

export const StudentContext = createContext<StudentContextProps>({
  students: {
    students: [],
    totalPages: 0,
    currentPage: 0,
    totalStudents: 0
  },
  setStudents: () => {},
  showForm: {
    show: false,
    mode: 'Add',
    id: null
  },
  setShowForm: () => {}
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
  const [showForm, setShowForm] = useState<showFormProps>({
    show: false,
    mode: 'Add',
    id: null
  });
  return (
    <StudentContext value={{ students, setStudents, showForm, setShowForm }}>
      {children}
    </StudentContext>
  );
};

export default StudentProvider;
