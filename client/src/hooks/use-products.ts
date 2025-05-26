import { useQuery } from "@tanstack/react-query";
import type { ProductWithPrices } from "@shared/schema";

export function useProducts(category?: string) {
  return useQuery<ProductWithPrices[]>({
    queryKey: ["/api/products", { category }],
    enabled: true,
  });
}

export function useProductById(id: number) {
  return useQuery({
    queryKey: ["/api/products", id],
    enabled: !!id,
  });
}

export function useSearchProducts(query: string) {
  return useQuery<ProductWithPrices[]>({
    queryKey: ["/api/products", { search: query }],
    enabled: !!query && query.length >= 2,
  });
}
