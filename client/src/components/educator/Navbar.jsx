import React from 'react'
import { assets } from '../../assets/assets'
import { UserButton } from '@clerk/react'
import { useUser } from '@clerk/react'

const Navbar = () => {
  const { user } = useUser();

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-3 bg-white'>
      <img src={assets.logo} alt="logo" className='w-28 lg:w-32 cursor-pointer' />
      <div className='flex items-center gap-3'>
        <p className='text-gray-700 text-sm md:text-base'>Hi! {user ? user.firstName : 'Richard'}</p>
        <UserButton />
      </div>
    </div>
  )
}

export default Navbar
