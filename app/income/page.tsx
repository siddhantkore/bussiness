"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea, Button, SearchBar } from "@/components/ui/FormControls";
import { incomeRecords as mockIncome, properties, IncomeRecord } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";

type IncomeForm = Omit<IncomeRecord, "id">;

const emptyForm: IncomeForm = {
  propertyId: "",
  incomeType: "Rental",
  amount: 0,
  period: "Monthly",
  tenant: "",
  agreementDate: "",
  agreementEndDate: "",
  paymentStatus: "Paid",
  remarks: "",
};

const incomeTypeOptions = [
  { value: "Rental", label: "Rental" },
  { value: "Agricultural Yield", label: "Agricultural Yield" },
  { value: "Lease", label: "Lease" },
  { value: "Commercial", label: "Commercial" },
];

const paymentStatusOptions = [
  { value: "Paid", label: "Paid" },
  { value: "Pending", label: "Pending" },
  { value: "Overdue", label: "Overdue" },
];

const periodOptions = [
  { value: "Monthly", label: "Monthly" },
  { value: "Annual", label: "Annual" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "One-time", label: "One-time" },
];

const propertyOptions = properties.map((p) => ({
  value: p.id,
  label: `${p.id} — ${p.ownerName}`,
}));

function validate(f: IncomeForm): Partial<Record<keyof IncomeForm, string>> {
  const e: Partial<Record<keyof IncomeForm, string>> = {};
  if (!f.propertyId) e.propertyId = "Select a property";
  if (!f.tenant.trim()) e.tenant = "Tenant name is required";
  if (f.amount <= 0) e.amount = "Amount must be greater than 0";
  if (!f.agreementDate) e.agreementDate = "Agreement date required";
  return e;
}

const incomeTypeIcon: Record<string, string> = {
  Rental: "🏠",
  "Agricultural Yield": "🌾",
  Lease: "📋",
  Commercial: "🏢",
};

export default function IncomePage() {
  const [data, setData] = useState<IncomeRecord[]>(mockIncome);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<IncomeRecord | null>(null);
  const [form, setForm] = useState<IncomeForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof IncomeForm, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const filtered = useMemo(() =>
    data.filter((r) => {
      const q = search.toLowerCase();
      return (
        (!q || r.tenant.toLowerCase().includes(q) || r.propertyId.toLowerCase().includes(q) || r.incomeType.toLowerCase().includes(q)) &&
        (!filterStatus || r.paymentStatus === filterStatus) &&
        (!filterType || r.incomeType === filterType)
      );
    }),
    [data, search, filterStatus, filterType]
  );

  function openAdd() {
    setEditTarget(null); setForm(emptyForm); setErrors({}); setModalOpen(true);
  }
  function openEdit(r: IncomeRecord) {
    setEditTarget(r);
    const { id, ...rest } = r; void id;
    setForm(rest); setErrors({}); setModalOpen(true);
  }
  async function handleSave() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    if (editTarget) {
      setData((prev) => prev.map((r) => r.id === editTarget.id ? { ...r, ...form } : r));
    } else {
      setData((prev) => [{ id: `INC${String(prev.length + 1).padStart(3, "0")}`, ...form }, ...prev]);
    }
    setIsSaving(false); setModalOpen(false);
  }
  function handleDelete(id: string) {
    if (confirm("Delete this income record?")) setData((prev) => prev.filter((r) => r.id !== id));
  }

  const f = (key: keyof IncomeForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: key === "amount" ? Number(e.target.value) : e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  // Aggregate stats
  const totalMonthly = data.filter(r => r.period === "Monthly").reduce((s, r) => s + r.amount, 0);
  const totalAnnual = data.filter(r => r.period === "Annual").reduce((s, r) => s + r.amount, 0);
  const paidCount = data.filter(r => r.paymentStatus === "Paid").length;
  const overdueCount = data.filter(r => r.paymentStatus === "Overdue").length;

  const columns: Column<IncomeRecord>[] = [
    {
      key: "id",
      header: "ID",
      render: (r) => <span className="font-mono text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-semibold">{r.id}</span>,
    },
    {
      key: "propertyId",
      header: "Property",
      sortable: true,
      render: (r) => {
        const p = properties.find((p) => p.id === r.propertyId);
        return <div><p className="text-xs font-semibold">{r.propertyId}</p><p className="text-xs text-slate-400">{p?.village}</p></div>;
      },
    },
    {
      key: "incomeType",
      header: "Type",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <span>{incomeTypeIcon[r.incomeType]}</span>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">{r.incomeType}</span>
        </div>
      ),
    },
    {
      key: "tenant",
      header: "Tenant",
      sortable: true,
      render: (r) => <span className="text-xs font-semibold text-slate-700">{r.tenant}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (r) => (
        <div>
          <p className="text-xs font-bold text-slate-800">{formatCurrency(r.amount)}</p>
          <p className="text-xs text-slate-400">{r.period}</p>
        </div>
      ),
    },
    {
      key: "agreementDate",
      header: "Agreement",
      sortable: true,
      render: (r) => (
        <div>
          <p className="text-xs text-slate-600">{formatDate(r.agreementDate)}</p>
          <p className="text-xs text-slate-400">to {formatDate(r.agreementEndDate)}</p>
        </div>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment",
      sortable: true,
      render: (r) => <StatusBadge status={r.paymentStatus} />,
    },
    {
      key: "remarks",
      header: "Remarks",
      render: (r) => <span className="text-xs text-slate-400 truncate block max-w-[150px]" title={r.remarks}>{r.remarks || "—"}</span>,
    },
    {
      key: "actions" as keyof IncomeRecord,
      header: "",
      render: (r) => (
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); openEdit(r); }} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Income Details"
      subtitle="Rental income, agricultural yield, and lease records"
      actions={<Button leftIcon={<span>+</span>} onClick={openAdd} size="sm">Add Income</Button>}
    >
      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Monthly Income", value: formatCurrency(totalMonthly), color: "text-green-700", bg: "bg-green-50", icon: "💰" },
          { label: "Annual Income", value: formatCurrency(totalAnnual), color: "text-indigo-700", bg: "bg-indigo-50", icon: "📅" },
          { label: "Payments Received", value: `${paidCount} / ${data.length}`, color: "text-blue-700", bg: "bg-blue-50", icon: "✅" },
          { label: "Overdue Payments", value: overdueCount, color: "text-red-700", bg: "bg-red-50", icon: "⚠️" },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className={`rounded-xl border border-slate-200 shadow-sm p-4 ${bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{icon}</span>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            </div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Income type breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {incomeTypeOptions.map(({ value: type }) => {
          const recs = data.filter((r) => r.incomeType === type);
          const total = recs.reduce((s, r) => s + r.amount, 0);
          return (
            <div key={type} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
              <div className="text-2xl mb-1">{incomeTypeIcon[type]}</div>
              <p className="text-xs text-slate-500 font-medium">{type}</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{formatCurrency(total)}</p>
              <p className="text-xs text-slate-400">{recs.length} records</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by tenant, property, type…" className="flex-1" />
          <Select options={[{ value: "", label: "All Statuses" }, ...paymentStatusOptions]} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} containerClassName="sm:w-40" />
          <Select options={[{ value: "", label: "All Types" }, ...incomeTypeOptions]} value={filterType} onChange={(e) => setFilterType(e.target.value)} containerClassName="sm:w-44" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <DataTable columns={columns} data={filtered} keyField="id" pageSize={8} emptyMessage="No income records found." />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Income Record" : "Add Income Record"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} isLoading={isSaving}>{editTarget ? "Save" : "Add Income"}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Property" options={propertyOptions} value={form.propertyId} onChange={f("propertyId")} error={errors.propertyId} required placeholder="Select property" />
          <Select label="Income Type" options={incomeTypeOptions} value={form.incomeType} onChange={f("incomeType")} required />
          <Input label="Tenant / Lessee Name" value={form.tenant} onChange={f("tenant")} error={errors.tenant} required />
          <Select label="Period" options={periodOptions} value={form.period} onChange={f("period")} />
          <Input label="Amount (₹)" type="number" value={form.amount || ""} onChange={f("amount")} error={errors.amount} required />
          <Select label="Payment Status" options={paymentStatusOptions} value={form.paymentStatus} onChange={f("paymentStatus")} required />
          <Input label="Agreement Start Date" type="date" value={form.agreementDate} onChange={f("agreementDate")} error={errors.agreementDate} required />
          <Input label="Agreement End Date" type="date" value={form.agreementEndDate} onChange={f("agreementEndDate")} />
          <Textarea label="Remarks" value={form.remarks} onChange={f("remarks")} containerClassName="sm:col-span-2" />
        </div>
      </Modal>
    </DashboardLayout>
  );
}
