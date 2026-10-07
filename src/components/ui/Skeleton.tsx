import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

/*
 * Loading placeholders for streamed sections. Each one mirrors the footprint of the real
 * component (same aspect ratios, paddings and grid), so nothing jumps when the data arrives.
 */

function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-line/70 motion-reduce:animate-none ${className}`}
    />
  );
}

/** Announces the loading state once; the bones inside are decorative. */
function Loading({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const t = useTranslations("common");
  return (
    <div role="status" className={className}>
      <span className="sr-only">{t("loading")}</span>
      <div aria-hidden="true" className="contents">
        {children}
      </div>
    </div>
  );
}

/** Same layout as AuctionCard: 16:9 cover, date block + three lines, footer row. */
export function AuctionCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card bg-surface ring-1 ring-line">
      <Bone className="aspect-[16/9] rounded-none" />
      <div className="flex gap-4 p-4">
        <Bone className="h-[5.25rem] w-16 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2.5 pt-1">
          <Bone className="h-5 w-28 rounded-full" />
          <Bone className="h-6 w-3/4" />
          <Bone className="h-4 w-1/2" />
          <Bone className="h-4 w-2/3" />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <Bone className="h-4 w-32" />
        <Bone className="h-4 w-20" />
      </div>
    </div>
  );
}

export function AuctionGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Loading className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <AuctionCardSkeleton key={i} />
      ))}
    </Loading>
  );
}

/** Same layout as LotCard: horizontal on phones (photo beside data), stacked from sm. */
export function LotCardSkeleton() {
  return (
    <div className="flex overflow-hidden rounded-card bg-surface ring-1 ring-line sm:flex-col">
      <Bone className="w-32 shrink-0 self-stretch rounded-none sm:aspect-[4/3] sm:w-auto" />
      <div className="flex-1 space-y-2.5 p-3 sm:p-4">
        <div className="flex justify-between gap-2">
          <Bone className="h-5 w-20 rounded-full" />
          <Bone className="h-4 w-16" />
        </div>
        <Bone className="h-5 w-3/4" />
        <Bone className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function LotGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <Loading className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <LotCardSkeleton key={i} />
      ))}
    </Loading>
  );
}

/** The featured auction card of the home hero. */
export function FeaturedAuctionSkeleton() {
  return (
    <Loading className="block rounded-card bg-surface p-5 shadow-2xl sm:p-6">
      <Bone className="h-3 w-28" />
      <div className="mt-3 flex items-center gap-4">
        <Bone className="h-24 w-20 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Bone className="h-7 w-3/4" />
          <Bone className="h-4 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Bone className="h-4 w-4/5" />
        <Bone className="h-4 w-3/5" />
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Bone key={i} className="h-16 rounded-lg" />
        ))}
      </div>
      <Bone className="mt-5 h-11 rounded-lg" />
    </Loading>
  );
}

/** Auction page header: cover beside the facts column. */
export function AuctionHeroSkeleton() {
  return (
    <Loading className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
      <Bone className="aspect-[16/9] rounded-card lg:aspect-[4/3]" />
      <div className="space-y-5">
        <Bone className="h-6 w-48 rounded-full" />
        <div className="flex items-center gap-4">
          <Bone className="h-24 w-20 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Bone className="h-9 w-3/4" />
            <Bone className="h-5 w-1/2" />
          </div>
        </div>
        <Bone className="h-14 w-full" />
        <Bone className="h-28 w-full rounded-card" />
        <Bone className="h-12 w-56 rounded-lg" />
      </div>
    </Loading>
  );
}

/** Lot page: gallery beside the key data, agent and auction cards. */
export function LotDetailSkeleton() {
  return (
    <Loading className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
      <div>
        <Bone className="aspect-[4/3] rounded-card" />
        <div className="mt-3 flex gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Bone key={i} className="h-16 w-20 rounded-lg sm:h-20 sm:w-28" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-3">
          <Bone className="h-6 w-40 rounded-full" />
          <Bone className="h-10 w-1/3" />
          <Bone className="h-5 w-1/2" />
        </div>
        <Bone className="h-40 rounded-card" />
        <Bone className="h-48 rounded-card" />
        <Bone className="h-24 rounded-card" />
      </div>
    </Loading>
  );
}

/** Live page: title row, 16:9 player beside the side panel, lot grid. */
export function LiveSkeleton() {
  return (
    <Loading className="block">
      <div className="flex items-center gap-4">
        <Bone className="h-8 w-28 rounded-full" />
        <Bone className="h-8 w-56" />
      </div>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_340px]">
        <Bone className="aspect-video rounded-card" />
        <div className="space-y-4 rounded-card bg-surface p-5 ring-1 ring-line">
          <Bone className="h-5 w-36 rounded-full" />
          <Bone className="h-5 w-3/4" />
          <Bone className="h-32 rounded-lg" />
          <Bone className="h-12 rounded-lg" />
          <Bone className="h-11 rounded-lg" />
        </div>
      </div>
      <Bone className="mt-12 h-8 w-64" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <LotCardSkeleton key={i} />
        ))}
      </div>
    </Loading>
  );
}

/** Service page: breadcrumb, image banner, text column beside the contact card. */
export function ServiceDetailSkeleton() {
  return (
    <Loading className="container-page block py-6 sm:py-10">
      <div className="h-5" />
      <Bone className="mt-5 h-64 rounded-card sm:h-72" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          <Bone className="h-5 w-full" />
          <Bone className="h-5 w-11/12" />
          <Bone className="h-5 w-3/4" />
        </div>
        <Bone className="h-48 rounded-card" />
      </div>
    </Loading>
  );
}
