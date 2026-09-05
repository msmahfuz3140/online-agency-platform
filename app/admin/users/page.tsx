"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getStoredUser, type UserSession } from "@/lib/auth-client";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/ui/Modal";
import { useToastPortal } from "@/components/ui/useToastPortal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  aiCreditsRemaining: number;
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
  const { toast, ToastPortal } = useToastPortal();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users?limit=100`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
      }
    } catch {
      toast("error", "Load Error", "Failed to fetch users.");
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    setUser(getStoredUser());
    loadUsers();
  }, [loadUsers]);

  const handleRowAction = (row: AdminUser, action: string) => {
    if (action === "block") {
      setConfirmModal({ open: true, type: "block", targetUser: row });
    } else if (action === "delete") {
      setConfirmModal({ open: true, type: "delete", targetUser: row });
    }
  };

  const handleConfirm = async () => {
    if (!confirmModal.targetUser) return;
    setActionLoading(true);
    try {
      const { id } = confirmModal.targetUser;
      const endpoint =
        confirmModal.type === "delete"
          ? `${API_BASE_URL}/api/admin/users/${id}`
          : `${API_BASE_URL}/api/admin/users/${id}/block`;
      const method = confirmModal.type === "delete" ? "DELETE" : "PATCH";
      const res = await fetch(endpoint, { method, credentials: "include" });
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
          <div className="h-7 w-7 rounded-full bg-primary-500/20 border border-primary-500/20 flex items-center justify-center text-[10px] font-bold text-primary-300 shrink-0">
            {row.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-white leading-none">{row.name}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">{row.email}</p>
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
        <span className="text-[11px] text-neutral-500">
          {new Date(row.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
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
            <h2 className="text-sm font-bold text-white">All Users</h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">Manage user accounts, roles, and access</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-600 font-mono">{users.length} total</span>
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
              label: row.isBlocked ? "Unblock" : "Block",
              action: "block",
              variant: row.isBlocked ? "normal" : "danger",
            },
            { label: "Delete", action: "delete", variant: "danger" },
          ]}
        />
      </div>

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
