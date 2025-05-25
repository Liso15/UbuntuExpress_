import { supabase } from '@/integrations/supabase/client';

export interface Retailer {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  delivery_info?: string;
  rating?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  category_id?: string;
  brand?: string;
  barcode?: string;
  is_trending?: boolean;
}

export interface ProductPrice {
  id: string;
  product_id: string;
  retailer_id: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  in_stock?: boolean;
  delivery_cost?: number;
  delivery_info?: string;
  last_updated: string;
  retailer?: Retailer;
}

export interface Deal {
  id: string;
  product_id: string;
  retailer_id: string;
  title: string;
  description?: string;
  discount_percentage?: number;
  original_price?: number;
  deal_price: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
  deal_type?: string;
  product?: Product;
  retailer?: Retailer;
}

export interface Subscriber {
  id: string;
  user_id?: string;
  email: string;
  stripe_customer_id?: string;
  subscribed: boolean;
  subscription_tier?: string;
  subscription_plan?: string;
  subscription_price?: number;
  subscription_start?: string;
  subscription_end?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch all retailers
export const getRetailers = async (): Promise<Retailer[]> => {
  const { data, error } = await supabase
    .from('retailers')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching retailers:', error);
    throw error;
  }
  
  return data || [];
};

// Fetch all categories
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
  
  return data || [];
};

// Fetch products with optional category filter
export const getProducts = async (categoryId?: string): Promise<Product[]> => {
  let query = supabase
    .from('products')
    .select('*')
    .order('name');
  
  if (categoryId && categoryId !== 'all') {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  return data || [];
};

// Fetch trending products
export const getTrendingProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_trending', true)
    .order('name')
    .limit(8);
  
  if (error) {
    console.error('Error fetching trending products:', error);
    throw error;
  }
  
  return data || [];
};

// Fetch product prices with retailer info
export const getProductPrices = async (productId: string): Promise<ProductPrice[]> => {
  const { data, error } = await supabase
    .from('product_prices')
    .select(`
      *,
      retailer:retailers(*)
    `)
    .eq('product_id', productId)
    .order('price');
  
  if (error) {
    console.error('Error fetching product prices:', error);
    throw error;
  }
  
  return data || [];
};

// Fetch all active deals
export const getActiveDeals = async (): Promise<Deal[]> => {
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      product:products(*),
      retailer:retailers(*)
    `)
    .eq('is_active', true)
    .order('deal_price');
  
  if (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
  
  return data || [];
};

// Search products by name
export const searchProducts = async (query: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(20);
  
  if (error) {
    console.error('Error searching products:', error);
    throw error;
  }
  
  return data || [];
};

// Add product to user comparisons
export const addToComparisons = async (productId: string, sessionId?: string) => {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  const { error } = await supabase
    .from('user_comparisons')
    .upsert({
      product_id: productId,
      user_id: userId || null,
      session_id: sessionId || null
    });
  
  if (error) {
    console.error('Error adding to comparisons:', error);
    throw error;
  }
};

// Create price alert notification
export const createPriceAlert = async (productId: string, targetPrice: number, message: string) => {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  if (!userId) {
    throw new Error('User must be logged in to create price alerts');
  }
  
  const { error } = await supabase
    .from('user_notifications')
    .insert({
      user_id: userId,
      product_id: productId,
      notification_type: 'price_drop',
      target_price: targetPrice,
      message: message
    });
  
  if (error) {
    console.error('Error creating price alert:', error);
    throw error;
  }
};

// Subscription related functions
export const createSubscription = async (planData: {
  planId: string;
  planName: string;
  price: number;
}): Promise<Subscriber> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error('User must be logged in to create subscription');
  }

  const subscriptionData = {
    user_id: user.id,
    email: user.email!,
    subscribed: true,
    subscription_tier: planData.planId,
    subscription_plan: planData.planName,
    subscription_price: planData.price,
    subscription_start: new Date().toISOString(),
    subscription_end: calculateSubscriptionEnd(planData.planId),
    is_active: true
  };

  const { data, error } = await supabase
    .from('subscribers')
    .upsert(subscriptionData, {
      onConflict: 'email'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }

  return data;
};

export const getUserSubscription = async (): Promise<Subscriber | null> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user subscription:', error);
    throw error;
  }

  return data;
};

export const updateSubscription = async (subscriptionId: string, updates: Partial<Subscriber>): Promise<Subscriber> => {
  const { data, error } = await supabase
    .from('subscribers')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }

  return data;
};

export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  const { error } = await supabase
    .from('subscribers')
    .update({
      is_active: false,
      subscription_end: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId);

  if (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

// Helper function to calculate subscription end date
const calculateSubscriptionEnd = (planId: string): string => {
  const now = new Date();
  
  switch (planId) {
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      break;
    case 'quarterly':
      now.setMonth(now.getMonth() + 3);
      break;
    case 'biannual':
      now.setMonth(now.getMonth() + 6);
      break;
    default:
      now.setMonth(now.getMonth() + 1);
  }
  
  return now.toISOString();
};
