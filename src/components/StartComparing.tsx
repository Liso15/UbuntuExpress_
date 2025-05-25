
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, ShoppingCart, TrendingDown } from 'lucide-react';

interface StartComparingProps {
  onStartComparing?: (query: string) => void;
}

export const StartComparing = ({ onStartComparing }: StartComparingProps) => {
  const [compareQuery, setCompareQuery] = useState('');

  const handleStartComparing = () => {
    if (compareQuery.trim()) {
      onStartComparing?.(compareQuery.trim());
    }
  };

  const popularSearches = [
    'Coca Cola 2L',
    'Bread White',
    'Milk 1L',
    'Rice 2kg',
    'Chicken Breast',
    'Eggs 12 pack'
  ];

  return (
    <section id="start-comparing" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Start Comparing Prices Now
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the best deals across South Africa's major retailers. Save money on your everyday essentials.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Enter product name (e.g., Coca Cola 2L)"
                value={compareQuery}
                onChange={(e) => setCompareQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleStartComparing()}
              />
            </div>
            <Button 
              onClick={handleStartComparing}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Compare Prices
            </Button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Popular Searches</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => {
                  setCompareQuery(search);
                  onStartComparing?.(search);
                }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Search Products</h4>
            <p className="text-gray-600 text-sm">Enter any product name and we'll find it across multiple retailers</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Compare Prices</h4>
            <p className="text-gray-600 text-sm">See prices from Shoprite, Pick n Pay, Makro, and more retailers</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Save Money</h4>
            <p className="text-gray-600 text-sm">Find the best deals and save on your grocery shopping</p>
          </div>
        </div>
      </div>
    </section>
  );
};
