import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Scroll-zoom hero image section, adapted from your GSAP HTML demo
// Place this between sections like Divine Collection and Divine Products.

gsap.registerPlugin(ScrollTrigger);

interface ScrollZoomHeroProps {
  imageSrc: string;
  alt?: string;
  caption?: string;
}

const desktopConfig = {
  scaleFrom: 1,
  scaleTo: 1.18,
  yFrom: 0,
  yTo: -70,
};

const mobileConfig = {
  scaleFrom: 1,
  scaleTo: 1.08,
  yFrom: 0,
  yTo: -40,
};

const ScrollZoomHero: React.FC<ScrollZoomHeroProps> = ({ imageSrc, alt, caption }) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stageEl = stageRef.current;
    const imgEl = imgRef.current;

    if (!stageEl || !imgEl) return;

    // Respect users who prefer reduced motion: no scroll animation, just show the image.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      gsap.set(imgEl, { clearProps: "all" });
      return;
    }

    const mm = gsap.matchMedia();
    let onLoad: (() => void) | null = null;

    const initAnimation = (values: typeof desktopConfig) => {
      // Only animate transform properties to avoid layout reflow.
      gsap.set(imgEl, {
        scale: values.scaleFrom,
        y: values.yFrom,
        transformOrigin: "50% 50%",
      });

      return gsap.to(imgEl, {
        scale: values.scaleTo,
        y: values.yTo,
        ease: "power2.out",
        scrollTrigger: {
          trigger: stageEl,
          start: "top bottom", // when top of hero hits bottom of viewport
          end: "center top",    // until center of hero reaches top of viewport
          scrub: 0.6,            // smooth, scroll-linked motion
          invalidateOnRefresh: true,
        },
      });
    };

    const setupAnimations = () => {
      mm.add("(min-width: 769px)", () => {
        const tween = initAnimation(desktopConfig);
        return () => tween.kill();
      });

      mm.add("(max-width: 768px)", () => {
        const tween = initAnimation(mobileConfig);
        return () => tween.kill();
      });
    };

    // Wait for the image to be loaded to prevent any jump when ScrollTrigger calculates.
    if (imgEl.complete && imgEl.naturalWidth > 0) {
      setupAnimations();
    } else {
      onLoad = () => {
        setupAnimations();
        imgEl.removeEventListener("load", onLoad as () => void);
      };
      imgEl.addEventListener("load", onLoad);
    }

    return () => {
      mm.revert();
      if (onLoad) {
        imgEl.removeEventListener("load", onLoad);
      }
    };
  }, [imageSrc]);

  return (
    <section
      ref={stageRef}
      className="relative my-0 h-screen w-full overflow-hidden"
    >
      <div className="relative w-full h-full">
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt || "Spiritual hero"}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover will-change-transform select-none pointer-events-none"
        />

        {caption && (
          <div className="absolute left-4 bottom-4 md:left-6 md:bottom-6 text-xs md:text-sm text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
            {caption}
          </div>
        )}
      </div>
    </section>
  );
};

export default ScrollZoomHero;
