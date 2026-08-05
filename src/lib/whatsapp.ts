import type { CartLine, Store } from "@/types/database";
import { formatBRL } from "./format";

export interface WhatsAppOrderInput {
  store: Store;
  lines: CartLine[];
  customerName?: string;
  mode?: "Retirada" | "Delivery";
  desiredTime?: string;
}

/**
 * Builds the structured order message and returns a ready-to-open
 * wa.me link. Values are always framed as an estimate pending
 * confirmation from the store — the site never claims to guarantee
 * price or availability on the store's behalf.
 */
export function buildWhatsAppOrderUrl({
  store,
  lines,
  customerName,
  mode,
  desiredTime,
}: WhatsAppOrderInput): string {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  const itemsText = lines
    .map((l) => {
      const parts = [`${l.quantity}x ${l.productName}`];
      if (l.variant) parts.push(`Variação: ${l.variant}`);
      if (l.addons?.length) parts.push(`Adicionais: ${l.addons.join(", ")}`);
      if (l.note) parts.push(`Observação: ${l.note}`);
      return parts.join("\n");
    })
    .join("\n\n");

  const message = [
    `Olá! Gostaria de fazer um pedido na Caneli — Unidade ${store.name}.`,
    "",
    itemsText,
    "",
    `Subtotal estimado: ${formatBRL(subtotal)}`,
    "",
    customerName ? `Nome: ${customerName}` : "Nome: ",
    mode ? `Modalidade: ${mode}` : "Modalidade: ",
    desiredTime ? `Horário desejado: ${desiredTime}` : "Horário desejado: ",
    "",
    "Podem confirmar a disponibilidade e o valor final?",
  ].join("\n");

  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
}
