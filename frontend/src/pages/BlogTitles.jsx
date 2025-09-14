import { Lightbulb, PenTool, Wand, ClipboardCopy } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const categories = [
  "General", "Technology", "Business", "Health", "Lifestyle", "Education",
  "Travel", "Food", "Entertainment", "Science", "Finance", "Startups",
  "Gaming", "AI", "Environment", "Fashion", "Sports"
];

// FIX: Moved itemVariants to the top level so it can be accessed by AnimatedTitle
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const AnimatedTitle = ({ text, index }) => {
  const words = text.split(" ");
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.02, delayChildren: 0.04 * i },
    }),
  };
  const child = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 20 },
  };

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      toast.success("Title copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error("Failed to copy.");
    }
    document.body.removeChild(textarea);
  };

  return (
    <motion.li
      className="relative group flex justify-between items-center px-4 py-3 rounded-lg bg-gray-50 border border-gray-200/80 transition-colors duration-200 hover:bg-purple-50/50"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <motion.div className="flex-grow pr-8" variants={container} initial="hidden" animate="visible">
        {words.map((word, i) => (
          <motion.span variants={child} style={{ marginRight: "5px" }} key={i}>
            {word}
          </motion.span>
        ))}
      </motion.div>
      <button
        onClick={handleCopy}
        className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-white hover:bg-purple-100"
        title="Copy title"
      >
        <ClipboardCopy className={`w-4 h-4 ${copied ? 'text-green-500' : 'text-purple-600'}`} />
      </button>
    </motion.li>
  );
};

const BlogTitles = () => {
  const [topic, setTopic] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a keyword.");
      return;
    }

    setIsLoading(true);
    setGeneratedTitles([]);

    try {
      const prompt = `Generate 5 catchy blog titles about "${topic}" in the "${selectedCategory}" category. Each title should be on a new line.`;
      const token = await getToken();

      const { data } = await axios.post(
        '/api/ai/generate-blog-title',
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const titlesArray = data.content.split('\n').filter(title => title.trim() !== '');
        setGeneratedTitles(titlesArray);
        toast.success("Titles generated!");
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20, staggerChildren: 0.1 } },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-4 md:p-8 h-full overflow-y-auto bg-gray-50">
      <motion.form
        onSubmit={handleGenerate}
        className="lg:col-span-2 w-full p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <Wand className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Catchy Blog Title Maker</h2>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <label className="block text-sm font-semibold text-gray-700">What's your keyword?</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full mt-2 p-3 text-sm rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
            placeholder="e.g., Artificial Intelligence"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select a Category</label>
          <div className="relative flex flex-wrap gap-2 p-1 rounded-lg bg-gray-100">
            {categories.slice(0, 7).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`relative flex-1 px-3 py-2 text-sm font-medium z-10 rounded-md transition-colors ${
                  selectedCategory === cat ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {selectedCategory === cat && (
                  <motion.div
                    layoutId="active-category-pill"
                    className="absolute inset-0 bg-white shadow"
                    style={{ borderRadius: 6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative">{cat}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={isLoading}
          className="mt-8 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-lg text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          variants={itemVariants}
          whileHover={{ scale: 1.02, boxShadow: '0 10px 20px -5px rgba(147, 51, 234, 0.3)' }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isLoading ? 'loading' : 'ready'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              {isLoading ? 'Generating Ideas...' : 'Generate Titles'}
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <PenTool className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Generated Titles</h2>
        </div>

        <div className="flex-grow w-full bg-gray-50 rounded-lg p-2 mt-2 overflow-y-auto">
          <ul className="space-y-2 w-fit">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <li key={i} className="p-4 bg-gray-100 rounded-lg animate-pulse" style={{animationDelay: `${i * 0.1}s`}}>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </li>
              ))
            ) : generatedTitles.length > 0 ? (
              generatedTitles.map((title, idx) => (
                <AnimatedTitle key={idx} text={title} index={idx} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
                <Lightbulb className="w-12 h-12 mb-4 text-purple-300" />
                <h3 className="font-semibold text-gray-600">Catchy titles will appear here</h3>
                <p className="max-w-xs mx-auto">
                  Enter a keyword and click "Generate Titles" to get amazing ideas.
                </p>
              </div>
            )}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogTitles;
