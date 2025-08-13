import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import ProfileDropdown from '../components/profile/ProfileDropdown';
import { Shield, FileText, Eye, Lock, Users, Globe, ArrowRight } from 'lucide-react';

const Privacy: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToTop();
  }, []);

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
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Privacy <span className="text-blue-600">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg max-w-none">
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Summary</h3>
              <p className="text-blue-800">
                We collect minimal data necessary to provide our service, never sell your information, 
                and give you full control over your data. You can delete your account and all associated data at any time.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Information</h3>
            <p className="text-gray-700 mb-4">
              When you create an account, we collect your email address, name, and password. 
              We use Firebase Authentication to securely manage your login credentials.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Project Data</h3>
            <p className="text-gray-700 mb-4">
              We store the project information you provide, including project names, descriptions, 
              risk assessments, team member assignments, and any other data you input into our platform.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
            <p className="text-gray-700 mb-6">
              We collect information about how you use our service, including pages visited, 
              features used, and time spent on the platform to improve our service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>To provide and maintain our risk management service</li>
              <li>To authenticate your account and ensure security</li>
              <li>To generate AI-powered risk assessments and recommendations</li>
              <li>To send you important service updates and notifications</li>
              <li>To improve our platform based on usage patterns</li>
              <li>To provide customer support when requested</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. 
              We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>With team members you explicitly invite to your projects</li>
              <li>With service providers who help us operate our platform (under strict confidentiality agreements)</li>
              <li>When required by law or to protect our rights and safety</li>
              <li>In the event of a business transfer (with prior notice to users)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>All data is encrypted in transit and at rest using AES-256 encryption</li>
              <li>Secure authentication through Firebase with optional two-factor authentication</li>
              <li>Regular security audits and penetration testing</li>
              <li>Role-based access controls to limit data access</li>
              <li>Secure cloud infrastructure with 99.9% uptime guarantee</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Access and Control</h3>
            <p className="text-gray-700 mb-4">
              You have the right to access, update, or delete your personal information at any time 
              through your account settings or by contacting us.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Portability</h3>
            <p className="text-gray-700 mb-4">
              You can export your project data in standard formats (PDF, CSV) at any time.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Deletion</h3>
            <p className="text-gray-700 mb-6">
              You can delete your account and all associated data at any time. 
              This action is permanent and cannot be undone.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use essential cookies to maintain your session and provide core functionality. 
              We also use analytics cookies to understand how our service is used and improve it.
            </p>
            <p className="text-gray-700 mb-6">
              You can control cookie settings through your browser, though disabling essential 
              cookies may affect the functionality of our service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. International Data Transfers</h2>
            <p className="text-gray-700 mb-6">
              Your data may be processed and stored in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your data in accordance 
              with this privacy policy and applicable laws.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 mb-6">
              Our service is not intended for children under 13 years of age. 
              We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-700 mb-6">
              We may update this privacy policy from time to time. We will notify you of any 
              material changes by email or through our service. Your continued use of our service 
              after such changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this privacy policy or our data practices, 
              please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@riskvision.com</p>
              <p className="text-gray-700 mb-2"><strong>Address:</strong> RiskVision Privacy Team</p>
              <p className="text-gray-700"><strong>Response Time:</strong> We respond to privacy inquiries within 48 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Questions About Privacy?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our team is here to answer any questions about how we protect and handle your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => navigate('/contact')}
              icon={<ArrowRight size={16} />}
            >
              Contact Privacy Team
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/security')}
            >
              View Security Practices
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

export default Privacy;