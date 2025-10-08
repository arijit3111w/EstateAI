import { Home, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-6 w-6" />
              <span className="font-bold text-xl">EstateAI</span>
            </div>
            <p className="text-primary-foreground/80">
              AI-powered real estate valuation platform providing accurate property predictions.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/predict" className="text-primary-foreground/80 hover:text-primary-foreground">Price Prediction</a></li>
              <li><a href="/heatmap" className="text-primary-foreground/80 hover:text-primary-foreground">Price Heatmap</a></li>
              <li><a href="/analytics" className="text-primary-foreground/80 hover:text-primary-foreground">Analytics</a></li>
              <li><a href="/chatbot" className="text-primary-foreground/80 hover:text-primary-foreground">AI Assistant</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">Documentation</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">API</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">Blog</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>contact@estateai.com</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2025 EstateAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
