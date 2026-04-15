"use client";

import { useEffect, useState } from "react";
import { PrototypeShell } from "@/components/prototype/PrototypeShell";
import type { Order, PrototypeState } from "@/components/prototype/types";
import { fetchBootstrap, settleOrder } from "@/lib/prototypeClient";

export default function PaymentsPage() {
  const [data, setData] = useState<PrototypeState | null>(null);

  const refresh = async () => {
    const state = await fetchBootstrap();
    setData(state);
  };

  useEffect(() => {
    void fetchBootstrap().then((state) => setData(state));
  }, []);

  const pending = (data?.orders ?? []).filter((item) => item.status === "PENDING");

  const handleSettle = async (order: Order) => {
    await settleOrder(order.id);
    await refresh();
  };

  return (
    <PrototypeShell
      heading="Settle pending payments"
      subheading="INR stays as the source price, and this local demo stack records Phantom-style localnet payments."
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <p className="text-sm text-white/45">Available localnet INR balance</p>
        <p className="mt-2 text-4xl font-semibold">₹{(data?.treasuryInr ?? 0).toLocaleString("en-IN")}</p>
      </div>

      <div className="mt-4 space-y-3">
        {pending.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/70">
            No pending orders. Create one from marketplace.
          </div>
        )}
        {pending.map((order) => (
          <div key={order.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-lg font-semibold">{order.assetTitle}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
              <p>Units: <span className="text-white/70">{order.units}</span></p>
              <p>Amount: <span className="text-white/70">₹{order.amountInr.toLocaleString("en-IN")}</span></p>
              <p>SOL: <span className="text-white/70">{order.amountSol}</span></p>
              <p>Status: <span className="text-amber-300">Pending</span></p>
            </div>
            <button
              onClick={() => handleSettle(order)}
              className="mt-3 rounded-xl bg-[#f7d8b0] px-3 py-2 text-sm font-semibold text-black"
            >
              Record localnet payment
            </button>
          </div>
        ))}
      </div>
    </PrototypeShell>
  );
}
