import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { Logo } from "@/components/brand/Logo";
import { Link } from "@/i18n/navigation";
import { getAllAuctions } from "@/lib/data/auctions";
import { ContactList } from "./ContactList";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

function Navigation({ isLive }: { isLive: boolean }) {
  const t = useTranslations("nav");
  return (
    <>
      <nav aria-label={t("main")} className="hidden md:block">
        <NavLinks isLive={isLive} variant="desktop" />
      </nav>
      <MobileMenu isLive={isLive} footer={<ContactList />} />
    </>
  );
}

/** Navigation with the live indicator. The header never fails: no data means no indicator. */
async function LiveAwareNavigation() {
  const isLive = await getAllAuctions()
    .then((auctions) => auctions.some((a) => a.status === "live"))
    .catch(() => false);
  return <Navigation isLive={isLive} />;
}

export function SiteHeader() {
  const t = useTranslations("brand");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={t("home")} className="-ml-1 rounded-lg p-1">
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          <Suspense fallback={<Navigation isLive={false} />}>
            <LiveAwareNavigation />
          </Suspense>
          <LanguageSwitcher className="order-first md:order-none" />
        </div>
      </div>
    </header>
  );
}
