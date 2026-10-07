import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Link } from "@/i18n/navigation";
import { SERVICES } from "@/lib/services";
import { ServiceIcon } from "./ServiceIcon";

/** All services as cards, plus a closing card that invites to ask on WhatsApp. */
export function ServiceGrid() {
  const t = useTranslations("services");

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SERVICES.map(({ slug }) => (
        <li key={slug} className="flex">
          <article className="group relative flex flex-1 flex-col rounded-card bg-surface p-5 ring-1 ring-line transition-shadow hover:shadow-card">
            <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <ServiceIcon slug={slug} />
            </span>
            <h3 className="mt-4 text-lg leading-snug font-bold">
              <Link
                href={{ pathname: "/services/[service]", params: { service: slug } }}
                className="after:absolute after:inset-0 after:content-[''] group-has-[a:focus-visible]:after:rounded-card group-has-[a:focus-visible]:after:outline-2 group-has-[a:focus-visible]:after:outline-primary focus-visible:outline-none"
              >
                {t(`${slug}.title`)}
              </Link>
            </h3>
            <p className="mt-1.5 flex-1 text-sm text-ink-muted">{t(`${slug}.summary`)}</p>
            <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
              {t("learnMore")}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </article>
        </li>
      ))}
      <li className="flex">
        <div className="flex flex-1 flex-col rounded-card bg-primary p-5 text-paper">
          <h3 className="text-lg leading-snug font-bold text-paper">{t("otherTitle")}</h3>
          <p className="mt-1.5 flex-1 text-sm text-paper/80">{t("otherSummary")}</p>
          <WhatsAppButton size="sm" label={t("otherCta")} className="mt-4 self-start" />
        </div>
      </li>
    </ul>
  );
}
