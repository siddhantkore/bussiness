"use client";

import { FormEvent, useState } from "react";
import { PrototypeShell } from "@/components/prototype/PrototypeShell";
import { submitAsset } from "@/lib/prototypeClient";

export default function VerificationPage() {
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const documents = (form.get("documents") as string)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    await submitAsset({
      issuer: form.get("issuer"),
      title: form.get("title"),
      category: form.get("category"),
      city: form.get("city"),
      state: form.get("state"),
      description: form.get("description"),
      supportingNote: form.get("supportingNote"),
      minimumTicket: form.get("minimumTicket"),
      unitPrice: form.get("unitPrice"),
      units: form.get("units"),
      documents,
    });
    event.currentTarget.reset();
    setMessage("Verification request submitted successfully.");
  };

  return (
    <PrototypeShell
      heading="Submit asset proof for issuer review"
      subheading="Upload ownership documents for your asset, then track the decision in the review workspace."
    >
      <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="grid gap-3">
          <input name="issuer" placeholder="Issuer" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
          <input name="title" placeholder="Asset name" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
          <input name="category" placeholder="Asset category" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
          <div className="grid grid-cols-2 gap-3">
            <input name="city" placeholder="City" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
            <input name="state" placeholder="State" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
          </div>
          <textarea name="description" rows={3} placeholder="Description" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
          <textarea name="supportingNote" rows={2} placeholder="Supporting note" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
          <div className="grid grid-cols-3 gap-3">
            <input name="minimumTicket" type="number" defaultValue={250000} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            <input name="unitPrice" type="number" defaultValue={25000} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            <input name="units" type="number" defaultValue={1000} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
          </div>
          <input name="documents" placeholder="Document names comma separated" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="mt-4 w-full rounded-xl bg-[#f7d8b0] px-3 py-2 text-sm font-semibold text-black">
          Submit verification request
        </button>
      </form>
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
    </PrototypeShell>
  );
}
