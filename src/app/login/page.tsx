'use client';
import UseAxios from '@/hooks/useAxios';
import Toast from '@/utils/helpers/Toast';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface LoginFormData {
  email: string;
  password: string;
  role: 'Admin' | 'Teacher';
}

const LoginPage: React.FC = () => {
  const Router = useRouter();
  const { makeRequest, isLoading } = UseAxios();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    role: 'Admin'
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await makeRequest({
        method: 'POST',
        url: '/user/login',
        data: {
          email: formData.email,
          password: formData.password,
          role: formData.role
        },
        successToast: true,
        errorToast: true
      });
      if (response.status === 200) {
        Toast(response.data.message, 'success');
        Router.push('/students');
      }
    } catch {}
  };
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200'>
      <div className='max-w-md w-full bg-white shadow-xl rounded-lg p-8 border border-gray-200'>
        <h2 className='text-3xl font-bold text-center text-indigo-700 mb-6'>
          Welcome Back
        </h2>
        <p className='text-sm text-center text-gray-500 mb-6'>
          Login to your account to continue
        </p>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email'
              className='mt-2 block w-full rounded-lg border-gray-300 bg-gray-100 p-3 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter your password'
              className='mt-2 block w-full rounded-lg border-gray-300 bg-gray-100 p-3 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>
          <div>
            <label
              htmlFor='role'
              className='block text-sm font-medium text-gray-700'>
              Role
            </label>
            <select
              id='role'
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='mt-2 block w-full rounded-lg border-gray-300 bg-gray-100 p-3 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'>
              <option value='Admin'>Admin</option>
              <option value='Teacher'>Teacher</option>
            </select>
          </div>
          <div className='mt-6'>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full px-4 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform transform hover:scale-105'>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
