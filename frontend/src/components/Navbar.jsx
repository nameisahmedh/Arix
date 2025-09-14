import React from 'react';
import logo from '../assets/logo.png'; // Import logo.png directly
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk(); // To open Clerk sign-in modal

  // Animation variants for the main container
  const navbarVariants = {
    hidden: { opacity: 0, y: -25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'circOut',
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for each item
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div
      className='fixed top-0 left-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200/80'
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className='flex justify-between items-center  sm:px-10 md:px-20'>

        {/* Logo */}
        <motion.img
          src={logo}
          alt="Logo"
          className='w-28 sm:w-36 cursor-pointer'
          onClick={() => navigate('/')}
          variants={itemVariants}
          whileHover={{ scale: 1.05, rotate: -4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />

        {/* Auth Buttons */}
        <motion.div variants={itemVariants}>
          {user ? (
            <div className='flex items-center gap-4'>
              <motion.button
                onClick={() => navigate('/ai')}
                className='hidden sm:flex items-center gap-2 rounded-full text-sm font-semibold bg-[#FB6D3A] text-white px-5 py-2 shadow-sm cursor-pointer'
                whileHover={{ scale: 1.05, boxShadow: '0px 5px 15px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Go to App
              </motion.button>
              <div className="transition-transform duration-300 hover:scale-110">
                <UserButton afterSignOutUrl='/' />
              </div>
            </div>
          ) : (
            <motion.button
              onClick={() => openSignIn()}
              className='flex items-center gap-2 rounded-full text-sm font-semibold bg-[#FB6D3A] text-white px-6 py-2.5 cursor-pointer shadow-md'
              whileHover={{ scale: 1.05, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Get started
              <ArrowRight className='w-4 h-4' />
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Navbar;
