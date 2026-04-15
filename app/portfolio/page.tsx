"use client";

import { useEffect, useMemo, useState } from "react";
import { PrototypeShell } from "@/components/prototype/PrototypeShell";
import type { Asset, Order } from "@/components/prototype/types";
import { fetchBootstrap } from "@/lib/prototypeClient";

export default function PortfolioPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBootstrap().then((data) => {
      setAssets(data.assets);
      setOrders(data.orders);
    });
  }, []);

  const holdings = useMemo(
    () =>
      orders
        .filter((item) => item.status === "PAID")
        .map((order) => {
          const asset = assets.find((item) => item.id === order.assetId);
          return { order, asset };
        }),
    [assets, orders]
  );

  return (
    <PrototypeShell heading="Holdings, listings, and payouts" subheading="Manage current positions and publish secondary liquidity from a dedicated portfolio route.">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <p className="text-sm text-white/45">Wallet funds</p>
        <p className="mt-2 text-4xl font-semibold">₹{orders.filter((item) => item.status === "PAID").reduce((sum, item) => sum + item.amountInr, 0).toLocaleString("en-IN")}</p>
      </div>

      <div className="mt-4 space-y-3">
        {holdings.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/70">
            No paid holdings yet. Complete a payment first.
          </div>
        )}
        {holdings.map(({ order, asset }) => (
          <div key={order.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-2xl font-semibold">{asset?.title ?? order.assetTitle}</p>
                <p className="text-sm text-white/60">{asset?.category}</p>
              </div>
              <p className="text-right text-sm text-white/70">Current value<br /><span className="text-2xl text-white">₹{order.amountInr.toLocaleString("en-IN")}</span></p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" defaultValue={Math.min(order.units, 5)} />
              <button onClick={() => setMessage("Secondary listing published.")} className="rounded-xl bg-[#f7d8b0] px-3 py-2 text-sm font-semibold text-black">
                Create fixed-price listing
              </button>
            </div>
          </div>
        ))}
      </div>
      {message && <div className="fixed bottom-6 right-6 rounded-xl bg-white px-4 py-3 text-sm text-black">{message}</div>}
    </PrototypeShell>
  );
}
