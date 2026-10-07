"use client";

import { RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { buttonStyles } from "@/components/ui/button-styles";

/**
 * Shown only when data fails and there is no cached copy to fall back on (cached pages keep
 * being served while Supabase is down). Header and footer stay in place.
 */
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-1 flex-col items-start justify-center py-16">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-3 max-w-lg text-ink-muted">{t("description")}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => retry()} className={buttonStyles()}>
          <RotateCw aria-hidden="true" />
          {t("retry")}
        </button>
        <WhatsAppButton />
      </div>
    </div>
  );
}
