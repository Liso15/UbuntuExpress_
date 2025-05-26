import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { PriceTable } from "@/components/PriceTable";
import { PriceAlert } from "@/components/PriceAlert";
import { Footer } from "@/components/Footer";
import { useProducts } from "@/hooks/use-products";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPriceAlert, setShowPriceAlert] = useState(true);

  const { data: products = [], isLoading } = useProducts(selectedCategory);
  
  const { data: alerts = [] } = useQuery({
    queryKey: ["/api/alerts"],
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCloseAlert = () => {
    setShowPriceAlert(false);
  };

  // Get trending products (first 4 products)
  const trendingProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {showPriceAlert && alerts.length > 0 && (
        <PriceAlert
          message={alerts[0].message}
          onClose={handleCloseAlert}
        />
      )}
      
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        <div className="container mx-auto px-4 py-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Trending Deals
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md h-64 animate-pulse">
                    <div className="bg-gray-300 h-36 rounded-t-lg"></div>
                    <div className="p-3 space-y-2">
                      <div className="bg-gray-300 h-4 rounded"></div>
                      <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {trendingProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </section>
          
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Price Comparison
            </h2>
            <PriceTable products={products} />
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
