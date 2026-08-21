import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";
import { toCSV } from "@/lib/csv";

const COLUMNS = [
  "name",
  "slug",
  "category_slug",
  "short_description",
  "price",
  "promo_price",
  "price_prefix",
  "weight_or_size",
  "yield_info",
  "featured",
  "seasonal",
  "status",
  "display_order",
];

export async function GET() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(slug)")
    .order("display_order");
  if (error) {
    return NextResponse.json({ error: "Não foi possível exportar os produtos." }, { status: 500 });
  }

  const rows = (data ?? []).map((p: any) => ({ ...p, category_slug: p.category?.slug ?? "" }));
  const csv = toCSV(rows, COLUMNS);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="produtos-caneli.csv"`,
    },
  });
}
