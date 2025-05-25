
import React, { memo } from 'react'
import { TrendingDown } from 'lucide-react'

interface ProductCardProps {
  name: string
  image: string
  lowestPrice: string
  priceChange: string
  suppliers: number
}

export const ProductCard = memo(({
  name,
  image,
  lowestPrice,
  priceChange,
  suppliers,
}: ProductCardProps) => {
  const isPriceDown = priceChange.startsWith('-')

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-36 object-cover"
          loading="lazy"
          decoding="async"
        />
        {isPriceDown && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <TrendingDown className="w-3 h-3 mr-1" />
            {priceChange}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-800 line-clamp-2 h-10">{name}</h3>
        <div className="mt-2 flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-500">Lowest price</p>
            <p className="text-lg font-bold text-blue-700">{lowestPrice}</p>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <span>{suppliers} suppliers</span>
          </div>
        </div>
        <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 rounded-md transition-colors">
          Compare Prices
        </button>
      </div>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'
