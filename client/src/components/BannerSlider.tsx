import React, { useEffect, useState, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import axios, { AxiosResponse } from "axios";

const API_URL: string = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";
const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
const SWIPER_MODULES = [Autoplay, Pagination, EffectFade, Navigation];

// --- IMPROVED SCROLLING LINE COMPONENT ---
export const BannerScrollingLine = () => {
  const items = [
    { icon: "🚚", text: "Free Shipping All Over India" },
    { icon: "💰", text: "Cash on Delivery Available" },
    { icon: "🎁", text: "₹50 OFF on Online Prepaid Orders" },
    { icon: "🙏", text: "Trusted Divine Seller" },
    { icon: "⭐", text: "100% Authentic Products" },
    { icon: "✨", text: "सच्‍चाई और गुणवत्ता का वादा" },
    { icon: "🕉️", text: "Blessed with Divine Energy" },
    { icon: "📦", text: "Secure Packaging" },
  ];

  // Duplicate items for seamless infinite scroll
  const marqueeItems = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 shadow-lg z-20 border-y border-orange-400/30">
      {/* Left Fade */}
      <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-orange-600 to-transparent z-10 pointer-events-none" />
      
      <div className="flex py-3 whitespace-nowrap overflow-hidden group">
        <div className="flex animate-scroll items-center group-hover:[animation-play-state:paused]">
          {marqueeItems.map((item, index) => (
            <div key={index} className="flex items-center mx-6 select-none">
              <span className="text-xl mr-2 drop-shadow-sm filter">{item.icon}</span>
              <span className="text-sm md:text-base font-bold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] uppercase">
                {item.text}
              </span>
              <span className="ml-6 text-orange-200/50 text-xs">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Fade */}
      <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-orange-600 to-transparent z-10 pointer-events-none" />

      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 40s linear infinite;
            width: max-content;
          }
        `}
      </style>
    </div>
  );
};

interface Banner {
  _id: string;
  BannerUrl: string;
  BannerTitle?: string;
  BannerDescription?: string;
  BannerLink?: string;
}

interface BannerApiResponse {
  banners: Banner[];
  success?: boolean;
  message?: string;
}

interface BannerSliderProps {
  className?: string;
  headerHeight?: number;
  autoplayDelay?: number;
  showPlayPause?: boolean;
}

const BannerSkeleton: React.FC<{ className?: string; headerHeight?: number }> = ({ className }) => (
  <div className={`w-full relative ${className || ""} mt-4 mb-8`}>
    <div className="w-full relative overflow-hidden rounded-xl md:rounded-2xl bg-orange-50 mx-auto max-w-[98%]">
      <Skeleton className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50" style={{ aspectRatio: "21/9", minHeight: "200px" }} />
    </div>
  </div>
);

const BannerError: React.FC<{ className?: string; headerHeight?: number; onRetry?: () => void }> = ({ className, onRetry }) => (
  <div className={`w-full relative ${className || ""} py-10`}>
    <div className="w-full max-w-4xl mx-auto px-4">
      <Card className="p-8 text-center bg-gradient-to-br from-orange-50/50 to-amber-50/70 border-orange-200 shadow-inner rounded-xl">
        <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-orange-800 mb-2">Unable to load divine banners</h3>
        <p className="text-orange-600 mb-4">Please check your connection and try again</p>
        {onRetry && (
          <Button onClick={onRetry} className="bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 rounded-lg shadow-md">
            Try Again
          </Button>
        )}
      </Card>
    </div>
  </div>
);

const BannerSlider: React.FC<BannerSliderProps> = ({
  className = "",
  headerHeight = 80,
  autoplayDelay = 5000,
  showPlayPause = true,
}) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const swiperInstanceRef = useRef<SwiperType | null>(null);
  const aliveRef = useRef(true);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const res: AxiosResponse<BannerApiResponse> = await axios.get(`${API_URL}/api/getbanners`, {
        withCredentials: true,
        timeout: 10000,
      });
      if (res.data.success !== false && Array.isArray(res.data.banners)) {
        if (aliveRef.current) setBanners(res.data.banners);
      } else {
        throw new Error(res.data.message || "Failed to fetch banners");
      }
    } catch (err) {
      if (aliveRef.current) {
        setError(true);
        setBanners([]);
      }
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    fetchBanners();
    return () => {
      aliveRef.current = false;
      const s = swiperInstanceRef.current;
      if (s) {
        s.autoplay?.stop?.();
        s.destroy(true, false);
        swiperInstanceRef.current = null;
      }
    };
  }, [fetchBanners]);

  const togglePlayPause = useCallback(() => {
    const s = swiperInstanceRef.current;
    if (!s) return;
    if (isPlaying) s.autoplay?.stop?.();
    else s.autoplay?.start?.();
    setIsPlaying((p) => !p);
  }, [isPlaying]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget as HTMLImageElement;
    target.src = "/fallback-banner.jpg";
    target.onerror = null;
  }, []);

  const handleSwiperInit = useCallback((swiper: SwiperType) => {
    swiperInstanceRef.current = swiper;
    if (document.visibilityState === "hidden") {
      swiper.autoplay?.stop?.();
      setIsPlaying(false);
    }
  }, []);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setCurrentSlide(swiper.realIndex);
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      const s = swiperInstanceRef.current;
      if (!s) return;
      if (document.visibilityState === "hidden") {
        s.autoplay?.stop?.();
        setIsPlaying(false);
      } else if (!PREFERS_REDUCED_MOTION && banners.length > 1) {
        s.autoplay?.start?.();
        setIsPlaying(true);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [banners.length]);

  const swiperEffect = PREFERS_REDUCED_MOTION ? undefined : ("fade" as any);
  const swiperFadeEffect = PREFERS_REDUCED_MOTION ? undefined : { crossFade: true };
  const swiperAutoplay =
    !PREFERS_REDUCED_MOTION && banners.length > 1
      ? { delay: Math.max(2000, autoplayDelay), disableOnInteraction: false, pauseOnMouseEnter: true }
      : false;
  const swiperNavigation = banners.length > 1 ? { prevEl: ".swiper-button-prev-custom", nextEl: ".swiper-button-next-custom" } : false;

  if (loading) return <BannerSkeleton className={className} headerHeight={headerHeight} />;
  if (error) return <BannerError className={className} headerHeight={headerHeight} onRetry={fetchBanners} />;
  if (!banners.length) return null;

  return (
    <motion.section
      className={`w-full relative ${className} flex flex-col gap-0`}
      initial={PREFERS_REDUCED_MOTION ? undefined : { opacity: 0 }}
      animate={PREFERS_REDUCED_MOTION ? undefined : { opacity: 1 }}
      transition={PREFERS_REDUCED_MOTION ? undefined : { duration: 0.4 }}
    >
      {/* --- Main Slider Container --- */}
      <div className="w-full relative group">
        
        {/* Controls Overlay */}
        {showPlayPause && banners.length > 1 && (
          <div className="absolute top-4 right-4 z-30 flex items-center space-x-2 pointer-events-none">
            <div className="pointer-events-auto hidden md:flex items-center space-x-2 text-xs font-bold text-orange-900 bg-white/80 backdrop-blur-md rounded-full px-3 py-1.5 border border-orange-200/50 shadow-lg">
              <span>{String(currentSlide + 1).padStart(2, "0")}</span>
              <span className="text-orange-400">/</span>
              <span>{String(banners.length).padStart(2, "0")}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="pointer-events-auto w-8 h-8 bg-white/80 backdrop-blur-md hover:bg-white text-orange-700 rounded-full shadow-md border border-orange-200/50 transition-all hover:scale-110"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </Button>
          </div>
        )}

        <Swiper
          modules={SWIPER_MODULES}
          spaceBetween={0}
          slidesPerView={1}
          loop={banners.length > 1}
          effect={swiperEffect}
          fadeEffect={swiperFadeEffect as any}
          speed={700}
          autoplay={swiperAutoplay as any}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-white/40 !w-2 !h-2 !rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20",
            bulletActiveClass: "swiper-pagination-bullet-active !bg-gradient-to-r !from-orange-500 !to-amber-500 !w-8 !h-2 !rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] !opacity-100",
          }}
          navigation={swiperNavigation as any}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          className="w-full banner-slider z-10"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner._id} className="relative bg-orange-50">
              <div
                className="relative w-full h-full overflow-hidden cursor-pointer banner-slide group-slide"
                onClick={() =>
                  banner.BannerLink && window.open(banner.BannerLink, "_blank", "noopener,noreferrer")
                }
              >
                <img
                  src={banner.BannerUrl}
                  alt={banner.BannerTitle || `Divine Banner ${index + 1}`}
                  className="w-full h-full object-cover object-center transition-transform duration-[8000ms] ease-linear group-slide-hover:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding={index === 0 ? "sync" : "async"}
                  width={1920}
                  height={800}
                  onError={handleImageError}
                />
                
                {/* Warm Golden Overlay for Divine Feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-orange-100/5 pointer-events-none mix-blend-overlay" />
                
                {/* Bottom Gradient for Pagination Visibility */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows (Glassmorphism) */}
        {banners.length > 1 && (
          <>
            <Button
              variant="ghost"
              className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white transition-all duration-300 hover:scale-110 shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
            >
              <ChevronLeft className="w-8 h-8 stroke-[3]" />
            </Button>
            <Button
              variant="ghost"
              className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white transition-all duration-300 hover:scale-110 shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
            >
              <ChevronRight className="w-8 h-8 stroke-[3]" />
            </Button>
          </>
        )}
      </div>

      {/* --- Scrolling Line Below Slider --- */}
      <BannerScrollingLine />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .banner-slider { 
              /* Responsive Aspect Ratio calculation */
              height: auto;
              aspect-ratio: 16/9;
            }
            @media (min-width: 1024px) {
               .banner-slider { 
                 aspect-ratio: 21/9; /* Wider on desktop */
                 max-height: 600px;
               }
            }
            @media (max-width: 640px) {
              .banner-slider { 
                aspect-ratio: 4/3; /* Taller on mobile for impact */
                max-height: 500px;
              }
            }

            .banner-slider .swiper-pagination { 
              bottom: 24px !important; 
              z-index: 25; 
            }
            
            .group-slide:hover img {
                transform: scale(1.05);
            }

            /* Hide navigation on very small screens */
            .swiper-button-prev-custom.swiper-button-disabled,
            .swiper-button-next-custom.swiper-button-disabled {
              opacity: 0.3;
              pointer-events: none;
            }
          `,
        }}
      />
    </motion.section>
  );
};

export default BannerSlider;