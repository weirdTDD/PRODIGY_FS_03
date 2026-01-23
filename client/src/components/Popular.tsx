import React, { useState } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { Product } from "../types";
import { splitOptions } from "../utils/productOptions";
import { getLegacyFeatured } from "../utils/legacyProducts";

const Popular = () => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const products = getLegacyFeatured(4);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleQuickAdd = async (product: Product) => {
    const sizeOptions = splitOptions(product.size);
    const colorOptions = splitOptions(product.color);

    const canQuickAdd = sizeOptions.length === 1 && colorOptions.length <= 1;

    if (!canQuickAdd) {
      navigate(`/products/${product.slug}`);
      return;
    }

    setBusyId(product._id);
    setError(null);

    try {
      addItem({
        _id: `${product._id}-${sizeOptions[0]}-${colorOptions[0] || "none"}`,
        product,
        quantity: 1,
        price: product.price,
        size: sizeOptions[0],
        color: colorOptions[0],
      });
    } catch (err) {
      setError("We couldn't add that item. Try again.");
    } finally {
      setBusyId(null);
    }
  };

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
          <button
            onClick={() => navigate("/products")}
            className="text-xs tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-300 transition-all uppercase"
          >
            View All
          </button>
        </div>

        {/* Product Grid */}
        {error && <p className="text-sm text-red-600 mb-6">{error}</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((item) => {
            const image = item.images?.[0];
            const isBusy = busyId === item._id;

            return (
              <div key={item._id} className="group">
                <Link
                  to={`/products/${item.slug}`}
                  className="block cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                    {image ? (
                      <img
                        src={image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}

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
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleQuickAdd(item);
                        }}
                        disabled={isBusy}
                        className="text-white text-[11px] tracking-widest flex items-center justify-center w-full uppercase font-medium"
                      >
                        <ShoppingBag size={14} className="mr-2" />{" "}
                        {isBusy ? "Adding..." : "Add to Bag"}
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1">
                    <p className="text-[13px] tracking-wide text-gray-800 uppercase font-medium group-hover:text-black transition-colors block">
                      {item.name}
                    </p>

                    <div className="flex items-center space-x-3 pt-1">
                      <span className="text-sm font-semibold text-black">
                        GH₵ {item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Popular;
