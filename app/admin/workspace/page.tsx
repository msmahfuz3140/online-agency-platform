"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getStoredUser, type UserSession } from "@/lib/auth-client";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/Button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface WorkspaceData {
  role: string;
  name: string;
  email: string;
  recentRequests: Array<{
    _id: string;
    projectTitle: string;
    clientName: string;
    budget: string;
    status: string;
    createdAt: string;
  }>;
  recentMessages: Array<{
    _id: string;
    name: string;
    email: string;
    subject?: string;
    status: string;
    createdAt: string;
  }>;
  metrics: {
    openRequestsCount: number;
    unreadMessagesCount: number;
    activeSprints: number;
    avgResponseTime: string;
  };
}

export default function PersonalWorkspacePage() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activeRoleView, setActiveRoleView] = useState<string>("superadmin");
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);

  // Todo / Task state for personal workspace
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review new client project proposal requirements", done: false, role: "manager" },
    { id: 2, title: "Audit OWASP Top 10 compliance for Next.js App Router", done: true, role: "developer" },
    { id: 3, title: "Respond to enterprise consultation inquiries within 2h SLA", done: false, role: "support" },
    { id: 4, title: "Configure MongoDB Atlas compound index for high-throughput queries", done: false, role: "developer" },
    { id: 5, title: "Assign new team member roles and permissions", done: true, role: "superadmin" },
  ]);

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    const user = getStoredUser();
    setCurrentUser(user);
    if (user?.role) {
      setActiveRoleView(user.role);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/workspace`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch {
      // Fallback
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const isSuperAdmin = currentUser?.role === "superadmin" || currentUser?.role === "admin";

  return (
    <div className="min-h-screen pb-12">
      <AdminTopBar
        title="Personal Workspace"
        subtitle="Your personalized task cockpit, performance metrics, and operational queue"
        user={currentUser}
      />

      <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
        {/* Role Switcher Preview Bar (Owner superpower) */}
        {isSuperAdmin && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-primary-500/10 via-[#1e293b]/60 to-transparent border border-primary-500/25">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5 shrink-0">
                <span className="h-2 w-2 rounded-full bg-primary-400 animate-ping" />
                Role Preview:
              </span>
              <span className="text-[11px] text-neutral-400 hidden md:inline">
                Switch views to inspect your team members&apos; personalized workspace:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "superadmin", label: "👑 Owner / Super Admin" },
                { id: "manager", label: "📊 Operations Manager" },
                { id: "developer", label: "💻 Core Developer" },
                { id: "support", label: "🎧 Client Support" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRoleView(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeRoleView === tab.id
                      ? "bg-primary-500 text-black shadow-[0_0_12px_rgba(20,184,160,0.4)]"
                      : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── DYNAMIC ROLE-SPECIFIC COCKPIT ─── */}
        <AnimatePresence mode="wait">
          {/* VIEW 1: SUPER ADMIN (Executive Command Center) */}
          {activeRoleView === "superadmin" && (
            <motion.div
              key="superadmin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Executive Welcome Card */}
              <div className="relative overflow-hidden p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/15 via-primary-500/10 to-transparent border border-amber-500/30">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                        SUPER ADMIN &amp; FOUNDER PORTAL
                      </span>
                      <span className="text-xs text-neutral-400">Nexora Agency Platform</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-white mt-1 break-words">
                      Welcome back, {currentUser?.name || "MD Mahfuzul Haque"} 👑
                    </h2>
                    <p className="text-xs text-neutral-300 max-w-2xl mt-1 leading-relaxed break-words">
                      You hold the master keys to the platform. You have unconstrained authority to manage team members, assign operational roles, oversee enterprise contracts, and configure infrastructure.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-full md:w-auto pt-2 md:pt-0">
                    <Link href="/admin/team" className="w-full md:w-auto">
                      <Button variant="primary" className="w-full md:w-auto text-xs py-2.5 px-4 shadow-[0_0_20px_rgba(20,184,160,0.4)] flex items-center justify-center">
                        👥 Manage Team Access →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Master KPI Row */}
              {/* Master KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Active Team Members"
                  value={4}
                  prefix=""
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.999-3.199a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                  }
                  trend={{ value: 25, label: "CST core team" }}
                  sparkline={[40, 50, 60, 70, 80, 90, 100]}
                  accentColor="purple"
                />
                <StatCard
                  label="Pending Project Requests"
                  value={data?.metrics.openRequestsCount ?? 0}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                    </svg>
                  }
                  trend={{ value: 12, label: "high-budget inquiries" }}
                  sparkline={[20, 35, 45, 60, 50, 75, 85]}
                  accentColor="amber"
                />
                <StatCard
                  label="Unread Inquiries"
                  value={data?.metrics.unreadMessagesCount ?? 0}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  }
                  trend={{ value: 0, label: "SLA < 2h" }}
                  sparkline={[30, 40, 35, 50, 45, 60, 55]}
                  accentColor="teal"
                />
                <StatCard
                  label="Production Health"
                  value={100}
                  suffix="%"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  }
                  trend={{ value: 100, label: "uptime record" }}
                  sparkline={[100, 100, 99, 100, 100, 100, 100]}
                  accentColor="blue"
                />
              </div>
            </motion.div>
          )}

          {/* VIEW 2: OPERATIONS MANAGER (Pipeline & Approvals Hub) */}
          {activeRoleView === "manager" && (
            <motion.div
              key="manager"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-purple-500/15 via-[#1e293b]/60 to-transparent border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-400/20 text-purple-300 border border-purple-400/40">
                      OPERATIONS MANAGER WORKSPACE
                    </span>
                    <h2 className="text-xl font-bold font-heading text-white mt-1">
                      Client Pipeline & Sprint Coordination
                    </h2>
                    <p className="text-xs text-neutral-300 max-w-xl mt-1">
                      Review client project estimates, assign tickets to developers, monitor SLA responses, and approve milestone deliverables.
                    </p>
                  </div>
                  <Link href="/admin/requests">
                    <Button variant="secondary" className="text-xs py-2">
                      Review Requests ({data?.metrics.openRequestsCount ?? 0})
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-[#0f172a]/60 border border-white/[0.08]">
                  <p className="text-xs text-neutral-400">Sprint Delivery Status</p>
                  <p className="text-2xl font-bold text-purple-300 mt-1">On Track (98%)</p>
                  <p className="text-[11px] text-muted-fg mt-1">3 active sprints in development</p>
                </div>
                <div className="p-5 rounded-xl bg-[#0f172a]/60 border border-white/[0.08]">
                  <p className="text-xs text-neutral-400">Pending Review</p>
                  <p className="text-2xl font-bold text-amber-300 mt-1">{data?.metrics.openRequestsCount ?? 0} Requests</p>
                  <p className="text-[11px] text-muted-fg mt-1">Awaiting architectural quote</p>
                </div>
                <div className="p-5 rounded-xl bg-[#0f172a]/60 border border-white/[0.08]">
                  <p className="text-xs text-neutral-400">Average Turnaround</p>
                  <p className="text-2xl font-bold text-emerald-300 mt-1">1.4 Days</p>
                  <p className="text-[11px] text-muted-fg mt-1">Proposal dispatch benchmark</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 3: CORE DEVELOPER (Architecture & Tech Specs) */}
          {activeRoleView === "developer" && (
            <motion.div
              key="developer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-[#1e293b]/60 to-transparent border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                      DEVELOPER & SYSTEMS WORKSPACE
                    </span>
                    <h2 className="text-xl font-bold font-heading text-white mt-1">
                      Assigned Architecture & Tech Specs
                    </h2>
                    <p className="text-xs text-neutral-300 max-w-xl mt-1">
                      Build Next.js 15+ fullstack modules, optimize MongoDB indexes, enforce OWASP Top 10 security standards, and verify sub-100ms API response latency.
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                    TypeScript v5 • Node 22 • Next 16
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-[#0f172a]/60 border border-white/[0.08]">
                  <p className="text-xs text-neutral-400">Core Web Vitals</p>
                  <p className="text-2xl font-bold text-cyan-300 mt-1">100 / 100</p>
                  <p className="text-[11px] text-emerald-400 mt-1">Zero Layout Shift (CLS 0.00)</p>
                </div>
                <div className="p-5 rounded-xl bg-[#0f172a]/60 border border-white/[0.08]">
                  <p className="text-xs text-neutral-400">API Response SLA</p>
                  <p className="text-2xl font-bold text-emerald-300 mt-1">42 ms avg</p>
                  <p className="text-[11px] text-muted-fg mt-1">Mongoose lean queries enabled</p>
                </div>
                <div className="p-5 rounded-xl bg-[#0f172a]/60 border border-white/[0.08]">
                  <p className="text-xs text-neutral-400">Zero-Day Vulnerabilities</p>
                  <p className="text-2xl font-bold text-amber-300 mt-1">0 Detected</p>
                  <p className="text-[11px] text-muted-fg mt-1">SAST/DAST audits passing</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 4: CLIENT SUPPORT (Support Desk & SLA Inbox) */}
          {activeRoleView === "support" && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-teal-500/15 via-[#1e293b]/60 to-transparent border border-teal-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-400/20 text-teal-300 border border-teal-400/40">
                      CLIENT SUPPORT DESK
                    </span>
                    <h2 className="text-xl font-bold font-heading text-white mt-1">
                      Customer Inquiries & SLA Queue
                    </h2>
                    <p className="text-xs text-neutral-300 max-w-xl mt-1">
                      Respond to client contact messages, resolve onboarding questions, and maintain our under-2-hour SLA response guarantee.
                    </p>
                  </div>
                  <Link href="/admin/messages">
                    <Button variant="primary" className="text-xs py-2">
                      Open Inbox ({data?.metrics.unreadMessagesCount ?? 0})
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-[#0f172a]/60 border border-white/[0.08]">
                  <p className="text-xs text-neutral-400">Open Inquiries</p>
                  <p className="text-2xl font-bold text-teal-300 mt-1">{data?.metrics.unreadMessagesCount ?? 0}</p>
                  <p className="text-[11px] text-amber-400 mt-1">Immediate response required</p>
                </div>
                <div className="p-5 rounded-xl bg-[#0f172a]/60 border border-white/[0.08]">
                  <p className="text-xs text-neutral-400">Avg First Response</p>
                  <p className="text-2xl font-bold text-emerald-300 mt-1">{data?.metrics.avgResponseTime || "1.4 hrs"}</p>
                  <p className="text-[11px] text-muted-fg mt-1">Well within 2.0h target</p>
                </div>
                <div className="p-5 rounded-xl bg-[#0f172a]/60 border border-white/[0.08]">
                  <p className="text-xs text-neutral-400">Client Satisfaction</p>
                  <p className="text-2xl font-bold text-primary-300 mt-1">99.4%</p>
                  <p className="text-[11px] text-muted-fg mt-1">Based on post-consultation reviews</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── TWO-COLUMN WORKSPACE: Personal Tasks & Active Queue ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Personal Operational Tasks */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                <span>📋</span> Operational Sprint Checklist
              </h3>
              <span className="text-[11px] text-neutral-400 font-mono">
                {tasks.filter((t) => t.done).length} / {tasks.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    task.done
                      ? "bg-white/[0.02] border-white/[0.04] opacity-60"
                      : "bg-white/[0.04] border-white/[0.08] hover:border-primary-500/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-white/20 text-primary-500 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${task.done ? "line-through text-neutral-500" : "text-neutral-200"}`}>
                      {task.title}
                    </p>
                    <span className="inline-block mt-1 text-[9px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.05] text-neutral-400">
                      {task.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Recent Incoming Queue */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                <span>⚡</span> Active Pipeline Stream
              </h3>
              <span className="text-[11px] text-primary-400 font-mono">Real-Time Data</span>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 rounded-xl bg-white/[0.02] animate-pulse" />
                  ))}
                </div>
              ) : data && data.recentRequests && data.recentRequests.length > 0 ? (
                data.recentRequests.slice(0, 4).map((req) => (
                  <div
                    key={req._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">{req.projectTitle}</p>
                      <p className="text-[11px] text-neutral-400">{req.clientName} • Budget: {req.budget}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={req.status} />
                      <p className="text-[10px] text-neutral-500 font-mono mt-1">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-500 text-center py-6">No recent pipeline items</p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Link href="/admin/requests" className="text-xs text-primary-400 hover:text-primary-300 font-medium">
                View All Requests →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
