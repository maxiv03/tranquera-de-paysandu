import { useTranslations } from "next-intl";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { LotCategory } from "@/lib/domain";

export function CategoryBadge({
  category,
  tone = "primary",
}: {
  category: LotCategory;
  tone?: BadgeTone;
}) {
  const t = useTranslations("lotCategory");
  return <Badge tone={tone}>{t(category)}</Badge>;
}
