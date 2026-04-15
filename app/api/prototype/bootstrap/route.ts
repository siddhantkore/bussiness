import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { getStateForUser } from "@/lib/prototypeStore";

export async function GET(request: Request) {
  const user = getSessionFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  return NextResponse.json(getStateForUser(user));
}
