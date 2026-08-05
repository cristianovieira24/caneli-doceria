import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStaff, hasAtLeast } from "@/lib/auth";

function csvEscape(value: unknown): string {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export async function GET() {
  const staff = await getCurrentStaff();
  if (!staff || !hasAtLeast(staff.roles, "editor")) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  const supabase = createClient();
  const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });

  const columns = ["name", "whatsapp", "order_type", "desired_date", "people_count", "budget_hint", "description", "status", "created_at"];
  const header = columns.join(",");
  const rows = (data ?? []).map((row) => columns.map((c) => csvEscape((row as Record<string, unknown>)[c])).join(","));
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="encomendas-caneli.csv"`,
    },
  });
}
