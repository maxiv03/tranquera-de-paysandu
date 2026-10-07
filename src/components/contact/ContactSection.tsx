import { useTranslations } from "next-intl";
import { ContactList } from "@/components/layout/ContactList";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LocationMap } from "@/components/map/LocationMap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COMPANY } from "@/lib/company";
import { ContactForm } from "./ContactForm";

/** Form + office details and map. Used on the home page and the contact page. */
export function ContactSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const t = useTranslations();

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
      <div>
        <SectionHeading
          as={headingLevel}
          eyebrow={t("home.contactEyebrow")}
          title={t("home.contactTitle")}
          description={t("home.contactDescription")}
        />
        <div className="mt-8 rounded-card bg-surface p-5 ring-1 ring-line sm:p-6">
          <ContactForm />
        </div>
      </div>

      <aside className="flex flex-col gap-5">
        <div className="rounded-card bg-surface p-5 ring-1 ring-line sm:p-6">
          <h2 className="font-sans text-xs font-semibold tracking-[0.16em] text-ink-subtle uppercase">
            {t("home.officeTitle")}
          </h2>
          <div className="mt-4">
            <ContactList />
          </div>
          <WhatsAppButton className="mt-5 w-full" />
        </div>
        <LocationMap
          latitude={COMPANY.coordinates.latitude}
          longitude={COMPANY.coordinates.longitude}
          zoom={14}
          label={t("home.officeMapLabel")}
          loadingLabel={t("lotPage.loadingMap")}
          className="aspect-[4/3] lg:aspect-auto lg:min-h-64 lg:flex-1"
        />
      </aside>
    </div>
  );
}
