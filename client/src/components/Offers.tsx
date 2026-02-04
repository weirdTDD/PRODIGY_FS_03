import React from "react";
import exclusive_image from "../Assets/exclusive_image.png";

const Offers = () => {
  return (
    <div className="py-16 grid grid-cols-2 items-center justify-between bg-gradient-to-t from-white/95 to-yellow-700 w-full">
      <div className="space-y-4 mx-[5%] text-white mb-16">
        <p className="text-xs tracking-[0.2em] uppercase mb-6 font-medium text-gray-300 text-nowrap">
          ONLY ON BEST SELLERS PRODUCTS
        </p>
        <h1 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
          Exclusive Offers
        </h1>
        <h1 className="text-left font-light text-gray-200 text-2xl">
          Offers For You
        </h1>
        <button className="px-4 py-2 text-xs md:text-base text-white bg-yellow-600 hover:bg-yellow-800 transition-colors duration-300 font-medium rounded-lg">
          View Offers
        </button>
      </div>
      <div className="flex items-center  justify-around">
        <img
          src={exclusive_image}
          alt="exclusive offer"
          width={150}
          height={150}
          className=" object-center"
        />
      </div>
    </div>
  );
};

export default Offers;

//<div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/10 to-transparent"></div>
