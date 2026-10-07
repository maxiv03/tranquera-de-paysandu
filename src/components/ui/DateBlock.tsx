import { useFormatter, useTranslations } from "next-intl";

/**
 * Calendar-style date: weekday, big day number and month, always in Montevideo time.
 * `today` swaps the weekday for "Today" and uses the accent color, so same-day auctions stand out.
 */
export function DateBlock({
  date,
  today = false,
  size = "md",
  className = "",
}: {
  date: string;
  today?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  const t = useTranslations("dateBlock");
  const format = useFormatter();
  const value = new Date(date);
  const large = size === "lg";

  return (
    <time
      dateTime={date}
      className={`flex shrink-0 flex-col items-center justify-center rounded-lg text-center leading-none text-white ${today ? "bg-accent" : "bg-primary"} ${large ? "w-20 py-3" : "w-16 py-2.5"} ${className}`}
    >
      <span
        className={`text-[0.7rem] font-semibold tracking-wider uppercase ${today ? "font-bold" : "opacity-80"}`}
      >
        {today ? t("today") : format.dateTime(value, "weekdayShort")}
      </span>
      <span
        className={`font-display font-bold tabular ${large ? "my-1 text-4xl" : "my-0.5 text-3xl"}`}
      >
        {format.dateTime(value, "day")}
      </span>
      <span className="text-xs font-semibold tracking-wider uppercase">
        {format.dateTime(value, "monthShort").replace(".", "")}
      </span>
    </time>
  );
}
