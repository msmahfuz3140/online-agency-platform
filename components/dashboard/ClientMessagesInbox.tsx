"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type UserSession } from "@/lib/auth-client";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ThreadReply {
  _id?: string;
  sender: "admin" | "user";
  senderName: string;
  senderEmail?: string;
  message: string;
  createdAt: string;
}

interface Thread {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  company?: string;
  message: string;
  status: string;
  userId?: string;
  replies?: ThreadReply[];
  createdAt: string;
  updatedAt?: string;
}

interface ClientMessagesInboxProps {
  user: UserSession | null;
}

export function ClientMessagesInbox({ user }: ClientMessagesInboxProps) {
  const isFounderOrStaff =
    user?.role === "superadmin" ||
    user?.role === "admin" ||
    user?.email?.toLowerCase().includes("mahfuz");

  const [activeFilter, setActiveFilter] = useState<"my" | "all">(
    isFounderOrStaff ? "all" : "my"
  );
  const [emailInput, setEmailInput] = useState(user?.email || "");
  const [activeEmail, setActiveEmail] = useState(user?.email || "");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const chatStreamRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedThread = threads.find((t) => t._id === selectedThreadId) || null;

  const scrollToBottom = () => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  };

  const getLocalTrackedIds = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("nexora_client_inquiries") || "[]");
    } catch {
      return [];
    }
  };

  const fetchThreads = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      const localIds = getLocalTrackedIds();

      if (activeFilter === "all" || isFounderOrStaff) {
        params.set("all", "true");
      } else {
        if (activeEmail.trim()) params.set("email", activeEmail.trim());
        if (user?.id) params.set("userId", user.id);
        if (localIds.length > 0) params.set("ids", localIds.join(","));
      }

      let res = await fetch(`${API_BASE_URL}/api/contact/user-threads?${params.toString()}`);
      let json = res.ok ? await res.json() : null;
      let loaded: Thread[] = json?.data || [];

      // If specific email had 0 matches, fallback to showing all recent inquiries so user is never lost
      if (loaded.length === 0 && !params.has("all")) {
        const fallbackRes = await fetch(`${API_BASE_URL}/api/contact/user-threads?all=true`);
        if (fallbackRes.ok) {
          const fbJson = await fallbackRes.json();
          loaded = fbJson.data || [];
        }
      }

      setThreads(loaded);
      if (loaded.length > 0) {
        setSelectedThreadId((prev) => {
          if (prev && loaded.some((t) => t._id === prev)) return prev;
          // On mobile screens (<1024px), keep null initially so the user sees inquiry list
          if (typeof window !== "undefined" && window.innerWidth < 1024) {
            return null;
          }
          return loaded[0]._id;
        });
      }
    } catch (e) {
      console.error("Error loading threads:", e);
    } finally {
      setLoading(false);
    }
  }, [activeEmail, activeFilter, isFounderOrStaff, user?.id]);

  useEffect(() => {
    if (user?.email && !activeEmail) {
      setEmailInput(user.email);
      setActiveEmail(user.email);
    }
  }, [user?.email, activeEmail]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    if (selectedThread) {
      if (selectedThread.replies && selectedThread.replies.length > 0) {
        setTimeout(scrollToBottom, 50);
      } else if (chatStreamRef.current) {
        chatStreamRef.current.scrollTop = 0;
      }
    }
  }, [selectedThreadId, selectedThread?.replies?.length]);

  // Smart polling: re-fetch the active thread every 15s to catch admin replies in real-time
  useEffect(() => {
    if (!selectedThreadId) return;

    const poll = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/contact/${selectedThreadId}`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setThreads((prev) =>
              prev.map((t) => (t._id === selectedThreadId ? json.data : t))
            );
          }
        }
      } catch {
        // silent — offline or network issue
      }
    };

    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, [selectedThreadId]);


  const handleEmailSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setActiveFilter("my");
      setActiveEmail(emailInput.trim());
      setSelectedThreadId(null);
    }
  };

  const handleSendReply = async () => {
    if (!selectedThread || !replyText.trim() || sending) return;

    setSending(true);
    const content = replyText.trim();
    const senderName = user?.name || selectedThread.name || "Client";
    const senderEmail = user?.email || selectedThread.email;

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/${selectedThread._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          senderName,
          senderEmail,
          sender: "user",
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const updated: Thread = json.data || {
          ...selectedThread,
          status: "unread",
          replies: [
            ...(selectedThread.replies || []),
            {
              sender: "user",
              senderName,
              senderEmail,
              message: content,
              createdAt: new Date().toISOString(),
            },
          ],
        };

        setThreads((prev) =>
          prev.map((t) => (t._id === selectedThread._id ? updated : t))
        );
        setReplyText("");
        setTimeout(scrollToBottom, 100);
      } else {
        alert("Could not send reply. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  // Extract department/category from subject like "Direct Service Inquiry: Business Website [Website Development]"
  const getDepartmentFromSubject = (subj?: string) => {
    if (!subj) return "Executive Architecture Team";
    const match = subj.match(/\[(.*?)\]/);
    if (match && match[1]) return `${match[1]} Division`;
    if (subj.toLowerCase().includes("security")) return "Cyber Security & Audits Team";
    if (subj.toLowerCase().includes("web")) return "Website Development Engineering";
    if (subj.toLowerCase().includes("ai")) return "AI Systems & Blueprints Team";
    return "Executive Leadership Team";
  };

  return (
    <div className="w-full h-full min-h-0 sm:min-h-[500px] flex flex-col rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#090f1d] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Top Banner / Navigation & Email Filter Bar (hides on mobile when a thread is open to maximize chat room) */}
      <div
        className={`shrink-0 px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#0c1527] via-[#0b1324] to-[#090f1e] border-b border-white/[0.08] flex-col md:flex-row items-start md:items-center justify-between gap-2.5 sm:gap-3.5 ${
          selectedThreadId ? "hidden lg:flex" : "flex"
        }`}
      >
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="font-heading font-bold text-xs sm:text-base text-white">
              My Messages &amp; Agency Inquiries
            </h2>
            <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-300 border border-primary-500/30 font-mono">
              Live Channel
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 hidden sm:block">
            Directly communicate with <strong className="text-white">MD Mahfuzul Haque</strong> (Founder &amp; Lead Architect) and the Nexora engineering leadership.
          </p>
        </div>

        {/* Filter Tabs & Email Switcher */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-between sm:justify-end">
          {/* View Toggle */}
          <div className="flex items-center bg-white/[0.04] p-0.5 rounded-xl border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-primary-500/25 text-primary-300 border border-primary-500/40 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              All Inquiries ({threads.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("my")}
              className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeFilter === "my"
                  ? "bg-primary-500/25 text-primary-300 border border-primary-500/40 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Filter by Email
            </button>
          </div>

          {activeFilter === "my" && (
            <form onSubmit={handleEmailSearch} className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter inquiry email..."
                className="px-2.5 py-1 text-[11px] sm:text-xs rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-neutral-500 focus:border-primary-500 outline-none w-36 sm:w-44"
              />
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] transition-all cursor-pointer"
              >
                Search
              </button>
            </form>
          )}

          <button
            onClick={() => fetchThreads()}
            disabled={loading}
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
            title="Refresh conversations"
          >
            <span className={loading ? "animate-spin inline-block" : ""}>🔄</span>
          </button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Inquiry Threads List (Collapses on mobile when a thread is open) */}
        <div
          className={`lg:col-span-4 xl:col-span-4 h-full flex flex-col min-h-0 border-r border-white/[0.07] bg-[#070c17] overflow-hidden ${
            selectedThreadId ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="shrink-0 p-3.5 border-b border-white/[0.06] bg-[#080e1c] flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
              Inquiry Threads ({threads.length})
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              Click thread to chat
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-white/[0.04] [scrollbar-width:thin]">
            {loading ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                <span className="animate-spin inline-block mr-2">⚡</span> Syncing inquiries...
              </div>
            ) : threads.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="text-3xl">📬</div>
                <p className="text-xs text-neutral-300 font-medium">No inquiries found</p>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Send a direct message from the Services section or Contact page.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter("all");
                    fetchThreads();
                  }}
                  className="text-xs px-3 py-1.5 rounded-xl bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25 transition-all cursor-pointer"
                >
                  Show All Recent Inquiries →
                </button>
              </div>
            ) : (
              threads.map((thread) => {
                const isSelected = thread._id === selectedThreadId;
                const replyCount = thread.replies?.length || 0;
                const lastReply = replyCount > 0 ? thread.replies![replyCount - 1] : null;
                const dept = getDepartmentFromSubject(thread.subject);

                return (
                  <button
                    key={thread._id}
                    onClick={() => setSelectedThreadId(thread._id)}
                    className={`w-full text-left p-3.5 sm:p-4 transition-all flex flex-col gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-primary-500/10 border-l-2 border-l-primary-400"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    {/* Clear Recipient Notice */}
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-primary-400 font-bold">
                          TO:
                        </span>
                        <span className="text-xs font-bold text-white truncate">
                          Nexora Agency ({dept})
                        </span>
                      </div>
                      <StatusBadge status={thread.status || "unread"} />
                    </div>

                    {/* Subject / Service Title */}
                    <p className={`text-xs font-medium truncate ${isSelected ? "text-primary-300" : "text-neutral-300"}`}>
                      {thread.subject || "General Agency Inquiry"}
                    </p>

                    {/* Last message preview */}
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
                      {lastReply ? (
                        <>
                          <strong className={lastReply.sender === "admin" ? "text-primary-300" : "text-amber-300"}>
                            {lastReply.sender === "admin" ? "Nexora Reply: " : "You: "}
                          </strong>
                          <span>{lastReply.message}</span>
                        </>
                      ) : (
                        <span>{thread.message}</span>
                      )}
                    </p>

                    {/* Sender footnote and date */}
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-0.5">
                      <span className="truncate">
                        Sent as: <strong className="text-neutral-400">{thread.name}</strong> ({thread.email})
                      </span>
                      {replyCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-primary-500/20 text-primary-300 font-mono font-bold shrink-0 ml-1">
                          💬 {replyCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation (Messenger View) */}
        <div
          className={`lg:col-span-8 xl:col-span-8 h-full flex flex-col min-h-0 bg-[#090f1d] overflow-hidden ${
            !selectedThreadId ? "hidden lg:flex" : "flex"
          }`}
        >
          {selectedThread ? (
            <>
              {/* Detailed Recipient Banner ("ami kake msg pataisi") */}
              <div className="shrink-0 p-2.5 sm:p-4 border-b border-white/[0.08] bg-gradient-to-r from-[#0c1424] to-[#09101e] flex items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedThreadId(null)}
                    className="lg:hidden px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-primary-300 hover:text-white border border-white/[0.08] text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                    title="Back to inquiries list"
                  >
                    <span>←</span>
                    <span className="hidden xs:inline">Back</span>
                  </button>

                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-bold text-black text-xs sm:text-sm shadow-[0_0_15px_rgba(20,184,160,0.35)] shrink-0">
                    NX
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Clear Recipient Indicator */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-[8px] sm:text-[10px] uppercase font-mono px-1.5 py-0.1 rounded bg-primary-500/20 text-primary-300 font-bold">
                        TO
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">
                        Nexora Support • {getDepartmentFromSubject(selectedThread.subject)}
                      </h3>
                      <StatusBadge status={selectedThread.status || "unread"} />
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-neutral-400 flex items-center gap-1.5 sm:gap-2 mt-0.5 truncate">
                      <span>Lead: <strong className="text-white">MD Mahfuzul Haque</strong></span>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-mono text-[9px] sm:text-[10px] shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block shrink-0">
                  <span className="text-[10px] text-neutral-500 uppercase font-mono block">Inquiry Date</span>
                  <span className="text-[11px] text-neutral-300 font-mono">
                    {new Date(selectedThread.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Inquiry Context Strip */}
              <div className="shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/[0.02] border-b border-white/[0.04] text-[11px] sm:text-xs text-neutral-300 flex items-center justify-between gap-2">
                <span className="truncate">
                  <strong className="text-primary-300">Topic: </strong>
                  {selectedThread.subject || "General Service Request"}
                </span>
                <span className="text-[10px] sm:text-[11px] text-neutral-400 font-mono shrink-0 hidden sm:inline">
                  Sent as: {selectedThread.name} ({selectedThread.email})
                </span>
              </div>

              {/* Chat Messages Stream (Scrollable container without page jump) */}
              <div ref={chatStreamRef} className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 space-y-3.5 sm:space-y-4 [scrollbar-width:thin]">
                {/* 1. Initial Inquiry Sent by Client to Agency */}
                <div className="flex flex-col items-end ml-auto max-w-[92%] sm:max-w-[80%] md:max-w-[75%]">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 pr-1 flex-row-reverse flex-wrap">
                    <span className="text-xs font-semibold text-primary-300">
                      You ({selectedThread.name})
                    </span>
                    <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-white/[0.08] text-neutral-300 font-mono">
                      ➔ Nexora
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {new Date(selectedThread.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="rounded-2xl rounded-tr-sm px-3.5 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-primary-600 to-teal-500 text-white text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-[0_4px_16px_rgba(20,184,160,0.25)]">
                    {selectedThread.message}
                  </div>
                </div>

                {/* If no replies yet, show friendly status note */}
                {(!selectedThread.replies || selectedThread.replies.length === 0) && (
                  <div className="flex items-center justify-center my-4 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center max-w-md mx-auto">
                    <div className="text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-primary-300 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Inquiry logged with MD Mahfuzul Haque &amp; Nexora Team</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        You can send additional messages or requirements below at any time. Replies will appear here in real-time.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. Conversation Replies */}
                {selectedThread.replies && selectedThread.replies.length > 0 && (
                  <div className="space-y-3.5 sm:space-y-4 pt-1 sm:pt-2">
                    <div className="flex items-center justify-center my-3">
                      <span className="h-[1px] bg-white/[0.06] flex-1" />
                      <span className="px-3 text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                        Conversation Thread
                      </span>
                      <span className="h-[1px] bg-white/[0.06] flex-1" />
                    </div>

                    {selectedThread.replies.map((rep, idx) => {
                      const isMe = rep.sender === "user";
                      return (
                        <motion.div
                          key={rep._id || idx}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex flex-col ${
                            isMe ? "items-end ml-auto" : "items-start"
                          } max-w-[92%] sm:max-w-[80%] md:max-w-[75%]`}
                        >
                          <div
                            className={`flex items-center gap-1.5 sm:gap-2 mb-1 ${
                              isMe ? "pr-1 flex-row-reverse" : "pl-1"
                            } flex-wrap`}
                          >
                            <span
                              className={`text-xs font-semibold ${
                                isMe ? "text-primary-300" : "text-amber-300"
                              }`}
                            >
                              {isMe
                                ? `You (${rep.senderName || selectedThread.name})`
                                : `Nexora Team (${rep.senderName || "MD Mahfuzul Haque"})`}
                            </span>
                            <span
                              className={`text-[8px] sm:text-[9px] px-1.5 py-0.1 rounded-full font-mono ${
                                isMe
                                  ? "bg-white/[0.08] text-neutral-300"
                                  : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                              }`}
                            >
                              {isMe ? "Client Reply" : "Official Agency Reply"}
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-neutral-500">
                              {new Date(rep.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div
                            className={`rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                              isMe
                                ? "rounded-tr-sm bg-gradient-to-r from-primary-600 to-teal-500 text-white shadow-[0_4px_16px_rgba(20,184,160,0.25)]"
                                : "rounded-tl-sm bg-[#131b2e] border border-primary-500/30 text-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                            }`}
                          >
                            {rep.message}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="shrink-0 p-2.5 sm:p-4 bg-[#0c1424] border-t border-white/[0.08] flex items-end gap-2 sm:gap-2.5">
                <div className="flex-1 relative rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.1] focus-within:border-primary-500/60 focus-within:bg-white/[0.06] transition-all">
                  <textarea
                    ref={textareaRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Reply to MD Mahfuzul Haque and the Nexora team... (Enter to send)"
                    rows={2}
                    className="w-full bg-transparent text-white text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 outline-none resize-none placeholder:text-neutral-400 leading-relaxed"
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={handleSendReply}
                  loading={sending}
                  disabled={!replyText.trim() || sending}
                  className="h-10 sm:h-11 px-3.5 sm:px-5 rounded-xl shadow-[0_0_20px_rgba(20,184,160,0.35)] shrink-0 flex items-center gap-1.5 font-semibold cursor-pointer text-xs sm:text-sm"
                >
                  <span>Reply</span>
                  <span className="text-sm sm:text-base">💬</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="h-16 w-16 rounded-3xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-3xl mb-4 shadow-[0_0_30px_rgba(20,184,160,0.15)]">
                💬
              </div>
              <h3 className="font-heading font-bold text-base text-white">
                Select an Inquiry Thread
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mt-1.5 leading-relaxed">
                Choose a conversation on the left to see what you sent to Nexora and review responses from MD Mahfuzul Haque and the leadership team.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
