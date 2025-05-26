import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Bell,
  Menu,
  X,
  User,
  MapPin,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { username, location } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold">
              Ubuntu<span className="text-yellow-300">Express</span>
            </h1>
          </div>

          {/* Search on desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, brands or suppliers..."
                className="w-full py-1.5 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-sm border-r border-white/20 pr-4 mr-2">
              <MapPin className="w-4 h-4 mr-1 text-yellow-300" />
              <span>{location.city}</span>
            </div>
            <a href="#" className="hover:text-yellow-300 transition-colors">
              Categories
            </a>
            <a href="#" className="hover:text-yellow-300 transition-colors">
              Deals
            </a>
            <a href="#" className="hover:text-yellow-300 transition-colors">
              Suppliers
            </a>
            <a href="#" className="relative">
              <Bell className="w-5 h-5 hover:text-yellow-300 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </a>
            <a href="#" className="relative">
              <ShoppingCart className="w-5 h-5 hover:text-yellow-300 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </a>
            <div className="flex items-center space-x-2 border-l border-white/20 pl-4">
              <User className="w-5 h-5" />
              <span className="text-sm">{username}</span>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-yellow-300" />
            <span className="text-sm">{location.city}</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-1.5 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-800">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <a
                href="#"
                className="text-white hover:text-yellow-300 transition-colors"
              >
                Categories
              </a>
              <a
                href="#"
                className="text-white hover:text-yellow-300 transition-colors"
              >
                Deals
              </a>
              <a
                href="#"
                className="text-white hover:text-yellow-300 transition-colors"
              >
                Suppliers
              </a>
              <a
                href="#"
                className="text-white hover:text-yellow-300 transition-colors flex items-center justify-between"
              >
                Notifications
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </a>
              <a
                href="#"
                className="text-white hover:text-yellow-300 transition-colors flex items-center justify-between"
              >
                Cart
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </a>
              <a
                href="#"
                className="text-white hover:text-yellow-300 transition-colors"
              >
                Account
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
