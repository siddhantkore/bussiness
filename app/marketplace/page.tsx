"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PrototypeShell } from "@/components/prototype/PrototypeShell";
import type { Asset } from "@/components/prototype/types";
import { fetchBootstrap } from "@/lib/prototypeClient";

export default function MarketplacePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBootstrap().then((data) => setAssets(data.assets));
  }, []);

  const visibleAssets = useMemo(() => {
    return assets
      .filter((item) => item.status === "APPROVED")
      .filter((item) => `${item.title} ${item.city} ${item.category}`.toLowerCase().includes(search.toLowerCase()));
  }, [assets, search]);

  return (
    <PrototypeShell
      heading="Browse approved live assets"
      subheading="Explore primary offerings and active secondary liquidity from a dedicated market route."
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <p className="mb-2 text-xl font-semibold">Filters</p>
        <input
          className="w-full rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm"
          placeholder="Search Whitefield, logistics, Gurgaon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {visibleAssets.map((asset) => (
          <Link
            key={asset.id}
            href={`/marketplace/${asset.id}`}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-[#f7d8b0]/50"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-2xl font-semibold">{asset.title}</p>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs text-emerald-300">LIVE</span>
            </div>
            <p className="mt-2 text-sm text-white/70">{asset.city}, {asset.state}</p>
            <p className="mt-3 text-sm text-white/70">{asset.description}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-white/45">Minimum ticket</p>
                <p className="font-semibold">₹{asset.minimumTicket.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-white/45">Unit price</p>
                <p className="font-semibold">₹{asset.unitPrice.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-white/45">Target IRR</p>
                <p className="font-semibold">{asset.targetIrr}%</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PrototypeShell>
  );
}
