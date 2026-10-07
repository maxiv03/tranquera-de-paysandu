import { useTranslations } from "next-intl";

/** Placeholder grid shown while a streamed section loads. Same footprint as the real cards. */
export function CardGridSkeleton({
  count = 3,
  aspect = "aspect-[16/9]",
  columns = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  aspect?: string;
  columns?: string;
}) {
  const t = useTranslations("common");
  return (
    <div role="status" className={`grid gap-6 ${columns}`}>
      <span className="sr-only">{t("loading")}</span>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-card bg-surface ring-1 ring-line"
          aria-hidden="true"
        >
          <div
            className={`${aspect} animate-pulse bg-line/60 motion-reduce:animate-none`}
          />
          <div className="space-y-3 p-4">
            <div className="h-4 w-1/3 rounded bg-line/70" />
            <div className="h-5 w-2/3 rounded bg-line/70" />
            <div className="h-4 w-1/2 rounded bg-line/50" />
          </div>
        </div>
      ))}
    </div>
  );
}
