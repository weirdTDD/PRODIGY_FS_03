import React from "react";
import Hero from "../components/Hero";
import Popular from "../components/Popular";
import Offers from "../components/Offers";
import NewCollection from "../components/NewCollect";
import Newsletter from "../components/NewsLetter";

const ProductsPage = () => {
  return (
    <div>
      <div>
        <Hero />
        <div className="py-16">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-center mb-5">
              Our Range of Products
            </h1>
            <div className="md:mx-[40%] mx-[30%] group mb-5">
              <hr className="border-t-4 border-gray-600 group-hover:-translate-y-2 rounded-full transition-all duration-500" />
            </div>
            <p className="text-center max-w-4xl mx-auto font-light text-sm md:text-lg px-6">
              Explore our diverse Collection of Premium Thrift Clothing currated
              to best suit your style and budget.From casual wear to formal
              attire, we have something for everyone.
            </p>
          </div>

          <Popular />
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
  );
};

export default ProductsPage;
