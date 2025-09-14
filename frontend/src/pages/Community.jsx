import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { Heart, ImageOff } from 'lucide-react';
// Make sure this import path is correct for your project structure
import { dummyPublishedCreationData } from '../assets/assets';

const CreationSkeleton = () => (
  <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
);

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const handleLike = (creationId) => {
    console.log(`Toggling like for creation ${creationId} by user ${user?.id}`);
    setCreations(prevCreations => 
      prevCreations.map(creation => {
        if (creation.id === creationId) {
          const isLiked = creation.likes.includes(user.id);
          const newLikes = isLiked 
            ? creation.likes.filter(id => id !== user.id) 
            : [...creation.likes, user.id];
          return { ...creation, likes: newLikes };
        }
        return creation;
      })
    );
  };

  useEffect(() => {
    setLoading(true);
    // Simulate an API call
    setTimeout(() => {
      // Use the data you imported
      setCreations(dummyPublishedCreationData);
      setLoading(false);
    }, 1000);
  }, []);

  // Use user?.id to prevent errors if user is not yet loaded
  const currentUserId = user?.id;

  return (
    <div className='flex-1 h-full flex flex-col gap-6 p-4 md:p-6 bg-gray-50'>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Community Gallery</h1>
        <p className="text-sm text-gray-500 mt-1">Explore creations from our talented community.</p>
      </div>

      <div className='flex-1 w-full rounded-xl overflow-y-auto pr-2'>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => <CreationSkeleton key={index} />)}
          </div>
        ) : creations.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {creations.map((creation) => {
              const isLiked = currentUserId && creation.likes.includes(currentUserId);
              return (
                <div key={creation.id} className='relative group aspect-square overflow-hidden rounded-lg shadow-sm'>
                  {/* The `src` attribute now receives the imported image path */}
                  <img 
                    src={creation.content} 
                    alt={creation.prompt} 
                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 flex flex-col justify-between p-3 text-white'>
                    <p className='text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      {creation.prompt}
                    </p>
                    <div className="flex justify-between items-end w-full">
                      <div className="flex items-center gap-2">
                        <img src={creation.author.avatarUrl} alt={creation.author.name} className="w-7 h-7 rounded-full border-2 border-white/50" />
                        <span className="text-xs font-semibold">{creation.author.name}</span>
                      </div>
                      <div 
                        className='flex gap-1.5 items-center bg-black/20 backdrop-blur-sm p-1.5 rounded-full cursor-pointer'
                        onClick={() => currentUserId && handleLike(creation.id)}
                      >
                        <span className="text-xs font-medium">{creation.likes.length}</span>
                        <Heart className={`w-5 h-5 transition-all hover:scale-110 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}/>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <ImageOff size={48} className="mb-4" />
            <h3 className="text-xl font-semibold">No Creations Found</h3>
            <p className="mt-1">Could not load any creations. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;