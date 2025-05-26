import { useQuery } from "@tanstack/react-query";
import type { Supplier } from "@shared/schema";

export function useSuppliers() {
  return useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });
}

export function useSupplierById(id: number) {
  return useQuery({
    queryKey: ["/api/suppliers", id],
    enabled: !!id,
  });
}
