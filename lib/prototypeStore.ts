"use server";

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

export interface AssetIssue {
  id: string;
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
}

export interface BuyOrder {
  id: string;
  assetId: string;
  assetTitle: string;
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

const initialState: PrototypeState = {
  treasuryInr: 175000,
  kycRequests: [
    {
      id: "kyc-1",
      investorName: "soham",
      email: "sohampirale2504@gmail.com",
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
    },
    {
      id: "asset-2",
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
    },
    {
      id: "asset-3",
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
    },
  ],
  orders: [],
};

declare global {
  var __prototypeState: PrototypeState | undefined;
}

const state = globalThis.__prototypeState ?? structuredClone(initialState);
globalThis.__prototypeState = state;

export function getState() {
  return state;
}

export function submitKyc(input: Omit<InvestorKyc, "id" | "status">) {
  const existing = state.kycRequests.find((item) => item.email === input.email);
  if (existing) {
    Object.assign(existing, input, { status: "PENDING" as const });
    return existing;
  }
  const kyc: InvestorKyc = {
    id: `kyc-${Date.now()}`,
    ...input,
    status: "PENDING",
  };
  state.kycRequests.unshift(kyc);
  return kyc;
}

export function updateKycStatus(id: string, status: Extract<KycStatus, "APPROVED" | "REJECTED">) {
  const target = state.kycRequests.find((item) => item.id === id);
  if (!target) {
    return null;
  }
  target.status = status;
  return target;
}

export function bindWallet(email: string, walletAddress: string) {
  const target = state.kycRequests.find((item) => item.email === email);
  if (!target) {
    return null;
  }
  target.walletAddress = walletAddress;
  return target;
}

export function submitAsset(input: {
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
}) {
  const asset: AssetIssue = {
    id: `asset-${Date.now()}`,
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
    documents: input.documents.map((name, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name,
      category: "Issuer submission · issuer",
      updatedAt: "Today",
    })),
  };
  state.assets.unshift(asset);
  return asset;
}

export function updateAssetStatus(id: string, status: Extract<AssetStatus, "APPROVED" | "REJECTED">) {
  const target = state.assets.find((item) => item.id === id);
  if (!target) {
    return null;
  }
  target.status = status;
  if (status === "APPROVED" && target.listedUnits === 0) {
    target.listedUnits = Math.max(10, Math.floor(target.units * 0.1));
  }
  return target;
}

export function createBuyOrder(assetId: string, units: number) {
  const target = state.assets.find((item) => item.id === assetId && item.status === "APPROVED");
  if (!target) {
    return null;
  }
  const amountInr = units * target.unitPrice;
  const amountSol = Number((amountInr / 8190).toFixed(2));
  const order: BuyOrder = {
    id: `ord-${Date.now()}`,
    assetId: target.id,
    assetTitle: target.title,
    units,
    amountInr,
    amountSol,
    method: "Phantom localnet SOL",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  state.orders.unshift(order);
  return order;
}

export function settleOrder(id: string) {
  const target = state.orders.find((item) => item.id === id);
  if (!target) {
    return null;
  }
  target.status = "PAID";
  state.treasuryInr += target.amountInr;
  return target;
}
