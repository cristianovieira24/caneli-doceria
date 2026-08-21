"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";
import { removeManagedMedia } from "@/lib/media";

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

type ProductImageRow = {
  id: string;
  url: string;
};

async function requireEditor() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) {
    throw new Error("Sem permissão para esta ação.");
  }
  return staff;
}

async function requireAdmin() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "administrador")) {
    throw new Error("Só administradores podem excluir produtos.");
  }
  return staff;
}

async function syncPrimaryImage(
  supabase: ReturnType<typeof createClient>,
  productId: string,
  imageUrl: string,
  imageAlt: string
) {
  const { data, error: readError } = await supabase
    .from("product_images")
    .select("id, url")
    .eq("product_id", productId);

  if (readError) return "Não foi possível verificar a imagem atual.";

  const existingImages = (data as ProductImageRow[] | null) ?? [];
  const requestedUrl = imageUrl.trim();

  if (!requestedUrl) {
    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId);

    if (error) return "Não foi possível remover a imagem atual.";

    await removeManagedMedia(
      supabase,
      existingImages.map((image) => image.url)
    );
    return null;
  }

  let keptImage = existingImages.find((image) => image.url === requestedUrl);

  if (!keptImage) {
    const { data: inserted, error } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url: requestedUrl,
        alt: imageAlt,
        // Insert as secondary first so this also works after the database
        // starts enforcing one primary image per product.
        is_primary: false,
        display_order: 0,
      })
      .select("id, url")
      .single();

    if (error || !inserted) return "Não foi possível vincular a nova imagem.";
    keptImage = inserted as ProductImageRow;
  }

  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId)
    .neq("id", keptImage.id);

  if (deleteError) return "Não foi possível substituir a imagem anterior.";

  const { error: updateError } = await supabase
    .from("product_images")
    .update({
      alt: imageAlt,
      is_primary: true,
      display_order: 0,
    })
    .eq("id", keptImage.id);

  if (updateError) return "A imagem foi enviada, mas não pôde ser marcada como principal.";

  await removeManagedMedia(
    supabase,
    existingImages
      .filter((image) => image.id !== keptImage.id)
      .map((image) => image.url)
  );

  return null;
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
  let previousSlug: string | null = null;

  if (id) {
    const { data: previousProduct } = await supabase
      .from("products")
      .select("slug")
      .eq("id", id)
      .single();
    previousSlug = previousProduct?.slug ?? null;

    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) return { error: "Não foi possível salvar. " + error.message };
  } else {
    const { data, error } = await supabase.from("products").insert(payload).select("id").single();
    if (error) return { error: "Não foi possível criar. " + error.message };
    id = data.id;
  }

  if (!id) return { error: "Não foi possível identificar o produto salvo." };

  const imageError = await syncPrimaryImage(
    supabase,
    id,
    image_url || "",
    image_alt?.trim() || rest.name
  );

  if (imageError) {
    return {
      error: `Os dados do produto foram salvos, mas houve um problema com a foto. ${imageError}`,
    };
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/cardapio");
  revalidatePath("/");
  revalidatePath(`/cardapio/${rest.slug}`);
  if (previousSlug && previousSlug !== rest.slug) {
    revalidatePath(`/cardapio/${previousSlug}`);
  }
  redirect("/admin/produtos");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createClient();

  const { data: images, error: imageReadError } = await supabase
    .from("product_images")
    .select("url")
    .eq("product_id", id);
  if (imageReadError) throw new Error("Não foi possível verificar as fotos do produto.");

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir o produto. " + error.message);

  await removeManagedMedia(
    supabase,
    (images ?? []).map((image) => image.url)
  );
  revalidatePath("/admin/produtos");
  revalidatePath("/cardapio");
  revalidatePath("/");
}

export async function duplicateProduct(id: string) {
  await requireEditor();
  const supabase = createClient();
  const { data: original, error: readError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (readError || !original) throw new Error("Não foi possível localizar o produto original.");
  const { id: _drop, created_at, updated_at, ...copyable } = original;
  const { error } = await supabase.from("products").insert({
    ...copyable,
    name: `${original.name} (cópia)`,
    slug: `${original.slug}-copia-${Date.now()}`,
    status: "draft",
  });
  if (error) throw new Error("Não foi possível duplicar o produto. " + error.message);
  revalidatePath("/admin/produtos");
}
