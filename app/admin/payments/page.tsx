"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getStoredUser, type UserSession } from "@/lib/auth-client";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://online-agency-platform-backend.vercel.app";

interface PaymentItem {
  _id: string;
  userId?: string;
  clientName: string;
  clientEmail: string;
  plan: "free" | "pro" | "business";
  amount: number;
  currency: "usd" | "bdt";
  method: "stripe" | "bkash" | "nagad";
  status: "pending" | "completed" | "failed" | "refunded" | "awaiting_confirmation";
  transactionId?: string;
  senderMobileNumber?: string;
  screenshotUrl?: string;
  screenshotNote?: string;
  adminConfirmed?: boolean;
  adminNotes?: string;
  createdAt: string;
}

interface PaymentStats {
  total: number;
  awaiting: number;
  completed: number;
  failed: number;
  totalRevenueBDT: number;
  totalRevenueUSD: number;
}

export default function AdminPaymentsPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    total: 0,
    awaiting: 0,
    completed: 0,
    failed: 0,
    totalRevenueBDT: 0,
    totalRevenueUSD: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "awaiting" | "completed" | "failed">("awaiting");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [rejectModalPayment, setRejectModalPayment] = useState<PaymentItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setUser(getStoredUser());
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/payment/admin/all`),
        fetch(`${API_BASE_URL}/api/payment/admin/stats`),
      ]);

      if (paymentsRes.ok) {
        const json = await paymentsRes.json();
        setPayments(json.data || []);
      }
      if (statsRes.ok) {
        const json = await statsRes.json();
        if (json.data) setStats(json.data);
      }
    } catch (err) {
      console.error("Failed to load payment data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Approve
  const handleApprove = async (paymentId: string) => {
    setProcessingId(paymentId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/admin/confirm/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: "Approved and verified by Admin" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("✓ Payment approved! User subscription activated.", "success");
        await loadData();
      } else {
        showToast(data.message || "Failed to approve payment", "error");
      }
    } catch {
      showToast("Network error while approving", "error");
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Reject
  const handleConfirmReject = async () => {
    if (!rejectModalPayment) return;
    setProcessingId(rejectModalPayment._id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/admin/reject/${rejectModalPayment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason || "Payment details could not be verified" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Payment rejected and client notified", "success");
        setRejectModalPayment(null);
        setRejectReason("");
        await loadData();
      } else {
        showToast(data.message || "Failed to reject payment", "error");
      }
    } catch {
      showToast("Network error while rejecting", "error");
    } finally {
      setProcessingId(null);
    }
  };

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      // Tab filter
      if (activeTab === "awaiting" && p.status !== "awaiting_confirmation") return false;
      if (activeTab === "completed" && p.status !== "completed") return false;
      if (activeTab === "failed" && p.status !== "failed") return false;

      // Method filter
      if (methodFilter !== "all" && p.method !== methodFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTx = p.transactionId?.toLowerCase().includes(q);
        const matchesPhone = p.senderMobileNumber?.toLowerCase().includes(q);
        const matchesName = p.clientName?.toLowerCase().includes(q);
        const matchesEmail = p.clientEmail?.toLowerCase().includes(q);
        const matchesPlan = p.plan?.toLowerCase().includes(q);
        return matchesTx || matchesPhone || matchesName || matchesEmail || matchesPlan;
      }
      return true;
    });
  }, [payments, activeTab, methodFilter, searchQuery]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#070c16] text-white">
      <AdminTopBar
        title="Payments & Subscriptions"
        subtitle="Verify bKash, Nagad & Stripe payments and manage client plan activations"
        user={user}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border text-sm font-medium backdrop-blur-md ${
              toastMessage.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300"
                : "bg-red-950/90 border-red-500/40 text-red-300"
            }`}
          >
            <span>{toastMessage.type === "success" ? "✓" : "⚠️"}</span>
            {toastMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">Payments & Subscriptions</h1>
              {stats.awaiting > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                  {stats.awaiting} Pending
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-400 mt-1">
              Verify manual bKash & Nagad transactions, check screenshots, and activate client subscriptions.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="self-start px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs text-neutral-400 font-medium">Awaiting Verification</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.awaiting}</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Needs admin action</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs text-neutral-400 font-medium">Completed Payments</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.completed}</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Active subscriptions</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs text-neutral-400 font-medium">BDT Revenue</p>
            <p className="text-2xl font-bold text-teal-300 mt-1">৳{stats.totalRevenueBDT.toLocaleString()}</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">bKash & Nagad volume</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs text-neutral-400 font-medium">Total Transactions</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">All time records</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "awaiting", label: "Awaiting Verification", count: stats.awaiting },
              { id: "all", label: "All Payments", count: stats.total },
              { id: "completed", label: "Completed", count: stats.completed },
              { id: "failed", label: "Rejected / Failed", count: stats.failed },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-primary-500/20 text-primary-300 border border-primary-500/30"
                    : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      activeTab === tab.id
                        ? "bg-primary-500/30 text-primary-200"
                        : "bg-white/10 text-neutral-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search and method selector */}
          <div className="flex items-center gap-2">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              aria-label="Filter payments by payment method"
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-neutral-300 focus:outline-none focus:border-teal-500/50"
            >
              <option value="all">All Methods</option>
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
              <option value="stripe">Stripe</option>
            </select>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search TxID, phone, email..."
                className="w-48 sm:w-64 px-3 py-1.5 pl-8 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-teal-500/50"
              />
              <span className="absolute left-2.5 top-1.5 text-neutral-500 text-xs">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1.5 text-neutral-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Payments List */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-neutral-400 mt-3">Loading payments...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-white/[0.01] border border-white/[0.06]">
            <p className="text-3xl mb-2">💳</p>
            <p className="text-sm text-neutral-300 font-medium">No payments found</p>
            <p className="text-xs text-neutral-500 mt-1">
              {activeTab === "awaiting"
                ? "No pending bKash or Nagad payments awaiting verification right now."
                : "No records match your selected filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayments.map((p) => {
              const isAwaiting = p.status === "awaiting_confirmation";
              const isCompleted = p.status === "completed";
              const isFailed = p.status === "failed";
              const formattedDate = new Date(p.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              const screenshot = p.screenshotUrl || (p.screenshotNote?.startsWith("http") ? p.screenshotNote : null);

              return (
                <div
                  key={p._id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isAwaiting
                      ? "bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/40"
                      : isCompleted
                      ? "bg-white/[0.02] border-white/[0.06]"
                      : "bg-red-500/[0.02] border-red-500/10"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Client & Plan details */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Method Icon / Avatar */}
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          p.method === "bkash"
                            ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                            : p.method === "nagad"
                            ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                            : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        }`}
                      >
                        {p.method === "bkash" ? "bKash" : p.method === "nagad" ? "Nagad" : "Stripe"}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-white truncate">{p.clientName}</h3>
                          <span className="text-xs text-neutral-500">•</span>
                          <span className="text-xs text-neutral-400 font-mono">{p.clientEmail}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              p.plan === "business"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                            }`}
                          >
                            {p.plan} Plan
                          </span>
                        </div>

                        {/* Transaction and sender info */}
                        <div className="flex items-center gap-3 text-xs text-neutral-400 flex-wrap">
                          {p.senderMobileNumber && (
                            <div className="flex items-center gap-1 font-mono">
                              <span className="text-neutral-500">Sender:</span>
                              <span className="text-neutral-200">🇧🇩 {p.senderMobileNumber}</span>
                            </div>
                          )}
                          {p.transactionId && (
                            <div className="flex items-center gap-1 font-mono">
                              <span className="text-neutral-500">TxID:</span>
                              <span className="text-amber-300 font-bold bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                                {p.transactionId}
                              </span>
                            </div>
                          )}
                          <span className="text-neutral-500">{formattedDate}</span>
                        </div>

                        {/* Admin Notes if any */}
                        {p.adminNotes && (
                          <p className="text-xs text-neutral-400 italic bg-white/[0.03] px-2 py-1 rounded inline-block">
                            Note: {p.adminNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Amount, Status, Screenshot thumbnail & Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 flex-wrap">
                      {/* Amount */}
                      <div className="text-right">
                        <p className="text-base font-bold font-mono text-white">
                          {p.currency === "bdt"
                            ? `৳${(p.amount / 100).toLocaleString()}`
                            : `$${(p.amount / 100).toFixed(2)}`}
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                            isAwaiting
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : isCompleted
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {isAwaiting ? "Awaiting Verification" : p.status}
                        </span>
                      </div>

                      {/* Screenshot thumbnail if available */}
                      {screenshot ? (
                        <button
                          onClick={() => setSelectedScreenshot(screenshot)}
                          className="group relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 bg-neutral-900 flex-shrink-0 hover:border-teal-400 transition-all cursor-pointer"
                          title="Click to view payment screenshot"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={screenshot}
                            alt="Slip thumbnail"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                            <span className="text-xs">🔍</span>
                          </div>
                        </button>
                      ) : (
                        <div
                          className="w-12 h-12 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-[10px] text-neutral-500 text-center"
                          title="No screenshot attached"
                        >
                          No slip
                        </div>
                      )}

                      {/* Action buttons */}
                      {isAwaiting && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(p._id)}
                            disabled={processingId === p._id}
                            className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {processingId === p._id ? (
                              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            ) : (
                              <span>✓</span>
                            )}
                            Approve & Activate
                          </button>

                          <button
                            onClick={() => {
                              setRejectModalPayment(p);
                              setRejectReason("");
                            }}
                            disabled={processingId === p._id}
                            className="px-2.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-medium transition-all"
                            title="Reject payment"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}

                      {isCompleted && (
                        <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                          <span>✓</span> Active Plan
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Screenshot Zoom Modal */}
      <AnimatePresence>
        {selectedScreenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedScreenshot(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[85vh] bg-neutral-900 border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-black/40">
                <span className="text-xs font-bold text-neutral-300">Payment Screenshot Verification</span>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedScreenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-400 hover:text-teal-300 px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                  >
                    Open Original ↗
                  </a>
                  <button
                    onClick={() => setSelectedScreenshot(null)}
                    className="text-neutral-400 hover:text-white p-1 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-black/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedScreenshot}
                  alt="Payment receipt proof"
                  className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {rejectModalPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full bg-neutral-900 border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-2 text-red-400">
                <span className="text-xl">⚠️</span>
                <h3 className="text-base font-bold text-white">Reject Payment Confirmation</h3>
              </div>
              <p className="text-xs text-neutral-400">
                You are rejecting the {rejectModalPayment.method.toUpperCase()} payment for{" "}
                <strong className="text-white">{rejectModalPayment.clientName}</strong> (TxID:{" "}
                <span className="font-mono text-amber-300">{rejectModalPayment.transactionId}</span>).
              </p>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Reason for Rejection</label>
                <input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Transaction ID not found in bKash statement"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setRejectModalPayment(null)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  disabled={processingId !== null}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
