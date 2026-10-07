import {
  Beef,
  ClipboardCheck,
  Fence,
  Handshake,
  MonitorPlay,
  Truck,
  Warehouse,
} from "lucide-react";
import type { ServiceKey } from "@/lib/services";

const icons = {
  "screen-auctions": MonitorPlay,
  fairs: Warehouse,
  "slaughterhouse-shipments": Beef,
  "private-deals": Handshake,
  land: Fence,
  appraisals: ClipboardCheck,
  transport: Truck,
} satisfies Record<ServiceKey, unknown>;

export function ServiceIcon({
  service,
  className = "size-6",
}: {
  service: ServiceKey;
  className?: string;
}) {
  const Icon = icons[service];
  return <Icon className={className} aria-hidden="true" />;
}
