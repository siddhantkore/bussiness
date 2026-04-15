"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { PrototypeShell } from "@/components/prototype/PrototypeShell";
import type { KycRequest } from "@/components/prototype/types";
import type { SessionUser } from "@/lib/auth";
import { bindWallet, fetchBootstrap, fetchSession, submitKyc } from "@/lib/prototypeClient";

export default function KycPage() {
  const [requests, setRequests] = useState<KycRequest[]>([]);
  const [session, setSession] = useState<SessionUser | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const refresh = async () => {
    const data = await fetchBootstrap();
    setRequests(data.kycRequests);
  };

  useEffect(() => {
    void Promise.all([fetchSession(), fetchBootstrap()]).then(([user, state]) => {
      setSession(user);
      setRequests(state.kycRequests);
    });
  }, []);

  const me = useMemo(() => requests.find((item) => item.email === session?.email), [requests, session?.email]);

  const onKycSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      await submitKyc({
        investorName: form.get("investorName"),
        pan: form.get("pan"),
        aadhaarLast4: form.get("aadhaarLast4"),
        occupation: form.get("occupation"),
        incomeBand: form.get("incomeBand"),
      });
      setMessage("KYC submitted. Awaiting admin approval.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "KYC submission failed");
    } finally {
      setPending(false);
    }
  };

  const onWalletBind = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      await bindWallet(String(form.get("walletAddress")));
      setMessage("Wallet address bound successfully.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet binding failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <PrototypeShell
      heading="Compliance onboarding and wallet binding"
      subheading="KYC submission and wallet updates are separate from the order flow."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={onKycSubmit} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-2xl font-semibold">KYC status</p>
          <p className="mt-2 text-sm text-white/65">
            Current review state: <span className="text-[#f7d8b0]">{me?.status ?? "NOT_STARTED"}</span>
          </p>
          <div className="mt-3 grid gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-white/65">Investor name</span>
              <input name="investorName" defaultValue={me?.investorName ?? session?.name ?? ""} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/65">PAN</span>
              <input name="pan" defaultValue={me?.pan ?? ""} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/65">Aadhaar last 4 digits</span>
              <input name="aadhaarLast4" inputMode="numeric" maxLength={4} defaultValue={me?.aadhaarLast4 ?? ""} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/65">Occupation</span>
              <input name="occupation" defaultValue={me?.occupation ?? ""} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/65">Annual income band</span>
              <input name="incomeBand" defaultValue={me?.incomeBand ?? ""} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            </label>
          </div>
          <button disabled={pending} className="mt-3 rounded-xl bg-[#f7d8b0] px-3 py-2 text-sm font-semibold text-black disabled:opacity-60">Submit KYC</button>
        </form>

        <form onSubmit={onWalletBind} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-2xl font-semibold">Wallet binding</p>
          <p className="mt-2 text-sm text-white/65">
            Managed wallet: <span className="text-white">{me?.walletAddress ?? "Not bound yet"}</span>
          </p>
          <label className="mt-3 grid gap-1 text-sm">
            <span className="text-white/65">External Solana wallet address</span>
            <input
              name="walletAddress"
              className="w-full rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm"
              defaultValue={me?.walletAddress ?? ""}
              required
            />
          </label>
          <button disabled={pending} className="mt-3 rounded-xl border border-white/15 px-3 py-2 text-sm disabled:opacity-60">Bind manual address</button>
        </form>
      </div>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
    </PrototypeShell>
  );
}
