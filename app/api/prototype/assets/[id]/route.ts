import { NextResponse } from "next/server";
import { updateAssetStatus } from "@/lib/prototypeStore";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  const status = body.status as "APPROVED" | "REJECTED";
  if (status !== "APPROVED" && status !== "REJECTED") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const updated = updateAssetStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
