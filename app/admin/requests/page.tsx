"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getStoredUser, type UserSession } from "@/lib/auth-client";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToastPortal } from "@/components/ui/useToastPortal";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface LeadEngineer {
  name: string;
  role: string;
  avatar: string;
}

export interface Deliverable {
  id: string;
  title: string;
  completed: boolean;
}

export interface SprintUpdate {
  id: string;
  title: string;
  note: string;
  date: string;
  postedBy: string;
}

export interface ClientReview {
  rating: number;
  feedback: string;
  approved: boolean;
  submittedAt?: string;
}

export interface ProjectRequest {
  _id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  clientId?: string;
  projectTitle: string;
  projectType: string;
  budget: string;
  timeline: string;
  status: string;
  progress?: number;
  leadEngineer?: LeadEngineer;
  sprintPhase?: string;
  targetLaunch?: string;
  stagingUrl?: string;
  deliverables?: Deliverable[];
  updates?: SprintUpdate[];
  review?: ClientReview;
  requirements?: string;
  referenceUrls?: string[];
  attachments?: Array<{ url: string; name: string; size?: number; format?: string; publicId?: string }>;
  techStack?: string[];
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

const PRESET_ENGINEERS: LeadEngineer[] = [
  { name: "MD Mahfuzul Haque", role: "Founder & Lead Architect", avatar: "MH" },
  { name: "Saif Khan", role: "Lead Systems Architect", avatar: "SK" },
  { name: "Jahidul Islam", role: "Technical Project Lead", avatar: "JI" },
  { name: "Ayesha Siddiqa", role: "Senior UI/UX & Frontend Lead", avatar: "AS" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", desc: "Intake queue", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { value: "reviewing", label: "Reviewing", desc: "Scoping & architecture", color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
  { value: "in-progress", label: "In Progress", desc: "Active engineering sprint", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { value: "review-ready", label: "Review Ready", desc: "Ready for client QA & review", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  { value: "completed", label: "Completed", desc: "Deployed & live", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { value: "cancelled", label: "Cancelled", desc: "Archived or withdrawn", color: "text-red-400 border-red-500/30 bg-red-500/10" },
];

type ModalTab = "overview" | "sprint" | "deliverables" | "milestones" | "review";

export default function AdminRequestsPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal State
  const [detailModal, setDetailModal] = useState<{ open: boolean; request: ProjectRequest | null }>({
    open: false,
    request: null,
  });
  const [activeTab, setActiveTab] = useState<ModalTab>("overview");
  const [saving, setSaving] = useState(false);

  // Form Fields for Sprint Workspace
  const [statusUpdate, setStatusUpdate] = useState("pending");
  const [progressUpdate, setProgressUpdate] = useState(0);
  const [leadEngineerUpdate, setLeadEngineerUpdate] = useState<LeadEngineer>(PRESET_ENGINEERS[0]);
  const [sprintPhaseUpdate, setSprintPhaseUpdate] = useState("");
  const [targetLaunchUpdate, setTargetLaunchUpdate] = useState("");
  const [stagingUrlUpdate, setStagingUrlUpdate] = useState("");
  const [deliverablesUpdate, setDeliverablesUpdate] = useState<Deliverable[]>([]);
  const [newDeliverableTitle, setNewDeliverableTitle] = useState("");
  const [adminNotesUpdate, setAdminNotesUpdate] = useState("");

  // New Milestone Update
  const [newUpdateTitle, setNewUpdateTitle] = useState("");
  const [newUpdateNote, setNewUpdateNote] = useState("");

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
    setActiveTab("overview");
    setStatusUpdate(row.status || "pending");
    setProgressUpdate(typeof row.progress === "number" ? row.progress : 0);
    setLeadEngineerUpdate(row.leadEngineer || PRESET_ENGINEERS[0]);
    setSprintPhaseUpdate(row.sprintPhase || "Phase 1: Discovery & Architecture");
    setTargetLaunchUpdate(row.targetLaunch || "To be confirmed");
    setStagingUrlUpdate(row.stagingUrl || "");
    setDeliverablesUpdate(row.deliverables && row.deliverables.length > 0 ? [...row.deliverables] : [
      { id: "del_1", title: "Technical Architecture & System Design", completed: false },
      { id: "del_2", title: "Figma UI/UX & Responsive Prototype", completed: false },
      { id: "del_3", title: "Full-Stack Implementation & API Integration", completed: false },
      { id: "del_4", title: "Client Staging Deployment & QA", completed: false },
    ]);
    setAdminNotesUpdate(row.adminNotes || "");
    setNewDeliverableTitle("");
    setNewUpdateTitle("");
    setNewUpdateNote("");
  };

  const handleToggleDeliverable = (id: string) => {
    setDeliverablesUpdate((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
    );
  };

  const handleAddDeliverable = () => {
    if (!newDeliverableTitle.trim()) return;
    const newItem: Deliverable = {
      id: `del_${Date.now()}`,
      title: newDeliverableTitle.trim(),
      completed: false,
    };
    setDeliverablesUpdate((prev) => [...prev, newItem]);
    setNewDeliverableTitle("");
  };

  const handleRemoveDeliverable = (id: string) => {
    setDeliverablesUpdate((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAutoCalcProgress = () => {
    if (deliverablesUpdate.length === 0) return;
    const completedCount = deliverablesUpdate.filter((d) => d.completed).length;
    const pct = Math.round((completedCount / deliverablesUpdate.length) * 100);
    setProgressUpdate(pct);
    toast("info", "Progress Calculated", `Progress adjusted to ${pct}% based on deliverables.`);
  };

  const handleSaveSprint = async () => {
    if (!detailModal.request) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        status: statusUpdate,
        progress: progressUpdate,
        leadEngineer: leadEngineerUpdate,
        sprintPhase: sprintPhaseUpdate,
        targetLaunch: targetLaunchUpdate,
        stagingUrl: stagingUrlUpdate,
        deliverables: deliverablesUpdate,
        adminNotes: adminNotesUpdate,
      };

      if (newUpdateTitle.trim() && newUpdateNote.trim()) {
        payload.newUpdate = {
          title: newUpdateTitle.trim(),
          note: newUpdateNote.trim(),
        };
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/requests/${detailModal.request._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        toast("success", "Sprint Updated", "Project sprint details successfully saved & synced.");
        await loadRequests();
        if (json.data) {
          setDetailModal((prev) => ({ ...prev, request: json.data }));
          setNewUpdateTitle("");
          setNewUpdateNote("");
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast("error", "Update Failed", errJson.message || "Could not update project sprint.");
      }
    } catch {
      toast("error", "Network Error", "Failed to reach backend server.");
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
          <p className="text-[10px] text-neutral-400 mt-0.5">{row.clientEmail}</p>
          {row.clientCompany && (
            <span className="inline-block text-[9px] font-mono text-primary-400 mt-0.5 bg-primary-500/10 px-1 rounded">
              {row.clientCompany}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "projectTitle",
      label: "Project Brief",
      sortable: true,
      render: (row) => (
        <div className="max-w-[190px]">
          <p className="text-[11px] font-semibold text-white truncate" title={row.projectTitle}>
            {row.projectTitle || "Untitled Brief"}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-neutral-400 capitalize">{row.projectType?.replace("-", " ")}</span>
            {row.attachments && row.attachments.length > 0 && (
              <span className="text-[9px] font-mono text-primary-300 bg-primary-500/15 border border-primary-500/25 px-1 py-0.2 rounded" title={`${row.attachments.length} attachment(s)`}>
                📎 {row.attachments.length}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "progress",
      label: "Sprint Delivery",
      sortable: true,
      render: (row) => {
        const pct = typeof row.progress === "number" ? row.progress : 0;
        return (
          <div className="w-28 sm:w-32">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="text-neutral-400">{pct}%</span>
              <span className="text-[9px] text-primary-400 truncate max-w-[65px]">{row.leadEngineer?.avatar || "N/A"}</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  pct === 100
                    ? "bg-emerald-400"
                    : pct >= 60
                    ? "bg-primary-400"
                    : "bg-amber-400"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status || "pending"} />,
    },
    {
      key: "review",
      label: "Client Review",
      render: (row) => {
        if (row.review && row.review.rating) {
          return (
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 text-xs">{"★".repeat(row.review.rating)}</span>
              <span className="text-[10px] font-mono text-amber-300 font-semibold">{row.review.rating}/5</span>
              {row.review.approved && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
                  ✓
                </span>
              )}
            </div>
          );
        }
        return <span className="text-[10px] text-neutral-500 font-mono">—</span>;
      },
    },
    {
      key: "budget",
      label: "Budget",
      render: (row) => (
        <div>
          <span className="text-[11px] text-amber-400 font-mono font-semibold">{row.budget}</span>
          <p className="text-[9px] text-neutral-400">{row.timeline}</p>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (row) => (
        <span className="text-[10px] text-neutral-400 whitespace-nowrap">
          {new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <ToastPortal />
      <AdminTopBar
        title="Project Requests & Sprint Manager"
        subtitle={`${requests.length} client briefs in pipeline`}
        user={user}
        onSearch={setSearch}
      />

      <div className="p-3.5 sm:p-6 space-y-4">
        {/* Status Filters Bar & Action Controls */}
        <div className="flex items-center justify-between gap-3 flex-wrap pb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                filterStatus === "all"
                  ? "border-primary-500/40 bg-primary-500/15 text-primary-300 shadow-[0_0_12px_rgba(20,184,160,0.15)]"
                  : "border-white/[0.07] bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/[0.12]"
              }`}
            >
              All Requests ({requests.length})
            </button>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setFilterStatus(s.value)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterStatus === s.value
                    ? "border-primary-500/40 bg-primary-500/15 text-primary-300 shadow-[0_0_12px_rgba(20,184,160,0.15)]"
                    : "border-white/[0.07] bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/[0.12]"
                }`}
              >
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={async () => {
                await loadRequests();
                toast("info", "Pipeline Synced ↻", "Latest project briefs reloaded from database.");
              }}
              disabled={loading}
              title="Refresh project requests"
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-200 hover:text-white px-3.5 py-1.5 rounded-xl bg-surface-2/80 border border-border hover:border-primary-500/40 hover:bg-surface-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <span className={`text-xs ${loading ? "animate-spin inline-block" : ""}`}>🔄</span>
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button>

            <span className="text-[11px] text-neutral-400 font-mono hidden md:inline">
              Active Workspace: Nexora CST Core
            </span>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={requests}
          keyField="_id"
          pageSize={10}
          loading={loading}
          searchValue={search}
          searchFields={["clientName", "clientEmail", "projectTitle", "projectType", "clientCompany"]}
          emptyMessage="No project requests found in database."
          onRowAction={(row, action) => {
            if (action === "manage") openDetail(row);
          }}
          rowActions={() => [{ label: "Manage Sprint ⚡", action: "manage" }]}
        />
      </div>

      {/* Project Sprint Workspace Modal */}
      <Modal
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false, request: null })}
        title="Project Sprint & Delivery Workspace"
        description={detailModal.request ? `${detailModal.request.projectTitle} • Client: ${detailModal.request.clientName}` : ""}
        size="xl"
        actions={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Realtime Sprint Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setDetailModal({ open: false, request: null })}
                disabled={saving}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveSprint}
                loading={saving}
                className="shadow-[0_0_20px_rgba(20,184,160,0.3)]"
              >
                Save &amp; Sync Sprint
              </Button>
            </div>
          </div>
        }
      >
        {detailModal.request && (
          <div className="space-y-4">
            {/* Modal Tabs Header */}
            <div className="flex items-center gap-1.5 border-b border-white/[0.08] pb-2 overflow-x-auto scrollbar-none">
              {[
                { id: "overview", label: "Overview & Brief", icon: "📋" },
                { id: "sprint", label: "Sprint Engine", icon: "⚡" },
                {
                  id: "deliverables",
                  label: `Deliverables (${deliverablesUpdate.filter((d) => d.completed).length}/${deliverablesUpdate.length})`,
                  icon: "✅",
                },
                {
                  id: "milestones",
                  label: `Milestones (${detailModal.request.updates?.length || 0})`,
                  icon: "🧭",
                },
                {
                  id: "review",
                  label: detailModal.request.review?.rating ? `Client Review (${detailModal.request.review.rating}★)` : "Client Review",
                  icon: "⭐",
                },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as ModalTab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    activeTab === t.id
                      ? "bg-primary-500/20 border border-primary-500/40 text-primary-300 font-semibold shadow-[0_0_12px_rgba(20,184,160,0.15)]"
                      : "bg-white/[0.03] border border-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW & BRIEF */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">Client Name</span>
                    <p className="text-xs font-semibold text-white mt-1">{detailModal.request.clientName}</p>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{detailModal.request.clientEmail}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">Company / Org</span>
                    <p className="text-xs font-semibold text-white mt-1">{detailModal.request.clientCompany || "Independent / Individual"}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Phone: {detailModal.request.clientPhone || "Not provided"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">Budget &amp; Schedule</span>
                    <p className="text-xs font-bold text-amber-400 font-mono mt-1">{detailModal.request.budget}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Target: {detailModal.request.timeline}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">Project Specification</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-300 border border-primary-500/20 font-mono capitalize">
                      {detailModal.request.projectType}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{detailModal.request.projectTitle}</h4>
                  {detailModal.request.requirements && (
                    <div className="text-xs text-neutral-300 bg-black/40 p-3 rounded-xl border border-white/[0.05] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {detailModal.request.requirements}
                    </div>
                  )}
                </div>

                {detailModal.request.referenceUrls && detailModal.request.referenceUrls.length > 0 && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider block mb-2">Reference Inspo Links</span>
                    <div className="flex flex-wrap gap-2">
                      {detailModal.request.referenceUrls.map((url, i) => (
                        <a
                          key={i}
                          href={url.startsWith("http") ? url : `https://${url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary-400 hover:text-primary-300 underline font-mono flex items-center gap-1 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.06]"
                        >
                          <span>🔗</span> {url} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Uploaded Attachments & Documents */}
                {detailModal.request.attachments && detailModal.request.attachments.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                        <span>📎</span> Attached Documents &amp; Brief Files ({detailModal.request.attachments.length})
                      </span>
                      <span className="text-[10px] font-mono text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/20">
                        Cloud CDN Encrypted
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {detailModal.request.attachments.map((att, idx) => {
                        const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(att.url) || att.format === "image";
                        const isPdf = /\.pdf$/i.test(att.url) || att.format === "pdf";
                        return (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-3 hover:border-white/20 transition-all"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {isImage ? (
                                <div className="w-9 h-9 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                                </div>
                              ) : isPdf ? (
                                <div className="w-9 h-9 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                                  PDF
                                </div>
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                                  DOC
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate max-w-[150px] sm:max-w-[200px]" title={att.name}>
                                  {att.name}
                                </p>
                                {att.size ? (
                                  <p className="text-[10px] text-neutral-400 font-mono">
                                    {(att.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                ) : null}
                              </div>
                            </div>

                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-primary-300 hover:text-white text-xs font-medium flex items-center gap-1 shrink-0 transition-all"
                            >
                              <span>View</span>
                              <span>↗</span>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block mb-1">Internal Staff Notes</label>
                  <textarea
                    value={adminNotesUpdate}
                    onChange={(e) => setAdminNotesUpdate(e.target.value)}
                    placeholder="Private notes for agency leads (not visible to client)..."
                    rows={2}
                    className="w-full px-3 py-2 text-xs text-white bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-primary-500/40 placeholder:text-neutral-600 resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* TAB 2: SPRINT ENGINE */}
            {activeTab === "sprint" && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Status Selection */}
                <div>
                  <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block mb-2">
                    Project Pipeline Status
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStatusUpdate(opt.value)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          statusUpdate === opt.value
                            ? "border-primary-500/50 bg-primary-500/20 text-white shadow-[0_0_15px_rgba(20,184,160,0.2)]"
                            : "border-white/[0.06] bg-white/[0.02] text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{opt.label}</span>
                          {statusUpdate === opt.value && <span className="text-primary-400 text-xs">●</span>}
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Control */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-white">Sprint Completion Progress</label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold font-mono text-primary-400">{progressUpdate}%</span>
                      <button
                        type="button"
                        onClick={handleAutoCalcProgress}
                        className="text-[10px] px-2 py-1 rounded bg-white/[0.06] border border-white/[0.08] text-neutral-300 hover:text-white cursor-pointer"
                        title="Calculate percentage from completed deliverables"
                      >
                        Auto-calc from checklist ⚡
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={progressUpdate}
                    onChange={(e) => setProgressUpdate(Number(e.target.value))}
                    className="w-full accent-primary-500 cursor-pointer"
                  />

                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    {[0, 25, 50, 75, 90, 100].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setProgressUpdate(step)}
                        className={`text-[10px] px-2 py-1 rounded-lg border font-mono transition-all ${
                          progressUpdate === step
                            ? "bg-primary-500/20 border-primary-500/40 text-primary-300 font-bold"
                            : "bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:text-white"
                        }`}
                      >
                        {step}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sprint Phase & Target Launch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block mb-1">
                      Current Sprint Phase
                    </label>
                    <input
                      type="text"
                      value={sprintPhaseUpdate}
                      onChange={(e) => setSprintPhaseUpdate(e.target.value)}
                      placeholder="e.g. Phase 3: Better Auth & Cloudinary CDN"
                      className="w-full px-3 py-2 text-xs text-white bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-primary-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block mb-1">
                      Target Launch Date
                    </label>
                    <input
                      type="text"
                      value={targetLaunchUpdate}
                      onChange={(e) => setTargetLaunchUpdate(e.target.value)}
                      placeholder="e.g. September 25, 2026"
                      className="w-full px-3 py-2 text-xs text-white bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-primary-500/40"
                    />
                  </div>
                </div>

                {/* Staging URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                      Staging / Preview Demo URL
                    </label>
                    {stagingUrlUpdate && (
                      <a
                        href={stagingUrlUpdate.startsWith("http") ? stagingUrlUpdate : `https://${stagingUrlUpdate}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-primary-400 hover:text-primary-300 underline font-mono"
                      >
                        Test Preview ↗
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={stagingUrlUpdate}
                    onChange={(e) => setStagingUrlUpdate(e.target.value)}
                    placeholder="https://staging.nexora.agency/client-preview"
                    className="w-full px-3 py-2 text-xs text-white bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-primary-500/40 font-mono"
                  />
                </div>

                {/* Lead Engineer Assignment */}
                <div>
                  <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block mb-1.5">
                    Assigned Lead Engineer
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_ENGINEERS.map((eng) => (
                      <button
                        key={eng.name}
                        type="button"
                        onClick={() => setLeadEngineerUpdate(eng)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          leadEngineerUpdate.name === eng.name
                            ? "bg-primary-500/15 border-primary-500/40 text-white shadow-[0_0_12px_rgba(20,184,160,0.15)]"
                            : "bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-lg bg-white/[0.08] flex items-center justify-center font-bold text-[10px] text-primary-300 font-mono">
                            {eng.avatar}
                          </span>
                          <span className="text-[11px] font-semibold truncate text-white">{eng.name}</span>
                        </div>
                        <p className="text-[9px] text-neutral-400 mt-1 truncate">{eng.role}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: DELIVERABLES CHECKLIST */}
            {activeTab === "deliverables" && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h4 className="text-xs font-bold text-white">Sprint Deliverables Checklist</h4>
                    <p className="text-[10px] text-neutral-400">
                      Client inspects these live on their dashboard pipeline tracker.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoCalcProgress}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-primary-500/15 border border-primary-500/30 text-primary-300 hover:bg-primary-500/25 transition-all font-mono"
                  >
                    Auto-sync Progress ({progressUpdate}%)
                  </button>
                </div>

                {/* Add new item */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newDeliverableTitle}
                    onChange={(e) => setNewDeliverableTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddDeliverable();
                      }
                    }}
                    placeholder="Enter milestone deliverable (e.g., Stripe Checkout integration)..."
                    className="flex-1 px-3 py-2 text-xs text-white bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-primary-500/40"
                  />
                  <Button variant="secondary" size="sm" onClick={handleAddDeliverable}>
                    + Add Item
                  </Button>
                </div>

                {/* List */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {deliverablesUpdate.length === 0 ? (
                    <p className="text-xs text-neutral-500 py-4 text-center">No deliverables defined yet.</p>
                  ) : (
                    deliverablesUpdate.map((deliv) => (
                      <div
                        key={deliv.id}
                        className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border transition-all ${
                          deliv.completed
                            ? "bg-emerald-500/[0.06] border-emerald-500/20"
                            : "bg-white/[0.02] border-white/[0.06]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleDeliverable(deliv.id)}
                          className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
                        >
                          <span
                            className={`h-5 w-5 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                              deliv.completed
                                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                                : "bg-white/[0.05] border border-white/[0.1] text-neutral-500"
                            }`}
                          >
                            {deliv.completed ? "✓" : "○"}
                          </span>
                          <span
                            className={`text-xs ${
                              deliv.completed ? "text-neutral-200 line-through opacity-80" : "text-white"
                            }`}
                          >
                            {deliv.title}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDeliverable(deliv.id)}
                          className="text-neutral-500 hover:text-red-400 text-xs px-2 py-1 rounded transition-colors"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 4: MILESTONE LOGS */}
            {activeTab === "milestones" && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Add new milestone update */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>📢</span> Publish New Sprint Milestone Log
                  </h4>
                  <input
                    type="text"
                    value={newUpdateTitle}
                    onChange={(e) => setNewUpdateTitle(e.target.value)}
                    placeholder="Milestone headline (e.g., Phase 2: Core Database & Better Auth Deployed)"
                    className="w-full px-3 py-2 text-xs text-white bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-primary-500/40"
                  />
                  <textarea
                    value={newUpdateNote}
                    onChange={(e) => setNewUpdateNote(e.target.value)}
                    placeholder="Details about what was completed, verified test suite, or next objectives..."
                    rows={2}
                    className="w-full px-3 py-2 text-xs text-white bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-primary-500/40 resize-none"
                  />
                  <p className="text-[10px] text-neutral-400">
                    * This update will be published to the client timeline when you click &quot;Save &amp; Sync Sprint&quot;.
                  </p>
                </div>

                {/* Feed of updates */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {detailModal.request.updates && detailModal.request.updates.length > 0 ? (
                    detailModal.request.updates.map((upd, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{upd.title}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {new Date(upd.date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">{upd.note}</p>
                        <span className="inline-block text-[9px] text-primary-400 font-mono mt-1">
                          By: {upd.postedBy || "Lead Architect"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-500 text-center py-4">No milestone logs recorded yet.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 5: CLIENT REVIEW */}
            {activeTab === "review" && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {detailModal.request.review && detailModal.request.review.rating ? (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl text-amber-400 font-bold">
                          {"★".repeat(detailModal.request.review.rating)}
                        </div>
                        <span className="text-lg font-bold text-amber-300 font-mono">
                          {detailModal.request.review.rating} / 5.0
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border font-mono ${
                          detailModal.request.review.approved
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : "bg-amber-500/20 border-amber-500/40 text-amber-300"
                        }`}
                      >
                        {detailModal.request.review.approved ? "✓ Approved by Client" : "Feedback Pending"}
                      </span>
                    </div>

                    <div className="bg-black/40 rounded-xl p-3.5 border border-white/[0.08]">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider block mb-1">
                        Client Review Feedback
                      </span>
                      <p className="text-xs text-neutral-200 italic leading-relaxed">
                        &quot;{detailModal.request.review.feedback || "No written comments provided."}&quot;
                      </p>
                    </div>

                    {detailModal.request.review.submittedAt && (
                      <p className="text-[10px] text-neutral-400 font-mono">
                        Submitted: {new Date(detailModal.request.review.submittedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <span className="text-3xl">⭐</span>
                    <h4 className="text-sm font-bold text-white">No Client Review Yet</h4>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto">
                      Once this project reaches the <strong>Review Ready</strong> status, the client can test the staging preview and submit their star rating, feedback, and final delivery approval from their dashboard.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
