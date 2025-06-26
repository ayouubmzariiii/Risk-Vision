import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Card, CardContent } from '../components/ui/Card';
import ProfileDropdown from '../components/profile/ProfileDropdown';
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
  Download,
  X,
  Crown,
  Building,
  Sparkles
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedModal, setSelectedModal] = useState<string | null>(null);

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
      description: "Generate comprehensive project risks using advanced AI that considers your industry, team composition, and project specifics.",
      details: {
        title: "AI-Powered Risk Generation",
        content: "Our advanced AI engine analyzes your project context, industry standards, and team composition to generate comprehensive risk assessments. The system considers factors like project timeline, budget constraints, regulatory requirements, and team expertise to identify potential risks that human analysis might miss. With machine learning algorithms trained on thousands of successful projects, RiskVision provides accurate, contextual risk identification that evolves with your project needs."
      }
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      title: "Team Collaboration",
      description: "Assign risks to team members, track progress, and collaborate in real-time with role-based access control.",
      details: {
        title: "Team Collaboration",
        content: "Enable seamless collaboration across your entire project team with role-based access control, real-time updates, and intelligent task assignment. Team members can update risk statuses, add comments, and share insights while maintaining security and accountability. The platform supports multiple user roles including project managers, risk analysts, and stakeholders, each with appropriate permissions and customized dashboards."
      }
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Interactive Risk Matrix",
      description: "Visualize risks with an interactive matrix showing probability vs impact, with color-coded priority levels.",
      details: {
        title: "Interactive Risk Matrix",
        content: "Visualize your project risks with our dynamic, interactive risk matrix that plots probability against impact. The color-coded system instantly identifies critical, high, medium, and low priority risks. Interactive tooltips provide detailed risk information, while drag-and-drop functionality allows for easy risk reassessment. Export capabilities ensure stakeholders can access visual risk summaries for presentations and reports."
      }
    },
    {
      icon: <FileText className="w-8 h-8 text-amber-600" />,
      title: "Comprehensive Reporting",
      description: "Generate detailed PDF reports and CSV exports for stakeholders and compliance requirements.",
      details: {
        title: "Comprehensive Reporting",
        content: "Generate professional, detailed reports with customizable templates for different stakeholder needs. PDF reports include executive summaries, detailed risk analyses, mitigation strategies, and progress tracking. CSV exports enable data analysis in external tools. Automated report scheduling ensures stakeholders receive regular updates, while compliance templates meet industry standards for risk documentation."
      }
    },
    {
      icon: <Target className="w-8 h-8 text-red-600" />,
      title: "Mitigation Strategies",
      description: "AI-generated mitigation strategies with timelines, responsibilities, and success metrics tailored to your team.",
      details: {
        title: "Mitigation Strategies",
        content: "Receive AI-generated, actionable mitigation strategies tailored to your specific risks and team capabilities. Each strategy includes detailed implementation timelines, assigned responsibilities, resource requirements, and measurable success criteria. The system considers your team's expertise, available resources, and project constraints to provide realistic, achievable mitigation plans that can be immediately implemented."
      }
    },
    {
      icon: <Lock className="w-8 h-8 text-indigo-600" />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with Firebase authentication and role-based access control for sensitive data.",
      details: {
        title: "Secure & Compliant",
        content: "Built with enterprise-grade security featuring end-to-end encryption, secure authentication, and comprehensive audit trails. The platform complies with industry standards including SOC 2, GDPR, and HIPAA requirements. Role-based access control ensures sensitive information is only accessible to authorized personnel, while regular security audits and penetration testing maintain the highest security standards."
      }
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Project",
      description: "Set up your project with team members, industry details, and project specifications.",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      details: {
        title: "Create Your Project",
        content: "Start by setting up your project with comprehensive details including industry type, project scope, timeline, and budget. Add team members with their roles and expertise levels. The system uses this information to provide contextual risk analysis and tailored mitigation strategies. Integration with popular project management tools ensures seamless workflow adoption."
      }
    },
    {
      number: "02",
      title: "Generate AI-Powered Risks",
      description: "Let our AI analyze your project context and generate comprehensive risk assessments.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      details: {
        title: "Generate AI-Powered Risks",
        content: "Our AI engine analyzes your project parameters and generates a comprehensive list of potential risks specific to your industry, project type, and team composition. The system considers historical data, industry best practices, and current market conditions to identify risks across all categories including technical, financial, operational, and regulatory concerns."
      }
    },
    {
      number: "03",
      title: "Develop Mitigation Strategies",
      description: "Get AI-generated mitigation strategies with detailed timelines and team responsibilities.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
      details: {
        title: "Develop Mitigation Strategies",
        content: "For each identified risk, receive detailed mitigation strategies that include step-by-step implementation plans, resource requirements, timeline estimates, and success metrics. Strategies are customized based on your team's capabilities and project constraints, ensuring practical and achievable risk mitigation approaches."
      }
    },
    {
      number: "04",
      title: "Monitor & Report",
      description: "Track progress, update risk statuses, and generate comprehensive reports for stakeholders.",
      image: "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800",
      details: {
        title: "Monitor & Report",
        content: "Continuously monitor risk status with real-time dashboards and automated alerts. Generate comprehensive reports for different stakeholder groups, from executive summaries to detailed technical analyses. Automated reporting ensures consistent communication while customizable templates meet specific organizational requirements."
      }
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

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      description: "Perfect for small teams and individual projects",
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      features: [
        "Up to 3 projects",
        "5 team members",
        "AI risk generation",
        "Basic reporting",
        "Email support",
        "Risk matrix visualization",
        "CSV exports"
      ],
      popular: false,
      buttonText: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$79",
      period: "per month",
      description: "Ideal for growing teams and multiple projects",
      icon: <Crown className="w-6 h-6 text-emerald-600" />,
      features: [
        "Unlimited projects",
        "25 team members",
        "Advanced AI insights",
        "Custom reporting",
        "Priority support",
        "Advanced analytics",
        "PDF report generation",
        "Team collaboration tools",
        "Custom risk categories"
      ],
      popular: true,
      buttonText: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "per month",
      description: "For large organizations with complex needs",
      icon: <Building className="w-6 h-6 text-purple-600" />,
      features: [
        "Unlimited everything",
        "Unlimited team members",
        "Custom AI training",
        "White-label reports",
        "24/7 phone support",
        "API access",
        "SSO integration",
        "Custom integrations",
        "Dedicated account manager",
        "Compliance reporting",
        "Advanced security features"
      ],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

  const openModal = (modalId: string) => {
    setSelectedModal(modalId);
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  const getModalContent = () => {
    if (!selectedModal) return null;

    // Check if it's a feature modal
    const feature = features.find(f => f.title === selectedModal);
    if (feature) {
      return {
        title: feature.details.title,
        content: feature.details.content
      };
    }

    // Check if it's a step modal
    const step = steps.find(s => s.title === selectedModal);
    if (step) {
      return {
        title: step.details.title,
        content: step.details.content
      };
    }

    return null;
  };

  const modalContent = getModalContent();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <button 
            onClick={() => navigate('/landing')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">RiskVision</h1>
          </button>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
            <button 
              onClick={() => navigate('/contact')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </button>
            <button 
              onClick={() => navigate('/faq')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              FAQ
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Dashboard
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
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </>
            )}
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
                  {user ? 'Go to Dashboard' : 'Start Free Trial'}
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
      <section id="features" className="py-20 bg-gray-50">
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
                  <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                  <button
                    onClick={() => openModal(feature.title)}
                    className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    <span>Learn more</span>
                    <ArrowRight size={16} className="ml-2" />
                  </button>
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
                  <button
                    onClick={() => openModal(step.title)}
                    className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    <span>Learn more</span>
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="relative">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-80 object-cover rounded-2xl shadow-xl"
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=${encodeURIComponent(step.title)}`;
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your team. All plans include a 14-day free trial with no credit card required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Sparkles size={14} className="mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="mb-4">{plan.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    </div>
                    <Button
                      variant={plan.popular ? "primary" : "outline"}
                      className="w-full mb-6"
                      onClick={plan.buttonText === "Contact Sales" ? () => navigate('/contact') : handleGetStarted}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Need a custom solution? We offer enterprise packages with custom features and dedicated support.
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate('/contact')}
            >
              Contact Sales Team
            </Button>
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
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md bg-white text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
            >
              <ArrowRight size={20} className="mr-2" />
              {user ? 'Go to Dashboard' : 'Start Your Free Trial'}
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md border-2 border-white text-white hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
            >
              Schedule Demo
            </button>
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
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
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

      {/* Modal for Learn More */}
      {selectedModal && modalContent && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={modalContent.title}
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-lg">
              {modalContent.content}
            </p>
            <div className="flex justify-end pt-4">
              <Button
                variant="primary"
                onClick={handleGetStarted}
                icon={<ArrowRight size={16} />}
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Landing;