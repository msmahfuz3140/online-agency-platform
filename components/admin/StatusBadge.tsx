"use client";

import React from "react";

type StatusVariant =
  | "pending" | "reviewing" | "in-progress" | "review-ready" | "completed" | "cancelled"
  | "unread" | "read" | "archived" | "replied"
  | "user" | "admin" | "superadmin" | "manager" | "developer" | "support" | "editor"
  | "cyber_security" | "ethical_hacker" | "digital_marketer" | "graphics_designer"
  | "active" | "blocked" | "suspended";

const variantMap: Record<StatusVariant, { dot: string; text: string; bg: string; border: string }> = {
  pending:           { dot: "bg-amber-400",   text: "text-amber-300",   bg: "bg-amber-500/10",   border: "border-amber-500/25" },
  reviewing:         { dot: "bg-indigo-400",  text: "text-indigo-300",  bg: "bg-indigo-500/10",  border: "border-indigo-500/25" },
  "in-progress":     { dot: "bg-blue-400",    text: "text-blue-300",    bg: "bg-blue-500/10",    border: "border-blue-500/25" },
  "review-ready":    { dot: "bg-cyan-400",    text: "text-cyan-300",    bg: "bg-cyan-500/10",    border: "border-cyan-500/25" },
  completed:         { dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
  cancelled:         { dot: "bg-red-400",     text: "text-red-300",     bg: "bg-red-500/10",     border: "border-red-500/25" },
  unread:            { dot: "bg-amber-400",   text: "text-amber-300",   bg: "bg-amber-500/10",   border: "border-amber-500/25" },
  read:              { dot: "bg-neutral-500", text: "text-neutral-400", bg: "bg-neutral-500/10", border: "border-neutral-500/20" },
  archived:          { dot: "bg-neutral-600", text: "text-neutral-500", bg: "bg-neutral-700/10", border: "border-neutral-600/20" },
  replied:           { dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
  user:              { dot: "bg-neutral-500", text: "text-neutral-400", bg: "bg-neutral-500/10", border: "border-neutral-500/20" },
  admin:             { dot: "bg-primary-400", text: "text-primary-300", bg: "bg-primary-500/10", border: "border-primary-500/25" },
  superadmin:        { dot: "bg-amber-400",   text: "text-amber-300",   bg: "bg-amber-500/15",   border: "border-amber-400/40" },
  manager:           { dot: "bg-purple-400",  text: "text-purple-300",  bg: "bg-purple-500/10",  border: "border-purple-500/25" },
  developer:         { dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
  cyber_security:    { dot: "bg-blue-400",    text: "text-blue-300",    bg: "bg-blue-500/10",    border: "border-blue-500/25" },
  ethical_hacker:    { dot: "bg-purple-400",  text: "text-purple-300",  bg: "bg-purple-500/10",  border: "border-purple-500/25" },
  digital_marketer:  { dot: "bg-sky-400",     text: "text-sky-300",     bg: "bg-sky-500/10",     border: "border-sky-500/25" },
  graphics_designer: { dot: "bg-amber-400",   text: "text-amber-300",   bg: "bg-amber-500/10",   border: "border-amber-500/25" },
  support:           { dot: "bg-teal-400",    text: "text-teal-300",    bg: "bg-teal-500/10",    border: "border-teal-500/25" },
  editor:            { dot: "bg-sky-400",     text: "text-sky-300",     bg: "bg-sky-500/10",     border: "border-sky-500/25" },
  active:            { dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
  blocked:           { dot: "bg-red-400",     text: "text-red-300",     bg: "bg-red-500/10",     border: "border-red-500/25" },
  suspended:         { dot: "bg-orange-400",  text: "text-orange-300",  bg: "bg-orange-500/10",  border: "border-orange-500/25" },
};

const LABEL_OVERRIDES: Record<string, string> = {
  superadmin: "Super Admin",
  cyber_security: "Cyber Security",
  ethical_hacker: "Ethical Hacker",
  digital_marketer: "Digital Marketer",
  graphics_designer: "Graphics Design",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const key = status as StatusVariant;
  const style = variantMap[key] ?? {
    dot: "bg-neutral-500",
    text: "text-neutral-400",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/20",
  };

  const label =
    LABEL_OVERRIDES[status] ||
    status.charAt(0).toUpperCase() + status.slice(1).replace(/[-_]/g, " ");

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${style.bg} ${style.border} ${style.text} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot} shadow-[0_0_4px_currentColor]`} />
      {label}
    </span>
  );
}
