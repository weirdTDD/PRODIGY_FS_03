import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/productService";
import { Product } from "../types";
import hero_image from "../Assets/hero_image.png";
import newCollections from "../Assets/new_collections";
import { ArrowRight, ShoppingBag, Heart } from "lucide-react";
import NewCollection from "../components/NewCollect";
import Hero from "../components/Hero";
import Popular from "../components/Popular";
import Offers from "../components/Offers";
import Newsletter from "../components/NewsLetter";
import Features from "../components/Features";

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
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Premium Men's Thrift Clothing in Accra
              </h1>
              <p className="text-base md:text-xl mb-8">
                Discover unique, high-quality thrift clothing at unbeatable
                prices. Sustainable fashion that doesn't compromise on style.
              </p>
              <Link
                to="/products"
                className="btn bg-white text-sm md:text-base text-nowrap text-yellow-600 hover:bg-gray-100 flex items-center justify-center w-5/12 md:w-1/3"
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

      <div>
        <div>
          <div className="py-16">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-center mb-5">
                Our Range of Products
              </h1>
              <div className="md:mx-[40%] mx-[30%] group mb-5">
                <hr className="border-t-4 border-gray-600 group-hover:-translate-y-2 rounded-full transition-all duration-500" />
              </div>
              <p className="text-center max-w-4xl mx-auto font-light text-sm md:text-lg px-6">
                Explore our diverse Collection of Premium Thrift Clothing
                currated to best suit your style and budget.From casual wear to
                formal attire, we have something for everyone.
              </p>
            </div>

            <Popular />
            <Features />
            <Offers />
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-center mb-5">
                Our Collection
              </h1>
              <div className="md:mx-[45%] mx-[36%] group">
                <hr className="border-t-4 border-gray-600 group-hover:-translate-y-2 rounded-full transition-all duration-500" />
              </div>
            </div>
            <NewCollection />
            <Newsletter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
