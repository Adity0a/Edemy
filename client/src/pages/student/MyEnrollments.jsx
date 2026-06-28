import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { useAuth, useUser } from '@clerk/react'
import Footer from '../../components/student/Footer'

const MyEnrollments = () => {

  const { backendUrl, navigate } = useContext(AppContext)
  const { getToken } = useAuth()
  const { user } = useUser()
  const [enrolledCourses, setEnrolledCourses] = useState([])

  const fetchUserEnrolledCourses = async () => {
    try {
      if (!user) return;
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', {
        headers: {
          Authorization: `Bearer ${token}`,
          userid: user.id
        }
      })

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse())
      } else {
        console.error(data.message)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserEnrolledCourses()
    }
  }, [user])

  return (
    <>
      <div className='md:px-36 px-8 pt-10'>
        <h1 className='text-2xl font-semibold'>My Enrollments</h1>
        <table className='md:table-fixed w-full overflow-hidden border mt-10'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>Course</th>
              <th className='px-4 py-3 font-semibold truncate'>Duration</th>
              <th className='px-4 py-3 font-semibold truncate'>Completed</th>
              <th className='px-4 py-3 font-semibold truncate'>Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {enrolledCourses.map((course, index) => (
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                  <img src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28' />
                  <div className='flex-1'>
                    <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                    <div className='bg-gray-200 h-1.5 w-full rounded-full relative overflow-hidden'>
                      <div className='absolute left-0 top-0 bg-blue-500 h-full w-[45%]' />
                    </div>
                  </div>
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                  22h 30m
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                  12 / 24
                </td>
                <td className='px-4 py-3 text-right md:text-left'>
                  <button onClick={() => navigate('/player/' + course._id)} className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 text-white max-sm:text-xs rounded'>
                    {false ? 'Completed' : 'On Going'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default MyEnrollments
