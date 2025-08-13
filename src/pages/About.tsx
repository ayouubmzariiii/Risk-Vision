import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import ProfileDropdown from '../components/profile/ProfileDropdown';
import { Shield, Users, Target, Award, ArrowRight, Heart, Code, Lightbulb } from 'lucide-react';

const About: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToTop();
  }, []);

  const teamMembers = [
    {
      name: "Ayoub Mzari",
      role: "Lead Developer & Co-Founder",
      description: "Full-stack developer with expertise in React, TypeScript, and AI integration. Passionate about creating intuitive user experiences.",
      icon: <Code className="w-6 h-6 text-blue-600" />
    },
    {
      name: "Sophia Alami",
      role: "Product Designer & Co-Founder",
      description: "UX/UI designer focused on creating beautiful, accessible interfaces. Expert in user research and design systems.",
      icon: <Lightbulb className="w-6 h-6 text-emerald-600" />
    }
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Innovation",
      description: "We leverage cutting-edge AI technology to solve real-world project management challenges."
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      title: "Collaboration",
      description: "We believe great projects are built by great teams working together seamlessly."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Trust",
      description: "We prioritize security, privacy, and reliability in everything we build."
    },
    {
      icon: <Award className="w-8 h-8 text-amber-600" />,
      title: "Excellence",
      description: "We strive for the highest quality in our product and customer experience."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">RiskVision</h1>
          </button>
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate('/')} className="text-gray-700 hover:text-blue-600 transition-colors">Home</button>
            <button onClick={() => navigate('/contact')} className="text-gray-700 hover:text-blue-600 transition-colors">Contact</button>
            <button onClick={() => navigate('/faq')} className="text-gray-700 hover:text-blue-600 transition-colors">FAQ</button>
            <button onClick={() => navigate('/about')} className="text-gray-700 hover:text-blue-600 transition-colors">About</button>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
                <ProfileDropdown />
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/auth')}>Sign In</Button>
                <Button variant="primary" onClick={() => navigate('/auth')}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">RiskVision</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We're on a mission to revolutionize project risk management through intelligent AI-powered solutions 
            that help teams identify, assess, and mitigate risks before they become problems.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Traditional risk management is often reactive, time-consuming, and relies heavily on manual processes. 
                We believe there's a better way.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                RiskVision combines artificial intelligence with collaborative workflows to help teams proactively 
                identify and manage project risks. Our platform learns from thousands of successful projects to 
                provide contextual, actionable insights that drive better project outcomes.
              </p>
              <div className="flex items-center space-x-2 text-blue-600">
                <Heart className="w-5 h-5" />
                <span className="font-medium">Built with passion for better project outcomes</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
                  <div className="text-gray-600">Projects Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">95%</div>
                  <div className="text-gray-600">Risk Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                  <div className="text-gray-600">Happy Teams</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-lg text-gray-600">The passionate individuals behind RiskVision</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="mb-4 flex justify-center">{member.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Risk Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams already using RiskVision to deliver successful projects.
          </p>
          <Button
            variant="secondary"
            size="lg"
            icon={<ArrowRight size={20} />}
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            className="bg-white text-black hover:bg-gray-50"
          >
            {user ? 'Go to Dashboard' : 'Start Your Free Trial'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <h3 className="ml-2 text-xl font-bold">RiskVision</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Intelligent risk management for modern teams. Powered by AI, built for collaboration.
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Created by</span>
                <span className="text-white text-sm font-medium">Ayoub Mzari & Sophia Alami</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">

                <li><button onClick={() => navigate('/security')} className="hover:text-white transition-colors">Security</button></li>
                <li><button onClick={() => navigate('/integrations')} className="hover:text-white transition-colors">Integrations</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">Blog</button></li>
                <li><button onClick={() => navigate('/careers')} className="hover:text-white transition-colors">Careers</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/documentation')} className="hover:text-white transition-colors">Documentation</button></li>
                <li><button onClick={() => navigate('/help')} className="hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">FAQ</button></li>
                <li><button onClick={() => navigate('/status')} className="hover:text-white transition-colors">Status</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} RiskVision. All rights reserved. Created by Ayoub Mzari & Sophia Alami.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button onClick={() => navigate('/privacy')} className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</button>
              <button onClick={() => navigate('/terms')} className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</button>
              <button onClick={() => navigate('/cookies')} className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;