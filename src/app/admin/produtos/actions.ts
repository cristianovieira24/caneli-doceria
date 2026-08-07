"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";
import { parseCSV } from "@/lib/csv";

export interface ImportRowResult {
  row: number;
  name: string;
  status: "created" | "updated" | "error";
  message?: string;
}

export interface ImportResult {
  results: ImportRowResult[];
  errorCount: number;
}

async function requireEditor() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) throw new Error("Sem permissão.");
}

const REQUIRED_COLUMNS = ["name", "slug", "category_slug", "price"];
const VALID_STATUS = ["draft", "published", "archived"];
const VALID_PREFIX = ["", "a partir de"];

export async function importProductsCSV(_prev: ImportResult | null, formData: FormData): Promise<ImportResult> {
  await requireEditor();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { results: [{ row: 0, name: "", status: "error", message: "Nenhum arquivo enviado." }], errorCount: 1 };
  }

  const text = await file.text();
  const rows = parseCSV(text);
  const supabase = createClient();

  const { data: categories } = await supabase.from("categories").select("id, slug");
  const categoryBySlug = new Map((categories ?? []).map((c) => [c.slug, c.id]));

  const results: ImportRowResult[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const rowNumber = i + 2; // +1 header, +1 to be 1-indexed for humans

    const missing = REQUIRED_COLUMNS.filter((c) => !r[c]);
    if (missing.length > 0) {
      results.push({ row: rowNumber, name: r.name || "(sem nome)", status: "error", message: `Faltando: ${missing.join(", ")}` });
      continue;
    }

    const categoryId = categoryBySlug.get(r.category_slug);
    if (!categoryId) {
      results.push({ row: rowNumber, name: r.name, status: "error", message: `Categoria "${r.category_slug}" não existe` });
      continue;
    }

    const price = Number(r.price.replace(",", "."));
    if (Number.isNaN(price)) {
      results.push({ row: rowNumber, name: r.name, status: "error", message: "Preço inválido" });
      continue;
    }

    const status = VALID_STATUS.includes(r.status) ? r.status : "draft";
    const pricePrefix = VALID_PREFIX.includes(r.price_prefix) ? r.price_prefix : "";
    const promoPrice = r.promo_price ? Number(r.promo_price.replace(",", ".")) : null;

    const payload = {
      name: r.name,
      slug: r.slug,
      category_id: categoryId,
      short_description: r.short_description || null,
      price,
      promo_price: promoPrice && !Number.isNaN(promoPrice) ? promoPrice : null,
      price_prefix: pricePrefix,
      weight_or_size: r.weight_or_size || null,
      yield_info: r.yield_info || null,
      featured: r.featured === "true" || r.featured === "1",
      seasonal: r.seasonal === "true" || r.seasonal === "1",
      status,
      display_order: r.display_order ? Number(r.display_order) : 0,
    };

    const { data: existing } = await supabase.from("products").select("id").eq("slug", r.slug).maybeSingle();

    if (existing) {
      const { error } = await supabase.from("products").update(payload).eq("id", existing.id);
      results.push(
        error
          ? { row: rowNumber, name: r.name, status: "error", message: error.message }
          : { row: rowNumber, name: r.name, status: "updated" }
      );
    } else {
      const { error } = await supabase.from("products").insert(payload);
      results.push(
        error
          ? { row: rowNumber, name: r.name, status: "error", message: error.message }
          : { row: rowNumber, name: r.name, status: "created" }
      );
    }
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/cardapio");

  return { results, errorCount: results.filter((r) => r.status === "error").length };
}
