import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Map, MessageSquare, BarChart3, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import heroHome1 from '@/assets/hero-home-1.jpg';
import heroHome2 from '@/assets/hero-home-2.jpg';
import heroHome3 from '@/assets/hero-home-3.jpg';
import { useState, useEffect } from 'react';

const Landing = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
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
      description: '95.97% accurate predictions using advanced XGBoost ML model with 25 engineered features',
      link: '/predict',
    },
    {
      icon: Map,
      title: 'Interactive Heatmap',
      description: 'Visualize property prices across regions with color-coded heat maps',
      link: '/heatmap',
    },
    {
      icon: BarChart3,
      title: 'Investment Analytics',
      description: 'ROI calculator, rental income analyzer, and market timing advisor',
      link: '/analytics',
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: '24/7 intelligent chatbot for personalized property recommendations',
      link: '/chatbot',
    },
  ];

  const benefits = [
    '95.97% prediction accuracy',
    '25 engineered features',
    '99.7% predictions within 10%',
    'Advanced location analysis',
    'Comprehensive quality assessment',
    'Market premium calculations',
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
            {/* Professional overlay with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ))}
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            {/* Professional badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <TrendingUp className="h-4 w-4 mr-2 text-emerald-400" />
              <span className="text-sm font-medium">95.97% Prediction Accuracy</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Professional
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent block">
                Real Estate AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-light leading-relaxed">
              Advanced machine learning algorithms deliver institutional-grade property valuations 
              with unparalleled accuracy and market insights.
            </p>
            
            {/* Professional CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link to="/predict">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold">
                  Get Property Valuation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 px-8 py-4 text-lg font-semibold">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Ask AI Assistant
                </Button>
              </Link>
            </div>
            
            {/* Professional stats */}
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
            
            {/* Elegant indicators */}
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
        
        {/* Professional floating card */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <Card className="p-6 bg-white/95 backdrop-blur-md shadow-2xl border-0 w-80">
            <div className="text-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Live Market Insights</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Price/SqFt</span>
                <span className="font-semibold text-emerald-600">$245</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Market Trend</span>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="font-semibold">+5.2%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Properties Sold</span>
                <span className="font-semibold text-gray-900">1,247</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600">
              View Full Report
            </Button>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="h-4 w-4 mr-2" />
              Professional Real Estate Solutions
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Advanced AI-Powered Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Leverage cutting-edge artificial intelligence for comprehensive property analysis, 
              market insights, and investment decision support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.link}>
                  <Card className="group p-8 h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-0 bg-white/80 backdrop-blur-sm relative overflow-hidden">
                    {/* Gradient background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {feature.description}
                      </p>
                      
                      {/* Arrow indicator */}
                      <div className="flex items-center mt-6 text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                        <span className="mr-2">Explore</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <BarChart3 className="h-4 w-4 mr-2" />
                Trusted by Real Estate Professionals
              </div>
              
              <h2 className="text-5xl font-bold mb-6 text-gray-900 leading-tight">
                Why Choose Our
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent block">
                  AI Platform?
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Our institutional-grade AI delivers the accuracy and insights you need 
                for confident real estate decisions, backed by advanced machine learning 
                and comprehensive market data.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-emerald-600 transition-colors duration-200">
                      {benefit}
                    </span>
                  </div>
                ))}
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
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-8 text-center bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
                <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-3">95.97%</div>
                <div className="text-sm font-medium text-emerald-700">Model Accuracy</div>
                <div className="text-xs text-emerald-600 mt-1">Industry Leading</div>
              </Card>
              <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3">99.7%</div>
                <div className="text-sm font-medium text-blue-700">Within 10%</div>
                <div className="text-xs text-blue-600 mt-1">Precision Rate</div>
              </Card>
              <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3">25</div>
                <div className="text-sm font-medium text-purple-700">AI Features</div>
                <div className="text-xs text-purple-600 mt-1">Advanced Analysis</div>
              </Card>
              <Card className="p-8 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
                <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-3">14K+</div>
                <div className="text-sm font-medium text-orange-700">Properties</div>
                <div className="text-xs text-orange-600 mt-1">Database Size</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background pattern */}
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
              <TrendingUp className="h-5 w-5 mr-3 text-emerald-400" />
              <span className="text-lg font-medium">Ready to Transform Your Real Estate Business?</span>
            </div>
            
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              Start Your
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent block">
                AI-Powered Journey
              </span>
            </h2>
            
            <p className="text-xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed">
              Join thousands of real estate professionals who trust our AI platform for accurate 
              property valuations, market insights, and investment analysis.
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center mb-12">
              <Link to="/predict">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-5 text-lg font-semibold">
                  Get Free Valuation
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 px-10 py-5 text-lg font-semibold">
                  <MessageSquare className="mr-3 h-6 w-6" />
                  Talk to AI Assistant
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
                <div className="text-white/70">AI Assistant Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">Instant</div>
                <div className="text-white/70">Property Analysis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">Free</div>
                <div className="text-white/70">Initial Consultation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
