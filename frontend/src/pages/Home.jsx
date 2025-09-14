import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AiTools from '../components/AiTools';
import Testimonials from '../components/Testimonials';
import Plans from '../components/Plans';
import Footer from '../components/Footer';
import { motion, useInView } from 'framer-motion';


// A more versatile wrapper component for different scroll-triggered animations
const ScrollAnimationWrapper = ({ children, animationType = "fadeInUp" }) => {
  const ref = useRef(null);
  // useInView hook detects when the element is in the viewport
  const isInView = useInView(ref, { 
    once: true, // The animation will only trigger once
    margin: "-100px 0px" // Trigger animation a bit before it's fully in view
  });

  // Define different animation variants
  const animationVariants = {
    fadeInUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    },
    fadeInFromLeft: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    },
    zoomIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
    },
    fade: {
        hidden: { opacity: 0, scale: 0.98 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animationVariants[animationType]}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  return (
    <div className='bg-white font-sans'>
      <Navbar/>
      {/* The Hero component is visible on load, so it doesn't need a scroll animation */}
      <Hero/>
      
      {/* Each section now has a distinct animation type */}
      <ScrollAnimationWrapper animationType="fadeInUp">
        <AiTools/>
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animationType="zoomIn">
        <Testimonials/>
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animationType="fadeInFromLeft">
        <Plans/>
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animationType="fade">
        <Footer/>
      </ScrollAnimationWrapper>
    </div>
  );
};

export default Home;
