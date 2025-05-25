
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your UbuntuExpress assistant. I can help you find the best prices, compare products, and answer questions about suppliers. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const message = userMessage.toLowerCase();
    
    // Simple rule-based responses for demo purposes
    if (message.includes('price') && message.includes('coca-cola')) {
      return "I found Coca-Cola 24-pack prices for you:\n• Makro: R189.99 (Best price!)\n• Checkers: R194.99\n• Shoprite: R199.99\n• Pick n Pay: R204.99\n\nWould you like me to show you more details or help you find other products?";
    }
    
    if (message.includes('panado') || message.includes('medicine')) {
      return "For Panado 500mg 20 Tablets:\n• Dis-Chem: R31.99 (Lowest price)\n• Clicks: R32.99\n• MediRite: R33.99\n\nAll are currently in stock. Dis-Chem offers free delivery over R500. Need help with anything else?";
    }
    
    if (message.includes('tv') || message.includes('samsung')) {
      return "Samsung 43\" Smart TV prices:\n• Makro: R5,499.99 (20% off!)\n• Game: R5,799.99\n• Incredible Connection: R5,999.99\n\nMakro has the best deal right now. Would you like me to check availability or delivery options?";
    }
    
    if (message.includes('supplier') || message.includes('store')) {
      return "We compare prices from major SA retailers:\n• Shoprite & Checkers\n• Pick n Pay & SPAR\n• Makro & Game\n• Clicks & Dis-Chem\n• And many more!\n\nWhich specific supplier or product are you interested in?";
    }
    
    if (message.includes('delivery') || message.includes('shipping')) {
      return "Delivery options vary by supplier:\n• Makro: Free over R1000\n• Clicks: Free over R500\n• Shoprite: R60 standard\n• Pick n Pay: R75 standard\n\nMost suppliers offer same-day delivery in major cities. Which supplier's delivery info do you need?";
    }
    
    if (message.includes('help') || message.includes('how')) {
      return "I can help you with:\n• Finding best prices for products\n• Comparing suppliers\n• Checking stock availability\n• Delivery information\n• Product recommendations\n\nJust ask me about any product or supplier!";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to UbuntuExpress. I'm here to help you find the best prices and deals. What product are you looking for today?";
    }
    
    // Default response
    return "I'd be happy to help you with that! I can assist with price comparisons, product searches, supplier information, and delivery details. Could you be more specific about what you're looking for? For example, you can ask about specific products like 'What's the best price for Coca-Cola?' or 'Where can I find the cheapest TV?'";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await generateBotResponse(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating bot response:', error);
      toast({
        title: "Error",
        description: "Sorry, I'm having trouble responding right now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <div>
                <h3 className="font-semibold">UbuntuExpress Assistant</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start">
                    {message.sender === 'bot' && (
                      <Bot className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 ml-2 mt-0.5 flex-shrink-0 order-2" />
                    )}
                    <div className="whitespace-pre-line text-sm">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="flex items-center">
                    <Bot className="h-4 w-4 mr-2" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about prices, products, or suppliers..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
