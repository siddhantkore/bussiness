"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Button, SearchBar } from "@/components/ui/FormControls";
import { documents as mockDocs, properties, Document } from "@/lib/mockData";
import { formatDate, getFileIcon } from "@/lib/utils";

type DocumentForm = Omit<Document, "id" | "uploadDate" | "fileSize" | "fileFormat"> & {
  fileFormat: Document["fileFormat"];
};

const emptyForm: DocumentForm = {
  propertyId: "",
  documentName: "",
  documentType: "Sale Deed",
  uploadedBy: "",
  status: "Pending",
  fileFormat: "PDF",
};

const docTypeOptions = [
  { value: "Sale Deed", label: "Sale Deed" },
  { value: "Patta", label: "Patta" },
  { value: "EC", label: "Encumbrance Certificate" },
  { value: "Tax Receipt", label: "Tax Receipt" },
  { value: "Survey Map", label: "Survey Map" },
  { value: "NOC", label: "NOC" },
  { value: "Loan Agreement", label: "Loan Agreement" },
];

const statusOptions = [
  { value: "Verified", label: "Verified" },
  { value: "Pending", label: "Pending" },
  { value: "Rejected", label: "Rejected" },
];

const formatOptions = [
  { value: "PDF", label: "PDF" },
  { value: "JPG", label: "JPG" },
  { value: "PNG", label: "PNG" },
  { value: "DOCX", label: "DOCX" },
];

const propertyOptions = properties.map((p) => ({
  value: p.id,
  label: `${p.id} — ${p.ownerName}`,
}));

function validate(f: DocumentForm): Partial<Record<keyof DocumentForm, string>> {
  const e: Partial<Record<keyof DocumentForm, string>> = {};
  if (!f.propertyId) e.propertyId = "Select a property";
  if (!f.documentName.trim()) e.documentName = "Document name is required";
  if (!f.uploadedBy.trim()) e.uploadedBy = "Uploader name is required";
  return e;
}

// Format badge color
const formatBg: Record<string, string> = {
  PDF:  "bg-red-50 text-red-700",
  JPG:  "bg-purple-50 text-purple-700",
  PNG:  "bg-indigo-50 text-indigo-700",
  DOCX: "bg-blue-50 text-blue-700",
};

// Document card component
function DocCard({
  doc,
  onEdit,
  onDelete,
}: {
  doc: Document;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const prop = properties.find((p) => p.id === doc.propertyId);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md hover:border-blue-200 transition-all group">
      <div className="flex items-start gap-3 mb-3">
        {/* File icon */}
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center flex-shrink-0 group-hover:border-blue-200 transition-colors">
          <span className="text-xl">{getFileIcon(doc.fileFormat)}</span>
          <span className={`text-[9px] font-bold mt-0.5 px-1 rounded ${formatBg[doc.fileFormat]}`}>
            {doc.fileFormat}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate" title={doc.documentName}>
            {doc.documentName}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{doc.documentType}</p>
        </div>
        <StatusBadge status={doc.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
          <p className="text-xs text-slate-400">Property</p>
          <p className="text-xs font-semibold text-slate-700">{doc.propertyId}</p>
        </div>
        <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
          <p className="text-xs text-slate-400">Owner</p>
          <p className="text-xs font-semibold text-slate-700 truncate">{prop?.ownerName ?? "—"}</p>
        </div>
        <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
          <p className="text-xs text-slate-400">Uploaded</p>
          <p className="text-xs font-semibold text-slate-700">{formatDate(doc.uploadDate)}</p>
        </div>
        <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
          <p className="text-xs text-slate-400">File Size</p>
          <p className="text-xs font-semibold text-slate-700">{doc.fileSize}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400">By {doc.uploadedBy}</span>
        <div className="flex gap-1">
          {/* Download button (mock) */}
          <button
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
            onClick={() => alert("Download: " + doc.documentName)}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const [data, setData] = useState<Document[]>(mockDocs);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Document | null>(null);
  const [form, setForm] = useState<DocumentForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof DocumentForm, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const filtered = useMemo(() =>
    data.filter((d) => {
      const q = search.toLowerCase();
      return (
        (!q || d.documentName.toLowerCase().includes(q) || d.propertyId.toLowerCase().includes(q) || d.documentType.toLowerCase().includes(q) || d.uploadedBy.toLowerCase().includes(q)) &&
        (!filterStatus || d.status === filterStatus) &&
        (!filterType || d.documentType === filterType) &&
        (!filterProperty || d.propertyId === filterProperty)
      );
    }),
    [data, search, filterStatus, filterType, filterProperty]
  );

  function openAdd() {
    setEditTarget(null); setForm(emptyForm); setErrors({}); setModalOpen(true);
  }
  function openEdit(d: Document) {
    setEditTarget(d);
    const { id, uploadDate, fileSize, ...rest } = d; void id; void uploadDate; void fileSize;
    setForm(rest); setErrors({}); setModalOpen(true);
  }
  async function handleSave() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    if (editTarget) {
      setData((prev) => prev.map((d) => d.id === editTarget.id ? { ...d, ...form } : d));
    } else {
      const newDoc: Document = {
        id: `DOC${String(data.length + 1).padStart(3, "0")}`,
        ...form,
        uploadDate: new Date().toISOString().slice(0, 10),
        fileSize: "—",
      };
      setData((prev) => [newDoc, ...prev]);
    }
    setIsSaving(false); setModalOpen(false);
  }
  function handleDelete(id: string) {
    if (confirm("Delete this document record?")) setData((prev) => prev.filter((d) => d.id !== id));
  }

  const ff = (key: keyof DocumentForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  // Stats
  const verified = data.filter(d => d.status === "Verified").length;
  const pending = data.filter(d => d.status === "Pending").length;
  const rejected = data.filter(d => d.status === "Rejected").length;

  // Group by property for list view
  const byProperty = useMemo(() => {
    const map: Record<string, Document[]> = {};
    filtered.forEach((d) => {
      if (!map[d.propertyId]) map[d.propertyId] = [];
      map[d.propertyId].push(d);
    });
    return map;
  }, [filtered]);

  return (
    <DashboardLayout
      title="Documents"
      subtitle="Property deeds, certificates, and legal documents"
      actions={
        <div className="flex items-center gap-2">
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => setView("grid")} className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "grid" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>⊞ Grid</button>
            <button onClick={() => setView("list")} className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "list" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>☰ List</button>
          </div>
          <Button leftIcon={<span>+</span>} onClick={openAdd} size="sm">Upload Document</Button>
        </div>
      }
    >
      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Documents", value: data.length, color: "text-slate-800", bg: "bg-white", border: "border-slate-200" },
          { label: "Verified", value: verified, color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
          { label: "Pending Review", value: pending, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
          { label: "Rejected", value: rejected, color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className={`rounded-xl border ${border} shadow-sm p-4 ${bg}`}>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, type, property, uploader…" className="flex-1" />
          <Select options={[{ value: "", label: "All Properties" }, ...propertyOptions.map(o => ({ value: o.value, label: o.value }))]} value={filterProperty} onChange={(e) => setFilterProperty(e.target.value)} containerClassName="sm:w-40" />
          <Select options={[{ value: "", label: "All Types" }, ...docTypeOptions]} value={filterType} onChange={(e) => setFilterType(e.target.value)} containerClassName="sm:w-48" />
          <Select options={[{ value: "", label: "All Statuses" }, ...statusOptions]} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} containerClassName="sm:w-40" />
        </div>
        {(search || filterStatus || filterType || filterProperty) && (
          <p className="text-xs text-slate-400 mt-2">
            {filtered.length} document{filtered.length !== 1 ? "s" : ""} found
            <button onClick={() => { setSearch(""); setFilterStatus(""); setFilterType(""); setFilterProperty(""); }} className="text-blue-600 hover:underline ml-2">Clear</button>
          </p>
        )}
      </div>

      {/* Grid View */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-slate-400">
              <div className="text-4xl mb-2">📂</div>
              <p>No documents found.</p>
            </div>
          ) : (
            filtered.map((doc) => (
              <DocCard key={doc.id} doc={doc} onEdit={() => openEdit(doc)} onDelete={() => handleDelete(doc.id)} />
            ))
          )}
        </div>
      ) : (
        /* List View — grouped by property */
        <div className="space-y-4">
          {Object.keys(byProperty).length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">
              <div className="text-4xl mb-2">📂</div>
              <p>No documents found.</p>
            </div>
          ) : (
            Object.entries(byProperty).map(([propId, docs]) => {
              const prop = properties.find((p) => p.id === propId);
              return (
                <div key={propId} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Property group header */}
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                    <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">{propId}</span>
                    <span className="text-sm font-semibold text-slate-700">{prop?.ownerName}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-400">{prop?.village}, {prop?.district}</span>
                    <span className="ml-auto text-xs text-slate-400">{docs.length} file{docs.length !== 1 ? "s" : ""}</span>
                  </div>
                  {/* Files list */}
                  <div className="divide-y divide-slate-100">
                    {docs.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-base leading-none">{getFileIcon(doc.fileFormat)}</span>
                          <span className={`text-[8px] font-bold leading-none mt-0.5 ${formatBg[doc.fileFormat]}`}>{doc.fileFormat}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700 truncate">{doc.documentName}</p>
                          <p className="text-xs text-slate-400">{doc.documentType} · {doc.fileSize} · {formatDate(doc.uploadDate)}</p>
                        </div>
                        <StatusBadge status={doc.status} />
                        <span className="text-xs text-slate-400 hidden md:block">{doc.uploadedBy}</span>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => alert("Download: " + doc.documentName)}
                            className="px-2 py-1 text-xs font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >↓</button>
                          <button onClick={() => openEdit(doc)} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Document" : "Upload Document"}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} isLoading={isSaving}>{editTarget ? "Save" : "Upload"}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Property" options={propertyOptions} value={form.propertyId} onChange={ff("propertyId")} error={errors.propertyId} required placeholder="Select property" containerClassName="sm:col-span-2" />
          <Input label="Document Name" value={form.documentName} onChange={ff("documentName")} error={errors.documentName} required placeholder="e.g. Sale Deed 2024" containerClassName="sm:col-span-2" />
          <Select label="Document Type" options={docTypeOptions} value={form.documentType} onChange={ff("documentType")} required />
          <Select label="File Format" options={formatOptions} value={form.fileFormat} onChange={ff("fileFormat")} />
          <Input label="Uploaded By" value={form.uploadedBy} onChange={ff("uploadedBy")} error={errors.uploadedBy} required />
          <Select label="Status" options={statusOptions} value={form.status} onChange={ff("status")} required />
        </div>
      </Modal>
    </DashboardLayout>
  );
}
