import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

function ChartBarIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
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
function EnvelopeIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
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
function PowerIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
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

function UserGroupIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.999-3.199a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
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

interface AdminSidebarProps {
  user: { name: string; email: string; role: string } | null;
  requestsBadge?: number;
  messagesBadge?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  user,
  requestsBadge = 0,
  messagesBadge = 0,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarProfileOpen, setSidebarProfileOpen] = useState(false);
  const sidebarProfileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarProfileRef.current &&
        !sidebarProfileRef.current.contains(event.target as Node)
      ) {
        setSidebarProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userRole = user?.role || "admin";
  const isSuperAdminOrAdmin = userRole === "superadmin" || userRole === "admin";
  const isManager = userRole === "manager";
  const isDeveloper = userRole === "developer";
  const isSupport = userRole === "support";

  // Role-based navigation items
  const allNavItems: (NavItem & { allowed: boolean })[] = [
    {
      href: "/admin",
      label: "Overview",
      icon: <ChartBarIcon />,
      allowed: true,
    },
    {
      href: "/admin/workspace",
      label: "My Workspace",
      icon: <SparklesIcon />,
      allowed: true,
    },
    {
      href: "/admin/team",
      label: "Team Members",
      icon: <UserGroupIcon />,
      allowed: isSuperAdminOrAdmin,
    },
    {
      href: "/admin/users",
      label: "Clients / Users",
      icon: <UsersIcon />,
      allowed: isSuperAdminOrAdmin || isManager,
    },
    {
      href: "/admin/requests",
      label: "Project Requests",
      icon: <BriefcaseIcon />,
      badge: requestsBadge,
      allowed: isSuperAdminOrAdmin || isManager || isDeveloper || isSupport,
    },
    {
      href: "/admin/messages",
      label: "Client Messages",
      icon: <EnvelopeIcon />,
      badge: messagesBadge,
      allowed: isSuperAdminOrAdmin || isManager || isSupport,
    },
  ];

  const navItems = allNavItems.filter((item) => item.allowed);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Persistent Collapsible Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative hidden md:flex flex-col h-screen bg-[#0a0f1a] border-r border-white/[0.06] overflow-hidden shrink-0 z-30"
      >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] min-h-[65px]">
        <Link href="/admin" className="flex items-center gap-3 group shrink-0">
          <span className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-heading font-black text-black text-sm shadow-[0_0_16px_rgba(20,184,160,0.4)] group-hover:scale-105 transition-transform">
            N
          </span>
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
                <span className="text-[10px] text-primary-400 font-mono font-medium">Admin Panel</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                active
                  ? "bg-primary-500/15 text-primary-300 shadow-[inset_0_0_0_1px_rgba(20,184,160,0.2)]"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="admin-sidebar-active"
                  className="absolute inset-0 rounded-xl bg-primary-500/10 border border-primary-500/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`shrink-0 relative z-10 ${active ? "text-primary-400" : "text-neutral-500 group-hover:text-neutral-300"}`}>
                {item.icon}
              </span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative z-10 whitespace-nowrap flex items-center gap-2"
                  >
                    {item.label}
                    {item.badge != null && item.badge > 0 && (
                      <span className="h-4 min-w-4 px-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold font-mono flex items-center justify-center">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Collapsed badge dot */}
              {collapsed && item.badge != null && item.badge > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: Environment Switcher & Sign Out */}
      <div className="border-t border-white/[0.06] px-2 py-3 space-y-1">
        {/* Switch to Client Dashboard */}
        <Link
          href="/dashboard"
          title={collapsed ? "Client Dashboard" : undefined}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-primary-300 hover:text-white bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/25 transition-all duration-150 shadow-[0_0_12px_rgba(20,184,160,0.15)]"
        >
          <span className="shrink-0 text-base leading-none">📊</span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Client Dashboard →
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Back to site */}
        <Link
          href="/"
          title={collapsed ? "Agency Main Site" : undefined}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/[0.05] transition-all duration-150"
        >
          <span className="shrink-0 text-neutral-400 text-sm leading-none">🌐</span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Agency Main Site
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {/* Sign out */}
        <button
          onClick={handleSignOut}
          title={collapsed ? "Sign Out" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150"
        >
          <span className="shrink-0"><PowerIcon /></span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User Profile Chip with Interactive Dropdown Popover */}
        <div className="relative mt-2 pt-2 border-t border-white/[0.06]" ref={sidebarProfileRef}>
          <button
            type="button"
            onClick={() => setSidebarProfileOpen(!sidebarProfileOpen)}
            className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/[0.06] transition-all cursor-pointer group text-left ${collapsed ? "justify-center" : ""}`}
            aria-label="User Profile Options"
            aria-expanded={sidebarProfileOpen}
          >
            <div className="relative h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-primary-500/30 to-amber-500/20 border border-primary-500/30 flex items-center justify-center font-bold text-[10px] text-primary-300 shadow-inner group-hover:scale-105 transition-transform">
              {user?.name?.slice(0, 2).toUpperCase() || "MH"}
              {userRole === "superadmin" && (
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-400 border border-black flex items-center justify-center text-[8px] text-black font-black" title="Owner / Super Admin">
                  ★
                </span>
              )}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-white truncate leading-none group-hover:text-primary-300 transition-colors">
                    {user?.name || "Admin"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-[9px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded border ${
                      userRole === "superadmin"
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        : userRole === "manager"
                        ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                        : userRole === "developer"
                        ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                        : userRole === "support"
                        ? "bg-teal-500/15 text-teal-300 border-teal-500/30"
                        : "bg-primary-500/15 text-primary-300 border-primary-500/30"
                    }`}>
                      {userRole === "superadmin" ? "Owner / Super Admin" : userRole}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <span className="text-[10px] text-neutral-500 group-hover:text-neutral-300 transition-colors">
                ▴
              </span>
            )}
          </button>

          {/* Upward Dropdown Menu */}
          <AnimatePresence>
            {sidebarProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute bottom-full mb-2 ${collapsed ? "left-12" : "left-0"} w-72 bg-[#0c1322]/95 backdrop-blur-2xl border border-white/[0.1] shadow-[0_24px_70px_rgba(0,0,0,0.85)] rounded-2xl p-2.5 z-50 overflow-hidden`}
              >
                {/* User Info Header */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-white/[0.03] to-transparent border border-amber-500/20 mb-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white truncate">
                      {user?.name || "MD.MAHFUZUL HAQUE"}
                    </p>
                    <span className="text-[9px] px-2 py-0.5 rounded-full border border-amber-400/30 bg-amber-400/15 text-amber-300 font-mono capitalize">
                      👑 {userRole === "superadmin" ? "Super Admin" : userRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {user?.email || "mdmahfuzulhaque3140@gmail.com"}
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Session
                    </span>
                    <span className="text-neutral-500 font-mono">RBAC Active</span>
                  </div>
                </div>

                {/* Quick Navigation Links */}
                <div className="space-y-1 text-xs">
                  <Link
                    href="/admin/workspace"
                    onClick={() => setSidebarProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <span className="text-sm">⚡</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">Personal Workspace</p>
                      <p className="text-[10px] text-neutral-400 truncate">Your tasks & sprint tracker</p>
                    </div>
                  </Link>

                  {isSuperAdminOrAdmin && (
                    <Link
                      href="/admin/team"
                      onClick={() => setSidebarProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <span className="text-sm">👥</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white">Team Members & Access</p>
                        <p className="text-[10px] text-neutral-400 truncate">Manage staff roles & permissions</p>
                      </div>
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    onClick={() => setSidebarProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-primary-300 hover:text-white hover:bg-primary-500/15 transition-colors border border-primary-500/20"
                  >
                    <span className="text-sm">📊</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary-300">Client Dashboard Portal</p>
                      <p className="text-[10px] text-neutral-400 truncate">Deliverables, milestones & generator</p>
                    </div>
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setSidebarProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <span className="text-sm">🌐</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">Main Agency Website</p>
                      <p className="text-[10px] text-neutral-400 truncate">Public website & case studies</p>
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
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] h-6 w-6 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-primary-500/40 shadow-lg transition-all hover:scale-110 z-50"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronLeftIcon />
        </motion.span>
      </button>
    </motion.aside>

    {/* Mobile Slide-Out Drawer with Backdrop */}
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
          />
          {/* Slide-out Drawer */}
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-72 md:hidden bg-[#0a0f1a] border-r border-white/[0.08] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* Mobile Drawer Header with Close Button */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
              <Link
                href="/admin"
                onClick={onCloseMobile}
                className="flex items-center gap-3 group shrink-0"
              >
                <span className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-heading font-black text-black text-sm shadow-[0_0_16px_rgba(20,184,160,0.4)]">
                  N
                </span>
                <div className="flex flex-col leading-none">
                  <span className="font-heading font-bold text-sm text-white tracking-tight">Nexora</span>
                  <span className="text-[10px] text-primary-400 font-mono font-medium">Admin Panel</span>
                </div>
              </Link>

              <button
                type="button"
                onClick={onCloseMobile}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-label="Close navigation"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Nav Items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      active
                        ? "bg-primary-500/15 text-primary-300 border border-primary-500/25 shadow-inner"
                        : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={active ? "text-primary-400" : "text-neutral-500"}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge != null && item.badge > 0 && (
                      <span className="h-4 min-w-4 px-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold font-mono flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Quick Navigation Actions */}
            <div className="border-t border-white/[0.06] px-3 py-3 space-y-1">
              <Link
                href="/dashboard"
                onClick={onCloseMobile}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-primary-300 bg-primary-500/10 border border-primary-500/25 transition-all shadow-sm"
              >
                <span className="text-base">📊</span>
                <span>Client Dashboard Portal →</span>
              </Link>
              <Link
                href="/"
                onClick={onCloseMobile}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-all"
              >
                <span className="text-base">🌐</span>
                <span>Agency Main Website</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  onCloseMobile?.();
                  await handleSignOut();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
              >
                <PowerIcon />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Mobile Profile Card */}
            <div className="p-3 border-t border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-primary-500/30 to-amber-500/20 border border-primary-500/30 flex items-center justify-center font-bold text-[10px] text-primary-300">
                  {user?.name?.slice(0, 2).toUpperCase() || "MH"}
                  {userRole === "superadmin" && (
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-400 border border-black flex items-center justify-center text-[8px] text-black font-black">
                      ★
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate leading-none">{user?.name || "Admin"}</p>
                  <p className="text-[10px] text-amber-300 font-mono capitalize mt-1 truncate">
                    {userRole === "superadmin" ? "Owner / Super Admin" : userRole}
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  </>
  );
}
