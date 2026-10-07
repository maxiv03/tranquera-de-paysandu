import { useTranslations } from "next-intl";
import { useId } from "react";
import { LogoMark } from "@/components/brand/LogoMark";

/** Default cover for auctions and lots without an image: brand mark over a fence pattern. */
export function BrandCover({ label }: { label?: string }) {
  const t = useTranslations();
  const patternId = useId();

  return (
    <div
      role="img"
      aria-label={label ?? t("image.noPhoto")}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-primary-strong text-paper"
    >
      <svg className="absolute inset-0 size-full opacity-[0.09]" aria-hidden="true">
        <defs>
          <pattern id={patternId} width="56" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 8h56M0 20h56M0 32h56" stroke="currentColor" strokeWidth="2" />
            <path d="M4 0v40" stroke="currentColor" strokeWidth="3" />
            <path d="M6 32 54 8" stroke="currentColor" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <LogoMark className="relative size-12 drop-shadow-sm" />
      <span className="relative text-center leading-tight">
        <span className="block font-display text-lg font-bold">
          {t("brand.shortName")}
        </span>
        <span className="block text-[0.65rem] font-semibold tracking-[0.2em] text-straw uppercase">
          {t("brand.place")}
        </span>
      </span>
    </div>
  );
}
