import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/productService";
import { Product } from "../types";
import hero_image from "../Assets/hero_image.png";
import newCollections from "../Assets/new_collections";
import { ArrowRight, ShoppingBag, Heart } from "lucide-react";
import NewCollection from "../components/NewCollect";

const HomePage = () => {
  const [newollections, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await productService.getFeaturedProducts(4);
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-r from-yellow-600 to-yellow-900 text-white">
        <div className="container-custom py-20">
          <div className="flex gap-8 items-center justify-between">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">
                Premium Men's Thrift Clothing in Accra
              </h1>
              <p className="text-xl mb-8">
                Discover unique, high-quality thrift clothing at unbeatable
                prices. Sustainable fashion that doesn't compromise on style.
              </p>
              <Link
                to="/products"
                className="btn bg-white text-nowrap text-yellow-600 hover:bg-gray-100 flex items-center justify-center w-1/2 md:w-1/3"
              >
                Our Collections
                <ArrowRight className="ml-2 " />
              </Link>
            </div>

            <div className="md:block hidden">
              <img
                src={hero_image}
                alt="hero image"
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h1 className="text-4xl text-center mb-12">Featured Products</h1>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
            </div>
          ) : (
            <div>
              <NewCollection />
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features unchanged */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quality */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                All items carefully inspected and graded for quality
              </p>
            </div>

            {/* Price */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Affordable Prices</h3>
              <p className="text-gray-600">
                Premium fashion at prices that won't break the bank
              </p>
            </div>

            {/* Delivery */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Local Delivery</h3>
              <p className="text-gray-600">
                Fast and reliable delivery across Accra
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
