"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";

const productSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  slug: z
    .string()
    .min(2, "Informe o slug")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen"),
  category_id: z.string().uuid("Escolha uma categoria"),
  short_description: z.string().optional(),
  full_description: z.string().optional(),
  price: z.coerce.number().min(0, "Preço inválido"),
  promo_price: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  price_prefix: z.enum(["", "a partir de"]).default(""),
  weight_or_size: z.string().optional(),
  yield_info: z.string().optional(),
  featured: z.enum(["on"]).optional(),
  seasonal: z.enum(["on"]).optional(),
  status: z.enum(["draft", "published", "archived"]),
  display_order: z.coerce.number().int().default(0),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  image_alt: z.string().optional(),
});

export type ProductFormState = { error?: string; fieldErrors?: Record<string, string> };

async function requireEditor() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) {
    throw new Error("Sem permissão para esta ação.");
  }
  return staff;
}

export async function saveProduct(
  productId: string | null,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireEditor();

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { error: "Confira os campos destacados.", fieldErrors };
  }

  const { image_url, image_alt, featured, seasonal, promo_price, ...rest } = parsed.data;

  const payload = {
    ...rest,
    promo_price: promo_price === "" || promo_price === undefined ? null : promo_price,
    featured: featured === "on",
    seasonal: seasonal === "on",
  };

  const supabase = createClient();
  let id = productId;

  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) return { error: "Não foi possível salvar. " + error.message };
  } else {
    const { data, error } = await supabase.from("products").insert(payload).select("id").single();
    if (error) return { error: "Não foi possível criar. " + error.message };
    id = data.id;
  }

  if (image_url) {
    await supabase.from("product_images").insert({
      product_id: id,
      url: image_url,
      alt: image_alt || rest.name,
      is_primary: true,
      display_order: 0,
    });
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/cardapio");
  redirect("/admin/produtos");
}

export async function deleteProduct(id: string) {
  await requireEditor();
  const supabase = createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/produtos");
}

export async function duplicateProduct(id: string) {
  await requireEditor();
  const supabase = createClient();
  const { data: original } = await supabase.from("products").select("*").eq("id", id).single();
  if (!original) return;
  const { id: _drop, created_at, updated_at, ...copyable } = original;
  await supabase.from("products").insert({
    ...copyable,
    name: `${original.name} (cópia)`,
    slug: `${original.slug}-copia-${Date.now()}`,
    status: "draft",
  });
  revalidatePath("/admin/produtos");
}
