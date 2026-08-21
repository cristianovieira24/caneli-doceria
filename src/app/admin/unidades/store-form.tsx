"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { saveStore, type StoreFormState } from "./actions";
import { ImageUpload } from "@/components/admin/image-upload";
import type { Store } from "@/types/database";

const initialState: StoreFormState = {};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function StoreForm({ store }: { store?: Store }) {
  const action = saveStore.bind(null, store?.id ?? null);
  const [state, formAction] = useFormState(action, initialState);
  const [slug, setSlug] = useState(store?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!store);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <F label="Nome da unidade" error={state.fieldErrors?.name}>
          <input
            name="name"
            defaultValue={store?.name ?? ""}
            required
            className="input"
            onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))}
          />
        </F>
        <F label="Slug" error={state.fieldErrors?.slug}>
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
        </F>
      </div>

      <F label="Bairro" error={state.fieldErrors?.neighborhood}>
        <input name="neighborhood" defaultValue={store?.neighborhood ?? ""} required className="input" />
      </F>

      <F label="Endereço completo" error={state.fieldErrors?.address}>
        <input name="address" defaultValue={store?.address ?? ""} required className="input" />
      </F>

      <div className="grid grid-cols-3 gap-4">
        <F label="Cidade"><input name="city" defaultValue={store?.city ?? "Goiânia"} required className="input" /></F>
        <F label="UF"><input name="state" maxLength={2} defaultValue={store?.state ?? "GO"} required className="input" /></F>
        <F label="CEP (opcional)"><input name="zip_code" defaultValue={store?.zip_code ?? ""} className="input" /></F>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <F label="WhatsApp (com DDI+DDD, só números)" error={state.fieldErrors?.whatsapp}>
          <input name="whatsapp" placeholder="5562999999999" defaultValue={store?.whatsapp ?? ""} required className="input" />
        </F>
        <F label="Telefone (opcional)">
          <input name="phone" defaultValue={store?.phone ?? ""} className="input" />
        </F>
      </div>

      <F label="Modo de pedido">
        <select name="order_mode" defaultValue={store?.order_mode ?? "whatsapp"} className="input">
          <option value="whatsapp">Pedido pelo WhatsApp</option>
          <option value="external_link">Link externo (iFood, etc.)</option>
          <option value="menu_only">Cardápio apenas para consulta</option>
          <option value="internal">Pedido interno (futuro)</option>
        </select>
      </F>

      <ImageUpload label="Foto da unidade (opcional)" folder="stores" name="photo_url" defaultValue={store?.photo_url ?? undefined} />

      <F label="Descrição (opcional)">
        <textarea name="description" rows={3} defaultValue={store?.description ?? ""} className="input" />
      </F>

      <div className="grid grid-cols-2 gap-4">
        <F label="Status">
          <select name="status" defaultValue={store?.status ?? "active"} className="input">
            <option value="active">Ativa</option>
            <option value="temporarily_closed">Temporariamente fechada</option>
          </select>
        </F>
        <F label="Ordem de exibição">
          <input name="display_order" type="number" defaultValue={store?.display_order ?? 0} className="input" />
        </F>
      </div>

      <p className="text-xs text-ink-soft">
        Depois de salvar, abra novamente esta unidade para editar o horário de
        funcionamento de cada dia da semana.
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
      {pending ? "Salvando…" : "Salvar unidade"}
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
