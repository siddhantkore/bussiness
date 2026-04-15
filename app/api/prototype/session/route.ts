import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  return NextResponse.json({ user: getSessionFromRequest(request) });
}
