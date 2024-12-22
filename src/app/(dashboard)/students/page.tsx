'use client';
import StudentForm from '@/components/students/StudentForm';
import StudentList from '@/components/students/StudentList';
import { StudentContext } from '@/context/studentContext';
import { Plus } from 'lucide-react';
import { use } from 'react';

const Students = () => {
  const { showForm, setShowForm } = use(StudentContext);
  return (
    <div className='space-y-6'>
      {!showForm.show && (
        <button
          onClick={() => setShowForm({ show: true, mode: 'Add', id: null })}
          className='flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700'>
          <Plus className='w-5 h-5 mr-2' />
          Add Student
        </button>
      )}
      {showForm.show ?
        <div className='bg-white rounded-lg shadow-md p-6'>
          <StudentForm />
        </div>
      : <div className='bg-white rounded-lg shadow-md'>
          <StudentList />
        </div>
      }
    </div>
  );
};

export default Students;
