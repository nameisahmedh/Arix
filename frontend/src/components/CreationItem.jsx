import React from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, ChevronDown, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreationItem = ({ item, isExpanded, onToggle }) => {
  const [copied, setCopied] = React.useState(false);

  // A more robust copy handler for better browser compatibility
  const handleCopy = (e) => {
    e.stopPropagation();
    if (copied) return;

    const textarea = document.createElement('textarea');
    textarea.value = item.content;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
    document.body.removeChild(textarea);
  };

  // Helper to get the right icon based on creation type
  const TypeIcon = item.type === 'image' ? ImageIcon : FileText;

  return (
    <motion.div
      layout
      onClick={onToggle}
      className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm hover:shadow-md hover:border-orange-300/50 transition-all duration-300 cursor-pointer"
      transition={{ layout: { duration: 0.3, type: 'spring' } }}
    >
      <motion.div layout="position" className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
           <TypeIcon className="w-5 h-5 text-orange-500 flex-shrink-0" />
           <div className="flex-grow overflow-hidden">
              <h2 className="text-sm font-semibold text-gray-800 truncate">
                {item.prompt}
              </h2>
               <p className="text-xs text-gray-500">
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'No date'}
              </p>
           </div>
        </div>
        <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-medium text-orange-700 bg-orange-100 rounded-full hidden sm:block">
                {item.type}
            </span>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5 text-gray-500" />
            </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative"
          >
            {item.type === 'image' ? (
              <img
                src={item.content}
                alt="generated content"
                className="w-full max-w-md rounded-lg shadow-sm"
              />
            ) : (
              <div className="relative pt-2 pb-1 px-1 bg-gray-50/70 rounded-lg">
                <div className="absolute top-2 right-2 z-10">
                  <motion.button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span key="copied" initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:5}} className="flex items-center gap-1.5 text-green-600">
                           <Check className="w-4 h-4" /> Copied
                        </motion.span>
                      ) : (
                         <motion.span key="copy" initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:5}} className="flex items-center gap-1.5">
                           <Copy className="w-4 h-4" /> Copy
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
                <div className="reset-tw">
                  <Markdown>{item.content}</Markdown>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CreationItem;
