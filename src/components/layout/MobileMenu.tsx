"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "@/i18n/navigation";
import { NavLinks } from "./NavLinks";

/**
 * Phone navigation: a panel under the header. Closes on navigation and with Escape.
 * The panel is portaled to <body>: the header's backdrop-filter would otherwise become the
 * containing block of the fixed panel and clip it to the header height.
 */
export function MobileMenu({ isLive, footer }: { isLive: boolean; footer: ReactNode }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  // Close when the route changes (e.g. browser back while the menu is open).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className="relative inline-flex size-11 items-center justify-center rounded-lg text-ink hover:bg-primary-soft"
      >
        {open ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <Menu className="size-6" aria-hidden="true" />
        )}
        <span className="sr-only">{open ? t("closeMenu") : t("openMenu")}</span>
        {isLive && !open && (
          <span
            className="absolute top-2 right-2 size-2.5 rounded-full bg-live ring-2 ring-surface"
            aria-hidden="true"
          />
        )}
      </button>

      {open &&
        createPortal(
          <div
            id={panelId}
            className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-paper px-4 pt-2 pb-24 md:hidden"
          >
            <nav aria-label={t("main")}>
              <NavLinks
                isLive={isLive}
                variant="mobile"
                onNavigate={() => setOpen(false)}
              />
            </nav>
            <div className="mt-8">{footer}</div>
          </div>,
          document.body,
        )}
    </div>
  );
}
