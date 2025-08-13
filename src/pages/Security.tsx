import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import ProfileDropdown from '../components/profile/ProfileDropdown';
import { Shield, Lock, Eye, Server, CheckCircle, ArrowRight, FileText, Users, Globe } from 'lucide-react';

const Security: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToTop();
  }, []);

  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-blue-600" />,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit and at rest using industry-standard AES-256 encryption."
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-600" />,
      title: "Firebase Authentication",
      description: "Secure authentication powered by Google Firebase with multi-factor authentication support."
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-600" />,
      title: "Role-Based Access Control",
      description: "Granular permissions ensure users only access data they're authorized to see."
    },
    {
      icon: <Server className="w-8 h-8 text-amber-600" />,
      title: "Secure Infrastructure",
      description: "Hosted on enterprise-grade cloud infrastructure with 99.9% uptime guarantee."
    },
    {
      icon: <FileText className="w-8 h-8 text-red-600" />,
      title: "Audit Trails",
      description: "Comprehensive logging of all user actions and system events for compliance."
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "GDPR Compliant",
      description: "Full compliance with GDPR, CCPA, and other international privacy regulations."
    }
  ];

  const certifications = [
    {
      name: "SOC 2 Type II",
      description: "Independently audited security controls and processes"
    },
    {
      name: "ISO 27001",
      description: "International standard for information security management"
    },
    {
      name: "GDPR Compliant",
      description: "Full compliance with European data protection regulations"
    },
    {
      name: "HIPAA Ready",
      description: "Healthcare-grade security for sensitive project data"
    }
  ];

  const securityPractices = [
    "Regular security audits and penetration testing",
    "24/7 security monitoring and incident response",
    "Employee security training and background checks",
    "Secure development lifecycle (SDLC) practices",
    "Regular security updates and patch management",
    "Data backup and disaster recovery procedures",
    "Vendor security assessments and due diligence",
    "Incident response and breach notification procedures"
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
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Enterprise-Grade <span className="text-blue-600">Security</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your project data is protected by industry-leading security measures, 
            comprehensive compliance standards, and continuous monitoring.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Security Features</h2>
            <p className="text-lg text-gray-600">Comprehensive protection for your sensitive project data</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Certifications & Compliance</h2>
            <p className="text-lg text-gray-600">Meeting the highest industry standards for security and privacy</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-gray-600 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Security Practices</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We implement comprehensive security measures throughout our organization 
                to protect your data and maintain the highest standards of security.
              </p>
              <div className="space-y-3">
                {securityPractices.map((practice, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{practice}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Security by Design</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Zero Trust Architecture</h4>
                    <p className="text-gray-600 text-sm">Never trust, always verify</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-600 text-white p-2 rounded-lg">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Continuous Monitoring</h4>
                    <p className="text-gray-600 text-sm">24/7 threat detection</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 text-white p-2 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Access Controls</h4>
                    <p className="text-gray-600 text-sm">Principle of least privilege</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Security Questions?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our security team is here to answer any questions about our security practices, 
            compliance standards, or data protection measures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => navigate('/contact')}
              icon={<ArrowRight size={16} />}
            >
              Contact Security Team
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/documentation')}
            >
              View Documentation
            </Button>
          </div>
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

export default Security;