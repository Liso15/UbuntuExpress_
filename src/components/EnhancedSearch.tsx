
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getRetailers, searchProducts } from '../services/database';

interface EnhancedSearchProps {
  onSearch: (query: string, retailers: string[]) => void;
}

export const EnhancedSearch = ({ onSearch }: EnhancedSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: retailers = [], isLoading: retailersLoading } = useQuery({
    queryKey: ['retailers'],
    queryFn: getRetailers
  });

  const handleRetailerToggle = (retailerId: string) => {
    setSelectedRetailers(prev => 
      prev.includes(retailerId)
        ? prev.filter(r => r !== retailerId)
        : [...prev, retailerId]
    );
  };

  const handleSearch = async () => {
    try {
      const products = await searchProducts(searchQuery);
      console.log('Search results:', products);
      onSearch(searchQuery, selectedRetailers);
    } catch (error) {
      console.error('Search error:', error);
      onSearch(searchQuery, selectedRetailers);
    }
  };

  const clearFilters = () => {
    setSelectedRetailers([]);
    setSearchQuery('');
    onSearch('', []);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for products, brands, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Retailers ({selectedRetailers.length})
          </Button>
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
            Search
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700">Select Retailers</h3>
            <Button onClick={clearFilters} variant="ghost" size="sm">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
          
          {retailersLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {retailers.map((retailer) => (
                <label key={retailer.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRetailers.includes(retailer.id)}
                    onChange={() => handleRetailerToggle(retailer.id)}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{retailer.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
