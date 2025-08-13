import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import ProfileDropdown from '../components/profile/ProfileDropdown';
import { Shield, FileText, Scale, AlertTriangle, ArrowRight } from 'lucide-react';

const Terms: React.FC = () => {
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
              <Scale className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Terms of <span className="text-blue-600">Service</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Please read these terms carefully before using our risk management platform.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg max-w-none">
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-amber-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">Important Notice</h3>
                  <p className="text-amber-800">
                    By accessing and using RiskVision, you agree to be bound by these Terms of Service. 
                    If you do not agree to these terms, please do not use our service.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              These Terms of Service ("Terms") govern your use of the RiskVision platform ("Service") 
              operated by RiskVision ("us", "we", or "our"). By accessing or using our Service, 
              you agree to be bound by these Terms and our Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              RiskVision is a cloud-based risk management platform that provides:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>AI-powered risk assessment and analysis tools</li>
              <li>Project risk tracking and monitoring capabilities</li>
              <li>Team collaboration features for risk management</li>
              <li>Reporting and export functionality</li>
              <li>Integration with third-party tools and services</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Registration</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Creation</h3>
            <p className="text-gray-700 mb-4">
              To use our Service, you must create an account by providing accurate and complete information. 
              You are responsible for maintaining the confidentiality of your account credentials.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Responsibility</h3>
            <p className="text-gray-700 mb-4">
              You are responsible for all activities that occur under your account. 
              You must notify us immediately of any unauthorized use of your account.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Eligibility</h3>
            <p className="text-gray-700 mb-6">
              You must be at least 18 years old to use our Service. 
              By using our Service, you represent that you meet this age requirement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Permitted Uses</h3>
            <p className="text-gray-700 mb-4">
              You may use our Service for legitimate business purposes related to risk management, 
              project planning, and team collaboration.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Uses</h3>
            <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Create fake accounts or impersonate others</li>
              <li>Spam, harass, or abuse other users</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data and Content</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Content</h3>
            <p className="text-gray-700 mb-4">
              You retain ownership of all content you upload to our Service. 
              By uploading content, you grant us a license to use, store, and process 
              your content solely to provide the Service.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Content Responsibility</h3>
            <p className="text-gray-700 mb-4">
              You are solely responsible for the content you upload and share. 
              You warrant that you have the right to upload and share such content.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Backup</h3>
            <p className="text-gray-700 mb-6">
              While we maintain regular backups, you are responsible for maintaining 
              your own backups of important data. We recommend regular exports of your project data.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Subscription and Payment</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Subscription Plans</h3>
            <p className="text-gray-700 mb-4">
              We offer various subscription plans with different features and usage limits. 
              Current pricing and plan details are available on our website.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Terms</h3>
            <p className="text-gray-700 mb-4">
              Subscription fees are billed in advance on a monthly or annual basis. 
              All fees are non-refundable except as required by law.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Auto-Renewal</h3>
            <p className="text-gray-700 mb-4">
              Subscriptions automatically renew unless cancelled before the renewal date. 
              You can cancel your subscription at any time through your account settings.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Price Changes</h3>
            <p className="text-gray-700 mb-6">
              We may change our pricing with 30 days' notice. 
              Price changes will not affect your current billing cycle.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Rights</h3>
            <p className="text-gray-700 mb-4">
              The Service, including its design, functionality, and underlying technology, 
              is owned by RiskVision and protected by intellectual property laws.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">License to Use</h3>
            <p className="text-gray-700 mb-4">
              We grant you a limited, non-exclusive, non-transferable license to use 
              the Service in accordance with these Terms.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Feedback</h3>
            <p className="text-gray-700 mb-6">
              Any feedback, suggestions, or ideas you provide about our Service 
              may be used by us without any obligation to you.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy and Security</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Our collection and use of personal information 
              is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your data, 
              but cannot guarantee absolute security. You use the Service at your own risk.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Service Availability</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Uptime</h3>
            <p className="text-gray-700 mb-4">
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. 
              We may perform maintenance that temporarily affects service availability.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Modifications</h3>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify, suspend, or discontinue any part of the Service 
              with reasonable notice to users.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by law, RiskVision shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages, including 
              but not limited to loss of profits, data, or business opportunities.
            </p>
            <p className="text-gray-700 mb-6">
              Our total liability for any claims arising from or related to the Service 
              shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Indemnification</h2>
            <p className="text-gray-700 mb-6">
              You agree to indemnify and hold harmless RiskVision from any claims, damages, 
              or expenses arising from your use of the Service, violation of these Terms, 
              or infringement of any rights of another party.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Termination by You</h3>
            <p className="text-gray-700 mb-4">
              You may terminate your account at any time by following the account deletion 
              process in your account settings.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Termination by Us</h3>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account immediately if you violate these Terms 
              or engage in conduct that we determine is harmful to our Service or other users.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Effect of Termination</h3>
            <p className="text-gray-700 mb-6">
              Upon termination, your right to use the Service will cease immediately. 
              We may delete your account and data, though we will provide reasonable notice when possible.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These Terms are governed by and construed in accordance with the laws of [Jurisdiction]. 
              Any disputes arising from these Terms will be resolved in the courts of [Jurisdiction].
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              We may update these Terms from time to time. We will notify you of material changes 
              by email or through the Service. Your continued use of the Service after such changes 
              constitutes acceptance of the updated Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@riskvision.com</p>
              <p className="text-gray-700 mb-2"><strong>Address:</strong> RiskVision Legal Team</p>
              <p className="text-gray-700"><strong>Response Time:</strong> We respond to legal inquiries within 5 business days</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Questions About Our Terms?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our legal team is available to clarify any questions about our terms of service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => navigate('/contact')}
              icon={<ArrowRight size={16} />}
            >
              Contact Legal Team
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/privacy')}
            >
              View Privacy Policy
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

export default Terms;