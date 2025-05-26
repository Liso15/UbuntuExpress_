import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Price, Product, Store } from '@/types/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceWithDetails extends Price {
  product: Product;
  store: Store;
}

export function PriceTracker() {
  const [prices, setPrices] = useState<PriceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Fetch prices with product and store details
  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('prices')
        .select(`
          *,
          product:products(*),
          store:stores(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrices(data || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch price history for a product
  const fetchPriceHistory = async (productId: number) => {
    try {
      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPriceHistory(data || []);
    } catch (error) {
      console.error('Error fetching price history:', error);
    }
  };

  // Simulate price changes
  const simulatePriceChanges = () => {
    if (!selectedProduct) return;
    
    setIsSimulating(true);
    const interval = setInterval(async () => {
      const randomChange = (Math.random() - 0.5) * 10; // Random change between -5 and +5
      const currentPrice = prices.find(p => p.product_id === selectedProduct)?.price || 0;
      const newPrice = Math.max(0, currentPrice + randomChange);

      try {
        const { error } = await supabase
          .from('prices')
          .update({ price: newPrice })
          .eq('product_id', selectedProduct);

        if (error) throw error;
        fetchPrices();
        fetchPriceHistory(selectedProduct);
      } catch (error) {
        console.error('Error updating price:', error);
      }
    }, 5000); // Update every 5 seconds

    return () => {
      clearInterval(interval);
      setIsSimulating(false);
    };
  };

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel('price_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'prices' },
        () => {
          fetchPrices();
          if (selectedProduct) {
            fetchPriceHistory(selectedProduct);
          }
        }
      )
      .subscribe();

    fetchPrices();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedProduct]);

  // Start/stop simulation
  useEffect(() => {
    if (isSimulating && selectedProduct) {
      return simulatePriceChanges();
    }
  }, [isSimulating, selectedProduct]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Price List */}
        <div className="col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Current Prices</h2>
          <div className="space-y-4">
            {prices.map((price) => (
              <div 
                key={price.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProduct === price.product_id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => {
                  setSelectedProduct(price.product_id);
                  fetchPriceHistory(price.product_id);
                }}
              >
                <h3 className="font-bold">{price.product.name}</h3>
                <p className="text-lg">${price.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{price.store.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(price.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Price History Chart */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Price History</h2>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-4 py-2 rounded ${
                isSimulating 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
            >
              {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
            </button>
          </div>
          
          {selectedProduct ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="created_at" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value) => [`$${value}`, 'Price']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-500">
              Select a product to view price history
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 