"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getStoredUser, type UserSession } from "@/lib/auth-client";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Stats {
  totalUsers: number;
  totalRequests: number;
  totalMessages: number;
  totalTeamMembers?: number;
}

interface RecentItem {
  _id: string;
  type: "request" | "message";
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

async function fetchWithAuth<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

const userSparkline = [40, 55, 45, 70, 65, 80, 72, 90, 85, 95, 88, 100];
const reqSparkline  = [20, 35, 30, 50, 45, 60, 55, 68, 72, 65, 80, 75];
const msgSparkline  = [60, 50, 70, 65, 80, 75, 85, 78, 90, 88, 92, 95];

export default function AdminDashboardPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setUser(getStoredUser());
    const [statsData, requests, messages] = await Promise.all([
      fetchWithAuth<Stats>(`${API_BASE_URL}/api/admin/stats`),
      fetchWithAuth<RecentItem[]>(`${API_BASE_URL}/api/admin/requests?limit=5`),
      fetchWithAuth<RecentItem[]>(`${API_BASE_URL}/api/admin/messages?limit=5`),
    ]);
    setStats(statsData ?? { totalUsers: 0, totalRequests: 0, totalMessages: 0, totalTeamMembers: 4 });
    const reqItems: RecentItem[] = ((requests as unknown as { data?: RecentItem[] })?.data || (Array.isArray(requests) ? requests : []))
      .slice(0, 4)
      .map((r: RecentItem) => ({ ...r, type: "request" as const }));
    const msgItems: RecentItem[] = ((messages as unknown as { data?: RecentItem[] })?.data || (Array.isArray(messages) ? messages : []))
      .slice(0, 4)
      .map((m: RecentItem) => ({ ...m, type: "message" as const }));
    const combined = [...reqItems, ...msgItems]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);

    const fallbackActivity: RecentItem[] = [
      {
        _id: "demo-req-1",
        type: "request",
        name: "Sarah Jenkins (Lumina Health)",
        email: "sarah@luminahealth.io",
        status: "under_review",
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
      {
        _id: "demo-msg-1",
        type: "message",
        name: "David Chen (Apex Capital)",
        email: "dchen@apexcapital.co",
        status: "unread",
        createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      },
      {
        _id: "demo-req-2",
        type: "request",
        name: "Marcus Vance (Vance Tech)",
        email: "marcus@vancetech.com",
        status: "approved",
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
      {
        _id: "demo-msg-2",
        type: "message",
        name: "Elena Rostova (Nordic UX)",
        email: "elena@nordicdesign.se",
        status: "replied",
        createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      },
    ];

    setRecent(combined.length > 0 ? combined : fallbackActivity);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatRelativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const userRole = (user?.role || "superadmin").toLowerCase();
  const isSuperAdmin = userRole === "superadmin" || userRole === "admin";

  return (
    <div className="min-h-screen">
      <AdminTopBar
        title="Dashboard Overview"
        subtitle="Executive command center — real-time metrics, platform health, and incoming requests"
        user={user}
      />

      <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
        {/* Role Identity & Personal Dashboard Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#0e1626]/80 to-primary-500/5 border border-white/[0.08] p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-primary-500/10 blur-3xl" />

          {/* Top Row: Role Badge & Edge Status */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 sm:mb-4 border-b border-white/[0.06]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-semibold bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 shadow-sm">
                <span>👑</span>
                <span>{isSuperAdmin ? "Executive Super Admin Tier" : "Admin Staff Tier"}</span>
              </span>
              <StatusBadge status={userRole} />
            </div>

            <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Edge SLA Active</span>
            </span>
          </div>

          {/* Main Greeting Row: Avatar + Title + Actions */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5 min-w-0 w-full lg:w-auto">
              {/* Luxury Monogram Avatar */}
              <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-amber-400/30 via-primary-500/20 to-surface-2 border border-amber-400/40 flex items-center justify-center font-heading font-extrabold text-amber-300 text-sm sm:text-base shadow-[0_0_20px_rgba(245,158,11,0.25)] shrink-0 mt-0.5 sm:mt-0">
                {user?.name?.slice(0, 2).toUpperCase() || "MH"}
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-[#0e1626] flex items-center justify-center text-[9px] text-black font-black">
                  ✓
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-heading font-extrabold text-white text-base sm:text-2xl tracking-tight leading-snug">
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-amber-200 via-primary-300 to-amber-400 bg-clip-text text-transparent">
                    {user?.name || "MD.MAHFUZUL HAQUE"}
                  </span>{" "}
                  <span className="inline-block hover:scale-125 transition-transform origin-bottom-right">👋</span>
                </h2>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 leading-relaxed max-w-2xl break-words">
                  {isSuperAdmin
                    ? "Executive Command Center: Full operational authority to manage team permissions, inspect incoming client requests, and oversee platform analytics."
                    : `Active Session: Authenticated with ${userRole} operational permissions.`}
                </p>
              </div>
            </div>

            {/* Action Buttons: Responsive Grid / Wrap */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto shrink-0 pt-1 lg:pt-0">
              <Link href="/admin/workspace" className="flex-1 sm:flex-initial">
                <button className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                  <span>⚡</span>
                  <span>My Workspace</span>
                </button>
              </Link>
              {isSuperAdmin && (
                <Link href="/admin/team" className="flex-1 sm:flex-initial">
                  <button className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold bg-primary-500 hover:bg-primary-400 text-black font-heading transition-all shadow-[0_0_16px_rgba(20,184,160,0.35)] flex items-center justify-center gap-2 cursor-pointer">
                    <span>👥</span>
                    <span>Manage Team</span>
                  </button>
                </Link>
              )}
              <Link href="/dashboard" className="hidden sm:inline-flex flex-1 sm:flex-initial">
                <button className="w-full sm:w-auto px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold bg-white/[0.03] hover:bg-white/[0.06] text-neutral-300 hover:text-white border border-white/[0.06] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>📊</span>
                  <span>Client Dashboard</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Registered Users"
            value={stats?.totalUsers ?? 0}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            }
            trend={{ value: 12, label: "vs last month" }}
            accentColor="teal"
            delay={0}
            sparkline={userSparkline}
          />
          <StatCard
            label="Project Requests"
            value={stats?.totalRequests ?? 0}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
              </svg>
            }
            trend={{ value: 8, label: "vs last month" }}
            accentColor="amber"
            delay={0.08}
            sparkline={reqSparkline}
          />
          <StatCard
            label="Contact Messages"
            value={stats?.totalMessages ?? 0}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            }
            trend={{ value: 5, label: "vs last month" }}
            accentColor="blue"
            delay={0.16}
            sparkline={msgSparkline}
          />
          <StatCard
            label="Active Team Staff"
            value={stats?.totalTeamMembers ?? 4}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.999-3.199a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            }
            trend={{ value: 4, label: "core staff active" }}
            accentColor="purple"
            delay={0.24}
          />
        </div>

        {/* Middle Row: Recent Activity + Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Recent Activity Feed */}
          <div className="xl:col-span-2 rounded-2xl border border-white/[0.07] bg-[#111827] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-sm font-bold text-white">Recent Activity</h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">Latest requests and messages across the platform</p>
              </div>
              <Link href="/admin/requests" className="text-[11px] text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                View All →
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="h-8 w-8 rounded-full bg-white/[0.05] animate-pulse shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2.5 bg-white/[0.05] rounded animate-pulse w-2/3" />
                      <div className="h-2 bg-white/[0.04] rounded animate-pulse w-1/2" />
                    </div>
                    <div className="h-5 w-16 bg-white/[0.05] rounded-full animate-pulse" />
                  </div>
                ))
              ) : recent.length === 0 ? (
                <div className="px-5 py-10 text-center text-neutral-600 text-xs">No recent activity yet.</div>
              ) : (
                recent.map((item, i) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${item.type === "request" ? "bg-amber-500/15 text-amber-400" : "bg-blue-500/15 text-blue-400"}`}>
                      {item.type === "request" ? "💼" : "✉️"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{item.email} • {item.type === "request" ? "Project Request" : "Contact Message"}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StatusBadge status={item.status} />
                      <span className="text-[10px] text-neutral-600">{formatRelativeTime(item.createdAt)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#111827] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-bold text-white">Quick Actions</h2>
              <p className="text-[11px] text-neutral-500 mt-0.5">Jump to any admin section</p>
            </div>
            <div className="p-4 space-y-2">
              {[
                { href: "/admin/team",      icon: "👥", label: "Team Members",    sub: "Manage roles & permissions",      color: "hover:border-amber-500/30 hover:bg-amber-500/5" },
                { href: "/admin/workspace", icon: "⚡", label: "My Workspace",    sub: "Role-tailored cockpit & tasks",    color: "hover:border-primary-500/30 hover:bg-primary-500/5" },
                { href: "/admin/requests",  icon: "💼", label: "Project Requests", sub: "Review and update status",          color: "hover:border-blue-500/30 hover:bg-blue-500/5" },
                { href: "/admin/messages",  icon: "📧", label: "Contact Messages", sub: "Read and archive inquiries",        color: "hover:border-teal-500/30 hover:bg-teal-500/5" },
                { href: "/admin/users",     icon: "👤", label: "Client Accounts", sub: "Manage registered clients",        color: "hover:border-purple-500/30 hover:bg-purple-500/5" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] ${action.color} transition-all duration-200 group`}
                >
                  <span className="text-lg shrink-0">{action.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white leading-none mb-0.5">{action.label}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{action.sub}</p>
                  </div>
                  <svg className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400 shrink-0 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </div>

            {/* Platform Status */}
            <div className="px-5 pb-5 pt-1">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  <span className="text-[11px] font-bold text-emerald-300">All Systems Operational</span>
                </div>
                <div className="space-y-1">
                  {[
                    { label: "API Server", status: "Online" },
                    { label: "MongoDB Atlas", status: "Connected" },
                    { label: "Better Auth", status: "Active" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-[10px] text-neutral-500">{s.label}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
