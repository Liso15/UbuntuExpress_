
import React from 'react'
import { Button } from './ui/button'
import { ShoppingCart, TrendingDown, Users } from 'lucide-react'

interface HeroProps {
  onStartComparing?: () => void;
  onLearnMore?: () => void;
}

export const Hero = ({ onStartComparing, onLearnMore }: HeroProps) => {
  const handleStartComparing = () => {
    const element = document.getElementById('start-comparing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    onStartComparing?.();
  };

  const handleLearnMore = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    onLearnMore?.();
  };

  return (
    <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find the Best 
              <span className="text-yellow-300"> Prices </span>
              in South Africa
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Compare prices across major retailers and save money on your everyday shopping. 
              UbuntuExpress helps you find the best deals instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={handleStartComparing}
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-8 py-4 text-lg transition-all hover:scale-105"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Start Comparing
              </Button>
              <Button 
                onClick={handleLearnMore}
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-4 text-lg transition-all"
              >
                How It Works
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <TrendingDown className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Save 30%</h3>
              <p className="text-blue-100">Average savings on groceries</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <ShoppingCart className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">10+ Stores</h3>
              <p className="text-blue-100">Major retailers covered</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center col-span-2">
              <Users className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Trusted by Thousands</h3>
              <p className="text-blue-100">South Africans saving money daily</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
