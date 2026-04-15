import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { createBuyOrder, getState } from "@/lib/prototypeStore";

export async function GET(request: Request) {
  const { user, response } = requireRole(request, ["admin", "reviewer", "investor"]);
  if (response) return response;
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const orders =
    user.role === "admin" || user.role === "reviewer"
      ? getState().orders
      : getState().orders.filter((order) => order.investorEmail === user.email);
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const { user, response } = requireRole(request, ["admin", "investor"]);
  if (response) return response;
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const assetId = body.assetId as string;
  const units = Number(body.units) || 0;
  if (!assetId || units <= 0) {
    return NextResponse.json({ error: "assetId and units are required" }, { status: 400 });
  }
  const order = createBuyOrder(assetId, units, user.email);
  if ("error" in order) {
    return NextResponse.json({ error: order.error }, { status: 400 });
  }
  return NextResponse.json(order);
}
