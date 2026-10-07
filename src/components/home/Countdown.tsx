"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

function split(ms: number) {
  const seconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(seconds / 86_400),
    hours: Math.floor((seconds % 86_400) / 3_600),
    minutes: Math.floor((seconds % 3_600) / 60),
    seconds: seconds % 60,
  };
}

/**
 * Days / hours / minutes / seconds until `target`. The digits are decorative (aria-hidden):
 * pass the start date as readable text in `label` for screen readers.
 */
export function Countdown({
  target,
  label,
  size = "md",
}: {
  target: string;
  label: string;
  size?: "sm" | "md";
}) {
  const t = useTranslations("countdown");
  // Null until mounted: the prerendered HTML must not depend on the clock.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = now === null ? null : new Date(target).getTime() - now;
  if (remaining !== null && remaining <= 0) {
    return <p className="font-semibold text-live">{t("started")}</p>;
  }

  const parts = remaining === null ? null : split(remaining);
  const cells = [
    { key: "days", value: parts?.days, label: t("days", { count: parts?.days ?? 2 }) },
    { key: "hours", value: parts?.hours, label: t("hours") },
    { key: "minutes", value: parts?.minutes, label: t("minutes") },
    { key: "seconds", value: parts?.seconds, label: t("seconds") },
  ];

  return (
    <div>
      <p className="sr-only">{label}</p>
      <div
        className={`grid grid-cols-4 ${size === "sm" ? "gap-1.5" : "gap-2"}`}
        aria-hidden="true"
      >
        {cells.map((cell) => (
          <div
            key={cell.key}
            className={`rounded-lg bg-primary-soft px-1 text-center ${size === "sm" ? "py-1" : "py-2"}`}
          >
            <span
              className={`block font-display font-bold text-primary tabular ${size === "sm" ? "text-lg" : "text-2xl sm:text-3xl"}`}
            >
              {cell.value === undefined ? "–" : String(cell.value).padStart(2, "0")}
            </span>
            <span className="block text-[0.7rem] font-semibold tracking-wider text-ink-subtle uppercase">
              {cell.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
