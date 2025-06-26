import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';

const ProfileDropdown: React.FC = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700 mr-2">
          {user.displayName || user.email}
        </span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || ''}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User size={20} className="text-blue-600" />
            )}
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <Settings size={16} className="mr-2" />
            Profile Settings
          </button>
          <button
            onClick={() => {
              logOut();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;