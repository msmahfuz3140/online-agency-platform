"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getStoredUser, type UserSession } from "@/lib/auth-client";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToastPortal } from "@/components/ui/useToastPortal";
import { motion } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ProjectRequest {
  _id: string;
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  projectType: string;
  budget: string;
  timeline: string;
  status: string;
  createdAt: string;
  requirements?: string;
  adminNotes?: string;
}

const STATUS_OPTIONS = ["pending", "in-progress", "completed", "cancelled"];

export default function AdminRequestsPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailModal, setDetailModal] = useState<{ open: boolean; request: ProjectRequest | null }>({ open: false, request: null });
  const [statusUpdate, setStatusUpdate] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast, ToastPortal } = useToastPortal();

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (filterStatus !== "all") params.set("status", filterStatus);
      const res = await fetch(`${API_BASE_URL}/api/admin/requests?${params}`, { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        setRequests(json.data || []);
      }
    } catch {
      toast("error", "Load Error", "Failed to fetch project requests.");
    }
    setLoading(false);
  }, [filterStatus, toast]);

  useEffect(() => {
    setUser(getStoredUser());
    loadRequests();
  }, [loadRequests]);

  const openDetail = (row: ProjectRequest) => {
    setDetailModal({ open: true, request: row });
    setStatusUpdate(row.status);
    setAdminNotes(row.adminNotes || "");
  };

  const handleSaveStatus = async () => {
    if (!detailModal.request) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/requests/${detailModal.request._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: statusUpdate, adminNotes }),
      });
      if (res.ok) {
        toast("success", "Status Updated", `Request marked as ${statusUpdate}.`);
        await loadRequests();
        setDetailModal({ open: false, request: null });
      } else {
        toast("error", "Update Failed", "Could not update status.");
      }
    } catch {
      toast("error", "Network Error", "Failed to reach the server.");
    }
    setSaving(false);
  };

  const columns: Column<ProjectRequest>[] = [
    {
      key: "clientName",
      label: "Client",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-xs font-semibold text-white leading-none">{row.clientName}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">{row.clientEmail}</p>
        </div>
      ),
    },
    {
      key: "projectTitle",
      label: "Project",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-[11px] font-semibold text-white leading-none truncate max-w-[180px]">{row.projectTitle || "—"}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">{row.projectType}</p>
        </div>
      ),
    },
    {
      key: "budget",
      label: "Budget",
      render: (row) => <span className="text-[11px] text-amber-400 font-mono font-semibold">{row.budget}</span>,
    },
    {
      key: "timeline",
      label: "Timeline",
      render: (row) => <span className="text-[11px] text-neutral-400">{row.timeline}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "createdAt",
      label: "Received",
      sortable: true,
      render: (row) => (
        <span className="text-[11px] text-neutral-500">
          {new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <ToastPortal />
      <AdminTopBar title="Project Requests" subtitle={`${requests.length} total requests`} user={user} onSearch={setSearch} />

      <div className="p-3.5 sm:p-6">
        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {["all", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => { setFilterStatus(s); }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                filterStatus === s
                  ? "border-primary-500/40 bg-primary-500/15 text-primary-300"
                  : "border-white/[0.07] bg-white/[0.03] text-neutral-500 hover:text-white hover:border-white/[0.12]"
              }`}
            >
              {s === "all" ? "All Requests" : s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-neutral-600 font-mono">{requests.length} shown</span>
        </div>

        <DataTable
          columns={columns}
          data={requests}
          keyField="_id"
          pageSize={10}
          loading={loading}
          searchValue={search}
          searchFields={["clientName", "clientEmail", "projectTitle", "projectType"]}
          emptyMessage="No project requests found."
          onRowAction={(row, action) => { if (action === "view") openDetail(row); }}
          rowActions={() => [{ label: "View & Update", action: "view" }]}
        />
      </div>

      {/* Detail Modal */}
      <Modal
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false, request: null })}
        title="Project Request Detail"
        size="lg"
        actions={
          <>
            <Button variant="ghost" onClick={() => setDetailModal({ open: false, request: null })} disabled={saving}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveStatus} loading={saving}>Save Changes</Button>
          </>
        }
      >
        {detailModal.request && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Client", value: detailModal.request.clientName },
                { label: "Email", value: detailModal.request.clientEmail },
                { label: "Project Type", value: detailModal.request.projectType },
                { label: "Budget", value: detailModal.request.budget },
                { label: "Timeline", value: detailModal.request.timeline },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-0.5">{field.label}</p>
                  <p className="text-xs text-white font-medium">{field.value}</p>
                </div>
              ))}
            </div>
            {detailModal.request.requirements && (
              <div>
                <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1">Requirements</p>
                <p className="text-xs text-neutral-300 bg-white/[0.03] rounded-xl p-3 border border-white/[0.06] leading-relaxed">
                  {detailModal.request.requirements}
                </p>
              </div>
            )}
            <div>
              <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block mb-1">Update Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusUpdate(s)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                      statusUpdate === s
                        ? "border-primary-500/40 bg-primary-500/15 text-primary-300"
                        : "border-white/[0.07] bg-white/[0.03] text-neutral-500 hover:text-white"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block mb-1">Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this request..."
                rows={3}
                className="w-full px-3 py-2.5 text-xs text-white bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-primary-500/40 placeholder:text-neutral-600 resize-none"
              />
            </div>
          </motion.div>
        )}
      </Modal>
    </div>
  );
}
