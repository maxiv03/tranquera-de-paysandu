import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/Logo";
import { Link } from "@/i18n/navigation";
import { ContactList } from "./ContactList";
import { NAV_ITEMS } from "./nav-items";

export function SiteFooter() {
  const t = useTranslations();

  return (
    <footer className="mt-20 bg-primary-strong text-paper">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo inverted />
          <p className="mt-4 text-sm leading-relaxed text-paper/75">
            {t("footer.about")}
          </p>
        </div>
        <nav aria-label={t("footer.explore")}>
          <h2 className="font-sans text-xs font-semibold tracking-[0.16em] text-straw uppercase">
            {t("footer.explore")}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                {t("nav.home")}
              </Link>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="underline-offset-4 hover:underline">
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-sans text-xs font-semibold tracking-[0.16em] text-straw uppercase">
            {t("footer.contact")}
          </h2>
          <div className="mt-4">
            <ContactList inverted />
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10">
        {/* Extra bottom space on phones so the floating buttons never cover the last line. */}
        <p className="container-page pt-5 pb-24 text-xs leading-relaxed text-paper/60 sm:pr-20 sm:pb-5">
          {t("footer.demo")}
        </p>
      </div>
    </footer>
  );
}
