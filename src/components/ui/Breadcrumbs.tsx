import { ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

type Crumb = { label: string; href?: ComponentProps<typeof Link>["href"] };

/** Trail of links; the last crumb is the current page. Label the nav with the parent page. */
export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label} className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-ink-muted">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="size-3.5 text-ink-subtle" aria-hidden="true" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="underline-offset-4 hover:text-primary hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
