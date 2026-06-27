import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'

const MyCourses = () => {

  const { allCourses, currency } = useContext(AppContext)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    setCourses(allCourses)
  }, [allCourses])

  return (
    <div className='h-screen flex flex-col items-start justify-between md:p-8 p-4 pt-8 pb-0'>
      <div className='w-full'>
        <h2 className='pb-4 text-lg font-medium'>My Courses</h2>
        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
          <table className='md:table-fixed w-full overflow-hidden'>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold truncate'>All Courses</th>
                <th className='px-4 py-3 font-semibold truncate'>Earnings</th>
                <th className='px-4 py-3 font-semibold truncate'>Students</th>
                <th className='px-4 py-3 font-semibold truncate'>Course Status</th>
              </tr>
            </thead>
            <tbody className='text-sm text-gray-500'>
              {courses.map((course) => (
                <tr key={course._id} className='border-b border-gray-500/20'>
                  <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                    <img src={course.courseThumbnail} alt="Course Thumbnail" className='w-16' />
                    <span className='truncate hidden md:block'>{course.courseTitle}</span>
                  </td>
                  <td className='px-4 py-3'>{currency} { Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100)) }</td>
                  <td className='px-4 py-3'>{course.enrolledStudents.length}</td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center space-x-2'>
                      <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${course.isPublished ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${course.isPublished ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className='w-12'>{course.isPublished ? 'Live' : 'Private'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MyCourses
