'use client';
import StudentForm from '@/components/students/StudentForm';
import StudentList from '@/components/students/StudentList';
import { Plus } from 'lucide-react';
import mongoose from 'mongoose';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';

interface showFormProps {
  show: boolean;
  mode: string;
  _id: mongoose.Types.ObjectId | null;
}

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'attendance'>(
    'students'
  );
  const [showForm, setShowForm] = useState<showFormProps>({
    show: false,
    mode: 'Add',
    _id: null
  });
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <Toaster position='top-right' />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Student Management System
          </h1>
        </div>
        <div className='mb-6'>
          <nav className='flex space-x-4'>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'students' ?
                  'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
              }`}>
              Students
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'attendance' ?
                  'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
              }`}>
              Attendance
            </button>
          </nav>
        </div>
        {activeTab === 'students' && (
          <div className='space-y-6'>
            {!showForm.show && (
              <button
                onClick={() =>
                  setShowForm({ show: true, mode: 'Add', _id: null })
                }
                className='flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700'>
                <Plus className='w-5 h-5 mr-2' />
                Add Student
              </button>
            )}

            {showForm.show ?
              <div className='bg-white rounded-lg shadow-md p-6'>
                <StudentForm setShowForm={setShowForm} showForm={showForm} />
              </div>
            : <div className='bg-white rounded-lg shadow-md'>
                <StudentList setShowForm={setShowForm} />
              </div>
            }
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold mb-6'>Mark Attendance</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
