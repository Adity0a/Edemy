import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { useAuth, useUser } from '@clerk/react'

const Dashboard = () => {

  const { currency, backendUrl } = useContext(AppContext)
  const { getToken } = useAuth()
  const { user } = useUser()
  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = async () => {
    try {
      if (!user) {
        console.warn("User object not available yet for Dashboard fetch.");
        return;
      }

      const token = await getToken()
      console.log("Fetching dashboard data for user:", user.id);

      const { data } = await axios.get(backendUrl + '/api/educator/dashboard-data', {
        headers: {
          Authorization: `Bearer ${token}`,
          userid: user.id
        }
      })

      console.log("Dashboard Data API Response:", data);

      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        console.error("Dashboard API Error:", data.message)
      }
    } catch (error) {
      console.error("Fetch Dashboard Error:", error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  if (!dashboardData) return <Loading />

  return (
    <div className='min-h-screen flex flex-col items-start gap-8 md:p-8 p-4 pt-8 pb-0'>
      <div className='flex flex-wrap items-center gap-5'>

        <div className='flex items-center gap-4 bg-white border border-blue-500/20 p-4 rounded-md shadow-sm w-56'>
          <img src={assets.patients_icon} alt="patients_icon" className='w-12' />
          <div>
            <p className='text-2xl font-medium text-gray-800'>{dashboardData.enrolledStudentsData.length}</p>
            <p className='text-xs text-gray-500'>Total Enrolments</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white border border-blue-500/20 p-4 rounded-md shadow-sm w-56'>
          <img src={assets.appointments_icon} alt="appointments_icon" className='w-12' />
          <div>
            <p className='text-2xl font-medium text-gray-800'>{dashboardData.totalCourses}</p>
            <p className='text-xs text-gray-500'>Total Courses</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white border border-blue-500/20 p-4 rounded-md shadow-sm w-56'>
          <img src={assets.earning_icon} alt="earning_icon" className='w-12' />
          <div>
            <p className='text-2xl font-medium text-gray-800'>{currency}{dashboardData.totalEarnings.toFixed(2)}</p>
            <p className='text-xs text-gray-500'>Total Earnings</p>
          </div>
        </div>

      </div>

      <div className='w-full max-w-4xl'>
        <h2 className='text-lg font-medium pb-4'>Latest Enrolments</h2>
        <div className='flex flex-col items-center w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
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
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr key={index} className='border-b border-gray-500/20'>
                  <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>
                  <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                    <img src={item.student.imageUrl} alt="Profile" className='w-9 h-9 rounded-full' />
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
    </div>
  )
}

export default Dashboard
