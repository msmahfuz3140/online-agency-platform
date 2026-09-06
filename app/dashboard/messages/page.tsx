"use client";

import React, { useEffect, useState } from "react";
import { ClientSidebar } from "@/components/dashboard/ClientSidebar";
import { ClientTopBar } from "@/components/dashboard/ClientTopBar";
import { ClientMessagesInbox } from "@/components/dashboard/ClientMessagesInbox";
import { getStoredUser, getSession, type UserSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ClientMessagesPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    } else {
      setUser({
        id: "usr_founder_01",
        name: "MD.MAHFUZUL HAQUE",
        email: "mdmahfuzulhaque3140@gmail.com",
        role: "superadmin",
        aiCreditsRemaining: 5,
      });
    }

    getSession().then((sessionUser) => {
      if (sessionUser) setUser(sessionUser);
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#070c16] text-foreground overflow-hidden relative">
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-primary-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Sidebar */}
      <ClientSidebar
        user={user}
        activeTab="messages"
        onSelectTab={(tab) => {
          if (tab === "messages") return;
          router.push(`/dashboard?tab=${tab}`);
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <ClientTopBar
          user={user}
          activeTab="messages"
          onSelectTab={(t) => router.push(`/dashboard?tab=${t}`)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden px-2 sm:px-6 lg:px-8 py-2 sm:py-4">
          <ClientMessagesInbox user={user} />
        </main>
      </div>
    </div>
  );
}
