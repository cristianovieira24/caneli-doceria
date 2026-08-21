"use client";

import { useState } from "react";
import { saveStoreHours } from "../actions";
import type { StoreHours } from "@/types/database";

const WEEKDAY_LABELS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function HoursEditor({ storeId, hours }: { storeId: string; hours: StoreHours[] }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const byWeekday = new Map(hours.map((h) => [h.weekday, h]));

  return (
    <form
      action={async (formData) => {
        setSaving(true);
        setSaved(false);
        setError(false);

        try {
          await saveStoreHours(storeId, formData);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        } catch {
          setError(true);
        } finally {
          setSaving(false);
        }
      }}
      className="space-y-3"
    >
      {WEEKDAY_LABELS.map((label, day) => {
        const existing = byWeekday.get(day);
        return (
          <div key={day} className="grid grid-cols-2 items-center gap-2 sm:grid-cols-[100px_1fr_1fr_auto] sm:gap-3">
            <span className="col-span-2 text-sm text-ink sm:col-span-1">{label}</span>
            <input
              type="time"
              name={`opens_${day}`}
              defaultValue={existing?.opens_at ?? ""}
              className="input py-1.5"
            />
            <input
              type="time"
              name={`closes_${day}`}
              defaultValue={existing?.closes_at ?? ""}
              className="input py-1.5"
            />
            <label className="col-span-2 flex items-center gap-1.5 text-xs text-ink-soft sm:col-span-1">
              <input type="checkbox" name={`closed_${day}`} defaultChecked={existing?.closed ?? false} /> Fechado
            </label>
          </div>
        );
      })}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-pine px-6 py-2.5 text-sm text-cream-soft hover:bg-pine-dark disabled:opacity-60"
      >
        {saving ? "Salvando…" : "Salvar horários"}
      </button>
      {saved && <span className="ml-3 text-sm text-pine">Salvo ✓</span>}
      {error && (
        <p role="alert" className="mt-2 text-sm text-terracotta">
          Não foi possível salvar os horários. Tente novamente.
        </p>
      )}
    </form>
  );
}
