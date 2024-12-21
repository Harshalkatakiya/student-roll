import { BarChart2 } from 'lucide-react';
import React from 'react';

const AttendanceStats: React.FC = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-medium text-gray-500'>Total Present</h3>
          <span className='text-green-500 bg-green-100 rounded-full p-2'>
            <BarChart2 className='w-4 h-4' />
          </span>
        </div>
        <p className='mt-2 text-3xl font-semibold text-gray-900'>13</p>
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-medium text-gray-500'>Total Absent</h3>
          <span className='text-red-500 bg-red-100 rounded-full p-2'>
            <BarChart2 className='w-4 h-4' />
          </span>
        </div>
        <p className='mt-2 text-3xl font-semibold text-gray-900'>18</p>
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-medium text-gray-500'>Attendance Rate</h3>
          <span className='text-blue-500 bg-blue-100 rounded-full p-2'>
            <BarChart2 className='w-4 h-4' />
          </span>
        </div>
        <p className='mt-2 text-3xl font-semibold text-gray-900'>
          {(67.2444).toFixed(1)}%
        </p>
      </div>
    </div>
  );
};

export default AttendanceStats;
