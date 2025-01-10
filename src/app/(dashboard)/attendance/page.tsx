'use client';
import AttendancePDF from '@/components/attendance/AttendancePDF';
import { StudentContext, StudentsData } from '@/context/studentContext';
import UseAxios from '@/hooks/useAxios';
import useDebounce from '@/hooks/useDebounce';
import { AxiosResponse } from 'axios';
import { Book, Calendar, Download, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { use, useEffect, useState } from 'react';
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const Attendance = () => {
  const { students, setStudents } = use(StudentContext);
  const { makeRequest, isLoading } = UseAxios();
  const [lectureName, setLectureName] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceData, setAttendanceData] = useState<
    { id: string; status: 'present' | 'absent' }[]
  >([]);
  const getStudents = async () => {
    try {
      const response = await makeRequest<StudentsData>({
        method: 'GET',
        url: '/students',
        params: {
          search: debouncedSearch,
          page: students.currentPage,
          limit: 100,
          sortBy: 'lastName',
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
  const toggleAttendance = (id: string, status: 'present' | 'absent') => {
    setAttendanceData((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        if (updated[existingIndex].status === status) {
          updated.splice(existingIndex, 1);
        } else {
          updated[existingIndex].status = status;
        }
        return updated;
      } else {
        return [...prev, { id, status }];
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
      <h2 className='text-xl font-semibold mb-6 text-center md:text-left'>
        Attendance
      </h2>
      <div className='space-y-6'>
        <div className='flex justify-between gap-6 md:flex-row flex-col md:items-center'>
          <div className='flex flex-col md:flex-row items-center justify-start gap-6'>
            <div className='relative w-full md:w-auto'>
              <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5' />
              <input
                type='date'
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className='pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>
            <div className='relative w-full md:w-auto'>
              <Book className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5' />
              <input
                type='text'
                placeholder='Enter lecture name'
                value={lectureName}
                onChange={(e) => setLectureName(e.target.value)}
                className='pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>
          </div>
          <div className='flex justify-center md:justify-end h-fit'>
            <PDFDownloadLink
              document={
                <AttendancePDF
                  lectureName={lectureName}
                  selectedDate={selectedDate}
                  students={students.students}
                  attendanceData={attendanceData}
                />
              }
              fileName={`M2 Attendance ${selectedDate}.pdf`}
              className='flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700'>
              <Download className='w-4 h-4 mr-2' />
              Export Report
            </PDFDownloadLink>
          </div>
        </div>
        <div className='flex'>
          <div className='relative w-full'>
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
                {/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  No.
                </th> */}
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Student
                </th>
                {/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Roll No
                </th> */}
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
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
                  const { id, firstName, lastName } = student;
                  const isPresent = attendanceData.some(
                    (item) =>
                      item.id === id.toString() && item.status === 'present'
                  );
                  return (
                    <tr key={index}>
                      {/* <td className='px-6 py-4 whitespace-nowrap'>{index + 1}</td> */}
                      <td
                        className='px-6 py-4 whitespace-nowrap cursor-pointer'
                        onClick={() =>
                          toggleAttendance(
                            id.toString(),
                            isPresent ? 'absent' : 'present'
                          )
                        }>
                        <div className='text-sm font-medium text-gray-900'>
                          {lastName} {firstName}
                        </div>
                      </td>
                      {/* <td className='px-6 py-4 whitespace-nowrap'>{rollNo}</td> */}
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center '>
                          <input
                            type='checkbox'
                            checked={isPresent}
                            onChange={() =>
                              toggleAttendance(
                                id.toString(),
                                isPresent ? 'absent' : 'present'
                              )
                            }
                            className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
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
