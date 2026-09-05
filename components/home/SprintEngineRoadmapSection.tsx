"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";

interface SprintPhase {
  id: string;
  days: string;
  phaseNumber: string;
  title: string;
  tagline: string;
  icon: string;
  color: string;
  bgGlow: string;
  description: string;
  deliverables: string[];
  artifact: {
    label: string;
    value: string;
    icon: string;
  };
  engineerRole: string;
}

const sprintPhases: SprintPhase[] = [
  {
    id: "phase-1",
    days: "Days 1–2",
    phaseNumber: "Phase 01",
    title: "Technical Discovery & Scope Lock",
    tagline: "Laying rock-solid architectural foundations",
    icon: "📐",
    color: "text-primary-400 border-primary-500/40",
    bgGlow: "from-primary-500/15 via-primary-500/5 to-transparent",
    description:
      "We dissect your business goals, target user personas, and technical requirements. We write the database schema, map API contracts, and lock the exact deliverables so there are zero scope surprises.",
    deliverables: [
      "Technical Architecture Blueprint & API Contract",
      "MongoDB / PostgreSQL Database Schema Design",
      "User Journey & Sitemap Specification",
      "Project Milestones & Sprint Schedule Locked",
    ],
    artifact: {
      label: "Client Deliverable",
      value: "Approved Architecture Document & Wireframes",
      icon: "📋",
    },
    engineerRole: "Principal Systems Architect",
  },
  {
    id: "phase-2",
    days: "Days 3–6",
    phaseNumber: "Phase 02",
    title: "High-Fidelity UI/UX & Design System",
    tagline: "Pixel-perfect visual identity & interactive Figma prototype",
    icon: "🎨",
    color: "text-violet-400 border-violet-500/40",
    bgGlow: "from-violet-500/15 via-violet-500/5 to-transparent",
    description:
      "We engineer bespoke design systems with curated color tokens, modern typography, glassmorphism accents, and micro-interactions in Figma. You receive a clickable prototype to click through and approve.",
    deliverables: [
      "Custom Design System (Tokens, Typography, Component Library)",
      "Desktop, Tablet & Mobile Responsive Figma Mockups",
      "Interactive Clickable Prototype for User Testing",
      "Client Design Review & Instant Feedback Revisions",
    ],
    artifact: {
      label: "Client Deliverable",
      value: "100% Complete Interactive Figma Prototype",
      icon: "✨",
    },
    engineerRole: "Lead Product Designer & UI Engineer",
  },
  {
    id: "phase-3",
    days: "Days 7–11",
    phaseNumber: "Phase 03",
    title: "Full-Stack Next.js 15 & AI Engineering",
    tagline: "Writing clean, type-safe, production-ready software",
    icon: "💻",
    color: "text-cyan-400 border-cyan-500/40",
    bgGlow: "from-cyan-500/15 via-cyan-500/5 to-transparent",
    description:
      "Our senior developers turn designs into code using Next.js 15 App Router, TypeScript, Tailwind CSS, Express REST endpoints, and Claude API AI engines. Daily staging commits keep you updated continuously.",
    deliverables: [
      "Next.js 15 App Router + React Server Components",
      "RESTful API Routes with Input Validation & Auth",
      "Framer Motion Micro-Interactions & Scroll Animations",
      "Continuous CI/CD Staging Deployment on Vercel",
    ],
    artifact: {
      label: "Client Deliverable",
      value: "Live Staging URL with Daily Code Commits",
      icon: "🌐",
    },
    engineerRole: "Senior Full-Stack Engineers",
  },
  {
    id: "phase-4",
    days: "Days 12–13",
    phaseNumber: "Phase 04",
    title: "Speed Tuning, Security Audit & QA",
    tagline: "Testing for sub-second speeds & bulletproof reliability",
    icon: "🛡️",
    color: "text-amber-400 border-amber-500/40",
    bgGlow: "from-amber-500/15 via-amber-500/5 to-transparent",
    description:
      "We stress-test the entire application. We run Google Lighthouse audits until performance hits 95+, audit Core Web Vitals, verify SSL security, and test cross-browser compatibility across 15+ devices.",
    deliverables: [
      "Google PageSpeed 95+ Score Tuning & Bundle Optimization",
      "OWASP Security Audit & CSRF/XSS Protection Testing",
      "Cross-Browser QA (Chrome, Safari, iOS, Android)",
      "Technical SEO Verification (Metadata, OG Tags, Sitemap)",
    ],
    artifact: {
      label: "Client Deliverable",
      value: "Audited 95+ PageSpeed Scorecard & QA Report",
      icon: "📊",
    },
    engineerRole: "QA & Performance Optimization Lead",
  },
  {
    id: "phase-5",
    days: "Day 14",
    phaseNumber: "Phase 05",
    title: "Production Edge Launch & Code Handover",
    tagline: "Going live globally with 100% client code ownership",
    icon: "🚀",
    color: "text-emerald-400 border-emerald-500/40",
    bgGlow: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    description:
      "We configure your custom domain with DNS and SSL, push to Vercel/Railway Edge production, and transfer 100% full admin ownership of the GitHub repository to your team. Zero vendor lock-in.",
    deliverables: [
      "Production Deployment with 300+ Edge Node CDN",
      "Custom Domain DNS & SSL Certificate Setup",
      "GitHub Repository Admin Transfer & Code Handover",
      "Kickoff of 14-Day Free Post-Launch Warranty Period",
    ],
    artifact: {
      label: "Client Deliverable",
      value: "Live Production Site + Full GitHub Repository Transfer",
      icon: "🔑",
    },
    engineerRole: "DevOps & Launch Engineer",
  },
];

export function SprintEngineRoadmapSection() {
  const [activePhaseId, setActivePhaseId] = useState<string>("phase-1");
  const activePhase = sprintPhases.find((p) => p.id === activePhaseId) || sprintPhases[0];

  return (
    <Section id="sprint-engine" className="py-20 sm:py-28 relative overflow-hidden border-t border-border/40">
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary-500/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      <FadeInSection>
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="flex justify-center mb-4">
            <Badge variant="primary" size="md">
              The Nexora Execution Framework
            </Badge>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            From Concept to Production in <span className="gradient-text">Exactly 14 Days</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-muted-fg leading-relaxed max-w-2xl mx-auto">
            Traditional agencies take 3 to 6 months with endless meetings. We engineered an agile 14-day delivery sprint where senior developers work directly with you.
          </p>
        </div>
      </FadeInSection>

      {/* Interactive Phase Navigation Tabs */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-8">
          {sprintPhases.map((phase) => {
            const isActive = phase.id === activePhaseId;
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => setActivePhaseId(phase.id)}
                className={`p-3 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-surface-2 border-primary-500/60 shadow-[0_0_20px_rgba(20,184,160,0.2)] scale-[1.02]"
                    : "bg-surface-1/60 border-border hover:border-border/80 hover:bg-surface-1"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-primary-400">{phase.days}</span>
                  <span className="text-sm">{phase.icon}</span>
                </div>
                <p className="text-xs font-bold text-foreground truncate">{phase.title}</p>
                <p className="text-[10px] text-muted-fg font-mono mt-0.5">{phase.phaseNumber}</p>
              </button>
            );
          })}
        </div>

        {/* Active Phase Deep-Dive Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <Card
              padding="lg"
              className={`border border-border/80 bg-gradient-to-br ${activePhase.bgGlow} shadow-2xl p-6 sm:p-10 relative overflow-hidden`}
            >
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Left: Phase Details */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Badge variant="primary" size="sm">
                      {activePhase.phaseNumber} • {activePhase.days}
                    </Badge>
                    <span className="text-xs font-mono text-muted-fg">
                      Lead: <strong className="text-foreground">{activePhase.engineerRole}</strong>
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    {activePhase.title}
                  </h3>

                  <p className="text-xs font-mono text-primary-300">
                    // {activePhase.tagline}
                  </p>

                  <p className="text-sm text-muted-fg leading-relaxed">
                    {activePhase.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="pt-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                      Core Sprint Deliverables:
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {activePhase.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-muted-fg leading-snug"
                        >
                          <span className="text-emerald-400 font-bold flex-shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: Client Deliverable Artifact Box */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full">
                  <div className="p-5 rounded-2xl border border-border/80 bg-surface-1/90 backdrop-blur-md shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-fg">
                        {activePhase.artifact.label}
                      </span>
                      <span className="text-xl">{activePhase.artifact.icon}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-900/90 border border-primary-500/20">
                      <p className="text-xs font-mono text-primary-300">
                        {activePhase.artifact.value}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-muted-fg">
                      <div className="flex items-center justify-between">
                        <span>Sprint Day Progress:</span>
                        <span className="font-mono font-bold text-foreground">
                          {activePhase.days}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Client Review Gate:</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          100% Signed-Off
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Link to next prompt or call */}
                  <div className="mt-6">
                    <Button size="md" variant="primary" className="w-full" asChild>
                      <Link href="/contact">Book a Project Kickoff →</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* On-Time Guarantee Footnote Banner */}
        <FadeInSection delay={0.2}>
          <div className="mt-8 p-4 rounded-xl border border-border bg-surface-1/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">⏱️</span>
              <p className="text-xs text-muted-fg leading-relaxed">
                <strong className="text-foreground">Strict 14-Day Delivery Commitment:</strong> If we miss our agreed launch timeline without client scope changes, you receive a 20% milestone refund.
              </p>
            </div>
            <Link
              href="/contact"
              className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors flex-shrink-0"
            >
              Learn about our warranty →
            </Link>
          </div>
        </FadeInSection>
      </div>
    </Section>
  );
}
