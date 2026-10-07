import type { ReactNode } from "react";

/** Key figure: small label above a prominent value (heads, weight, category...). */
export function Stat({
  label,
  value,
  icon,
  emphasis = false,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-xs font-medium text-ink-subtle [&_svg]:size-3.5">
        {icon}
        {label}
      </dt>
      <dd
        className={`mt-0.5 truncate font-semibold text-ink tabular ${emphasis ? "font-display text-xl" : "text-[0.95rem]"}`}
      >
        {value}
      </dd>
    </div>
  );
}
