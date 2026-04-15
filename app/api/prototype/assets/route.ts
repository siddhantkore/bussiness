import { NextResponse } from "next/server";
import { getState, submitAsset } from "@/lib/prototypeStore";

export async function GET() {
  return NextResponse.json(getState().assets);
}

export async function POST(request: Request) {
  const body = await request.json();
  const asset = submitAsset({
    issuer: body.issuer ?? "Unknown issuer",
    title: body.title ?? "Untitled asset",
    category: body.category ?? "Real estate",
    description: body.description ?? "",
    city: body.city ?? "Unknown city",
    state: body.state ?? "Unknown state",
    minimumTicket: Number(body.minimumTicket) || 250000,
    unitPrice: Number(body.unitPrice) || 25000,
    units: Number(body.units) || 1000,
    supportingNote: body.supportingNote,
    documents: Array.isArray(body.documents) ? body.documents : [],
  });
  return NextResponse.json(asset);
}
