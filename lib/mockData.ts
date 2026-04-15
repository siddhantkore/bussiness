// lib/mockData.ts
// Central mock data store for Land Ownership Information System

export interface Property {
  id: string;
  surveyNumber: string;
  plotNumber: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  area: number;
  areaUnit: "Acres" | "Cents" | "Sq.Ft" | "Sq.M";
  landType: "Agricultural" | "Residential" | "Commercial" | "Industrial";
  status: "Clear" | "Under Loan" | "Disputed" | "Mortgaged";
  marketValue: number;
  registeredValue: number;
  lastUpdated: string;
  ownerName: string;
  pattaNumber: string;
}

export interface OwnershipRecord {
  id: string;
  propertyId: string;
  ownerName: string;
  fatherName: string;
  address: string;
  dateExecuted: string;
  documentType: "Sale Deed" | "Gift Deed" | "Inheritance" | "Settlement" | "Exchange";
  documentNumber: string;
  transactionValue: number;
  remarks: string;
}

export interface Encumbrance {
  id: string;
  propertyId: string;
  lenderName: string;
  loanType: "Home Loan" | "Agricultural Loan" | "Mortgage" | "Commercial Loan";
  principal: number;
  interestRate: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Closed" | "Defaulted";
  emiAmount: number;
  outstandingAmount: number;
  bankBranch: string;
  loanAccountNumber: string;
}

export interface IncomeRecord {
  id: string;
  propertyId: string;
  incomeType: "Rental" | "Agricultural Yield" | "Lease" | "Commercial";
  amount: number;
  period: string;
  tenant: string;
  agreementDate: string;
  agreementEndDate: string;
  paymentStatus: "Paid" | "Pending" | "Overdue";
  remarks: string;
}

export interface Document {
  id: string;
  propertyId: string;
  documentName: string;
  documentType: "Sale Deed" | "Patta" | "EC" | "Tax Receipt" | "Survey Map" | "NOC" | "Loan Agreement";
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  fileFormat: "PDF" | "JPG" | "PNG" | "DOCX";
  status: "Verified" | "Pending" | "Rejected";
}

// ─── Mock Properties ──────────────────────────────────────────────────────────
export const properties: Property[] = [
  {
    id: "PROP001",
    surveyNumber: "123/4A",
    plotNumber: "Plot-45",
    village: "Korattur",
    taluk: "Ambattur",
    district: "Chennai",
    state: "Tamil Nadu",
    area: 2.5,
    areaUnit: "Acres",
    landType: "Agricultural",
    status: "Clear",
    marketValue: 4500000,
    registeredValue: 3800000,
    lastUpdated: "2024-01-15",
    ownerName: "Ramesh Kumar",
    pattaNumber: "PTT-2024-001",
  },
  {
    id: "PROP002",
    surveyNumber: "456/2B",
    plotNumber: "Plot-78",
    village: "Pallavaram",
    taluk: "Tambaram",
    district: "Kanchipuram",
    state: "Tamil Nadu",
    area: 1200,
    areaUnit: "Sq.Ft",
    landType: "Residential",
    status: "Under Loan",
    marketValue: 7500000,
    registeredValue: 6200000,
    lastUpdated: "2024-02-20",
    ownerName: "Priya Suresh",
    pattaNumber: "PTT-2024-002",
  },
  {
    id: "PROP003",
    surveyNumber: "789/1C",
    plotNumber: "Plot-12",
    village: "Guindy",
    taluk: "Guindy",
    district: "Chennai",
    state: "Tamil Nadu",
    area: 3500,
    areaUnit: "Sq.Ft",
    landType: "Commercial",
    status: "Disputed",
    marketValue: 15000000,
    registeredValue: 12000000,
    lastUpdated: "2024-03-10",
    ownerName: "Vikram Industries Pvt Ltd",
    pattaNumber: "PTT-2024-003",
  },
  {
    id: "PROP004",
    surveyNumber: "321/5D",
    plotNumber: "Plot-99",
    village: "Sriperumbudur",
    taluk: "Sriperumbudur",
    district: "Kanchipuram",
    state: "Tamil Nadu",
    area: 5.0,
    areaUnit: "Acres",
    landType: "Industrial",
    status: "Mortgaged",
    marketValue: 25000000,
    registeredValue: 20000000,
    lastUpdated: "2024-03-25",
    ownerName: "Sri Ram Enterprises",
    pattaNumber: "PTT-2024-004",
  },
  {
    id: "PROP005",
    surveyNumber: "654/3E",
    plotNumber: "Plot-34",
    village: "Medavakkam",
    taluk: "Sholinganallur",
    district: "Chennai",
    state: "Tamil Nadu",
    area: 800,
    areaUnit: "Sq.Ft",
    landType: "Residential",
    status: "Clear",
    marketValue: 5500000,
    registeredValue: 4800000,
    lastUpdated: "2024-04-01",
    ownerName: "Anitha Rajan",
    pattaNumber: "PTT-2024-005",
  },
];

// ─── Mock Ownership History ───────────────────────────────────────────────────
export const ownershipHistory: OwnershipRecord[] = [
  {
    id: "OWN001",
    propertyId: "PROP001",
    ownerName: "Ramesh Kumar",
    fatherName: "S. Krishnamurthy",
    address: "No. 12, Gandhi Street, Korattur, Chennai - 600080",
    dateExecuted: "2015-06-15",
    documentType: "Sale Deed",
    documentNumber: "DOC-2015-4521",
    transactionValue: 2500000,
    remarks: "Clear title, no encumbrances",
  },
  {
    id: "OWN002",
    propertyId: "PROP001",
    ownerName: "T. Krishnamurthy",
    fatherName: "P. Thirumalai",
    address: "No. 45, Nehru Nagar, Ambattur, Chennai - 600053",
    dateExecuted: "2003-11-22",
    documentType: "Inheritance",
    documentNumber: "DOC-2003-1103",
    transactionValue: 0,
    remarks: "Inherited from father P. Thirumalai",
  },
  {
    id: "OWN003",
    propertyId: "PROP001",
    ownerName: "P. Thirumalai",
    fatherName: "A. Palaniswamy",
    address: "No. 7, Rajaji Street, Korattur, Chennai - 600080",
    dateExecuted: "1985-03-10",
    documentType: "Sale Deed",
    documentNumber: "DOC-1985-0321",
    transactionValue: 150000,
    remarks: "Original purchase from government auction",
  },
  {
    id: "OWN004",
    propertyId: "PROP002",
    ownerName: "Priya Suresh",
    fatherName: "R. Suresh",
    address: "No. 23, Anna Nagar, Pallavaram, Chennai - 600043",
    dateExecuted: "2019-08-30",
    documentType: "Sale Deed",
    documentNumber: "DOC-2019-7823",
    transactionValue: 5500000,
    remarks: "Purchased with bank loan",
  },
  {
    id: "OWN005",
    propertyId: "PROP002",
    ownerName: "K. Annamalai",
    fatherName: "K. Venkatesh",
    address: "No. 56, MGR Street, Tambaram, Chennai - 600045",
    dateExecuted: "2010-02-14",
    documentType: "Sale Deed",
    documentNumber: "DOC-2010-2234",
    transactionValue: 2800000,
    remarks: "Sold to clear debts",
  },
  {
    id: "OWN006",
    propertyId: "PROP003",
    ownerName: "Vikram Industries Pvt Ltd",
    fatherName: "N/A",
    address: "Old No. 14, New No. 28, Industrial Estate, Guindy, Chennai - 600032",
    dateExecuted: "2018-12-01",
    documentType: "Sale Deed",
    documentNumber: "DOC-2018-9901",
    transactionValue: 11000000,
    remarks: "Under court dispute - ownership contested",
  },
];

// ─── Mock Encumbrances ────────────────────────────────────────────────────────
export const encumbrances: Encumbrance[] = [
  {
    id: "ENC001",
    propertyId: "PROP002",
    lenderName: "State Bank of India",
    loanType: "Home Loan",
    principal: 4500000,
    interestRate: 8.5,
    startDate: "2019-09-01",
    endDate: "2034-09-01",
    status: "Active",
    emiAmount: 44500,
    outstandingAmount: 3200000,
    bankBranch: "Tambaram Branch",
    loanAccountNumber: "SBI-HL-2019-00234",
  },
  {
    id: "ENC002",
    propertyId: "PROP004",
    lenderName: "Indian Bank",
    loanType: "Commercial Loan",
    principal: 15000000,
    interestRate: 11.0,
    startDate: "2022-04-01",
    endDate: "2027-04-01",
    status: "Active",
    emiAmount: 325000,
    outstandingAmount: 9500000,
    bankBranch: "Sriperumbudur Branch",
    loanAccountNumber: "IB-CL-2022-00567",
  },
  {
    id: "ENC003",
    propertyId: "PROP001",
    lenderName: "Canara Bank",
    loanType: "Agricultural Loan",
    principal: 500000,
    interestRate: 7.0,
    startDate: "2018-01-15",
    endDate: "2021-01-15",
    status: "Closed",
    emiAmount: 9900,
    outstandingAmount: 0,
    bankBranch: "Korattur Branch",
    loanAccountNumber: "CB-AL-2018-00098",
  },
  {
    id: "ENC004",
    propertyId: "PROP004",
    lenderName: "HDFC Bank",
    loanType: "Mortgage",
    principal: 8000000,
    interestRate: 9.75,
    startDate: "2020-06-10",
    endDate: "2025-06-10",
    status: "Defaulted",
    emiAmount: 168000,
    outstandingAmount: 5800000,
    bankBranch: "Kanchipuram Branch",
    loanAccountNumber: "HDFC-M-2020-01234",
  },
];

// ─── Mock Income Records ──────────────────────────────────────────────────────
export const incomeRecords: IncomeRecord[] = [
  {
    id: "INC001",
    propertyId: "PROP001",
    incomeType: "Agricultural Yield",
    amount: 120000,
    period: "2024 Kharif Season",
    tenant: "M. Selvam",
    agreementDate: "2024-06-01",
    agreementEndDate: "2024-11-30",
    paymentStatus: "Paid",
    remarks: "Paddy cultivation, yield sold to FCI",
  },
  {
    id: "INC002",
    propertyId: "PROP002",
    incomeType: "Rental",
    amount: 25000,
    period: "Monthly",
    tenant: "Jayakumar Ramesh",
    agreementDate: "2023-01-01",
    agreementEndDate: "2025-12-31",
    paymentStatus: "Paid",
    remarks: "Residential rental, 3 BHK apartment",
  },
  {
    id: "INC003",
    propertyId: "PROP003",
    incomeType: "Commercial",
    amount: 85000,
    period: "Monthly",
    tenant: "TechSoft Solutions",
    agreementDate: "2022-03-15",
    agreementEndDate: "2025-03-14",
    paymentStatus: "Pending",
    remarks: "Office space rental, 2nd floor (dispute pending)",
  },
  {
    id: "INC004",
    propertyId: "PROP004",
    incomeType: "Lease",
    amount: 500000,
    period: "Annual",
    tenant: "AutoTech Manufacturing",
    agreementDate: "2023-04-01",
    agreementEndDate: "2028-03-31",
    paymentStatus: "Overdue",
    remarks: "Industrial land lease, overdue by 45 days",
  },
  {
    id: "INC005",
    propertyId: "PROP005",
    incomeType: "Rental",
    amount: 18000,
    period: "Monthly",
    tenant: "Karthik Aravind",
    agreementDate: "2024-01-01",
    agreementEndDate: "2024-12-31",
    paymentStatus: "Paid",
    remarks: "2 BHK flat, residential purpose",
  },
];

// ─── Mock Documents ───────────────────────────────────────────────────────────
export const documents: Document[] = [
  {
    id: "DOC001",
    propertyId: "PROP001",
    documentName: "Sale Deed 2015",
    documentType: "Sale Deed",
    fileSize: "2.4 MB",
    uploadDate: "2024-01-15",
    uploadedBy: "Ramesh Kumar",
    fileFormat: "PDF",
    status: "Verified",
  },
  {
    id: "DOC002",
    propertyId: "PROP001",
    documentName: "Patta Certificate",
    documentType: "Patta",
    fileSize: "845 KB",
    uploadDate: "2024-01-15",
    uploadedBy: "Ramesh Kumar",
    fileFormat: "PDF",
    status: "Verified",
  },
  {
    id: "DOC003",
    propertyId: "PROP001",
    documentName: "Encumbrance Certificate 2024",
    documentType: "EC",
    fileSize: "1.2 MB",
    uploadDate: "2024-01-20",
    uploadedBy: "Ramesh Kumar",
    fileFormat: "PDF",
    status: "Verified",
  },
  {
    id: "DOC004",
    propertyId: "PROP001",
    documentName: "Property Tax Receipt 2023-24",
    documentType: "Tax Receipt",
    fileSize: "320 KB",
    uploadDate: "2024-02-01",
    uploadedBy: "Ramesh Kumar",
    fileFormat: "PDF",
    status: "Verified",
  },
  {
    id: "DOC005",
    propertyId: "PROP002",
    documentName: "SBI Home Loan Agreement",
    documentType: "Loan Agreement",
    fileSize: "5.1 MB",
    uploadDate: "2024-02-20",
    uploadedBy: "Priya Suresh",
    fileFormat: "PDF",
    status: "Verified",
  },
  {
    id: "DOC006",
    propertyId: "PROP002",
    documentName: "Survey Map - Plot 78",
    documentType: "Survey Map",
    fileSize: "3.8 MB",
    uploadDate: "2024-02-21",
    uploadedBy: "Priya Suresh",
    fileFormat: "JPG",
    status: "Pending",
  },
  {
    id: "DOC007",
    propertyId: "PROP003",
    documentName: "NOC from Corporation",
    documentType: "NOC",
    fileSize: "1.1 MB",
    uploadDate: "2024-03-10",
    uploadedBy: "Admin",
    fileFormat: "PDF",
    status: "Rejected",
  },
  {
    id: "DOC008",
    propertyId: "PROP004",
    documentName: "HDFC Mortgage Agreement",
    documentType: "Loan Agreement",
    fileSize: "4.5 MB",
    uploadDate: "2024-03-25",
    uploadedBy: "Sri Ram Enterprises",
    fileFormat: "PDF",
    status: "Verified",
  },
];

// ─── Dashboard Summary ────────────────────────────────────────────────────────
export const dashboardStats = {
  totalProperties: properties.length,
  clearProperties: properties.filter((p) => p.status === "Clear").length,
  underLoanProperties: properties.filter((p) => p.status === "Under Loan").length,
  disputedProperties: properties.filter((p) => p.status === "Disputed").length,
  mortgagedProperties: properties.filter((p) => p.status === "Mortgaged").length,
  totalMarketValue: properties.reduce((sum, p) => sum + p.marketValue, 0),
  activeEncumbrances: encumbrances.filter((e) => e.status === "Active").length,
  totalLoanOutstanding: encumbrances
    .filter((e) => e.status === "Active")
    .reduce((sum, e) => sum + e.outstandingAmount, 0),
  totalMonthlyIncome: incomeRecords
    .filter((i) => i.period === "Monthly")
    .reduce((sum, i) => sum + i.amount, 0),
  totalDocuments: documents.length,
  verifiedDocuments: documents.filter((d) => d.status === "Verified").length,
};
