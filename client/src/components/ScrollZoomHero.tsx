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

const desktopConfig = {
  scaleFrom: 1.3, // Starts slightly zoomed in
  scaleTo: 1,     // Ends at 100% (Full image visible)
};

const mobileConfig = {
  scaleFrom: 1.08, // Much gentler zoom for mobile so poster is not visibly cut
  scaleTo: 1,      // Ends at 100% (Full image visible)
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
        if (!target || !containerRef.current) return;

        // Play-once zoom that always finishes at scale 1 (original image size).
        gsap.fromTo(
          target,
          {
            scale: config.scaleFrom,
            transformOrigin: "center center",
          },
          {
            scale: config.scaleTo,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%", // start when the hero is nicely in view
              toggleActions: "play none none reverse", // ensure it completes to scale 1
            },
          }
        );
      };

      // Desktop Setup
      mm.add("(min-width: 769px)", () => {
        createZoomOutTween(desktopConfig, desktopImgRef.current);
      });

      // Mobile Setup
      mm.add("(max-width: 768px)", () => {
        createZoomOutTween(mobileConfig, mobileImgRef.current ?? desktopImgRef.current);
      });
    }, containerRef);

    return () => ctx.revert();
  }, [imageSrc]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden pt-4 md:pt-2 md:pb-2 bg-[#FFFBF7]"
    >
      <div
        className="relative w-full"
        style={{ aspectRatio: "21 / 10" , marginBottom:"-25px" }}
      >
        {/* Desktop image */}
        <img
          ref={desktopImgRef}
          src={imageSrc}
          alt={alt || "Hero image"}
          loading="eager"
          className="hidden md:block w-full h-full object-cover will-change-transform"
        />

        {/* Mobile image */}
        <img
          ref={mobileImgRef}
          src={mobileImageSrc || imageSrc}
          alt={alt || "Hero image"}
          loading="eager"
          className="block md:hidden w-full h-auto object-cover will-change-transform"
        />

        {caption && (
          <div className="absolute left-4 bottom-4 md:left-6 md:bottom-6 z-10 max-w-[80%]">
            <div className="text-xs md:text-sm text-white/90 inline-block">
              {caption}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScrollZoomHero;