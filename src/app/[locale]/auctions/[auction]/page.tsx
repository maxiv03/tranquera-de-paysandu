import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getFormatter, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AuctionHero } from "@/components/auctions/AuctionHero";
import { LotCatalog } from "@/components/lots/LotCatalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardGridSkeleton } from "@/components/ui/Skeleton";
import {
  parseCatalogFilters,
  parseShowCount,
  type SearchParams,
} from "@/lib/catalog-filters";
import { getAllAuctions } from "@/lib/data/auctions";
import { getAuctionCatalog } from "@/lib/data/lots";
import type { Lot } from "@/lib/data/types";

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

export default async function AuctionPage({ params, searchParams }: Props) {
  const number = parseNumber((await params).auction);
  const catalog = number ? await getAuctionCatalog(number) : null;
  if (!catalog) notFound();

  return (
    <div className="container-page py-6 sm:py-10">
      <AuctionBreadcrumbs number={catalog.auction.number} />
      <div className="mt-5">
        <AuctionHero auction={catalog.auction} />
      </div>

      <section
        id="catalog"
        aria-labelledby="catalog-title"
        className="mt-14 scroll-mt-20"
      >
        <CatalogHeading />
        {/* Filters read the URL: only this part renders per request. */}
        <Suspense
          fallback={
            <CardGridSkeleton
              count={4}
              aspect="aspect-[4/3]"
              columns="sm:grid-cols-2 lg:grid-cols-4"
            />
          }
        >
          <FilteredCatalog
            number={catalog.auction.number}
            sold={catalog.auction.status === "finished"}
            lots={catalog.lots}
            searchParams={searchParams}
          />
        </Suspense>
      </section>
    </div>
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

async function FilteredCatalog({
  number,
  sold,
  lots,
  searchParams,
}: {
  number: number;
  sold: boolean;
  lots: Lot[];
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  return (
    <LotCatalog
      auctionNumber={number}
      lots={lots}
      filters={parseCatalogFilters(params)}
      show={parseShowCount(params)}
      sectionId="catalog"
      sold={sold}
    />
  );
}
