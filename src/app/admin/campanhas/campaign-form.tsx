"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveCampaign, type CampaignFormState } from "./actions";
import { ImageUpload } from "@/components/admin/image-upload";
import type { Campaign } from "@/types/database";

const initialState: CampaignFormState = {};

function toLocalInput(iso?: string) {
  if (!iso) return "";
  return iso.slice(0, 16);
}

export function CampaignForm({ campaign }: { campaign?: Campaign }) {
  const action = saveCampaign.bind(null, campaign?.id ?? null);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <F label="Título" error={state.fieldErrors?.title}>
        <input name="title" defaultValue={campaign?.title ?? ""} required className="input" />
      </F>
      <F label="Subtítulo (opcional)">
        <input name="subtitle" defaultValue={campaign?.subtitle ?? ""} className="input" />
      </F>
      <F label="Descrição (opcional)">
        <textarea name="description" rows={3} defaultValue={campaign?.description ?? ""} className="input" />
      </F>

      <div className="grid grid-cols-2 gap-4">
        <ImageUpload label="Imagem (desktop)" folder="campaigns" name="image_desktop_url" defaultValue={campaign?.image_desktop_url ?? undefined} />
        <ImageUpload label="Imagem (mobile)" folder="campaigns" name="image_mobile_url" defaultValue={campaign?.image_mobile_url ?? undefined} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <F label="Texto do botão (opcional)">
          <input name="button_label" defaultValue={campaign?.button_label ?? ""} className="input" />
        </F>
        <F label="Link do botão (opcional)" error={state.fieldErrors?.button_link}>
          <input name="button_link" defaultValue={campaign?.button_link ?? ""} className="input" placeholder="/cardapio" />
        </F>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <F label="Início" error={state.fieldErrors?.starts_at}>
          <input type="datetime-local" name="starts_at" defaultValue={toLocalInput(campaign?.starts_at)} required className="input" />
        </F>
        <F label="Término" error={state.fieldErrors?.ends_at}>
          <input type="datetime-local" name="ends_at" defaultValue={toLocalInput(campaign?.ends_at)} required className="input" />
        </F>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <F label="Status">
          <select name="status" defaultValue={campaign?.status ?? "scheduled"} className="input">
            <option value="draft">Rascunho (nunca aparece)</option>
            <option value="scheduled">Agendada (aparece sozinha na data)</option>
            <option value="active">Ativa (aparece sozinha na data)</option>
            <option value="ended">Encerrada (força ocultar)</option>
          </select>
        </F>
        <F label="Prioridade (maior = aparece primeiro)">
          <input name="priority" type="number" defaultValue={campaign?.priority ?? 0} className="input" />
        </F>
      </div>
      <p className="text-xs text-ink-soft">
        &ldquo;Agendada&rdquo; e &ldquo;Ativa&rdquo; funcionam igual: a campanha some e aparece sozinha conforme a data de
        início/término, sem precisar voltar aqui pra trocar o status.
      </p>

      {state.error && <p className="text-sm text-terracotta">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-pine px-7 py-3 text-sm font-medium text-cream-soft hover:bg-pine-dark disabled:opacity-60"
    >
      {pending ? "Salvando…" : "Salvar campanha"}
    </button>
  );
}

function F({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-terracotta">{error}</p>}
    </div>
  );
}
