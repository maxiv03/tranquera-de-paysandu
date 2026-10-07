"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/**
 * Muted looping clip that fills its parent. Shows the poster until it is near the viewport,
 * plays only while visible, and never autoplays for visitors who prefer reduced motion
 * (they get native controls instead).
 */
export function LoopVideo({
  src,
  poster,
  label,
  className = "",
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  // Once loaded, keep the source even when scrolled away (pausing is enough).
  const [loaded, setLoaded] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setLoaded(true);
      },
      { rootMargin: "200px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !loaded) return;
    // React does not reflect `muted` as an attribute; browsers require it for autoplay.
    video.muted = true;
    if (visible && !reducedMotion) video.play().catch(() => {});
    else video.pause();
  }, [visible, loaded, reducedMotion]);

  return (
    <video
      ref={ref}
      src={loaded ? src : undefined}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="none"
      controls={reducedMotion}
      className={`size-full object-cover ${className}`}
    />
  );
}
