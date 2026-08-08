"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitLead, type LeadFormState } from "./actions";
import { track } from "@/lib/analytics";
import { useSiteMode } from "@/components/site-mode-provider";

const initialState: LeadFormState = { status: "idle" };

const ORDER_TYPES = [
  "Bolo",
  "Torta",
  "Cesta",
  "Caixa para presente",
  "Aniversário",
  "Empresa / evento",
  "Outro",
];

export function LeadForm() {
  const { demoMode } = useSiteMode();
  const [state, formAction] = useFormState(submitLead, initialState);

  useEffect(() => {
    if (!demoMode && state.status === "success") {
      track("lead_submitted");
    }
  }, [demoMode, state.status]);

  return (
    <form action={formAction} className="mt-8 grid gap-5 sm:grid-cols-2">
      {demoMode && (
        <div className="sm:col-span-2 rounded-card border border-dashed border-pine/25 bg-pine/5 px-5 py-4 text-sm text-ink-soft">
          <strong className="text-pine">Modo demonstração:</strong>{" "}
          você pode preencher e testar todo o formulário, mas nenhuma
          informação será enviada à Caneli ou salva como lead.
        </div>
      )}

      <Field label="Nome" name="name" error={state.fieldErrors?.name}>
        <input name="name" type="text" required className="input" />
      </Field>

      <Field
        label="WhatsApp"
        name="whatsapp"
        error={state.fieldErrors?.whatsapp}
      >
        <input
          name="whatsapp"
          type="tel"
          placeholder="(62) 90000-0000"
          required
          className="input"
        />
      </Field>

      <Field
        label="Tipo de encomenda"
        name="orderType"
        error={state.fieldErrors?.orderType}
      >
        <select
          name="orderType"
          required
          className="input"
          defaultValue=""
        >
          <option value="" disabled>
            Selecione
          </option>

          {ORDER_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Data desejada" name="desiredDate">
        <input name="desiredDate" type="date" className="input" />
      </Field>

      <Field label="Quantidade de pessoas" name="peopleCount">
        <input
          name="peopleCount"
          type="number"
          min={1}
          className="input"
        />
      </Field>

      <Field
        label="Orçamento aproximado (opcional)"
        name="budgetHint"
      >
        <input
          name="budgetHint"
          type="text"
          placeholder="Ex.: até R$ 200"
          className="input"
        />
      </Field>

      <div className="sm:col-span-2">
        <Field
          label="Conte mais sobre a encomenda"
          name="description"
          error={state.fieldErrors?.description}
        >
          <textarea
            name="description"
            rows={4}
            required
            className="input"
          />
        </Field>
      </div>

      <label className="flex items-start gap-2 text-sm text-ink-soft sm:col-span-2">
        <input
          type="checkbox"
          name="consent"
          className="mt-1"
          required
        />

        {demoMode
          ? "Estou ciente de que este envio é apenas uma simulação de demonstração e não será encaminhado à Caneli."
          : "Autorizo a Caneli a entrar em contato pelo WhatsApp para tratar desta encomenda."}
      </label>

      {state.fieldErrors?.consent && (
        <p className="-mt-3 text-sm text-terracotta">
          {state.fieldErrors.consent}
        </p>
      )}

      <SubmitButton demoMode={demoMode} />

      {state.status === "success" && (
        <p
          role="status"
          className="sm:col-span-2 rounded-card bg-pine/10 px-4 py-3 text-sm text-pine-dark"
        >
          {state.message}
        </p>
      )}

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="sm:col-span-2 rounded-card bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark"
        >
          {state.message}
        </p>
      )}

      <p className="sm:col-span-2 text-xs text-ink-soft/70">
        {demoMode
          ? "Demonstração: o preenchimento deste formulário é apenas uma simulação e nenhuma solicitação real será criada."
          : "O envio deste formulário não representa confirmação automática da encomenda — o valor e a disponibilidade são confirmados pela equipe."}
      </p>
    </form>
  );
}

function SubmitButton({ demoMode }: { demoMode: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="sm:col-span-2 rounded-full bg-pine px-7 py-3.5 text-sm font-medium text-cream-soft hover:bg-pine-dark disabled:opacity-60"
    >
      {pending
        ? demoMode
          ? "Simulando…"
          : "Enviando…"
        : demoMode
          ? "Simular envio da encomenda"
          : "Enviar pedido de encomenda"}
    </button>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-ink"
      >
        {label}
      </label>

      {children}

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1 text-sm text-terracotta"
        >
          {error}
        </p>
      )}
    </div>
  );
}
