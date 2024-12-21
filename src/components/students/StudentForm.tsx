import UseAxios from '@/hooks/useAxios';
import Toast from '@/utils/helpers/Toast';
import { AxiosResponse } from 'axios';
import mongoose from 'mongoose';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface StudentFormProps {
  setShowForm: Dispatch<
    SetStateAction<{
      show: boolean;
      mode: string;
      _id: mongoose.Types.ObjectId | null;
    }>
  >;
  showForm: {
    show: boolean;
    mode: string;
    _id: mongoose.Types.ObjectId | null;
  };
}

const StudentForm: React.FC<StudentFormProps> = ({ setShowForm, showForm }) => {
  const { makeRequest, isLoading } = UseAxios();
  const [formData, setFormData] = useState({
    enrollmentNumber: '',
    firstName: '',
    lastName: '',
    fatherName: '',
    division: 'M2',
    program: 'MSc IT',
    mobileNumber: '',
    rollNo: ''
  });
  const handleClear = () => {
    setFormData({
      enrollmentNumber: '',
      firstName: '',
      lastName: '',
      fatherName: '',
      division: 'M2',
      program: 'MSc IT',
      mobileNumber: '',
      rollNo: ''
    });
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const getStudent = async () => {
    try {
      const response = await makeRequest({
        method: 'GET',
        url: `/students/${showForm._id}`
      });
      if (response.status === 200 && response.data) {
        const data = (response as AxiosResponse<any, any>).data;
        setFormData(data);
      } else {
        setShowForm({ show: false, mode: 'Add', _id: null });
      }
    } catch {
      setShowForm({ show: false, mode: 'Add', _id: null });
    }
  };
  useEffect(() => {
    if (showForm.mode === 'Edit') {
      getStudent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm._id]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(showForm.mode === 'Edit' ? 'PATCH' : 'POST');
    try {
      const response = await makeRequest({
        method: showForm.mode === 'Edit' ? 'PATCH' : 'POST',
        url:
          showForm.mode === 'Edit' ? `/students/${showForm._id}` : '/students',
        data: {
          enrollmentNumber: formData.enrollmentNumber,
          firstName: formData.firstName,
          lastName: formData.lastName,
          fatherName: formData.fatherName,
          division: formData.division,
          program: formData.program,
          mobileNumber: formData.mobileNumber,
          rollNo: formData.rollNo
        },
        successToast: true,
        errorToast: true
      });
      if (response.status === 201 || response.status === 200) {
        Toast(response.data.message, 'success');
        setShowForm({ show: false, mode: 'Add', _id: null });
      }
    } catch {}
  };
  return (
    <>
      <h2 className='text-xl font-semibold mb-6'>{showForm.mode} Student</h2>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className='space-y-6'
        method='POST'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              First Name
            </label>
            <input
              type='text'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='Enter first name'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Father Name
            </label>
            <input
              type='text'
              name='fatherName'
              value={formData.fatherName}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='Enter father name'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Last Name
            </label>
            <input
              type='text'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='Enter last name'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Mobile Number
            </label>
            <input
              type='tel'
              name='mobileNumber'
              value={formData.mobileNumber}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='Enter mobile number'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Division
            </label>
            <input
              type='text'
              name='division'
              value={formData.division}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='Enter father name'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Program
            </label>
            <input
              type='text'
              name='program'
              value={formData.program}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='Enter father name'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Enrollment Number
            </label>
            <input
              type='number'
              name='enrollmentNumber'
              value={formData.enrollmentNumber}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='Enter enrollment number'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Roll No.
            </label>
            <input
              type='number'
              name='rollNo'
              value={formData.rollNo}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='Enter roll number'
            />
          </div>
        </div>

        <div className='flex justify-end space-x-4 mt-4'>
          <button
            type='button'
            onClick={() => setShowForm({ show: false, mode: 'Add', _id: null })}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:shadow'>
            Cancel
          </button>
          <button
            type='reset'
            onClick={() => handleClear()}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:shadow'>
            Clear
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow'>
            {showForm.mode}
          </button>
        </div>
      </form>
    </>
  );
};

export default StudentForm;
