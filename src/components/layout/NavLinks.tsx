"use client";

import { useTranslations } from "next-intl";
import { LiveDot } from "@/components/auctions/StatusBadge";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "./nav-items";

/** Navigation links with the current section highlighted. `isLive` adds a pulse to "Live". */
export function NavLinks({
  isLive,
  variant,
  onNavigate,
}: {
  isLive: boolean;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <ul className={variant === "desktop" ? "flex items-center gap-1" : "flex flex-col"}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.key}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={
                variant === "desktop"
                  ? `relative flex min-h-11 items-center gap-2 rounded-lg px-3 text-[0.95rem] font-semibold transition-colors hover:text-primary ${active ? "text-primary after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary" : "text-ink-muted"}`
                  : `flex min-h-14 items-center gap-2.5 border-b border-line px-1 font-display text-xl font-semibold ${active ? "text-primary" : "text-ink"}`
              }
            >
              {item.key === "live" && isLive && <LiveDot className="text-live" />}
              {t(item.key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
