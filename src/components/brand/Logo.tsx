import { useTranslations } from "next-intl";
import { LogoMark } from "./LogoMark";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  const t = useTranslations("brand");

  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="size-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-bold tracking-tight ${inverted ? "text-paper" : "text-ink"}`}
        >
          {t("shortName")}
        </span>
        <span
          className={`mt-0.5 text-[0.68rem] font-semibold tracking-[0.18em] uppercase ${inverted ? "text-straw" : "text-accent"}`}
        >
          {t("place")}
        </span>
      </span>
    </span>
  );
}
