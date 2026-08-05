export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Formats a raw WhatsApp number (digits only, with country code) for display, e.g. "62 99644-8093". */
export function formatWhatsAppDisplay(digits: string): string {
  const local = digits.replace(/^55/, "");
  const ddd = local.slice(0, 2);
  const rest = local.slice(2);
  const first = rest.length === 9 ? rest.slice(0, 5) : rest.slice(0, 4);
  const last = rest.length === 9 ? rest.slice(5) : rest.slice(4);
  return `(${ddd}) ${first}-${last}`;
}
