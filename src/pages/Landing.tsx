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
      <section className="relative h-[600px] overflow-hidden">
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
            <div className="absolute inset-0 gradient-hero" />
          </div>
        ))}
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              AI-Powered Real Estate Valuation
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Get accurate house price predictions using our advanced machine learning model
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/predict">
                <Button size="lg" className="bg-secondary hover:bg-secondary-light text-secondary-foreground">
                  Start Prediction
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/heatmap">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-primary">
                  Explore Heatmap
                </Button>
              </Link>
            </div>
            
            {/* Indicators */}
            <div className="flex gap-2 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide ? 'w-8 bg-secondary' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Innovative Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for intelligent real estate decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.link}>
                  <Card className="p-6 h-full hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Choose EstateAI?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our advanced AI model provides unparalleled accuracy and insights for your real estate decisions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/predict">
                <Button size="lg" className="mt-8 gradient-primary">
                  Try It Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">95.97%</div>
                <div className="text-sm text-muted-foreground">Model Accuracy</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-secondary mb-2">99.7%</div>
                <div className="text-sm text-muted-foreground">Within 10%</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-success mb-2">25</div>
                <div className="text-sm text-muted-foreground">Features</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">14K+</div>
                <div className="text-sm text-muted-foreground">Properties</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Experience the future of real estate valuation with our AI-powered platform
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/predict">
              <Button size="lg" className="bg-secondary hover:bg-secondary-light text-secondary-foreground">
                Start Prediction
              </Button>
            </Link>
            <Link to="/analytics">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-primary">
                View Analytics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
