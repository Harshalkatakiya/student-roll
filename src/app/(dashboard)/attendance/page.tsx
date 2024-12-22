'use client';
import AttendanceStats from '@/components/attendance/AttendanceStats';
import { StudentContext, StudentsData } from '@/context/studentContext';
import UseAxios from '@/hooks/useAxios';
import Toast from '@/utils/helpers/Toast';
import { AxiosResponse } from 'axios';
import { Book, Calendar, Check, Download, Search, X } from 'lucide-react';
import { use, useEffect, useRef, useState } from 'react';

const Attendance = () => {
  const { students, setStudents } = use(StudentContext);
  const { makeRequest, isLoading } = UseAxios();
  const [lectureName, setLectureName] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceData, setAttendanceData] = useState<
    { _id: string; status: 'present' | 'absent' }[]
  >([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const handleExport = () => {
    Toast('Attendance report downloaded successfully');
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);
  const getStudents = async (page: number) => {
    try {
      const response = await makeRequest<StudentsData>({
        method: 'GET',
        url: '/students',
        params: {
          search: debouncedSearch,
          page,
          limit: 10,
          sortBy: 'lastName',
          order: 'asc'
        },
        successToast: true,
        errorToast: false
      });
      if (response.status === 200 && response.data) {
        const data = (response as AxiosResponse<any, any>).data;
        if (data.students.length === 0) {
          setHasMore(false);
        } else {
          setStudents((prev) => ({
            ...prev,
            students: [...prev.students, ...data.students],
            currentPage: page
          }));
        }
      }
    } catch {}
  };
  const loadMoreStudents = ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting && !isLoading && hasMore) {
      getStudents(students.currentPage + 1);
    }
  };
  useEffect(() => {
    getStudents(1);
  }, [debouncedSearch]);
  useEffect(() => {
    const observer = new IntersectionObserver(loadMoreStudents, {
      rootMargin: '100px'
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [students]);
  const toggleAttendance = (_id: string, status: 'present' | 'absent') => {
    setAttendanceData((prev) => {
      const existingIndex = prev.findIndex((item) => item._id === _id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        if (updated[existingIndex].status === status) {
          updated.splice(existingIndex, 1);
        } else {
          updated[existingIndex].status = status;
        }
        return updated;
      } else {
        return [...prev, { _id, status }];
      }
    });
  };
  const submitAttendance = async () => {
    try {
      const response = await makeRequest({
        method: 'POST',
        url: '/attendance',
        data: {
          date: selectedDate,
          attendance: attendanceData
        },
        successToast: true,
        errorToast: true
      });
      if (response.status === 201) {
        setAttendanceData([]);
        setLectureName('');
      }
    } catch {}
  };
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold mb-6'>Mark Attendance</h2>
      <div className='space-y-6'>
        <AttendanceStats />
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            {/* Date Picker */}
            <div className='relative'>
              <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='date'
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className='pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>
            {/* Lecture Name Input */}
            <div className='relative'>
              <Book className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Enter lecture name'
                value={lectureName}
                onChange={(e) => setLectureName(e.target.value)}
                className='pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>
          </div>
          <button
            onClick={handleExport}
            className='flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700'>
            <Download className='w-4 h-4 mr-2' />
            Export Report
          </button>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='search'
              placeholder='Search students...'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className='pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            />
          </div>
        </div>
        <div className='overflow-x-auto bg-white rounded-lg shadow'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  No.
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Student
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Roll No
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {students.students.map((student, index) => {
                const { _id, firstName, lastName, rollNo } = student;
                const isPresent = attendanceData.some(
                  (item) =>
                    item._id === _id.toString() && item.status === 'present'
                );
                const isAbsent = attendanceData.some(
                  (item) =>
                    item._id === _id.toString() && item.status === 'absent'
                );
                return (
                  <tr key={index}>
                    <td className='px-6 py-4 whitespace-nowrap'>{index + 1}</td>
                    <td
                      className='px-6 py-4 whitespace-nowrap'
                      onClick={() => {
                        toggleAttendance(_id.toString(), 'present');
                      }}>
                      <div className='text-sm font-medium text-gray-900'>
                        {firstName} {lastName}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>{rollNo}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() =>
                            toggleAttendance(_id.toString(), 'present')
                          }
                          className={`p-2 rounded-full hover:bg-green-100 ${
                            isPresent ? 'bg-green-100' : ''
                          }`}>
                          <Check className='w-5 h-5 text-green-600' />
                        </button>
                        <button
                          onClick={() =>
                            toggleAttendance(_id.toString(), 'absent')
                          }
                          className={`p-2 rounded-full hover:bg-red-100 ${
                            isAbsent ? 'bg-red-100' : ''
                          }`}>
                          <X className='w-5 h-5 text-red-600' />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div ref={observerRef} className='h-2'></div>
        {isLoading && (
          <div className='text-center py-4'>
            <span>Loading more students...</span>
          </div>
        )}
        <div className='flex justify-end'>
          <button
            type='button'
            onClick={() => submitAttendance()}
            disabled={isLoading}
            className='flex px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700'>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
