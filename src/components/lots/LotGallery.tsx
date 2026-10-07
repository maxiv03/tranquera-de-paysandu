"use client";

import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

export type GalleryItem =
  { type: "video"; src: string; poster: string } | { type: "image"; src: string };

/**
 * Main viewer plus thumbnails. The video (if any) comes first and only downloads when the
 * visitor presses play. `fallback` renders when there is nothing to show.
 */
export function LotGallery({
  items,
  alt,
  fallback,
}: {
  items: GalleryItem[];
  /** Alt text base for the photos, e.g. "Lote 3 · Terneros Hereford". */
  alt: string;
  fallback: ReactNode;
}) {
  const t = useTranslations("lotPage.gallery");
  const [index, setIndex] = useState(0);

  if (items.length === 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-card">{fallback}</div>
    );
  }

  const current = items[index];
  const photoCount = items.filter((item) => item.type === "image").length;
  const photoNumber = (i: number) =>
    items.slice(0, i + 1).filter((item) => item.type === "image").length;
  const go = (delta: number) =>
    setIndex((i) => (i + delta + items.length) % items.length);

  return (
    <section aria-label={t("label")}>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-card bg-primary-strong shadow-card"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(1);
          if (event.key === "ArrowLeft") go(-1);
        }}
      >
        {current.type === "video" ? (
          <video
            key={current.src}
            src={current.src}
            poster={current.poster}
            controls
            playsInline
            preload="none"
            aria-label={t("video")}
            className="size-full object-cover"
          />
        ) : (
          <Image
            key={current.src}
            src={current.src}
            alt={`${alt} · ${t("photo", { index: photoNumber(index), total: photoCount })}`}
            fill
            sizes="(min-width: 1024px) 620px, 100vw"
            loading="eager"
            quality={60}
            fetchPriority="high"
            unoptimized={current.src.endsWith(".svg")}
            className="object-cover"
          />
        )}

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow hover:bg-surface"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
              <span className="sr-only">{t("previous")}</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute top-1/2 right-2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow hover:bg-surface"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
              <span className="sr-only">{t("next")}</span>
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <li key={item.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                className={`relative block h-16 w-20 overflow-hidden rounded-lg ring-2 transition sm:h-20 sm:w-28 ${
                  i === index
                    ? "ring-primary"
                    : "opacity-75 ring-transparent hover:opacity-100"
                }`}
              >
                <Image
                  src={item.type === "video" ? item.poster : item.src}
                  alt=""
                  fill
                  sizes="112px"
                  unoptimized={item.src.endsWith(".svg")}
                  className="object-cover"
                />
                {item.type === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
                    <Play className="size-6 fill-white text-white" aria-hidden="true" />
                  </span>
                )}
                <span className="sr-only">
                  {item.type === "video"
                    ? t("showVideo")
                    : t("showPhoto", { index: photoNumber(i) })}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
