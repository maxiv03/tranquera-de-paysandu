"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

/**
 * OpenStreetMap with a branded pin (and, for lots, a circle that marks the approximate area). Leaflet (~40 KB)
 * is only downloaded when the map gets near the viewport. Scroll-wheel zoom is off so the page
 * keeps scrolling over the map.
 */
export function LocationMap({
  latitude,
  longitude,
  label,
  loadingLabel,
  approximate = false,
  zoom = 10,
  className = "aspect-[16/10] sm:aspect-auto sm:h-[350px]",
}: {
  latitude: number;
  longitude: number;
  /** Draw a circle around the pin: the position is only the area, not the exact place. */
  approximate?: boolean;
  zoom?: number;
  /** Size of the map box. */
  className?: string;
  /** Accessible name of the map region. */
  label: string;
  loadingLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const L = await import("leaflet");
        if (cancelled) return;

        const position: [number, number] = [latitude, longitude];
        map = L.map(container, {
          scrollWheelZoom: false,
          attributionControl: true,
        }).setView(position, zoom);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        if (approximate)
          L.circle(position, {
            radius: 2500,
            color: "#2e4a36",
            weight: 1.5,
            fillColor: "#2e4a36",
            fillOpacity: 0.12,
          }).addTo(map);
        L.marker(position, {
          keyboard: false,
          icon: L.divIcon({
            className: "",
            iconSize: [28, 36],
            iconAnchor: [14, 34],
            html: `<svg viewBox="0 0 28 36" width="28" height="36" aria-hidden="true"><path d="M14 35s12-11.6 12-21A12 12 0 0 0 2 14c0 9.4 12 21 12 21Z" fill="#2e4a36" stroke="#f7f3ea" stroke-width="2"/><circle cx="14" cy="14" r="4.5" fill="#d8b25c"/></svg>`,
          }),
        }).addTo(map);
        setReady(true);
      },
      { rootMargin: "300px" },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      map?.remove();
    };
  }, [latitude, longitude, approximate, zoom]);

  return (
    <div
      className={`relative overflow-hidden rounded-card ring-1 ring-line ${className}`}
    >
      <div
        ref={containerRef}
        role="region"
        aria-label={label}
        className="absolute inset-0 z-0"
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-soft text-sm text-ink-muted">
          {loadingLabel}
        </div>
      )}
    </div>
  );
}
