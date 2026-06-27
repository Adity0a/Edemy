import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-course', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  return (
    <div className='md:w-64 w-16 border-r border-gray-200 min-h-screen bg-white flex flex-col pt-10'>
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === '/educator'}
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 md:px-8 px-5 border-r-[4px] transition-all duration-200 ${
              isActive
                ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:bg-gray-50'
            }`
          }
        >
          <img src={item.icon} alt={item.name} className='w-6 h-6' />
          <p className='hidden md:block font-medium'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
