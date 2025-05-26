import { TrendingDown, BarChart3 } from "lucide-react";
import type { ProductWithPrices } from "@shared/schema";

interface ProductCardProps {
  product: ProductWithPrices;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const isPriceDown = product.priceChange?.startsWith("-");
  const lowestPriceAmount = product.lowestPrice 
    ? `R${parseFloat(product.lowestPrice.price).toFixed(2)}`
    : "Price unavailable";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-36 object-cover" 
        />
        {isPriceDown && product.priceChange && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <TrendingDown className="w-3 h-3 mr-1" />
            {product.priceChange}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-800 line-clamp-2 h-10">
          {product.name}
        </h3>
        <div className="mt-2 flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-500">Lowest price</p>
            <p className="text-lg font-bold text-blue-700">{lowestPriceAmount}</p>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <BarChart3 className="w-3 h-3 mr-1" />
            <span>{product.prices.length} suppliers</span>
          </div>
        </div>
        <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 rounded-md transition-colors">
          Compare Prices
        </button>
      </div>
    </div>
  );
};
