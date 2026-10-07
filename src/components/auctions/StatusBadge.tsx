import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import type { AuctionStatus } from "@/lib/domain";

export function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex size-2 ${className}`} aria-hidden="true">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75 motion-reduce:animate-none" />
      <span className="relative inline-flex size-2 rounded-full bg-current" />
    </span>
  );
}

export function StatusBadge({
  status,
  onImage = false,
}: {
  status: AuctionStatus;
  /** Over a photo: use an opaque background so it stays readable. */
  onImage?: boolean;
}) {
  const t = useTranslations("auctionStatus");

  if (status === "live") {
    return (
      <Badge tone="live" className="tracking-wide uppercase">
        <LiveDot />
        {t("live")}
      </Badge>
    );
  }
  const tone = onImage ? "solid" : status === "upcoming" ? "primary" : "neutral";
  return <Badge tone={tone}>{t(status)}</Badge>;
}
