import React from 'react';
import { useClerk,useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import Brands from './Brands';
import { useNavigate } from 'react-router-dom'; 

const Hero = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useAuth(); 
  const navigate = useNavigate(); 

  const handleStartCreating = () => {
    if (isSignedIn) {
      navigate('/ai');
    } else {
      openSignIn();
    }
  };
  // Animation container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger animation of children
      },
    },
  };

  // Animation for items fading in from below
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const avatarVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.8 + i * 0.1,
      },
    }),
  };

  

  return (
    <div className='relative flex flex-col justify-center items-center px-4 sm:px-20 xl:px-32 min-h-screen text-gray-900 overflow-hidden'>
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-[url('/gradientBackground.png')] bg-cover bg-no-repeat" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/80 to-white" />

      {/* Floating Background Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-48 h-48 bg-orange-300 opacity-20 rounded-full blur-3xl"
        animate={{
          x: [0, 20, 0, -20, 0],
          y: [0, -20, 0, 20, 0],
          scale: [1, 1.1, 1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-blue-300 opacity-10 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0, 30, 0],
          y: [0, 30, 0, -30, 0],
          scale: [1, 0.9, 1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="relative z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title Section */}
        <motion.h1
          className='text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-tight mx-auto tracking-tighter mt-10'
          variants={itemVariants}
          
        >
          Build intelligent experiences <br /> with a{' '}
          <span className='animated-gradient-text text-[#FB6D3A]'>next-gen AI</span>
        </motion.h1>
        <motion.p
          className='mt-6 max-w-xs sm:max-w-lg xl:max-w-2xl mx-auto text-base sm:text-lg text-gray-600'
          variants={itemVariants}
        >
          Unlock the power of artificial intelligence to automate tasks, generate creative assets, and elevate your productivity — all in one seamless platform.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className='flex flex-wrap justify-center items-center gap-4 mt-8'
          variants={itemVariants}
        >
          <motion.button
            onClick={handleStartCreating}
            className='flex items-center gap-2 bg-[#FB6D3A] text-white font-semibold px-7 py-3 rounded-full shadow-lg cursor-pointer'
            whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Start creating now
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <motion.button
            className='flex items-center gap-2 bg-white text-gray-800 font-semibold px-7 py-3 rounded-full border border-gray-200 shadow-sm'
            whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <PlayCircle className="w-5 h-5 text-gray-500" />
            Watch demo
          </motion.button>
        </motion.div>

        {/* Avatars & Rating */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-12"
          variants={itemVariants}
        >
          <div className="flex -space-x-4">
            {[
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
            ].map((src, idx) => (
              <motion.img
                key={idx}
                src={src}
                alt="avatar"
                className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                custom={idx}
                initial="initial"
                animate="animate"
                variants={avatarVariants}
                whileHover={{ y: -4, scale: 1.1, zIndex: 10 }}
              />
            ))}
          </div>
          <div className="text-left">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#FACC15">
                  <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                </svg>
              ))}
              <p className="text-gray-700 font-bold ml-2">5.0</p>
            </div>
            <p className="text-sm text-gray-500">
              Trusted by <span className="font-semibold text-gray-800">100,000+</span> users
            </p>
          </div>
        </motion.div>
      </motion.div>
      <div className='mt-10'> 
        <Brands/>
      </div>
    </div>
  );
};

export default Hero;
