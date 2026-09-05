"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "@/lib/auth-client";
import { WorkspaceSwitcher } from "@/components/layout/WorkspaceSwitcher";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
  user: { name: string; email: string; role: string } | null;
  onSearch?: (q: string) => void;
  onOpenMobileSidebar?: () => void;
}

export function AdminTopBar({
  title,
  subtitle,
  user,
  onSearch,
  onOpenMobileSidebar,
}: AdminTopBarProps) {
  const router = useRouter();
  const { toggleMobile } = useAdminLayout();
  const handleToggle = onOpenMobileSidebar || toggleMobile;
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MH";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-2.5 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3 bg-[#0a0f1a]/85 backdrop-blur-2xl border-b border-white/[0.06] min-h-[60px] sm:min-h-[65px]">
      {/* Left: Title & Environment Switcher */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label="Open navigation menu"
          className="md:hidden p-2 rounded-xl text-neutral-300 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all cursor-pointer shrink-0"
        >
          <div className="w-4 h-4 flex flex-col justify-center gap-[4px]">
            <span className="block h-0.5 w-4 bg-current rounded-full" />
            <span className="block h-0.5 w-4 bg-current rounded-full" />
            <span className="block h-0.5 w-4 bg-current rounded-full" />
          </div>
        </button>

        <div className="min-w-0">
          <h1 className="font-heading text-sm sm:text-base font-bold text-white leading-tight truncate max-w-[160px] xs:max-w-[220px] sm:max-w-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-neutral-500 mt-0.5 truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>

        <div className="h-5 w-px bg-white/[0.08] hidden sm:block shrink-0" />

        <div className="shrink-0">
          <WorkspaceSwitcher current="admin" align="left" />
        </div>
      </div>

      {/* Right: Quick Switchers + Search + Time + Notifications + Profile Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick 1-click pills to Dashboard and Main Site */}
        <Link
          href="/dashboard"
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500/10 border border-primary-500/25 text-primary-300 hover:bg-primary-500/20 text-xs font-semibold transition-all shadow-[0_0_12px_rgba(20,184,160,0.15)]"
        >
          <span>📊</span>
          <span>Client Dashboard</span>
        </Link>

        <Link
          href="/"
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08] text-xs font-medium transition-all"
        >
          <span>🌐</span>
          <span>Main Site</span>
        </Link>

        {/* Search */}
        {onSearch && (
          <div className="relative hidden sm:block">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearch}
              className="pl-8 pr-3 py-1.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary-500/40 focus:bg-white/[0.06] w-48 transition-all"
            />
          </div>
        )}

        {/* Time */}
        <div className="hidden md:flex flex-col items-end leading-none">
          <span className="text-[11px] font-mono text-white/70">{timeStr}</span>
          <span className="text-[10px] text-neutral-600">{dateStr}</span>
        </div>

        <div className="h-4 w-px bg-white/[0.08] hidden sm:block" />

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
            className="relative h-8 w-8 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-neutral-400 hover:text-white hover:border-primary-500/30 transition-all cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
                  onClick={() => setNotifOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="fixed sm:absolute top-16 sm:top-full mt-0 sm:mt-2 left-3 right-3 sm:left-auto sm:right-0 max-w-sm sm:w-72 mx-auto sm:mx-0 bg-[#111827] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-xs font-bold text-white">Notifications</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {[
                      { icon: "💼", text: "New project request received", time: "2m ago", dot: "bg-primary-400" },
                      { icon: "📧", text: "New contact message from client", time: "15m ago", dot: "bg-amber-400" },
                      { icon: "👤", text: "New user registered", time: "1h ago", dot: "bg-neutral-500" },
                    ].map((n, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-colors">
                        <span className="text-base mt-0.5">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-white leading-snug">{n.text}</p>
                          <p className="text-[10px] text-neutral-600 mt-0.5">{n.time}</p>
                        </div>
                        <span className={`h-2 w-2 rounded-full ${n.dot} shrink-0 mt-1.5`} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar with Interactive Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 hover:bg-white/[0.08] transition-all cursor-pointer group shrink-0"
            aria-label="Admin Profile Menu"
            aria-expanded={profileOpen}
          >
            <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-amber-400/30 to-primary-500/20 border border-amber-400/40 flex items-center justify-center font-bold text-xs text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
              {initials}
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#0a0f1a]" />
            </div>

            <div className="hidden lg:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors truncate max-w-[130px]">
                {user?.name || "MD.MAHFUZUL HAQUE"}
              </span>
              <span className="text-[10px] text-amber-400 font-mono capitalize mt-0.5">
                {user?.role || "superadmin"}
              </span>
            </div>

            <span className="text-[10px] text-neutral-400 group-hover:text-white transition-colors">
              ▾
            </span>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
                  onClick={() => setProfileOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  className="fixed sm:absolute top-16 sm:top-full mt-0 sm:mt-2 left-3 right-3 sm:left-auto sm:right-0 max-w-sm sm:w-80 mx-auto sm:mx-0 rounded-2xl bg-[#0c1322]/95 backdrop-blur-2xl border border-white/[0.1] shadow-[0_24px_70px_rgba(0,0,0,0.85)] p-2.5 z-50 overflow-hidden"
                >
                {/* User Info Header */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-white/[0.03] to-transparent border border-amber-500/20 mb-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white truncate">
                      {user?.name || "MD.MAHFUZUL HAQUE"}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-400/30 bg-amber-400/15 text-amber-300 font-mono capitalize">
                      👑 {user?.role || "Super Admin"}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {user?.email || "mdmahfuzulhaque3140@gmail.com"}
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Executive Session Active
                    </span>
                    <span className="text-neutral-500 font-mono">Full RBAC Rights</span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1 text-xs">
                  <Link
                    href="/admin/workspace"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <span className="text-sm">⚡</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">Personal Workspace</p>
                      <p className="text-[10px] text-neutral-400 truncate">Your role-based cockpit & daily sprints</p>
                    </div>
                  </Link>

                  <Link
                    href="/admin/team"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <span className="text-sm">👥</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">Team Members & Access</p>
                      <p className="text-[10px] text-neutral-400 truncate">Manage staff roles & granular permissions</p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-primary-300 hover:text-white hover:bg-primary-500/15 transition-colors border border-primary-500/20"
                  >
                    <span className="text-sm">📊</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary-300">Client Dashboard Portal</p>
                      <p className="text-[10px] text-neutral-400 truncate">View deliverables, milestones & AI generator</p>
                    </div>
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <span className="text-sm">🌐</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">Main Agency Website</p>
                      <p className="text-[10px] text-neutral-400 truncate">Browse public portfolios & services</p>
                    </div>
                  </Link>
                </div>

                {/* Sign Out Button */}
                <div className="mt-2 pt-2 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
