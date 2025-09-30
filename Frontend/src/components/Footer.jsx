import React from 'react'
import Logo from '../assets/Logo.png'

export const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <img src={Logo} className='mb-5 w-32'/>
            <p className='w-full md:w-2/3 text-gray-600 font-medium gap-1  '>
                WallsTis a next-generation platform designed for traders, investors, and learners who want to experience the dynamics of live stock trading in a risk-free environment. WallsT combines real-time market data, advanced charting tools, and a social trading ecosystem to deliver an immersive and educational experience.           </p>
            </div>
            <div>
                <p className='text-xl font-medium font-bold mb-5'>
                    COMPANY
                </p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Support</li>
                    <li>Privacy Policy</li>

                </ul>
            </div>
             <div>
                    <p className='text-xl font-medium font-bold mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>+91-6262626268</li>
                        <li>WallsT@gmail.com</li>
                    </ul>
                </div>
        </div>
         <div>
                <hr/>
                <p className='py-5 text-sm text-center'>
                    Copyright 2025@ WallsT - All Right Reserved.
                </p>
            </div>

    </div>
  )
}

