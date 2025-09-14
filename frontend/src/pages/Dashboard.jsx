// ✅ Dashboard.jsx
import React, { useEffect, useState } from 'react';
// Remove dummy data import
// import { dummyCreationData } from '../assets/assets';
import { Sparkles, Gem, BookOpen, Search } from 'lucide-react';
import { Protect, useAuth } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

// Set the base URL for axios requests
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCreations: 0,
    wordsGenerated: 0
  });
  const { getToken } = useAuth();

  useEffect(() => {
    // Set the current date in a more detailed format with day of week
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
    
    // Fetch user creations from API
    fetchUserCreations();
  }, []);

  const fetchUserCreations = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setCreations(data.creations);
        
        // Calculate stats
        const wordCount = data.creations
          .filter(item => item.type === 'article')
          .reduce((total, item) => {
            // Rough estimate of words by counting spaces and adding 1
            const words = item.content.split(' ').length;
            return total + words;
          }, 0);
          
        setStats({
          totalCreations: data.creations.length,
          wordsGenerated: wordCount
        });
      } else {
        toast.error(data.message || 'Failed to load your creations');
      }
    } catch (error) {
      console.error('Error fetching creations:', error);
      toast.error('Failed to load your creations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCreations = creations.filter(item =>
    item.prompt.toLowerCase().includes(search.toLowerCase())
  );

  const cardHover = {
    hover: {
      scale: 1.04,
      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  };
  
  const staggeredAnimation = {
    initial: { opacity: 0, y: 30 },
    animate: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 bg-gray-50">
      
      {/* Header */}
      <motion.div 
  className="mb-8"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
  <p className="text-md text-gray-500 mt-1">{currentDate}</p>
</motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100"
          custom={1}
          initial="initial"
          animate="animate"
          variants={{ ...staggeredAnimation, ...cardHover }}
          whileHover="hover"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Creations</p>
              <h2 className="text-2xl font-bold text-gray-900">{stats.totalCreations}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-blue-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100"
          custom={2}
          initial="initial"
          animate="animate"
          variants={{ ...staggeredAnimation, ...cardHover }}
          whileHover="hover"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Plan</p>
              <h2 className="text-2xl font-bold text-gray-900">
                <Protect plan="premium" fallback="Free">Premium</Protect>
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Gem className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100"
          custom={3}
          initial="initial"
          animate="animate"
          variants={{ ...staggeredAnimation, ...cardHover }}
          whileHover="hover"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Words Generated</p>
              <h2 className="text-2xl font-bold text-gray-900">{stats.wordsGenerated.toLocaleString()}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-green-500 to-green-400 text-white flex items-center justify-center shadow-lg shadow-green-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Creations */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <p className="text-xl font-bold text-gray-800">Recent Creations</p>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by prompt..."
              className="border border-gray-200 rounded-lg px-3 py-2 pl-10 text-sm outline-none w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
        </div>

        <div className="bg-white p-2 sm:p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-lg font-medium text-gray-600">Loading your creations...</p>
                </motion.div>
              ) : filteredCreations.length > 0 ? (
                filteredCreations.map((item) => (
                  <motion.div
                    key={item._id} // MongoDB uses _id instead of id
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <CreationItem
                      item={item}
                      isExpanded={expandedId === item._id}
                      onToggle={() =>
                        setExpandedId(expandedId === item._id ? null : item._id)
                      }
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-lg font-medium text-gray-600">No Creations Found</p>
                  <p className="text-sm text-gray-400 mt-1">Try a different search term or create something new!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;