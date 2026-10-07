import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

export type TabLink = {
  key: string;
  label: string;
  href: ComponentProps<typeof Link>["href"];
  active: boolean;
  count?: number;
};

/** Segmented control made of links (views that live in the URL, like upcoming/finished). */
export function TabLinks({ label, items }: { label: string; items: TabLink[] }) {
  return (
    <nav aria-label={label}>
      <ul className="inline-flex rounded-xl bg-line/60 p-1">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              scroll={false}
              aria-current={item.active ? "page" : undefined}
              className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
                item.active
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {item.label}
              {item.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 text-xs tabular ${item.active ? "bg-primary-soft text-primary" : "bg-surface/70"}`}
                >
                  {item.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
