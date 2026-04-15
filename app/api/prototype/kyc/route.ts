import { NextResponse } from "next/server";
import { getState, submitKyc } from "@/lib/prototypeStore";

export async function GET() {
  return NextResponse.json(getState().kycRequests);
}

export async function POST(request: Request) {
  const body = await request.json();
  const record = submitKyc({
    investorName: body.investorName ?? "Investor",
    email: body.email ?? "investor@example.com",
    pan: body.pan ?? "",
    aadhaarLast4: body.aadhaarLast4 ?? "",
    occupation: body.occupation ?? "",
    incomeBand: body.incomeBand ?? "",
    walletAddress: body.walletAddress,
  });
  return NextResponse.json(record);
}
