import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";
import { toCSV } from "@/lib/csv";

export async function GET() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: "Não foi possível exportar as encomendas." }, { status: 500 });
  }

  const columns = ["name", "whatsapp", "order_type", "desired_date", "people_count", "budget_hint", "description", "status", "created_at"];
  const csv = toCSV((data ?? []) as Record<string, unknown>[], columns);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="encomendas-caneli.csv"`,
    },
  });
}
