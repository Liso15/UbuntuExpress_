
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'
import { getProducts, getProductPrices, type Product, type ProductPrice } from '../services/database'

interface PriceTableProps {
  category: string
}

interface ProductWithPrices extends Product {
  prices: ProductPrice[]
  lowestPrice: number
  suppliersCount: number
}

export const PriceTable = ({ category }: PriceTableProps) => {
  const [sortBy, setSortBy] = useState('price')
  const [sortOrder, setSortOrder] = useState('asc')
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: () => getProducts(category === 'all' ? undefined : category)
  })

  const { data: productsWithPrices = [], isLoading: pricesLoading } = useQuery({
    queryKey: ['products-with-prices', products],
    queryFn: async (): Promise<ProductWithPrices[]> => {
      if (products.length === 0) return []
      
      const productsWithPriceData = await Promise.all(
        products.slice(0, 10).map(async (product) => {
          try {
            const prices = await getProductPrices(product.id)
            const lowestPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : 0
            const suppliersCount = prices.length

            return {
              ...product,
              prices,
              lowestPrice,
              suppliersCount
            }
          } catch (error) {
            console.error(`Error fetching prices for product ${product.id}:`, error)
            return {
              ...product,
              prices: [],
              lowestPrice: 0,
              suppliersCount: 0
            }
          }
        })
      )

      return productsWithPriceData
    },
    enabled: products.length > 0
  })

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const sortedProducts = [...productsWithPrices].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'price':
        aValue = a.lowestPrice
        bValue = b.lowestPrice
        break
      case 'suppliers':
        aValue = a.suppliersCount
        bValue = b.suppliersCount
        break
      default:
        aValue = a.name
        bValue = b.name
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
    
    return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
  })

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    )
  }

  if (isLoading || pricesLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading price comparison data...</p>
        </div>
      </div>
    )
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-gray-600">No products available for comparison in this category.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Product</th>
              <th
                className="px-6 py-3 cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Lowest Price
                  <SortIcon column="price" />
                </div>
              </th>
              <th
                className="px-6 py-3 cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('suppliers')}
              >
                <div className="flex items-center">
                  Suppliers
                  <SortIcon column="suppliers" />
                </div>
              </th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200'}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover mr-3"
                    />
                    <span className="font-medium text-gray-900">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-lg font-bold text-blue-700">
                    {product.lowestPrice > 0 ? `R${product.lowestPrice.toFixed(2)}` : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {product.prices.slice(0, 3).map((price, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold"
                        title={price.retailer?.name}
                      >
                        {price.retailer?.name?.charAt(0) || 'R'}
                      </div>
                    ))}
                    {product.prices.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                        +{product.prices.length - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                  >
                    {expandedProduct === product.id ? 'Hide' : 'Compare'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded view for selected product */}
      {expandedProduct && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          {(() => {
            const product = sortedProducts.find(p => p.id === expandedProduct)
            if (!product) return null
            
            return (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">
                    Supplier Comparison: {product.name}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Last updated: Today
                    </span>
                    <button 
                      className="text-sm text-gray-500 hover:text-gray-700"
                      onClick={() => setExpandedProduct(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {product.prices.map((price, idx) => (
                    <div
                      key={price.id}
                      className={`bg-white rounded-lg border p-4 ${
                        idx === 0 ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-800">{price.retailer?.name || 'Unknown'}</h4>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(price.retailer?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">
                              {price.retailer?.rating || 0}/5
                            </span>
                          </div>
                        </div>
                        {idx === 0 && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                            Best Price
                          </span>
                        )}
                      </div>
                      <div className="mt-4">
                        <div className="text-2xl font-bold text-blue-700">
                          R{price.price.toFixed(2)}
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <span>{price.in_stock ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          Delivery: {price.delivery_info || price.retailer?.delivery_info || 'Contact store'}
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button
                          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                            idx === 0
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                          }`}
                        >
                          Order Now
                        </button>
                        <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
                          <ExternalLink className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
