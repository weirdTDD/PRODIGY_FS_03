import React from "react";
import { ShoppingBag, Heart } from "lucide-react";
import dataProduct from "../Assets/data";

const Popular = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">
              Curated Selection
            </h2>
            <h3 className="text-3xl font-serif text-black">Most Popular</h3>
          </div>
          <button className="text-xs tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-300 transition-all uppercase">
            View All
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {dataProduct.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Wishlist Icon */}
                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                  <Heart
                    size={18}
                    strokeWidth={1.5}
                    className="text-gray-900"
                  />
                </button>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/90 py-4 text-center">
                  <button className="text-white text-[11px] tracking-widest flex items-center justify-center w-full uppercase font-medium">
                    <ShoppingBag size={14} className="mr-2" /> Add to Bag
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <h3 className="text-[13px] tracking-wide text-gray-800 uppercase font-medium group-hover:text-black transition-colors">
                  {item.name}
                </h3>

                <div className="flex items-center space-x-3 pt-1">
                  <span className="text-sm font-semibold text-black">
                    GH₵ {item.new_price.toFixed(2)}
                  </span>
                  {item.old_price && (
                    <span className="text-xs text-gray-400 line-through font-light">
                      GH₵ {item.old_price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Popular;
