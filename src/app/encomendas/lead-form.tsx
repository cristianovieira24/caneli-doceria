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
    <form
      action={formAction}
      className="pastry-card mt-8 grid gap-5 bg-cream-soft/75 p-4 shadow-soft sm:grid-cols-2 sm:p-6 lg:p-7"
    >
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="companyWebsite">Site da empresa</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {demoMode && (
        <div className="rounded-xl border border-dashed border-pine/20 bg-pine/5 px-4 py-4 text-sm leading-relaxed text-ink-soft sm:col-span-2 sm:px-5">
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
          inputMode="tel"
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
          inputMode="numeric"
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
            rows={5}
            required
            className="input"
          />
        </Field>
      </div>

      <label className="flex items-start gap-3 rounded-xl bg-cream px-4 py-3 text-sm leading-relaxed text-ink-soft sm:col-span-2">
        <input
          type="checkbox"
          name="consent"
          className="mt-1 h-4 w-4 shrink-0 accent-pine"
          required
        />

        <span>
          {demoMode
            ? "Estou ciente de que este envio é apenas uma simulação de demonstração e não será encaminhado à Caneli."
            : "Autorizo a Caneli a entrar em contato pelo WhatsApp para tratar desta encomenda."}
        </span>
      </label>

      {state.fieldErrors?.consent && (
        <p className="-mt-3 text-sm text-terracotta sm:col-span-2">
          {state.fieldErrors.consent}
        </p>
      )}

      <SubmitButton demoMode={demoMode} />

      {state.status === "success" && (
        <p
          role="status"
          className="rounded-xl bg-pine/10 px-4 py-3 text-sm leading-relaxed text-pine sm:col-span-2"
        >
          {state.message}
        </p>
      )}

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm leading-relaxed text-terracotta sm:col-span-2"
        >
          {state.message}
        </p>
      )}

      <p className="text-xs leading-relaxed text-ink-soft/70 sm:col-span-2">
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
      className="rounded-full bg-pine px-7 py-3.5 text-sm font-medium text-cream-soft shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift disabled:translate-y-0 disabled:opacity-60 sm:col-span-2"
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
    <div className="min-w-0">
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
