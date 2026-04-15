export interface KycRequest {
  id: string;
  investorName: string;
  email: string;
  pan: string;
  aadhaarLast4: string;
  occupation: string;
  incomeBand: string;
  walletAddress?: string;
  status: "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED";
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
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  actorEmail: string;
  note?: string;
  createdAt: string;
}

export interface Asset {
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
  status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  supportingNote?: string;
  location?: AssetLocation;
  reviewEvents?: ReviewEvent[];
}

export interface Order {
  id: string;
  assetId: string;
  assetTitle: string;
  investorEmail: string;
  units: number;
  amountInr: number;
  amountSol: number;
  method: string;
  status: "PENDING" | "PAID";
  createdAt: string;
}

export interface PrototypeState {
  treasuryInr: number;
  kycRequests: KycRequest[];
  assets: Asset[];
  orders: Order[];
}
