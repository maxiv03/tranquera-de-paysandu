import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AuctionCard } from "@/components/auctions/AuctionCard";
import { ContactSection } from "@/components/contact/ContactSection";
import { FeaturedAuction, HomeHero } from "@/components/home/HomeHero";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { buttonStyles } from "@/components/ui/button-styles";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AuctionGridSkeleton, FeaturedAuctionSkeleton } from "@/components/ui/Skeleton";
import { Link } from "@/i18n/navigation";
import { getAuctions } from "@/lib/data/auctions";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("brand");
  return {
    title: { absolute: `${t("name")} · ${t("tagline")}` },
    description: t("description"),
    alternates: await alternatesFor("/"),
  };
}

// Sections that read auction data stream inside Suspense: cached reads under the [locale] root
// param count as URL data for the App Shell, which stays static (hero text, services, contact).
export default function HomePage() {
  return (
    <>
      <HomeHero>
        <Suspense fallback={<FeaturedAuctionSkeleton />}>
          <Featured />
        </Suspense>
      </HomeHero>
      <ServicesSection />
      <UpcomingSection />
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="container-page scroll-mt-20 py-14 sm:py-20"
      >
        <ContactSection />
      </section>
    </>
  );
}

async function Featured() {
  const [featured, next] = await getAuctions("upcoming");
  if (!featured) return null;
  return (
    <FeaturedAuction
      auction={featured}
      next={featured.status === "live" ? (next ?? null) : null}
    />
  );
}

function ServicesSection() {
  const t = useTranslations("home");
  return (
    <section aria-labelledby="services-title" className="container-page py-14 sm:py-20">
      <SectionHeading
        id="services-title"
        eyebrow={t("servicesEyebrow")}
        title={t("servicesTitle")}
        description={t("servicesDescription")}
      />
      <div className="mt-8">
        <ServiceGrid />
      </div>
    </section>
  );
}

function ScheduleLink() {
  const t = useTranslations("home");
  return (
    <Link href="/auctions" className={buttonStyles({ variant: "secondary", size: "sm" })}>
      {t("seeSchedule")}
      <ArrowRight aria-hidden="true" />
    </Link>
  );
}

function UpcomingSection() {
  const t = useTranslations("home");
  return (
    <section aria-labelledby="upcoming-title" className="bg-surface py-14 sm:py-20">
      <div className="container-page">
        <SectionHeading
          id="upcoming-title"
          eyebrow={t("upcomingEyebrow")}
          title={t("upcomingTitle")}
          action={<ScheduleLink />}
        />
        <div className="mt-8">
          <Suspense fallback={<AuctionGridSkeleton count={3} />}>
            <UpcomingList />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

/** Upcoming auctions after the featured one (shown in the hero). */
async function UpcomingList() {
  const t = await getTranslations("home");
  const auctions = (await getAuctions("upcoming")).slice(1, 4);
  if (auctions.length === 0) {
    return <EmptyState title={t("noUpcoming")} action={<ScheduleLink />} />;
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <li key={auction.id} className="flex [&>article]:flex-1">
          <AuctionCard auction={auction} />
        </li>
      ))}
    </ul>
  );
}
