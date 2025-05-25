
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Menu,
  X,
  User,
  Bell,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { LocationSelector } from './LocationSelector'

interface HeaderProps {
  onLocationChange?: (location: string) => void;
  onAuthChange?: (userData: any) => void;
  onSearch?: (query: string) => void;
}

export const Header = ({ onLocationChange, onAuthChange, onSearch }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentLocation, setCurrentLocation] = useState('Cape Town')
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLocationChange = (location: string) => {
    setCurrentLocation(location);
    onLocationChange?.(location);
  }

  const handleLogout = async () => {
    await signOut();
    onAuthChange?.(null);
  }

  const handleAuthClick = () => {
    navigate('/auth');
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as any);
    }
  }

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <h1 className="text-lg sm:text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                Ubuntu<span className="text-yellow-300">Express</span>
              </h1>
            </div>

            {/* Search on desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products, brands or suppliers..."
                  className="w-full py-2 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                />
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4">
              <LocationSelector 
                currentLocation={currentLocation}
                onLocationChange={handleLocationChange}
              />
              <a href="#categories" className="hover:text-yellow-300 transition-colors whitespace-nowrap">
                Categories
              </a>
              <a href="#deals" className="hover:text-yellow-300 transition-colors whitespace-nowrap">
                Deals
              </a>
              <a href="#suppliers" className="hover:text-yellow-300 transition-colors whitespace-nowrap">
                Suppliers
              </a>
              <a href="#notifications" className="relative">
                <Bell className="w-5 h-5 hover:text-yellow-300 transition-colors" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </a>
              
              {user ? (
                <div className="flex items-center space-x-2 border-l border-white/20 pl-4">
                  <User className="w-5 h-5" />
                  <span className="text-sm hidden xl:inline">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-yellow-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleAuthClick}
                  className="bg-yellow-500 hover:bg-yellow-600 text-blue-800 px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button onClick={toggleMenu} className="text-white p-2">
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="pt-1 pb-3 md:hidden">
            <div className="flex items-center justify-between mb-2">
              <LocationSelector 
                currentLocation={currentLocation}
                onLocationChange={handleLocationChange}
              />
              {!user && (
                <button 
                  onClick={handleAuthClick}
                  className="bg-yellow-500 hover:bg-yellow-600 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-indigo-800">
            <div className="container mx-auto px-4 py-3">
              <nav className="flex flex-col space-y-3">
                <a
                  href="#categories"
                  className="text-white hover:text-yellow-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </a>
                <a
                  href="#deals"
                  className="text-white hover:text-yellow-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Deals
                </a>
                <a
                  href="#suppliers"
                  className="text-white hover:text-yellow-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Suppliers
                </a>
                <a
                  href="#notifications"
                  className="text-white hover:text-yellow-300 transition-colors flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notifications
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                  </span>
                </a>
                {user ? (
                  <div className="flex items-center justify-between">
                    <span className="text-white">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                    <button 
                      onClick={handleLogout}
                      className="text-white hover:text-yellow-300 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleAuthClick}
                    className="text-white hover:text-yellow-300 transition-colors text-left"
                  >
                    Account
                  </button>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
