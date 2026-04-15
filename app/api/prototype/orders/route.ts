import { NextResponse } from "next/server";
import { createBuyOrder, getState } from "@/lib/prototypeStore";

export async function GET() {
  return NextResponse.json(getState().orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const assetId = body.assetId as string;
  const units = Number(body.units) || 0;
  if (!assetId || units <= 0) {
    return NextResponse.json({ error: "assetId and units are required" }, { status: 400 });
  }
  const order = createBuyOrder(assetId, units);
  if (!order) {
    return NextResponse.json({ error: "Approved asset not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}
