
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Index = () => {
  console.log('Index component rendering - START')
  
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    console.log('Index: useEffect triggered')
    setMounted(true)
  }, [])
  
  const { user, loading } = useAuth()
  console.log('Index: Auth state:', { user: !!user, loading, mounted })

  if (loading) {
    console.log('Index: Showing loading state')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  console.log('Index: Rendering main content')

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          UbuntuExpress - Price Tracker
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Welcome to UbuntuExpress! Track and compare prices across South African stores.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Application Status
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>✅ App component loaded</li>
            <li>✅ Index page rendered</li>
            <li>✅ Auth context: {loading ? 'Loading...' : user ? 'Authenticated' : 'Not authenticated'}</li>
            <li>✅ Component mounted: {mounted ? 'Yes' : 'No'}</li>
          </ul>
        </div>

        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            🎉 If you can see this message, the application is working correctly!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Index
