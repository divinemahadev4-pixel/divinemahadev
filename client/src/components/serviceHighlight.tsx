import { Truck, Headphones, ShieldCheck, Flag } from "lucide-react";

const ServiceHighlights = () => {
  const items = [
    {
      icon: <Truck className="w-6 h-6 text-[#5C3B19]" />,
      title: "Free Shipping",
      desc: "Free Shipping all over India.",
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#5C3B19]" />,
      title: "24/7 Support",
      desc: "Available 24 x 7",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#5C3B19]" />,
      title: "100% Secure payments",
      desc: "COD/UPI/CARDS",
    },
    {
      icon: <Flag className="w-6 h-6 text-[#5C3B19]" />,
      title: "CULTURAL INDIA",
      desc: "Proud of Indian Culture",
    },
  ];

  return (
    <div className="w-full flex flex-wrap justify-center gap-10 py-10 bg-[#F8F2E8]">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center w-40 gap-2"
        >
          {item.icon}
          <h3 className="text-lg font-semibold text-[#3A2A1A]">
            {item.title}
          </h3>
          <p className="text-sm text-gray-700">{item.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceHighlights;
