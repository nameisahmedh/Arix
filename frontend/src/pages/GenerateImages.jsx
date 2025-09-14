import {
  Sparkles,
  Image as ImageIcon,
  Palette,
  Camera,
  Wand2,
  Download,
  Heart,
  Brush,
  Zap,
  RefreshCw,
  Globe,
} from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const styleOptions = [
  { id: 'realistic', text: 'Realistic', icon: Camera },
  { id: 'ghibli', text: 'Ghibli', icon: Heart },
  { id: 'anime', text: 'Anime', icon: Sparkles },
  { id: 'cartoon', text: 'Cartoon', icon: Brush },
  { id: 'digital', text: 'Digital Art', icon: Zap },
  { id: 'oil', text: 'Oil Painting', icon: Palette },
];

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

const GenerativeLoader = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
        <div className="relative w-32 h-32">
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-full h-full border-2 border-green-500 rounded-full"
                    style={{ borderColor: `hsl(${i * 90}, 70%, 60%)` }}
                    animate={{
                        scale: [1, 1.2, 1, 1.2, 1],
                        rotate: [0, 180, 360, 180, 0],
                        opacity: [0.8, 0.4, 0.8, 0.4, 0.8],
                    }}
                    transition={{
                        duration: 4,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: i * 0.5,
                    }}
                />
            ))}
            <p className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-600">Creating...</p>
        </div>
    </div>
);


const GenerateImages = () => {
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  // FIX: Destructure sessionClaims to check the user's plan
  const { getToken, sessionClaims } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- FIX: Added Premium User Check ---
    // This checks the 'pla' claim from the user's token on the frontend.
    if (!sessionClaims?.pla?.toLowerCase().includes('premium')) {
      toast.error("This feature is only available for premium subscriptions.");
      return;
    }

    if (!description.trim()) {
        toast.error("Please enter a description for the image.");
        return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
        const styleText = styleOptions.find(s => s.id === selectedStyle)?.text || 'default style';
        const prompt = `Generate an image of ${description}, in the style of ${styleText}.`;
        const token = await getToken();

        const { data } = await axios.post(
            '/api/ai/generate-image',
            { 
              prompt, 
              publish: isPublic
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
            setGeneratedImage({
                url: data.secure_url,
                prompt: description,
                style: selectedStyle,
                isPublished: isPublic
            });
            toast.success("Image generated successfully!");
        } else {
            toast.error(data.message || "Failed to generate image.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
        toast.error(errorMessage);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage?.url) return;
    try {
      const response = await axios.get(generatedImage.url, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const objectUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${generatedImage.prompt.slice(0,20).replace(/\s/g, '_') || 'generated-image'}.png`;
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

  const handleNewImage = () => {
    setGeneratedImage(null);
    setDescription('');
    setIsPublic(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-4 md:p-8 flex-1 overflow-y-auto bg-gray-50">

      {/* Left Column - Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="lg:col-span-2 w-full p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
            <Wand2 className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">AI Image Generator</h1>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <label htmlFor="description" className="text-sm font-semibold text-gray-700">Describe Your Image</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 mt-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition resize-none"
            placeholder="e.g., A cute cat astronaut floating in space"
            rows={4}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">Choose a Style</p>
          <div className="relative grid grid-cols-2 gap-2 p-1 rounded-lg bg-gray-100">
            {styleOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedStyle(option.id)}
                className={`relative flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium z-10 rounded-md transition-colors ${
                  selectedStyle === option.id ? 'text-green-700' : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {selectedStyle === option.id && (
                  <motion.div
                    layoutId="active-style-pill"
                    className="absolute inset-0 bg-white shadow"
                    style={{ borderRadius: 6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <option.icon className="relative w-4 h-4" />
                <span className="relative">{option.text}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6">
            <div className="flex items-center justify-between">
                <label htmlFor="publish-toggle" className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                    <Globe className="w-4 h-4" />
                    Publish to Community
                </label>
                <button
                    type="button"
                    id="publish-toggle"
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        isPublic ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                >
                    <span
                        aria-hidden="true"
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isPublic ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
                Allows others to see your creation in the community gallery.
            </p>
        </motion.div>

        <motion.button
          type="submit"
          disabled={isGenerating || !description.trim()}
          className="mt-8 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-green-400 text-white py-3 rounded-lg text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          variants={itemVariants}
          whileHover={{ scale: 1.02, boxShadow: '0 10px 20px -5px rgba(52, 199, 89, 0.3)' }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isGenerating ? 'loading' : 'ready'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.form>

      {/* Right Column - Output */}
      <motion.div
        className="lg:col-span-3 w-full p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Generated Image</h1>
        </div>

        <div className="flex-grow w-full bg-gray-50 rounded-lg mt-2 flex items-center justify-center p-4 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                <GenerativeLoader />
              </motion.div>
            ) : generatedImage ? (
              <motion.div key="image" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col items-center justify-center">
                <div className="relative flex-grow w-full flex items-center justify-center">
                    <img
                        src={generatedImage.url}
                        alt={generatedImage.prompt}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                </div>
                <div className="flex-shrink-0 w-full mt-4">
                    <div className="text-xs text-gray-500 text-left max-w-sm mx-auto space-y-1">
                        <p><strong>Prompt:</strong> {generatedImage.prompt}</p>
                        <p><strong>Style:</strong> {styleOptions.find(s => s.id === generatedImage.style)?.text}</p>
                        <p><strong>Status:</strong> {generatedImage.isPublished ? 'Public' : 'Private'}</p>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <motion.button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                            <Download className="w-4 h-4" /> Download
                        </motion.button>
                        <motion.button onClick={handleNewImage} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                            <RefreshCw className="w-4 h-4" /> New Image
                        </motion.button>
                    </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
                <Palette className="w-12 h-12 mb-4 text-green-300" />
                <h3 className="font-semibold text-gray-600">Your masterpiece awaits</h3>
                <p className="max-w-xs mx-auto">
                  Describe an image, choose a style, and let the AI bring your vision to life.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default GenerateImages;
