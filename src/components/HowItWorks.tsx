
import React from 'react';
import { Search, BarChart3, ShoppingBag, Bell } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Search Products",
      description: "Simply search for any product you want to buy. From groceries to electronics, we cover it all.",
      color: "blue"
    },
    {
      icon: BarChart3,
      title: "Compare Prices",
      description: "We instantly show you prices from major South African retailers like Shoprite, Pick n Pay, Makro, and more.",
      color: "green"
    },
    {
      icon: ShoppingBag,
      title: "Choose Best Deal",
      description: "See which retailer offers the best price and visit their store or website to make your purchase.",
      color: "purple"
    },
    {
      icon: Bell,
      title: "Get Price Alerts",
      description: "Set up price alerts for your favorite products and get notified when prices drop.",
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How UbuntuExpress Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Saving money on your shopping is simple with our platform. Here's how we help you find the best deals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className={`w-20 h-20 ${getColorClasses(step.color)} rounded-full flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110`}>
                  <step.icon className="h-10 w-10" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Why Choose UbuntuExpress?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-gray-600">Major Retailers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
                <div className="text-gray-600">Products Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">30%</div>
                <div className="text-gray-600">Average Savings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
