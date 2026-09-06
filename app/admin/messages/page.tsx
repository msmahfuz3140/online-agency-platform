"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { getStoredUser, type UserSession } from "@/lib/auth-client";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToastPortal } from "@/components/ui/useToastPortal";
import { motion, AnimatePresence } from "framer-motion";

import {
  INQUIRY_CATEGORIES,
  getInquiryCategory,
  type InquiryCategoryMeta,
} from "@/lib/inquiry-categories";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface MessageReply {
  _id?: string;
  sender: "admin" | "user";
  senderName: string;
  senderEmail?: string;
  message: string;
  createdAt: string;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  category?: string;
  company?: string;
  phone?: string;
  message: string;
  status: string;
  replies?: MessageReply[];
  createdAt: string;
}

const STATUS_OPTIONS = ["unread", "read", "replied", "archived"];

const QUICK_REPLIES = [
  "Hi! Thanks for reaching out. We've received your request and our team is reviewing it.",
  "We'd love to schedule a brief 15-minute discovery call to discuss this in detail.",
  "Our lead architect has prepared an estimate and will follow up shortly.",
  "Could you share a bit more context regarding your timeline and key milestones?",
];

export default function AdminMessagesPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grouped" | "table">("grouped");
  const [activeThread, setActiveThread] = useState<ContactMessage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  // Category counts computation
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, { total: number; unread: number }> = {};
    for (const cat of INQUIRY_CATEGORIES) {
      counts[cat.id] = { total: 0, unread: 0 };
    }
    for (const msg of messages) {
      const cat = getInquiryCategory(msg.subject, msg.category);
      if (!counts[cat.id]) {
        counts[cat.id] = { total: 0, unread: 0 };
      }
      counts[cat.id].total += 1;
      if (msg.status === "unread") {
        counts[cat.id].unread += 1;
      }
    }
    return counts;
  }, [messages]);

  // Combined Status + Category + Search filtering
  const filteredMessages = React.useMemo(() => {
    return messages.filter((msg) => {
      if (filterStatus !== "all" && msg.status !== filterStatus) return false;
      if (filterCategory !== "all") {
        const cat = getInquiryCategory(msg.subject, msg.category);
        if (cat.id !== filterCategory && cat.name !== filterCategory) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = msg.name?.toLowerCase().includes(q);
        const matchesEmail = msg.email?.toLowerCase().includes(q);
        const matchesSubject = msg.subject?.toLowerCase().includes(q);
        const matchesMsg = msg.message?.toLowerCase().includes(q);
        const cat = getInquiryCategory(msg.subject, msg.category);
        const matchesCat =
          cat.name.toLowerCase().includes(q) ||
          cat.department.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesSubject && !matchesMsg && !matchesCat) {
          return false;
        }
      }
      return true;
    });
  }, [messages, filterStatus, filterCategory, search]);

  // Messenger Reply State
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const chatStreamRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { toast, ToastPortal } = useToastPortal();

  const scrollToBottom = () => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  };

  const loadMessages = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({ limit: "100" });
      if (filterStatus !== "all") params.set("status", filterStatus);

      let res = await fetch(`${API_BASE_URL}/api/admin/messages?${params}`, {
        credentials: "include",
      });

      // Graceful fallback to contact endpoint if session not active in dev
      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/api/contact?${params}`);
      }

      if (res.ok) {
        const json = await res.json();
        const loaded: ContactMessage[] = json.data || [];
        setMessages(loaded);

        // Keep active thread synced if modal is open
        if (activeThread) {
          const fresh = loaded.find((m) => m._id === activeThread._id);
          if (fresh) setActiveThread(fresh);
        }
      }
    } catch {
      toast("error", "Load Error", "Failed to fetch contact messages.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, toast, activeThread]);

  useEffect(() => {
    setUser(getStoredUser());
    loadMessages();
  }, [filterStatus]);

  useEffect(() => {
    if (modalOpen) {
      setTimeout(scrollToBottom, 60);
      textareaRef.current?.focus({ preventScroll: true });
    }
  }, [modalOpen, activeThread?.replies?.length]);

  // Smart polling: when admin has a thread open, re-fetch it every 15s to catch new client replies
  useEffect(() => {
    if (!modalOpen || !activeThread?._id) return;

    const poll = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/admin/messages/${activeThread._id}`,
          { credentials: "include" }
        );
        if (!res.ok) return;
        const json = await res.json();
        if (json.data) {
          setActiveThread(json.data);
          setMessages((prev) =>
            prev.map((m) => (m._id === activeThread._id ? json.data : m))
          );
        }
      } catch {
        // silent — don't alert on polling failures
      }
    };

    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, [modalOpen, activeThread?._id]);

  const openDetail = async (row: ContactMessage) => {
    setActiveThread(row);
    setStatusUpdate(row.status);
    setModalOpen(true);
    setReplyText("");

    // If message was unread, mark as read in backend
    if (row.status === "unread") {
      try {
        await fetch(`${API_BASE_URL}/api/admin/messages/${row._id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: "read" }),
        });
        setMessages((prev) =>
          prev.map((m) => (m._id === row._id ? { ...m, status: "read" } : m))
        );
        setActiveThread((prev) => (prev ? { ...prev, status: "read" } : null));
        setStatusUpdate("read");
      } catch (e) {
        console.warn("Could not mark message as read:", e);
      }
    }

    // Try to fetch latest single thread with all replies
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/messages/${row._id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) setActiveThread(json.data);
      }
    } catch {
      // fallback to already passed row
    }
  };

  const handleSaveStatus = async (newStatus: string) => {
    if (!activeThread) return;
    setSavingStatus(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/messages/${activeThread._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast("success", "Status Updated", `Message marked as ${newStatus}.`);
        setStatusUpdate(newStatus);
        setActiveThread((prev) => (prev ? { ...prev, status: newStatus } : null));
        setMessages((prev) =>
          prev.map((m) => (m._id === activeThread._id ? { ...m, status: newStatus } : m))
        );
      } else {
        toast("error", "Update Failed", "Could not update message status.");
      }
    } catch {
      toast("error", "Network Error", "Failed to reach the server.");
    }
    setSavingStatus(false);
  };

  const handleSendReply = async () => {
    if (!activeThread || !replyText.trim() || sendingReply) return;

    setSendingReply(true);
    const content = replyText.trim();
    const senderName = user?.name || "Admin Support";

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/messages/${activeThread._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: content,
          senderName,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const updatedThread: ContactMessage = json.data || {
          ...activeThread,
          status: "replied",
          replies: [
            ...(activeThread.replies || []),
            {
              sender: "admin",
              senderName,
              senderEmail: user?.email || "support@nexora.agency",
              message: content,
              createdAt: new Date().toISOString(),
            },
          ],
        };

        setActiveThread(updatedThread);
        setStatusUpdate("replied");
        setMessages((prev) =>
          prev.map((m) => (m._id === activeThread._id ? updatedThread : m))
        );
        setReplyText("");
        toast("success", "Reply Sent", `Messenger reply sent to ${activeThread.name}.`);
        setTimeout(scrollToBottom, 100);
      } else {
        // Dev fallback if auth is mock or endpoint differs
        const fallbackRes = await fetch(`${API_BASE_URL}/api/contact/${activeThread._id}/reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            senderName,
            senderEmail: user?.email || "support@nexora.agency",
            sender: "admin",
          }),
        });
        if (fallbackRes.ok) {
          const fbJson = await fallbackRes.json();
          setActiveThread(fbJson.data);
          setStatusUpdate("replied");
          setReplyText("");
          toast("success", "Reply Sent", `Reply sent to ${activeThread.name}.`);
          setTimeout(scrollToBottom, 100);
        } else {
          toast("error", "Reply Failed", "Could not send reply.");
        }
      }
    } catch {
      toast("error", "Network Error", "Failed to send reply to server.");
    } finally {
      setSendingReply(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const columns: Column<ContactMessage>[] = [
    {
      key: "name",
      label: "Sender",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500/20 to-blue-500/20 border border-primary-500/30 flex items-center justify-center text-xs font-bold text-primary-300 shrink-0 shadow-[0_0_10px_rgba(20,184,160,0.15)]">
            {row.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-white leading-none">{row.name}</p>
              {row.replies && row.replies.length > 0 && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-primary-500/15 text-primary-400 border border-primary-500/30 font-mono">
                  {row.replies.length} {row.replies.length === 1 ? "reply" : "replies"}
                </span>
              )}
            </div>
            <p className="text-[10px] text-neutral-400 mt-0.5">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Service Category",
      sortable: true,
      render: (row) => {
        const cat = getInquiryCategory(row.subject, row.category);
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${cat.badgeBg} ${cat.badgeBorder} ${cat.badgeText} whitespace-nowrap`}
          >
            <span>{cat.icon}</span>
            <span>{cat.shortName}</span>
          </span>
        );
      },
    },
    {
      key: "subject",
      label: "Subject & Preview",
      sortable: true,
      render: (row) => (
        <div className="max-w-[260px] truncate">
          <span className="text-xs font-medium text-neutral-200 block truncate">
            {row.subject || "(General Inquiry)"}
          </span>
          <span className="text-[10px] text-neutral-500 block truncate mt-0.5">
            {row.message}
          </span>
        </div>
      ),
    },
    {
      key: "company",
      label: "Company",
      render: (row) => (
        <span className="text-[11px] text-neutral-400">{row.company || "—"}</span>
      ),
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
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="min-h-screen pb-12">
      <ToastPortal />
      <AdminTopBar
        title="Contact Messages & Conversations"
        subtitle={`${messages.length} messages${unreadCount > 0 ? ` • ${unreadCount} unread` : ""}`}
        user={user}
        onSearch={setSearch}
      />

      <div className="p-3.5 sm:p-6 max-w-7xl mx-auto">
        {/* Unread Banner */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] shrink-0 animate-pulse" />
              <p className="text-xs text-amber-200 font-medium">
                <strong className="font-semibold text-white">{unreadCount} unread message{unreadCount > 1 ? "s" : ""}</strong> requiring attention or replies.
              </p>
            </div>
            <button
              onClick={() => setFilterStatus("unread")}
              className="text-[11px] text-amber-300 hover:text-white font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              View Unread →
            </button>
          </motion.div>
        )}

        {/* Category Overview Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-5">
          {INQUIRY_CATEGORIES.map((cat) => {
            const counts = categoryCounts[cat.id] || { total: 0, unread: 0 };
            const isActive = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setFilterCategory(filterCategory === cat.id ? "all" : cat.id)
                }
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer group ${
                  isActive
                    ? "bg-primary-500/15 border-primary-500/60 shadow-[0_0_20px_rgba(20,184,160,0.25)] ring-1 ring-primary-400/30"
                    : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05] hover:border-white/[0.15]"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  {counts.unread > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold animate-pulse border border-amber-400/30">
                      {counts.unread} new
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-white truncate block">
                    {cat.shortName}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">
                    {counts.total} {counts.total === 1 ? "inquiry" : "inquiries"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Bar: Status Filters, Category Selector & View Switcher */}
        <div className="space-y-3 mb-5">
          {/* Top Control Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["all", ...STATUS_OPTIONS].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    filterStatus === s
                      ? "border-primary-500/50 bg-primary-500/15 text-primary-300 shadow-[0_0_14px_rgba(20,184,160,0.25)]"
                      : "border-white/[0.08] bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/[0.15]"
                  }`}
                >
                  {s === "all" ? "All Inquiries" : s.charAt(0).toUpperCase() + s.slice(1)}
                  {s === "unread" && unreadCount > 0 && (
                    <span className="ml-1.5 h-4 min-w-4 px-1 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-bold inline-flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* View Mode Toggle + Refresh Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* View Switcher: Grouped vs Table */}
              <div className="flex items-center bg-white/[0.03] p-0.5 rounded-xl border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setViewMode("grouped")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === "grouped"
                      ? "bg-primary-500/20 text-primary-300 border border-primary-500/40 shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <span>📁</span>
                  <span>By Service</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === "table"
                      ? "bg-primary-500/20 text-primary-300 border border-primary-500/40 shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <span>📋</span>
                  <span>Table View</span>
                </button>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={() => loadMessages()}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-200 hover:text-white px-3 py-1.5 rounded-xl bg-surface-2 border border-border hover:border-primary-500/40 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                title="Refresh messages"
              >
                <span className={loading ? "animate-spin inline-block" : ""}>🔄</span>
                <span className="hidden sm:inline">{loading ? "Refreshing..." : "Refresh"}</span>
              </button>
            </div>
          </div>

          {/* Category Quick Filter Chips (Mobile-friendly horizontal scroll) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <button
              type="button"
              onClick={() => setFilterCategory("all")}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
                filterCategory === "all"
                  ? "bg-primary-500/20 border-primary-500/50 text-primary-300"
                  : "bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:text-white"
              }`}
            >
              All Services ({messages.length})
            </button>
            {INQUIRY_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id]?.total || 0;
              const isSelected = filterCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setFilterCategory(filterCategory === cat.id ? "all" : cat.id)
                  }
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? `${cat.badgeBg} ${cat.badgeBorder} ${cat.badgeText} shadow-sm`
                      : "bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:text-white"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.shortName}</span>
                  <span className="px-1.5 py-0.1 rounded-full bg-white/[0.06] text-[10px] font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic View: Grouped by Category vs Master Table */}
        {viewMode === "grouped" ? (
          /* Grouped by Category Mode ("gatagory wise vag kore diba msg gula") */
          <div className="space-y-8">
            {INQUIRY_CATEGORIES.filter((cat) => {
              if (filterCategory !== "all") {
                return cat.id === filterCategory || cat.name === filterCategory;
              }
              return true;
            }).map((cat) => {
              const catMessages = filteredMessages.filter((m) => {
                const c = getInquiryCategory(m.subject, m.category);
                return c.id === cat.id;
              });

              if (catMessages.length === 0 && filterCategory === "all") {
                return null;
              }

              const unreadInCat = catMessages.filter((m) => m.status === "unread").length;

              return (
                <div key={cat.id} className="space-y-3.5">
                  {/* Category Division Section Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0c1527] via-[#0a1120] to-[#070c17] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-11 w-11 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {cat.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-bold text-sm sm:text-base text-white">
                            {cat.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${cat.badgeBg} ${cat.badgeBorder} ${cat.badgeText}`}
                          >
                            {catMessages.length} {catMessages.length === 1 ? "Inquiry" : "Inquiries"}
                          </span>
                          {unreadInCat > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                              ⚡ {unreadInCat} Unread
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                          <span>Division: <strong className="text-neutral-300">{cat.department}</strong></span>
                          <span className="hidden md:inline"> • {cat.description}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-neutral-500 shrink-0 hidden sm:block">
                      Click any message to open Messenger
                    </div>
                  </div>

                  {/* Inquiry Messages List under this Category */}
                  {catMessages.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center space-y-1 text-xs text-neutral-500">
                      <p className="text-neutral-400 font-medium">No inquiries found in this category.</p>
                      <p className="text-[11px]">Messages sent by clients under {cat.name} will appear here.</p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/[0.08] bg-[#080d19]/90 backdrop-blur-sm divide-y divide-white/[0.06] overflow-hidden shadow-lg">
                      {catMessages.map((msg) => {
                        const replyCount = msg.replies?.length || 0;
                        const lastReply =
                          replyCount > 0 ? msg.replies![replyCount - 1] : null;

                        return (
                          <div
                            key={msg._id}
                            onClick={() => openDetail(msg)}
                            className="group px-4 py-3.5 sm:px-5 sm:py-3.5 bg-[#080d19]/80 hover:bg-white/[0.04] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-4 relative overflow-hidden"
                          >
                            {/* Left: Avatar + Sender Info + Subject & Preview */}
                            <div className="flex items-start md:items-center gap-3.5 min-w-0 flex-1">
                              {/* Avatar */}
                              <div className="relative shrink-0 mt-0.5 md:mt-0">
                                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-blue-500/20 border border-primary-500/30 flex items-center justify-center text-xs sm:text-sm font-bold text-primary-300 shadow-[0_0_10px_rgba(20,184,160,0.15)]">
                                  {msg.name.slice(0, 2).toUpperCase()}
                                </div>
                                {msg.status === "unread" && (
                                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-400 border-2 border-[#080d19] animate-pulse" />
                                )}
                              </div>

                              {/* Details (Name + Email, Subject + Message Preview) */}
                              <div className="min-w-0 flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4 lg:gap-6">
                                {/* Sender Name & Email */}
                                <div className="md:w-44 lg:w-52 shrink-0 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-primary-300 transition-colors truncate">
                                      {msg.name}
                                    </h4>
                                    {msg.company && (
                                      <span className="text-[10px] text-neutral-400 font-mono hidden lg:inline truncate">
                                        ({msg.company})
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-neutral-400 truncate font-mono">
                                    {msg.email}
                                  </p>
                                </div>

                                {/* Subject & Preview */}
                                <div className="min-w-0 flex-1">
                                  <h5 className="text-xs sm:text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors truncate">
                                    {msg.subject || "(General Inquiry)"}
                                  </h5>
                                  <p className="text-[11px] sm:text-xs text-neutral-400 truncate mt-0.5 leading-normal">
                                    {lastReply ? (
                                      <>
                                        <span
                                          className={
                                            lastReply.sender === "admin"
                                              ? "text-primary-300 font-semibold"
                                              : "text-amber-300 font-semibold"
                                          }
                                        >
                                          {lastReply.sender === "admin" ? "Admin: " : "Client: "}
                                        </span>
                                        <span className="text-neutral-300">{lastReply.message}</span>
                                      </>
                                    ) : (
                                      <span>{msg.message}</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Right: Meta (Status, Reply Count, Date, Action) */}
                            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
                              <div className="flex items-center gap-2">
                                {replyCount > 0 && (
                                  <span className="px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-300 border border-primary-500/25 font-mono text-[10px] font-semibold flex items-center gap-1">
                                    <span>💬</span>
                                    <span>{replyCount}</span>
                                  </span>
                                )}
                                <StatusBadge status={msg.status || "unread"} />
                              </div>

                              <div className="flex items-center gap-2.5">
                                <span className="text-[10px] sm:text-xs font-mono text-neutral-400 shrink-0">
                                  {new Date(msg.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                                <span className="text-xs text-primary-400 font-semibold flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                                  <span className="hidden lg:inline">Open</span>
                                  <span>→</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredMessages.length === 0 && (
              <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/[0.06] text-center space-y-3">
                <div className="text-3xl">📬</div>
                <h4 className="text-sm font-bold text-white">No contact messages found</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Try adjusting your category or status filters to view other inquiries.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilterCategory("all");
                    setFilterStatus("all");
                  }}
                  className="px-4 py-2 rounded-xl bg-primary-500/15 text-primary-300 border border-primary-500/30 text-xs font-semibold hover:bg-primary-500/25 transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Master Table View with Click Anywhere on Row */
          <div className="overflow-x-auto [scrollbar-width:thin] rounded-2xl border border-white/[0.08] bg-[#080d19]">
            <DataTable
              columns={columns}
              data={filteredMessages}
              keyField="_id"
              pageSize={10}
              loading={loading}
              searchValue={search}
              searchFields={["name", "email", "subject", "company", "message"]}
              emptyMessage="No contact messages match your active category and status filters."
              onRowClick={(row) => openDetail(row)}
              onRowAction={(row, action) => {
                if (action === "reply") openDetail(row);
              }}
              rowActions={() => [
                { label: "💬 Open Messenger", action: "reply" },
              ]}
            />
          </div>
        )}
      </div>

      {/* Messenger-Style Conversation Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setActiveThread(null);
        }}
        hideHeader
        noPadding
        size="xl"
      >
        {activeThread && (
          <div className="flex flex-col h-full sm:h-[85vh] max-h-[100dvh] sm:max-h-[780px] w-full overflow-hidden bg-[#0a101d]">
            {/* Service Category & Division Header Banner */}
            {(() => {
              const cat = getInquiryCategory(activeThread.subject, activeThread.category);
              return (
                <div className="px-3 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-primary-500/15 via-[#0c1527] to-[#09101d] border-b border-white/[0.08] flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base sm:text-lg shrink-0">{cat.icon}</span>
                    <span className="font-bold text-xs sm:text-sm text-white truncate">
                      {cat.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 font-mono border border-primary-500/30 hidden sm:inline-block">
                      {cat.department}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="hidden xs:inline">Live Channel</span>
                  </span>
                </div>
              );
            })()}

            {/* Messenger Header */}
            <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-white/[0.08] bg-[#0c1424] flex items-center justify-between gap-2 sm:gap-3 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                {/* Client Avatar */}
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-slate-500 to-slate-400 flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-md shrink-0">
                  {activeThread.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight truncate max-w-[110px] xs:max-w-[160px] sm:max-w-none">
                      {activeThread.name}
                    </h3>
                    <span className="text-[8px] sm:text-[9px] px-1.5 py-0.1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30 font-mono">
                      CLIENT
                    </span>
                    <StatusBadge status={activeThread.status || "unread"} />
                    {activeThread.company && (
                      <span className="text-[9px] px-1.5 py-0.1 rounded-full bg-white/[0.06] text-neutral-300 border border-white/[0.08] font-mono hidden md:inline truncate">
                        🏢 {activeThread.company}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 truncate">
                    <span className="truncate">{activeThread.email}</span>
                    {activeThread.phone && (
                      <span className="hidden sm:inline font-mono">• {activeThread.phone}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Quick Changer & Close Button */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-neutral-400 uppercase font-mono hidden lg:inline">Status:</span>
                  <select
                    value={statusUpdate}
                    onChange={(e) => handleSaveStatus(e.target.value)}
                    disabled={savingStatus}
                    className="bg-surface-2 text-white text-[11px] sm:text-xs rounded-lg sm:rounded-xl px-1.5 py-1 sm:px-2.5 sm:py-1.5 border border-white/[0.12] focus:border-primary-500 outline-none cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0b1220] text-white">
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setActiveThread(null);
                  }}
                  className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Admin Identity Strip — shows who is replying */}
            <div className="px-3 sm:px-5 py-1.5 sm:py-2 bg-primary-500/10 border-b border-primary-500/20 text-[10px] sm:text-[11px] flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-black font-bold text-[8px] sm:text-[9px] shrink-0">
                  {(user?.name || "AD").slice(0, 2).toUpperCase()}
                </div>
                <span className="text-primary-300 font-semibold truncate">
                  Replying as: <strong className="text-white">{user?.name || "Admin Support"}</strong>
                </span>
                <span className="hidden sm:inline text-[9px] px-1.5 py-0.1 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 font-mono">ADMIN</span>
              </div>
              <span className="text-neutral-400 font-mono text-[9px] sm:text-[10px] truncate shrink-0 max-w-[40%] sm:max-w-none">
                {activeThread.subject || "General Inquiry"}
              </span>
            </div>

            {/* Conversation Stream (Scrollable Container) */}
            <div ref={chatStreamRef} className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 space-y-3.5 sm:space-y-4 [scrollbar-width:thin]">
              {/* Initial Message from Client — always on LEFT (client = left in admin view) */}
              <div className="flex flex-col items-start max-w-[92%] sm:max-w-[80%] md:max-w-[75%]">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 pl-1 flex-wrap">
                  <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-[8px] sm:text-[9px] shrink-0">
                    {activeThread.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-300">{activeThread.name}</span>
                  <span className="text-[8px] sm:text-[9px] px-1.5 py-0.1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30 font-mono">
                    CLIENT
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-neutral-400">
                    {new Date(activeThread.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#131b2e] border border-white/[0.08] text-neutral-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
                  {activeThread.message}
                </div>
              </div>

              {/* Thread Replies */}
              {activeThread.replies && activeThread.replies.length > 0 && (
                <div className="space-y-3.5 sm:space-y-4 pt-1 sm:pt-2">
                  <div className="flex items-center justify-center my-2">
                    <span className="h-[1px] bg-white/[0.06] flex-1" />
                    <span className="px-3 text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      Conversation History
                    </span>
                    <span className="h-[1px] bg-white/[0.06] flex-1" />
                  </div>

                  {activeThread.replies.map((reply, idx) => {
                    // In admin view: client messages go LEFT, admin messages go RIGHT
                    const isAdmin = reply.sender === "admin";
                    return (
                      <motion.div
                        key={reply._id || idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${
                          isAdmin ? "items-end ml-auto" : "items-start"
                        } max-w-[92%] sm:max-w-[80%] md:max-w-[75%]`}
                      >
                        <div
                          className={`flex items-center gap-1.5 sm:gap-2 mb-1 ${
                            isAdmin ? "pr-1 flex-row-reverse" : "pl-1"
                          } flex-wrap`}
                        >
                          {/* Sender Avatar */}
                          <div
                            className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full flex items-center justify-center font-bold text-[8px] sm:text-[9px] shrink-0 ${
                              isAdmin
                                ? "bg-gradient-to-br from-primary-400 to-teal-400 text-black shadow-[0_0_8px_rgba(20,184,160,0.4)]"
                                : "bg-slate-600 text-white"
                            }`}
                          >
                            {(reply.senderName || (isAdmin ? user?.name || "AD" : activeThread.name))
                              .slice(0, 1)
                              .toUpperCase()}
                          </div>

                          <span
                            className={`text-[10px] sm:text-[11px] font-semibold ${
                              isAdmin ? "text-primary-300" : "text-neutral-300"
                            }`}
                          >
                            {isAdmin
                              ? reply.senderName || user?.name || "Admin Support"
                              : reply.senderName || activeThread.name}
                          </span>

                          <span
                            className={`text-[8px] sm:text-[9px] px-1.5 py-0.1 rounded-full font-mono ${
                              isAdmin
                                ? "bg-primary-500/20 text-primary-300 border border-primary-500/30"
                                : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                            }`}
                          >
                            {isAdmin ? "YOU (Admin)" : "CLIENT"}
                          </span>

                          <span className="text-[9px] sm:text-[10px] text-neutral-400">
                            {new Date(reply.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div
                          className={`rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-md ${
                            isAdmin
                              ? "rounded-tr-sm bg-gradient-to-r from-primary-600 to-teal-500 text-white font-normal shadow-[0_4px_16px_rgba(20,184,160,0.25)]"
                              : "rounded-tl-sm bg-[#131b2e] border border-white/[0.08] text-neutral-200"
                          }`}
                        >
                          {reply.message}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Reply Suggestions */}
            <div className="px-3 sm:px-4 py-1.5 bg-[#090f1d] border-t border-white/[0.06] overflow-x-auto flex items-center gap-1.5 sm:gap-2 shrink-0 [scrollbar-width:none]">
              <span className="text-[10px] text-neutral-400 font-mono shrink-0 hidden sm:inline">Quick reply:</span>
              {QUICK_REPLIES.map((text, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setReplyText(text);
                    textareaRef.current?.focus({ preventScroll: true });
                  }}
                  className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-primary-500/30 text-neutral-300 hover:text-white transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {text.length > 32 ? text.slice(0, 32) + "…" : text}
                </button>
              ))}
            </div>

            {/* Reply Input Bar — Admin sending to Client */}
            <div className="p-2.5 sm:p-4 bg-[#0c1424] border-t border-primary-500/20 flex items-end gap-2 sm:gap-2.5 shrink-0">
              {/* Admin Avatar in input area - visible on sm+ screens */}
              <div className="hidden sm:flex h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 items-center justify-center font-bold text-black text-[10px] shrink-0 shadow-[0_0_12px_rgba(20,184,160,0.4)] mb-0.5">
                {(user?.name || "AD").slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 relative rounded-xl sm:rounded-2xl bg-white/[0.04] border border-primary-500/20 focus-within:border-primary-500/60 focus-within:bg-white/[0.06] transition-all">
                <textarea
                  ref={textareaRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Reply as ${user?.name || "Admin"}... (Enter to send)`}
                  rows={2}
                  className="w-full bg-transparent text-white text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 outline-none resize-none placeholder:text-neutral-400 leading-relaxed"
                />
              </div>

              <Button
                variant="primary"
                onClick={handleSendReply}
                loading={sendingReply}
                disabled={!replyText.trim() || sendingReply}
                className="h-10 sm:h-11 px-3.5 sm:px-5 rounded-xl shadow-[0_0_20px_rgba(20,184,160,0.35)] shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <span>Send</span>
                <span className="text-sm sm:text-base">🚀</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
