import type { ReactNode } from "react";

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
  as: Heading = "h2",
  className = "",
}: {
  /** Heading id, for aria-labelledby on the parent section. */
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-3 ${className}`}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            {eyebrow}
          </p>
        )}
        <Heading
          id={id}
          className={`font-bold ${eyebrow ? "mt-2" : ""} ${Heading === "h1" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}
        >
          {title}
        </Heading>
        {description && <p className="mt-2 text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
