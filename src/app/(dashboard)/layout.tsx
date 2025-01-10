'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const navItems = [
    { href: '/students', label: 'Students' },
    { href: '/attendance', label: 'Attendance' }
  ];
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <Toaster position='top-right' />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 px-4'>
          <h1 className='text-lg xsm:text-xl sm:text-2xl 2sm:text-3xl text-center md:text-left font-bold text-gray-900'>
            Student Management System
          </h1>
        </div>
        <div className='mb-6'>
          <nav className='flex space-x-4'>
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  pathname === href ?
                    'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
                }`}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
