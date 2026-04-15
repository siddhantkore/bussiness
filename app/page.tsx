"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PrototypeShell } from "@/components/prototype/PrototypeShell";
import type { SessionUser, UserRole } from "@/lib/auth";
import { fetchSession } from "@/lib/prototypeClient";

const routes = [
  { href: "/verification", title: "Submit asset for review", desc: "Issuer uploads and creates verification requests.", roles: ["admin", "issuer"] },
  { href: "/review", title: "Admin review queue", desc: "Approve or reject KYC and asset submissions.", roles: ["admin", "reviewer"] },
  { href: "/marketplace", title: "Marketplace", desc: "Browse approved assets visible for investors.", roles: ["admin", "investor", "stakeholder"] },
  { href: "/marketplace/asset-1", title: "Asset room and primary order", desc: "Create buy orders directly from an approved asset.", roles: ["admin", "investor"] },
  { href: "/payments", title: "Settle pending payments", desc: "Convert pending orders to paid settlements.", roles: ["admin", "reviewer"] },
  { href: "/portfolio", title: "Listings and payouts", desc: "See holdings and create secondary listings.", roles: ["admin", "investor"] },
  { href: "/kyc", title: "Investor KYC + wallet binding", desc: "Submit investor profile and bind wallet address.", roles: ["admin", "investor"] },
  { href: "/stakeholder-insights", title: "Stakeholder information layer", desc: "See ownership history, execution dates, income details, and encumbrances.", roles: ["admin", "reviewer", "stakeholder"] },
] satisfies Array<{ href: string; title: string; desc: string; roles: UserRole[] }>;

export default function HomePage() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    void fetchSession().then(setUser);
  }, []);

  const visibleRoutes = user ? routes.filter((route) => (route.roles as UserRole[]).includes(user.role)) : routes;

  return (
    <PrototypeShell
      heading="Working Prototype"
      subheading="This app now mirrors your provided UI set with connected workflows and a simple in-memory backend."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {visibleRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-[#f7d8b0]/50"
          >
            <p className="text-lg font-medium">{route.title}</p>
            <p className="mt-2 text-sm text-white/65">{route.desc}</p>
          </Link>
        ))}
      </div>
    </PrototypeShell>
  );
}
