"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { PrototypeShell } from "@/components/prototype/PrototypeShell";
import type { KycRequest } from "@/components/prototype/types";
import { bindWallet, fetchBootstrap, submitKyc } from "@/lib/prototypeClient";

const investorEmail = "sohampirale2504@gmail.com";

export default function KycPage() {
  const [requests, setRequests] = useState<KycRequest[]>([]);
  const [message, setMessage] = useState("");

  const refresh = async () => {
    const data = await fetchBootstrap();
    setRequests(data.kycRequests);
  };

  useEffect(() => {
    void fetchBootstrap().then((state) => setRequests(state.kycRequests));
  }, []);

  const me = useMemo(() => requests.find((item) => item.email === investorEmail), [requests]);

  const onKycSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await submitKyc({
      investorName: form.get("investorName"),
      email: investorEmail,
      pan: form.get("pan"),
      aadhaarLast4: form.get("aadhaarLast4"),
      occupation: form.get("occupation"),
      incomeBand: form.get("incomeBand"),
    });
    setMessage("KYC submitted. Awaiting admin approval.");
    await refresh();
  };

  const onWalletBind = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await bindWallet(investorEmail, String(form.get("walletAddress")));
    setMessage("Wallet address bound successfully.");
    await refresh();
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
          <div className="mt-3 grid gap-2">
            <input name="investorName" placeholder="Investor name" defaultValue={me?.investorName ?? "soham"} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            <input name="pan" placeholder="PAN" defaultValue={me?.pan ?? ""} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            <input name="aadhaarLast4" placeholder="Aadhaar last 4 digits" defaultValue={me?.aadhaarLast4 ?? ""} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            <input name="occupation" placeholder="Occupation" defaultValue={me?.occupation ?? ""} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            <input name="incomeBand" placeholder="Annual income band" defaultValue={me?.incomeBand ?? ""} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
          </div>
          <button className="mt-3 rounded-xl bg-[#f7d8b0] px-3 py-2 text-sm font-semibold text-black">Submit KYC</button>
        </form>

        <form onSubmit={onWalletBind} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-2xl font-semibold">Wallet binding</p>
          <p className="mt-2 text-sm text-white/65">
            Managed wallet: <span className="text-white">{me?.walletAddress ?? "Not bound yet"}</span>
          </p>
          <input
            name="walletAddress"
            placeholder="External Solana wallet address"
            className="mt-3 w-full rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm"
            defaultValue={me?.walletAddress ?? ""}
            required
          />
          <button className="mt-3 rounded-xl border border-white/15 px-3 py-2 text-sm">Bind manual address</button>
        </form>
      </div>
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
    </PrototypeShell>
  );
}
