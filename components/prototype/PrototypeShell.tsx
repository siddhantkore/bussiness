"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/orders", label: "Orders" },
  { href: "/payments", label: "Payments" },
  { href: "/review", label: "Review" },
  { href: "/verification", label: "Verification" },
  { href: "/kyc", label: "KYC" },
];

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
  return (
    <div className="min-h-screen bg-[#08090b] text-[#fafafa]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d10]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Eternal Exchange
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-xs">
            {navItems.map((item) => {
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
          </nav>
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
