import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

interface PriceAlertProps {
  message: string;
  onClose: () => void;
}

export const PriceAlert = ({ message, onClose }: PriceAlertProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => {
      setIsAnimating(true);
    }, 100);

    // Auto dismiss after 8 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md transform transition-transform duration-300 ${
        isAnimating ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-lg shadow-lg flex items-start">
        <div className="bg-white/20 rounded-full p-1.5 mr-3 flex-shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          <button className="text-sm text-green-100 hover:text-white mt-1 transition-colors">
            View Details
          </button>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 text-green-100 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
