import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Map, MessageSquare, BarChart3, User, LogOut, Settings, Heart, Menu, X, Brain, Zap, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const { user, userProfile, logout } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home, description: 'Main dashboard' },
    { path: '/predict', label: t('nav.predict'), icon: TrendingUp, description: 'AI Price Prediction' },
    { path: '/heatmap', label: t('nav.heatmap'), icon: Map, description: 'Price Visualization' },
    { path: '/analytics', label: t('nav.analytics'), icon: BarChart3, description: 'Investment Tools' },
    { path: '/dashboard', label: t('nav.dashboard'), icon: Monitor, description: 'Business Intelligence' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white/95 border-b border-gray-200/50 sticky top-0 z-50 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Professional Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* AI-inspired logo with neural network effect */}
              <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="relative">
                  <Brain className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              {/* Floating AI indicator */}
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full border-2 border-white shadow-sm">
                <Zap className="h-1.5 w-1.5 text-white absolute top-0.5 left-0.5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl lg:text-2xl bg-gradient-to-r from-blue-700 via-purple-600 to-emerald-600 bg-clip-text text-transparent group-hover:from-blue-800 group-hover:via-purple-700 group-hover:to-emerald-700 transition-all duration-300">
                EstateAI
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1 hidden lg:block">
                Powered by Intelligence
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 bg-gray-50/50 rounded-full p-1 border border-gray-200/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={`relative flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg' 
                        : 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Desktop User Menu & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Selector */}
            <LanguageSelector variant="ghost" size="sm" />
            
            {user ? (
              <>
                {/* Favorites Quick Access */}
                <Link to="/favorites">
                  <Button variant="ghost" size="sm" className="relative rounded-full hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Heart className="h-4 w-4" />
                    {userProfile?.favoriteHouses?.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                        {userProfile.favoriteHouses.length}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-blue-200 transition-all duration-300">
                      <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {getUserInitials(user.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-white"></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                    <div className="flex flex-col space-y-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getUserInitials(user.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-none truncate">
                            {userProfile?.username ? `@${userProfile.username}` : user.displayName}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                            {user.email}
                          </p>
                          <Badge variant="outline" className="text-xs mt-2 bg-white/50">
                            Premium User
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/profile" className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-blue-50">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{t('nav.profile')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/favorites" className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-red-50">
                        <Heart className="h-4 w-4 text-red-500" />
                        <div className="flex items-center justify-between flex-1">
                          <span className="font-medium">{t('nav.favorites')}</span>
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            {userProfile?.favoriteHouses?.length || 0}
                          </Badge>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer p-2 rounded-md hover:bg-gray-50">
                      <Settings className="mr-3 h-4 w-4 text-gray-600" />
                      <span className="font-medium">Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer p-2 rounded-md hover:bg-red-50 text-red-600">
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="font-medium">{t('nav.signOut')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/signin">
                  <Button variant="ghost" size="sm" className="rounded-full font-medium hover:bg-gray-100">
                    {t('nav.signIn')}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300">
                    {t('nav.signUp')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Language Selector */}
            <LanguageSelector variant="ghost" size="sm" />
            
            {user && (
              <Link to="/favorites">
                <Button variant="ghost" size="sm" className="relative rounded-full">
                  <Heart className="h-4 w-4" />
                  {userProfile?.favoriteHouses?.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {userProfile.favoriteHouses.length}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-lg">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-xl">EstateAI</h2>
                        <p className="text-sm text-white/80">AI-Powered Real Estate</p>
                      </div>
                    </div>
                    
                    {user ? (
                      <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                          <AvatarFallback className="bg-white/20 text-white">
                            {getUserInitials(user.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {userProfile?.username ? `@${userProfile.username}` : user.displayName}
                          </p>
                          <p className="text-xs text-white/70 truncate">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link to="/signin" className="block">
                          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                            {t('nav.signIn')}
                          </Button>
                        </Link>
                        <Link to="/signup" className="block">
                          <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                            {t('nav.signUp')}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 p-6">
                    <div className="space-y-2">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        return (
                          <Link key={item.path} to={item.path}>
                            <Button
                              variant={isActive ? 'default' : 'ghost'}
                              className={`w-full justify-start gap-3 h-12 ${
                                isActive 
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <div className="text-left">
                                <div className="font-medium">{item.label}</div>
                                <div className="text-xs text-muted-foreground">{item.description}</div>
                              </div>
                            </Button>
                          </Link>
                        );
                      })}
                    </div>

                    {user && (
                      <>
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Account</h3>
                          <div className="space-y-2">
                            <Link to="/profile">
                              <Button variant="ghost" className="w-full justify-start gap-3">
                                <User className="h-4 w-4" />
                                {t('nav.profile')}
                              </Button>
                            </Link>
                            <Link to="/favorites">
                              <Button variant="ghost" className="w-full justify-between">
                                <div className="flex items-center gap-3">
                                  <Heart className="h-4 w-4" />
                                  {t('nav.favorites')}
                                </div>
                                <Badge variant="secondary">
                                  {userProfile?.favoriteHouses?.length || 0}
                                </Badge>
                              </Button>
                            </Link>
                            <Button variant="ghost" className="w-full justify-start gap-3">
                              <Settings className="h-4 w-4" />
                              Settings
                            </Button>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <Button 
                            onClick={handleLogout}
                            variant="ghost" 
                            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4" />
                            {t('nav.signOut')}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
