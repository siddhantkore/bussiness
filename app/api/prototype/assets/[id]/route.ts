import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { updateAssetStatus } from "@/lib/prototypeStore";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const { user, response } = requireRole(request, ["admin", "reviewer"]);
  if (response) return response;
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

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
  const updated = updateAssetStatus(id, status, user.email, String(body.note ?? ""));
  if (!updated) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
