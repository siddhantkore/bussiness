import Link from "next/link";
import { PrototypeShell } from "@/components/prototype/PrototypeShell";

const routes = [
  { href: "/verification", title: "Submit asset for review", desc: "Issuer uploads and creates verification requests." },
  { href: "/review", title: "Admin review queue", desc: "Approve or reject KYC and asset submissions." },
  { href: "/marketplace", title: "Marketplace", desc: "Browse approved assets visible for investors." },
  { href: "/marketplace/asset-1", title: "Asset room and primary order", desc: "Create buy orders directly from an approved asset." },
  { href: "/payments", title: "Settle pending payments", desc: "Convert pending orders to paid settlements." },
  { href: "/portfolio", title: "Listings and payouts", desc: "See holdings and create secondary listings." },
  { href: "/kyc", title: "Investor KYC + wallet binding", desc: "Submit investor profile and bind wallet address." },
  { href: "/stakeholder-insights", title: "Stakeholder information layer", desc: "See ownership history, execution dates, income details, and encumbrances." },
];

export default function HomePage() {
  return (
    <PrototypeShell
      heading="Working Prototype"
      subheading="This app now mirrors your provided UI set with connected workflows and a simple in-memory backend."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {routes.map((route) => (
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
