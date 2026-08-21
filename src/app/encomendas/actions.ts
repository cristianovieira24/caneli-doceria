"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getFunctionalDemoMode } from "@/lib/site-mode";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120, "Nome muito longo"),
  whatsapp: z.string().refine((value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }, "Informe um WhatsApp válido"),
  orderType: z.string().min(1, "Escolha o tipo de encomenda").max(80),
  preferredStoreId: z.union([z.string().uuid(), z.literal("")]).optional(),
  desiredDate: z
    .string()
    .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), "Data inválida")
    .optional(),
  peopleCount: z
    .string()
    .refine(
      (value) =>
        !value ||
        (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 10000),
      "Informe uma quantidade válida"
    )
    .optional(),
  budgetHint: z.string().max(120, "Orçamento muito longo").optional(),
  description: z
    .string()
    .trim()
    .min(10, "Conte um pouco mais sobre a encomenda")
    .max(4000, "Descrição muito longa"),
  consent: z.literal("on", {
    errorMap: () => ({ message: "Confirme o consentimento" }),
  }),
});

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const raw = Object.fromEntries(formData.entries());

  // Honeypot: this field is visually hidden and must stay empty. Returning a
  // generic success avoids teaching automated bots how the filter works.
  if (String(formData.get("companyWebsite") || "").trim()) {
    return {
      status: "success",
      message: "Recebemos seu pedido! A equipe entra em contato para confirmar.",
    };
  }

  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }

    return {
      status: "error",
      fieldErrors,
      message: "Confira os campos destacados.",
    };
  }

  // Proteção obrigatória no servidor. Nunca confiamos apenas no estado
  // exibido no navegador para decidir se um lead pode ser gravado.
  const demoMode = await getFunctionalDemoMode();

  if (demoMode) {
    return {
      status: "success",
      message:
        "Demonstração: solicitação simulada. Nenhuma informação foi enviada ou salva.",
    };
  }

  const supabase = createClient();

  const { error } = await supabase.from("leads").insert({
    name: parsed.data.name,
    whatsapp: parsed.data.whatsapp.replace(/\D/g, ""),
    order_type: parsed.data.orderType,
    preferred_store_id: parsed.data.preferredStoreId || null,
    desired_date: parsed.data.desiredDate || null,
    people_count: parsed.data.peopleCount
      ? Number(parsed.data.peopleCount)
      : null,
    budget_hint: parsed.data.budgetHint || null,
    description: parsed.data.description,
    consent: true,
  });

  if (error) {
    return {
      status: "error",
      message: "Não foi possível enviar agora. Tente novamente em instantes.",
    };
  }

  return {
    status: "success",
    message:
      "Recebemos seu pedido! A equipe entra em contato para confirmar.",
  };
}
