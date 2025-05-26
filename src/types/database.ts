export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  brand: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Price {
  id: number;
  product_id: number;
  price: number;
  currency: string;
  store_id: number;
  created_at: string;
}

export interface Store {
  id: number;
  name: string;
  website: string;
  location: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface PriceAlert {
  id: number;
  user_id: string;
  product_id: number;
  target_price: number;
  is_active: boolean;
  created_at: string;
}

export interface PriceHistory {
  id: number;
  product_id: number;
  price: number;
  currency: string;
  store_id: number;
  created_at: string;
}

export interface UserFavorite {
  id: number;
  user_id: string;
  product_id: number;
  created_at: string;
} 