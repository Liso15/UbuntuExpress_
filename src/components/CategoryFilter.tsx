
import React from 'react'
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  WineIcon,
  LaptopIcon,
  HeartPulseIcon,
  SlidersIcon,
} from 'lucide-react'
import { CATEGORIES, RETAILERS } from '../constants/data'

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const iconMap = {
  ShoppingBag: ShoppingBagIcon,
  ShoppingCart: ShoppingCartIcon,
  Wine: WineIcon,
  Laptop: LaptopIcon,
  HeartPulse: HeartPulseIcon,
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Browse Categories</h2>
        <button className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <SlidersIcon className="w-4 h-4 mr-1" />
          Filters
        </button>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-2 min-w-max">
          {CATEGORIES.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap]
            return (
              <button
                key={category.id}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="mr-2">
                  <IconComponent className="w-5 h-5" />
                </span>
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {RETAILERS.map((retailer) => (
          <button
            key={retailer}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition-colors"
          >
            {retailer}
          </button>
        ))}
      </div>
    </div>
  )
}
