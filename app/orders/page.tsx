"use client";

import { useEffect, useState } from "react";
import { PrototypeShell } from "@/components/prototype/PrototypeShell";
import type { Order } from "@/components/prototype/types";
import { fetchBootstrap } from "@/lib/prototypeClient";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchBootstrap().then((data) => setOrders(data.orders));
  }, []);

  return (
    <PrototypeShell heading="Orders" subheading="Track primary orders before settlement in the payments route.">
      <div className="space-y-3">
        {orders.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/70">
            No orders yet. Place a primary order from the marketplace.
          </div>
        )}
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-lg font-semibold">{order.assetTitle}</p>
            <p className="text-sm text-white/60">Order ID: {order.id}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
              <p>Units: <span className="text-white/70">{order.units}</span></p>
              <p>INR: <span className="text-white/70">₹{order.amountInr.toLocaleString("en-IN")}</span></p>
              <p>SOL: <span className="text-white/70">{order.amountSol}</span></p>
              <p>Status: <span className={order.status === "PAID" ? "text-emerald-300" : "text-amber-300"}>{order.status}</span></p>
            </div>
          </div>
        ))}
      </div>
    </PrototypeShell>
  );
}
