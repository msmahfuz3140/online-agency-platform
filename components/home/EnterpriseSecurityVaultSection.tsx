"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { FadeInSection } from "../motion/FadeInSection";

interface VaultPillar {
  id: string;
  icon: string;
  badge: string;
  title: string;
  summary: string;
  checklist: string[];
  protocolNote: string;
}

const vaultPillars: VaultPillar[] = [
  {
    id: "ip-ownership",
    icon: "💎",
    badge: "100% Code Ownership",
    title: "Complete Intellectual Property Handover",
    summary:
      "You receive 100% full legal and commercial ownership of all source code, database architectures, Figma UI assets, and deployment infrastructure.",
    checklist: [
      "Full GitHub repository admin ownership transfer",
      "Zero proprietary frameworks or hidden vendor lock-in",
      "Clean commercial license with unminified TypeScript source",
      "Formal IP Assignment & Copyright Deed executed upon launch",
    ],
    protocolNote: "Protocol: Complete Git commit history & CI/CD configs transferred to your GitHub Org.",
  },
  {
    id: "mutual-nda",
    icon: "🔒",
    badge: "Confidentiality Shield",
    title: "Mutual NDA & Trade Secret Protection",
    summary:
      "We routinely execute mutual non-disclosure agreements before reviewing technical designs, proprietary algorithms, or sensitive market plans.",
    checklist: [
      "Standard Mutual NDA signed prior to project kickoff",
      "Encrypted communication channels (Signal/Telegram/Keybase)",
      "Strict data privacy with zero third-party telemetry leakage",
      "Air-gapped development workspaces for enterprise confidential builds",
    ],
    protocolNote: "Legal: 2-way protection governed by standard international commercial arbitration.",
  },
  {
    id: "security-standards",
    icon: "🛡️",
    badge: "OWASP Hardened",
    title: "Enterprise Cybersecurity & Pen-Testing",
    summary:
      "Every Next.js route, Express endpoint, and database query undergoes rigorous penetration testing and automated vulnerability analysis.",
    checklist: [
      "OWASP Top 10 hardening (SQLi, XSS, CSRF, SSRF mitigated)",
      "Automated Dependabot & Snyk vulnerability monitoring",
      "SSL Grade A+ with HTTP Strict Transport Security (HSTS)",
      "Rate-limiting & DDoS mitigation via Edge CDN nodes",
    ],
    protocolNote: "Audit: Zero critical or high-severity CVEs guaranteed upon production deployment.",
  },
  {
    id: "warranty-sla",
    icon: "⏱️",
    badge: "14-Day Free Warranty",
    title: "Post-Launch Peace of Mind SLA",
    summary:
      "We stand behind our code. Any unexpected bug, edge-case UI anomaly, or performance regression reported within 14 days is fixed immediately at zero cost.",
    checklist: [
      "14 days of dedicated post-launch triage & bug fixing included",
      "Priority response SLA (< 45 minutes during business hours)",
      "Direct Slack / WhatsApp channel with lead senior engineer",
      "Smooth handover training session for your in-house team",
    ],
    protocolNote: "Warranty: Uncapped developer hours dedicated to resolving any verified scope bugs.",
  },
];

export function EnterpriseSecurityVaultSection() {
  const [activePillarId, setActivePillarId] = useState<string>("ip-ownership");
  const [ndaModalOpen, setNdaModalOpen] = useState(false);
  const [ndaCopied, setNdaCopied] = useState(false);

  const activePillar =
    vaultPillars.find((p) => p.id === activePillarId) || vaultPillars[0];

  const handleCopyNda = () => {
    const ndaSummary = `NEXORA AGENCY MUTUAL NON-DISCLOSURE AGREEMENT (SUMMARY)
1. Purpose: Evaluation and execution of custom digital engineering services.
2. Confidential Information: Source code, designs, architecture, client data, and business plans.
3. Term: 2 years from disclosure date.
4. IP Assignment: All deliverables are work-for-hire and assigned 100% to Client upon payment.
Governing Law: Standard International Commercial Law.`;
    navigator.clipboard.writeText(ndaSummary);
    setNdaCopied(true);
    setTimeout(() => setNdaCopied(false), 2000);
  };

  return (
    <Section id="security-vault" className="py-20 sm:py-28 relative overflow-hidden border-t border-border/40">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[350px] bg-primary-500/8 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[250px] bg-emerald-500/6 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Section Header */}
      <FadeInSection>
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="flex justify-center mb-4">
            <Badge variant="primary" size="md">
              Enterprise Trust & Code Sovereignty
            </Badge>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            The Enterprise <span className="gradient-text">Trust & Code Vault</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-muted-fg leading-relaxed max-w-2xl mx-auto">
            Funded startups and modern enterprises partner with Nexora because we guarantee complete intellectual property sovereignty, mutual legal security, and production-grade reliability.
          </p>

          {/* Quick NDA Preview Trigger */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setNdaModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-primary-500/40 bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 transition-colors cursor-pointer shadow-[0_0_15px_rgba(20,184,160,0.2)]"
            >
              <span>📄</span>
              <span>Preview Standard Mutual NDA Terms →</span>
            </button>
          </div>
        </div>
      </FadeInSection>

      {/* Interactive 4 Pillars Tabs */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {vaultPillars.map((pillar) => {
            const isActive = pillar.id === activePillarId;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillarId(pillar.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-surface-2 border-primary-500/60 shadow-[0_0_24px_rgba(20,184,160,0.2)] scale-[1.02]"
                    : "bg-surface-1/60 border-border hover:border-border/80 hover:bg-surface-1"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{pillar.icon}</span>
                  <Badge variant={isActive ? "primary" : "default"} size="sm" className="text-[10px]">
                    {pillar.badge}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                  {pillar.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Deep-Dive Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              padding="lg"
              className="border border-border/80 bg-surface-1/90 backdrop-blur-xl shadow-2xl p-6 sm:p-10 relative overflow-hidden"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                {/* Left: Summary & Checklist */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 text-xs font-mono font-semibold">
                    <span>{activePillar.icon}</span>
                    <span>{activePillar.badge}</span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    {activePillar.title}
                  </h3>

                  <p className="text-sm text-muted-fg leading-relaxed">
                    {activePillar.summary}
                  </p>

                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                      Enforced Safeguards:
                    </p>
                    <ul className="space-y-2.5">
                      {activePillar.checklist.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-fg leading-relaxed">
                          <span className="text-emerald-400 font-bold flex-shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-neutral-900/80 border border-border/60 text-[11px] font-mono text-primary-300">
                    {activePillar.protocolNote}
                  </div>
                </div>

                {/* Right: Security Telemetry Card */}
                <div className="lg:col-span-5">
                  <div className="p-6 rounded-2xl border border-primary-500/30 bg-gradient-to-br from-primary-500/10 via-surface-2 to-surface-1 text-left space-y-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary-400">
                        Vault Verification
                      </span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 text-xs flex items-center justify-between">
                        <span className="text-muted-fg">Client IP Handover:</span>
                        <span className="font-mono font-bold text-emerald-400">100% Exclusive</span>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 text-xs flex items-center justify-between">
                        <span className="text-muted-fg">Mutual NDA Execution:</span>
                        <span className="font-mono font-bold text-primary-300">Standard Available</span>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 text-xs flex items-center justify-between">
                        <span className="text-muted-fg">Post-Launch Warranty:</span>
                        <span className="font-mono font-bold text-foreground">14 Days Free</span>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 text-xs flex items-center justify-between">
                        <span className="text-muted-fg">Codebase Lock-in:</span>
                        <span className="font-mono font-bold text-emerald-400">ZERO (Open Stack)</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button size="md" variant="primary" className="w-full" asChild>
                        <Link href="/contact">Request NDA & Project Kickoff →</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Global Security Ticker Bar */}
        <div className="mt-8 p-4 rounded-xl border border-border/70 bg-surface-1/50 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-muted-fg text-center">
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">●</span> 100% GITHUB REPO TRANSFER
          </span>
          <span className="hidden sm:inline text-border">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-primary-400">●</span> MUTUAL NDA SIGNED PRE-KICKOFF
          </span>
          <span className="hidden sm:inline text-border">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-cyan-400">●</span> ZERO VENDOR LOCK-IN
          </span>
          <span className="hidden sm:inline text-border">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">●</span> 14-DAY POST-LAUNCH WARRANTY
          </span>
        </div>
      </div>

      {/* Interactive Mutual NDA Preview Modal */}
      <Modal
        open={ndaModalOpen}
        onClose={() => setNdaModalOpen(false)}
        title="Mutual Non-Disclosure Agreement (Standard Term Sheet)"
        description="Review our standard legal commitments safeguarding client IP, codebases, and commercial trade secrets."
        size="lg"
        actions={
          <div className="flex items-center gap-2 w-full justify-end">
            <button
              type="button"
              onClick={handleCopyNda}
              className="px-3.5 py-2 rounded-lg border border-border bg-surface-2 text-xs font-medium text-foreground hover:bg-surface-3 transition-colors"
            >
              {ndaCopied ? "✓ Copied Summary" : "📋 Copy NDA Terms"}
            </button>
            <Button size="sm" variant="primary" asChild>
              <Link href="/contact" onClick={() => setNdaModalOpen(false)}>
                Request Signed Copy →
              </Link>
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs text-muted-fg leading-relaxed max-h-[60vh] overflow-y-auto pr-2 font-sans">
          <div className="p-3 rounded-xl bg-surface-2 border border-border/80 text-foreground font-semibold">
            Standard Mutual NDA • Nexora Digital Agency Platform & Client
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-1">1. Confidential Information Defined</h4>
            <p>
              "Confidential Information" encompasses all proprietary data, software source code, UI/UX designs, Figma documents, database architectures, client user metrics, and business logic disclosed between Parties.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-1">2. 100% Intellectual Property Assignment</h4>
            <p>
              All software, source code, designs, and architectural deliverables developed by Nexora under contract are considered work-for-hire and shall be 100% assigned and transferred exclusively to Client upon milestone settlement.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-1">3. Non-Disclosure & Security Standard</h4>
            <p>
              Nexora covenants that it shall exercise no less than reasonable care in preventing unauthorized dissemination, copying, or reverse engineering of any Client trade secrets or codebases.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-1">4. Zero Vendor Lock-In Guarantee</h4>
            <p>
              Nexora builds exclusively on standard, open-source production frameworks (Next.js 15, TypeScript, Node.js, Tailwind CSS) ensuring Client retains sovereign capability to host, extend, or maintain software independently.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-300 font-mono text-[11px]">
            Ready to execute a customized bilateral NDA with your corporate entity? Contact our legal desk at legal@nexora.agency or through our project kickoff form.
          </div>
        </div>
      </Modal>
    </Section>
  );
}
