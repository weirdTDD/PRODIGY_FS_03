import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070"
          alt="Luxury Fashion Background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/10 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center text-white">
        <h2 className="text-sm tracking-[0.5em] uppercase mb-6 font-medium text-gray-300">
          Exclusive Access
        </h2>

        <h3 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
          Join the <span className="italic">Inner Circle</span>
        </h3>

        <p className="text-lg md:text-xl text-gray-200 mb-10 font-light max-w-md mx-auto leading-relaxed">
          Be the first to discover our rarest drops and curated vintage finds in
          Accra.
        </p>

        <form className="max-w-md mx-auto group">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-black/20 backdrop-blur-md border rounded-xl border-white/40 px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-white transition-all text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-white text-black px-10 py-4 font-bold rounded-xl text-sm tracking-widest uppercase hover:bg-gray-200 transition-colors flex items-center justify-center whitespace-nowrap"
            >
              Subscribe <ArrowRight size={18} className="ml-2" />
            </button>
          </div>

          <p className="mt-6 text-xs md:text-sm text-gray-800 font-medium tracking-wide ">
            Privately handled. Unsubscribe with one click.
          </p>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
