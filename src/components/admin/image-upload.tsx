"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 8;

export function ImageUpload({
  label,
  folder,
  name,
  defaultValue,
}: {
  label: string;
  /** Subfolder inside the "media" bucket, e.g. "products", "stores". */
  folder: string;
  /** The hidden input name that will carry the resulting public URL. */
  name: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setStatus("error");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setStatus("error");
      return;
    }

    setStatus("uploading");
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
    if (error) {
      setStatus("error");
      return;
    }

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    setUrl(data.publicUrl);
    setStatus("idle");
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative w-40">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-ink/10">
            <Image src={url} alt="" fill sizes="160px" className="object-cover" />
          </div>
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Remover imagem"
            className="absolute -right-2 -top-2 rounded-full bg-ink p-1 text-cream-soft"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
          className="flex w-40 aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink/20 text-ink-soft hover:border-pine hover:text-pine"
        >
          {status === "uploading" ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22} />}
          <span className="text-xs">{status === "uploading" ? "Enviando…" : "Enviar foto"}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {status === "error" && (
        <p className="mt-1 text-xs text-terracotta">
          Não foi possível enviar. Use JPG, PNG ou WebP de até {MAX_SIZE_MB}MB.
        </p>
      )}
      <p className="mt-1 text-xs text-ink-soft/60">JPG, PNG ou WebP · até {MAX_SIZE_MB}MB</p>
    </div>
  );
}
