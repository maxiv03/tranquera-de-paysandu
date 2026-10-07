"use server";

import { createSupabaseClient } from "@/lib/supabase/server";

export type ContactField = "name" | "contact" | "email" | "phone" | "message";

export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      /** Keys of contactForm.errors.* in messages: the client translates them. */
      errors: Partial<Record<ContactField | "server", true>>;
      values: Record<"name" | "phone" | "email" | "message", string>;
    };

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE = /^\+?[\d\s()-]{6,30}$/;

/** Validates and stores a contact message. Mirrors the checks of the contact_messages table. */
export async function sendContactMessage(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const read = (key: string) => String(formData.get(key) ?? "").trim();
  const values = {
    name: read("name"),
    phone: read("phone"),
    email: read("email"),
    message: read("message"),
  };

  // Honeypot: real visitors never see this field. Pretend it worked.
  if (read("company")) return { status: "success" };

  const errors: Partial<Record<ContactField | "server", true>> = {};
  if (values.name.length < 2 || values.name.length > 120) errors.name = true;
  if (!values.phone && !values.email) errors.contact = true;
  if (values.email && !EMAIL.test(values.email)) errors.email = true;
  if (values.phone && !PHONE.test(values.phone)) errors.phone = true;
  if (values.message.length < 5 || values.message.length > 2000) errors.message = true;
  if (Object.keys(errors).length) return { status: "error", errors, values };

  const { error } = await createSupabaseClient()
    .from("contact_messages")
    .insert({
      name: values.name,
      phone: values.phone || null,
      email: values.email || null,
      message: values.message,
    });
  if (error) {
    console.error("Contact message not saved:", error.message);
    return { status: "error", errors: { server: true }, values };
  }
  return { status: "success" };
}
