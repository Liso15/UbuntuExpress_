import {
  ShoppingBag,
  ShoppingCart,
  Wine,
  Laptop,
  HeartPulse,
  SlidersHorizontal,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSuppliers } from "@/hooks/use-suppliers";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: suppliers = [] } = useSuppliers();

  const categoryIcons = {
    "all": <ShoppingBag className="w-5 h-5" />,
    "food": <ShoppingCart className="w-5 h-5" />,
    "medical": <HeartPulse className="w-5 h-5" />,
    "alcohol": <Wine className="w-5 h-5" />,
    "electronics": <Laptop className="w-5 h-5" />,
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Browse Categories</h2>
        <button className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <SlidersHorizontal className="w-4 h-4 mr-1" />
          Filters
        </button>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-2 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.slug
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => onCategoryChange(category.slug)}
            >
              <span className="mr-2">
                {categoryIcons[category.slug as keyof typeof categoryIcons]}
              </span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {suppliers.map((supplier) => (
          <button
            key={supplier.id}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition-colors"
          >
            {supplier.name}
          </button>
        ))}
      </div>
    </div>
  );
};
