import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { settleOrder } from "@/lib/prototypeStore";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, context: Context) {
  const { response } = requireRole(_, ["admin", "reviewer"]);
  if (response) return response;

  const { id } = await context.params;
  const settled = settleOrder(id);
  if (!settled) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(settled);
}
