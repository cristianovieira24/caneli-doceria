import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryForm } from "../category-form";
import type { Category } from "@/types/database";

export default async function EditarCategoriaPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("categories").select("*").eq("id", params.id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-2xl">Editar categoria</h1>
      <div className="mt-6">
        <CategoryForm category={data as Category} />
      </div>
    </div>
  );
}
