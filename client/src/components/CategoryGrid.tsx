import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  productCount?: number;
}

const CategoryGridModern: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/getAllData`, { withCredentials: true });
        setCategories(data?.data?.categories ?? []);
        setError(null);
      } catch {
        setError("Unable to load divine categories.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Mouse drag handlers for horizontal scroll
  const onMouseDown = (e: React.MouseEvent) => {
    if (scrollRef.current) {
      isDragging.current = true;
      scrollRef.current.classList.add("dragging");
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeft.current = scrollRef.current.scrollLeft;
    }
  };

  const onMouseLeave = () => {
    if (scrollRef.current) {
      isDragging.current = false;
      scrollRef.current.classList.remove("dragging");
    }
  };

  const onMouseUp = () => {
    if (scrollRef.current) {
      isDragging.current = false;
      scrollRef.current.classList.remove("dragging");
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // scroll-fast
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-orange-50 to-amber-50/30 text-center">
        <h3 className="mb-6 text-2xl font-extrabold text-orange-700">Loading Divine Collections...</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 max-w-7xl mx-auto px-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-3">
                <Skeleton className="w-24 h-24 rounded-full bg-orange-100 animate-pulse" />
                <Skeleton className="w-20 h-3 rounded-full bg-orange-200" />
              </div>
            ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col items-center justify-center min-h-[200px]">
        <div className="max-w-md text-center bg-white shadow-lg rounded-2xl p-6 border border-orange-200">
          <Sparkles className="w-10 h-10 text-orange-500 mx-auto mb-3" />
          <p className="text-base font-semibold mb-3 text-orange-700">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-5 py-2 rounded-xl font-medium text-sm"
          >
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-16 pb-12 bg-gradient-to-br from-white via-orange-50 to-amber-50/30">
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header - Right Aligned and Smaller */}
        <motion.header
          className="mb-8 text-left max-w-2xl "
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-orange-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Divine <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Collection</span>
          </h2>
        </motion.header>

        {/* Horizontal scroll drag container - Smaller spacing */}
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-pl-4 pb-6 cursor-grab"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((category) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center cursor-pointer flex-shrink-0 w-40 snap-center group"
              onClick={() => navigate(`/category/${category.slug}`)}
            >
              {/* Round Card Container - Smaller */}
              <div className="relative rounded-full overflow-hidden bg-gradient-to-br from-white to-orange-50/70 shadow-md border-2 border-orange-200/50 group-hover:border-orange-300 transition-all duration-400 w-32 h-32 mb-3">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <img
                    src={category.image || "/fallback.jpg"}
                    alt={category.name}
                    className="object-cover w-full h-full transition-transform duration-600 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Spiritual Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/20 to-orange-100/40 rounded-full" />
                  
                  {/* Sacred Symbol Overlay - Smaller */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <ShoppingCart className="w-4 h-4 text-orange-700" />
                    </div>
                  </div>
                </div>

                {/* Product Count Badge - Smaller */}
                {category.productCount !== undefined && (
                  <Badge className="absolute top-2 right-2 bg-orange-600 text-white font-semibold px-1.5 py-0.5 rounded-full text-xs shadow-md">
                    {category.productCount}
                  </Badge>
                )}
              </div>

              {/* Category Name Below Card - Smaller */}
              <div className="text-center space-y-1.5">
                <h3 className="text-sm font-semibold text-orange-900 group-hover:text-orange-700 transition-colors duration-300 leading-tight">
                  {category.name}
                </h3>
                <Button 
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-sm hover:shadow transition-all duration-300"
                  size="sm"
                >
                  Explore
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicator - Smaller */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1.5">
            {categories.slice(0, 4).map((_, index) => (
              <div
                key={index}
                className="w-1.5 h-1.5 rounded-full bg-orange-300 opacity-50 transition-opacity duration-300"
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .dragging {
          cursor: grabbing;
          scroll-behavior: auto;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .overflow-x-auto {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </section>
  );
};

export default CategoryGridModern;