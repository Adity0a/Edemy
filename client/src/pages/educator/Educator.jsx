import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'

const Educator = () => {
  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <div className='flex-1 flex flex-col min-h-screen bg-gray-50/50'>
             <div className='flex-1 md:p-8 p-4'>
                <Outlet />
             </div>
             <Footer />
        </div>
      </div>
    </div>
  )
}

export default Educator
