import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
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
  
  // Scroll Logic
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

  // Mouse drag handlers
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
    const walk = (x - startX.current) * 2; 
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-orange-50/50 to-white">
        <div className="flex justify-center space-x-4 max-w-7xl mx-auto px-4 overflow-hidden">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="w-56 h-72 rounded-2xl bg-orange-100/50" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 flex flex-col items-center justify-center bg-orange-50/30">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-lg">
          <Sparkles className="w-10 h-10 text-orange-500 mx-auto mb-3" />
          <p className="text-orange-800 font-medium mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
            Refresh
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12 md:py-16 bg-[#FFFBF7]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-100/40 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-orange-600 font-bold tracking-wider text-xs uppercase mb-2 block">Sacred Offerings</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">
              Divine <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Collection</span>
            </h2>
          </motion.div>
          
          {/* Subtle scroll hint */}
          <div className="hidden md:flex items-center gap-2 text-orange-400 text-sm font-medium">
            <span>Scroll to explore</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Categories Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-12 pt-2 px-1 scrollbar-hide cursor-grab active:cursor-grabbing"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex-shrink-0 snap-center group"
              onClick={() => navigate(`/category/${category.slug}`)}
            >
              {/* --- NEW CARD DESIGN --- */}
              <div className="w-56 h-80 md:w-64 md:h-96 relative rounded-[2rem] overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2">
                
                {/* Image */}
                <div className="absolute inset-0">
                  <img
                    src={category.image || "/fallback.jpg"}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Dark Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-950/90 via-orange-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                </div>

                {/* Inner Border / Frame (Divine Feel) */}
                <div className="absolute inset-3 border border-white/20 rounded-[1.5rem] pointer-events-none transition-colors duration-300 group-hover:border-orange-200/60" />

                {/* Top Badge */}
                {category.productCount !== undefined && (
                  <Badge className="absolute top-5 right-5 bg-white/20 backdrop-blur-md text-white border-0 hover:bg-white/30 transition-colors shadow-sm">
                    {category.productCount} Items
                  </Badge>
                )}

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-center z-10">
                  {/* Decorative line */}
                  <div className="w-8 h-0.5 bg-orange-400 mx-auto mb-3 transition-all duration-300 group-hover:w-16" />
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1 font-serif tracking-wide drop-shadow-md">
                    {category.name}
                  </h3>
                  
                  {/* Hidden description/button reveals on hover */}
                  <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center mt-2">
                    <span className="text-orange-200 text-sm font-medium tracking-wider uppercase flex items-center gap-1">
                      Shop Now <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default CategoryGridModern;