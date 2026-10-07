/** The farm-gate mark, also used as favicon (src/app/icon.svg). Decorative: label the parent. */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="var(--color-primary)" />
      <g stroke="var(--color-paper)" strokeLinecap="round">
        <path d="M7 8v17M25 8v17" strokeWidth="2.4" />
        <path d="M7 11h18M7 16.5h18M7 22h18" strokeWidth="2" />
        <path d="M8 22 24 11" stroke="var(--color-straw)" strokeWidth="2" />
      </g>
    </svg>
  );
}
