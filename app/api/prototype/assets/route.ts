import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getState, submitAsset } from "@/lib/prototypeStore";

export async function GET(request: Request) {
  const { response } = requireRole(request, ["admin", "reviewer", "issuer", "investor", "stakeholder"]);
  if (response) return response;
  return NextResponse.json(getState().assets.filter((asset) => asset.status === "APPROVED"));
}

export async function POST(request: Request) {
  const { user, response } = requireRole(request, ["admin", "issuer"]);
  if (response) return response;
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const required = ["issuer", "title", "category", "city", "state", "description"];
  const missing = required.filter((field) => !String(body[field] ?? "").trim());
  if (missing.length) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
  }

  const minimumTicket = Number(body.minimumTicket) || 0;
  const unitPrice = Number(body.unitPrice) || 0;
  const units = Number(body.units) || 0;
  if (minimumTicket <= 0 || unitPrice <= 0 || units <= 0) {
    return NextResponse.json({ error: "minimumTicket, unitPrice, and units must be positive numbers" }, { status: 400 });
  }

  const latitude = body.latitude === "" || body.latitude == null ? undefined : Number(body.latitude);
  const longitude = body.longitude === "" || body.longitude == null ? undefined : Number(body.longitude);
  if ((latitude !== undefined && !Number.isFinite(latitude)) || (longitude !== undefined && !Number.isFinite(longitude))) {
    return NextResponse.json({ error: "Map latitude and longitude must be valid numbers" }, { status: 400 });
  }

  const asset = submitAsset({
    issuerEmail: user.email,
    issuer: String(body.issuer),
    title: String(body.title),
    category: String(body.category),
    description: String(body.description),
    city: String(body.city),
    state: String(body.state),
    minimumTicket,
    unitPrice,
    units,
    supportingNote: String(body.supportingNote ?? ""),
    documents: Array.isArray(body.documents) ? body.documents.map(String).filter(Boolean) : [],
    location:
      latitude !== undefined && longitude !== undefined
        ? { latitude, longitude, label: String(body.locationLabel ?? "") }
        : undefined,
  });
  return NextResponse.json(asset);
}
