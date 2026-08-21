"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus } from "./actions";
import type { LeadStatus } from "@/types/database";

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "em_contato", label: "Em contato" },
  { value: "orcamento_enviado", label: "Orçamento enviado" },
  { value: "confirmado", label: "Confirmado" },
  { value: "concluido", label: "Concluído" },
  { value: "cancelado", label: "Cancelado" },
];

export function LeadStatusSelect({ id, status }: { id: string; status: LeadStatus }) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(status);
  const [error, setError] = useState(false);

  return (
    <div className="min-w-40">
      <select
        value={value}
        disabled={pending}
        onChange={(event) => {
          const previous = value;
          const next = event.target.value as LeadStatus;
          setValue(next);
          setError(false);

          startTransition(async () => {
            try {
              await updateLeadStatus(id, next);
            } catch {
              setValue(previous);
              setError(true);
            }
          });
        }}
        className="input py-1.5 text-xs"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="mt-1 text-xs text-terracotta">
          Não foi possível salvar o status.
        </p>
      )}
    </div>
  );
}
