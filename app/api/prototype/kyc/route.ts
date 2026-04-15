import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getState, submitKyc } from "@/lib/prototypeStore";

export async function GET(request: Request) {
  const { user, response } = requireRole(request, ["admin", "reviewer", "investor"]);
  if (response) return response;
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const records =
    user.role === "admin" || user.role === "reviewer"
      ? getState().kycRequests
      : getState().kycRequests.filter((record) => record.email === user.email);
  return NextResponse.json(records);
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

  if (!String(body.investorName ?? "").trim()) {
    return NextResponse.json({ error: "Investor name is required" }, { status: 400 });
  }

  const record = submitKyc({
    investorName: String(body.investorName),
    email: user.email,
    pan: String(body.pan ?? ""),
    aadhaarLast4: String(body.aadhaarLast4 ?? ""),
    occupation: String(body.occupation ?? ""),
    incomeBand: String(body.incomeBand ?? ""),
    walletAddress: body.walletAddress ? String(body.walletAddress) : undefined,
  });
  return NextResponse.json(record);
}
