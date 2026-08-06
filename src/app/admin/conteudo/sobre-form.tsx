"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveSobreSection, type ContentFormState } from "./actions";
import { ImageUpload } from "@/components/admin/image-upload";

const initialState: ContentFormState = {};

export function SobreForm({ defaultValues }: { defaultValues?: { title?: string; body?: string; image_url?: string } }) {
  const [state, formAction] = useFormState(saveSobreSection, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Título</label>
        <input
          name="title"
          defaultValue={defaultValues?.title ?? "Doces momentos & dias felizes"}
          required
          className="input"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Texto (história real da Caneli)</label>
        <textarea name="body" rows={6} defaultValue={defaultValues?.body ?? ""} required className="input" />
      </div>
      <ImageUpload label="Foto (opcional)" folder="sobre" name="image_url" defaultValue={defaultValues?.image_url} />

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
      className="rounded-full bg-pine px-6 py-2.5 text-sm font-medium text-cream-soft hover:bg-pine-dark disabled:opacity-60"
    >
      {pending ? "Salvando…" : "Salvar página Sobre"}
    </button>
  );
}
