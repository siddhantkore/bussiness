import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { updateKycStatus } from "@/lib/prototypeStore";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const { response } = requireRole(request, ["admin", "reviewer"]);
  if (response) return response;

  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const status = body.status as "APPROVED" | "REJECTED";
  if (status !== "APPROVED" && status !== "REJECTED") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const updated = updateKycStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "KYC request not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
