'use client';
import { StudentContext, StudentsData } from '@/context/studentContext';
import UseAxios from '@/hooks/useAxios';
import Toast from '@/utils/helpers/Toast';
import { AxiosResponse } from 'axios';
import { Edit2, Search, Trash2 } from 'lucide-react';
import React, { use, useEffect, useState } from 'react';

const StudentList: React.FC = () => {
  const { students, setStudents, setShowForm } = use(StudentContext);
  const { makeRequest, isLoading } = UseAxios();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);
  const getStudents = async () => {
    try {
      const response = await makeRequest<StudentsData>({
        method: 'GET',
        url: '/students',
        params: {
          search: debouncedSearch,
          page: students.currentPage,
          limit: 100,
          sortBy: 'enrollmentNumber',
          order: 'asc'
        },
        successToast: true,
        errorToast: false
      });
      if (response.status === 200 && response.data) {
        const data = (response as AxiosResponse<any, any>).data;
        setStudents(data);
      }
    } catch {}
  };
  useEffect(() => {
    getStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
  const handleDelete = async (id: string) => {
    try {
      const response = await makeRequest({
        method: 'DELETE',
        url: `/students/${id}`,
        successToast: true,
        errorToast: true
      });
      if (response.status === 200) {
        Toast(response.data.message, 'success');
        setStudents({
          ...students,
          students: students.students.filter((student) => student.id !== id)
        });
      }
    } catch {}
  };
  return (
    <>
      <div className='flex items-center'>
        <div className='relative flex-1 mb-3'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type='search'
            placeholder='Search students...'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className='pl-10 pr-4 py-2 w-full rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          />
        </div>
      </div>
      <div className='space-y-4'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'>
                  No.
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'>
                  Enrollment No.
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'>
                  Roll No.
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {isLoading ?
                <tr>
                  <td
                    colSpan={5}
                    className='px-6 py-4 text-center text-sm text-gray-500'>
                    Loading...
                  </td>
                </tr>
              : students.students.length === 0 ?
                <tr>
                  <td
                    colSpan={5}
                    className='px-6 py-4 text-center text-sm text-gray-500'>
                    No data found
                  </td>
                </tr>
              : students.students.map((student, index) => {
                  const {
                    id,
                    enrollmentNumber,
                    firstName,
                    lastName,
                    fatherName,
                    rollNo
                  } = student;
                  return (
                    <tr key={index}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {index + 1}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>
                          {lastName} {firstName} {fatherName}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {enrollmentNumber}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {rollNo}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <button
                          onClick={() => {
                            setShowForm({
                              show: true,
                              mode: 'Edit',
                              id: id
                            });
                          }}
                          className='text-indigo-600 hover:text-indigo-900 mr-4'>
                          <Edit2 className='w-5 h-5' />
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(id);
                          }}
                          className='text-red-600 hover:text-red-900'>
                          <Trash2 className='w-5 h-5' />
                        </button>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StudentList;
