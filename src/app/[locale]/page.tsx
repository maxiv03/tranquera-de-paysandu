import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AuctionCard } from "@/components/auctions/AuctionCard";
import { ContactSection } from "@/components/contact/ContactSection";
import { HomeHero } from "@/components/home/HomeHero";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { buttonStyles } from "@/components/ui/button-styles";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import { getAuctions } from "@/lib/data/auctions";
import type { Auction } from "@/lib/data/types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("brand");
  return {
    title: { absolute: `${t("name")} · ${t("tagline")}` },
    description: t("description"),
  };
}

export default async function HomePage() {
  // The live auction or, if none, the next one is featured; the rest follow in the list.
  const [featured = null, ...rest] = await getAuctions("upcoming");

  return (
    <>
      <HomeHero featured={featured} next={featured?.status === "live" ? rest[0] : null} />
      <ServicesSection />
      <UpcomingSection auctions={rest.slice(0, 3)} />
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

function UpcomingSection({ auctions }: { auctions: Auction[] }) {
  const t = useTranslations("home");
  const scheduleLink = (
    <Link href="/auctions" className={buttonStyles({ variant: "secondary", size: "sm" })}>
      {t("seeSchedule")}
      <ArrowRight aria-hidden="true" />
    </Link>
  );

  return (
    <section aria-labelledby="upcoming-title" className="bg-surface py-14 sm:py-20">
      <div className="container-page">
        <SectionHeading
          id="upcoming-title"
          eyebrow={t("upcomingEyebrow")}
          title={t("upcomingTitle")}
          action={scheduleLink}
        />
        {auctions.length > 0 ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {auctions.map((auction) => (
              <li key={auction.id} className="flex [&>article]:flex-1">
                <AuctionCard auction={auction} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8">
            <EmptyState title={t("noUpcoming")} action={scheduleLink} />
          </div>
        )}
      </div>
    </section>
  );
}
