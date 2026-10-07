/** wa.me link with a prefilled message. `number` is digits only, international format. */
export function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Every prefilled message starts with the demo prefix on its own line. */
export function demoMessage(prefix: string, message: string) {
  return `${prefix}\n${message}`;
}

/** Marks in-page WhatsApp buttons, so the floating button can step aside while one is visible. */
export const WHATSAPP_CTA_ATTRIBUTE = "data-whatsapp-cta";
