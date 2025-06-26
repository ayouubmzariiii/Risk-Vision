import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import ProfileDropdown from '../profile/ProfileDropdown';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center group hover:opacity-90 transition-opacity"
          >
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">RiskVision</h1>
          </button>
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Projects
            </Link>
            <Link 
              to="/dashboard/tasks" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              My Tasks
            </Link>
          </nav>
          <ProfileDropdown />
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;