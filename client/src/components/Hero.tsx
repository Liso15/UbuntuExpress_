import {
  ArrowRight,
  TrendingUp,
  Percent,
  Tag,
} from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-b from-indigo-900 to-blue-700 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Compare Supplier Prices.
              <br />
              <span className="text-yellow-300">Save Money.</span> Grow Your
              Business.
            </h1>
            <p className="text-lg text-blue-100 md:pr-12">
              South Africa's premier price comparison platform for informal
              shopkeepers. Powered by Ubuntu spirit, driven by community
              success.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors flex items-center">
                Start Comparing
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                How It Works
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-4">
              <div className="flex items-center">
                <div className="bg-green-500/20 p-2 rounded-full mr-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-sm">3,500+ Products</span>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                  <Tag className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm">200+ Suppliers</span>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-500/20 p-2 rounded-full mr-3">
                  <Percent className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm">Daily Price Updates</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-3 mb-4">
                <h3 className="font-bold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-yellow-300" />
                  Today's Top Deals
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Panado 500mg 20 Tablets</span>
                    <span className="text-green-400 font-bold">-15%</span>
                  </div>
                  <div className="text-sm text-blue-200 flex justify-between mt-1">
                    <span>Dis-Chem</span>
                    <span>R31.99</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Samsung 43" Smart TV</span>
                    <span className="text-green-400 font-bold">-20%</span>
                  </div>
                  <div className="text-sm text-blue-200 flex justify-between mt-1">
                    <span>Makro</span>
                    <span>R5,499.99</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Nederburg Wine 750ml</span>
                    <span className="text-green-400 font-bold">-8%</span>
                  </div>
                  <div className="text-sm text-blue-200 flex justify-between mt-1">
                    <span>Checkers</span>
                    <span>R89.99</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 text-sm text-center text-blue-200 hover:text-white transition-colors">
                View All Deals
                <ArrowRight className="inline ml-1 w-4 h-4" />
              </button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-12"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.52,118.92,163.08,92.66,321.39,56.44Z"
            fill="#F9FAFB"
          ></path>
        </svg>
      </div>
    </section>
  );
};
