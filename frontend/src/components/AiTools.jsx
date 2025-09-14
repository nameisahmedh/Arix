import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";

// Animation variants for the main container to orchestrate children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for individual items (header and cards)
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

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="bg-gray-50/70 py-20 sm:py-24">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center" variants={itemVariants}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Explore Our Powerful AI Toolkit
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-base sm:text-lg leading-relaxed">
            Discover a suite of cutting-edge AI tools designed to simplify tasks,
            enhance productivity, and empower you with intelligent automation.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
          variants={containerVariants}
        >
          {AiToolsData.map((tool, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-2xl bg-white shadow-sm border border-gray-200/80 transition-all duration-300 cursor-pointer group"
              onClick={() => user && navigate(tool.path)}
              variants={itemVariants}
              whileHover={{
                y: -8,
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              }}
            >
              <div
                className="w-14 h-14 p-3 text-white rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(to bottom right, ${tool.bg.from}, ${tool.bg.to})`,
                  boxShadow: `0 4px 14px 0 ${tool.bg.from}55`,
                }}
              >
                <tool.Icon className="w-full h-full" />
              </div>

              <h3 className="mt-6 mb-2 text-lg font-bold text-gray-900">{tool.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {tool.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AiTools;
