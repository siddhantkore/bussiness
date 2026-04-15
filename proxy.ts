import { NextResponse, type NextRequest } from "next/server";
import { decodeSession, SESSION_COOKIE, type UserRole } from "@/lib/auth";

const protectedRoutes: Array<{ prefix: string; roles: UserRole[] }> = [
  { prefix: "/review", roles: ["admin", "reviewer"] },
  { prefix: "/payments", roles: ["admin", "reviewer"] },
  { prefix: "/verification", roles: ["admin", "issuer"] },
  { prefix: "/kyc", roles: ["admin", "investor"] },
  { prefix: "/orders", roles: ["admin", "investor"] },
  { prefix: "/portfolio", roles: ["admin", "investor"] },
  { prefix: "/marketplace", roles: ["admin", "investor", "stakeholder"] },
  { prefix: "/stakeholder-insights", roles: ["admin", "reviewer", "stakeholder"] },
  { prefix: "/properties", roles: ["admin", "reviewer"] },
  { prefix: "/ownership", roles: ["admin", "reviewer"] },
  { prefix: "/encumbrances", roles: ["admin", "reviewer"] },
  { prefix: "/income", roles: ["admin", "reviewer"] },
  { prefix: "/documents", roles: ["admin", "reviewer"] },
  { prefix: "/", roles: ["admin", "reviewer", "issuer", "investor", "stakeholder"] },
];

function routeFor(pathname: string) {
  return protectedRoutes.find((route) => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/login") {
    return NextResponse.next();
  }

  const route = routeFor(pathname);
  if (!route) {
    return NextResponse.next();
  }

  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!route.roles.includes(session.role)) {
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("forbidden", "1");
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/review/:path*",
    "/payments/:path*",
    "/verification/:path*",
    "/kyc/:path*",
    "/orders/:path*",
    "/portfolio/:path*",
    "/marketplace/:path*",
    "/stakeholder-insights/:path*",
    "/properties/:path*",
    "/ownership/:path*",
    "/encumbrances/:path*",
    "/income/:path*",
    "/documents/:path*",
    "/login",
  ],
};
