import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { COMPANY } from "@/lib/company";
import { demoMessage, whatsappUrl } from "@/lib/whatsapp";

/** Company contact lines (phone, WhatsApp, email, office). Used in the footer and the menu. */
export function ContactList({ inverted = false }: { inverted?: boolean }) {
  const t = useTranslations();
  const muted = inverted ? "text-paper/60" : "text-ink-subtle";
  const items = [
    {
      icon: Phone,
      label: t("contactInfo.phone"),
      value: COMPANY.phone,
      href: `tel:${COMPANY.phone.replace(/\s/g, "")}`,
    },
    {
      icon: MessageCircle,
      label: t("contactInfo.whatsapp"),
      value: COMPANY.phone,
      href: whatsappUrl(
        COMPANY.whatsapp,
        demoMessage(t("whatsapp.prefix"), t("whatsapp.general")),
      ),
      external: true,
    },
    {
      icon: Mail,
      label: t("contactInfo.email"),
      value: COMPANY.email,
      href: `mailto:${COMPANY.email}`,
    },
    { icon: MapPin, label: t("contactInfo.address"), value: COMPANY.address },
  ];

  return (
    <ul className="space-y-3 text-sm">
      {items.map(({ icon: Icon, label, value, href, external }) => (
        <li key={label} className="flex gap-3">
          <Icon className={`mt-0.5 size-4 shrink-0 ${muted}`} aria-hidden="true" />
          <div className="min-w-0">
            <p className={`text-xs ${muted}`}>{label}</p>
            {href ? (
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="font-medium break-words underline-offset-4 hover:underline"
              >
                {value}
              </a>
            ) : (
              <p className="font-medium">{value}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
