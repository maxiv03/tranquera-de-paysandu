import { Check, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { Suspense } from "react";
import { AuctionCard } from "@/components/auctions/AuctionCard";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonStyles } from "@/components/ui/button-styles";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AuctionGridSkeleton, ServiceDetailSkeleton } from "@/components/ui/Skeleton";
import { redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { COMPANY } from "@/lib/company";
import { getAuctions } from "@/lib/data/auctions";
import { SERVICES, serviceBySlug, type Service } from "@/lib/services";

type Props = PageProps<"/[locale]/services/[service]">;

export async function generateStaticParams() {
  const current = (await rootLocale()) as Locale;
  return SERVICES.map((service) => ({ service: service.slugs[current] }));
}

/** The service for this locale's slug. A slug from the other locale redirects to this one's. */
async function loadService(params: Props["params"]): Promise<Service> {
  const { locale, service: slug } = await params;
  const current = locale as Locale;
  const service = serviceBySlug(current, slug);
  if (service) return service;

  const other = routing.locales.find((l) => l !== current)!;
  const translated = serviceBySlug(other, slug);
  if (translated) {
    redirect({
      href: {
        pathname: "/services/[service]",
        params: { service: translated.slugs[current] },
      },
      locale: current,
    });
  }
  notFound();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await loadService(params);
  const t = await getTranslations("services");
  return {
    title: t(`${service.key}.title`),
    description: t(`${service.key}.summary`),
    openGraph: { images: [service.image] },
  };
}

// Everything depends on the slug (URL data), so the content streams inside Suspense.
export default function ServicePage({ params }: Props) {
  return (
    <Suspense fallback={<ServiceDetailSkeleton />}>
      <ServiceLoader params={params} />
    </Suspense>
  );
}

async function ServiceLoader({ params }: Pick<Props, "params">) {
  return <ServiceView service={await loadService(params)} />;
}

function ServiceView({ service }: { service: Service }) {
  const t = useTranslations();
  const locale = useLocale();
  const title = t(`services.${service.key}.title`);
  const points = t.raw(`services.${service.key}.points`) as string[];
  const steps = t.raw(`services.${service.key}.steps`) as {
    title: string;
    text: string;
  }[];

  return (
    <div className="container-page py-6 sm:py-10">
      <Breadcrumbs
        label={t("common.breadcrumb")}
        items={[
          { label: t("servicesPage.breadcrumb"), href: "/services" },
          { label: title },
        ]}
      />

      <header className="relative isolate mt-5 overflow-hidden rounded-card bg-primary-strong px-5 py-10 text-paper sm:px-10 sm:py-14">
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 1152px) 1120px, 100vw"
          loading="eager"
          fetchPriority="high"
          className="-z-20 object-cover"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-strong/95 via-primary-strong/85 to-primary-strong/40"
          aria-hidden="true"
        />
        <span className="inline-flex size-12 items-center justify-center rounded-lg bg-straw text-ink">
          <ServiceIcon service={service.key} />
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-bold text-paper sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-paper/85">
          {t(`services.${service.key}.summary`)}
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="text-lg leading-relaxed text-ink-muted">
            {t(`services.${service.key}.description`)}
          </p>

          <h2 className="mt-10 text-2xl font-bold">{t("servicesPage.includes")}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <li
                key={point}
                className="flex gap-3 rounded-lg bg-surface p-4 ring-1 ring-line"
              >
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-2xl font-bold">{t("servicesPage.process")}</h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-card bg-surface p-5 ring-1 ring-line"
              >
                <span className="font-display text-3xl font-bold text-accent tabular">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card bg-surface p-5 ring-1 ring-line sm:p-6">
            <h2 className="text-xl font-bold">{t("servicesPage.askTitle")}</h2>
            <p className="mt-1 text-sm text-ink-muted">
              {t("servicesPage.askDescription")}
            </p>
            <div className="mt-5 grid gap-2">
              <WhatsAppButton
                label={t("servicesPage.ask")}
                message={t("servicesPage.askMessage", {
                  service: title.toLocaleLowerCase(locale),
                })}
              />
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                className={buttonStyles({ variant: "secondary" })}
              >
                <Phone aria-hidden="true" />
                {COMPANY.phone}
              </a>
            </div>
          </div>
        </aside>
      </div>

      {service.auctionType && (
        <section aria-labelledby="next-dates" className="mt-14">
          <SectionHeading id="next-dates" title={t("servicesPage.nextDates")} />
          <div className="mt-6">
            <Suspense fallback={<AuctionGridSkeleton count={2} />}>
              <NextDates type={service.auctionType} />
            </Suspense>
          </div>
        </section>
      )}

      <section aria-labelledby="other-services" className="mt-14">
        <SectionHeading id="other-services" title={t("servicesPage.otherServices")} />
        <div className="mt-6">
          <ServiceGrid exclude={service.key} />
        </div>
      </section>
    </div>
  );
}

/** Upcoming auctions of the service's type (screen auctions or fairs). */
async function NextDates({ type }: { type: "screen" | "fair" }) {
  const t = await getTranslations("servicesPage");
  const auctions = await getAuctions("upcoming", type);
  if (auctions.length === 0) return <EmptyState title={t("noDates")} />;
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.slice(0, 3).map((auction) => (
        <li key={auction.id} className="flex [&>article]:flex-1">
          <AuctionCard auction={auction} />
        </li>
      ))}
    </ul>
  );
}
