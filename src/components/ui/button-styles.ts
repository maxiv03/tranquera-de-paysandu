// Shared button look for <button>, internal links and external anchors.
const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold " +
  "transition-colors " +
  "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.15em] [&_svg]:shrink-0";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary:
    "border border-line-strong bg-surface text-ink hover:border-primary hover:text-primary",
  ghost: "text-primary hover:bg-primary-soft",
  accent: "bg-accent text-white hover:bg-accent-hover",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-hover",
  live: "bg-live text-white hover:brightness-110",
} as const;

const sizes = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-[0.95rem]",
  lg: "min-h-12 px-5 text-base",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonStyles({
  variant = "primary",
  size = "md",
  className = "",
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}
