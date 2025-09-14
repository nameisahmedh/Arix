import { Sparkles, PenLine, Edit, Feather, ClipboardCopy } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from "react-hot-toast";
import Markdown from "react-markdown";

// Set the base URL for axios requests
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const articleLengthOptions = [
  { id: 'short', text: 'Short', words: '500-800 words', value: 800 },
  { id: 'medium', text: 'Medium', words: '800-1200 words', value: 1200 },
  { id: 'long', text: 'Long', words: '1200+ words', value: 1500 },
];

const WriteArticle = () => {
  const [topic, setTopic] = useState('');
  const [selectedLength, setSelectedLength] = useState(articleLengthOptions[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [copyStatus, setCopyStatus] = useState('Copy');
  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a topic.");
      return;
    }

    setIsLoading(true);
    setGeneratedContent('');

    try {
      const lengthOption = articleLengthOptions.find(opt => opt.id === selectedLength);
      const prompt = `Write an article about "${topic}". The article should be ${lengthOption.text.toLowerCase()} in length, around ${lengthOption.words}. Format the response in Markdown.`;
      
      const token = await getToken();

      const { data } = await axios.post('/api/ai/generate-article', 
        { 
          prompt: prompt,
          length: lengthOption.value
        }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        setGeneratedContent(data.content);
        toast.success("Content generated successfully!");
      } else {
        toast.error(data.message || "An unknown error occurred.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to connect to the server.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (!generatedContent) return;
    
    const textarea = document.createElement('textarea');
    textarea.value = generatedContent;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      toast.success("Copied to clipboard!");
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    } catch (err) {
      toast.error("Failed to copy text.");
      setCopyStatus('Failed!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }
    document.body.removeChild(textarea);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20, staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-4 md:p-8 h-full overflow-y-auto bg-gray-50">
      <motion.form
        onSubmit={handleSubmit}
        className="lg:col-span-2 w-full p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center">
            <PenLine className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">AI Content Generator</h1>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <label htmlFor="topic" className="text-sm font-semibold text-gray-700">What do you want to write about?</label>
          <input 
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 mt-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
            placeholder="e.g., The future of artificial intelligence..."
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">Choose Article Length</p>
          <div className="relative flex flex-wrap gap-2 rounded-lg bg-gray-100 p-1">
            {articleLengthOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedLength(option.id)}
                className={`relative flex-1 px-3 py-2 text-sm font-medium z-10 rounded-md transition-colors ${
                  selectedLength === option.id ? 'text-orange-600' : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                {selectedLength === option.id && (
                  <motion.div
                    layoutId="active-length-pill"
                    className="absolute inset-0 bg-white shadow"
                    style={{ borderRadius: 6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative">{option.text}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={isLoading}
          className="mt-8 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 rounded-lg text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          variants={itemVariants}
          whileHover={{ scale: 1.02, boxShadow: '0 10px 20px -5px rgba(251, 109, 58, 0.3)' }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isLoading ? 'loading' : 'ready'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <motion.div animate={{ rotate: isLoading ? 360 : 0 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Sparkles className="w-4 h-4" />
              </motion.div>
              {isLoading ? 'Generating...' : 'Generate Content'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.form>

      <motion.div 
        className="lg:col-span-3 w-full p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm min-h-[500px] flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center">
               <Edit className="w-5 h-5" />
           </div>
            <h1 className="text-xl font-bold text-gray-800">Generated Output</h1>
          </div>
          <AnimatePresence>
            {generatedContent && !isLoading && (
              <motion.button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ClipboardCopy className="w-4 h-4" />
                {copyStatus}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex-grow w-full bg-gray-50 rounded-lg p-4 mt-2 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2 overflow-hidden">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" style={{animationDelay: `${i * 0.15}s`}}></div>
                </div>
              ))}
            </div>
          ) : generatedContent ? (
            // --- THIS IS THE FIX ---
            // Render the Markdown component directly.
            // The 'prose' class from Tailwind will style it, but we add
            // 'reset-tw' to override specific styles if needed.
            <div className="prose prose-sm max-w-none reset-tw">
                <Markdown>{generatedContent}</Markdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <Feather className="w-12 h-12 mb-4 text-orange-300" />
              <h3 className="font-semibold text-gray-600">Your content will appear here</h3>
              <p className="max-w-xs mx-auto">
                Enter a topic and choose a length, then click "Generate Content" to get started.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WriteArticle;
