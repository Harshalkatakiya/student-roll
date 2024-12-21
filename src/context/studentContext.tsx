'use client';
import { IStudent } from '@/models/student';
import mongoose from 'mongoose';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

export interface StudentsData {
  students: IStudent[];
  totalPages: number;
  currentPage: number;
  totalStudents: number;
}
interface showFormProps {
  show: boolean;
  mode: string;
  _id: mongoose.Types.ObjectId | null;
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
    _id: null
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
    _id: null
  });
  return (
    <StudentContext value={{ students, setStudents, showForm, setShowForm }}>
      {children}
    </StudentContext>
  );
};

export default StudentProvider;
