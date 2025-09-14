import React from "react";
import { PricingTable } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Animation variants for the main container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Animation variants for child items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const Plans = () => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-gray-50/70 py-20 sm:py-24 overflow-hidden">
      {/* Decorative Background Orbs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-orange-200 opacity-20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-3xl animate-pulse" />

      <motion.div
        className="relative max-w-4xl mx-auto px-4 z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center" variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full">
            <Sparkles className="w-4 h-4" />
            Unlock Your Potential
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Choose the Plan That's Right for You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-base sm:text-lg leading-relaxed">
            Start free with our essential tools, or upgrade to Premium to unlock
            advanced features and take your creativity to the next level.
          </p>
        </motion.div>

        <motion.div
          className="mt-14"
          variants={itemVariants}
          // The key ensures the component re-renders if Clerk's theme changes, which can be useful.
          key="pricing-table"
        >
          <div className="p-2 bg-white rounded-2xl shadow-xl border border-gray-200/80">
             <PricingTable />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Plans;
