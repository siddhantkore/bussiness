"use client";

import { useEffect, useState } from "react";
import { PrototypeShell } from "@/components/prototype/PrototypeShell";
import type { PrototypeState } from "@/components/prototype/types";
import { fetchBootstrap, reviewAsset, reviewKyc } from "@/lib/prototypeClient";

export default function ReviewPage() {
  const [data, setData] = useState<PrototypeState | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState("");

  const refresh = async () => {
    const state = await fetchBootstrap();
    setData(state);
  };

  useEffect(() => {
    void fetchBootstrap().then((state) => setData(state));
  }, []);

  const kycPending = (data?.kycRequests ?? []).filter((item) => item.status === "PENDING");
  const assetsPending = (data?.assets ?? []).filter((item) => item.status === "PENDING_REVIEW");

  async function handleKycReview(id: string, status: "APPROVED" | "REJECTED") {
    setPendingId(id);
    setError("");
    try {
      await reviewKyc(id, status);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "KYC review failed");
    } finally {
      setPendingId("");
    }
  }

  async function handleAssetReview(id: string, status: "APPROVED" | "REJECTED") {
    setPendingId(id);
    setError("");
    try {
      await reviewAsset(id, status, notes[id] ?? "");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Asset review failed");
    } finally {
      setPendingId("");
    }
  }

  return (
    <PrototypeShell heading="Issuer submissions, compliance, and settlement queue" subheading="Admin console for pending KYC and asset review actions.">
      <div className="grid gap-3 md:grid-cols-4">
        <Stat title="Pending KYC" value={kycPending.length} />
        <Stat title="Asset review" value={assetsPending.length} />
        <Stat title="Settlement queue" value={(data?.orders ?? []).filter((o) => o.status === "PENDING").length} />
        <Stat title="Treasury" value={`₹${(data?.treasuryInr ?? 0).toLocaleString("en-IN")}`} />
      </div>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-2xl font-semibold">KYC queue</p>
          <div className="mt-3 space-y-3">
            {kycPending.length === 0 && <p className="text-sm text-white/60">No KYC reviews are pending.</p>}
            {kycPending.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="font-medium">{item.investorName}</p>
                <p className="text-sm text-white/60">{item.email}</p>
                <div className="mt-3 flex gap-2">
                  <button disabled={pendingId === item.id} onClick={() => handleKycReview(item.id, "APPROVED")} className="rounded-lg bg-[#f7d8b0] px-3 py-1.5 text-sm text-black disabled:opacity-60">Approve</button>
                  <button disabled={pendingId === item.id} onClick={() => handleKycReview(item.id, "REJECTED")} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm disabled:opacity-60">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-2xl font-semibold">Asset review</p>
          <div className="mt-3 space-y-3">
            {assetsPending.length === 0 && <p className="text-sm text-white/60">No assets awaiting review.</p>}
            {assetsPending.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-white/60">{item.category} · {item.city}, {item.state}</p>
                <p className="mt-2 text-sm text-white/65">{item.description}</p>
                {item.location?.latitude && item.location?.longitude && (
                  <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white/65">
                    <p className="text-white">Optional map location</p>
                    <p>{item.location.label || "Pinned by issuer"}</p>
                    <p>Lat {item.location.latitude}, Lng {item.location.longitude}</p>
                  </div>
                )}
                {item.documents.length > 0 && (
                  <div className="mt-3 text-sm text-white/65">
                    Documents: {item.documents.map((doc) => doc.name).join(", ")}
                  </div>
                )}
                <label className="mt-3 grid gap-1 text-sm">
                  <span className="text-white/65">Reviewer note</span>
                  <textarea
                    value={notes[item.id] ?? ""}
                    onChange={(event) => setNotes((current) => ({ ...current, [item.id]: event.target.value }))}
                    rows={2}
                    className="rounded-lg border border-white/10 bg-[#121418] px-3 py-2"
                  />
                </label>
                <div className="mt-3 flex gap-2">
                  <button disabled={pendingId === item.id} onClick={() => handleAssetReview(item.id, "APPROVED")} className="rounded-lg bg-[#f7d8b0] px-3 py-1.5 text-sm text-black disabled:opacity-60">Approve asset</button>
                  <button disabled={pendingId === item.id} onClick={() => handleAssetReview(item.id, "REJECTED")} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm disabled:opacity-60">Reject asset</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PrototypeShell>
  );
}

function Stat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-sm text-white/55">{title}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
