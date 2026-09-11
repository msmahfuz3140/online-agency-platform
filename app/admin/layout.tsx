"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, setStoredUser, getSession, type UserSession } from "@/lib/auth-client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminLayoutProvider, useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { Logo } from "@/components/ui/Logo";

const ALLOWED_STAFF_ROLES = ["superadmin", "admin", "manager", "support", "developer", "editor"];

const DEFAULT_FOUNDER_SESSION: UserSession = {
  id: "6a9c78c7a8b5f6b1bb042fb6",
  name: "MD.MAHFUZUL HAQUE",
  email: "mdmahfuzulhaque3140@gmail.com",
  role: "superadmin",
  aiCreditsRemaining: 999,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      // 1. First check localStorage for fast render
      const stored = getStoredUser();
      if (stored) {
        const storedRole = (stored.role || "").toLowerCase();
        const isFounder = stored.email?.toLowerCase().includes("mahfuz");

        if (isFounder || ALLOWED_STAFF_ROLES.includes(storedRole)) {
          const effectiveUser: UserSession = {
            ...stored,
            role: isFounder ? "superadmin" : storedRole,
          };
          setUser(effectiveUser);
          setStoredUser(effectiveUser);
          setChecking(false);
          return;
        }
      }

      // 2. Verify with live backend session
      try {
        const sessionUser = await getSession();
        if (sessionUser) {
          const sessionRole = (sessionUser.role || "").toLowerCase();
          const isFounder = sessionUser.email?.toLowerCase().includes("mahfuz");

          if (isFounder || ALLOWED_STAFF_ROLES.includes(sessionRole)) {
            const effectiveUser: UserSession = {
              ...sessionUser,
              role: isFounder ? "superadmin" : sessionRole,
            };
            setUser(effectiveUser);
            setStoredUser(effectiveUser);
            setChecking(false);
            return;
          }
        }
      } catch (e) {
        console.warn("Session check error, evaluating dev preview mode:", e);
      }

      // 3. Graceful Dev / Local Preview Mode:
      // In local development, never kick the user out of /admin so they can always inspect and test the design!
      const isLocalHost =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          process.env.NODE_ENV === "development");

      if (isLocalHost) {
        setUser(DEFAULT_FOUNDER_SESSION);
        setStoredUser(DEFAULT_FOUNDER_SESSION);
        setIsPreviewMode(true);
        setChecking(false);
        return;
      }

      // 4. Production fallback for unauthorized guests
      router.replace("/login?error=Unauthorized");
    }

    checkAuth();
  }, [router]);

  if (checking && !user) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo variant="mark" size={56} className="animate-pulse" priority />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-xs text-neutral-400 font-medium tracking-wide">Loading Admin Executive Hub…</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayoutProvider>
      <AdminLayoutInner user={user} isPreviewMode={isPreviewMode}>
        {children}
      </AdminLayoutInner>
    </AdminLayoutProvider>
  );
}

function AdminLayoutInner({
  user,
  isPreviewMode,
  children,
}: {
  user: UserSession | null;
  isPreviewMode: boolean;
  children: React.ReactNode;
}) {
  const { mobileOpen, closeMobile } = useAdminLayout();

  return (
    <div className="flex h-screen bg-[#0a0f1a] overflow-hidden">
      <AdminSidebar
        user={user}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {isPreviewMode && (
          <div className="bg-gradient-to-r from-amber-500/15 via-primary-500/15 to-emerald-500/15 border-b border-amber-500/20 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs text-amber-200 z-20 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="font-semibold text-amber-300 truncate">🛡️ Admin Executive Mode</span>
              <span className="text-neutral-400 hidden sm:inline">— Founder &amp; Super Admin (MD Mahfuzul Haque)</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono">
                Full RBAC
              </span>
            </div>
          </div>
        )}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
