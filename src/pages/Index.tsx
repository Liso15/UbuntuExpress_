import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { StartComparing } from '../components/StartComparing'
import { HowItWorks } from '../components/HowItWorks'
import { CategoryFilter } from '../components/CategoryFilter'
import { PriceTable } from '../components/PriceTable'
import { ProductList } from '../components/ProductList'
import { PriceAlert } from '../components/PriceAlert'
import { Footer } from '../components/Footer'
import { Chatbot } from '../components/Chatbot'
import { EnhancedSearch } from '../components/EnhancedSearch'
import { SubscriptionPlans } from '../components/SubscriptionPlans'
import { UserProvider } from '../contexts/UserContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { searchProducts, getProductPrices, getUserSubscription, type Subscriber } from '../services/database'
import { useToast } from '../components/ui/use-toast'

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useLocalStorage('selectedCategory', 'all')
  const [showPriceAlert, setShowPriceAlert] = useLocalStorage('showPriceAlert', true)
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false)
  const [currentLocation, setCurrentLocation] = useState('Cape Town')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [activeSearchQuery, setActiveSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [userSubscription, setUserSubscription] = useState<Subscriber | null>(null)
  
  const { user, loading } = useAuth()
  const { toast } = useToast()

  // Fetch user subscription when user changes
  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (user) {
        try {
          const subscription = await getUserSubscription()
          setUserSubscription(subscription)
        } catch (error) {
          console.error('Error fetching user subscription:', error)
        }
      } else {
        setUserSubscription(null)
      }
    }

    fetchUserSubscription()
  }, [user])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleCloseAlert = () => {
    setShowPriceAlert(false)
  }

  const handleLocationChange = (location: string) => {
    setCurrentLocation(location)
    console.log('Location changed to:', location)
  }

  const handleSearch = async (query: string, retailers: string[] = []) => {
    console.log('Searching for:', query, 'in retailers:', retailers)
    setActiveSearchQuery(query)
    setIsSearching(true)
    
    try {
      if (query.trim()) {
        // Search for actual products in the database
        const products = await searchProducts(query)
        
        // Get prices for each product
        const resultsWithPrices = await Promise.all(
          products.slice(0, 6).map(async (product) => {
            try {
              const prices = await getProductPrices(product.id)
              const filteredPrices = retailers.length > 0 
                ? prices.filter(p => retailers.includes(p.retailer_id))
                : prices

              if (filteredPrices.length === 0) return null

              const lowestPrice = Math.min(...filteredPrices.map(p => p.price))
              const highestPrice = Math.max(...filteredPrices.map(p => p.original_price || p.price))
              const discount = highestPrice > lowestPrice 
                ? Math.round(((highestPrice - lowestPrice) / highestPrice) * 100)
                : 0

              return {
                id: product.id,
                name: product.name,
                retailer: filteredPrices[0]?.retailer?.name || 'Unknown',
                price: `R${lowestPrice.toFixed(2)}`,
                originalPrice: `R${highestPrice.toFixed(2)}`,
                discount: discount > 0 ? `${discount}% OFF` : 'Best Price',
                image: product.image_url
              }
            } catch (error) {
              console.error('Error fetching prices for product:', product.id, error)
              return null
            }
          })
        )

        const validResults = resultsWithPrices.filter(result => result !== null)
        setSearchResults(validResults)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleStartComparing = (query?: string) => {
    if (query) {
      handleSearch(query)
    }
    console.log('Start comparing clicked')
  }

  const handlePlanSelect = (planId: string) => {
    console.log('Selected plan:', planId)
    
    toast({
      title: "Plan Selected",
      description: `Your ${planId} subscription is now active!`,
    })
    
    // Refresh user subscription data
    if (user) {
      getUserSubscription().then(setUserSubscription).catch(console.error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {showPriceAlert && (
          <PriceAlert
            message="Price drop alert! Coca-Cola 24-pack now 15% cheaper at Makro"
            onClose={handleCloseAlert}
          />
        )}
        <Header 
          onLocationChange={handleLocationChange}
          onSearch={(query) => handleSearch(query)}
        />
        <main className="flex-grow">
          <Hero 
            onStartComparing={() => handleStartComparing()}
            onLearnMore={() => console.log('Learn more clicked')}
          />
          
          <StartComparing onStartComparing={handleStartComparing} />
          
          <HowItWorks />
          
          <div className="container mx-auto px-4 py-8">
            <EnhancedSearch onSearch={handleSearch} />
            
            {isSearching && (
              <section className="mb-8">
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Searching for products...</p>
                </div>
              </section>
            )}
            
            {!isSearching && searchResults.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Search Results for "{activeSearchQuery}"
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map(result => (
                    <div key={result.id} className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
                      {result.image && (
                        <img 
                          src={result.image} 
                          alt={result.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-gray-800 mb-2">{result.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">Available at {result.retailer}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-green-600">{result.price}</span>
                          {result.originalPrice !== result.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">{result.originalPrice}</span>
                          )}
                        </div>
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                          {result.discount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!isSearching && searchResults.length === 0 && activeSearchQuery && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Search Results for "{activeSearchQuery}"
                </h2>
                <div className="text-center py-8">
                  <p className="text-gray-600">No products found. Try a different search term.</p>
                </div>
              </section>
            )}

            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
            
            <ProductList title="Trending Deals" />
            
            <section className="mt-12" id="deals">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Price Comparison
              </h2>
              <PriceTable category={selectedCategory} />
            </section>

            {/* Subscription Plans Section */}
            <section className="mt-12" id="pricing">
              <div className="text-center mb-6">
                <button
                  onClick={() => setShowSubscriptionPlans(!showSubscriptionPlans)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {showSubscriptionPlans ? 'Hide' : 'View'} Subscription Plans
                </button>
              </div>
              
              {showSubscriptionPlans && (
                <SubscriptionPlans onSelectPlan={handlePlanSelect} />
              )}
            </section>

            {/* User Status Display */}
            {user && (
              <section className="mt-8 bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800">
                  Welcome back, {user.user_metadata?.full_name || user.email}!
                </h3>
                <p className="text-blue-600 text-sm">
                  Location: {user.user_metadata?.location || currentLocation}
                </p>
                {userSubscription && userSubscription.is_active && (
                  <div className="mt-2">
                    <p className="text-green-600 text-sm font-medium">
                      Active Plan: {userSubscription.subscription_plan}
                    </p>
                    <p className="text-gray-600 text-xs">
                      Expires: {userSubscription.subscription_end ? new Date(userSubscription.subscription_end).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </UserProvider>
  )
}

export default Index
