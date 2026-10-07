import { Check, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AuctionTypeBadge } from "@/components/auctions/AuctionTypeBadge";
import { StatusBadge } from "@/components/auctions/StatusBadge";
import { AgentCard } from "@/components/lots/AgentCard";
import { CategoryBadge } from "@/components/lots/CategoryBadge";
import { LotGallery, type GalleryItem } from "@/components/lots/LotGallery";
import { LotNavigation } from "@/components/lots/LotNavigation";
import { ShareButton } from "@/components/lots/ShareButton";
import { Badge } from "@/components/ui/Badge";
import { LocationMap } from "@/components/map/LocationMap";
import { BrandCover } from "@/components/ui/BrandCover";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DateBlock } from "@/components/ui/DateBlock";
import { LotDetailSkeleton } from "@/components/ui/Skeleton";
import { Stat } from "@/components/ui/Stat";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getAllAuctions } from "@/lib/data/auctions";
import { getAuctionCatalog, getLotDetail } from "@/lib/data/lots";
import type { LotDetail } from "@/lib/data/types";
import { pickLocalized, useLocalized } from "@/lib/localized";
import { posterFor } from "@/lib/media";
import { alternatesFor } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

type Props = PageProps<"/[locale]/auctions/[auction]/lots/[lot]">;

const POSITIVE_INT = /^[1-9]\d{0,6}$/;

export async function generateStaticParams() {
  // Every lot of every auction. Cache Components needs at least one value: if the database
  // is unreachable during the build, prerender a lot that does not exist (it 404s).
  try {
    const auctions = await getAllAuctions();
    const catalogs = await Promise.all(auctions.map((a) => getAuctionCatalog(a.number)));
    const params = catalogs.flatMap((catalog) =>
      catalog
        ? catalog.lots.map((lot) => ({
            auction: String(catalog.auction.number),
            lot: String(lot.number),
          }))
        : [],
    );
    if (params.length) return params;
  } catch {}
  return [{ auction: "0", lot: "0" }];
}

async function loadLot(params: Props["params"]) {
  const { auction, lot } = await params;
  if (!POSITIVE_INT.test(auction) || !POSITIVE_INT.test(lot)) return null;
  return getLotDetail(Number(auction), Number(lot));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const detail = await loadLot(params);
  if (!detail) return {};
  const t = await getTranslations();
  const format = await getFormatter();
  const { lot, auction } = detail;

  return {
    title: `${t("lot.title", { number: lot.number })} · ${t("auction.title", { number: auction.number })}`,
    description: t("lotPage.metaDescription", {
      heads: t("units.heads", { count: lot.headCount }),
      category: t(`lotCategory.${lot.category}`),
      breed: pickLocalized(lot.breed, await getLocale()),
      weight: t("units.kg", { value: format.number(lot.avgWeightKg, "integer") }),
      location: lot.locationLabel
        ? `${lot.locationLabel}, ${lot.department}`
        : lot.department,
      auction: auction.number,
      date: format.dateTime(new Date(auction.startsAt), "medium"),
    }),
    // The share image comes from opengraph-image.tsx next to this page.
    alternates: await alternatesFor({
      pathname: "/auctions/[auction]/lots/[lot]",
      params: { auction: String(auction.number), lot: String(lot.number) },
    }),
  };
}

// The whole lot view depends on params and cached reads (URL data), so it streams inside
// Suspense with a skeleton of the same layout.
export default function LotPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="container-page py-6 sm:py-10">
          <div className="h-5" />
          <div className="mt-5">
            <LotDetailSkeleton />
          </div>
        </div>
      }
    >
      <LotLoader params={params} />
    </Suspense>
  );
}

async function LotLoader({ params }: Pick<Props, "params">) {
  const detail = await loadLot(params);
  if (!detail) notFound();
  return <LotView detail={detail} />;
}

function LotView({ detail }: { detail: LotDetail }) {
  const t = useTranslations();
  const format = useFormatter();
  const locale = useLocale() as Locale;
  const { lot, auction } = detail;

  const sold = auction.status === "finished";
  const lotTitle = t("lot.title", { number: lot.number });
  const auctionTitle = t("auction.title", { number: auction.number });
  const text = useLocalized();
  const breed = text(lot.breed);
  const category = t(`lotCategory.${lot.category}`);
  const subtitle = t("lotPage.subtitle", {
    count: format.number(lot.headCount, "integer"),
    category: category.toLocaleLowerCase(locale),
    breed,
  });
  const place = lot.locationLabel
    ? `${lot.locationLabel}, ${lot.department}`
    : lot.department;
  const url = absoluteUrl(
    getPathname({
      locale,
      href: {
        pathname: "/auctions/[auction]/lots/[lot]",
        params: { auction: String(auction.number), lot: String(lot.number) },
      },
    }),
  );
  const auctionHref = {
    pathname: "/auctions/[auction]" as const,
    params: { auction: String(auction.number) },
  };

  const gallery: GalleryItem[] = [
    ...(lot.videoUrl
      ? [{ type: "video" as const, src: lot.videoUrl, poster: posterFor(lot.videoUrl) }]
      : []),
    ...lot.photos.map((photo) => ({ type: "image" as const, src: photo.url })),
  ];

  return (
    <div className="container-page py-6 sm:py-10">
      <Breadcrumbs
        label={t("common.breadcrumb")}
        items={[
          { label: t("auctionPage.breadcrumb"), href: "/auctions" },
          { label: auctionTitle, href: auctionHref },
          { label: lotTitle },
        ]}
      />

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        {/* Desktop: the gallery stays in view while the details column scrolls. */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <LotGallery
            items={gallery}
            alt={`${lotTitle} · ${category} ${breed}`}
            fallback={<BrandCover label={t("image.noPhoto")} />}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={lot.category} />
              {sold ? (
                <Badge tone="sold">
                  <Check className="size-3.5" aria-hidden="true" />
                  {t("lot.sold")}
                </Badge>
              ) : (
                <StatusBadge status={auction.status} />
              )}
            </div>
            <h1 className="mt-3 text-3xl leading-tight font-bold sm:text-4xl">
              {lotTitle}
            </h1>
            <p className="mt-1 text-lg text-ink-muted">{subtitle}</p>
          </div>

          <section
            aria-labelledby="key-data"
            className="rounded-card bg-surface p-4 ring-1 ring-line sm:p-5"
          >
            <h2 id="key-data" className="sr-only">
              {t("lotPage.keyData")}
            </h2>
            {sold && lot.referencePriceUsdPerKg !== null && (
              <dl className="mb-4 flex items-baseline justify-between gap-3 rounded-lg bg-accent-soft px-4 py-3">
                <dt className="text-sm font-medium text-accent-hover">
                  {t("lot.referencePrice")}
                </dt>
                <dd className="font-display text-2xl font-bold text-accent-hover tabular">
                  {t("units.usdPerKg", {
                    value: format.number(lot.referencePriceUsdPerKg, "price"),
                  })}
                </dd>
              </dl>
            )}
            <dl className="grid grid-cols-3 gap-4">
              <Stat
                label={t("lot.heads")}
                value={format.number(lot.headCount, "integer")}
                emphasis
              />
              <Stat label={t("lot.category")} value={category} emphasis />
              <Stat
                label={t("lot.avgWeight")}
                value={t("units.kg", {
                  value: format.number(lot.avgWeightKg, "integer"),
                })}
                emphasis
              />
            </dl>
            <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4">
              <Stat label={t("lot.breed")} value={breed} />
              <Stat label={t("lotPage.department")} value={lot.department} />
            </dl>
          </section>

          {lot.agent && (
            <AgentCard
              agent={lot.agent}
              message={t("lotPage.agentMessage", {
                agent: lot.agent.name.split(" ")[0],
                lot: lot.number,
                auction: auction.number,
                heads: t("units.heads", { count: lot.headCount }),
                category: category.toLocaleLowerCase(locale),
                url,
              })}
            />
          )}

          {lot.description && (
            <div>
              <h2 className="font-sans text-xs font-semibold tracking-wider text-ink-subtle uppercase">
                {t("lotPage.description")}
              </h2>
              <p className="mt-1 text-ink-muted">{text(lot.description)}</p>
            </div>
          )}

          <div>
            <h2 className="font-sans text-xs font-semibold tracking-wider text-ink-subtle uppercase">
              {sold ? t("lotPage.soldIn") : t("lotPage.inAuction")}
            </h2>
            <Link
              href={auctionHref}
              className="mt-2 flex items-center gap-3 rounded-card bg-surface p-3 ring-1 ring-line transition-shadow hover:shadow-card"
            >
              <DateBlock date={auction.startsAt} today={auction.startsToday} />
              <span className="min-w-0">
                <span className="block font-display text-lg font-bold">
                  {auctionTitle}
                </span>
                {auction.title && (
                  <span className="block text-sm font-medium text-accent">
                    {text(auction.title)}
                  </span>
                )}
                <span className="mt-1 block text-sm text-ink-muted tabular">
                  {t("units.time", {
                    time: format.dateTime(new Date(auction.startsAt), "time"),
                  })}{" "}
                  · {auction.venue}
                </span>
                <span className="mt-1.5 block">
                  <AuctionTypeBadge type={auction.type} />
                </span>
              </span>
            </Link>
          </div>

          <div className="-ml-4">
            <ShareButton
              url={url}
              title={`${lotTitle} · ${auctionTitle}`}
              text={t("lotPage.shareText", {
                lot: lot.number,
                auction: auction.number,
                summary: subtitle,
              })}
            />
          </div>
        </div>
      </div>

      {lot.latitude !== null && lot.longitude !== null && (
        <section aria-labelledby="lot-location" className="mt-12">
          <h2 id="lot-location" className="text-2xl font-bold">
            {t("lotPage.location")}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-ink-muted">
            <MapPin className="size-4 text-ink-subtle" aria-hidden="true" />
            {place}
          </p>
          <div className="mt-4">
            <LocationMap
              approximate
              latitude={lot.latitude}
              longitude={lot.longitude}
              label={t("lotPage.mapLabel", { lot: lot.number })}
              loadingLabel={t("lotPage.loadingMap")}
            />
          </div>
          <p className="mt-2 text-xs text-ink-subtle">{t("lotPage.approxLocation")}</p>
        </section>
      )}

      <div className="mt-12">
        <LotNavigation
          auctionNumber={auction.number}
          previous={detail.previousLotNumber}
          next={detail.nextLotNumber}
          position={detail.position}
          total={detail.total}
        />
      </div>
    </div>
  );
}
