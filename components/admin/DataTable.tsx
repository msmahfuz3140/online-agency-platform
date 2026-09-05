"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type SortDir = "asc" | "desc";

export interface Column<T extends object> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  pageSize?: number;
  emptyMessage?: string;
  loading?: boolean;
  onRowAction?: (row: T, action: string) => void;
  rowActions?: (row: T) => { label: string; action: string; variant?: "danger" | "normal" }[];
  searchValue?: string;
  searchFields?: (keyof T)[];
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-white/[0.05] rounded-md animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function DataTable<T extends object>({
  columns,
  data,
  keyField,
  pageSize = 10,
  emptyMessage = "No data found.",
  loading = false,
  onRowAction,
  rowActions,
  searchValue = "",
  searchFields = [],
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  // Filter by search
  const filtered = useMemo(() => {
    if (!searchValue || searchFields.length === 0) return data;
    const q = searchValue.toLowerCase();
    return data.filter((row) => {
      const r = row as Record<string, unknown>;
      return searchFields.some((f) => String(r[f as string] ?? "").toLowerCase().includes(q));
    });
  }, [data, searchValue, searchFields]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = String((a as Record<string, unknown>)[sortKey] ?? "");
      const bv = String((b as Record<string, unknown>)[sortKey] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-0 rounded-xl border border-white/[0.07] bg-[#111827] overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                  className={`px-4 py-3 text-left font-semibold text-neutral-500 uppercase tracking-wider select-none ${
                    col.sortable ? "cursor-pointer hover:text-white transition-colors" : ""
                  } ${col.className ?? ""}`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <span className={`flex flex-col gap-[1px] ${sortKey === String(col.key) ? "text-primary-400" : "text-neutral-700"}`}>
                        <svg className={`w-2.5 h-2.5 transition-transform ${sortKey === String(col.key) && sortDir === "desc" ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .55.24l3.25 3.5a.75.75 0 1 1-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 0 1-1.1-1.02l3.25-3.5A.75.75 0 0 1 10 3Zm-3.76 9.2a.75.75 0 0 1 1.06.04l2.7 2.908 2.7-2.908a.75.75 0 1 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 0 1 .04-1.06Z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </span>
                </th>
              ))}
              {rowActions && <th className="px-4 py-3 text-right font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={columns.length + (rowActions ? 1 : 0)} />)
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="px-4 py-12 text-center text-neutral-600">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h.008v.008h-.008V8.25Zm-7.5 0h.008v.008H12V8.25Z" />
                    </svg>
                    <span className="text-[11px]">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="wait">
                {paged.map((row, idx) => (
                  <motion.tr
                    key={String((row as Record<string, unknown>)[keyField as string])}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, delay: idx * 0.03 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors group"
                  >
                    {columns.map((col) => (
                      <td key={String(col.key)} className={`px-4 py-3 text-neutral-300 ${col.className ?? ""}`}>
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? "—")}
                      </td>
                    ))}
                    {rowActions && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {rowActions(row).map((action) => (
                            <button
                              key={action.action}
                              onClick={() => onRowAction?.(row, action.action)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                                action.variant === "danger"
                                  ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
                                  : "border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] hover:text-white"
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] bg-white/[0.01]">
          <span className="text-[11px] text-neutral-600">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="h-7 w-7 rounded-lg border border-white/[0.07] bg-white/[0.03] flex items-center justify-center text-neutral-400 hover:text-white hover:border-primary-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let p = i + 1;
              if (totalPages > 5) {
                if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded-lg text-[11px] font-semibold border transition-all ${
                    page === p
                      ? "border-primary-500/40 bg-primary-500/15 text-primary-300"
                      : "border-white/[0.07] bg-white/[0.03] text-neutral-400 hover:text-white hover:border-primary-500/20"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="h-7 w-7 rounded-lg border border-white/[0.07] bg-white/[0.03] flex items-center justify-center text-neutral-400 hover:text-white hover:border-primary-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
