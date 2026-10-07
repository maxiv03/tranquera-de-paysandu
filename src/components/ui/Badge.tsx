import type { ReactNode } from "react";

const tones = {
  neutral: "bg-paper text-ink-muted ring-line",
  primary: "bg-primary-soft text-primary ring-primary/15",
  accent: "bg-accent-soft text-accent-hover ring-accent/15",
  straw: "bg-straw-soft text-ink ring-straw/40",
  live: "bg-live text-white ring-live",
  sold: "bg-accent text-white ring-accent",
  solid: "bg-surface/95 text-ink ring-line backdrop-blur",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1 ring-inset ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
