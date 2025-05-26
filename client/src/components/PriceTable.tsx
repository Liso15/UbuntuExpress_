import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import type { ProductWithPrices } from "@shared/schema";

interface PriceTableProps {
  products: ProductWithPrices[];
}

export const PriceTable = ({ products }: PriceTableProps) => {
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price") {
      const aPrice = a.lowestPrice ? parseFloat(a.lowestPrice.price) : Infinity;
      const bPrice = b.lowestPrice ? parseFloat(b.lowestPrice.price) : Infinity;
      return sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice;
    } else if (sortBy === "suppliers") {
      return sortOrder === "asc" 
        ? a.prices.length - b.prices.length 
        : b.prices.length - a.prices.length;
    }
    return 0;
  });

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  const toggleExpanded = (productId: number) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${
            i <= Math.floor(numRating) ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No products found for the selected category.</p>
      </div>
    );
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
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center">
                  Lowest Price
                  <SortIcon column="price" />
                </div>
              </th>
              <th
                className="px-6 py-3 cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("suppliers")}
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
              <React.Fragment key={product.id}>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={product.image}
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
                      {product.lowestPrice 
                        ? `R${parseFloat(product.lowestPrice.price).toFixed(2)}`
                        : "N/A"
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {product.prices.slice(0, 3).map((price, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold"
                        >
                          {price.supplier.name.charAt(0)}
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
                      onClick={() => toggleExpanded(product.id)}
                    >
                      {expandedProduct === product.id ? "Close" : "Compare"}
                    </button>
                  </td>
                </tr>

                {expandedProduct === product.id && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-800">
                            Supplier Comparison: {product.name}
                          </h3>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                              Last updated: Today 14:30
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {product.prices
                            .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
                            .map((price, idx) => (
                              <div
                                key={price.id}
                                className={`bg-white rounded-lg border p-4 ${
                                  idx === 0 
                                    ? "border-green-500 ring-1 ring-green-500" 
                                    : "border-gray-200"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-bold text-gray-800">
                                      {price.supplier.name}
                                    </h4>
                                    <div className="flex items-center mt-1">
                                      <div className="flex">
                                        {renderStars(price.supplier.rating)}
                                      </div>
                                      <span className="text-xs text-gray-500 ml-1">
                                        {price.supplier.rating}/5
                                      </span>
                                    </div>
                                  </div>
                                  {idx === 0 && (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                      <Check className="w-3 h-3 mr-1" />
                                      Best Price
                                    </span>
                                  )}
                                </div>
                                
                                <div className="mt-4">
                                  <div className="text-2xl font-bold text-blue-700">
                                    R{parseFloat(price.price).toFixed(2)}
                                  </div>
                                  <div className="flex items-center mt-2 text-sm text-gray-600">
                                    {price.inStock ? (
                                      <Check className="w-4 h-4 text-green-500 mr-1" />
                                    ) : (
                                      <X className="w-4 h-4 text-red-500 mr-1" />
                                    )}
                                    <span>{price.inStock ? "In Stock" : "Out of Stock"}</span>
                                  </div>
                                  <div className="mt-1 text-sm text-gray-600">
                                    Delivery: {price.supplier.deliveryInfo}
                                  </div>
                                </div>
                                
                                <div className="mt-4 flex space-x-2">
                                  <button
                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                                      idx === 0
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                    }`}
                                  >
                                    Order Now
                                  </button>
                                  <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
                                    <ExternalLink className="w-5 h-5 text-gray-600" />
                                  </button>
                                </div>
                                
                                {idx === 0 && (
                                  <div className="mt-3 text-xs text-gray-500 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Price verified 2 hours ago
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};