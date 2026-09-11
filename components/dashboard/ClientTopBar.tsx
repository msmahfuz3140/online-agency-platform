import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, type UserSession } from "@/lib/auth-client";
import { WorkspaceSwitcher } from "@/components/layout/WorkspaceSwitcher";
import { Logo } from "@/components/ui/Logo";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface LiveNotification {
  _id: string;
  recipientRole: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const notifIconMap: Record<string, string> = {
  project_request: "💼",
  project_review: "⭐",
  sprint_update: "⚡",
  message: "💬",
  reply: "✉️",
  user_register: "👤",
  payment: "💳",
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface ClientTopBarProps {
  user: UserSession | null;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenMobileSidebar?: () => void;
}

export function ClientTopBar({ user, activeTab, onSelectTab, onOpenMobileSidebar }: ClientTopBarProps) {
  const router = useRouter();
  const [time, setTime] = useState<string>("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Live Notifications State
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const emailParam = user?.email ? `&email=${encodeURIComponent(user.email)}` : "";
      const res = await fetch(`${API_BASE_URL}/api/notifications?role=client${emailParam}`);
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.notifications || []);
        setUnreadCount(json.unreadCount || 0);
      }
    } catch {}
  }, [user?.email]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/mark-all-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "client", email: user?.email }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleNotificationClick = async (n: LiveNotification) => {
    if (!n.read) {
      fetch(`${API_BASE_URL}/api/notifications/${n._id}/read`, { method: "PATCH" }).catch(() => {});
      setNotifications((prev) => prev.map((item) => (item._id === n._id ? { ...item, read: true } : item)));
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setNotifOpen(false);
    if (n.link) {
      if (n.link.includes("tab=") && onSelectTab && typeof window !== "undefined" && window.location.pathname === "/dashboard") {
        const tabMatch = n.link.match(/tab=([^&]+)/);
        if (tabMatch && tabMatch[1]) {
          onSelectTab(tabMatch[1]);
          return;
        }
      }
      router.push(n.link);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Click outside to close menus
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

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CL";

  const isStaff = [
    "superadmin",
    "admin",
    "manager",
    "developer",
    "support",
    "editor",
  ].includes((user?.role || "").toLowerCase()) || user?.email?.toLowerCase().includes("mahfuz");

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/[0.07] bg-[#080e1a]/90 backdrop-blur-2xl px-3 sm:px-6 lg:px-8 flex items-center justify-between transition-all shrink-0">
      {/* Left: Hamburger & Brand Identity & Environment Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Toggle Button */}
        {onOpenMobileSidebar && (
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="Open sidebar menu"
            className="md:hidden p-2 rounded-xl text-neutral-300 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all cursor-pointer shrink-0"
          >
            <div className="w-4 h-4 flex flex-col justify-center gap-[4px]">
              <span className="block h-0.5 w-4 bg-current rounded-full" />
              <span className="block h-0.5 w-4 bg-current rounded-full" />
              <span className="block h-0.5 w-4 bg-current rounded-full" />
            </div>
          </button>
        )}

        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Logo variant="horizontal" size="sm" subtitle="Client Portal" />
        </Link>

        <div className="h-4 w-px bg-white/[0.1] hidden sm:block shrink-0" />

        {/* Dedicated Environment Switcher */}
        <WorkspaceSwitcher current="dashboard" align="left" />

        {/* Live system clock & pulsing status */}
        <div className="hidden xl:flex items-center gap-2 ml-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">{time || "00:00:00"}</span>
          <span className="text-neutral-500">•</span>
          <span className="text-[10px] text-emerald-400 font-sans font-medium">99.99% Edge SLA</span>
        </div>
      </div>

      {/* Right: Quick actions, notifications, and profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick link to main site */}
        <Link
          href="/"
          className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]"
        >
          <span>🌐</span>
          <span>Main Site</span>
        </Link>

        {/* Active Plan Pill */}
        {user?.plan && user.plan !== "free" ? (
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold font-mono tracking-wider shadow-sm shrink-0 ${
              user.plan === "business"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                : "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-[0_0_12px_rgba(20,184,160,0.2)]"
            }`}
          >
            <span>{user.plan === "business" ? "💎" : "👑"}</span>
            <span className="uppercase">{user.plan}</span>
          </div>
        ) : (
          <Link
            href="/pricing"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-primary-500/30 text-xs text-neutral-300 hover:text-white transition-all shrink-0"
          >
            <span>Upgrade</span>
            <span className="text-primary-400">⚡</span>
          </Link>
        )}

        {/* AI Credits Pill */}
        <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-primary-500/15 border border-primary-500/30 text-primary-300 text-xs font-mono font-medium shadow-[0_0_12px_rgba(20,184,160,0.15)] shrink-0">
          <span>⚡</span>
          <span>{user?.aiCreditsRemaining ?? 5}</span>
          <span className="text-primary-500 hidden sm:inline">Credits</span>
        </div>

        {/* Staff / Admin executive link if applicable */}
        {isStaff && (
          <Link
            href="/admin"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 hover:border-amber-400 text-xs font-semibold shadow-[0_0_16px_rgba(245,158,11,0.2)] transition-all shrink-0"
          >
            <span>🛡️</span>
            <span>Admin Hub</span>
          </Link>
        )}

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-primary-500/40 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            aria-label="Notifications"
          >
            <span className="text-sm">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-primary-400 text-black font-black text-[9px] flex items-center justify-center shadow-[0_0_8px_rgba(20,184,160,0.8)] font-mono">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
                  onClick={() => setNotifOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  className="fixed sm:absolute top-16 sm:top-full mt-0 sm:mt-2 left-3 right-3 sm:left-auto sm:right-0 max-w-sm sm:w-84 mx-auto sm:mx-0 rounded-2xl bg-[#0e1626]/95 backdrop-blur-2xl border border-white/[0.1] shadow-[0_24px_64px_rgba(0,0,0,0.85)] p-3 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>🔔</span> Live Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary-500/20 border border-primary-500/40 text-primary-300 font-mono font-semibold">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-primary-400 hover:text-primary-300 underline cursor-pointer transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-1 text-xs max-h-80 overflow-y-auto [scrollbar-width:thin]">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-neutral-400">
                        <span className="text-2xl block mb-1">🎉</span>
                        All caught up! No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => handleNotificationClick(n)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${
                            !n.read
                              ? "bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1]"
                              : "hover:bg-white/[0.03] opacity-75 hover:opacity-100"
                          }`}
                        >
                          <span className="text-base shrink-0 mt-0.5">
                            {notifIconMap[n.type] || "🔔"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p
                                className={`text-[11px] font-semibold leading-snug truncate ${
                                  !n.read ? "text-white" : "text-neutral-300"
                                }`}
                              >
                                {n.title}
                              </p>
                              <span className="text-[9px] text-neutral-500 font-mono shrink-0">
                                {formatTimeAgo(n.createdAt)}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-primary-400 shrink-0 mt-1.5 shadow-[0_0_6px_rgba(20,184,160,0.6)]" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Monogram Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-primary-500/40 hover:bg-white/[0.08] transition-all cursor-pointer group shrink-0"
          >
            <div className="h-7 w-7 rounded-full overflow-hidden bg-gradient-to-br from-primary-500/30 via-primary-500/10 to-surface-2 border border-primary-500/40 flex items-center justify-center font-bold text-xs text-primary-300 shadow-[0_0_12px_rgba(20,184,160,0.2)] shrink-0">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                {user?.name || "Client"}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono capitalize leading-tight">
                {user?.role || "VIP Client"}
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
                  className="fixed sm:absolute top-16 sm:top-full mt-0 sm:mt-2 left-3 right-3 sm:left-auto sm:right-0 max-w-sm sm:w-72 mx-auto sm:mx-0 rounded-2xl bg-[#0e1626]/95 backdrop-blur-2xl border border-white/[0.1] shadow-[0_24px_70px_rgba(0,0,0,0.85)] p-2.5 z-50 overflow-hidden"
                >
                {/* User Info Header */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white truncate">
                      {user?.name || "Client"}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-primary-500/30 bg-primary-500/15 text-primary-300 font-mono capitalize">
                      {user?.role || "Client Pro"}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {user?.email || "user@nexora.agency"}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  {isStaff && (
                    <div className="mb-2 pb-2 border-b border-white/[0.08] space-y-1">
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                      >
                        <span className="text-sm">🛡️</span>
                        <span>Admin Executive Hub</span>
                      </Link>
                      <Link
                        href="/admin/team"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <span className="text-sm">👥</span>
                        <span>Team Members & Roles</span>
                      </Link>
                      <Link
                        href="/admin/workspace"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <span className="text-sm">⚡</span>
                        <span>Personal Workspace</span>
                      </Link>
                    </div>
                  )}

                  <Link
                    href="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-sm">⚙️</span>
                    <span>Account Settings</span>
                  </Link>

                  <Link
                    href="/request-project"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-sm">💼</span>
                    <span>Submit Project Brief</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-sm">💬</span>
                    <span>Contact Engineering Core</span>
                  </Link>
                </div>

                <div className="mt-2 pt-2 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <span>🚪</span>
                    <span className="font-semibold">Sign Out</span>
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
