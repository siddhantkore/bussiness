import { NextResponse } from "next/server";
import { getState } from "@/lib/prototypeStore";

export async function GET() {
  return NextResponse.json(getState());
}
