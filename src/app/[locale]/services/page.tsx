import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { alternatesFor } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("servicesPage");
  return {
    title: t("metaTitle"),
    description: t("description"),
    alternates: await alternatesFor("/services"),
  };
}

export default function ServicesPage() {
  const t = useTranslations("servicesPage");

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeading
        as="h1"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="mt-10">
        <ServiceGrid />
      </div>
    </div>
  );
}
