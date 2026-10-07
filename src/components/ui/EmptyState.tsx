import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-surface/60 px-6 py-12 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
