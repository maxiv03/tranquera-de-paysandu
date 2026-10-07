/** wa.me link with a prefilled message. `number` is digits only, international format. */
export function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
