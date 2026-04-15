"use server";

import fs from "node:fs";
import path from "node:path";
import type { SessionUser } from "@/lib/auth";

export type KycStatus = "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED";
export type AssetStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
export type OrderStatus = "PENDING" | "PAID";

export interface InvestorKyc {
  id: string;
  investorName: string;
  email: string;
  pan: string;
  aadhaarLast4: string;
  occupation: string;
  incomeBand: string;
  walletAddress?: string;
  status: KycStatus;
}

export interface AssetDoc {
  id: string;
  name: string;
  category: string;
  updatedAt: string;
}

export interface AssetLocation {
  label?: string;
  latitude?: number;
  longitude?: number;
}

export interface ReviewEvent {
  id: string;
  status: Extract<AssetStatus, "PENDING_REVIEW" | "APPROVED" | "REJECTED">;
  actorEmail: string;
  note?: string;
  createdAt: string;
}

export interface AssetIssue {
  id: string;
  issuerEmail?: string;
  issuer: string;
  title: string;
  category: string;
  city: string;
  state: string;
  description: string;
  minimumTicket: number;
  unitPrice: number;
  targetIrr: number;
  units: number;
  listedUnits: number;
  documents: AssetDoc[];
  status: AssetStatus;
  supportingNote?: string;
  location?: AssetLocation;
  reviewEvents?: ReviewEvent[];
}

export interface BuyOrder {
  id: string;
  assetId: string;
  assetTitle: string;
  investorEmail: string;
  units: number;
  amountInr: number;
  amountSol: number;
  method: string;
  status: OrderStatus;
  createdAt: string;
}

interface PrototypeState {
  treasuryInr: number;
  kycRequests: InvestorKyc[];
  assets: AssetIssue[];
  orders: BuyOrder[];
}

const dbPath = path.join(process.cwd(), "data", "prototype-db.json");

const initialState: PrototypeState = {
  treasuryInr: 175000,
  kycRequests: [
    {
      id: "kyc-1",
      investorName: "Investor User",
      email: "investor@land.local",
      pan: "",
      aadhaarLast4: "",
      occupation: "",
      incomeBand: "",
      status: "PENDING",
    },
  ],
  assets: [
    {
      id: "asset-1",
      issuerEmail: "issuer@land.local",
      issuer: "Meera Capital Partners · Mumbai",
      title: "Whitefield Income Commons",
      category: "Real estate · Leased commercial building",
      city: "Bengaluru",
      state: "Karnataka",
      description:
        "A stabilized office-led real-estate issue backed by a leased commercial building with quarterly distributions and a five-year target hold.",
      minimumTicket: 250000,
      unitPrice: 25000,
      targetIrr: 14.6,
      units: 1600,
      listedUnits: 13,
      status: "APPROVED",
      documents: [
        {
          id: "doc-1",
          name: "Project Teaser",
          category: "Marketing · issuer",
          updatedAt: "14 Mar 2026",
        },
        {
          id: "doc-2",
          name: "Land Due Diligence",
          category: "Legal · legal",
          updatedAt: "14 Mar 2026",
        },
      ],
      location: {
        label: "Whitefield, Bengaluru",
        latitude: 12.9698,
        longitude: 77.75,
      },
      reviewEvents: [
        {
          id: "rev-1",
          status: "APPROVED",
          actorEmail: "reviewer@land.local",
          note: "Seed asset approved for demo marketplace.",
          createdAt: "2026-04-01T10:00:00.000Z",
        },
      ],
    },
    {
      id: "asset-2",
      issuerEmail: "issuer@land.local",
      issuer: "Monsoon Tech Ventures · Mumbai",
      title: "Monsoon Logistics Growth Shares",
      category: "Company shares · Growth round",
      city: "Mumbai",
      state: "Maharashtra",
      description:
        "A fixed-price company-share issuance for a logistics software operator expanding warehouse automation across India.",
      minimumTicket: 250000,
      unitPrice: 25000,
      targetIrr: 14.8,
      units: 1000,
      listedUnits: 40,
      status: "APPROVED",
      documents: [],
      reviewEvents: [
        {
          id: "rev-2",
          status: "APPROVED",
          actorEmail: "reviewer@land.local",
          note: "Seed asset approved for demo marketplace.",
          createdAt: "2026-04-01T10:00:00.000Z",
        },
      ],
    },
    {
      id: "asset-3",
      issuerEmail: "issuer@land.local",
      issuer: "Pune Land Parcel SPV",
      title: "Pune Logistics Land Parcel",
      category: "Real estate · Industrial land parcel",
      city: "Pune",
      state: "Maharashtra",
      description:
        "A serviced logistics land issue prepared for build-to-suit warehousing, currently waiting for compliance review before going live.",
      minimumTicket: 300000,
      unitPrice: 25000,
      targetIrr: 14.2,
      units: 1600,
      listedUnits: 0,
      status: "PENDING_REVIEW",
      documents: [
        {
          id: "doc-3",
          name: "Project Teaser",
          category: "Marketing · issuer",
          updatedAt: "14 Mar 2026",
        },
        {
          id: "doc-4",
          name: "Land Due Diligence",
          category: "Legal · legal",
          updatedAt: "14 Mar 2026",
        },
      ],
      location: {
        label: "Pune logistics belt",
        latitude: 18.6298,
        longitude: 73.7997,
      },
      reviewEvents: [
        {
          id: "rev-3",
          status: "PENDING_REVIEW",
          actorEmail: "issuer@land.local",
          note: "Submitted with land due diligence documents.",
          createdAt: "2026-04-02T10:00:00.000Z",
        },
      ],
    },
  ],
  orders: [],
};

declare global {
  var __prototypeState: PrototypeState | undefined;
}

function ensureStateShape(state: PrototypeState): PrototypeState {
  return {
    treasuryInr: Number(state.treasuryInr) || initialState.treasuryInr,
    kycRequests: Array.isArray(state.kycRequests) ? state.kycRequests : [],
    assets: Array.isArray(state.assets)
      ? state.assets.map((asset) => ({
          ...asset,
          listedUnits: Number(asset.listedUnits) || 0,
          reviewEvents: asset.reviewEvents ?? [],
        }))
      : [],
    orders: Array.isArray(state.orders)
      ? state.orders.map((order) => ({
          ...order,
          investorEmail: order.investorEmail ?? "investor@land.local",
        }))
      : [],
  };
}

function loadState(): PrototypeState {
  try {
    if (!fs.existsSync(dbPath)) return structuredClone(initialState);
    const parsed = JSON.parse(fs.readFileSync(dbPath, "utf8")) as PrototypeState;
    return ensureStateShape(parsed);
  } catch {
    return structuredClone(initialState);
  }
}

function persistState() {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(state, null, 2));
}

const state = globalThis.__prototypeState ?? loadState();
globalThis.__prototypeState = state;

export function getState() {
  return state;
}

export function getStateForUser(user: SessionUser) {
  if (user.role === "admin" || user.role === "reviewer") {
    return state;
  }

  return {
    treasuryInr: 0,
    kycRequests: state.kycRequests.filter((item) => item.email === user.email),
    assets:
      user.role === "issuer"
        ? state.assets.filter((asset) => asset.issuerEmail === user.email || asset.status === "APPROVED")
        : state.assets.filter((asset) => asset.status === "APPROVED"),
    orders: state.orders.filter((order) => order.investorEmail === user.email),
  };
}

export function submitKyc(input: Omit<InvestorKyc, "id" | "status">) {
  const existing = state.kycRequests.find((item) => item.email === input.email);
  if (existing) {
    Object.assign(existing, input, { status: "PENDING" as const });
    persistState();
    return existing;
  }
  const kyc: InvestorKyc = {
    id: `kyc-${Date.now()}`,
    ...input,
    status: "PENDING",
  };
  state.kycRequests.unshift(kyc);
  persistState();
  return kyc;
}

export function updateKycStatus(id: string, status: Extract<KycStatus, "APPROVED" | "REJECTED">) {
  const target = state.kycRequests.find((item) => item.id === id);
  if (!target) {
    return null;
  }
  target.status = status;
  persistState();
  return target;
}

export function bindWallet(email: string, walletAddress: string) {
  const target = state.kycRequests.find((item) => item.email === email);
  if (!target) {
    return null;
  }
  target.walletAddress = walletAddress;
  persistState();
  return target;
}

export function submitAsset(input: {
  issuerEmail?: string;
  issuer: string;
  title: string;
  category: string;
  description: string;
  city: string;
  state: string;
  minimumTicket: number;
  unitPrice: number;
  units: number;
  supportingNote?: string;
  documents: string[];
  location?: AssetLocation;
}) {
  const asset: AssetIssue = {
    id: `asset-${Date.now()}`,
    issuerEmail: input.issuerEmail,
    issuer: input.issuer,
    title: input.title,
    category: input.category,
    city: input.city,
    state: input.state,
    description: input.description,
    minimumTicket: input.minimumTicket,
    unitPrice: input.unitPrice,
    targetIrr: 14,
    units: input.units,
    listedUnits: 0,
    status: "PENDING_REVIEW",
    supportingNote: input.supportingNote,
    location: input.location,
    reviewEvents: [
      {
        id: `rev-${Date.now()}`,
        status: "PENDING_REVIEW",
        actorEmail: input.issuerEmail ?? "unknown",
        note: input.supportingNote,
        createdAt: new Date().toISOString(),
      },
    ],
    documents: input.documents.map((name, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name,
      category: "Issuer submission · issuer",
      updatedAt: "Today",
    })),
  };
  state.assets.unshift(asset);
  persistState();
  return asset;
}

export function updateAssetStatus(
  id: string,
  status: Extract<AssetStatus, "APPROVED" | "REJECTED">,
  actorEmail: string,
  note?: string
) {
  const target = state.assets.find((item) => item.id === id);
  if (!target) {
    return null;
  }
  target.status = status;
  if (status === "APPROVED" && target.listedUnits === 0) {
    target.listedUnits = Math.max(10, Math.floor(target.units * 0.1));
  }
  target.reviewEvents = [
    ...(target.reviewEvents ?? []),
    {
      id: `rev-${Date.now()}`,
      status,
      actorEmail,
      note,
      createdAt: new Date().toISOString(),
    },
  ];
  persistState();
  return target;
}

export function createBuyOrder(assetId: string, units: number, investorEmail: string) {
  const target = state.assets.find((item) => item.id === assetId && item.status === "APPROVED");
  if (!target) {
    return { error: "Approved asset not found" as const };
  }
  if (!Number.isInteger(units) || units <= 0) {
    return { error: "Units must be a positive whole number" as const };
  }
  const amountInr = units * target.unitPrice;
  if (amountInr < target.minimumTicket) {
    return { error: "Order does not meet the minimum ticket size" as const };
  }
  if (units > target.listedUnits) {
    return { error: "Requested units exceed available listed units" as const };
  }
  const amountSol = Number((amountInr / 8190).toFixed(2));
  const order: BuyOrder = {
    id: `ord-${Date.now()}`,
    assetId: target.id,
    assetTitle: target.title,
    investorEmail,
    units,
    amountInr,
    amountSol,
    method: "Phantom localnet SOL",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  target.listedUnits -= units;
  state.orders.unshift(order);
  persistState();
  return order;
}

export function settleOrder(id: string) {
  const target = state.orders.find((item) => item.id === id);
  if (!target) {
    return null;
  }
  if (target.status === "PAID") {
    return target;
  }
  target.status = "PAID";
  state.treasuryInr += target.amountInr;
  persistState();
  return target;
}
