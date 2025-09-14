import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SignIn, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion'; // Added for animations

import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png';

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className='flex flex-col h-screen bg-[#F4F7FB]'>

      {/* UPDATED: Navbar is now fixed to the top */}
      <nav className='fixed top-0 left-0 w-full h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white z-50'>
        {/* FIXED: Changed <img> to motion.img to enable animations */}
        <motion.img
          src={logo}
          alt="Arix.ai Logo"
          className='h-16 cursor-pointer' // Corrected height to a valid Tailwind class
          whileHover={{ scale: 1.05, rotate: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={() => navigate('/')}
        />
        {
          sidebar
            ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden cursor-pointer' />
            : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden cursor-pointer' />
        }
      </nav>

      {/* UPDATED: Added top margin (mt-16) to offset the fixed navbar height */}
      <div className='flex flex-1 overflow-hidden mt-16'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <main className='flex-1 overflow-y-auto p-4 sm:p-6'>
          <Outlet />
        </main>
      </div>
      
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen bg-gray-50'>
      <SignIn />
    </div>
  );
};

export default Layout;