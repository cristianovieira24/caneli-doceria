"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { saveCategory, type CategoryFormState } from "./actions";
import { ImageUpload } from "@/components/admin/image-upload";
import type { Category } from "@/types/database";

const initialState: CategoryFormState = {};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryForm({ category }: { category?: Category }) {
  const action = saveCategory.bind(null, category?.id ?? null);
  const [state, formAction] = useFormState(action, initialState);
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!category);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Nome</label>
        <input
          name="name"
          defaultValue={category?.name ?? ""}
          required
          className="input"
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
        {state.fieldErrors?.name && <p className="mt-1 text-sm text-terracotta">{state.fieldErrors.name}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Slug</label>
        <input
          name="slug"
          value={slug}
          required
          className="input"
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
        />
        {state.fieldErrors?.slug && <p className="mt-1 text-sm text-terracotta">{state.fieldErrors.slug}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Descrição (opcional)</label>
        <textarea name="description" rows={3} defaultValue={category?.description ?? ""} className="input" />
      </div>

      <ImageUpload label="Imagem (opcional)" folder="categories" name="image_url" defaultValue={category?.image_url ?? undefined} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Ordem de exibição</label>
          <input name="display_order" type="number" defaultValue={category?.display_order ?? 0} className="input" />
        </div>
        <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-ink">
          <input type="checkbox" name="visible" defaultChecked={category?.visible ?? true} /> Visível no site
        </label>
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
      className="rounded-full bg-pine px-7 py-3 text-sm font-medium text-cream-soft hover:bg-pine-dark disabled:opacity-60"
    >
      {pending ? "Salvando…" : "Salvar categoria"}
    </button>
  );
}
