import { ArrowRight, Clock, MapPin, Radio } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { LiveDot } from "@/components/auctions/StatusBadge";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { buttonStyles } from "@/components/ui/button-styles";
import { DateBlock } from "@/components/ui/DateBlock";
import { Link } from "@/i18n/navigation";
import type { Auction } from "@/lib/data/types";
import { useLocalized } from "@/lib/localized";
import { Countdown } from "./Countdown";

const HERO_IMAGE = "/images/auctions/cover-4.webp";

/**
 * Home hero: brand statement over a field photo. Static, so it ships in the App Shell; the
 * featured auction arrives through `children` (streamed inside Suspense by the page).
 */
export function HomeHero({ children }: { children?: ReactNode }) {
  const t = useTranslations();

  return (
    <section className="relative isolate overflow-hidden bg-primary-strong text-paper">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        quality={60}
        fetchPriority="high"
        className="-z-20 object-cover"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-strong/90 via-primary-strong/85 to-primary-strong/95 lg:bg-gradient-to-r lg:from-primary-strong/95 lg:via-primary-strong/80 lg:to-primary-strong/40"
        aria-hidden="true"
      />

      <div className="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-straw uppercase">
            {t("brand.tagline")}
          </p>
          <h1 className="mt-3 text-4xl leading-[1.1] font-bold text-paper sm:text-5xl">
            {t("home.title")}
          </h1>
          <p className="mt-4 text-lg text-paper/80">{t("home.intro")}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/auctions"
              className={buttonStyles({
                size: "lg",
                className: "bg-straw text-ink hover:bg-straw-soft",
              })}
            >
              {t("home.heroCta")}
              <ArrowRight aria-hidden="true" />
            </Link>
            <WhatsAppButton size="lg" />
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}

/** The live auction or, if none, the next one. Under a live one, `next` shows its countdown. */
export function FeaturedAuction({
  auction,
  next,
}: {
  auction: Auction;
  next: Auction | null;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const text = useLocalized();
  const startsAt = new Date(auction.startsAt);
  const isLive = auction.status === "live";
  const time = format.dateTime(startsAt, "time");

  return (
    <article className="rounded-card bg-surface p-5 text-ink shadow-2xl ring-1 ring-black/5 sm:p-6">
      <p
        className={`flex items-center gap-2 text-xs font-bold tracking-wider uppercase ${isLive ? "text-live" : "text-accent"}`}
      >
        {isLive && <LiveDot />}
        {isLive ? t("home.featuredLive") : t("home.featuredUpcoming")}
      </p>

      <div className="mt-3 flex items-center gap-4">
        <DateBlock date={auction.startsAt} today={auction.startsToday} size="lg" />
        <div className="min-w-0">
          <h2 className="text-2xl leading-tight font-bold">
            {t("auction.title", { number: auction.number })}
          </h2>
          {auction.title && (
            <p className="font-medium text-accent">{text(auction.title)}</p>
          )}
        </div>
      </div>

      <ul className="mt-4 space-y-1.5 text-sm text-ink-muted [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-subtle">
        <li className="flex items-center gap-2">
          <Clock aria-hidden="true" />
          <span className="font-semibold text-ink first-letter:uppercase">
            {format.dateTime(startsAt, "long")} · {t("units.time", { time })}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <MapPin aria-hidden="true" />
          {auction.venue} · {auction.department}
        </li>
      </ul>
      <p className="mt-3 font-display text-lg font-bold tabular">
        {t("units.lots", { count: auction.lotCount })}
        <span className="text-ink-subtle"> · </span>
        {t("units.heads", { count: auction.headCount })}
      </p>

      {!isLive && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold tracking-wider text-ink-subtle uppercase">
            {t("home.startsIn")}
          </p>
          <Countdown
            target={auction.startsAt}
            label={t("home.startsAt", { date: format.dateTime(startsAt, "long"), time })}
          />
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {isLive && (
          <Link
            href="/live"
            className={buttonStyles({ variant: "live", className: "flex-1" })}
          >
            <Radio aria-hidden="true" />
            {t("auction.watchLive")}
          </Link>
        )}
        <Link
          href={{
            pathname: "/auctions/[auction]",
            params: { auction: String(auction.number) },
          }}
          className={buttonStyles({
            variant: isLive ? "secondary" : "primary",
            className: "flex-1",
          })}
        >
          {t("home.viewCatalog")}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      {isLive && next && <NextUp auction={next} />}
    </article>
  );
}

/** Compact "next auction" row with its countdown, under a live featured auction. */
function NextUp({ auction }: { auction: Auction }) {
  const t = useTranslations();
  const format = useFormatter();
  const text = useLocalized();
  const startsAt = new Date(auction.startsAt);
  const time = format.dateTime(startsAt, "time");

  return (
    <div className="mt-5 border-t border-line pt-4">
      <p className="text-xs font-semibold tracking-wider text-ink-subtle uppercase">
        {t("home.featuredUpcoming")}
      </p>
      <Link
        href={{
          pathname: "/auctions/[auction]",
          params: { auction: String(auction.number) },
        }}
        className="mt-1 block font-semibold underline-offset-4 hover:text-primary hover:underline"
      >
        {t("auction.title", { number: auction.number })}
        {auction.title && (
          <span className="font-medium text-accent"> · {text(auction.title)}</span>
        )}
      </Link>
      <div className="mt-2">
        <Countdown
          size="sm"
          target={auction.startsAt}
          label={t("home.startsAt", { date: format.dateTime(startsAt, "long"), time })}
        />
      </div>
    </div>
  );
}
