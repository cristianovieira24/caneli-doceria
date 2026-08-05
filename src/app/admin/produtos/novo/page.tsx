import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../product-form";
import type { Category } from "@/types/database";

export default async function NovoProdutoPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("display_order");

  return (
    <div>
      <h1 className="text-2xl">Novo produto</h1>
      <div className="mt-6">
        <ProductForm categories={(categories as Category[]) ?? []} />
      </div>
    </div>
  );
}
