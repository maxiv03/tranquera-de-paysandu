import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonStyles, type ButtonSize } from "@/components/ui/button-styles";
import { COMPANY } from "@/lib/company";
import { demoMessage, WHATSAPP_CTA_ATTRIBUTE, whatsappUrl } from "@/lib/whatsapp";

/**
 * WhatsApp link with a prefilled message. Every message starts with the demo prefix (own line)
 * so the team can tell portfolio visitors apart. Pass `message` without the prefix.
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

  return (
    <a
      href={whatsappUrl(number, demoMessage(t("prefix"), message ?? t("general")))}
      target="_blank"
      rel="noopener noreferrer"
      {...{ [WHATSAPP_CTA_ATTRIBUTE]: "" }}
      className={buttonStyles({ variant: "whatsapp", size, className })}
    >
      <MessageCircle aria-hidden="true" />
      {label ?? t("cta")}
    </a>
  );
}
