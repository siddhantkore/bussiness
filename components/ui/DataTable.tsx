"use client";

import React, { useState } from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  emptyMessage?: string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}

/**
 * DataTable – reusable sortable + paginated table component.
 * Supports custom cell renderers, row click handlers, and loading states.
 */
export function DataTable<T extends object>({
  columns,
  data,
  keyField,
  emptyMessage = "No records found.",
  pageSize = 10,
  onRowClick,
  isLoading = false,
}: TableProps<T>) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // Sorting
  const sorted = React.useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aVal = (a as any)[sortField];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bVal = (b as any)[sortField];
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDir]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (colKey: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortField === colKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(colKey);
      setSortDir("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortField !== colKey)
      return <span className="ml-1 text-slate-300">↕</span>;
    return (
      <span className={`ml-1 ${sortDir === "asc" ? "text-blue-600" : "text-blue-600"}`}>
        {sortDir === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading records…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap select-none ${
                    col.sortable ? "cursor-pointer hover:text-slate-800 hover:bg-slate-100 transition-colors" : ""
                  } ${col.className ?? ""}`}
                  onClick={() => handleSort(String(col.key), col.sortable)}
                >
                  {col.header}
                  {col.sortable && <SortIcon colKey={String(col.key)} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-slate-400 text-sm"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">📭</span>
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((row, rowIdx) => (
                <tr
                  key={String((row as Record<string, unknown>)[keyField as string])}
                  className={`transition-colors ${
                    onRowClick
                      ? "cursor-pointer hover:bg-blue-50"
                      : rowIdx % 2 === 0
                      ? "bg-white"
                      : "bg-slate-50/50"
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-3 text-slate-700 whitespace-nowrap ${col.className ?? ""}`}
                    >
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key as string] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 py-3">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, sorted.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-700">{sorted.length}</span> records
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
              )
              .map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="text-slate-400 text-xs px-1">…</span>
                  )}
                  <button
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                      page === p
                        ? "bg-blue-600 text-white border border-blue-600"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
