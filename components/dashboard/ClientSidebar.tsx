"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, type UserSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

interface ClientSidebarProps {
  user: UserSession | null;
  activeTab: "overview" | "projects" | "ai-builder" | "support" | "messages";
  onSelectTab: (tab: "overview" | "projects" | "ai-builder" | "support" | "messages") => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

function ChartBarIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

export function ClientSidebar({
  user,
  activeTab,
  onSelectTab,
  mobileOpen = false,
  onCloseMobile,
}: ClientSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const isStaff = [
    "superadmin",
    "admin",
    "manager",
    "developer",
    "support",
    "editor",
  ].includes((user?.role || "").toLowerCase()) || user?.email?.toLowerCase().includes("mahfuz");

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CL";

  const navigationTabs = [
    {
      id: "overview" as const,
      label: "Overview Cockpit",
      icon: <ChartBarIcon />,
      badge: undefined,
    },
    {
      id: "projects" as const,
      label: "My Project Sprints",
      icon: <BriefcaseIcon />,
      badge: 1,
    },
    {
      id: "ai-builder" as const,
      label: "AI Website Generator",
      icon: <SparklesIcon />,
      badge: "PRO",
    },
    {
      id: "messages" as const,
      label: "Messages & Inbox",
      icon: <ChatBubbleIcon />,
      badge: "LIVE",
    },
    {
      id: "support" as const,
      label: "Founder VIP Hotline",
      icon: <ShieldCheckIcon />,
      badge: "<45m",
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#080e1a] border-r border-white/[0.07] select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06] min-h-[65px]">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <Logo variant="mark" size={34} />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col leading-none overflow-hidden whitespace-nowrap"
              >
                <span className="font-heading font-bold text-sm text-white tracking-tight">Nexora</span>
                <span className="text-[10px] text-primary-400 font-mono font-medium mt-0.5">Client Portal</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Mobile close cross */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Tab Navigation */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        <div className="px-2 pb-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
          {!collapsed ? "Client Workspace" : "•••"}
        </div>

        {navigationTabs.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              title={collapsed ? item.label : undefined}
              className={`w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left cursor-pointer group ${
                isActive
                  ? "bg-primary-500/15 text-primary-300 shadow-[inset_0_0_0_1px_rgba(20,184,160,0.25)]"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="client-sidebar-active"
                  className="absolute inset-0 rounded-xl bg-primary-500/10 border border-primary-500/25"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`shrink-0 relative z-10 ${isActive ? "text-primary-400" : "text-neutral-500 group-hover:text-neutral-300"}`}>
                {item.icon}
              </span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative z-10 whitespace-nowrap flex items-center justify-between flex-1"
                  >
                    <span>{item.label}</span>
                    {item.badge != null && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                          item.badge === "PRO"
                            ? "bg-primary-500/20 text-primary-300 border-primary-500/30"
                            : item.badge === "<45m"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}

        {/* Shortcuts Section */}
        <div className="pt-4 mt-4 border-t border-white/[0.06]">
          <div className="px-2 pb-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
            {!collapsed ? "Quick Actions" : "•••"}
          </div>

          <Link
            href="/request-project"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <span className="text-sm">💼</span>
            {!collapsed && <span className="truncate">New Project Brief</span>}
          </Link>

          <Link
            href="/portfolio"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <span className="text-sm">🌐</span>
            {!collapsed && <span className="truncate">Live Portfolios</span>}
          </Link>
        </div>

        {/* Staff / Super Admin Executive Hub shortcut */}
        {isStaff && (
          <div className="pt-4 mt-4 border-t border-white/[0.06]">
            <div className="px-2 pb-2 text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold">
              {!collapsed ? "Executive Portal" : "👑"}
            </div>

            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors shadow-sm"
            >
              <span className="shrink-0 text-amber-400"><ShieldCheckIcon /></span>
              {!collapsed && <span className="truncate">🛡️ Admin Executive Hub</span>}
            </Link>

            <Link
              href="/admin/team"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-colors mt-1"
            >
              <span className="text-sm">👥</span>
              {!collapsed && <span className="truncate">Team Access & Roles</span>}
            </Link>
          </div>
        )}
      </nav>

      {/* Bottom User Area & Collapse Toggle */}
      <div className="border-t border-white/[0.06] p-2.5 space-y-1.5">
        {/* User Card */}
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5 overflow-hidden">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500/30 to-surface-2 border border-primary-500/40 flex items-center justify-center font-bold text-xs text-primary-300 shrink-0">
            {initials}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {user?.name || "Client"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-primary-400 font-mono leading-none">
                    ⚡ {user?.aiCreditsRemaining ?? 5} cr
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-[10px] text-amber-300 font-mono capitalize leading-none truncate font-bold">
                    {user?.plan === "business"
                      ? "💎 Business VIP"
                      : user?.plan === "pro"
                      ? "👑 Pro Member"
                      : (user?.role || "Client")}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sign Out & Collapse Controls */}
        <div className="flex items-center justify-between gap-1 pt-1">
          <button
            type="button"
            onClick={handleSignOut}
            title={collapsed ? "Sign Out" : undefined}
            className="flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
          >
            <span>🚪</span>
            {!collapsed && <span className="text-[11px]">Sign Out</span>}
          </button>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden md:flex p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronLeftIcon />
            </motion.div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Collapsible Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:block h-screen sticky top-0 shrink-0 z-30 shadow-2xl"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Slide-Out Drawer with Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
