"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SessionUser, UserRole } from "@/lib/auth";

const navItems = [
  { href: "/", label: "Dashboard", roles: ["admin", "reviewer", "issuer", "investor", "stakeholder"] },
  { href: "/marketplace", label: "Marketplace", roles: ["admin", "investor", "stakeholder"] },
  { href: "/portfolio", label: "Portfolio", roles: ["admin", "investor"] },
  { href: "/orders", label: "Orders", roles: ["admin", "investor"] },
  { href: "/payments", label: "Payments", roles: ["admin", "reviewer"] },
  { href: "/review", label: "Review", roles: ["admin", "reviewer"] },
  { href: "/verification", label: "Verification", roles: ["admin", "issuer"] },
  { href: "/kyc", label: "KYC", roles: ["admin", "investor"] },
  { href: "/stakeholder-insights", label: "Insights", roles: ["admin", "reviewer", "stakeholder"] },
] satisfies Array<{ href: string; label: string; roles: UserRole[] }>;

export function PrototypeShell({
  heading,
  subheading,
  children,
}: {
  heading: string;
  subheading: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    void fetch("/api/prototype/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/prototype/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const visibleNav = user ? navItems.filter((item) => item.roles.includes(user.role)) : navItems;

  return (
    <div className="min-h-screen bg-[#08090b] text-[#fafafa]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d10]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Land Records Exchange
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-xs">
            {visibleNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full border px-3 py-1.5 transition ${
                    active ? "border-[#f7d8b0] bg-[#20170f] text-[#f7d8b0]" : "border-white/10 text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/10 px-3 py-1.5 text-white/70 transition hover:text-white"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="rounded-full border border-white/10 px-3 py-1.5 text-white/70 transition hover:text-white">
                Login
              </Link>
            )}
          </nav>
          {user && (
            <p className="basis-full text-right text-xs text-white/45">
              {user.name} · {user.role}
            </p>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="mb-2 text-xs uppercase tracking-[0.35em] text-white/45">Prototype</p>
        <h1 className="text-4xl font-semibold leading-tight">{heading}</h1>
        <p className="mt-2 max-w-3xl text-sm text-white/60">{subheading}</p>
        <div className="mt-7">{children}</div>
      </main>
    </div>
  );
}
