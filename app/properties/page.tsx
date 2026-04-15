"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea, Button, SearchBar } from "@/components/ui/FormControls";
import { Card } from "@/components/ui/Card";
import { properties as mockProperties, Property } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";

// ─── Form state type ──────────────────────────────────────────────────────────
type PropertyForm = Omit<Property, "id" | "lastUpdated">;

const emptyForm: PropertyForm = {
  surveyNumber: "",
  plotNumber: "",
  village: "",
  taluk: "",
  district: "",
  state: "Tamil Nadu",
  area: 0,
  areaUnit: "Acres",
  landType: "Agricultural",
  status: "Clear",
  marketValue: 0,
  registeredValue: 0,
  ownerName: "",
  pattaNumber: "",
};

const statusOptions = [
  { value: "Clear", label: "Clear" },
  { value: "Under Loan", label: "Under Loan" },
  { value: "Disputed", label: "Disputed" },
  { value: "Mortgaged", label: "Mortgaged" },
];

const landTypeOptions = [
  { value: "Agricultural", label: "Agricultural" },
  { value: "Residential", label: "Residential" },
  { value: "Commercial", label: "Commercial" },
  { value: "Industrial", label: "Industrial" },
];

const areaUnitOptions = [
  { value: "Acres", label: "Acres" },
  { value: "Cents", label: "Cents" },
  { value: "Sq.Ft", label: "Sq. Feet" },
  { value: "Sq.M", label: "Sq. Meters" },
];

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(form: PropertyForm): Partial<Record<keyof PropertyForm, string>> {
  const errors: Partial<Record<keyof PropertyForm, string>> = {};
  if (!form.surveyNumber.trim()) errors.surveyNumber = "Survey number is required";
  if (!form.ownerName.trim()) errors.ownerName = "Owner name is required";
  if (!form.village.trim()) errors.village = "Village is required";
  if (!form.district.trim()) errors.district = "District is required";
  if (form.area <= 0) errors.area = "Area must be greater than 0";
  if (form.marketValue <= 0) errors.marketValue = "Market value is required";
  return errors;
}

export default function PropertiesPage() {
  const [data, setData] = useState<Property[]>(mockProperties);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState<Property | null>(null);
  const [editTarget, setEditTarget] = useState<Property | null>(null);
  const [form, setForm] = useState<PropertyForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof PropertyForm, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  // ── Filtered data ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return data.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.ownerName.toLowerCase().includes(q) ||
        p.surveyNumber.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q);
      const matchStatus = !filterStatus || p.status === filterStatus;
      const matchType = !filterType || p.landType === filterType;
      return matchSearch && matchStatus && matchType;
    });
  }, [data, search, filterStatus, filterType]);

  // ── Open add modal ───────────────────────────────────────────────────────────
  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  // ── Open edit modal ──────────────────────────────────────────────────────────
  function openEdit(p: Property) {
    setEditTarget(p);
    const { id, lastUpdated, ...rest } = p;
    void id; void lastUpdated;
    setForm(rest);
    setErrors({});
    setModalOpen(true);
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  async function handleSave() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    if (editTarget) {
      setData((prev) =>
        prev.map((p) =>
          p.id === editTarget.id
            ? { ...p, ...form, lastUpdated: new Date().toISOString().slice(0, 10) }
            : p
        )
      );
    } else {
      const newProp: Property = {
        id: `PROP${String(data.length + 1).padStart(3, "0")}`,
        ...form,
        lastUpdated: new Date().toISOString().slice(0, 10),
      };
      setData((prev) => [newProp, ...prev]);
    }
    setIsSaving(false);
    setModalOpen(false);
  }

  // ── Delete ───────────────────────────────────────────────────────────────────
  function handleDelete(id: string) {
    if (confirm("Delete this property record?")) {
      setData((prev) => prev.filter((p) => p.id !== id));
    }
  }

  // ── Table columns ────────────────────────────────────────────────────────────
  const columns: Column<Property>[] = [
    {
      key: "id",
      header: "ID",
      sortable: true,
      render: (p) => (
        <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
          {p.id}
        </span>
      ),
    },
    {
      key: "surveyNumber",
      header: "Survey No.",
      sortable: true,
      render: (p) => <span className="font-medium text-slate-700">{p.surveyNumber}</span>,
    },
    {
      key: "ownerName",
      header: "Owner",
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-semibold text-slate-700 text-xs">{p.ownerName}</p>
          <p className="text-xs text-slate-400">Patta: {p.pattaNumber}</p>
        </div>
      ),
    },
    {
      key: "village",
      header: "Location",
      sortable: true,
      render: (p) => (
        <div>
          <p className="text-xs font-medium text-slate-600">{p.village}</p>
          <p className="text-xs text-slate-400">{p.district}</p>
        </div>
      ),
    },
    {
      key: "landType",
      header: "Type",
      sortable: true,
      render: (p) => (
        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
          {p.landType}
        </span>
      ),
    },
    {
      key: "area",
      header: "Area",
      render: (p) => (
        <span className="text-xs text-slate-700 font-medium">
          {p.area} {p.areaUnit}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: "marketValue",
      header: "Market Value",
      sortable: true,
      render: (p) => (
        <span className="font-semibold text-slate-700 text-xs">
          {formatCurrency(p.marketValue)}
        </span>
      ),
    },
    {
      key: "lastUpdated",
      header: "Updated",
      sortable: true,
      render: (p) => <span className="text-xs text-slate-400">{formatDate(p.lastUpdated)}</span>,
    },
    {
      key: "actions" as keyof Property,
      header: "Actions",
      render: (p) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setDetailModal(p); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="View details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(p); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const f = (key: keyof PropertyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: key === "area" || key === "marketValue" || key === "registeredValue" ? Number(e.target.value) : e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <DashboardLayout
      title="Properties"
      subtitle="Manage all land and property records"
      actions={
        <Button leftIcon={<span>+</span>} onClick={openAdd} size="sm">
          Add Property
        </Button>
      }
    >
      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total", value: data.length, accent: "blue" as const },
          { label: "Clear", value: data.filter(p => p.status === "Clear").length, accent: "green" as const },
          { label: "Under Loan", value: data.filter(p => p.status === "Under Loan").length, accent: "yellow" as const },
          { label: "Disputed", value: data.filter(p => p.status === "Disputed").length, accent: "red" as const },
        ].map(({ label, value, accent }) => (
          <Card key={label} subtitle={label} value={value} accent={accent} />
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by owner, survey no., location…"
            className="flex-1"
          />
          <Select
            options={[{ value: "", label: "All Statuses" }, ...statusOptions]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            containerClassName="sm:w-44"
          />
          <Select
            options={[{ value: "", label: "All Types" }, ...landTypeOptions]}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            containerClassName="sm:w-44"
          />
        </div>
        {(search || filterStatus || filterType) && (
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Showing {filtered.length} of {data.length} records</span>
            <button
              onClick={() => { setSearch(""); setFilterStatus(""); setFilterType(""); }}
              className="text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
          pageSize={8}
          emptyMessage="No properties found. Try adjusting filters."
          onRowClick={(p) => setDetailModal(p)}
        />
      </div>

      {/* ── Add / Edit Modal ──────────────────────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Property" : "Add New Property"}
        subtitle={editTarget ? `Editing ${editTarget.id}` : "Fill in property details below"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              {editTarget ? "Save Changes" : "Add Property"}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Survey Number" value={form.surveyNumber} onChange={f("surveyNumber")} error={errors.surveyNumber} required placeholder="e.g. 123/4A" />
          <Input label="Plot Number" value={form.plotNumber} onChange={f("plotNumber")} placeholder="e.g. Plot-45" />
          <Input label="Owner Name" value={form.ownerName} onChange={f("ownerName")} error={errors.ownerName} required placeholder="Full legal name" />
          <Input label="Patta Number" value={form.pattaNumber} onChange={f("pattaNumber")} placeholder="e.g. PTT-2024-001" />
          <Input label="Village" value={form.village} onChange={f("village")} error={errors.village} required />
          <Input label="Taluk" value={form.taluk} onChange={f("taluk")} />
          <Input label="District" value={form.district} onChange={f("district")} error={errors.district} required />
          <Input label="State" value={form.state} onChange={f("state")} />
          <div className="flex gap-2">
            <Input label="Area" type="number" value={form.area || ""} onChange={f("area")} error={errors.area} required containerClassName="flex-1" />
            <Select label="Unit" options={areaUnitOptions} value={form.areaUnit} onChange={f("areaUnit")} containerClassName="w-28" />
          </div>
          <Select label="Land Type" options={landTypeOptions} value={form.landType} onChange={f("landType")} required />
          <Select label="Status" options={statusOptions} value={form.status} onChange={f("status")} required />
          <Input label="Market Value (₹)" type="number" value={form.marketValue || ""} onChange={f("marketValue")} error={errors.marketValue} required placeholder="0" />
          <Input label="Registered Value (₹)" type="number" value={form.registeredValue || ""} onChange={f("registeredValue")} placeholder="0" />
        </div>
      </Modal>

      {/* ── Detail View Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={!!detailModal}
        onClose={() => setDetailModal(null)}
        title="Property Details"
        subtitle={detailModal?.id}
        size="lg"
        footer={
          <Button variant="outline" onClick={() => setDetailModal(null)}>Close</Button>
        }
      >
        {detailModal && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">{detailModal.ownerName}</h3>
                <p className="text-sm text-slate-500">Survey No. {detailModal.surveyNumber} · {detailModal.pattaNumber}</p>
              </div>
              <StatusBadge status={detailModal.status} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Village", value: detailModal.village },
                { label: "Taluk", value: detailModal.taluk },
                { label: "District", value: detailModal.district },
                { label: "State", value: detailModal.state },
                { label: "Plot No.", value: detailModal.plotNumber },
                { label: "Land Type", value: detailModal.landType },
                { label: "Area", value: `${detailModal.area} ${detailModal.areaUnit}` },
                { label: "Market Value", value: formatCurrency(detailModal.marketValue) },
                { label: "Registered Value", value: formatCurrency(detailModal.registeredValue) },
                { label: "Last Updated", value: formatDate(detailModal.lastUpdated) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => { setDetailModal(null); openEdit(detailModal); }}>
                Edit Property
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
