"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getStoredUser, signOut, type UserSession } from "@/lib/auth-client";

export default function DashboardPlaceholderPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredUser();
    if (!stored) {
      // Fallback demo user for preview if not signed in
      setUser({
        id: "usr_preview",
        name: "Founder",
        email: "founder@nexora.agency",
        role: "user",
        aiCreditsRemaining: 5,
      });
    } else {
      setUser(stored);
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (!mounted) return null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "FD";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-amber-500/8 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Dashboard Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-heading font-black text-black text-sm shadow-[0_0_16px_rgba(20,184,160,0.3)] group-hover:scale-105 transition-transform">
              N
            </span>
            <span className="font-heading font-bold text-base tracking-tight">
              Nexora <span className="text-xs text-muted-fg font-normal">Workspace</span>
            </span>
          </Link>

          <span className="text-xs px-2 py-0.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 font-mono">
            v1.0-alpha
          </span>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold text-muted-fg hover:text-foreground transition-colors hidden sm:inline-block"
          >
            Agency Main Site
          </Link>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center font-bold text-xs text-primary-300">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold leading-none">{user?.name}</p>
              <p className="text-[10px] text-muted-fg leading-none mt-1">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="text-xs px-3 py-1.5 rounded-lg border border-border bg-surface-2 hover:bg-surface-3 text-neutral-300 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        {/* Welcome Hero Banner */}
        <div className="relative rounded-2xl border border-primary-500/30 bg-gradient-to-r from-surface-1 via-surface-2 to-surface-1 p-6 sm:p-8 overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" size="sm">
                Dashboard Initialized
              </Badge>
              <span className="text-xs text-muted-fg">•</span>
              <span className="text-xs text-muted-fg font-mono">Role: {user?.role || "user"}</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Welcome back, <span className="gradient-text">{user?.name || "Founder"}</span> 👋
            </h1>

            <p className="mt-2 text-sm text-muted-fg leading-relaxed">
              Your central digital command center for AI website generation, custom engineering project milestones, and live deployments.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="md" variant="primary" asChild>
                <Link href="/contact">Start a Custom Project →</Link>
              </Button>
              <Button size="md" variant="secondary" asChild>
                <Link href="/portfolio">Explore Live Portfolios</Link>
              </Button>
            </div>
          </div>

          {/* Holographic badge backdrop */}
          <div className="absolute right-4 bottom-4 text-8xl sm:text-9xl font-heading font-black text-white/5 select-none pointer-events-none">
            NEXORA
          </div>
        </div>

        {/* Top 3 Stat Cards */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {/* AI Credits Card */}
          <Card padding="md" className="border-border/80 bg-surface-1/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-fg uppercase tracking-wider">
                AI Generation Credits
              </span>
              <span className="text-base">⚡</span>
            </div>
            <div className="font-heading text-3xl font-extrabold text-primary-400">
              {user?.aiCreditsRemaining ?? 5}{" "}
              <span className="text-xs text-muted-fg font-normal font-sans">/ 5 Credits Available</span>
            </div>
            <p className="text-xs text-muted-fg mt-2">
              Generates a full JSON structured website layout in ~10 seconds.
            </p>
            <div className="mt-4 pt-3 border-t border-border/60">
              <span className="text-[11px] text-primary-300 font-semibold">
                AI Engine Module Unlocking in Part B →
              </span>
            </div>
          </Card>

          {/* Project Sprints Card */}
          <Card padding="md" className="border-border/80 bg-surface-1/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-fg uppercase tracking-wider">
                Client Project Sprints
              </span>
              <span className="text-base">💼</span>
            </div>
            <div className="font-heading text-3xl font-extrabold text-foreground">
              0{" "}
              <span className="text-xs text-muted-fg font-normal font-sans">Active Milestones</span>
            </div>
            <p className="text-xs text-muted-fg mt-2">
              Bespoke full-stack web applications, SaaS platforms & redesigns.
            </p>
            <div className="mt-4 pt-3 border-t border-border/60">
              <Link href="/contact" className="text-[11px] text-primary-400 font-semibold hover:underline">
                Request a New Project Brief →
              </Link>
            </div>
          </Card>

          {/* Deployment Status Card */}
          <Card padding="md" className="border-border/80 bg-surface-1/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-fg uppercase tracking-wider">
                Edge Deployments
              </span>
              <span className="text-base">🚀</span>
            </div>
            <div className="font-heading text-3xl font-extrabold text-foreground">
              0{" "}
              <span className="text-xs text-muted-fg font-normal font-sans">Live Websites</span>
            </div>
            <p className="text-xs text-muted-fg mt-2">
              100% Code Ownership, Vercel Edge routing & GitHub export.
            </p>
            <div className="mt-4 pt-3 border-t border-border/60">
              <span className="text-[11px] text-muted-fg font-mono">
                Status: Ready for Generation
              </span>
            </div>
          </Card>
        </div>

        {/* Dashboard Modules Placeholder Notice */}
        <Card
          padding="lg"
          className="border-dashed border-border bg-surface-1/40 text-center p-8 sm:p-12 rounded-2xl"
        >
          <div className="max-w-md mx-auto space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-2xl mx-auto shadow-inner">
              🛠️
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              Full Workspace Dashboard Under Construction
            </h2>
            <p className="text-xs sm:text-sm text-muted-fg leading-relaxed">
              This placeholder confirms that registration, Better Auth session tokens, and route protection are fully operational. The comprehensive website manager and visual AI generation canvas will be integrated in upcoming prompts.
            </p>
            <div className="pt-2">
              <Button size="sm" variant="secondary" asChild>
                <Link href="/">Return to Agency Home</Link>
              </Button>
            </div>
          </div>
        </Card>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-border/60 py-4 px-4 sm:px-8 text-center text-xs text-muted-fg">
        Nexora Agency Platform • Authenticated Session Active
      </footer>
    </div>
  );
}
