import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { 
  Shield, 
  Brain, 
  Users, 
  FileText, 
  BarChart3, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  Target,
  TrendingUp,
  Lock,
  Globe,
  Download
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Risk Generation",
      description: "Generate comprehensive project risks using advanced AI that considers your industry, team composition, and project specifics."
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      title: "Team Collaboration",
      description: "Assign risks to team members, track progress, and collaborate in real-time with role-based access control."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Interactive Risk Matrix",
      description: "Visualize risks with an interactive matrix showing probability vs impact, with color-coded priority levels."
    },
    {
      icon: <FileText className="w-8 h-8 text-amber-600" />,
      title: "Comprehensive Reporting",
      description: "Generate detailed PDF reports and CSV exports for stakeholders and compliance requirements."
    },
    {
      icon: <Target className="w-8 h-8 text-red-600" />,
      title: "Mitigation Strategies",
      description: "AI-generated mitigation strategies with timelines, responsibilities, and success metrics tailored to your team."
    },
    {
      icon: <Lock className="w-8 h-8 text-indigo-600" />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with Firebase authentication and role-based access control for sensitive data."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Project",
      description: "Set up your project with team members, industry details, and project specifications.",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      number: "02",
      title: "Generate AI-Powered Risks",
      description: "Let our AI analyze your project context and generate comprehensive risk assessments.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      number: "03",
      title: "Develop Mitigation Strategies",
      description: "Get AI-generated mitigation strategies with detailed timelines and team responsibilities.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      number: "04",
      title: "Monitor & Report",
      description: "Track progress, update risk statuses, and generate comprehensive reports for stakeholders.",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Project Manager",
      company: "TechCorp",
      content: "RiskVision transformed how we handle project risks. The AI-generated insights are incredibly accurate and save us hours of planning.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Risk Analyst",
      company: "FinanceFlow",
      content: "The collaborative features and detailed reporting make it easy to keep stakeholders informed and engaged throughout the project lifecycle.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Operations Director",
      company: "BuildRight",
      content: "Finally, a risk management tool that understands our industry. The mitigation strategies are practical and actionable.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">RiskVision</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  AI-Powered Risk Management
                </span>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Intelligent Risk Management for
                <span className="text-blue-600"> Modern Teams</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your project risk management with AI-powered insights, collaborative workflows, 
                and comprehensive reporting. Identify, assess, and mitigate risks before they impact your success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={20} />}
                  onClick={handleGetStarted}
                  className="text-lg px-8 py-4"
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Watch Demo
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Risk Management Dashboard"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900">Project Risk Dashboard</h3>
                  <p className="text-gray-600 text-sm mt-1">Real-time risk monitoring and analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Risk Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools and AI-powered insights to identify, assess, and mitigate project risks effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How RiskVision Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our intuitive workflow designed for modern project teams.
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-600 text-white text-lg font-bold w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      {step.number}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Learn more</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="relative">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-80 object-cover rounded-2xl shadow-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Risk Identification Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">60%</div>
              <div className="text-blue-100">Faster Risk Assessment</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Projects Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Project Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about RiskVision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              icon={<ArrowRight size={20} />}
              onClick={handleGetStarted}
              className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-50"
            >
              Start Your Free Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-blue-100 text-sm mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
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
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
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
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
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

export default Landing;