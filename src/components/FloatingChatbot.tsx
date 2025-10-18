import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FloatingChatbot = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link to="/chatbot">
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Floating Button */}
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border-0 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-emerald-400/20 animate-pulse rounded-full"></div>
            <MessageSquare className="h-6 w-6 text-white relative z-10" />
            
            {/* Active indicator */}
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse">
              <Sparkles className="h-2 w-2 text-white absolute top-0.5 left-0.5" />
            </div>
          </Button>

          {/* Hover Tooltip */}
          <div
            className={`absolute right-16 bottom-2 transition-all duration-300 ${
              isHovered 
                ? 'opacity-100 translate-x-0 pointer-events-auto' 
                : 'opacity-0 translate-x-2 pointer-events-none'
            }`}
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 p-3 min-w-48">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="font-semibold text-sm text-gray-900 dark:text-white">AI Assistant</span>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  Online
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Get instant property recommendations and market insights
              </p>
              
              {/* Arrow pointer */}
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2">
                <div className="w-2 h-2 bg-white dark:bg-slate-800 border-r border-b border-gray-200 dark:border-slate-700 rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Pulsing Ring Animation */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full border border-purple-400 animate-pulse opacity-30"></div>
        </div>
      </Link>
    </div>
  );
};

export default FloatingChatbot;