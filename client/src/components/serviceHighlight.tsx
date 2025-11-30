import React from "react";
import { Truck, Headphones, ShieldCheck } from "lucide-react";

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
      // REPLACED GEM WITH INDIAN FLAG IMAGE
      icon: (
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" 
          alt="Indian Flag" 
          className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-sm" 
        />
      ),
      title: "Cultural India",
      desc: "Authentic Indian Heritage",
    },
  ];

  return (
    <div className="w-full bg-[#F8F2E8] py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
          
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group cursor-default"
            >
              {/* Icon Container */}
              <div className="mb-3 p-3 rounded-full bg-[#5C3B19]/5 group-hover:bg-[#5C3B19]/10 transition-colors duration-300 flex items-center justify-center">
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