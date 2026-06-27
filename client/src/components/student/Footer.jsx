import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-between gap-10 md:gap-32 py-10 border-b border-white/30">
        <div className="flex-1">
          <img src={assets.logo_dark} alt="logo" />
          <p className="mt-6 text-sm text-white/80">
            Lorem Ipsum is simply dummy text of the printing and <br/> typesetting
            industry. Lorem Ipsum has been the<br/> industry's standard dummy text.
          </p>
        </div>

        <div className="flex flex-col md:items-start items-center w-full md:w-fit">
          <h2 className="font-semibold text-white mb-5">Company</h2>
          <ul className="flex flex-col md:items-start items-center gap-2 text-sm text-white/80">
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Privacy policy</a></li>
          </ul>
        </div>

        <div className="hidden md:flex flex-col items-start w-full md:w-fit">
          <h2 className="font-semibold text-white mb-5">Subscribe to our newsletter</h2>
          <p className="text-sm text-white/80">
            The latest news, articles, and resources, sent to<br /> your inbox weekly.
          </p>
          <div className="flex items-center gap-2 pt-4">
            <input type="email" placeholder="Enter your email" className="border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm" />
            <button className="bg-blue-600 text-white w-24 h-9 rounded">Subscribe</button>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm text-white/60">
        Copyright 2024 © Edemy. All Right Reserved.
      </p>
    </footer>
  )
}

export default Footer
