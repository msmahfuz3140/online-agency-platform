"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredUser, type UserSession } from "@/lib/auth-client";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToastPortal } from "@/components/ui/useToastPortal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://online-agency-platform-backend.vercel.app";

export interface TeamStaff {
  id: string;
  name: string;
  email: string;
  role:
    | "superadmin"
    | "admin"
    | "manager"
    | "developer"
    | "support"
    | "editor"
    | "cyber_security"
    | "ethical_hacker"
    | "digital_marketer"
    | "graphics_designer"
    | string;
  department: string;
  title: string;
  permissions: string[];
  status: "active" | "suspended";
  avatar: string;
  createdAt: string;
}

export const ROLE_CATEGORIES = [
  { id: "all", label: "All Staff", icon: "👥" },
  { id: "developer", label: "Developer", icon: "⚡" },
  { id: "cyber_security", label: "Cyber Security", icon: "🛡️" },
  { id: "ethical_hacker", label: "Ethical Hacker", icon: "⚔️" },
  { id: "digital_marketer", label: "Digital Marketer", icon: "📈" },
  { id: "graphics_designer", label: "Graphics Design", icon: "🎨" },
  { id: "superadmin", label: "Super Admin", icon: "👑" },
];

const ALL_PERMISSIONS = [
  { id: "manage_requests", label: "Manage Project Requests", desc: "View, assign, and update client project requests" },
  { id: "reply_messages", label: "Reply to Client Messages", desc: "Access contact inquiries and customer support inbox" },
  { id: "view_users", label: "View Client Accounts", desc: "Browse registered client accounts and activity" },
  { id: "view_analytics", label: "Platform Analytics", desc: "Access revenue, growth, and conversion metrics" },
  { id: "manage_team", label: "Manage Team Access", desc: "Add staff, edit roles, and assign permissions (Superadmin only)" },
];

export default function AdminTeamPage() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [team, setTeam] = useState<TeamStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<TeamStaff | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; member: TeamStaff | null }>({
    open: false,
    member: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "developer" as TeamStaff["role"],
    department: "Computer Science & Technology (CST)",
    title: "Software Engineer",
    permissions: ["manage_requests", "view_analytics"],
  });

  const { toast, ToastPortal } = useToastPortal();

  const isSuperAdminOrAdmin =
    currentUser?.role === "superadmin" || currentUser?.role === "admin";

  const loadTeam = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/team`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setTeam(json.data || []);
      } else {
        toast("error", "Error", "Failed to load team members");
      }
    } catch {
      toast("error", "Network Error", "Unable to connect to backend service");
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    setCurrentUser(getStoredUser());
    loadTeam();
  }, [loadTeam]);

  // Filtered members
  const filteredTeam = team.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase());

    let matchesRole = false;
    if (selectedRole === "all") {
      matchesRole = true;
    } else if (selectedRole === "developer") {
      matchesRole = m.role === "developer";
    } else if (selectedRole === "cyber_security") {
      matchesRole = m.role === "cyber_security";
    } else if (selectedRole === "ethical_hacker") {
      matchesRole = m.role === "ethical_hacker";
    } else if (selectedRole === "digital_marketer") {
      matchesRole = m.role === "digital_marketer" || m.role === "editor";
    } else if (selectedRole === "graphics_designer") {
      matchesRole = m.role === "graphics_designer";
    } else if (selectedRole === "superadmin") {
      matchesRole = m.role === "superadmin" || m.role === "admin";
    } else {
      matchesRole = m.role === selectedRole;
    }

    return matchesSearch && matchesRole;
  });

  // Handle Add Member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast("error", "Validation Error", "Please provide name and email.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast("success", "Team Member Added", data.message || `${formData.name} added to the team!`);
        setAddModalOpen(false);
        setFormData({
          name: "",
          email: "",
          role: "developer",
          department: "Computer Science & Technology (CST)",
          title: "Software Engineer",
          permissions: ["manage_requests", "view_analytics"],
        });
        await loadTeam();
      } else {
        toast("error", "Failed", data.message || "Failed to add member");
      }
    } catch {
      toast("error", "Network Error", "Could not reach the server");
    }
    setActionLoading(false);
  };

  // Handle Edit Member
  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMember) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/team/${editMember.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          role: editMember.role,
          department: editMember.department,
          title: editMember.title,
          permissions: editMember.permissions,
          status: editMember.status,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast("success", "Access Updated", `${editMember.name}'s permissions updated successfully.`);
        setEditMember(null);
        await loadTeam();
      } else {
        toast("error", "Failed", data.message || "Could not update team member");
      }
    } catch {
      toast("error", "Network Error", "Failed to reach server");
    }
    setActionLoading(false);
  };

  // Handle Toggle Suspend/Active
  const handleToggleStatus = async (member: TeamStaff) => {
    const newStatus = member.status === "active" ? "suspended" : "active";
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast(
          "success",
          "Status Changed",
          `${member.name} is now ${newStatus}.`
        );
        await loadTeam();
      }
    } catch {
      toast("error", "Error", "Failed to toggle status");
    }
  };

  // Handle Remove Member
  const handleConfirmDelete = async () => {
    if (!deleteConfirm.member) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/team/${deleteConfirm.member.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast("success", "Access Revoked", `${deleteConfirm.member.name} removed from team access.`);
        await loadTeam();
      } else {
        toast("error", "Error", "Failed to remove team member");
      }
    } catch {
      toast("error", "Network Error", "Server unreachable");
    }
    setActionLoading(false);
    setDeleteConfirm({ open: false, member: null });
  };

  const getRoleTheme = (role: string) => {
    switch (role) {
      case "superadmin":
      case "admin":
        return {
          bg: "from-amber-500/20 to-amber-600/5",
          border: "border-amber-500/30",
          text: "text-amber-300",
          glow: "rgba(245, 158, 11, 0.25)",
        };
      case "developer":
        return {
          bg: "from-emerald-500/20 to-teal-600/5",
          border: "border-emerald-500/30",
          text: "text-emerald-300",
          glow: "rgba(16, 185, 129, 0.25)",
        };
      case "cyber_security":
        return {
          bg: "from-blue-500/20 to-indigo-600/5",
          border: "border-blue-500/30",
          text: "text-blue-300",
          glow: "rgba(59, 130, 246, 0.25)",
        };
      case "ethical_hacker":
        return {
          bg: "from-purple-500/20 to-violet-600/5",
          border: "border-purple-500/30",
          text: "text-purple-300",
          glow: "rgba(168, 85, 247, 0.25)",
        };
      case "digital_marketer":
      case "editor":
        return {
          bg: "from-sky-500/20 to-cyan-600/5",
          border: "border-sky-500/30",
          text: "text-sky-300",
          glow: "rgba(14, 165, 233, 0.25)",
        };
      case "graphics_designer":
        return {
          bg: "from-amber-500/20 to-orange-600/5",
          border: "border-amber-500/30",
          text: "text-amber-300",
          glow: "rgba(245, 158, 11, 0.25)",
        };
      case "manager":
        return {
          bg: "from-purple-500/20 to-purple-600/5",
          border: "border-purple-500/30",
          text: "text-purple-300",
          glow: "rgba(168, 85, 247, 0.25)",
        };
      case "support":
        return {
          bg: "from-teal-500/20 to-teal-600/5",
          border: "border-teal-500/30",
          text: "text-teal-300",
          glow: "rgba(20, 184, 160, 0.25)",
        };
      default:
        return {
          bg: "from-neutral-800 to-neutral-900",
          border: "border-white/10",
          text: "text-neutral-300",
          glow: "rgba(255, 255, 255, 0.05)",
        };
    }
  };

  return (
    <div className="min-h-screen">
      <AdminTopBar
        title="Team Members & Roles"
        subtitle="Manage agency staff members, grant operational permissions, and oversee team performance"
        user={currentUser}
      />

      <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
        {/* Superadmin Ownership Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#0e1626]/80 to-primary-500/5 border border-amber-500/25 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-14 -right-14 w-52 h-52 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5 min-w-0 w-full md:w-auto">
              <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-amber-400/30 via-primary-500/20 to-surface-2 border border-amber-400/40 flex items-center justify-center text-amber-300 text-lg sm:text-xl font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)] shrink-0 mt-0.5 sm:mt-0">
                👑
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="font-heading font-extrabold text-white text-base sm:text-xl tracking-tight leading-snug break-words">
                    Primary Access & Role-Based Control Center
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-semibold shrink-0 shadow-sm">
                    🛡️ Owner Protected
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 leading-relaxed max-w-2xl break-words">
                  Main access remains with you (Super Admin). Team members (Managers, Developers, Support) receive tailored personal dashboards and access restricted to their assigned tasks.
                </p>
              </div>
            </div>

            {isSuperAdminOrAdmin && (
              <div className="w-full md:w-auto shrink-0 pt-1 md:pt-0">
                <Button
                  variant="primary"
                  onClick={() => setAddModalOpen(true)}
                  className="w-full md:w-auto text-xs py-2.5 px-4 shadow-[0_0_20px_rgba(20,184,160,0.35)] flex items-center justify-center gap-2 font-heading font-bold rounded-xl cursor-pointer"
                >
                  <span>+ Give Access / Add Member</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] backdrop-blur-md shadow-sm">
            <p className="text-[11px] sm:text-xs text-neutral-400 font-medium truncate">Total Staff Members</p>
            <p className="text-xl sm:text-2xl font-bold font-heading text-white mt-0.5 sm:mt-1">{team.length}</p>
            <p className="text-[10px] sm:text-[11px] text-emerald-400 mt-0.5 sm:mt-1 truncate">● All Active Staff</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] backdrop-blur-md shadow-sm">
            <p className="text-[11px] sm:text-xs text-neutral-400 font-medium truncate">Developers</p>
            <p className="text-xl sm:text-2xl font-bold font-heading text-emerald-300 mt-0.5 sm:mt-1">
              {team.filter((t) => t.role === "developer").length}
            </p>
            <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 sm:mt-1 truncate">Full-Stack & Systems</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] backdrop-blur-md shadow-sm">
            <p className="text-[11px] sm:text-xs text-neutral-400 font-medium truncate">Cyber & Ethical Hacker</p>
            <p className="text-xl sm:text-2xl font-bold font-heading text-cyan-300 mt-0.5 sm:mt-1">
              {team.filter((t) => t.role === "cyber_security" || t.role === "ethical_hacker").length}
            </p>
            <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 sm:mt-1 truncate">Security & Penetration</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] backdrop-blur-md shadow-sm">
            <p className="text-[11px] sm:text-xs text-neutral-400 font-medium truncate">Marketing & Graphics</p>
            <p className="text-xl sm:text-2xl font-bold font-heading text-amber-300 mt-0.5 sm:mt-1">
              {team.filter((t) => t.role === "digital_marketer" || t.role === "graphics_designer" || t.role === "editor").length}
            </p>
            <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 sm:mt-1 truncate">Ads & UI/UX Design</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          {/* Role / Category pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ROLE_CATEGORIES.map((cat) => {
              const count =
                cat.id === "all"
                  ? team.length
                  : cat.id === "developer"
                  ? team.filter((t) => t.role === "developer").length
                  : cat.id === "cyber_security"
                  ? team.filter((t) => t.role === "cyber_security").length
                  : cat.id === "ethical_hacker"
                  ? team.filter((t) => t.role === "ethical_hacker").length
                  : cat.id === "digital_marketer"
                  ? team.filter((t) => t.role === "digital_marketer" || t.role === "editor").length
                  : cat.id === "graphics_designer"
                  ? team.filter((t) => t.role === "graphics_designer").length
                  : cat.id === "superadmin"
                  ? team.filter((t) => t.role === "superadmin" || t.role === "admin").length
                  : team.filter((t) => t.role === cat.id).length;

              const isSelected = selectedRole === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedRole(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer border ${
                    isSelected
                      ? "bg-primary-500 text-black border-primary-400 font-bold shadow-[0_0_14px_rgba(20,184,160,0.35)]"
                      : "bg-white/[0.04] text-neutral-300 border-white/[0.08] hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-black/20 text-neutral-950 font-bold"
                        : "bg-white/10 text-neutral-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team members…"
              className="w-full pl-9 pr-3 py-2 sm:py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Team Members Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-sm text-neutral-400">No team members match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTeam.map((member) => {
              const theme = getRoleTheme(member.role);
              const isOwner = member.role === "superadmin";

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative p-5 rounded-2xl bg-gradient-to-br ${theme.bg} border ${theme.border} backdrop-blur-md transition-all duration-200 hover:border-white/20`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center font-heading font-black text-white text-base shadow-lg">
                        {member.avatar || member.name.slice(0, 2).toUpperCase()}
                        {isOwner && (
                          <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-amber-400 text-black border border-black flex items-center justify-center text-[10px] font-bold shadow-md">
                            👑
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-white text-sm">
                            {member.name}
                          </h4>
                          <StatusBadge status={member.status} />
                        </div>
                        <p className="text-xs text-neutral-300 font-medium mt-0.5">{member.title}</p>
                        <p className="text-[11px] text-neutral-400 font-mono">{member.email}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <StatusBadge status={member.role} />
                    </div>
                  </div>

                  {/* Department & Info */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
                    <span className="truncate max-w-[220px]">
                      🏢 {member.department}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Joined {new Date(member.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Permissions Chips */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {member.permissions && member.permissions.length > 0 ? (
                      member.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.06] text-neutral-300 border border-white/[0.06]"
                        >
                          ✓ {perm.replace("_", " ")}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-neutral-500 italic">No custom permissions</span>
                    )}
                  </div>

                  {/* Action Bar (Superadmin only) */}
                  {isSuperAdminOrAdmin && (
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditMember(member)}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 transition-colors flex items-center gap-1.5"
                        >
                          <span>🔑</span>
                          <span>Give / Edit Access</span>
                        </button>
                        {!isOwner && (
                          <button
                            onClick={() => handleToggleStatus(member)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                              member.status === "active"
                                ? "text-orange-400 hover:bg-orange-500/10 border-orange-500/20"
                                : "text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20"
                            }`}
                          >
                            {member.status === "active" ? "Suspend" : "Activate"}
                          </button>
                        )}
                      </div>

                      {!isOwner && (
                        <button
                          onClick={() => setDeleteConfirm({ open: true, member })}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
                          title="Revoke team access"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── ADD TEAM MEMBER / GIVE ACCESS MODAL ─── */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Give Access / Add Team Member"
        description="Invite or assign staff access with a designated category role and granular permissions."
        size="md"
        actions={
          <>
            <Button variant="ghost" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddMember} disabled={actionLoading}>
              {actionLoading ? "Saving…" : "Save & Grant Access"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Jahidul Islam"
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-primary-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Work Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. jahidul@nexora.agency"
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-primary-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Assigned Role / Access Category</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as TeamStaff["role"] })}
                className="w-full px-3 py-2 rounded-xl bg-[#1e293b] border border-white/10 text-xs text-white focus:outline-none focus:border-primary-500/50"
              >
                <option value="developer">⚡ Developer (Full-Stack & Systems)</option>
                <option value="cyber_security">🛡️ Cyber Security Specialist</option>
                <option value="ethical_hacker">⚔️ Ethical Hacker & Security Auditor</option>
                <option value="digital_marketer">📈 Digital Marketer & Ads Specialist</option>
                <option value="graphics_designer">🎨 Graphics & UI/UX Designer</option>
                <option value="manager">📊 Operations Manager</option>
                <option value="support">🎧 Client Support Specialist</option>
                <option value="admin">🔑 Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Computer Science & Tech"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-primary-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Lead UI/UX Designer"
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-primary-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">Granular Permissions</label>
            <div className="space-y-2">
              {ALL_PERMISSIONS.map((perm) => {
                const checked = formData.permissions.includes(perm.id);
                return (
                  <label
                    key={perm.id}
                    className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked
                          ? formData.permissions.filter((p) => p !== perm.id)
                          : [...formData.permissions, perm.id];
                        setFormData({ ...formData, permissions: next });
                      }}
                      className="mt-0.5 rounded border-white/20 text-primary-500 focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-medium text-white">{perm.label}</p>
                      <p className="text-[10px] text-neutral-400">{perm.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </form>
      </Modal>

      {/* ─── EDIT MEMBER / GIVE ACCESS MODAL ─── */}
      <Modal
        open={Boolean(editMember)}
        onClose={() => setEditMember(null)}
        title={`Give Access / Edit Role: ${editMember?.name}`}
        description="Update staff access role category, job title, and permissions."
        size="md"
        actions={
          <>
            <Button variant="ghost" onClick={() => setEditMember(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateMember} disabled={actionLoading}>
              {actionLoading ? "Saving…" : "Apply Access Updates"}
            </Button>
          </>
        }
      >
        {editMember && (
          <form onSubmit={handleUpdateMember} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Assigned Role / Access Category</label>
                <select
                  value={editMember.role}
                  onChange={(e) =>
                    setEditMember({ ...editMember, role: e.target.value as TeamStaff["role"] })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#1e293b] border border-white/10 text-xs text-white focus:outline-none focus:border-primary-500/50"
                >
                  <option value="developer">⚡ Developer (Full-Stack & Systems)</option>
                  <option value="cyber_security">🛡️ Cyber Security Specialist</option>
                  <option value="ethical_hacker">⚔️ Ethical Hacker & Security Auditor</option>
                  <option value="digital_marketer">📈 Digital Marketer & Ads Specialist</option>
                  <option value="graphics_designer">🎨 Graphics & UI/UX Designer</option>
                  <option value="superadmin">👑 Super Admin / Owner</option>
                  <option value="manager">📊 Operations Manager</option>
                  <option value="support">🎧 Client Support Specialist</option>
                  <option value="admin">🔑 Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Status</label>
                <select
                  value={editMember.status}
                  onChange={(e) =>
                    setEditMember({
                      ...editMember,
                      status: e.target.value as "active" | "suspended",
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#1e293b] border border-white/10 text-xs text-white focus:outline-none focus:border-primary-500/50"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Department</label>
              <input
                type="text"
                value={editMember.department}
                onChange={(e) => setEditMember({ ...editMember, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-primary-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Job Title</label>
              <input
                type="text"
                value={editMember.title}
                onChange={(e) => setEditMember({ ...editMember, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-primary-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">Permissions</label>
              <div className="space-y-2">
                {ALL_PERMISSIONS.map((perm) => {
                  const checked = editMember.permissions?.includes(perm.id);
                  return (
                    <label
                      key={perm.id}
                      className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const currentPerms = editMember.permissions || [];
                          const next = checked
                            ? currentPerms.filter((p) => p !== perm.id)
                            : [...currentPerms, perm.id];
                          setEditMember({ ...editMember, permissions: next });
                        }}
                        className="mt-0.5 rounded border-white/20 text-primary-500 focus:ring-0"
                      />
                      <div>
                        <p className="text-xs font-medium text-white">{perm.label}</p>
                        <p className="text-[10px] text-neutral-400">{perm.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* ─── CONFIRM DELETE MODAL ─── */}
      <ConfirmModal
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, member: null })}
        onConfirm={handleConfirmDelete}
        title="Revoke Team Access?"
        description={`Are you sure you want to remove ${deleteConfirm.member?.name} from staff access? Their account will be converted to a regular user.`}
        confirmLabel="Revoke Access"
        loading={actionLoading}
      />

      <ToastPortal />
    </div>
  );
}
