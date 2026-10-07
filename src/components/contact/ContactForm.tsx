"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useId, useState } from "react";
import { sendContactMessage, type ContactFormState } from "@/app/actions/contact";
import { buttonStyles } from "@/components/ui/button-styles";

const fieldClass =
  "mt-1 block w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-ink " +
  "placeholder:text-ink-subtle focus:border-primary focus:outline-2 focus:outline-primary/30 " +
  "aria-invalid:border-live";

/** Contact form posting to a server action. Works without JavaScript (progressive form). */
export function ContactForm() {
  const t = useTranslations("contactForm");
  const id = useId();
  const [state, action, pending] = useActionState<ContactFormState, FormData>(
    sendContactMessage,
    { status: "idle" },
  );
  // The success message stays until the visitor chooses to write again; each send returns a new
  // state object, so a later success shows the message again.
  const [dismissed, setDismissed] = useState<ContactFormState | null>(null);

  if (state.status === "success" && state !== dismissed) {
    return (
      <div role="status" className="rounded-card bg-primary-soft p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" aria-hidden="true" />
        <p className="mt-3 font-display text-lg font-semibold text-ink">{t("success")}</p>
        <button
          type="button"
          onClick={() => setDismissed(state)}
          className={buttonStyles({ variant: "ghost", className: "mt-3" })}
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : undefined;
  const errorId = (field: string) => `${id}-${field}-error`;
  const errorText = (field: "name" | "phone" | "email" | "message") =>
    errors[field] ? (
      <p id={errorId(field)} className="mt-1 text-sm text-live">
        {t(`errors.${field}`)}
      </p>
    ) : null;

  return (
    <form action={action} noValidate className="space-y-4">
      <div>
        <label htmlFor={`${id}-name`} className="text-sm font-semibold">
          {t("name")}
        </label>
        <input
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          required
          defaultValue={values?.name}
          aria-invalid={errors.name || undefined}
          aria-describedby={errors.name ? errorId("name") : undefined}
          className={fieldClass}
        />
        {errorText("name")}
      </div>

      <fieldset aria-describedby={`${id}-contact-hint`}>
        <legend className="sr-only">{t("contactHint")}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-phone`} className="text-sm font-semibold">
              {t("phone")}
            </label>
            <input
              id={`${id}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              defaultValue={values?.phone}
              aria-invalid={errors.phone || errors.contact || undefined}
              aria-describedby={errors.phone ? errorId("phone") : undefined}
              className={fieldClass}
            />
            {errorText("phone")}
          </div>
          <div>
            <label htmlFor={`${id}-email`} className="text-sm font-semibold">
              {t("email")}
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={values?.email}
              aria-invalid={errors.email || errors.contact || undefined}
              aria-describedby={errors.email ? errorId("email") : undefined}
              className={fieldClass}
            />
            {errorText("email")}
          </div>
        </div>
        <p
          id={`${id}-contact-hint`}
          className={`mt-1.5 text-sm ${errors.contact ? "text-live" : "text-ink-subtle"}`}
        >
          {errors.contact ? t("errors.contact") : t("contactHint")}
        </p>
      </fieldset>

      <div>
        <label htmlFor={`${id}-message`} className="text-sm font-semibold">
          {t("message")}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          required
          defaultValue={values?.message}
          placeholder={t("messagePlaceholder")}
          aria-invalid={errors.message || undefined}
          aria-describedby={errors.message ? errorId("message") : undefined}
          className={fieldClass}
        />
        {errorText("message")}
      </div>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="hidden" aria-hidden="true">
        <input name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {errors.server && (
        <p role="alert" className="rounded-lg bg-live-soft px-4 py-3 text-sm text-live">
          {t("errors.server")}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="submit" disabled={pending} className={buttonStyles({ size: "lg" })}>
          <Send aria-hidden="true" />
          {pending ? t("sending") : t("submit")}
        </button>
        <p className="text-xs text-ink-subtle">{t("demoNotice")}</p>
      </div>
    </form>
  );
}
