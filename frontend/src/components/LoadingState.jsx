import React from 'react';
import { motion } from 'framer-motion';

export const LoadingState = ({ message }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-4"
    >
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">{message}</p>
    </motion.div>
);