import { NextResponse } from "next/server";
import { encodeSession, findDemoUser, SESSION_COOKIE, toSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const user = findDemoUser(String(body.email ?? ""), String(body.password ?? ""));
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const sessionUser = toSessionUser(user);
  const response = NextResponse.json({ user: sessionUser });
  response.cookies.set(SESSION_COOKIE, encodeSession(sessionUser), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
