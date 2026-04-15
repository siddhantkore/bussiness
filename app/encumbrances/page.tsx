"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Button, SearchBar } from "@/components/ui/FormControls";
import { encumbrances as mockEncumbrances, properties, Encumbrance } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";

type EncumbranceForm = Omit<Encumbrance, "id">;

const emptyForm: EncumbranceForm = {
  propertyId: "",
  lenderName: "",
  loanType: "Home Loan",
  principal: 0,
  interestRate: 0,
  startDate: "",
  endDate: "",
  status: "Active",
  emiAmount: 0,
  outstandingAmount: 0,
  bankBranch: "",
  loanAccountNumber: "",
};

const loanTypeOptions = [
  { value: "Home Loan", label: "Home Loan" },
  { value: "Agricultural Loan", label: "Agricultural Loan" },
  { value: "Mortgage", label: "Mortgage" },
  { value: "Commercial Loan", label: "Commercial Loan" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Closed", label: "Closed" },
  { value: "Defaulted", label: "Defaulted" },
];

const propertyOptions = properties.map((p) => ({
  value: p.id,
  label: `${p.id} — ${p.ownerName}`,
}));

function validate(f: EncumbranceForm): Partial<Record<keyof EncumbranceForm, string>> {
  const errors: Partial<Record<keyof EncumbranceForm, string>> = {};
  if (!f.propertyId) errors.propertyId = "Select a property";
  if (!f.lenderName.trim()) errors.lenderName = "Lender name is required";
  if (f.principal <= 0) errors.principal = "Principal amount required";
  if (!f.startDate) errors.startDate = "Start date is required";
  if (!f.loanAccountNumber.trim()) errors.loanAccountNumber = "Loan account number required";
  return errors;
}

// Loan card component
function LoanCard({
  enc,
  onEdit,
  onDelete,
}: {
  enc: Encumbrance;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const prop = properties.find((p) => p.id === enc.propertyId);
  const pct = enc.principal > 0 ? Math.round((enc.outstandingAmount / enc.principal) * 100) : 0;
  const barColor =
    enc.status === "Active"
      ? "bg-amber-500"
      : enc.status === "Defaulted"
      ? "bg-red-500"
      : "bg-green-500";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-lg">
            🏦
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{enc.lenderName}</p>
            <p className="text-xs text-slate-500">{enc.bankBranch}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={enc.status} />
          <button
            onClick={onEdit}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: "Loan Type", value: enc.loanType },
          { label: "Account No.", value: enc.loanAccountNumber },
          { label: "Property", value: enc.propertyId },
          { label: "Owner", value: prop?.ownerName ?? "—" },
          { label: "Start Date", value: formatDate(enc.startDate) },
          { label: "End Date", value: formatDate(enc.endDate) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-50 rounded-lg px-3 py-2">
            <p className="text-xs text-slate-400 font-medium">{label}</p>
            <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Financials */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="rounded-lg bg-blue-50 py-2.5">
          <p className="text-xs text-blue-500 font-medium">Principal</p>
          <p className="text-sm font-bold text-blue-700 mt-0.5">{formatCurrency(enc.principal)}</p>
        </div>
        <div className="rounded-lg bg-amber-50 py-2.5">
          <p className="text-xs text-amber-500 font-medium">Outstanding</p>
          <p className="text-sm font-bold text-amber-700 mt-0.5">{formatCurrency(enc.outstandingAmount)}</p>
        </div>
        <div className="rounded-lg bg-indigo-50 py-2.5">
          <p className="text-xs text-indigo-500 font-medium">EMI / Month</p>
          <p className="text-sm font-bold text-indigo-700 mt-0.5">{formatCurrency(enc.emiAmount)}</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500">Repayment Progress</span>
          <span className="font-semibold text-slate-600">{100 - pct}% repaid</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1 text-slate-400">
          <span>Interest: {enc.interestRate}% p.a.</span>
          <span>{pct}% remaining</span>
        </div>
      </div>
    </div>
  );
}

export default function EncumbrancesPage() {
  const [data, setData] = useState<Encumbrance[]>(mockEncumbrances);
  const [view, setView] = useState<"cards" | "table">("cards");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Encumbrance | null>(null);
  const [form, setForm] = useState<EncumbranceForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof EncumbranceForm, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const filtered = useMemo(() => {
    return data.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.lenderName.toLowerCase().includes(q) ||
        e.loanAccountNumber.toLowerCase().includes(q) ||
        e.propertyId.toLowerCase().includes(q);
      const matchStatus = !filterStatus || e.status === filterStatus;
      const matchType = !filterType || e.loanType === filterType;
      return matchSearch && matchStatus && matchType;
    });
  }, [data, search, filterStatus, filterType]);

  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(e: Encumbrance) {
    setEditTarget(e);
    const { id, ...rest } = e;
    void id;
    setForm(rest);
    setErrors({});
    setModalOpen(true);
  }

  async function handleSave() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    if (editTarget) {
      setData((prev) => prev.map((e) => e.id === editTarget.id ? { ...e, ...form } : e));
    } else {
      setData((prev) => [
        { id: `ENC${String(prev.length + 1).padStart(3, "0")}`, ...form },
        ...prev,
      ]);
    }
    setIsSaving(false);
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this encumbrance record?")) setData((prev) => prev.filter((e) => e.id !== id));
  }

  const n = (key: keyof EncumbranceForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const numFields = ["principal", "interestRate", "emiAmount", "outstandingAmount"] as const;
      setForm((prev) => ({
        ...prev,
        [key]: numFields.includes(key as typeof numFields[number]) ? Number(e.target.value) : e.target.value,
      }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  // Table columns
  const columns: Column<Encumbrance>[] = [
    {
      key: "id",
      header: "ID",
      render: (e) => <span className="font-mono text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-semibold">{e.id}</span>,
    },
    {
      key: "propertyId",
      header: "Property",
      sortable: true,
      render: (e) => {
        const p = properties.find((p) => p.id === e.propertyId);
        return <div><p className="text-xs font-semibold">{e.propertyId}</p><p className="text-xs text-slate-400">{p?.ownerName}</p></div>;
      },
    },
    { key: "lenderName", header: "Lender", sortable: true, render: (e) => <span className="text-xs font-semibold text-slate-700">{e.lenderName}</span> },
    { key: "loanType", header: "Type", sortable: true, render: (e) => <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{e.loanType}</span> },
    { key: "principal", header: "Principal", sortable: true, render: (e) => <span className="text-xs font-semibold">{formatCurrency(e.principal)}</span> },
    { key: "outstandingAmount", header: "Outstanding", sortable: true, render: (e) => <span className="text-xs font-bold text-amber-700">{formatCurrency(e.outstandingAmount)}</span> },
    { key: "interestRate", header: "Rate", render: (e) => <span className="text-xs">{e.interestRate}%</span> },
    { key: "emiAmount", header: "EMI", render: (e) => <span className="text-xs font-medium">{formatCurrency(e.emiAmount)}</span> },
    { key: "endDate", header: "End Date", sortable: true, render: (e) => <span className="text-xs text-slate-500">{formatDate(e.endDate)}</span> },
    { key: "status", header: "Status", sortable: true, render: (e) => <StatusBadge status={e.status} /> },
    {
      key: "actions" as keyof Encumbrance,
      header: "Actions",
      render: (e) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(e)} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button onClick={() => handleDelete(e.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      ),
    },
  ];

  const totalOutstanding = data.filter(e => e.status === "Active").reduce((s, e) => s + e.outstandingAmount, 0);
  const totalPrincipal = data.reduce((s, e) => s + e.principal, 0);

  return (
    <DashboardLayout
      title="Encumbrances"
      subtitle="Loans, mortgages, and liabilities on properties"
      actions={
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setView("cards")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "cards" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
            >⊞ Cards</button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "table" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
            >☰ Table</button>
          </div>
          <Button leftIcon={<span>+</span>} onClick={openAdd} size="sm">Add Encumbrance</Button>
        </div>
      }
    >
      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Active Loans", value: data.filter(e => e.status === "Active").length, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Total Outstanding", value: formatCurrency(totalOutstanding), color: "text-red-600", bg: "bg-red-50" },
          { label: "Total Principal", value: formatCurrency(totalPrincipal), color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Defaulted", value: data.filter(e => e.status === "Defaulted").length, color: "text-red-700", bg: "bg-red-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-xl border border-slate-200 shadow-sm p-4 ${bg}`}>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by lender, account no., property…" className="flex-1" />
          <Select options={[{ value: "", label: "All Statuses" }, ...statusOptions]} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} containerClassName="sm:w-40" />
          <Select options={[{ value: "", label: "All Types" }, ...loanTypeOptions]} value={filterType} onChange={(e) => setFilterType(e.target.value)} containerClassName="sm:w-44" />
        </div>
      </div>

      {/* Cards or Table */}
      {view === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-slate-400">
              <div className="text-4xl mb-2">📭</div>
              <p>No encumbrances found.</p>
            </div>
          ) : (
            filtered.map((enc) => (
              <LoanCard key={enc.id} enc={enc} onEdit={() => openEdit(enc)} onDelete={() => handleDelete(enc.id)} />
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <DataTable columns={columns} data={filtered} keyField="id" pageSize={8} emptyMessage="No encumbrances found." />
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Encumbrance" : "Add Encumbrance"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} isLoading={isSaving}>{editTarget ? "Save Changes" : "Add"}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Property" options={propertyOptions} value={form.propertyId} onChange={n("propertyId")} error={errors.propertyId} required placeholder="Select property" />
          <Input label="Lender / Bank Name" value={form.lenderName} onChange={n("lenderName")} error={errors.lenderName} required />
          <Select label="Loan Type" options={loanTypeOptions} value={form.loanType} onChange={n("loanType")} required />
          <Select label="Status" options={statusOptions} value={form.status} onChange={n("status")} required />
          <Input label="Loan Account Number" value={form.loanAccountNumber} onChange={n("loanAccountNumber")} error={errors.loanAccountNumber} required />
          <Input label="Bank Branch" value={form.bankBranch} onChange={n("bankBranch")} />
          <Input label="Principal Amount (₹)" type="number" value={form.principal || ""} onChange={n("principal")} error={errors.principal} required />
          <Input label="Outstanding Amount (₹)" type="number" value={form.outstandingAmount || ""} onChange={n("outstandingAmount")} />
          <Input label="Interest Rate (% p.a.)" type="number" value={form.interestRate || ""} onChange={n("interestRate")} step="0.1" />
          <Input label="EMI Amount (₹)" type="number" value={form.emiAmount || ""} onChange={n("emiAmount")} />
          <Input label="Start Date" type="date" value={form.startDate} onChange={n("startDate")} error={errors.startDate} required />
          <Input label="End Date" type="date" value={form.endDate} onChange={n("endDate")} />
        </div>
      </Modal>
    </DashboardLayout>
  );
}
