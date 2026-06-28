import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import { useAuth, useUser } from '@clerk/react'

const StudentEnrolled = () => {

  const { backendUrl } = useContext(AppContext)
  const { getToken } = useAuth()
  const { user } = useUser()
  const [enrolledStudents, setEnrolledStudents] = useState(null)

  const fetchEnrolledStudents = async () => {
    try {
      if (!user) {
        console.warn("StudentEnrolled: User object not available.");
        return;
      }
      const token = await getToken()
      console.log("StudentEnrolled: Fetching enrolled students for educator:", user.id);

      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', {
        headers: {
          Authorization: `Bearer ${token}`,
          userid: user.id
        }
      })

      if (data.success) {
        console.log("StudentEnrolled: Successfully fetched students:", data.enrolledStudents);
        setEnrolledStudents(data.enrolledStudents)
      } else {
        console.error("StudentEnrolled API Error:", data.message)
      }
    } catch (error) {
      console.error("StudentEnrolled Fetch Error:", error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchEnrolledStudents()
    }
  }, [user])

  return enrolledStudents ? (
    <div className='min-h-screen flex flex-col items-start justify-between md:p-8 p-4 pt-8 pb-0'>
      <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
        <table className='md:table-fixed w-full overflow-hidden'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
            <tr>
              <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
              <th className='md:px-4 px-2 py-3 font-semibold'>Student name</th>
              <th className='md:px-4 px-2 py-3 font-semibold'>Course Title</th>
              <th className='px-4 py-3 font-semibold hidden sm:table-cell'>Date</th>
            </tr>
          </thead>
          <tbody className='text-sm text-gray-500'>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>
                <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                  <img src={item.student.imageUrl} alt="" className='w-9 h-9 rounded-full' />
                  <span className='truncate'>{item.student.name}</span>
                </td>
                <td className='md:px-4 px-2 py-3 truncate'>{item.courseTitle}</td>
                <td className='px-4 py-3 hidden sm:table-cell'>{new Date(item.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
}

export default StudentEnrolled
