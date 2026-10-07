import { Phone } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { buttonStyles } from "@/components/ui/button-styles";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import type { Agent } from "@/lib/data/types";

/** Agent in charge of a lot, with call and WhatsApp (prefilled with the lot) actions. */
export function AgentCard({ agent, message }: { agent: Agent; message: string }) {
  const t = useTranslations();

  return (
    <div className="rounded-card bg-surface p-4 ring-1 ring-line sm:p-5">
      <p className="text-xs font-semibold tracking-wider text-ink-subtle uppercase">
        {t("lotPage.agent")}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-primary-soft">
          {agent.photoUrl && (
            <Image
              src={agent.photoUrl}
              alt=""
              fill
              sizes="56px"
              unoptimized={agent.photoUrl.endsWith(".svg")}
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg font-bold">{agent.name}</p>
          <p className="text-sm text-ink-muted tabular">{agent.phone}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-muted">{t("lotPage.agentHelp")}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={`tel:${agent.phone.replace(/\s/g, "")}`}
          className={buttonStyles({ variant: "secondary" })}
        >
          <Phone aria-hidden="true" />
          {t("common.call")}
        </a>
        <WhatsAppButton
          number={agent.whatsapp}
          message={message}
          label={t("contactInfo.whatsapp")}
        />
      </div>
    </div>
  );
}
