
export const formatPrice = (price: string): number => {
  return parseFloat(price.replace('R', '').replace(',', ''));
};

export const findLowestPrice = (suppliers: Array<{ price: string }>): string => {
  return suppliers.reduce(
    (min, supplier) =>
      formatPrice(supplier.price) < formatPrice(min)
        ? supplier.price
        : min,
    suppliers[0]?.price || 'R0'
  );
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
