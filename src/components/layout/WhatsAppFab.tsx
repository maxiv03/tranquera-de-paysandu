"use client";

import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { COMPANY } from "@/lib/company";
import { demoMessage, WHATSAPP_CTA_ATTRIBUTE, whatsappUrl } from "@/lib/whatsapp";

/**
 * Floating WhatsApp button, bottom-right on every page. It steps aside while another WhatsApp
 * button (agent, auction, live bid...) is on screen, so there is never a duplicate.
 */
export function WhatsAppFab() {
  const t = useTranslations("whatsapp");
  const pathname = usePathname();
  const [otherVisible, setOtherVisible] = useState(false);

  useEffect(() => {
    const visible = new Set<Element>();
    const intersection = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setOtherVisible(visible.size > 0);
    });

    // Buttons can appear after hydration (streamed sections), so watch the DOM for new ones.
    const observed = new Set<Element>();
    const scan = () => {
      document.querySelectorAll(`[${WHATSAPP_CTA_ATTRIBUTE}]`).forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        intersection.observe(element);
      });
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      intersection.disconnect();
      setOtherVisible(false);
    };
  }, [pathname]);

  return (
    <a
      href={whatsappUrl(COMPANY.whatsapp, demoMessage(t("prefix"), t("general")))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("fab")}
      title={t("fab")}
      aria-hidden={otherVisible}
      tabIndex={otherVisible ? -1 : undefined}
      className={`fixed right-4 bottom-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg ring-4 ring-paper/80 transition-all duration-300 hover:scale-105 hover:bg-whatsapp-hover sm:right-6 sm:bottom-6 ${
        otherVisible ? "pointer-events-none translate-y-6 opacity-0" : "opacity-100"
      }`}
    >
      <MessageCircle className="size-7" aria-hidden="true" />
    </a>
  );
}
