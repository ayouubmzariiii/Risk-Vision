import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import ProfileDropdown from '../components/profile/ProfileDropdown';
import { 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Users,
  Headphones,
  Globe,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      title: "Email Support",
      description: "Get help from our support team",
      contact: "support@riskvision.com",
      action: "Send Email",
      available: "24/7 response within 4 hours"
    },
    {
      icon: <Phone className="w-6 h-6 text-emerald-600" />,
      title: "Phone Support",
      description: "Speak directly with our experts",
      contact: "+1 (555) 123-4567",
      action: "Call Now",
      available: "Mon-Fri, 9AM-6PM EST"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
      title: "Live Chat",
      description: "Instant help when you need it",
      contact: "Available on our platform",
      action: "Start Chat",
      available: "Mon-Fri, 9AM-6PM EST"
    },
    {
      icon: <Users className="w-6 h-6 text-amber-600" />,
      title: "Sales Team",
      description: "Discuss enterprise solutions",
      contact: "sales@riskvision.com",
      action: "Contact Sales",
      available: "Mon-Fri, 9AM-6PM EST"
    }
  ];

  const offices = [
    {
      city: "San Francisco",
      address: "123 Innovation Drive, Suite 400",
      zipCode: "San Francisco, CA 94105",
      phone: "+1 (555) 123-4567",
      isHeadquarters: true
    },
    {
      city: "New York",
      address: "456 Business Plaza, Floor 15",
      zipCode: "New York, NY 10001",
      phone: "+1 (555) 987-6543",
      isHeadquarters: false
    },
    {
      city: "London",
      address: "789 Tech Square, Level 8",
      zipCode: "London, UK EC2A 4DP",
      phone: "+44 20 7123 4567",
      isHeadquarters: false
    }
  ];

  const faqs = [
    {
      question: "How quickly can I get started with RiskVision?",
      answer: "You can start using RiskVision immediately after signing up. Our onboarding process takes less than 5 minutes, and you'll have access to all features during your 14-day free trial."
    },
    {
      question: "Do you offer training and support?",
      answer: "Yes! We provide comprehensive onboarding, training materials, video tutorials, and 24/7 customer support. Enterprise customers also get dedicated account managers."
    },
    {
      question: "Can I integrate RiskVision with my existing tools?",
      answer: "RiskVision integrates with popular project management tools, and we offer API access for custom integrations. Contact our sales team to discuss specific integration needs."
    },
    {
      question: "Is my data secure with RiskVision?",
      answer: "Absolutely. We use enterprise-grade security with end-to-end encryption, SOC 2 compliance, and regular security audits. Your data is stored securely and never shared with third parties."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate('/')}
              className="mr-4"
            >
              Back
            </Button>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">RiskVision</h1>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="primary"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
                <ProfileDropdown />
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about RiskVision? We're here to help. Reach out to our team 
            and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Enter your company name"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Inquiry Type
                        </label>
                        <select
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="general">General Inquiry</option>
                          <option value="sales">Sales</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="media">Media & Press</option>
                        </select>
                      </div>
                    </div>

                    <Input
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter the subject of your inquiry"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Tell us more about your inquiry..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      icon={<Send size={16} />}
                      isLoading={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-900">Contact Methods</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{method.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                        <p className="text-sm font-medium text-gray-900 mb-1">{method.contact}</p>
                        <p className="text-xs text-gray-500">{method.available}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Business Hours</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <Headphones className="w-4 h-4 inline mr-1" />
                      Emergency support available 24/7 for Enterprise customers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-900">Quick Links</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                    <Globe className="w-4 h-4 mr-2" />
                    Help Center
                  </a>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                    <Globe className="w-4 h-4 mr-2" />
                    Documentation
                  </a>
                  <button 
                    onClick={() => navigate('/faq')}
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    FAQ
                  </button>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                    <Globe className="w-4 h-4 mr-2" />
                    System Status
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Office Locations */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Offices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">{office.city}</h3>
                    {office.isHeadquarters && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        HQ
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>{office.address}</p>
                    <p>{office.zipCode}</p>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {office.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for?
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate('/faq')}
            >
              View All FAQs
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams using RiskVision to manage project risks effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md bg-white text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md border-2 border-white text-white hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
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
                <span className="text-gray-400 text-sm">Sponsored by</span>
                <img 
                  src="/black_logo.png" 
                  alt="Sponsor Logo" 
                  className="h-6 w-auto opacity-70"
                />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/#features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => navigate('/#pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">FAQ</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} RiskVision. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;