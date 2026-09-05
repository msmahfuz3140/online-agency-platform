"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export type WorkspaceId = "website" | "dashboard" | "admin";

interface WorkspaceSwitcherProps {
  current: WorkspaceId;
  userRole?: string;
  isStaff?: boolean;
  compact?: boolean;
  align?: "left" | "right";
  className?: string;
}

interface WorkspaceOption {
  id: WorkspaceId;
  name: string;
  desc: string;
  href: string;
  icon: string;
  badge: string;
  accent: string;
  badgeColor: string;
}

const WORKSPACES: WorkspaceOption[] = [
  {
    id: "website",
    name: "Main Agency Flagship",
    desc: "Public agency site, portfolio, services & pricing",
    href: "/",
    icon: "🌐",
    badge: "Public Site",
    accent: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300",
    badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  },
  {
    id: "dashboard",
    name: "Client Portal & Sprints",
    desc: "Project milestone tracker, AI website generator & deliverables",
    href: "/dashboard",
    icon: "📊",
    badge: "Client Cockpit",
    accent: "from-primary-500/20 to-teal-500/10 border-primary-500/30 text-primary-300",
    badgeColor: "bg-primary-500/15 text-primary-300 border-primary-500/30",
  },
  {
    id: "admin",
    name: "Admin Executive Hub",
    desc: "Team RBAC access control, requests, clients & platform metrics",
    href: "/admin",
    icon: "🛡️",
    badge: "Executive",
    accent: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
];

export function WorkspaceSwitcher({
  current,
  compact = false,
  align = "left",
  className = "",
}: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentWorkspace = WORKSPACES.find((w) => w.id === current) || WORKSPACES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer group shrink-0 ${
          current === "admin"
            ? "bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-200"
            : current === "dashboard"
            ? "bg-primary-500/10 border-primary-500/30 hover:bg-primary-500/20 text-primary-200"
            : "bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] text-neutral-200"
        }`}
        aria-label="Switch Workspace"
        aria-expanded={isOpen}
      >
        <span className="text-sm shrink-0">{currentWorkspace.icon}</span>

        {!compact && (
          <div className="hidden sm:flex flex-col text-left leading-none">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold font-heading truncate max-w-[110px] md:max-w-[160px]">
                {currentWorkspace.name.split(" ")[0]} {currentWorkspace.name.split(" ")[1]}
              </span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono border ${currentWorkspace.badgeColor} hidden md:inline-block`}>
                {currentWorkspace.badge}
              </span>
            </div>
          </div>
        )}

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-[10px] text-neutral-400 group-hover:text-white shrink-0 ml-0.5"
        >
          ▾
        </motion.span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop for seamless tap-outside */}
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className={`fixed sm:absolute top-16 sm:top-full mt-0 sm:mt-2 left-3 right-3 sm:left-auto sm:right-auto ${
                align === "right" ? "sm:right-0 sm:left-auto" : "sm:left-0 sm:right-auto"
              } max-w-sm sm:w-80 mx-auto sm:mx-0 rounded-2xl bg-[#0b1220]/95 backdrop-blur-2xl border border-white/[0.1] shadow-[0_24px_70px_rgba(0,0,0,0.85)] p-2.5 z-50 overflow-hidden`}
            >
            {/* Header */}
            <div className="px-3 py-2 mb-1.5 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                <span>🔄</span> Switch Environment
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">Nexora Ecosystem</span>
            </div>

            {/* List of environments */}
            <div className="space-y-1.5">
              {WORKSPACES.map((ws) => {
                const isActive = ws.id === current;
                return (
                  <Link
                    key={ws.id}
                    href={ws.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all group ${
                      isActive
                        ? "bg-white/[0.08] border-white/[0.15] shadow-sm"
                        : "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.1]"
                    }`}
                  >
                    <span className="text-xl p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] shrink-0 mt-0.5 shadow-inner">
                      {ws.icon}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white group-hover:text-primary-300 transition-colors truncate">
                          {ws.name}
                        </span>
                        {isActive ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono font-semibold shrink-0">
                            Active
                          </span>
                        ) : (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full border font-mono shrink-0 ${ws.badgeColor}`}>
                            {ws.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug line-clamp-2">
                        {ws.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Footer status */}
            <div className="mt-2.5 pt-2 border-t border-white/[0.06] px-2 flex items-center justify-between text-[10px] text-neutral-500">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Unified Session Sync</span>
              </span>
              <span className="font-mono">Single Sign-On (SSO)</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </div>
  );
}
