"use client";

import { Check, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { buttonStyles } from "@/components/ui/button-styles";

/** Native share sheet when available (phones); otherwise copies the link to the clipboard. */
export function ShareButton({
  url,
  title,
  text,
}: {
  url: string;
  title: string;
  text: string;
}) {
  const t = useTranslations("lotPage");
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ url, title, text });
      } catch {
        // Cancelled by the visitor: nothing to do.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button type="button" onClick={share} className={buttonStyles({ variant: "ghost" })}>
      {copied ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
      <span aria-live="polite">{copied ? t("copied") : t("share")}</span>
    </button>
  );
}
