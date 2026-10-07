"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/**
 * Phones only: a fixed "Filter" button that opens the filters in a bottom sheet (native
 * <dialog>: focus trap, Escape and top layer for free). The button only shows while the
 * `targetId` section is on screen. Filter links navigate without closing the sheet, so several
 * filters can be combined; the results button closes it.
 */
export function FilterSheet({
  targetId,
  activeCount,
  resultCount,
  children,
}: {
  targetId: string;
  activeCount: number;
  resultCount: number;
  children: ReactNode;
}) {
  const t = useTranslations("catalogFilters");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [targetVisible, setTargetVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) =>
      setTargetVisible(entry.isIntersecting),
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        tabIndex={targetVisible ? 0 : -1}
        aria-hidden={!targetVisible}
        className={`fixed bottom-5 left-4 z-30 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-white shadow-lg ring-4 ring-paper/80 transition-all sm:hidden ${
          targetVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        {t("open")}
        {activeCount > 0 && (
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-straw px-1.5 text-xs font-bold text-ink">
            <span aria-hidden="true">{activeCount}</span>
            <span className="sr-only">{t("activeCount", { count: activeCount })}</span>
          </span>
        )}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={(event) => event.target === dialogRef.current && close()}
        className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-[85dvh] w-full max-w-none flex-col rounded-t-2xl bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/50 open:flex sm:hidden"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 id={titleId} className="text-lg font-bold">
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={close}
            className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-primary-soft"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">{t("close")}</span>
          </button>
        </div>
        <div className="space-y-5 overflow-y-auto px-4 py-5">{children}</div>
        <div className="border-t border-line p-4">
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary font-semibold text-white hover:bg-primary-hover"
          >
            {t("showResults", { count: resultCount })}
          </button>
        </div>
      </dialog>
    </>
  );
}
