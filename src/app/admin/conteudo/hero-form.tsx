"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveHeroSection, type ContentFormState } from "./actions";
import { ImageUpload } from "@/components/admin/image-upload";

const initialState: ContentFormState = {};

export function HeroForm({
  defaultValues,
}: {
  defaultValues?: { eyebrow?: string; title?: string; description?: string; image_url?: string; image_alt?: string };
}) {
  const [state, formAction] = useFormState(saveHeroSection, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Texto pequeno acima do título</label>
        <input name="eyebrow" defaultValue={defaultValues?.eyebrow ?? "doces, cafés"} className="input" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Título grande</label>
        <input name="title" defaultValue={defaultValues?.title ?? "& dias felizes."} required className="input" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Texto de apoio</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={
            defaultValues?.description ??
            "Croissants recheados na hora, bolos de colher e café coado fresquinho — feitos todos os dias nas nossas lojas em Goiânia."
          }
          className="input"
        />
      </div>
      <ImageUpload label="Foto principal" folder="hero" name="image_url" defaultValue={defaultValues?.image_url} />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Texto alternativo da foto</label>
        <input name="image_alt" defaultValue={defaultValues?.image_alt ?? ""} className="input" />
      </div>

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
      {pending ? "Salvando…" : "Salvar banner"}
    </button>
  );
}
