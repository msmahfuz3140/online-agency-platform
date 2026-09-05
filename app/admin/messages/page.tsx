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

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  company?: string;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["unread", "read", "replied", "archived"];

export default function AdminMessagesPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailModal, setDetailModal] = useState<{ open: boolean; message: ContactMessage | null }>({ open: false, message: null });
  const [statusUpdate, setStatusUpdate] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast, ToastPortal } = useToastPortal();

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (filterStatus !== "all") params.set("status", filterStatus);
      const res = await fetch(`${API_BASE_URL}/api/admin/messages?${params}`, { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        setMessages(json.data || []);
      }
    } catch {
      toast("error", "Load Error", "Failed to fetch contact messages.");
    }
    setLoading(false);
  }, [filterStatus, toast]);

  useEffect(() => {
    setUser(getStoredUser());
    loadMessages();
  }, [loadMessages]);

  const openDetail = (row: ContactMessage) => {
    setDetailModal({ open: true, message: row });
    setStatusUpdate(row.status);
  };

  const handleSaveStatus = async () => {
    if (!detailModal.message) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/messages/${detailModal.message._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: statusUpdate }),
      });
      if (res.ok) {
        toast("success", "Status Updated", `Message marked as ${statusUpdate}.`);
        await loadMessages();
        setDetailModal({ open: false, message: null });
      } else {
        toast("error", "Update Failed", "Could not update message status.");
      }
    } catch {
      toast("error", "Network Error", "Failed to reach the server.");
    }
    setSaving(false);
  };

  const columns: Column<ContactMessage>[] = [
    {
      key: "name",
      label: "Sender",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0">
            {row.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-white leading-none">{row.name}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      sortable: true,
      render: (row) => (
        <span className="text-[11px] text-neutral-300 truncate max-w-[200px] block">
          {row.subject || "(no subject)"}
        </span>
      ),
    },
    {
      key: "company",
      label: "Company",
      render: (row) => <span className="text-[11px] text-neutral-500">{row.company || "—"}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status || "unread"} />,
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

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="min-h-screen">
      <ToastPortal />
      <AdminTopBar
        title="Contact Messages"
        subtitle={`${messages.length} messages${unreadCount > 0 ? ` • ${unreadCount} unread` : ""}`}
        user={user}
        onSearch={setSearch}
      />

      <div className="p-3.5 sm:p-6">
        {/* Unread Banner */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25"
          >
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] shrink-0" />
            <p className="text-xs text-amber-300 font-semibold">
              {unreadCount} unread message{unreadCount > 1 ? "s" : ""} waiting for your attention
            </p>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {["all", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                filterStatus === s
                  ? "border-primary-500/40 bg-primary-500/15 text-primary-300"
                  : "border-white/[0.07] bg-white/[0.03] text-neutral-500 hover:text-white hover:border-white/[0.12]"
              }`}
            >
              {s === "all" ? "All Messages" : s.charAt(0).toUpperCase() + s.slice(1)}
              {s === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 h-4 min-w-4 px-1 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold inline-flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-neutral-600 font-mono">{messages.length} shown</span>
        </div>

        <DataTable
          columns={columns}
          data={messages}
          keyField="_id"
          pageSize={10}
          loading={loading}
          searchValue={search}
          searchFields={["name", "email", "subject", "company"]}
          emptyMessage="No contact messages found."
          onRowAction={(row, action) => { if (action === "view") openDetail(row); }}
          rowActions={() => [{ label: "Read & Update", action: "view" }]}
        />
      </div>

      {/* Detail / Status Update Modal */}
      <Modal
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false, message: null })}
        title="Message Detail"
        size="lg"
        actions={
          <>
            <Button variant="ghost" onClick={() => setDetailModal({ open: false, message: null })} disabled={saving}>Close</Button>
            <Button variant="primary" onClick={handleSaveStatus} loading={saving}>Update Status</Button>
          </>
        }
      >
        {detailModal.message && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Name", value: detailModal.message.name },
                { label: "Email", value: detailModal.message.email },
                { label: "Company", value: detailModal.message.company || "—" },
                { label: "Subject", value: detailModal.message.subject || "(no subject)" },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-0.5">{f.label}</p>
                  <p className="text-xs text-white font-medium">{f.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1">Message</p>
              <p className="text-xs text-neutral-300 bg-white/[0.03] rounded-xl p-4 border border-white/[0.06] leading-relaxed whitespace-pre-wrap">
                {detailModal.message.message}
              </p>
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block mb-2">Update Status</label>
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
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </Modal>
    </div>
  );
}
