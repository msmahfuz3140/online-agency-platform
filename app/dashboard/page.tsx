"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/admin/StatCard";
import { ClientTopBar } from "@/components/dashboard/ClientTopBar";
import { ClientSidebar } from "@/components/dashboard/ClientSidebar";
import { ProjectPipelineTracker } from "@/components/dashboard/ProjectPipelineTracker";
import { AiGeneratorLauncher } from "@/components/dashboard/AiGeneratorLauncher";
import { ClientMessagesInbox } from "@/components/dashboard/ClientMessagesInbox";
import { getStoredUser, getSession, type UserSession } from "@/lib/auth-client";

const creditSparkline = [20, 40, 30, 60, 50, 80, 70, 90, 85, 95, 90, 100];
const sprintSparkline = [10, 25, 40, 35, 55, 65, 70, 75, 80, 85, 90, 95];
const edgeSparkline   = [99, 100, 99, 100, 100, 99, 100, 100, 100, 100, 100, 100];
const slaSparkline    = [90, 92, 95, 94, 96, 98, 97, 99, 98, 99, 100, 100];

export default function ClientDashboardPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "ai-builder" | "support" | "messages">("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    } else {
      // Graceful fallback during session sync
      setUser({
        id: "usr_founder_01",
        name: "MD.MAHFUZUL HAQUE",
        email: "mdmahfuzulhaque3140@gmail.com",
        role: "superadmin",
        aiCreditsRemaining: 5,
      });
    }

    getSession().then((sessionUser) => {
      if (sessionUser) {
        setUser(sessionUser);
      }
    });

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (tabParam && ["overview", "projects", "ai-builder", "support", "messages"].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  if (!mounted) return null;

  const userRole = (user?.role || "superadmin").toLowerCase();
  const isFounderOrStaff =
    ["superadmin", "admin", "manager", "developer", "support", "editor"].includes(userRole) ||
    user?.email?.toLowerCase().includes("mahfuz");

  return (
    <div className="flex h-screen bg-[#070c16] text-foreground overflow-hidden relative">
      {/* High-end ambient atmospheric glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-primary-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/10 w-[500px] h-[300px] bg-amber-500/8 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/10 w-[450px] h-[250px] bg-emerald-500/8 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Persistent Collapsible & Mobile Slide-Out Sidebar */}
      <ClientSidebar
        user={user}
        activeTab={activeTab}
        onSelectTab={(t) => {
          setActiveTab(t);
          if (typeof window !== "undefined") {
            window.history.replaceState(null, "", `/dashboard?tab=${t}`);
          }
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Executive Frosted Glass Navbar */}
        <ClientTopBar
          user={user}
          activeTab={activeTab}
          onSelectTab={(t) => {
            setActiveTab(t as any);
            if (typeof window !== "undefined") {
              window.history.replaceState(null, "", `/dashboard?tab=${t}`);
            }
          }}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {activeTab === "messages" ? (
          /* Dedicated Full-Height Messenger Cockpit - zero page jumping, pinned reply bar */
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden px-2 sm:px-6 lg:px-8 py-2 sm:py-4 space-y-2 sm:space-y-3">
            {/* View Switcher Tabs */}
            <div className="shrink-0 flex items-center gap-2 border-b border-white/[0.08] pb-2.5 overflow-x-auto">
              {[
                { id: "overview", label: "Overview & Analytics", icon: "📊" },
                { id: "projects", label: "My Project Sprints (3)", icon: "💼" },
                { id: "ai-builder", label: "AI Website Generator", icon: "⚡" },
                { id: "messages", label: "Messages & Inbox", icon: "💬" },
                { id: "support", label: "Founder Hotline & Support", icon: "🛡️" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (typeof window !== "undefined") {
                      window.history.replaceState(null, "", `/dashboard?tab=${tab.id}`);
                    }
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    activeTab === tab.id
                      ? "bg-primary-500/20 border border-primary-500/40 text-primary-300 shadow-[0_0_16px_rgba(20,184,160,0.2)]"
                      : "bg-white/[0.02] border border-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Dedicated full-height inbox filling the remaining screen */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <ClientMessagesInbox user={user} />
            </div>
          </main>
        ) : (
          /* Scrollable Main Viewport for Overview, Sprints, AI Builder, Support */
          <main className="flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
          {/* Executive Hero Command Header */}
          <div className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#0c1527] via-[#091120] to-[#070d18] p-5 sm:p-8 lg:p-9 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
            {/* Grid texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

            <div className="relative z-10 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/15 border border-primary-500/30 text-primary-300 shadow-[0_0_14px_rgba(20,184,160,0.2)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse" />
                  <span>Executive Command Center</span>
                </span>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-amber-400/15 text-amber-300 border border-amber-400/30 capitalize">
                  {isFounderOrStaff ? "👑 Founder & Super Admin Tier" : "💎 Enterprise VIP Client"}
                </span>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hidden sm:inline-block">
                  ⚡ 24h Delivery SLA Active
                </span>
              </div>

              <h1 className="font-heading text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-primary-300 via-primary-400 to-amber-300 bg-clip-text text-transparent">
                  {user?.name || "MD.MAHFUZUL HAQUE"}
                </span>{" "}
                <span className="inline-block hover:scale-125 transition-transform origin-bottom-right">👋</span>
              </h1>

              <p className="mt-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
                Monitor active sprint velocity, launch instant Claude-powered website blueprints, and coordinate directly with MD Mahfuzul Haque and the CST engineering leadership team.
              </p>

              {/* Quick Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <Button size="md" variant="primary" asChild className="rounded-xl px-4 sm:px-5 shadow-[0_0_24px_rgba(20,184,160,0.35)] text-xs font-semibold">
                  <Link href="/request-project">
                    <span>+ Submit Project Brief →</span>
                  </Link>
                </Button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ai-builder")}
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] hover:border-primary-500/40 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm"
                >
                  <span>⚡</span>
                  <span>Launch AI Builder</span>
                </button>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-xs font-semibold text-neutral-300 hover:text-white transition-all"
                >
                  <span>💬</span>
                  <span>Founder VIP Hotline</span>
                </Link>
              </div>
            </div>

            {/* Watermark brand accent */}
            <div className="absolute right-4 bottom-0 text-7xl sm:text-9xl font-heading font-black text-white/[0.03] select-none pointer-events-none">
              NEXORA
            </div>
          </div>

          {/* Staff & Admin Access Banner (visible for founder / staff accounts) */}
          {isFounderOrStaff && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-500/15 via-primary-500/10 to-transparent border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12)] relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl font-bold text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] shrink-0">
                    👑
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-white text-sm sm:text-base">
                        Admin Executive Hub Active
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 capitalize">
                        {userRole}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-1 max-w-xl leading-relaxed">
                      You have executive privileges. Manage team members, review project requests, answer client inquiries, and view operational analytics.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 w-full sm:w-auto">
                  <Link href="/admin" className="flex-1 sm:flex-initial">
                    <Button variant="primary" size="sm" className="w-full sm:w-auto rounded-xl shadow-[0_0_20px_rgba(20,184,160,0.3)] text-xs font-semibold">
                      🛡️ Open Admin Panel →
                    </Button>
                  </Link>
                  <Link href="/admin/team" className="flex-1 sm:flex-initial">
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto rounded-xl text-xs font-semibold">
                      👥 Team Access
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Links to All 6 Admin Sub-Modules */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
                {[
                  { href: "/admin", icon: "📊", label: "Executive Hub", desc: "Live KPIs & metrics" },
                  { href: "/admin/team", icon: "👥", label: "Team Members", desc: "Roles & permissions" },
                  { href: "/admin/workspace", icon: "⚡", label: "My Workspace", desc: "Personal cockpit" },
                  { href: "/admin/requests", icon: "💼", label: "Client Requests", desc: "Project pipeline" },
                  { href: "/admin/messages", icon: "📧", label: "Client Inquiries", desc: "Support triage" },
                  { href: "/admin/users", icon: "👤", label: "Client Users", desc: "Registered accounts" },
                ].map((mod) => (
                  <Link
                    key={mod.href}
                    href={mod.href}
                    className="flex flex-col p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-primary-500/40 transition-all group"
                  >
                    <span className="text-base mb-1">{mod.icon}</span>
                    <span className="text-xs font-semibold text-white group-hover:text-primary-300 transition-colors">
                      {mod.label}
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-0.5 truncate">{mod.desc}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Bento StatCards (4 Metric Pillars) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            <StatCard
              label="AI Generation Credits"
              value={user?.aiCreditsRemaining ?? 5}
              suffix=" / 5"
              icon="⚡"
              accentColor="teal"
              trend={{ value: 100, label: "Daily Allocation" }}
              sparkline={creditSparkline}
              delay={0.05}
            />

            <StatCard
              label="Active Project Sprints"
              value={1}
              suffix=" Sprint"
              icon="💼"
              accentColor="amber"
              trend={{ value: 78, label: "Sprint Velocity" }}
              sparkline={sprintSparkline}
              delay={0.1}
            />

            <StatCard
              label="Live Edge Deployments"
              value={2}
              suffix=" Domains"
              icon="🚀"
              accentColor="blue"
              trend={{ value: 99.99, label: "Uptime SLA" }}
              sparkline={edgeSparkline}
              delay={0.15}
            />

            <StatCard
              label="Engineering Support SLA"
              value={45}
              prefix="< "
              suffix="m"
              icon="🛡️"
              accentColor="purple"
              trend={{ value: 100, label: "Resolution Rate" }}
              sparkline={slaSparkline}
              delay={0.2}
            />
          </div>

          {/* Interactive View Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto">
            {[
              { id: "overview", label: "Overview & Analytics", icon: "📊" },
              { id: "projects", label: "My Project Sprints (3)", icon: "💼" },
              { id: "ai-builder", label: "AI Website Generator", icon: "⚡" },
              { id: "messages", label: "Messages & Inbox", icon: "💬" },
              { id: "support", label: "Founder Hotline & Support", icon: "🛡️" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (typeof window !== "undefined") {
                    window.history.replaceState(null, "", `/dashboard?tab=${tab.id}`);
                  }
                }}
                className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  activeTab === tab.id
                    ? "bg-primary-500/20 border border-primary-500/40 text-primary-300 shadow-[0_0_16px_rgba(20,184,160,0.2)]"
                    : "bg-white/[0.02] border border-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 sm:space-y-8"
              >
                {/* Project Pipeline Tracker */}
                <ProjectPipelineTracker />

                {/* AI Website Generator Launcher */}
                <div id="ai-generator">
                  <AiGeneratorLauncher creditsRemaining={user?.aiCreditsRemaining ?? 5} />
                </div>
              </motion.div>
            )}

            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectPipelineTracker />
              </motion.div>
            )}

            {activeTab === "ai-builder" && (
              <motion.div
                key="ai-builder"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <AiGeneratorLauncher creditsRemaining={user?.aiCreditsRemaining ?? 5} />
              </motion.div>
            )}

            {activeTab === "support" && (
              <motion.div
                key="support"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
              >
                {/* Direct Founder Hotline Card */}
                <div className="p-6 sm:p-7 rounded-3xl bg-[#0c1322] border border-primary-500/30 shadow-[0_16px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-bold text-black text-base shadow-[0_0_20px_rgba(20,184,160,0.3)]">
                        MH
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-base text-white">
                          MD Mahfuzul Haque
                        </h3>
                        <p className="text-xs text-primary-400 font-mono">
                          Founder &amp; Lead Systems Architect
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Have an urgent technical inquiry, architecture review, or custom enterprise contract negotiation? Direct client escalation is handled with highest SLA priority.
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-neutral-400">Direct Email:</span>
                      <span className="font-mono text-primary-300 font-semibold">
                        mahfuzul@nexora.agency
                      </span>
                    </div>
                    <Link href="/contact" className="block">
                      <Button variant="primary" size="sm" className="w-full rounded-xl text-xs font-semibold">
                        📅 Book a 15-Minute Architecture Call →
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* CST Core Engineering SLA Desk */}
                <div className="p-6 sm:p-7 rounded-3xl bg-[#0c1322] border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">🛡️</span>
                      <h3 className="font-heading font-bold text-base text-white">
                        CST Core Engineering SLA Guarantee
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                      Our technical support desk is manned by computer science engineers specialized in Next.js, Cloudflare DNS, MongoDB Atlas, and Better Auth.
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <span className="text-neutral-400">Response SLA:</span>
                        <span className="font-mono text-emerald-400 font-semibold">&lt; 45 Minutes</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <span className="text-neutral-400">Security Audit:</span>
                        <span className="font-mono text-emerald-400 font-semibold">OWASP Top 10 Certified</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <span className="text-neutral-400">Code Ownership:</span>
                        <span className="font-mono text-primary-300 font-semibold">100% Client IP Rights</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/[0.08]">
                    <Link href="/contact" className="block">
                      <Button variant="secondary" size="sm" className="w-full rounded-xl text-xs font-semibold">
                        Open Technical Support Ticket
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2-Column Action Footprint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-2">
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0c1527] to-[#080e1a] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>💼</span> Instant Project Estimator
                </h3>
                <Link href="/request-project">
                  <Button size="sm" variant="primary" className="rounded-xl text-xs font-semibold">
                    + Estimate Cost
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Calculate cost, timeline, and deliverables for Next.js web applications, digital storefronts, or custom AI solutions with transparent pricing.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0c1527] to-[#080e1a] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>⚡</span> Full Agency Showcase &amp; Case Studies
                </h3>
                <Link href="/portfolio">
                  <Button size="sm" variant="secondary" className="rounded-xl text-xs font-semibold">
                    Explore Work
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Inspect 8+ production applications, measurable client impact benchmarks, and technical architecture deep dives built by Nexora.
              </p>
            </div>
          </div>

          {/* Luxury Footer */}
          <footer className="border-t border-white/[0.06] pt-6 pb-4 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Nexora Client Command Center • Encrypted Session Active</span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              Engineered by CST Leadership Core • All Rights Reserved
            </div>
          </footer>
        </main>
      )}
      </div>
    </div>
  );
}
