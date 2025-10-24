import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Map, MessageSquare, BarChart3, CheckCircle, Zap, Shield, Users, X, Star, Clock, Database, ChevronRight, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import heroHome1 from '@/assets/hero-home-1.jpg';
import heroHome2 from '@/assets/hero-home-2.jpg';
import heroHome3 from '@/assets/hero-home-3.jpg';
import analyticsImage from '@/assets/analytics-bg.jpg';
import { useState, useEffect } from 'react';
import React from 'react';
import NewsAndBlogs from '@/components/NewsAndBlogs';

const Landing = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const slides = [heroHome1, heroHome2, heroHome3];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: 'AI Price Prediction',
      description: 'Advanced XGBoost ML model with 95.97% accuracy',
      link: '/predict',
      modalContent: {
        subtitle: 'Machine Learning-Powered Property Valuation',
        detailedDescription: 'Our cutting-edge XGBoost machine learning model analyzes over 25 property features to deliver institutional-grade price predictions with 95.97% accuracy. Trained on 14,000+ property transactions, our AI considers location, amenities, market trends, and property characteristics.',
        image: heroHome1,
        features: [
          { icon: Star, text: '95.97% prediction accuracy' },
          { icon: Database, text: '25+ property features analyzed' },
          { icon: TrendingUp, text: 'Real-time market trend integration' },
          { icon: Clock, text: 'Instant valuation results' }
        ],
        benefits: [
          'Get accurate property valuations in seconds',
          'Make informed buying and selling decisions',
          'Understand market positioning instantly',
          'Access institutional-grade analytics'
        ]
      }
    },
    {
      icon: Map,
      title: 'Interactive Heatmap',
      description: 'Visualize property prices across regions',
      link: '/heatmap',
      modalContent: {
        subtitle: 'Geographic Property Value Visualization',
        detailedDescription: 'Explore property values across different neighborhoods with our interactive heatmap. Visualize price trends, identify investment hotspots, and understand geographical patterns in the real estate market with color-coded pricing data.',
        image: heroHome2,
        features: [
          { icon: Map, text: 'Interactive geographic visualization' },
          { icon: TrendingUp, text: 'Price trend analysis by region' },
          { icon: Star, text: 'Investment hotspot identification' },
          { icon: Database, text: 'Real-time data updates' }
        ],
        benefits: [
          'Discover undervalued neighborhoods',
          'Track price appreciation trends',
          'Compare regions at a glance',
          'Plan investment strategies geographically'
        ]
      }
    },
    {
      icon: Monitor,
      title: 'Power BI Dashboard',
      description: 'Interactive analytics and market insights',
      link: '/dashboard',
      modalContent: {
        subtitle: 'Professional Market Intelligence Dashboard',
        detailedDescription: 'Access our comprehensive Power BI dashboard featuring real-time market analytics, interactive visualizations, and professional-grade insights. Monitor market trends, analyze property performance, and make data-driven decisions with institutional-level reporting.',
        image: analyticsImage,
        features: [
          { icon: BarChart3, text: 'Interactive Power BI visualizations' },
          { icon: Database, text: 'Real-time market data integration' },
          { icon: TrendingUp, text: 'Advanced trend analysis' },
          { icon: Clock, text: '24/7 live data monitoring' }
        ],
        benefits: [
          'Access professional-grade market analytics',
          'Monitor real-time market performance',
          'Generate comprehensive market reports',
          'Identify investment opportunities instantly'
        ]
      }
    },
    {
      icon: BarChart3,
      title: 'Investment Analytics',
      description: 'ROI calculator and market analysis tools',
      link: '/analytics',
      modalContent: {
        subtitle: 'Comprehensive Investment Intelligence',
        detailedDescription: 'Analyze investment potential with our comprehensive analytics suite. Calculate ROI, assess market trends, compare property performance, and access detailed financial projections to make data-driven investment decisions.',
        image: analyticsImage,
        features: [
          { icon: BarChart3, text: 'ROI and cash flow calculations' },
          { icon: TrendingUp, text: 'Market trend analysis' },
          { icon: Star, text: 'Performance benchmarking' },
          { icon: Database, text: 'Historical data insights' }
        ],
        benefits: [
          'Calculate precise investment returns',
          'Understand market cycles and timing',
          'Compare multiple investment options',
          'Access professional-grade analytics'
        ]
      }
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: '24/7 intelligent property recommendations',
      link: '/chatbot',
      modalContent: {
        subtitle: 'Your Personal Real Estate AI Advisor',
        detailedDescription: 'Chat with our intelligent AI assistant for personalized property recommendations, market insights, and investment advice. Available 24/7, our AI understands your preferences and provides tailored guidance for your real estate journey.',
        image: heroHome3,
        features: [
          { icon: MessageSquare, text: 'Natural language conversations' },
          { icon: Clock, text: '24/7 availability' },
          { icon: Star, text: 'Personalized recommendations' },
          { icon: TrendingUp, text: 'Market insights and advice' }
        ],
        benefits: [
          'Get instant answers to property questions',
          'Receive personalized recommendations',
          'Access expert advice anytime',
          'Learn about market opportunities'
        ]
      }
    },
  ];

  const whyChooseUs = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant property valuations within seconds ',
    },
    {
      icon: Shield,
      title: 'Data Privacy First',
      description: 'Your information is secure with industry-standard encryption and privacy protocols',
    },
    {
      icon: Users,
      title: 'Continuously Improving',
      description: 'Our AI model learns from market trends to provide increasingly accurate predictions',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Carousel */}
      <section className="relative h-[700px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide}
              alt={`Luxury property ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ))}
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <TrendingUp className="h-4 w-4 mr-2 text-emerald-400" />
              <span className="text-sm font-medium">{t('landing.features.accuracy')}: 95.97%</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t('landing.title')}
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent block">
                AI Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-light leading-relaxed">
              {t('landing.description')}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Link to="/predict">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold">
                  {t('landing.getStarted')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 px-8 py-4 text-lg font-semibold">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {t('nav.chatbot')}
                </Button>
              </Link>
            </div>
            
            {/* Key Stats - Only shown once */}
            <div className="grid grid-cols-3 gap-8 py-6 px-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">99.7%</div>
                <div className="text-sm text-white/80">Within 10% Accuracy</div>
              </div>
              <div className="text-center border-l border-r border-white/20">
                <div className="text-2xl font-bold text-blue-400">25</div>
                <div className="text-sm text-white/80">AI Features</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">14K+</div>
                <div className="text-sm text-white/80">Properties Analyzed</div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-12 bg-gradient-to-r from-emerald-400 to-blue-500' 
                      : 'w-6 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100/80 text-emerald-700 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="h-4 w-4 mr-2" />
              Professional Real Estate Solutions
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              AI-Powered Features
            </h2>
            <p className="text-xl text-gray-600/80 max-w-3xl mx-auto leading-relaxed">
              Leverage cutting-edge artificial intelligence for comprehensive property analysis, 
              market insights, and investment decision support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group p-8 h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-0 bg-white/60 backdrop-blur-sm relative overflow-hidden"
                  onClick={() => setSelectedFeature(index)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600/80 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                    <div className="flex items-center mt-6 text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                      <span className="mr-2">Learn More</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          {/* Live Market Insights Card - Repositioned */}
          <div className="mt-16 flex justify-center">
            <Card className="p-8 bg-white/60 backdrop-blur-sm shadow-2xl border-0 w-full max-w-4xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-1">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Market Insights</h3>
                  <p className="text-gray-600">Real-time data from the property market</p>
                </div>
                
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Average Price/SqFt</div>
                    <div className="text-2xl font-bold text-emerald-600">$245</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Market Trend</div>
                    <div className="flex items-center justify-center text-emerald-600">
                      <TrendingUp className="h-5 w-5 mr-1" />
                      <span className="text-2xl font-bold">+5.2%</span>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Properties Listed</div>
                    <div className="text-2xl font-bold text-gray-900">1,247</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src={heroHome2} 
                alt="Modern property" 
                className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h4 className="text-2xl font-bold mb-2">Professional Analysis</h4>
                <p className="text-white/90">Get detailed property insights with our AI</p>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Shield className="h-4 w-4 mr-2" />
                Why Choose Value Home Vision
              </div>
              <h2 className="text-5xl font-bold mb-6 text-gray-900 leading-tight">
                Transform Your
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent block">
                  Real Estate Decisions
                </span>
              </h2>
              <p className="text-xl text-gray-600/80 mb-10 leading-relaxed">
                Our institutional-grade AI delivers the accuracy and insights you need 
                for confident real estate decisions.
              </p>
              <div className="space-y-8 mb-10">
                {whyChooseUs.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-6 group">
                      <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-200">
                          {item.title}
                        </h4>
                        <p className="text-gray-600/80 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/predict">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4">
                    Start Free Analysis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/analytics">
                  <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 px-8 py-4 transition-all duration-300">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsAndBlogs />

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden bg-black/80 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20" />
          <div className="grid grid-cols-6 gap-4 transform rotate-12 scale-150">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="h-32 bg-gradient-to-b from-white/5 to-transparent rounded-lg" />
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <CheckCircle className="h-5 w-5 mr-3 text-emerald-400" />
              <span className="text-lg font-medium">Join 1000+ Real Estate Professionals</span>
            </div>
            
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              Ready to Transform
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent block">
                Your Business?
              </span>
            </h2>
            
            <p className="text-xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed">
              Experience the power of AI-driven real estate insights. Start using our platform today 
              and discover why professionals trust our technology.
            </p>
            
            {/* Email Signup Form */}
            <div className="max-w-md mx-auto mb-12">
              <div className="flex gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/60 border-0 focus:outline-none"
                />
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold whitespace-nowrap">
                  Get Started Free
                </Button>
              </div>
              <p className="text-sm text-white/60 mt-3">Completely free to use </p>
            </div>
            
            {/* Trust indicators - Different content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">100%</div>
                <div className="text-white/70">Satisfaction Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
                <div className="text-white/70">Free Platform</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-white/70">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modal */}
      <Dialog open={selectedFeature !== null} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedFeature !== null && (
            <div className="relative">
              {/* Modal Header with Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={features[selectedFeature].modalContent.image}
                  alt={features[selectedFeature].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Feature Icon */}
                <div className="absolute top-6 left-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center shadow-xl">
                    {React.createElement(features[selectedFeature].icon, { className: "h-8 w-8 text-white" })}
                  </div>
                </div>
                
                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{features[selectedFeature].title}</h2>
                  <p className="text-lg text-white/90">{features[selectedFeature].modalContent.subtitle}</p>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-8">
                {/* Description */}
                <div className="mb-8">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {features[selectedFeature].modalContent.detailedDescription}
                  </p>
                </div>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Key Features */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Star className="h-5 w-5 text-emerald-500 mr-2" />
                      Key Features
                    </h3>
                    <div className="space-y-3">
                      {features[selectedFeature].modalContent.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          {React.createElement(feature.icon, { className: "h-5 w-5 text-emerald-500 flex-shrink-0" })}
                          <span className="text-gray-700">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Benefits */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                      Benefits
                    </h3>
                    <div className="space-y-3">
                      {features[selectedFeature].modalContent.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <Link to={features[selectedFeature].link} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 text-lg font-semibold">
                      Try {features[selectedFeature].title}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-2 border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 py-3 text-lg font-semibold"
                    onClick={() => setSelectedFeature(null)}
                  >
                    Close
                  </Button>
                </div>
                
                {/* Trust Badge */}
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-center gap-2 text-emerald-700">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Trusted by 1000+ Real Estate Professionals</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Landing;
