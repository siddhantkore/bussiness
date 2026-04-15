"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea, Button, SearchBar } from "@/components/ui/FormControls";
import { ownershipHistory as mockHistory, properties, OwnershipRecord } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";

type OwnershipForm = Omit<OwnershipRecord, "id">;

const emptyForm: OwnershipForm = {
  propertyId: "",
  ownerName: "",
  fatherName: "",
  address: "",
  dateExecuted: "",
  documentType: "Sale Deed",
  documentNumber: "",
  transactionValue: 0,
  remarks: "",
};

const docTypeOptions = [
  { value: "Sale Deed", label: "Sale Deed" },
  { value: "Gift Deed", label: "Gift Deed" },
  { value: "Inheritance", label: "Inheritance" },
  { value: "Settlement", label: "Settlement" },
  { value: "Exchange", label: "Exchange" },
];

const propertyOptions = properties.map((p) => ({
  value: p.id,
  label: `${p.id} — ${p.ownerName} (${p.village})`,
}));

function validate(f: OwnershipForm): Partial<Record<keyof OwnershipForm, string>> {
  const errors: Partial<Record<keyof OwnershipForm, string>> = {};
  if (!f.propertyId) errors.propertyId = "Select a property";
  if (!f.ownerName.trim()) errors.ownerName = "Owner name is required";
  if (!f.dateExecuted) errors.dateExecuted = "Date executed is required";
  if (!f.documentNumber.trim()) errors.documentNumber = "Document number is required";
  return errors;
}

export default function OwnershipPage() {
  const [data, setData] = useState<OwnershipRecord[]>(mockHistory);
  const [search, setSearch] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [filterDocType, setFilterDocType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<OwnershipRecord | null>(null);
  const [form, setForm] = useState<OwnershipForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof OwnershipForm, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const filtered = useMemo(() => {
    return data.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.ownerName.toLowerCase().includes(q) ||
        r.documentNumber.toLowerCase().includes(q) ||
        r.propertyId.toLowerCase().includes(q);
      const matchProp = !filterProperty || r.propertyId === filterProperty;
      const matchDoc = !filterDocType || r.documentType === filterDocType;
      return matchSearch && matchProp && matchDoc;
    });
  }, [data, search, filterProperty, filterDocType]);

  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(r: OwnershipRecord) {
    setEditTarget(r);
    const { id, ...rest } = r;
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
      setData((prev) => prev.map((r) => r.id === editTarget.id ? { ...r, ...form } : r));
    } else {
      const newRec: OwnershipRecord = {
        id: `OWN${String(data.length + 1).padStart(3, "0")}`,
        ...form,
      };
      setData((prev) => [newRec, ...prev]);
    }
    setIsSaving(false);
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this ownership record?")) setData((prev) => prev.filter((r) => r.id !== id));
  }

  const f = (key: keyof OwnershipForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: key === "transactionValue" ? Number(e.target.value) : e.target.value,
      }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const columns: Column<OwnershipRecord>[] = [
    {
      key: "id",
      header: "Record ID",
      render: (r) => (
        <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
          {r.id}
        </span>
      ),
    },
    {
      key: "propertyId",
      header: "Property",
      sortable: true,
      render: (r) => {
        const prop = properties.find((p) => p.id === r.propertyId);
        return (
          <div>
            <p className="text-xs font-semibold text-slate-700">{r.propertyId}</p>
            <p className="text-xs text-slate-400 truncate max-w-[120px]">{prop?.village}</p>
          </div>
        );
      },
    },
    {
      key: "ownerName",
      header: "Owner Name",
      sortable: true,
      render: (r) => (
        <div>
          <p className="text-xs font-semibold text-slate-700">{r.ownerName}</p>
          <p className="text-xs text-slate-400">S/o {r.fatherName}</p>
        </div>
      ),
    },
    {
      key: "documentType",
      header: "Document Type",
      sortable: true,
      render: (r) => (
        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-medium">
          {r.documentType}
        </span>
      ),
    },
    {
      key: "documentNumber",
      header: "Doc. Number",
      render: (r) => <span className="font-mono text-xs text-slate-600">{r.documentNumber}</span>,
    },
    {
      key: "dateExecuted",
      header: "Date Executed",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xs text-slate-700 font-medium">{formatDate(r.dateExecuted)}</span>
        </div>
      ),
    },
    {
      key: "transactionValue",
      header: "Transaction Value",
      sortable: true,
      render: (r) => (
        <span className="text-xs font-semibold text-slate-700">
          {r.transactionValue > 0 ? formatCurrency(r.transactionValue) : <span className="text-slate-400 italic">—</span>}
        </span>
      ),
    },
    {
      key: "remarks",
      header: "Remarks",
      render: (r) => (
        <span className="text-xs text-slate-500 max-w-[160px] truncate block" title={r.remarks}>
          {r.remarks || "—"}
        </span>
      ),
    },
    {
      key: "actions" as keyof OwnershipRecord,
      header: "Actions",
      render: (r) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(r); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  // Timeline grouped by property
  const byProperty = useMemo(() => {
    const map: Record<string, OwnershipRecord[]> = {};
    filtered.forEach((r) => {
      if (!map[r.propertyId]) map[r.propertyId] = [];
      map[r.propertyId].push(r);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => b.dateExecuted.localeCompare(a.dateExecuted)));
    return map;
  }, [filtered]);

  return (
    <DashboardLayout
      title="Ownership History"
      subtitle="Track complete chain of title transfers"
      actions={
        <Button leftIcon={<span>+</span>} onClick={openAdd} size="sm">
          Add Record
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Records", value: data.length },
          { label: "Sale Deeds", value: data.filter(r => r.documentType === "Sale Deed").length },
          { label: "Inheritances", value: data.filter(r => r.documentType === "Inheritance").length },
          { label: "Properties Covered", value: new Set(data.map(r => r.propertyId)).size },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by owner, doc number, property ID…"
            className="flex-1"
          />
          <Select
            options={[{ value: "", label: "All Properties" }, ...propertyOptions.map(o => ({ value: o.value, label: o.value }))]}
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            containerClassName="sm:w-44"
          />
          <Select
            options={[{ value: "", label: "All Doc Types" }, ...docTypeOptions]}
            value={filterDocType}
            onChange={(e) => setFilterDocType(e.target.value)}
            containerClassName="sm:w-44"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-3">All Ownership Records</h2>
        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
          pageSize={8}
          emptyMessage="No ownership records found."
        />
      </div>

      {/* Timeline View */}
      {Object.entries(byProperty).length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-5">Chain of Title — Timeline View</h2>
          <div className="space-y-8">
            {Object.entries(byProperty).map(([propId, records]) => {
              const prop = properties.find((p) => p.id === propId);
              return (
                <div key={propId}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">{propId}</span>
                    <span className="text-sm font-semibold text-slate-700">{prop?.ownerName}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-400">{prop?.village}, {prop?.district}</span>
                  </div>
                  <div className="relative pl-6">
                    {/* Vertical line */}
                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200" />
                    <div className="space-y-4">
                      {records.map((r, idx) => (
                        <div key={r.id} className="relative flex gap-4">
                          <div className={`absolute -left-4 mt-1 w-3 h-3 rounded-full border-2 border-white shadow ${idx === 0 ? "bg-blue-500" : "bg-slate-300"}`} />
                          <div className="flex-1 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                              <div>
                                <span className="text-xs font-bold text-slate-700">{r.ownerName}</span>
                                <span className="text-xs text-slate-400 ml-2">S/o {r.fatherName}</span>
                                {idx === 0 && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">Current</span>
                                )}
                              </div>
                              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">{r.documentType}</span>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-1">
                              <span>📅 {formatDate(r.dateExecuted)}</span>
                              <span>📄 {r.documentNumber}</span>
                              {r.transactionValue > 0 && <span>💰 {formatCurrency(r.transactionValue)}</span>}
                            </div>
                            {r.remarks && (
                              <p className="text-xs text-slate-500 mt-1.5 italic">&ldquo;{r.remarks}&rdquo;</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Ownership Record" : "Add Ownership Record"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              {editTarget ? "Save Changes" : "Add Record"}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Property" options={propertyOptions} value={form.propertyId} onChange={f("propertyId")} error={errors.propertyId} required placeholder="Select property" />
          <Input label="Owner Name" value={form.ownerName} onChange={f("ownerName")} error={errors.ownerName} required />
          <Input label="Father's Name" value={form.fatherName} onChange={f("fatherName")} />
          <Select label="Document Type" options={docTypeOptions} value={form.documentType} onChange={f("documentType")} required />
          <Input label="Document Number" value={form.documentNumber} onChange={f("documentNumber")} error={errors.documentNumber} required placeholder="e.g. DOC-2024-0001" />
          <Input label="Date Executed" type="date" value={form.dateExecuted} onChange={f("dateExecuted")} error={errors.dateExecuted} required />
          <Input label="Transaction Value (₹)" type="number" value={form.transactionValue || ""} onChange={f("transactionValue")} placeholder="0 for gift/inheritance" />
          <Textarea label="Address" value={form.address} onChange={f("address")} containerClassName="sm:col-span-2" />
          <Textarea label="Remarks" value={form.remarks} onChange={f("remarks")} containerClassName="sm:col-span-2" />
        </div>
      </Modal>
    </DashboardLayout>
  );
}
