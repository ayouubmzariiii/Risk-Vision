import React from 'react';
import { ProjectProvider } from './context/ProjectContext';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectDashboard from './pages/ProjectDashboard';
import Tasks from './pages/Tasks';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Security from './pages/Security';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Documentation from './pages/Documentation';
import Help from './pages/Help';
import Status from './pages/Status';
import Integrations from './pages/Integrations';
import Cookies from './pages/Cookies';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/about" element={<About />} />
                <Route path="/security" element={<Security />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/help" element={<Help />} />
                <Route path="/status" element={<Status />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Dashboard Routes (Protected) */}
                <Route path="/dashboard" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/dashboard/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
                <Route path="/dashboard/project/:id" element={<PrivateRoute><ProjectDashboard /></PrivateRoute>} />
                <Route path="/dashboard/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              </Routes>
            </main>
            
            <footer className="bg-white shadow-inner mt-auto py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                  <div className="text-center md:text-left">
                    <p className="text-gray-500 text-sm">
                      RiskVision - Intelligent Risk Management © {new Date().getFullYear()}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Created by Ayoub Mzari & Sophia Alami
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 text-sm">Sponsored by</span>
                    <img 
                      src="/black_logo.png" 
                      alt="Sponsor Logo" 
                      className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;