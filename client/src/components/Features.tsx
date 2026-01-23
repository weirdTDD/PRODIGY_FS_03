import React from "react";
import { ShieldCheck, Tag, Truck } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <ShieldCheck size={32} strokeWidth={1.2} />,
      title: "Quality Guaranteed",
      description:
        "Every piece is hand-inspected and authenticated by our expert curators in Accra.",
    },
    {
      icon: <Tag size={32} strokeWidth={1.2} />,
      title: "Unbeatable Value",
      description:
        "Experience premium global fashion at a fraction of the original retail price.",
    },
    {
      icon: <Truck size={32} strokeWidth={1.2} />,
      title: "Swift Delivery",
      description:
        "White-glove delivery service across the city, arriving at your door within 24-48 hours.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon Wrapper - Minimalist & Airy */}
              <div className="mb-6 p-4 bg-amber-400/60 rounded-full text-black group-hover:scale-110 transition-transform duration-500 ease-out">
                {feature.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-xs tracking-[0.3em] uppercase font-bold mb-3 text-black">
                {feature.title}
              </h3>
              <p className="text-gray-600 font-light leading-relaxed max-w-xs text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
