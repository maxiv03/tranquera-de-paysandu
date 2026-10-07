import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

export type FilterOption = {
  key: string;
  label: string;
  href: ComponentProps<typeof Link>["href"];
  active: boolean;
  count?: number;
  /** No results with the other filters: shown dimmed, not clickable. */
  disabled?: boolean;
};

/**
 * One filter dimension as a row of link chips. Filters live in the URL, so every chip is a real
 * link: shareable, works without JavaScript and the back button undoes it.
 */
export function FilterChips({
  label,
  options,
  layout = "scroll",
}: {
  label: string;
  options: FilterOption[];
  /** "scroll": on phones, one row that scrolls sideways. "wrap": wrapped lines (inside panels). */
  layout?: "scroll" | "wrap";
}) {
  return (
    <div role="group" aria-label={label} className="min-w-0">
      <p className="mb-2 text-xs font-semibold tracking-wider text-ink-subtle uppercase">
        {label}
      </p>
      <ul
        className={
          layout === "wrap"
            ? "flex flex-wrap gap-2"
            : "-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        }
      >
        {options.map((option) => (
          <li key={option.key} className="shrink-0">
            {option.disabled && !option.active ? (
              <span className="inline-flex min-h-9 cursor-not-allowed items-center gap-1.5 rounded-full border border-dashed border-line-strong px-3.5 text-sm text-ink-subtle">
                {option.label}
                <span className="text-xs tabular">{option.count ?? 0}</span>
              </span>
            ) : (
              <Link
                href={option.href}
                scroll={false}
                aria-current={option.active ? "true" : undefined}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors ${
                  option.active
                    ? "border-primary bg-primary text-white"
                    : "border-line-strong bg-surface text-ink hover:border-primary hover:text-primary"
                }`}
              >
                {option.label}
                {option.count !== undefined && (
                  <span
                    className={`text-xs tabular ${option.active ? "text-white/75" : "text-ink-subtle"}`}
                  >
                    {option.count}
                  </span>
                )}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
