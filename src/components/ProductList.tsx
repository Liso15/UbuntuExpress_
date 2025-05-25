
import React, { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { getTrendingProducts, getProductPrices, type Product, type ProductPrice } from '../services/database';
import { useQuery } from '@tanstack/react-query';

interface ProductListProps {
  title: string;
  className?: string;
}

interface ProductWithPrices extends Product {
  prices?: ProductPrice[];
  lowestPrice?: string;
  priceChange?: string;
  suppliers?: number;
}

export const ProductList = ({ title, className = '' }: ProductListProps) => {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['trending-products'],
    queryFn: getTrendingProducts
  });

  const [productsWithPrices, setProductsWithPrices] = useState<ProductWithPrices[]>([]);

  useEffect(() => {
    const fetchPricesForProducts = async () => {
      if (products.length === 0) return;

      const productsWithPriceData = await Promise.all(
        products.map(async (product) => {
          try {
            const prices = await getProductPrices(product.id);
            const lowestPrice = prices.length > 0 ? `R${Math.min(...prices.map(p => p.price)).toFixed(2)}` : 'N/A';
            const suppliers = prices.length;
            
            // Calculate price change (mock for now - would need historical data)
            const priceChange = Math.random() > 0.5 ? `-${Math.floor(Math.random() * 20 + 5)}%` : '';

            return {
              ...product,
              prices,
              lowestPrice,
              priceChange,
              suppliers
            };
          } catch (error) {
            console.error(`Error fetching prices for product ${product.id}:`, error);
            return {
              ...product,
              lowestPrice: 'N/A',
              priceChange: '',
              suppliers: 0
            };
          }
        })
      );

      setProductsWithPrices(productsWithPriceData);
    };

    fetchPricesForProducts();
  }, [products]);

  if (isLoading) {
    return (
      <section className={`mt-8 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="w-full h-36 bg-gray-200"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`mt-8 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">Error loading products. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (productsWithPrices.length === 0) {
    return (
      <section className={`mt-8 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">No trending products available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`mt-8 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productsWithPrices.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.image_url || 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200'}
            lowestPrice={product.lowestPrice || 'N/A'}
            priceChange={product.priceChange || ''}
            suppliers={product.suppliers || 0}
          />
        ))}
      </div>
    </section>
  );
};
