"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToastPortal } from "@/components/ui/useToastPortal";
import { getStoredUser, type UserSession } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface LeadEngineer {
  name: string;
  role: string;
  avatar: string;
}

interface Deliverable {
  id?: string;
  title: string;
  completed: boolean;
}

interface SprintUpdate {
  id: string;
  title: string;
  note: string;
  date: string;
  postedBy: string;
}

interface ClientReview {
  rating: number;
  feedback: string;
  approved: boolean;
  submittedAt?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  status: "pending" | "reviewing" | "in-progress" | "review-ready" | "completed" | "cancelled";
  progress: number;
  leadEngineer: LeadEngineer;
  sprintPhase: string;
  targetLaunch: string;
  techStack: string[];
  deliverables: Deliverable[];
  stagingUrl?: string;
  budgetTier: string;
  updates?: SprintUpdate[];
  review?: ClientReview;
  isUserProject?: boolean;
}

const SAMPLE_PROJECTS: ProjectItem[] = [
  {
    id: "sample_saas_platform",
    title: "Enterprise AI Workflow & Analytics Platform",
    category: "Full-Stack SaaS Platform",
    status: "in-progress",
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
      { id: "s1", title: "High-fidelity Figma system auto-layout components", completed: true },
      { id: "s2", title: "Better Auth session management & role-based middleware", completed: true },
      { id: "s3", title: "Real-time AI prompt synthesis engine & token limiter", completed: true },
      { id: "s4", title: "Stripe checkout billing portal & webhooks", completed: false },
      { id: "s5", title: "Core Web Vitals 98+ Lighthouse performance audit", completed: false },
    ],
    updates: [
      {
        id: "upd_s1",
        title: "Sprint Phase 3 Deployed to Staging",
        note: "Better Auth multi-tenant session isolation verified with zero regression.",
        date: "2026-09-06T10:00:00.000Z",
        postedBy: "Saif Khan",
      },
    ],
    isUserProject: false,
  },
  {
    id: "sample_lumina_store",
    title: "Nordic Luxury E-Commerce Digital Flagship",
    category: "E-Commerce & Digital Store",
    status: "review-ready",
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
      { id: "s6", title: "Slide-out shopping drawer with instant quantity sync", completed: true },
      { id: "s7", title: "Stripe 3D-Secure payment flow & invoice generator", completed: true },
      { id: "s8", title: "Cloudinary CDN image transformation pipeline", completed: true },
      { id: "s9", title: "Final client sign-off & production DNS migration", completed: false },
    ],
    updates: [
      {
        id: "upd_s2",
        title: "Staging Preview Ready for QA",
        note: "All 12 product catalog items seeded and payment sandbox active for client review.",
        date: "2026-09-05T14:30:00.000Z",
        postedBy: "MD Mahfuzul Haque",
      },
    ],
    isUserProject: false,
  },
  {
    id: "sample_apex_landing",
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
      { id: "s10", title: "3D interactive hero canvas with particle physics", completed: true },
      { id: "s11", title: "Interactive ROI dynamic cost calculator", completed: true },
      { id: "s12", title: "HubSpot CRM webhook integration & inquiry parser", completed: true },
      { id: "s13", title: "100/100 Lighthouse performance benchmark", completed: true },
    ],
    review: {
      rating: 5,
      feedback: "Exceptional speed, world-class design fidelity, and flawless code delivery. Exceeded our expectations!",
      approved: true,
      submittedAt: "2026-09-04T12:00:00.000Z",
    },
    isUserProject: false,
  },
];

export function ProjectPipelineTracker() {
  const [filter, setFilter] = useState<string>("all");
  const [projects, setProjects] = useState<ProjectItem[]>(SAMPLE_PROJECTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<string>("");
  const [user, setUser] = useState<UserSession | null>(null);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [feedbackInput, setFeedbackInput] = useState<string>("");
  const [approvedInput, setApprovedInput] = useState<boolean>(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  const { toast, ToastPortal } = useToastPortal();

  // Load user's project requests from backend
  const fetchMyProjects = useCallback(async () => {
    setLoading(true);
    try {
      const stored = getStoredUser();
      setUser(stored);

      let trackedIds: string[] = [];
      try {
        const raw = localStorage.getItem("nexora_client_project_requests");
        if (raw) trackedIds = JSON.parse(raw);
      } catch {
        // ignore
      }

      const params = new URLSearchParams();
      if (stored?.email) params.set("email", stored.email);
      if (stored?.id) params.set("userId", stored.id);
      if (trackedIds.length > 0) params.set("ids", trackedIds.join(","));

      const res = await fetch(`${API_BASE_URL}/api/project-request/my-requests?${params}`, {
        credentials: "include",
      });

      if (res.ok) {
        const json = await res.json();
        const liveRequests = json.data || [];

        if (liveRequests.length > 0) {
          const mappedLive: ProjectItem[] = liveRequests.map((req: any) => {
            const rawStatus = (req.status || "pending").toLowerCase();
            let normStatus: ProjectItem["status"] = "pending";
            if (rawStatus === "reviewing") normStatus = "reviewing";
            else if (rawStatus === "in-progress" || rawStatus === "in_progress") normStatus = "in-progress";
            else if (rawStatus === "review-ready" || rawStatus === "review") normStatus = "review-ready";
            else if (rawStatus === "completed") normStatus = "completed";
            else if (rawStatus === "cancelled") normStatus = "cancelled";

            let defaultProgress = 10;
            if (normStatus === "completed") defaultProgress = 100;
            else if (normStatus === "review-ready") defaultProgress = 90;
            else if (normStatus === "in-progress") defaultProgress = 60;
            else if (normStatus === "reviewing") defaultProgress = 30;

            return {
              id: req._id,
              title: req.projectTitle || "Bespoke Web Platform",
              category: req.projectType ? req.projectType.replace("-", " ") : "Custom Development",
              status: normStatus,
              progress: typeof req.progress === "number" ? req.progress : defaultProgress,
              leadEngineer: req.leadEngineer || {
                name: "MD Mahfuzul Haque",
                role: "Founder & Lead Architect",
                avatar: "MH",
              },
              sprintPhase: req.sprintPhase || (
                normStatus === "review-ready"
                  ? "Phase 4: Client QA & Sign-Off"
                  : normStatus === "completed"
                  ? "Phase 5: Live on Production Edge"
                  : normStatus === "in-progress"
                  ? "Phase 3: Core Architecture Sprint"
                  : "Phase 1: Project Scoping & Intake"
              ),
              targetLaunch: req.targetLaunch || req.timeline || "In Sprint Schedule",
              techStack: req.techStack?.length ? req.techStack : ["Next.js 16", "TypeScript", "Tailwind CSS", "MongoDB"],
              deliverables: req.deliverables?.length ? req.deliverables : [
                { id: "d1", title: "Discovery, Requirements & System Architecture", completed: true },
                { id: "d2", title: "Interactive UI/UX Prototype in Figma", completed: normStatus !== "pending" },
                { id: "d3", title: "Full-Stack Development & Backend Integration", completed: normStatus === "review-ready" || normStatus === "completed" },
                { id: "d4", title: "Client Staging Verification & Performance Audit", completed: normStatus === "completed" },
              ],
              stagingUrl: req.stagingUrl || "",
              budgetTier: req.budget ? `${req.budget} Tier` : "Custom Contract",
              updates: req.updates || [],
              review: req.review,
              isUserProject: true,
            };
          });

          // Prepend user's live projects
          setProjects([...mappedLive, ...SAMPLE_PROJECTS]);
          setExpandedId(mappedLive[0].id);
        } else {
          setProjects(SAMPLE_PROJECTS);
          setExpandedId(SAMPLE_PROJECTS[0].id);
        }
      } else {
        setProjects(SAMPLE_PROJECTS);
        setExpandedId(SAMPLE_PROJECTS[0].id);
      }
    } catch {
      setProjects(SAMPLE_PROJECTS);
      setExpandedId(SAMPLE_PROJECTS[0].id);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMyProjects();
  }, [fetchMyProjects]);

  const openReviewModal = (project: ProjectItem) => {
    setSelectedProject(project);
    setRatingInput(project.review?.rating || 5);
    setFeedbackInput(project.review?.feedback || "");
    setApprovedInput(project.review?.approved !== undefined ? project.review.approved : true);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedProject) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/project-request/${selectedProject.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          rating: ratingInput,
          feedback: feedbackInput,
          approved: approvedInput,
        }),
      });

      if (res.ok) {
        toast("success", "Review Submitted! ⭐", "Your project review and sign-off has been received by our engineering leadership.");
        setReviewModalOpen(false);
        // Refresh projects list
        await fetchMyProjects();
      } else {
        const err = await res.json().catch(() => ({}));
        toast("error", "Submission Failed", err.message || "Failed to submit review. Please try again.");
      }
    } catch {
      toast("error", "Network Error", "Unable to connect to project service.");
    }
    setSubmittingReview(false);
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    if (filter === "in_progress") return p.status === "in-progress" || p.status === "pending" || p.status === "reviewing";
    if (filter === "review") return p.status === "review-ready";
    if (filter === "completed") return p.status === "completed";
    return true;
  });

  const ratingLabels: Record<number, string> = {
    1: "Needs Significant Improvement",
    2: "Fair — Has Pending Issues",
    3: "Good — Meets Specifications",
    4: "Great — Exceeded Expectations",
    5: "World-Class Excellence ⭐⭐⭐⭐⭐",
  };

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#0c1322]/80 backdrop-blur-2xl p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <ToastPortal />

      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-xs font-mono text-primary-400 uppercase tracking-wider font-semibold">
              Client Delivery Pipeline &amp; Sprint QA
            </span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
            Live Sprint Milestones &amp; Deliverables
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Track your bespoke web development sprints in real time. Inspect deliverables, test live staging builds, and review engineering milestones.
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
      <div className="flex items-center gap-2 pt-4 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: "all", label: "All Projects", count: projects.length },
          {
            id: "in_progress",
            label: "In Active Sprint",
            count: projects.filter((p) => p.status === "in-progress" || p.status === "pending" || p.status === "reviewing").length,
          },
          {
            id: "review",
            label: "Client QA & Review",
            count: projects.filter((p) => p.status === "review-ready").length,
          },
          {
            id: "completed",
            label: "Delivered & Live",
            count: projects.filter((p) => p.status === "completed").length,
          },
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
          const isCompleted = project.status === "completed";
          const isReviewReady = project.status === "review-ready";

          return (
            <motion.div
              key={project.id}
              layout
              className={`rounded-2xl border transition-all overflow-hidden ${
                project.isUserProject
                  ? "border-primary-500/30 bg-primary-500/[0.02] shadow-[0_0_20px_rgba(20,184,160,0.06)]"
                  : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              {/* Project Card Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? "" : project.id)}
                className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500/20 via-primary-500/10 to-transparent border border-primary-500/30 flex items-center justify-center font-bold text-sm text-primary-300 shrink-0 shadow-inner">
                    {isCompleted ? "🚀" : isReviewReady ? "🔍" : "⚡"}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-white hover:text-primary-300 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.1] bg-white/[0.05] text-neutral-300 font-mono capitalize">
                        {project.category}
                      </span>
                      {project.isUserProject && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-300 font-mono font-bold tracking-wider">
                          LIVE SPRINT
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-neutral-400 mt-1">
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
                <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-2 lg:pt-0 border-t border-white/[0.04] lg:border-none">
                  <div className="w-32 sm:w-44">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-neutral-400 font-mono">Completion</span>
                      <span className="font-bold text-primary-300 font-mono">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? "bg-gradient-to-r from-emerald-400 to-primary-500"
                            : "bg-gradient-to-r from-primary-500 to-amber-400"
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border font-mono capitalize shrink-0 ${
                      isCompleted
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                        : isReviewReady
                        ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                        : project.status === "in-progress"
                        ? "bg-primary-500/15 border-primary-500/30 text-primary-300"
                        : "bg-amber-500/15 border-amber-500/30 text-amber-300"
                    }`}
                  >
                    {project.status.replace("-", " ")}
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
                          { step: "01", name: "Discovery & Scope", state: project.progress >= 20 ? "done" : "current" },
                          { step: "02", name: "UI/UX Architecture", state: project.progress >= 50 ? "done" : project.progress >= 20 ? "current" : "upcoming" },
                          {
                            step: "03",
                            name: "Full-Stack Dev",
                            state: project.progress >= 80 ? "done" : project.progress >= 50 ? "current" : "upcoming",
                          },
                          {
                            step: "04",
                            name: "Client QA & Review",
                            state: project.progress >= 95 ? "done" : isReviewReady || project.progress >= 80 ? "current" : "upcoming",
                          },
                          {
                            step: "05",
                            name: "Global Edge Live",
                            state: isCompleted || project.progress === 100 ? "done" : "upcoming",
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
                              <span>{m.state === "done" ? "✓" : m.state === "current" ? "● ACTIVE" : "○"}</span>
                            </div>
                            <span className="text-[11px] font-semibold mt-1.5 leading-tight text-white">
                              {m.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables Checklist & Tech Stack */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <h4 className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                            <span>📋</span> Verified Sprint Deliverables
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {project.deliverables.filter((d) => d.completed).length}/{project.deliverables.length} Completed
                          </span>
                        </div>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {project.deliverables.map((deliv, idx) => (
                            <div
                              key={deliv.id || idx}
                              className="flex items-start gap-2.5 text-xs p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                            >
                              <span
                                className={`h-4 w-4 rounded-md flex items-center justify-center text-[10px] shrink-0 font-bold ${
                                  deliv.completed
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                    : "bg-white/[0.05] text-neutral-500 border border-white/[0.1]"
                                }`}
                              >
                                {deliv.completed ? "✓" : "○"}
                              </span>
                              <span className={deliv.completed ? "text-neutral-200" : "text-neutral-500"}>
                                {deliv.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between space-y-4">
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

                          <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
                            <span className="text-neutral-400">Budget Tier:</span>
                            <span className="font-semibold text-amber-300 font-mono">
                              {project.budgetTier}
                            </span>
                          </div>
                        </div>

                        {/* Staging & Review CTAs */}
                        <div className="pt-2 border-t border-white/[0.06] space-y-3">
                          {/* Client Review Box (if reviewed) */}
                          {project.review?.rating ? (
                            <div className="p-3 rounded-xl bg-amber-500/[0.07] border border-amber-500/25 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-amber-400 text-xs">{"★".repeat(project.review.rating)}</span>
                                  <span className="text-[11px] font-mono font-bold text-amber-300">{project.review.rating}/5.0</span>
                                </div>
                                <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  {project.review.approved ? "Approved for Launch ✓" : "Review Submitted"}
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-300 italic">
                                &quot;{project.review.feedback}&quot;
                              </p>
                            </div>
                          ) : null}

                          <div className="flex flex-wrap items-center gap-2.5">
                            {project.stagingUrl && (
                              <a
                                href={project.stagingUrl.startsWith("http") ? project.stagingUrl : `https://${project.stagingUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-500/20 border border-primary-500/40 text-primary-300 hover:bg-primary-500/30 text-xs font-semibold transition-all shadow-[0_0_14px_rgba(20,184,160,0.2)]"
                              >
                                <span>🚀</span>
                                <span>Open Staging Preview ↗</span>
                              </a>
                            )}

                            {/* Review & Approve Button */}
                            <button
                              type="button"
                              onClick={() => openReviewModal(project)}
                              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isReviewReady || !project.review?.rating
                                  ? "bg-gradient-to-r from-amber-500/20 to-primary-500/20 border border-amber-500/40 text-amber-300 hover:from-amber-500/30 hover:to-primary-500/30 shadow-[0_0_16px_rgba(245,158,11,0.2)]"
                                  : "bg-white/[0.04] border border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]"
                              }`}
                            >
                              <span>⭐</span>
                              <span>{project.review?.rating ? "Edit Review & Rating" : "Review & Approve Sprint"}</span>
                            </button>

                            <Link
                              href="/dashboard/messages"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08] text-xs font-semibold transition-all"
                            >
                              <span>💬</span>
                              <span>Chat with Lead</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sprint Milestone Updates Feed */}
                    {project.updates && project.updates.length > 0 && (
                      <div className="pt-3 border-t border-white/[0.06]">
                        <h4 className="text-xs font-semibold text-neutral-300 mb-2.5 flex items-center gap-1.5">
                          <span>📢</span> Live Sprint Milestone Logs
                        </h4>
                        <div className="space-y-2">
                          {project.updates.map((upd, idx) => (
                            <div
                              key={upd.id || idx}
                              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row sm:items-start justify-between gap-1 text-xs"
                            >
                              <div>
                                <span className="font-semibold text-white">{upd.title}</span>
                                <p className="text-neutral-400 text-[11px] mt-0.5">{upd.note}</p>
                              </div>
                              <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                                {new Date(upd.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {upd.postedBy}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Review & Approval Modal */}
      <Modal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Project Review & Delivery Approval"
        description={selectedProject ? `Inspect and sign off on deliverables for "${selectedProject.title}"` : ""}
        size="lg"
        actions={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <Button
              variant="ghost"
              onClick={() => setReviewModalOpen(false)}
              disabled={submittingReview}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitReview}
              loading={submittingReview}
              className="shadow-[0_0_20px_rgba(20,184,160,0.3)] font-semibold text-xs"
            >
              Submit Rating &amp; Sign-Off ⭐
            </Button>
          </div>
        }
      >
        {selectedProject && (
          <div className="space-y-4">
            {/* Star Rating Selection */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
                How would you rate the sprint delivery &amp; craftsmanship?
              </label>
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingInput(star)}
                    className="text-3xl sm:text-4xl transition-all transform hover:scale-125 cursor-pointer focus:outline-none"
                  >
                    <span className={star <= ratingInput ? "text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" : "text-neutral-600"}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-amber-300 font-mono">
                {ratingLabels[ratingInput]} ({ratingInput}/5)
              </p>
            </div>

            {/* Written Feedback Textarea */}
            <div>
              <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block mb-1.5">
                Client Review &amp; Launch Comments
              </label>
              <textarea
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="Share your feedback on the architecture, UI fidelity, speed, or team communication..."
                rows={3}
                className="w-full px-3 py-2.5 text-xs text-white bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-primary-500/40 placeholder:text-neutral-600 resize-none"
              />
            </div>

            {/* Approval Toggle */}
            <div
              onClick={() => setApprovedInput(!approvedInput)}
              className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                approvedInput
                  ? "bg-emerald-500/[0.08] border-emerald-500/30"
                  : "bg-white/[0.02] border-white/[0.06]"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all ${
                  approvedInput
                    ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    : "bg-white/[0.05] border border-white/[0.2] text-transparent"
                }`}
              >
                ✓
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  I formally approve the sprint deliverables for launch
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Confirm that the deliverables meet your expectations and authorize final deployment to the live production domain.
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
