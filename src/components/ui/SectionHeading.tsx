import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  as: Heading = "h2",
  className = "",
}: {
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
