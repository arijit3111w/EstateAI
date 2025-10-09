import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Home, MapPin, Bed, Bath, Star, Calendar, DollarSign } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { usePrediction } from '@/contexts/PredictionContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  predictions?: Property[];
  extractedFeatures?: any;
}

interface Property {
  id: number;
  living_area: number;
  bedrooms: number;
  bathrooms: number;
  grade: number;
  condition: number;
  waterfront: number;
  built_year: number;
  predicted_price: number;
  formatted_price: string;
  market_analysis: any;
  confidence_score: number;
  description?: string;
}

const Chatbot = () => {
  const { prediction, relatedHouses } = usePrediction();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI real estate assistant. I can help you find properties, estimate prices, and provide investment advice. Here are some things you can ask me about:",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Clear messages when new prediction is made
  useEffect(() => {
    if (prediction) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: "Hello! I'm your AI real estate assistant. I can help you find properties, estimate prices, and provide investment advice. Here are some things you can ask me about:",
          timestamp: new Date(),
        },
      ]);
    }
  }, [prediction]);

  // Load prediction context if available
  useEffect(() => {
    if (prediction && relatedHouses && relatedHouses.length > 0) {
      const contextMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I see you have a recent prediction! Your property was valued at ${prediction.formatted_price}. I've also loaded ${relatedHouses.length} similar properties for comparison. Feel free to ask me which property would be the best investment or any other questions about these options!`,
        timestamp: new Date(),
        predictions: relatedHouses.map((house, index) => ({
          id: index + 1,
          living_area: house.living_area,
          bedrooms: house.bedrooms,
          bathrooms: house.bathrooms,
          grade: house.grade,
          condition: house.condition,
          waterfront: 0, // RelatedHouse doesn't have waterfront info
          built_year: house.built_year || 2000,
          predicted_price: house.price,
          formatted_price: `$${house.price.toLocaleString()}`,
          market_analysis: {},
          confidence_score: 95
        }))
      };
      setMessages(prev => {
        // Only add if not already present
        if (!prev.some(msg => msg.predictions)) {
          return [...prev, contextMessage];
        }
        return prev;
      });
    }
  }, [prediction, relatedHouses]);

  const callChatAPI = async (message: string, context: any = {}) => {
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context
        }),
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Prepare context with existing predictions if available
      const context: any = {};
      const lastMessageWithPredictions = messages.find(msg => msg.predictions && msg.predictions.length > 0);
      if (lastMessageWithPredictions) {
        context.predictions = lastMessageWithPredictions.predictions;
      }

      // Call the chat API
      const chatResponse = await callChatAPI(currentInput, context);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: chatResponse.response,
        timestamp: new Date(),
        predictions: chatResponse.predictions,
        extractedFeatures: chatResponse.extracted_features
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    "Estimate price for 3 bedroom, 2 bathroom house around 2000 sqft",
    "Show me waterfront properties with lake views and investment potential", 
    "Compare properties under $600k with good investment ROI"
  ];

  const PropertyCard = ({ property, onSelect }: { property: Property; onSelect: (property: Property) => void }) => (
    <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
      selectedProperty?.id === property.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
    }`} onClick={() => onSelect(property)}>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg text-primary">{property.formatted_price}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={property.confidence_score > 90 ? "default" : "secondary"} className="text-xs">
              {property.confidence_score.toFixed(0)}% confident
            </Badge>
            {property.description && (
              <Badge variant="outline" className="text-xs">
                {property.description}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 bg-muted/50 rounded-md p-2">
            <Bed className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{property.bedrooms}</span>
            <span className="text-muted-foreground text-xs">beds</span>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 rounded-md p-2">
            <Bath className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{property.bathrooms}</span>
            <span className="text-muted-foreground text-xs">baths</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Home className="h-3 w-3" />
            <span>{property.living_area.toLocaleString()} sqft</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span>Grade {property.grade}/13</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Built {property.built_year}</span>
          </div>
          {property.waterfront === 1 && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
              🌊 Waterfront
            </Badge>
          )}
        </div>
        
        {selectedProperty?.id === property.id && (
          <div className="mt-3 p-2 bg-primary/10 rounded-md">
            <p className="text-xs text-primary font-medium text-center">
              ✓ Selected - Click "Ask AI" below for detailed analysis
            </p>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/30">
        <div className="bg-gradient-to-r from-primary via-primary to-blue-600 text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">🤖 AI Property Assistant</h1>
            <p className="text-xl text-primary-foreground/90 mb-2">
              Get instant property valuations, smart recommendations, and expert investment advice
            </p>
            <p className="text-sm text-primary-foreground/75">
              Powered by advanced AI • 95.97% accurate predictions • Real-time market analysis
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-3">
                <Card className="h-[700px] flex flex-col">
                  {/* Chat Header */}
                  <div className="flex justify-between items-center p-4 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">AI Property Assistant</h3>
                      <Badge variant="outline" className="text-xs">
                        {messages.length - 1} messages
                      </Badge>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === 'user' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            {message.role === 'user' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>
                          <div
                            className={`flex-1 rounded-lg p-4 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground ml-12'
                                : 'bg-muted mr-12'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            {message.extractedFeatures && Object.keys(message.extractedFeatures).length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                <Badge variant="outline" className="text-xs">
                                  🏠 Features: {Object.keys(message.extractedFeatures).length} detected
                                </Badge>
                                {message.extractedFeatures.number_of_bedrooms && (
                                  <Badge variant="secondary" className="text-xs">
                                    {message.extractedFeatures.number_of_bedrooms} beds
                                  </Badge>
                                )}
                                {message.extractedFeatures.number_of_bathrooms && (
                                  <Badge variant="secondary" className="text-xs">
                                    {message.extractedFeatures.number_of_bathrooms} baths
                                  </Badge>
                                )}
                                {message.extractedFeatures.budget_range && (
                                  <Badge variant="secondary" className="text-xs">
                                    {message.extractedFeatures.budget_range}
                                  </Badge>
                                )}
                              </div>
                            )}
                            <span className="text-xs opacity-70 mt-2 block">
                              {message.timestamp instanceof Date 
                                ? message.timestamp.toLocaleTimeString() 
                                : new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="bg-muted rounded-lg p-4">
                            <div className="flex gap-1 items-center">
                              <div className="text-sm text-muted-foreground mr-2">AI is thinking</div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>

                  {/* Quick Actions */}
                  <div className="px-6 py-4 border-t bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <span className="text-blue-500 mr-2">💡</span>
                        Popular searches to get you started:
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setInput(action)}
                          className="text-left justify-start h-auto py-3 px-4 text-xs hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                        >
                          <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{action}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Input */}
                  <div className="p-6 border-t bg-white dark:bg-gray-900">
                    <div className="flex gap-3">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="🏠 Tell me what you're looking for... (e.g., '3 bedroom under 600k' or 'waterfront with good views')"
                        className="flex-1 py-3 text-sm border-2 focus:border-blue-400 transition-colors"
                        disabled={isTyping}
                      />
                      <Button 
                        onClick={handleSend} 
                        disabled={!input.trim() || isTyping}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        {isTyping ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      💡 Tip: Be specific about bedrooms, bathrooms, budget, and location for better results
                    </p>
                  </div>
                </Card>
              </div>

              {/* Property Sidebar */}
              <div className="lg:col-span-1">
                <Card className="h-[600px] flex flex-col">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Property Results
                    </h3>
                    {(() => {
                      const latestPredictions = [...messages].reverse().find(msg => msg.predictions && msg.predictions.length > 0)?.predictions;
                      return latestPredictions ? (
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-muted-foreground">
                            {latestPredictions.length} properties found
                          </p>
                          {selectedProperty && (
                            <Badge variant="default" className="text-xs">
                              Property {selectedProperty.id} selected
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-2">
                          Ask for property recommendations to see results here
                        </p>
                      );
                    })()}
                  </div>
                  
                  <ScrollArea className="flex-1 p-4">
                    {(() => {
                      const latestPredictions = [...messages].reverse().find(msg => msg.predictions && msg.predictions.length > 0)?.predictions;
                      
                      if (!latestPredictions || latestPredictions.length === 0) {
                        return (
                          <div className="text-center text-muted-foreground py-12">
                            <Home className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-base font-medium mb-2">No properties yet</p>
                            <p className="text-sm">Try asking:</p>
                            <div className="mt-4 space-y-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-xs"
                                onClick={() => setInput("Show me 3 bedroom houses under $500k")}
                              >
                                "Show me 3 bedroom houses under $500k"
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-xs"
                                onClick={() => setInput("Find waterfront properties")}
                              >
                                "Find waterfront properties"
                              </Button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-3">
                          {latestPredictions.map((property) => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                              onSelect={setSelectedProperty}
                            />
                          ))}
                        </div>
                      );
                    })()}
                  </ScrollArea>
                  
                  {selectedProperty && (
                    <div className="p-4 border-t bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm">Selected Property Details</span>
                        </div>
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <p className="text-lg font-bold text-primary">{selectedProperty.formatted_price}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedProperty.bedrooms} bed • {selectedProperty.bathrooms} bath • {selectedProperty.living_area.toLocaleString()} sqft
                          </p>
                          <div className="flex justify-center items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              Grade {selectedProperty.grade}/13
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {selectedProperty.confidence_score.toFixed(0)}% confidence
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => {
                            setInput(`Tell me more about this ${selectedProperty.formatted_price} property with ${selectedProperty.bedrooms} bedrooms and ${selectedProperty.bathrooms} bathrooms. Is it a good investment? What are the pros and cons?`);
                          }}
                        >
                          Ask AI about this property
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chatbot;
