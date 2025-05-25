
export const CATEGORIES = [
  {
    id: 'all',
    name: 'All Categories',
    icon: 'ShoppingBag',
  },
  {
    id: 'food',
    name: 'Food & Beverage',
    icon: 'ShoppingCart',
  },
  {
    id: 'medical',
    name: 'Medical & Pharmacy',
    icon: 'HeartPulse',
  },
  {
    id: 'alcohol',
    name: 'Wine & Alcohol',
    icon: 'Wine',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Laptop',
  },
] as const;

export const RETAILERS = [
  'Shoprite',
  'Checkers',
  'Pick n Pay',
  'Makro',
  'Clicks',
  'Dis-Chem',
  'SPAR',
  'Game',
] as const;

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Panado 500mg 20 Tablets",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    lowestPrice: "R31.99",
    priceChange: "-15%",
    suppliers: 4,
  },
  {
    id: 2,
    name: "Coca-Cola 24-pack",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    lowestPrice: "R189.99",
    priceChange: "-12%",
    suppliers: 5,
  },
  {
    id: 3,
    name: 'Samsung 43" Smart TV',
    image: "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    lowestPrice: "R5,499.99",
    priceChange: "-20%",
    suppliers: 3,
  },
  {
    id: 4,
    name: "Nederburg Wine 750ml",
    image: "https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    lowestPrice: "R89.99",
    priceChange: "-8%",
    suppliers: 4,
  },
] as const;
