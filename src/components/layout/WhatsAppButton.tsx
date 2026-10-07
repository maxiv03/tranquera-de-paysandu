import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonStyles, type ButtonSize } from "@/components/ui/button-styles";
import { whatsappUrl } from "@/lib/whatsapp";
import { COMPANY } from "@/lib/company";

/**
 * WhatsApp link with a prefilled message. Every message starts with the demo prefix so the team
 * can tell portfolio visitors apart. Pass `message` without the prefix.
 */
export function WhatsAppButton({
  number = COMPANY.whatsapp,
  message,
  label,
  size = "md",
  className = "",
}: {
  number?: string;
  message?: string;
  label?: string;
  size?: ButtonSize;
  className?: string;
}) {
  const t = useTranslations("whatsapp");
  const text = `${t("prefix")} ${message ?? t("general")}`;

  return (
    <a
      href={whatsappUrl(number, text)}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonStyles({ variant: "whatsapp", size, className })}
    >
      <MessageCircle aria-hidden="true" />
      {label ?? t("cta")}
    </a>
  );
}

/** Floating button, bottom-right on every page. */
export function WhatsAppFab() {
  const t = useTranslations("whatsapp");
  const text = `${t("prefix")} ${t("general")}`;

  return (
    <a
      href={whatsappUrl(COMPANY.whatsapp, text)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("fab")}
      title={t("fab")}
      className="fixed right-4 bottom-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg ring-4 ring-paper/80 transition-transform hover:scale-105 hover:bg-whatsapp-hover sm:right-6 sm:bottom-6"
    >
      <MessageCircle className="size-7" aria-hidden="true" />
    </a>
  );
}
