"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const leadSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  whatsapp: z.string().min(10, "Informe um WhatsApp válido"),
  orderType: z.string().min(1, "Escolha o tipo de encomenda"),
  preferredStoreId: z.string().optional(),
  desiredDate: z.string().optional(),
  peopleCount: z.string().optional(),
  budgetHint: z.string().optional(),
  description: z.string().min(10, "Conte um pouco mais sobre a encomenda"),
  consent: z.literal("on", { errorMap: () => ({ message: "Confirme que podemos entrar em contato" }) }),
});

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { status: "error", fieldErrors, message: "Confira os campos destacados." };
  }

  // Server-side guard — the front-end already avoids implying this is a
  // real submission in demo mode, but we never rely on that alone: even
  // if this action is called directly, nothing gets written while
  // DEMO_MODE is active.
  if (DEMO_MODE) {
    return {
      status: "success",
      message: "Demonstração: solicitação simulada. Nenhuma informação foi enviada ou salva.",
    };
  }

  const supabase = createClient();
  const { error } = await supabase.from("leads").insert({
    name: parsed.data.name,
    whatsapp: parsed.data.whatsapp,
    order_type: parsed.data.orderType,
    preferred_store_id: parsed.data.preferredStoreId || null,
    desired_date: parsed.data.desiredDate || null,
    people_count: parsed.data.peopleCount ? Number(parsed.data.peopleCount) : null,
    budget_hint: parsed.data.budgetHint || null,
    description: parsed.data.description,
    consent: true,
  });

  if (error) {
    return { status: "error", message: "Não foi possível enviar agora. Tente novamente em instantes." };
  }

  return { status: "success", message: "Recebemos seu pedido! A equipe entra em contato para confirmar." };
}
