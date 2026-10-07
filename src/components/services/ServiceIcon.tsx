import {
  Beef,
  ClipboardCheck,
  Fence,
  Handshake,
  MonitorPlay,
  Truck,
  Warehouse,
} from "lucide-react";
import type { ServiceSlug } from "@/lib/services";

const icons = {
  "screen-auctions": MonitorPlay,
  fairs: Warehouse,
  "slaughterhouse-shipments": Beef,
  "private-deals": Handshake,
  land: Fence,
  appraisals: ClipboardCheck,
  transport: Truck,
} satisfies Record<ServiceSlug, unknown>;

export function ServiceIcon({
  slug,
  className = "size-6",
}: {
  slug: ServiceSlug;
  className?: string;
}) {
  const Icon = icons[slug];
  return <Icon className={className} aria-hidden="true" />;
}
