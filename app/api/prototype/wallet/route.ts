import { NextResponse } from "next/server";
import { bindWallet } from "@/lib/prototypeStore";

export async function POST(request: Request) {
  const body = await request.json();
  const email = body.email as string;
  const walletAddress = body.walletAddress as string;
  if (!email || !walletAddress) {
    return NextResponse.json({ error: "email and walletAddress are required" }, { status: 400 });
  }
  const updated = bindWallet(email, walletAddress);
  if (!updated) {
    return NextResponse.json({ error: "Investor KYC not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
