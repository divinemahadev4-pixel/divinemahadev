import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollZoomHeroProps {
  imageSrc: string;
  mobileImageSrc?: string;
  alt?: string;
  caption?: string;
}

// CONFIGURATION:
// scaleFrom: 1.4 = Starts "Zoomed Up" (Big/Cropped)
// scaleTo: 1.0   = Ends at "Original Image Full Width" (Fits screen)
const desktopConfig = {
  scaleFrom: 1.4, 
  scaleTo: 1,     
};

const mobileConfig = {
  scaleFrom: 1.25, 
  scaleTo: 1,     
};

const ScrollZoomHero: React.FC<ScrollZoomHeroProps> = ({ imageSrc, mobileImageSrc, alt, caption }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const desktopImgRef = useRef<HTMLImageElement | null>(null);
  const mobileImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const createZoomOutTween = (config: typeof desktopConfig, target: HTMLImageElement | null) => {
        if (!target) return;
        // 1. Initial State: Set image to be BIG (Zoomed Up)
        gsap.set(target, {
          scale: config.scaleFrom,
          transformOrigin: "center center",
        });
        
        // 2. Animation: Shrink down to Original Full Width (same behavior as your snippet)
        gsap.to(target, {
          scale: config.scaleTo, // Goes to 1 (Normal size)
          duration: 2,           // Takes 2 seconds to settle
          ease: "power2.out",    // Starts fast, slows down gently
          scrollTrigger: {
            trigger: containerRef.current,
            // START: When the top of the image hits 80% down the viewport.
            // This ensures it starts animating AS SOON AS you scroll to it.
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      };

      // Desktop
      mm.add("(min-width: 769px)", () => {
        createZoomOutTween(desktopConfig, desktopImgRef.current);
      });

      // Mobile
      mm.add("(max-width: 768px)", () => {
        createZoomOutTween(mobileConfig, mobileImgRef.current ?? desktopImgRef.current);
      });
    }, containerRef);

    return () => ctx.revert();
  }, [imageSrc]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden md:bg-black"
    >
      <div className="relative w-full h-full">
        {/* Desktop image */}
        <img
          ref={desktopImgRef}
          src={imageSrc}
          alt={alt || "Hero image"}
          loading="eager"
          className="hidden md:block absolute inset-0 w-full h-full object-cover will-change-transform"
        />

        {/* Mobile image (falls back to desktop image if mobileImageSrc is not provided) */}
        <img
          ref={mobileImgRef}
          src={mobileImageSrc || imageSrc}
          alt={alt || "Hero image"}
          loading="eager"
          className="block md:hidden absolute inset-0 w-full h-full object-cover will-change-transform"
        />

        {caption && (
          <div className="absolute left-4 bottom-4 md:left-6 md:bottom-6 z-10 max-w-[80%]">
            <div className="text-xs md:text-sm text-white/90 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 inline-block">
              {caption}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScrollZoomHero;