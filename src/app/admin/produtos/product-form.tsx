"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { saveProduct, type ProductFormState } from "./actions";
import { ImageUpload } from "@/components/admin/image-upload";
import type { Category, Product } from "@/types/database";

const initialState: ProductFormState = {};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const action = saveProduct.bind(null, product?.id ?? null);
  const [state, formAction] = useFormState(action, initialState);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!product);

  const primaryImage = product?.images?.find((i) => i.is_primary) ?? product?.images?.[0];

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <Field label="Nome do produto" name="name" error={state.fieldErrors?.name}>
        <input
          name="name"
          defaultValue={name}
          required
          className="input"
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </Field>

      <Field label="Slug (usado na URL)" name="slug" error={state.fieldErrors?.slug}>
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
      </Field>

      <Field label="Categoria" name="category_id" error={state.fieldErrors?.category_id}>
        <select name="category_id" defaultValue={product?.category_id ?? ""} required className="input">
          <option value="" disabled>
            Selecione
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Descrição curta (aparece no card)" name="short_description">
        <input name="short_description" defaultValue={product?.short_description ?? ""} className="input" />
      </Field>

      <Field label="Descrição completa (aparece na página do produto)" name="full_description">
        <textarea name="full_description" rows={4} defaultValue={product?.full_description ?? ""} className="input" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Preço (R$)" name="price" error={state.fieldErrors?.price}>
          <input name="price" type="number" step="0.01" min="0" defaultValue={product?.price ?? ""} required className="input" />
        </Field>
        <Field label="Preço promocional (opcional)" name="promo_price">
          <input name="promo_price" type="number" step="0.01" min="0" defaultValue={product?.promo_price ?? ""} className="input" />
        </Field>
      </div>

      <Field label="Prefixo de preço" name="price_prefix">
        <select name="price_prefix" defaultValue={product?.price_prefix ?? ""} className="input">
          <option value="">Preço exato</option>
          <option value="a partir de">a partir de</option>
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Peso / tamanho (opcional)" name="weight_or_size">
          <input name="weight_or_size" defaultValue={product?.weight_or_size ?? ""} className="input" />
        </Field>
        <Field label="Rendimento (opcional)" name="yield_info">
          <input name="yield_info" defaultValue={product?.yield_info ?? ""} className="input" />
        </Field>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} /> Destaque na home
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="seasonal" defaultChecked={product?.seasonal} /> Produto sazonal
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Status" name="status">
          <select name="status" defaultValue={product?.status ?? "draft"} className="input">
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>
        </Field>
        <Field label="Ordem de exibição" name="display_order">
          <input name="display_order" type="number" defaultValue={product?.display_order ?? 0} className="input" />
        </Field>
      </div>

      <fieldset className="rounded-card border border-ink/10 p-4">
        <legend className="px-1 text-sm font-medium text-ink">Foto principal</legend>
        <div className="space-y-3">
          <ImageUpload label="" folder="products" name="image_url" defaultValue={primaryImage?.url} />
          <input name="image_alt" placeholder="Texto alternativo (descreva a foto)" defaultValue={primaryImage?.alt ?? ""} className="input" />
        </div>
      </fieldset>

      <details className="rounded-card border border-ink/10 p-4">
        <summary className="cursor-pointer text-sm font-medium text-ink">SEO (opcional)</summary>
        <div className="mt-3 space-y-3">
          <Field label="Título SEO" name="seo_title">
            <input name="seo_title" defaultValue={product?.seo_title ?? ""} className="input" />
          </Field>
          <Field label="Descrição SEO" name="seo_description">
            <textarea name="seo_description" rows={2} defaultValue={product?.seo_description ?? ""} className="input" />
          </Field>
        </div>
      </details>

      {state.error && (
        <p role="alert" className="text-sm text-terracotta">
          {state.error}
        </p>
      )}

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
      {pending ? "Salvando…" : "Salvar produto"}
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
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-sm text-terracotta">
          {error}
        </p>
      )}
    </div>
  );
}
