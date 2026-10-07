import { MonitorPlay, Warehouse } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import type { AuctionType } from "@/lib/domain";

export function AuctionTypeBadge({ type }: { type: AuctionType }) {
  const t = useTranslations("auctionType");
  const Icon = type === "screen" ? MonitorPlay : Warehouse;

  return (
    <Badge tone={type === "screen" ? "accent" : "straw"}>
      <Icon className="size-3.5" aria-hidden="true" />
      {t(type)}
    </Badge>
  );
}
