"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getStoredUser, apiFetch, type UserSession } from "@/lib/auth-client";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/ui/Modal";
import { useToastPortal } from "@/components/ui/useToastPortal";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  aiCreditsRemaining: number;
  servicesCount?: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: "block" | "delete";
    targetUser: AdminUser | null;
  }>({ open: false, type: "block", targetUser: null });
  const [actionLoading, setActionLoading] = useState(false);

  // Role Change Modal State
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<AdminUser | null>(null);
  const [newRoleSelection, setNewRoleSelection] = useState<string>("user");
  const [roleLoading, setRoleLoading] = useState(false);

  const { toast, ToastPortal } = useToastPortal();

  const AVAILABLE_ROLES = [
    { id: "user", label: "User / Client", desc: "Default client access to personal dashboard and service briefs" },
    { id: "superadmin", label: "Super Admin", desc: "Full executive control over all settings, users, and system permissions" },
    { id: "admin", label: "Admin", desc: "Platform operations, orders, and sprint management" },
    { id: "manager", label: "Project Manager", desc: "Manages sprints, updates clients, reviews requests" },
    { id: "developer", label: "Software Engineer", desc: "Engineering implementation, technical deliverables" },
    { id: "cyber_security", label: "Cyber Security Specialist", desc: "Infrastructure protection and threat auditing" },
    { id: "ethical_hacker", label: "Ethical Hacker", desc: "Penetration testing and vulnerability assessment" },
    { id: "digital_marketer", label: "Digital Marketer", desc: "SEO campaigns, ad growth, and conversion funnels" },
    { id: "graphics_designer", label: "Graphics Designer", desc: "UI/UX prototypes, branding, creative design" },
    { id: "support", label: "Support Specialist", desc: "Client support inbox and inquiry management" },
    { id: "editor", label: "Content Editor", desc: "Publications and case studies management" },
  ];

  const getAdminHeaders = useCallback(() => {
    const stored = getStoredUser();
    const isMainAdmin = [
      "mdmahfuzulhaque3140@gmail.com",
      "mdmahfuzulhaque314@gmail.com",
    ].includes(stored?.email?.toLowerCase() || "");

    const effectiveRole = isMainAdmin ? "superadmin" : (stored?.role || "superadmin");
    const effectiveEmail = stored?.email || "mdmahfuzulhaque3140@gmail.com";

    const headers: Record<string, string> = {
      Accept: "application/json",
      "x-user-email": effectiveEmail,
      "x-user-role": effectiveRole,
    };
    if (stored?.id) headers["x-user-id"] = stored.id;
    return headers;
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const headers = getAdminHeaders();
      const res = await apiFetch("/api/admin/users?limit=100", {
        credentials: "include",
        headers,
      });

      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
      } else {
        toast("error", "Load Error", "Failed to fetch users from database.");
      }
    } catch {
      toast("error", "Load Error", "Failed to fetch users.");
    }
    setLoading(false);
  }, [getAdminHeaders, toast]);

  useEffect(() => {
    setUser(getStoredUser());
    loadUsers();
  }, [loadUsers]);

  const handleRowAction = (row: AdminUser, action: string) => {
    if (action === "block") {
      setConfirmModal({ open: true, type: "block", targetUser: row });
    } else if (action === "delete") {
      setConfirmModal({ open: true, type: "delete", targetUser: row });
    } else if (action === "change_role") {
      setSelectedUserForRole(row);
      setNewRoleSelection(row.role || "user");
      setRoleModalOpen(true);
    }
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForRole) return;

    setRoleLoading(true);
    try {
      const headers = {
        ...getAdminHeaders(),
        "Content-Type": "application/json",
      };

      const res = await apiFetch(`/api/admin/users/${selectedUserForRole.id}/role`, {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify({ role: newRoleSelection }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        toast("success", "Role Updated! 🛡️", `Assigned "${newRoleSelection}" role to ${selectedUserForRole.name}.`);
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUserForRole.id ? { ...u, role: newRoleSelection } : u))
        );
        setRoleModalOpen(false);
      } else {
        toast("error", "Update Failed", json.message || "Could not update user role.");
      }
    } catch {
      toast("error", "Network Error", "Failed to communicate with authentication service.");
    } finally {
      setRoleLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirmModal.targetUser) return;
    setActionLoading(true);
    try {
      const headers = getAdminHeaders();
      const { id } = confirmModal.targetUser;
      const endpoint =
        confirmModal.type === "delete"
          ? `/api/admin/users/${id}`
          : `/api/admin/users/${id}/block`;
      const method = confirmModal.type === "delete" ? "DELETE" : "PATCH";
      const res = await apiFetch(endpoint, { method, credentials: "include", headers });
      if (res.ok) {
        toast(
          "success",
          confirmModal.type === "delete" ? "User Deleted" : "User Updated",
          confirmModal.type === "delete"
            ? `${confirmModal.targetUser.name} has been deleted.`
            : `${confirmModal.targetUser.name} has been ${confirmModal.targetUser.isBlocked ? "unblocked" : "blocked"}.`
        );
        await loadUsers();
      } else {
        toast("error", "Action Failed", "Could not complete the action.");
      }
    } catch {
      toast("error", "Network Error", "Failed to reach the server.");
    }
    setActionLoading(false);
    setConfirmModal({ open: false, type: "block", targetUser: null });
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      label: "User",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-primary-500/20 border border-primary-500/20 flex items-center justify-center text-[10px] font-bold text-primary-400 shrink-0">
            {row.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground leading-none">{row.name}</p>
            <p className="text-[10px] text-muted-fg mt-0.5">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (row) => <StatusBadge status={row.role} />,
    },
    {
      key: "servicesCount",
      label: "Services Taken",
      sortable: true,
      render: (row) => {
        const count = row.servicesCount || 0;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
              count > 0
                ? "bg-primary-500/15 text-primary-400 border border-primary-500/30"
                : "bg-surface-2 dark:bg-white/[0.04] text-muted-fg border border-border"
            }`}
          >
            <span>💼</span>
            <span>{count} service{count === 1 ? "" : "s"}</span>
          </span>
        );
      },
    },
    {
      key: "isBlocked",
      label: "Status",
      render: (row) => <StatusBadge status={row.isBlocked ? "blocked" : "active"} />,
    },
    {
      key: "aiCreditsRemaining",
      label: "AI Credits",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-[11px] text-primary-400 font-semibold">
          ⚡ {row.aiCreditsRemaining} / 5
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      render: (row) => (
        <span className="text-[11px] text-muted-fg">
          {new Date(row.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ToastPortal />
      <AdminTopBar
        title="User Management"
        subtitle={`${users.length} registered users`}
        user={user}
        onSearch={setSearch}
      />

      <div className="p-3.5 sm:p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-foreground">All Users</h2>
            <p className="text-[11px] text-muted-fg mt-0.5">Manage user accounts, roles, access, and service orders</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-fg font-mono">{users.length} total</span>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={users}
          keyField="id"
          pageSize={10}
          loading={loading}
          searchValue={search}
          searchFields={["name", "email", "role"]}
          emptyMessage="No users found."
          onRowAction={handleRowAction}
          rowActions={(row) => [
            {
              label: "Assign Role 🛡️",
              action: "change_role",
              variant: "normal",
            },
            {
              label: row.isBlocked ? "Unblock" : "Block",
              action: "block",
              variant: row.isBlocked ? "normal" : "danger",
            },
            { label: "Delete", action: "delete", variant: "danger" },
          ]}
        />
      </div>

      {/* Change Role Modal */}
      {roleModalOpen && selectedUserForRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => !roleLoading && setRoleModalOpen(false)}
          />
          <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-2xl bg-surface-1 dark:bg-[#0c1322] border border-border dark:border-white/[0.1] shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-primary-500/15 text-primary-400 border border-primary-500/30">
                  🛡️ Role-Based Access Control (RBAC)
                </span>
                <h3 className="text-lg font-bold text-foreground mt-2">
                  Assign Role to {selectedUserForRole.name}
                </h3>
                <p className="text-xs text-muted-fg mt-0.5 font-mono">
                  {selectedUserForRole.email} • Current Role: <span className="text-primary-400 font-bold capitalize">{selectedUserForRole.role}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => !roleLoading && setRoleModalOpen(false)}
                className="text-muted-fg hover:text-foreground text-sm p-1 rounded-lg hover:bg-surface-2 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-foreground">
                  Select User Role:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {AVAILABLE_ROLES.map((r) => {
                    const isSelected = newRoleSelection === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setNewRoleSelection(r.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-primary-500/15 border-primary-500 text-foreground ring-1 ring-primary-500/50"
                            : "bg-surface-2/60 border-border hover:border-primary-500/30 text-muted-fg hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground capitalize">
                            {r.label}
                          </span>
                          {isSelected && <span className="text-xs text-primary-400">✓</span>}
                        </div>
                        <p className="text-[10px] text-muted-fg mt-1 line-clamp-2 leading-relaxed">
                          {r.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] leading-relaxed">
                💡 <strong>Important:</strong> Assigning a staff role (such as Super Admin, Admin, Manager, or Developer) grants dashboard permissions and automatically syncs the user into the agency team roster.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setRoleModalOpen(false)}
                  disabled={roleLoading}
                  className="px-4 py-2.5 rounded-xl border border-border bg-surface-2 hover:bg-surface-3 text-xs font-semibold text-muted-fg hover:text-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={roleLoading}
                  className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-primary-500/25 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {roleLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Role…</span>
                    </>
                  ) : (
                    <>
                      <span>Apply Role</span>
                      <span>✓</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Block Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open && confirmModal.type === "block"}
        onClose={() => setConfirmModal({ open: false, type: "block", targetUser: null })}
        onConfirm={handleConfirm}
        title={confirmModal.targetUser?.isBlocked ? "Unblock User" : "Block User"}
        description={`Are you sure you want to ${confirmModal.targetUser?.isBlocked ? "unblock" : "block"} ${confirmModal.targetUser?.name}? ${confirmModal.targetUser?.isBlocked ? "They will regain access." : "They will lose access to the platform."}`}
        confirmLabel={confirmModal.targetUser?.isBlocked ? "Unblock" : "Block User"}
        loading={actionLoading}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open && confirmModal.type === "delete"}
        onClose={() => setConfirmModal({ open: false, type: "delete", targetUser: null })}
        onConfirm={handleConfirm}
        title="Delete User"
        description={`Are you sure you want to permanently delete ${confirmModal.targetUser?.name}? This action cannot be undone and will remove all their data.`}
        confirmLabel="Delete Permanently"
        loading={actionLoading}
      />
    </div>
  );
}
