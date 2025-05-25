
import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

interface LocationSelectorProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
}

const SOUTH_AFRICAN_CITIES = [
  'Cape Town',
  'Johannesburg',
  'Durban',
  'Pretoria',
  'Port Elizabeth',
  'Bloemfontein',
  'East London',
  'Pietermaritzburg',
  'Nelspruit',
  'Kimberley',
  'Polokwane',
  'Rustenburg'
];

export const LocationSelector = ({ currentLocation, onLocationChange }: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLocationSelect = (location: string) => {
    onLocationChange(location);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="flex items-center space-x-2 text-white hover:text-yellow-300"
      >
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLocation}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-48 max-h-60 overflow-y-auto">
          {SOUTH_AFRICAN_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => handleLocationSelect(city)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                city === currentLocation ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
