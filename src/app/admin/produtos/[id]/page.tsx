import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../product-form";
import type { Category, Product } from "@/types/database";

export default async function EditarProdutoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, images:product_images(*)").eq("id", params.id).single(),
    supabase.from("categories").select("*").order("display_order"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl">Editar produto</h1>
      <div className="mt-6">
        <ProductForm categories={(categories as Category[]) ?? []} product={product as Product} />
      </div>
    </div>
  );
}
