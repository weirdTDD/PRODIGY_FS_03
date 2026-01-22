import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/logo.png";

const Hero = () => {
  return (
    <div>
      <section className="bg-gradient-to-r from-yellow-600 to-yellow-900 text-white">
        <div className="container-custom py-20">
          <div className="flex gap-8 items-center justify-between">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">
                Premium Thrift Clothing in Accra
              </h1>
              <p className=" mb-8 font-light text-sm md:text-xl">
                Discover unique, high-quality thrift clothing at unbeatable
                prices. Sustainable fashion that doesn't compromise on style.
              </p>
              <Link
                to="/products"
                className="btn bg-white text-yellow-600 hover:bg-gray-100"
              >
                Shop Now
              </Link>
            </div>

            <div className="md:block hidden">
              <img
                src={logo}
                alt="hero image"
                width={1200}
                height={1200}
                className="w-52 h-52 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
