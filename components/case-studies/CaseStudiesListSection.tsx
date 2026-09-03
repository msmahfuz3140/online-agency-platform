"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

interface CaseStudyResult {
  metric: string;
  before: string;
  after: string;
  delta: string;
}

interface CaseStudyPhase {
  phase: "Problem" | "Solution" | "Result";
  icon: string;
  heading: string;
  body: string;
  bullets?: string[];
}

interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  serviceType: string;
  duration: string;
  year: string;
  tagline: string;
  summary: string;
  gradient: string;
  accentColor: string;
  badgeVariant: "primary" | "warning" | "success" | "default";
  icon: string;
  phases: CaseStudyPhase[];
  results: CaseStudyResult[];
  techStack: string[];
  testimonial?: { quote: string; author: string; role: string };
}

const caseStudies: CaseStudy[] = [
  {
    id: "finflow-saas-transformation",
    client: "Finflow Inc.",
    industry: "FinTech / B2B SaaS",
    serviceType: "Full-Stack SaaS Development",
    duration: "6 Weeks",
    year: "2025",
    tagline: "Turning a spreadsheet-based finance workflow into a real-time multi-tenant SaaS platform.",
    summary:
      "A growing finance consultancy was managing client portfolios across 120+ shared spreadsheets. Manual consolidation took 40+ hours per week. We rebuilt their entire workflow as a purpose-built SaaS platform.",
    gradient: "from-primary-500/15 via-primary-500/5 to-transparent",
    accentColor: "text-primary-400",
    badgeVariant: "primary",
    icon: "📊",
    phases: [
      {
        phase: "Problem",
        icon: "🔴",
        heading: "Spreadsheet chaos destroying team productivity",
        body:
          "The team was managing 120+ Google Sheets across 14 clients. Version conflicts, formula errors, and manual consolidation consumed over 40 hours per week. Real-time visibility into portfolio performance was non-existent.",
        bullets: [
          "No role-based access — all team members saw all client data",
          "Monthly revenue reports took 3 full days to compile",
          "Zero automated alerts for budget threshold breaches",
          "No audit trail or change history for client-facing deliverables",
        ],
      },
      {
        phase: "Solution",
        icon: "🟡",
        heading: "Multi-tenant SaaS platform with real-time analytics",
        body:
          "We engineered a multi-tenant SaaS platform with workspace-level data isolation, granular RBAC, real-time WebSocket dashboards, and Stripe subscription billing — all production-ready in 6 weeks.",
        bullets: [
          "Next.js App Router + TypeScript for type-safe fullstack architecture",
          "Prisma ORM with PostgreSQL for relational multi-tenant data isolation",
          "Recharts dashboard with WebSocket-driven live portfolio metrics",
          "Stripe subscription with Owner/Admin/Viewer tier billing",
          "Automated weekly reports via PDF export with branded templates",
        ],
      },
      {
        phase: "Result",
        icon: "🟢",
        heading: "40-hour weekly workflow reduced to under 2 hours",
        body:
          "Within the first month of launch, the client onboarded all 14 existing clients to the platform and immediately upsold 3 new enterprise accounts citing the platform as a key differentiator.",
        bullets: [
          "Weekly reporting time reduced from 40h → 1.5h (96% reduction)",
          "Client retention rate improved from 71% → 96% in 6 months",
          "Platform became a billable product generating additional MRR",
          "0 data errors or version conflicts since launch",
        ],
      },
    ],
    results: [
      { metric: "Reporting Hours / Week", before: "40 hrs", after: "1.5 hrs", delta: "−96%" },
      { metric: "Client Retention Rate", before: "71%", after: "96%", delta: "+35%" },
      { metric: "Data Errors / Month", before: "12–18", after: "0", delta: "−100%" },
      { metric: "New Accounts Won", before: "0 (no product)", after: "3 enterprise", delta: "+3 accounts" },
    ],
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Recharts", "WebSocket", "Vercel"],
    testimonial: {
      quote:
        "Nexora didn't just build us a dashboard — they fundamentally changed how we operate. The platform is now our biggest sales asset when pitching enterprise clients.",
      author: "James Thornton",
      role: "CEO, Finflow Inc.",
    },
  },
  {
    id: "bloom-ecommerce-growth",
    client: "Bloom Co.",
    industry: "Retail / E-Commerce",
    serviceType: "Full-Stack E-Commerce Development",
    duration: "4 Weeks",
    year: "2025",
    tagline: "Taking a local plant nursery from a static Wix page to a revenue-generating e-commerce store.",
    summary:
      "A beloved local plant nursery had zero online presence beyond a 5-year-old Wix page. They were losing orders to Instagram DMs with no checkout, no inventory management, and no way to handle the post-COVID surge in houseplant demand.",
    gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    accentColor: "text-emerald-400",
    badgeVariant: "success",
    icon: "🌿",
    phases: [
      {
        phase: "Problem",
        icon: "🔴",
        heading: "Instagram DMs as the checkout system",
        body:
          "Bloom Co. had no e-commerce system. Orders came through Instagram DMs, payment via UPI screenshots, and inventory was a physical notebook. They were turning away 30-50 orders per week simply because they couldn't manage demand.",
        bullets: [
          "Orders lost daily due to no real-time stock visibility",
          "No automated invoice or order confirmation to customers",
          "No way to run promotions, discounts, or seasonal sales",
          "Zero SEO presence — invisible to Google search for 'houseplants near me'",
        ],
      },
      {
        phase: "Solution",
        icon: "🟡",
        heading: "Full-stack store with CMS, cart, and payment gateway",
        body:
          "We built a complete Next.js e-commerce store with a custom admin CMS for product management, Razorpay checkout, Cloudinary image optimization, and automated order confirmation emails.",
        bullets: [
          "Next.js storefront with SSG product catalog for maximum SEO performance",
          "Custom admin panel: product CRUD, order management, inventory alerts",
          "Razorpay payment gateway with UPI, card, and net banking support",
          "Cloudinary WebP image CDN for blazing-fast product image delivery",
          "Nodemailer order confirmation emails with receipt PDF attachment",
        ],
      },
      {
        phase: "Result",
        icon: "🟢",
        heading: "300% revenue growth in the first quarter",
        body:
          "The store launched with 87 products. Within 3 months, Bloom Co. had processed over 1,200 orders, expanded their product catalog to 200+ items, and hired 2 additional staff to handle packaging.",
        bullets: [
          "Monthly revenue grew 3x within 90 days of launch",
          "1,200+ orders processed with zero payment failures",
          "Ranked #1 on Google for 'indoor plants Hyderabad' organically in 6 weeks",
          "Customer repeat purchase rate of 62% — far above industry average of 28%",
        ],
      },
    ],
    results: [
      { metric: "Monthly Revenue", before: "₹80k", after: "₹3.2L", delta: "+300%" },
      { metric: "Orders / Month", before: "~60 (manual)", after: "400+", delta: "+567%" },
      { metric: "Repeat Purchase Rate", before: "~15%", after: "62%", delta: "+313%" },
      { metric: "Google Ranking (local)", before: "Not listed", after: "#1 for 3 keywords", delta: "Top 3" },
    ],
    techStack: ["Next.js", "MongoDB", "Mongoose", "Cloudinary", "Razorpay", "Nodemailer", "Vercel"],
    testimonial: {
      quote:
        "I went from writing orders in a notebook to having a fully automated store. Nexora built something I didn't know I needed — and it changed everything.",
      author: "Priya Nair",
      role: "Founder, Bloom Co.",
    },
  },
  {
    id: "launchpad-conversion-boost",
    client: "LaunchPad (SaaS Startup)",
    industry: "SaaS / Developer Tools",
    serviceType: "High-Conversion Landing Page",
    duration: "5 Days",
    year: "2026",
    tagline: "Engineering a launch page that turned a 1.2% trial signup rate into 8.7% in under a week.",
    summary:
      "A pre-launch developer tool startup had a generic landing page built on a Notion template. Their paid ad campaigns were burning $3k/month with a 1.2% trial signup rate. We rebuilt the entire landing page from scratch — copy, design, and performance.",
    gradient: "from-violet-500/15 via-violet-500/5 to-transparent",
    accentColor: "text-violet-400",
    badgeVariant: "default",
    icon: "🚀",
    phases: [
      {
        phase: "Problem",
        icon: "🔴",
        heading: "A $3k/month ad spend with 1.2% conversion — bleeding money",
        body:
          "The client's Notion-exported landing page had a 9-second average Time to First Byte, zero above-the-fold CTA hierarchy, generic stock imagery, and copy that failed to communicate the core value proposition in under 5 seconds.",
        bullets: [
          "PageSpeed score: 31/100 mobile — ads penalized by Google Quality Score",
          "Hero headline was their company tagline, not a benefit-led hook",
          "No social proof — waitlist counter, GitHub stars, or user testimonials",
          "Single generic CTA button with no urgency or value framing",
        ],
      },
      {
        phase: "Solution",
        icon: "🟡",
        heading: "Performance-first page with conversion-psychology architecture",
        body:
          "We rebuilt the landing page on Next.js with sub-second LCP, rewrote the copy using the AIDA framework, added an animated feature bento grid, social proof ticker, waitlist countdown, and A/B-ready CTA variants.",
        bullets: [
          "Next.js static generation with edge CDN — 0.8s LCP on mobile",
          "Benefit-led hero with animated feature preview using Framer Motion",
          "Live waitlist counter + urgency countdown timer",
          "GitHub star count API integration as live social proof signal",
          "Resend-powered email capture with double opt-in confirmation",
        ],
      },
      {
        phase: "Result",
        icon: "🟢",
        heading: "7.25x improvement in trial signups without changing the ad budget",
        body:
          "Within 6 days of the new page going live, trial signup conversion rate jumped from 1.2% to 8.7%. The same $3k monthly ad budget that previously yielded ~40 signups per month now delivered 290+.",
        bullets: [
          "Trial signup conversion: 1.2% → 8.7% (7.25x improvement)",
          "PageSpeed score: 31 → 98 (mobile) — Google Ads Quality Score improved by 3 points",
          "Cost per signup reduced from $75 → $10.30",
          "290+ waitlist signups in the first month post-launch",
        ],
      },
    ],
    results: [
      { metric: "Conversion Rate", before: "1.2%", after: "8.7%", delta: "+7.25x" },
      { metric: "PageSpeed (Mobile)", before: "31/100", after: "98/100", delta: "+215%" },
      { metric: "Cost per Signup", before: "$75.00", after: "$10.30", delta: "−86%" },
      { metric: "Monthly Signups", before: "~40", after: "290+", delta: "+625%" },
    ],
    techStack: ["Next.js", "TypeScript", "Framer Motion", "Resend", "GitHub API", "Tailwind CSS", "Vercel Edge"],
    testimonial: {
      quote:
        "We were hemorrhaging ad spend on a broken page. Nexora rebuilt it in 5 days and our CAC dropped by 86%. I wish we'd done this 3 months earlier.",
      author: "Alex Mercer",
      role: "Co-Founder, LaunchPad",
    },
  },
];

function ResultsTable({ results }: { results: CaseStudyResult[] }) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 px-3 text-left text-xs text-muted-fg font-semibold uppercase tracking-wide">
              Metric
            </th>
            <th className="py-2 px-3 text-center text-xs text-muted-fg font-semibold uppercase tracking-wide">
              Before
            </th>
            <th className="py-2 px-3 text-center text-xs text-muted-fg font-semibold uppercase tracking-wide">
              After
            </th>
            <th className="py-2 px-3 text-center text-xs text-muted-fg font-semibold uppercase tracking-wide">
              Change
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.metric} className="border-b border-border/40 hover:bg-surface-1/40 transition-colors">
              <td className="py-3 px-3 text-xs text-foreground font-medium">{r.metric}</td>
              <td className="py-3 px-3 text-center text-xs text-muted-fg">{r.before}</td>
              <td className="py-3 px-3 text-center text-xs text-foreground font-semibold">{r.after}</td>
              <td className="py-3 px-3 text-center">
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {r.delta}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PhaseBlock({ ph, accentColor }: { ph: CaseStudyPhase; accentColor: string }) {
  const bg = {
    Problem: "bg-red-500/10 border-red-500/20",
    Solution: "bg-amber-500/10 border-amber-500/20",
    Result: "bg-emerald-500/10 border-emerald-500/20",
  }[ph.phase];

  const phaseColor = {
    Problem: "text-red-400",
    Solution: "text-amber-400",
    Result: "text-emerald-400",
  }[ph.phase];

  return (
    <div className={`rounded-xl border p-5 ${bg}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{ph.icon}</span>
        <span className={`text-xs font-bold uppercase tracking-widest ${phaseColor}`}>
          {ph.phase}
        </span>
      </div>
      <h4 className="font-heading font-semibold text-sm text-foreground mb-2">{ph.heading}</h4>
      <p className="text-xs text-muted-fg leading-relaxed mb-3">{ph.body}</p>
      {ph.bullets && (
        <ul className="space-y-1.5">
          {ph.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-[11px] text-muted-fg">
              <span className={`${phaseColor} mt-0.5 shrink-0`}>→</span>
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card hover={false} padding="none" className="overflow-hidden">
      {/* Header strip */}
      <div className={`relative h-4 bg-gradient-to-r ${cs.gradient} border-b border-border`} />

      <div className="p-6 sm:p-8">
        {/* Top meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={cs.badgeVariant} size="sm">{cs.serviceType}</Badge>
          <span className="text-[10px] text-muted-fg bg-surface-2 border border-border px-2 py-0.5 rounded-full">
            {cs.industry}
          </span>
          <span className="text-[10px] text-muted-fg bg-surface-2 border border-border px-2 py-0.5 rounded-full">
            {cs.duration} · {cs.year}
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{cs.icon}</span>
          <div>
            <h2 className={`font-heading text-xl sm:text-2xl font-bold ${cs.accentColor}`}>
              {cs.client}
            </h2>
            <p className="text-xs text-muted-fg">{cs.tagline}</p>
          </div>
        </div>

        <p className="text-sm text-muted-fg leading-relaxed mb-6">{cs.summary}</p>

        {/* Quick-results strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-xl bg-surface-1 border border-border">
          {cs.results.map((r) => (
            <div key={r.metric} className="text-center">
              <p className="font-heading text-lg font-bold text-emerald-400">{r.delta}</p>
              <p className="text-[10px] text-muted-fg leading-tight mt-0.5">{r.metric}</p>
            </div>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          id={`case-study-expand-${cs.id}`}
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
        >
          {expanded ? "Hide full case study ↑" : "Read full case study ↓"}
        </button>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <div className="mt-6 space-y-4">
                {cs.phases.map((ph) => (
                  <PhaseBlock key={ph.phase} ph={ph} accentColor={cs.accentColor} />
                ))}
              </div>

              {/* Results table */}
              <div className="mt-6 p-4 rounded-xl bg-surface-1 border border-border">
                <h4 className="font-heading font-semibold text-xs uppercase tracking-widest text-muted-fg mb-2">
                  Quantified Outcomes
                </h4>
                <ResultsTable results={cs.results} />
              </div>

              {/* Tech stack */}
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-fg mb-2 font-semibold">
                  Technology Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cs.techStack.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-surface-2 text-muted-fg border border-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              {cs.testimonial && (
                <blockquote className="mt-6 p-5 rounded-xl border border-border bg-surface-1 relative">
                  <span className="absolute top-3 left-4 text-3xl text-primary-400/30 font-serif leading-none select-none">
                    &ldquo;
                  </span>
                  <p className="text-sm text-foreground leading-relaxed pl-4 italic">
                    {cs.testimonial.quote}
                  </p>
                  <footer className="mt-3 pl-4">
                    <p className="text-xs font-semibold text-foreground">{cs.testimonial.author}</p>
                    <p className="text-[10px] text-muted-fg">{cs.testimonial.role}</p>
                  </footer>
                </blockquote>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

export function CaseStudiesListSection() {
  return (
    <Section id="case-studies-list" className="pb-24">
      <FadeInSection>
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
            In-Depth Analysis
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Problem → Solution → <span className="gradient-text">Result</span>
          </h2>
          <p className="mt-3 text-sm text-muted-fg max-w-xl leading-relaxed">
            Each case study documents the exact challenge we inherited, the engineering approach we applied, and the
            measurable outcome we delivered. Click to expand a full write-up.
          </p>
        </div>
      </FadeInSection>

      <StaggerList className="space-y-6">
        {caseStudies.map((cs) => (
          <CaseStudyCard key={cs.id} cs={cs} />
        ))}
      </StaggerList>
    </Section>
  );
}
