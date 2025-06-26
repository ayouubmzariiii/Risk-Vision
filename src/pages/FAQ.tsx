import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import ProfileDropdown from '../components/profile/ProfileDropdown';
import { 
  Shield, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp,
  Search,
  MessageCircle,
  Book,
  Users,
  Lock,
  Zap,
  Settings,
  CreditCard,
  HelpCircle
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Questions', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'getting-started', name: 'Getting Started', icon: <Zap className="w-4 h-4" /> },
    { id: 'features', name: 'Features', icon: <Book className="w-4 h-4" /> },
    { id: 'collaboration', name: 'Team Collaboration', icon: <Users className="w-4 h-4" /> },
    { id: 'security', name: 'Security & Privacy', icon: <Lock className="w-4 h-4" /> },
    { id: 'billing', name: 'Billing & Plans', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'technical', name: 'Technical Support', icon: <Settings className="w-4 h-4" /> }
  ];

  const faqs: FAQItem[] = [
    // Getting Started
    {
      id: '1',
      category: 'getting-started',
      question: 'How do I get started with RiskVision?',
      answer: 'Getting started with RiskVision is simple! Sign up for a free 14-day trial, create your first project by providing basic details like industry and team members, then use our AI-powered risk generation to identify potential risks. Our onboarding wizard will guide you through each step, and you can start managing risks immediately.'
    },
    {
      id: '2',
      category: 'getting-started',
      question: 'Do I need a credit card to start the free trial?',
      answer: 'No, you can start your 14-day free trial without providing a credit card. You\'ll have access to all features during the trial period. You only need to add payment information if you decide to continue with a paid plan after the trial ends.'
    },
    {
      id: '3',
      category: 'getting-started',
      question: 'How long does it take to set up my first project?',
      answer: 'Setting up your first project takes less than 5 minutes. You\'ll need to provide basic project information like name, description, industry type, and team members. Once created, you can immediately start adding risks manually or use our AI-powered risk generation feature.'
    },
    {
      id: '4',
      category: 'getting-started',
      question: 'Can I import existing risk data?',
      answer: 'Yes, you can import existing risk data using our CSV import feature. We support standard risk management formats, and our team can help you with data migration from other tools. Contact our support team for assistance with large-scale data imports.'
    },

    // Features
    {
      id: '5',
      category: 'features',
      question: 'How accurate is the AI-powered risk generation?',
      answer: 'Our AI-powered risk generation has a 95% accuracy rate based on industry standards and historical project data. The AI considers your specific industry, project type, team composition, and other contextual factors to generate relevant risks. You can always review, edit, or add additional risks as needed.'
    },
    {
      id: '6',
      category: 'features',
      question: 'Can I customize risk categories and priorities?',
      answer: 'Yes, RiskVision allows you to customize risk categories, priority levels, and status types to match your organization\'s methodology. You can create custom categories beyond our standard ones (technical, financial, operational, etc.) and define your own priority scales.'
    },
    {
      id: '7',
      category: 'features',
      question: 'What types of reports can I generate?',
      answer: 'RiskVision offers comprehensive reporting including executive summaries, detailed risk analyses, mitigation strategy reports, progress tracking reports, and compliance documentation. You can export reports as PDF or CSV files, and customize templates for different stakeholder needs.'
    },
    {
      id: '8',
      category: 'features',
      question: 'Does RiskVision integrate with other project management tools?',
      answer: 'Yes, we integrate with popular project management tools including Jira, Asana, Trello, and Microsoft Project. We also offer API access for custom integrations. Enterprise customers can request specific integrations with their existing toolchain.'
    },

    // Team Collaboration
    {
      id: '9',
      category: 'collaboration',
      question: 'How many team members can I add to a project?',
      answer: 'The number of team members depends on your plan. Starter plans include up to 5 team members, Professional plans support up to 25 members, and Enterprise plans offer unlimited team members. You can upgrade your plan at any time to add more users.'
    },
    {
      id: '10',
      category: 'collaboration',
      question: 'What are the different user roles available?',
      answer: 'RiskVision offers several user roles: Project Manager (full access), Risk Analyst (can create and edit risks), Team Member (can update assigned risks), and Viewer (read-only access). Each role has specific permissions to ensure appropriate access control.'
    },
    {
      id: '11',
      category: 'collaboration',
      question: 'Can team members receive notifications about risk updates?',
      answer: 'Yes, team members receive email notifications when risks are assigned to them, when risk statuses change, or when comments are added. You can customize notification preferences in your account settings to control which updates you receive.'
    },
    {
      id: '12',
      category: 'collaboration',
      question: 'How do I assign risks to team members?',
      answer: 'You can assign risks to team members when creating or editing a risk. Simply select the team member from the dropdown list. The assigned person will receive a notification and can see their assigned risks in their personal dashboard and the "My Tasks" section.'
    },

    // Security & Privacy
    {
      id: '13',
      category: 'security',
      question: 'How secure is my data in RiskVision?',
      answer: 'RiskVision uses enterprise-grade security with end-to-end encryption, secure authentication, and comprehensive audit trails. We comply with SOC 2, GDPR, and HIPAA requirements. All data is encrypted in transit and at rest, and we conduct regular security audits and penetration testing.'
    },
    {
      id: '14',
      category: 'security',
      question: 'Where is my data stored?',
      answer: 'Your data is stored in secure, geographically distributed data centers using Google Cloud Platform infrastructure. We maintain multiple backups and ensure 99.9% uptime. You can choose your preferred data region for compliance with local data residency requirements.'
    },
    {
      id: '15',
      category: 'security',
      question: 'Can I control who has access to my projects?',
      answer: 'Yes, RiskVision provides granular access control. Project creators can invite specific team members and assign appropriate roles. You can also set project visibility levels and control which team members can view, edit, or manage different aspects of your projects.'
    },
    {
      id: '16',
      category: 'security',
      question: 'Do you offer single sign-on (SSO)?',
      answer: 'Yes, Enterprise plans include SSO integration with popular identity providers like Google Workspace, Microsoft Azure AD, Okta, and SAML-based systems. This allows your team to use their existing corporate credentials to access RiskVision.'
    },

    // Billing & Plans
    {
      id: '17',
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay via bank transfer or purchase orders. All payments are processed securely through Stripe.'
    },
    {
      id: '18',
      category: 'billing',
      question: 'Can I change my plan at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll have immediate access to new features. When downgrading, changes take effect at the next billing cycle, and you\'ll retain access to premium features until then.'
    },
    {
      id: '19',
      category: 'billing',
      question: 'Do you offer annual billing discounts?',
      answer: 'Yes, we offer a 20% discount for annual billing on all plans. You can switch to annual billing from your account settings. Annual subscribers also receive priority support and early access to new features.'
    },
    {
      id: '20',
      category: 'billing',
      question: 'What happens if I cancel my subscription?',
      answer: 'You can cancel your subscription at any time. You\'ll continue to have access to your account until the end of your current billing period. After cancellation, your account will be downgraded to a read-only state, and you can export your data for 30 days before it\'s permanently deleted.'
    },

    // Technical Support
    {
      id: '21',
      category: 'technical',
      question: 'What browsers are supported?',
      answer: 'RiskVision works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience. Mobile browsers are also supported for viewing and basic editing.'
    },
    {
      id: '22',
      category: 'technical',
      question: 'Is there a mobile app available?',
      answer: 'Currently, RiskVision is a web-based application that works well on mobile browsers. We\'re developing dedicated mobile apps for iOS and Android, which will be available in early 2024. You\'ll be notified when they\'re ready for download.'
    },
    {
      id: '23',
      category: 'technical',
      question: 'How do I export my data?',
      answer: 'You can export your data in multiple formats including CSV, PDF, and JSON. Go to your project settings and select "Export Data" to download your risks, mitigation strategies, and reports. Enterprise customers can also use our API for automated data exports.'
    },
    {
      id: '24',
      category: 'technical',
      question: 'What if I encounter a technical issue?',
      answer: 'If you encounter any technical issues, you can contact our support team through the help center, live chat, or email. We provide 24/7 support for all users, with priority support for Professional and Enterprise customers. Most issues are resolved within 4 hours.'
    }
  ];

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about RiskVision. Can't find what you're looking for? 
            <button 
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:text-blue-700 ml-1"
            >
              Contact our support team
            </button>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {category.icon}
                        <span className="ml-2">{category.name}</span>
                        <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          {faqs.filter(faq => category.id === 'all' || faq.category === category.id).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Still need help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Can't find the answer you're looking for? Our support team is here to help.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/contact')}
                    className="w-full"
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            {filteredFAQs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or selecting a different category.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id} className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-lg font-medium text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {expandedItems.includes(faq.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {expandedItems.includes(faq.id) && (
                        <div className="px-6 pb-4">
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Results Summary */}
            {filteredFAQs.length > 0 && (
              <div className="mt-8 text-center text-sm text-gray-500">
                Showing {filteredFAQs.length} of {faqs.length} questions
                {selectedCategory !== 'all' && (
                  <span> in {categories.find(c => c.id === selectedCategory)?.name}</span>
                )}
                {searchTerm && (
                  <span> matching "{searchTerm}"</span>
                )}
              </div>
            )}
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
              Contact Sales
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

export default FAQ;