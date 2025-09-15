import React, { useState, useRef, useCallback } from "react";
import {
  ImageDown,
  Sparkles,
  Loader2,
  ImageOff,
  UploadCloud,
  RefreshCw,
  X,
  Wand2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20, staggerChildren: 0.1 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ScanLoader = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
        <div className="relative w-24 h-24">
            <ImageOff className="w-full h-full text-gray-300" />
            <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-orange-400/80 shadow-[0_0_10px_theme(colors.orange.400)]"
                animate={{ y: [0, 96, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-600">Analyzing pixels...</p>
    </div>
);

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  // Get the `has` function from the useAuth hook
  const { getToken, has } = useAuth();

  const handleFileChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setProcessedImage(null);
    } else if (file) {
      toast.error("Please select a valid image file.");
    }
  };

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) {
        toast.error("Please select an image first.");
        return;
    }

    setIsProcessing(true);
    try {
        const token = await getToken();
        const formData = new FormData();
        formData.append('image', selectedFile);

        const { data } = await axios.post(
            '/api/ai/remove-image-background',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        setProcessedImage(data.secure_url);
        toast.success("Background removed successfully!");
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to process image");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!processedImage) return;
    try {
        const response = await axios.get(processedImage, { responseType: 'blob' });
        const blob = new Blob([response.data]);
        const objectUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = `background-removed-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(objectUrl);
        toast.success("Image download started!");

    } catch (error) {
        console.error("Image download failed:", error);
        toast.error("Could not download the image.");
    }
  };

  const resetState = useCallback(() => {
    setSelectedFile(null);
    setProcessedImage(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8 flex-1 overflow-y-auto bg-gray-50">
      <motion.div
        className="w-full p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex items-center gap-3 mb-6" variants={itemVariants}>
          <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center">
            <Wand2 className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Auto Background Remover</h1>
        </motion.div>

        <motion.div 
          className={`relative flex-grow flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-orange-400 bg-orange-50/50' : 'border-gray-300 bg-gray-50'}`}
          variants={itemVariants}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <AnimatePresence mode="wait">
            {selectedFile ? (
              <motion.div key="preview" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.8}} className="w-full text-center">
                <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-md" />
                <p className="text-sm text-gray-600 mt-4 font-medium truncate">{selectedFile.name}</p>
                <button onClick={resetState} className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition">
                    <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div key="prompt" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="text-center text-gray-500">
                <UploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="font-semibold">Drag & drop your image here</p>
                <p className="text-sm mt-1">or</p>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 text-sm font-semibold text-orange-600 hover:text-orange-700">
                  Browse Files
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0])} className="hidden" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          onClick={handleRemoveBackground}
          disabled={!selectedFile || isProcessing}
          className="mt-8 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 rounded-lg text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          variants={itemVariants}
          whileHover={{ scale: 1.02, boxShadow: '0 10px 20px -5px rgba(251, 109, 58, 0.3)' }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isProcessing ? 'processing' : 'ready'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isProcessing ? 'Processing...' : 'Remove Background'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <motion.div
        className="w-full p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <ImageDown className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Processed Image</h2>
        </div>
        <div className="flex-grow flex justify-center items-center bg-gray-50 rounded-xl p-4 min-h-[300px]">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div key="loader" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                  <ScanLoader />
              </motion.div>
            ) : processedImage ? (
              <motion.div key="result" initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="w-full text-center">
                <img src={processedImage} alt="Processed" className="max-h-64 mx-auto rounded-lg shadow-md" />
                <div className="flex items-center justify-center gap-4 mt-6">
                    <motion.button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                        <ImageDown className="w-4 h-4" /> Download
                    </motion.button>
                    <motion.button onClick={resetState} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                        <RefreshCw className="w-4 h-4" /> New Image
                    </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="placeholder" initial={{opacity: 0}} animate={{opacity: 1}} className="text-center text-gray-400">
                <ImageOff className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-600">Your processed image will appear here</h3>
                <p className="max-w-xs mx-auto text-sm">Upload an image to get started.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default RemoveBackground;
