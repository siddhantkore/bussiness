import type { Asset, KycRequest, Order, PrototypeState } from "@/components/prototype/types";

export async function fetchBootstrap(): Promise<PrototypeState> {
  const res = await fetch("/api/prototype/bootstrap", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load prototype data");
  return res.json();
}

export async function submitAsset(payload: Record<string, unknown>): Promise<Asset> {
  const res = await fetch("/api/prototype/assets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to submit asset");
  return res.json();
}

export async function reviewAsset(id: string, status: "APPROVED" | "REJECTED"): Promise<Asset> {
  const res = await fetch(`/api/prototype/assets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update asset");
  return res.json();
}

export async function submitKyc(payload: Record<string, unknown>): Promise<KycRequest> {
  const res = await fetch("/api/prototype/kyc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to submit KYC");
  return res.json();
}

export async function reviewKyc(id: string, status: "APPROVED" | "REJECTED"): Promise<KycRequest> {
  const res = await fetch(`/api/prototype/kyc/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update KYC");
  return res.json();
}

export async function bindWallet(email: string, walletAddress: string): Promise<KycRequest> {
  const res = await fetch("/api/prototype/wallet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, walletAddress }),
  });
  if (!res.ok) throw new Error("Failed to bind wallet");
  return res.json();
}

export async function createOrder(assetId: string, units: number): Promise<Order> {
  const res = await fetch("/api/prototype/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assetId, units }),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function settleOrder(id: string): Promise<Order> {
  const res = await fetch(`/api/prototype/orders/${id}/settle`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to settle order");
  return res.json();
}
