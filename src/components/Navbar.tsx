import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Map, MessageSquare, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/predict', label: 'Predict', icon: TrendingUp },
    { path: '/heatmap', label: 'Heatmap', icon: Map },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/chatbot', label: 'Assistant', icon: MessageSquare },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              EstateAI
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Button size="sm" className="gradient-luxury">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
