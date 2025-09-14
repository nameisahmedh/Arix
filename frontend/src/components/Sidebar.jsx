import { Protect, useClerk, useUser } from '@clerk/clerk-react';
import {
  Home,
  FileText,
  Type,
  Image,
  Eraser,
  ScanLine,
  FileBadge2,
  Users,
  LogOut,
} from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: Home },
  { to: '/ai/write-article', label: 'Write Article', Icon: FileText },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Type },
  { to: '/ai/generate-images', label: 'Image Generator', Icon: Image },
  { to: '/ai/remove-background', label: 'Background Remover', Icon: Eraser },
  { to: '/ai/community', label: 'Community', Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`
        w-60 bg-[#FAFAFA] border-r border-gray-200 flex flex-col justify-between
        pt-6 pb-4 max-sm:fixed max-sm:top-16 max-sm:bottom-0 max-sm:z-50
        transform transition-transform duration-500 ease-in-out
        ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}
      `}
    >
      {/* Top Section */}
      <div className='w-full text-center px-4 animate-fade-in'>
        <img
          src={user?.imageUrl}
          alt="User avatar"
          className='w-16 h-16 rounded-full mx-auto mb-2 border border-gray-300 shadow-md transition-transform duration-300 hover:scale-105'
        />
        <h2 className='text-sm font-semibold text-gray-800'>{user?.fullName}</h2>

        <div className='mt-6 space-y-2'>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `group px-4 py-2.5 flex items-center gap-3 rounded-md text-sm font-medium transition-all duration-300 ease-in-out ${
                  isActive
                    ? 'bg-[#FB6D3A] text-white shadow-md'
                    : 'text-gray-700 hover:bg-[#FFF1E9]'
                } hover:scale-[1.03] hover:shadow-sm`
              }
            >
              <Icon className='w-5 h-5 transition-transform duration-300 group-hover:rotate-6' />
              <span className='truncate'>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className='w-full px-4 mt-6 border-t pt-4 flex items-center gap-3 justify-between'>
        <div
          className='flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-[1.02]'
          onClick={openUserProfile}
        >
          <img
            src={user?.imageUrl}
            alt="Profile"
            className='w-10 h-10 rounded-full border border-gray-300'
          />
          <div className='text-left text-sm'>
            <h1 className='font-medium text-gray-800 truncate'>{user?.fullName}</h1>
            <p className='text-xs text-gray-500'>
              <Protect plan='premium' fallback='Free'>Premium</Protect> Plan
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          className='p-2 rounded-full hover:bg-red-50 transition-transform duration-300 hover:scale-110'
          title="Logout"
        >
          <LogOut className='w-5 h-5 text-red-500' />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
