"use client";

import { useState } from "react";
import { saveStoreHours } from "../actions";
import type { StoreHours } from "@/types/database";

const WEEKDAY_LABELS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function HoursEditor({ storeId, hours }: { storeId: string; hours: StoreHours[] }) {
  const [saved, setSaved] = useState(false);
  const byWeekday = new Map(hours.map((h) => [h.weekday, h]));

  return (
    <form
      action={async (formData) => {
        await saveStoreHours(storeId, formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className="space-y-3"
    >
      {WEEKDAY_LABELS.map((label, day) => {
        const existing = byWeekday.get(day);
        return (
          <div key={day} className="grid grid-cols-[100px_1fr_1fr_auto] items-center gap-3">
            <span className="text-sm text-ink">{label}</span>
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
            <label className="flex items-center gap-1.5 text-xs text-ink-soft">
              <input type="checkbox" name={`closed_${day}`} defaultChecked={existing?.closed ?? false} /> Fechado
            </label>
          </div>
        );
      })}

      <button type="submit" className="rounded-full bg-pine px-6 py-2.5 text-sm text-cream-soft hover:bg-pine-dark">
        Salvar horários
      </button>
      {saved && <span className="ml-3 text-sm text-pine">Salvo ✓</span>}
    </form>
  );
}
