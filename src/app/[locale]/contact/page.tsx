import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { alternatesFor } from "@/lib/seo";
import { ContactSection } from "@/components/contact/ContactSection";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contactPage");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: await alternatesFor("/contact"),
  };
}

export default function ContactPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <ContactSection headingLevel="h1" />
    </div>
  );
}
