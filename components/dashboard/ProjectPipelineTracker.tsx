"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  status: "in_progress" | "review" | "completed";
  progress: number;
  leadEngineer: {
    name: string;
    role: string;
    avatar: string;
  };
  sprintPhase: string;
  targetLaunch: string;
  techStack: string[];
  deliverables: Array<{ title: string; completed: boolean }>;
  stagingUrl?: string;
  budgetTier: string;
}

const SAMPLE_PROJECTS: ProjectItem[] = [
  {
    id: "proj_nexora_saas",
    title: "Enterprise AI Workflow & Analytics Platform",
    category: "Full-Stack SaaS Application",
    status: "in_progress",
    progress: 75,
    leadEngineer: {
      name: "Saif Khan",
      role: "Lead Systems Architect (CST Core)",
      avatar: "SK",
    },
    sprintPhase: "Phase 3: Better Auth & MongoDB Compound Indexing",
    targetLaunch: "September 18, 2026",
    techStack: ["Next.js 16", "Better Auth", "MongoDB Atlas", "Tailwind CSS", "Claude API"],
    budgetTier: "$3,500 Enterprise Custom",
    stagingUrl: "https://staging.nexora.agency/demo",
    deliverables: [
      { title: "High-fidelity Figma system auto-layout components", completed: true },
      { title: "Better Auth session management & role-based middleware", completed: true },
      { title: "Real-time AI prompt synthesis engine & token limiter", completed: true },
      { title: "Stripe checkout billing portal & webhooks", completed: false },
      { title: "Core Web Vitals 98+ Lighthouse performance audit", completed: false },
    ],
  },
  {
    id: "proj_lumina_ecommerce",
    title: "Nordic Luxury E-Commerce Digital Flagship",
    category: "E-Commerce & Digital Store",
    status: "review",
    progress: 92,
    leadEngineer: {
      name: "MD Mahfuzul Haque",
      role: "Founder & Executive Director",
      avatar: "MH",
    },
    sprintPhase: "Phase 4: Client QA Review & Domain Propagation",
    targetLaunch: "September 12, 2026",
    techStack: ["Next.js App Router", "Stripe API", "Cloudinary", "Framer Motion"],
    budgetTier: "$2,200 Professional",
    stagingUrl: "https://preview.lumina-store.dev",
    deliverables: [
      { title: "Slide-out shopping drawer with instant quantity sync", completed: true },
      { title: "Stripe 3D-Secure payment flow & invoice generator", completed: true },
      { title: "Cloudinary CDN image transformation pipeline", completed: true },
      { title: "Final client sign-off & production DNS migration", completed: false },
    ],
  },
  {
    id: "proj_fintech_landing",
    title: "Apex Capital Modern Investor Landing Page",
    category: "High-Converting Landing Page",
    status: "completed",
    progress: 100,
    leadEngineer: {
      name: "Jahidul Islam",
      role: "Technical Project Lead",
      avatar: "JI",
    },
    sprintPhase: "Phase 5: Live on Vercel Global Anycast Edge",
    targetLaunch: "Delivered on Schedule",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel Edge"],
    budgetTier: "$1,499 Flagship Tier",
    stagingUrl: "https://apexcapital.co",
    deliverables: [
      { title: "3D interactive hero canvas with particle physics", completed: true },
      { title: "Interactive ROI dynamic cost calculator", completed: true },
      { title: "HubSpot CRM webhook integration & inquiry parser", completed: true },
      { title: "100/100 Lighthouse performance benchmark", completed: true },
    ],
  },
];

export function ProjectPipelineTracker() {
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string>("proj_nexora_saas");

  const filteredProjects = SAMPLE_PROJECTS.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#0c1322]/80 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Header with Title & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-xs font-mono text-primary-400 uppercase tracking-wider font-semibold">
              Live Delivery Pipeline
            </span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
            Sprint Milestones &amp; Deliverables
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Track your bespoke web development sprints in real time. Every milestone is inspected by the CST Engineering leadership team.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/request-project" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full rounded-xl shadow-[0_0_20px_rgba(20,184,160,0.3)] text-xs font-semibold">
              + New Project Brief
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pt-4 pb-2 overflow-x-auto">
        {[
          { id: "all", label: "All Projects", count: SAMPLE_PROJECTS.length },
          { id: "in_progress", label: "In Active Sprint", count: 1 },
          { id: "review", label: "Client QA & Review", count: 1 },
          { id: "completed", label: "Delivered & Live", count: 1 },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              filter === tab.id
                ? "bg-primary-500/20 border border-primary-500/40 text-primary-300 shadow-[0_0_12px_rgba(20,184,160,0.15)] font-semibold"
                : "bg-white/[0.03] border border-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/[0.08] font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="mt-4 space-y-4">
        {filteredProjects.map((project) => {
          const isExpanded = expandedId === project.id;
          return (
            <motion.div
              key={project.id}
              layout
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden"
            >
              {/* Project Card Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? "" : project.id)}
                className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500/20 via-primary-500/10 to-transparent border border-primary-500/30 flex items-center justify-center font-bold text-sm text-primary-300 shrink-0 shadow-inner">
                    {project.status === "completed" ? "🚀" : project.status === "review" ? "🔍" : "⚡"}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-white hover:text-primary-300 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.1] bg-white/[0.05] text-neutral-300 font-mono">
                        {project.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-1">
                      <span className="flex items-center gap-1">
                        <span className="text-neutral-500">Lead:</span>
                        <span className="text-neutral-200 font-medium">{project.leadEngineer.name}</span>
                      </span>
                      <span>•</span>
                      <span className="text-primary-400 font-medium">{project.sprintPhase}</span>
                      <span>•</span>
                      <span className="text-neutral-500">Launch: {project.targetLaunch}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Status Pill */}
                <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 pt-2 lg:pt-0 border-t border-white/[0.04] lg:border-none">
                  <div className="w-36 sm:w-44">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-neutral-400 font-mono">Completion</span>
                      <span className="font-bold text-primary-300 font-mono">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          project.progress === 100
                            ? "bg-gradient-to-r from-emerald-400 to-primary-500"
                            : "bg-gradient-to-r from-primary-500 to-amber-400"
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border font-mono capitalize shrink-0 ${
                      project.status === "completed"
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                        : project.status === "review"
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                        : "bg-primary-500/15 border-primary-500/30 text-primary-300"
                    }`}
                  >
                    {project.status.replace("_", " ")}
                  </span>

                  <span className="text-xs text-neutral-500 transition-transform">
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Expanded Detail View */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="border-t border-white/[0.06] bg-black/30 p-4 sm:p-6 space-y-5"
                  >
                    {/* Visual 5-Step Milestone Stepper */}
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-300 mb-3 flex items-center gap-2">
                        <span>🧭</span> 5-Phase Engineering Delivery Roadmap
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { step: "01", name: "Discovery & Scope", state: "done" },
                          { step: "02", name: "UI/UX Architecture", state: "done" },
                          {
                            step: "03",
                            name: "Full-Stack Dev",
                            state: project.progress >= 70 ? "done" : "current",
                          },
                          {
                            step: "04",
                            name: "Client QA & Review",
                            state:
                              project.progress >= 90
                                ? "done"
                                : project.progress >= 70
                                ? "current"
                                : "upcoming",
                          },
                          {
                            step: "05",
                            name: "Global Edge Live",
                            state: project.progress === 100 ? "done" : "upcoming",
                          },
                        ].map((m) => (
                          <div
                            key={m.step}
                            className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                              m.state === "done"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                : m.state === "current"
                                ? "bg-primary-500/15 border-primary-500/40 text-primary-300 shadow-[0_0_12px_rgba(20,184,160,0.2)]"
                                : "bg-white/[0.02] border-white/[0.05] text-neutral-500"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span>{m.step}</span>
                              <span>{m.state === "done" ? "✓" : m.state === "current" ? "● LIVE" : "○"}</span>
                            </div>
                            <span className="text-[11px] font-semibold mt-1.5 leading-tight text-white">
                              {m.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables Checklist & Tech Stack */}
                    <div className="grid sm:grid-cols-2 gap-5 pt-2">
                      <div>
                        <h4 className="text-xs font-semibold text-neutral-300 mb-2.5 flex items-center gap-1.5">
                          <span>📋</span> Verified Sprint Deliverables
                        </h4>
                        <div className="space-y-2">
                          {project.deliverables.map((deliv, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-xs p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                            >
                              <span
                                className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] shrink-0 font-bold ${
                                  deliv.completed
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                    : "bg-white/[0.05] text-neutral-500 border border-white/[0.1]"
                                }`}
                              >
                                {deliv.completed ? "✓" : "○"}
                              </span>
                              <span className={deliv.completed ? "text-neutral-300" : "text-neutral-500"}>
                                {deliv.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-300 mb-2.5 flex items-center gap-1.5">
                            <span>⚡</span> Verified Engineering Stack
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-300 font-mono"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
                            <span className="text-neutral-400">Package Tier:</span>
                            <span className="font-semibold text-amber-300 font-mono">
                              {project.budgetTier}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Project Actions */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-4 mt-4 border-t border-white/[0.06]">
                          {project.stagingUrl && (
                            <a
                              href={project.stagingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500/20 border border-primary-500/40 text-primary-300 hover:bg-primary-500/30 text-xs font-semibold transition-all shadow-[0_0_14px_rgba(20,184,160,0.2)]"
                            >
                              <span>🚀</span>
                              <span>Open Staging Preview ↗</span>
                            </a>
                          )}
                          <Link
                            href="/contact"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08] text-xs font-semibold transition-all"
                          >
                            <span>💬</span>
                            <span>Message Engineering Lead</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
