"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PrototypeShell } from "@/components/prototype/PrototypeShell";
import type { Asset } from "@/components/prototype/types";
import { createOrder, fetchBootstrap } from "@/lib/prototypeClient";

export default function AssetRoomPage() {
  const params = useParams<{ id: string }>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [units, setUnits] = useState(10);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetchBootstrap().then((data) => setAssets(data.assets));
  }, []);

  const asset = useMemo(() => assets.find((item) => item.id === params.id), [assets, params.id]);

  const estimated = (asset?.unitPrice ?? 0) * units;

  const handleOrder = async () => {
    if (!asset) return;
    setPending(true);
    setError("");
    try {
      const created = await createOrder(asset.id, units);
      setToast(`Primary order ${created.id} created for ${units} units.`);
      const data = await fetchBootstrap();
      setAssets(data.assets);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order creation failed");
    } finally {
      setPending(false);
    }
  };

  if (!asset) {
    return (
      <PrototypeShell heading="Asset room" subheading="Loading asset details...">
        <p className="text-sm text-white/65">Fetching approved issue details.</p>
      </PrototypeShell>
    );
  }

  return (
    <PrototypeShell heading={asset.title} subheading={asset.category}>
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm text-white/65">{asset.city}, {asset.state}</p>
            <p className="mt-2 text-sm text-white/80">{asset.description}</p>
            {asset.location?.latitude && asset.location?.longitude && (
              <p className="mt-2 text-sm text-white/60">
                Location: {asset.location.label || "Pinned"} · {asset.location.latitude}, {asset.location.longitude}
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div><p className="text-xs text-white/45">Minimum ticket</p><p className="font-semibold">₹{asset.minimumTicket.toLocaleString("en-IN")}</p></div>
              <div><p className="text-xs text-white/45">Unit price</p><p className="font-semibold">₹{asset.unitPrice.toLocaleString("en-IN")}</p></div>
              <div><p className="text-xs text-white/45">Target IRR</p><p className="font-semibold">{asset.targetIrr}%</p></div>
              <div><p className="text-xs text-white/45">Active listings</p><p className="font-semibold">{asset.listedUnits}</p></div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-xl font-semibold">Documents</p>
            <div className="mt-3 space-y-2">
              {asset.documents.map((doc) => (
                <div key={doc.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-white/60">{doc.category} · Updated {doc.updatedAt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-3xl font-semibold">Trade</p>
            <label className="mt-3 grid gap-1 text-sm">
              <span className="text-white/65">Units</span>
            <input
              type="number"
              min={1}
              max={asset.listedUnits}
              className="w-full rounded-xl border border-white/10 bg-[#121418] px-3 py-2"
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
            />
            </label>
            <p className="mt-2 text-sm text-white/65">Estimated payment ₹{estimated.toLocaleString("en-IN")}</p>
            {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
            <button
              onClick={handleOrder}
              disabled={pending}
              className="mt-3 w-full rounded-xl bg-[#f7d8b0] px-3 py-2 text-sm font-semibold text-black disabled:opacity-60"
            >
              {pending ? "Creating..." : "Create primary order"}
            </button>
            <Link href="/payments" className="mt-3 inline-block text-sm text-[#f7d8b0]">
              Go to payments →
            </Link>
          </div>
        </aside>
      </div>
      {toast && <div className="fixed bottom-6 right-6 rounded-xl bg-white px-4 py-3 text-sm text-black">{toast}</div>}
    </PrototypeShell>
  );
}
