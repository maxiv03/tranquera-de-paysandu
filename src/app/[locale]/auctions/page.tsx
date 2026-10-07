import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AuctionCard } from "@/components/auctions/AuctionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AuctionGridSkeleton } from "@/components/ui/Skeleton";
import { TabLinks } from "@/components/ui/TabLinks";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { parseAuctionListParams, type SearchParams } from "@/lib/catalog-filters";
import { getAuctions } from "@/lib/data/auctions";
import { AUCTION_TYPES, type AuctionType } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auctions");
  return { title: t("metaTitle"), description: t("description") };
}

export default function AuctionsPage({ searchParams }: PageProps<"/[locale]/auctions">) {
  const t = useTranslations("auctions");

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeading as="h1" title={t("title")} description={t("description")} />
      <Suspense fallback={<AuctionGridSkeleton count={3} />}>
        <AuctionResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function AuctionResults({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { view, type } = parseAuctionListParams(await searchParams);
  const t = await getTranslations();
  const [upcoming, finished] = await Promise.all([
    getAuctions("upcoming"),
    getAuctions("finished"),
  ]);

  const ofType = (list: typeof upcoming, value?: AuctionType) =>
    value ? list.filter((a) => a.type === value) : list;
  const pool = view === "finished" ? finished : upcoming;
  const auctions = ofType(pool, type);

  // Query helpers: the default view and "all types" stay out of the URL.
  const query = (next: { view?: string; type?: string }) =>
    Object.fromEntries(Object.entries(next).filter(([, v]) => v)) as Record<
      string,
      string
    >;
  const viewParam = view === "finished" ? "finished" : undefined;

  return (
    <>
      <div className="mt-8 flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <TabLinks
          label={t("auctions.scope")}
          items={(["upcoming", "finished"] as const).map((key) => ({
            key,
            label: t(`auctions.${key}`),
            href: {
              pathname: "/auctions",
              query: query({ view: key === "finished" ? key : undefined, type }),
            },
            active: view === key,
            count: ofType(key === "finished" ? finished : upcoming, type).length,
          }))}
        />
        <FilterChips
          label={t("auctions.type")}
          options={[
            {
              key: "all",
              label: t("filters.all"),
              href: { pathname: "/auctions", query: query({ view: viewParam }) },
              active: !type,
              count: pool.length,
            },
            ...AUCTION_TYPES.map((value) => ({
              key: value,
              label: t(`auctionTypeShort.${value}`),
              href: {
                pathname: "/auctions" as const,
                query: query({ view: viewParam, type: value }),
              },
              active: type === value,
              count: ofType(pool, value).length,
            })),
          ]}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {t("auctions.count", { count: auctions.length })}
      </p>

      {auctions.length > 0 ? (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.map((auction, index) => (
            <li key={auction.id} className="flex">
              <div className="flex w-full flex-col [&>article]:flex-1">
                <AuctionCard auction={auction} eager={index < 2} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8">
          <EmptyState
            title={
              view === "finished"
                ? t("auctions.emptyFinishedTitle")
                : t("auctions.emptyUpcomingTitle")
            }
            description={t("auctions.emptyDescription")}
            action={<WhatsAppButton size="sm" />}
          />
        </div>
      )}
    </>
  );
}
