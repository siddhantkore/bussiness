import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { bindWallet } from "@/lib/prototypeStore";

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
  const email = user.email;
  const walletAddress = body.walletAddress as string;
  if (!walletAddress) {
    return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
  }
  const updated = bindWallet(email, walletAddress);
  if (!updated) {
    return NextResponse.json({ error: "Investor KYC not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
