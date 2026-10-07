import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getFormatter, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AuctionHero } from "@/components/auctions/AuctionHero";
import { LotCatalog } from "@/components/lots/LotCatalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AuctionHeroSkeleton, LotGridSkeleton } from "@/components/ui/Skeleton";
import {
  parseCatalogFilters,
  parseShowCount,
  type SearchParams,
} from "@/lib/catalog-filters";
import { getAllAuctions } from "@/lib/data/auctions";
import { getAuctionCatalog } from "@/lib/data/lots";

type Props = PageProps<"/[locale]/auctions/[auction]">;

export async function generateStaticParams() {
  // Cache Components needs at least one value. If the database is unreachable during the
  // build, prerender a number that does not exist (it 404s); real ones render on first visit.
  try {
    const auctions = await getAllAuctions();
    if (auctions.length) return auctions.map((a) => ({ auction: String(a.number) }));
  } catch {}
  return [{ auction: "0" }];
}

/** Auction numbers are positive integers; anything else is a 404. */
function parseNumber(value: string) {
  return /^[1-9]\d{0,6}$/.test(value) ? Number(value) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const number = parseNumber((await params).auction);
  const catalog = number ? await getAuctionCatalog(number) : null;
  if (!catalog) return {};

  const t = await getTranslations();
  const format = await getFormatter();
  const { auction } = catalog;
  return {
    title: t("auction.title", { number: auction.number }),
    description: t("auctionPage.metaDescription", {
      type: t(`auctionType.${auction.type}`),
      date: format.dateTime(new Date(auction.startsAt), "medium"),
      venue: auction.venue,
      department: auction.department,
      lots: t("units.lots", { count: auction.lotCount }),
      heads: t("units.heads", { count: auction.headCount }),
    }),
    openGraph: auction.imageUrl ? { images: [auction.imageUrl] } : undefined,
  };
}

async function loadCatalog(params: Props["params"]) {
  const number = parseNumber((await params).auction);
  return number ? getAuctionCatalog(number) : null;
}

// Both data regions stream inside Suspense: params and cached reads under the [locale] root
// param are URL data, so the App Shell keeps only the layout and the catalog heading.
export default function AuctionPage({ params, searchParams }: Props) {
  return (
    <div className="container-page py-6 sm:py-10">
      <Suspense
        fallback={
          <>
            <div className="h-5" />
            <div className="mt-5">
              <AuctionHeroSkeleton />
            </div>
          </>
        }
      >
        <AuctionHeader params={params} />
      </Suspense>

      <section
        id="catalog"
        aria-labelledby="catalog-title"
        className="mt-14 scroll-mt-20"
      >
        <CatalogHeading />
        <Suspense fallback={<LotGridSkeleton count={8} />}>
          <Catalog params={params} searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}

async function AuctionHeader({ params }: Pick<Props, "params">) {
  const catalog = await loadCatalog(params);
  if (!catalog) notFound();
  return (
    <>
      <AuctionBreadcrumbs number={catalog.auction.number} />
      <div className="mt-5">
        <AuctionHero auction={catalog.auction} />
      </div>
    </>
  );
}

function AuctionBreadcrumbs({ number }: { number: number }) {
  const t = useTranslations();
  return (
    <Breadcrumbs
      label={t("common.breadcrumb")}
      items={[
        { label: t("auctionPage.breadcrumb"), href: "/auctions" },
        { label: t("auction.title", { number }) },
      ]}
    />
  );
}

function CatalogHeading() {
  const t = useTranslations("auctionPage");
  return (
    <SectionHeading
      id="catalog-title"
      title={t("catalog")}
      description={t("catalogDescription")}
    />
  );
}

async function Catalog({ params, searchParams }: Props) {
  const [catalog, query] = await Promise.all([
    loadCatalog(params),
    searchParams as Promise<SearchParams>,
  ]);
  if (!catalog) return null;
  return (
    <LotCatalog
      auctionNumber={catalog.auction.number}
      lots={catalog.lots}
      filters={parseCatalogFilters(query)}
      show={parseShowCount(query)}
      sectionId="catalog"
      sold={catalog.auction.status === "finished"}
    />
  );
}
