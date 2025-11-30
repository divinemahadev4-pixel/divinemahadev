import React from "react";
import { Truck, Headphones, ShieldCheck, Gem } from "lucide-react";

const ServiceHighlights = () => {
  const items = [
    {
      icon: <Truck className="w-8 h-8 md:w-10 md:h-10 text-[#5C3B19]" strokeWidth={1.5} />,
      title: "Free Shipping",
      desc: "All over India",
    },
    {
      icon: <Headphones className="w-8 h-8 md:w-10 md:h-10 text-[#5C3B19]" strokeWidth={1.5} />,
      title: "24/7 Support",
      desc: "Always here for you",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-[#5C3B19]" strokeWidth={1.5} />,
      title: "Secure Payment",
      desc: "UPI, Card & COD",
    },
    {
      // Changed Flag to Gem or Star for a more premium "Heritage" feel
      icon: <Gem className="w-8 h-8 md:w-10 md:h-10 text-[#5C3B19]" strokeWidth={1.5} />,
      title: "Cultural India",
      desc: "Authentic Heritage",
    },
  ];

  return (
    <div className="w-full bg-[#F8F2E8] py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* 
           grid-cols-2 : Makes it side-by-side on mobile
           md:grid-cols-4 : Becomes 4 in a row on desktop 
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
          
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group cursor-default"
            >
              {/* Icon Container with subtle background */}
              <div className="mb-3 p-3 rounded-full bg-[#5C3B19]/5 group-hover:bg-[#5C3B19]/10 transition-colors duration-300">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-base md:text-lg font-bold text-[#3A2A1A] mb-1">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs md:text-sm text-[#8c6b4a] font-medium">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default ServiceHighlights;