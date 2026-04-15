"use client";

import { FormEvent, MouseEvent, useState } from "react";
import { PrototypeShell } from "@/components/prototype/PrototypeShell";
import { submitAsset } from "@/lib/prototypeClient";

const mapBounds = {
  minLat: 8,
  maxLat: 36,
  minLng: 68,
  maxLng: 97,
};

export default function VerificationPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  function pickLocation(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const longitude = Number((mapBounds.minLng + x * (mapBounds.maxLng - mapBounds.minLng)).toFixed(5));
    const latitude = Number((mapBounds.maxLat - y * (mapBounds.maxLat - mapBounds.minLat)).toFixed(5));
    setLocation({ latitude, longitude });
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const documents = (form.get("documents") as string)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setPending(true);
    setError("");
    try {
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
        locationLabel: form.get("locationLabel"),
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
      event.currentTarget.reset();
      setLocation(null);
      setMessage("Verification request submitted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification request failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <PrototypeShell
      heading="Submit asset proof for issuer review"
      subheading="Upload ownership documents for your asset, then track the decision in the review workspace."
    >
      <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-white/65">Issuer</span>
            <input name="issuer" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-white/65">Asset name</span>
            <input name="title" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-white/65">Asset category</span>
            <input name="category" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-white/65">City</span>
              <input name="city" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/65">State</span>
              <input name="state" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
            </label>
          </div>
          <label className="grid gap-1 text-sm">
            <span className="text-white/65">Description</span>
            <textarea name="description" rows={3} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" required />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-white/65">Supporting note</span>
            <textarea name="supportingNote" rows={2} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-white/65">Minimum ticket</span>
              <input name="minimumTicket" type="number" min={1} defaultValue={250000} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/65">Unit price</span>
              <input name="unitPrice" type="number" min={1} defaultValue={25000} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/65">Units</span>
              <input name="units" type="number" min={1} defaultValue={1000} className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
            </label>
          </div>
          <label className="grid gap-1 text-sm">
            <span className="text-white/65">Document names</span>
            <input name="documents" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" aria-describedby="documents-help" />
            <span id="documents-help" className="text-xs text-white/45">Comma-separated names until file storage is connected.</span>
          </label>
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-sm font-semibold">Optional map location</p>
            <p className="mt-1 text-xs text-white/55">Click the map area to attach approximate coordinates for reviewer context.</p>
            <button
              type="button"
              onClick={pickLocation}
              className="relative mt-3 h-44 w-full overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,#17351f,#153548_45%,#43391a)]"
              aria-label="Pick optional property location on map"
            >
              <span className="absolute left-4 top-4 text-xs text-white/60">India map picker</span>
              {location && (
                <span
                  className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#f7d8b0]"
                  style={{
                    left: `${((location.longitude - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100}%`,
                    top: `${((mapBounds.maxLat - location.latitude) / (mapBounds.maxLat - mapBounds.minLat)) * 100}%`,
                  }}
                />
              )}
            </button>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <label className="grid gap-1 text-sm">
                <span className="text-white/65">Location label</span>
                <input name="locationLabel" className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm" />
              </label>
              <p className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm text-white/70">
                Lat: {location?.latitude ?? "not selected"}
              </p>
              <p className="rounded-xl border border-white/10 bg-[#121418] px-3 py-2 text-sm text-white/70">
                Lng: {location?.longitude ?? "not selected"}
              </p>
            </div>
          </div>
        </div>
        <button type="submit" disabled={pending} className="mt-4 w-full rounded-xl bg-[#f7d8b0] px-3 py-2 text-sm font-semibold text-black disabled:opacity-60">
          {pending ? "Submitting..." : "Submit verification request"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
    </PrototypeShell>
  );
}
