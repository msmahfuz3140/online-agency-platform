"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";

export type ProjectCategory =
  | "All"
  | "SaaS & Web App"
  | "E-Commerce"
  | "Portfolio"
  | "Landing Page"
  | "AI Solutions";

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  description: string;
  features: string[];
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  gradient: string;
  accentColor: string;
  icon: string;
  year: string;
  badge?: string;
}

const projects: ProjectItem[] = [
  {
    id: "finflow-saas",
    title: "Finflow",
    tagline: "Multi-tenant finance SaaS dashboard",
    category: "SaaS & Web App",
    description:
      "A comprehensive multi-tenant SaaS platform for finance teams — real-time analytics, role-based access control, Stripe billing integration, and a beautiful recharts dashboard.",
    features: [
      "Multi-tenant workspace isolation",
      "Real-time data with WebSocket updates",
      "Stripe subscription & invoice management",
      "Role-based access (Owner, Admin, Viewer)",
      "Export CSV / PDF financial reports",
    ],
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Recharts"],
    liveUrl: "#",
    githubUrl: "#",
    gradient: "from-primary-500/25 via-primary-500/10 to-transparent",
    accentColor: "text-primary-400",
    icon: "📊",
    year: "2025",
    badge: "Featured",
  },
  {
    id: "bloom-ecommerce",
    title: "Bloom Co.",
    tagline: "Full-stack plant nursery e-commerce store",
    category: "E-Commerce",
    description:
      "A full-stack e-commerce store for a plant nursery brand — custom CMS for product management, cart & wishlist, Razorpay checkout, and Cloudinary image optimization.",
    features: [
      "Custom admin CMS for products & orders",
      "Shopping cart, wishlist & checkout flow",
      "Razorpay payment gateway integration",
      "Cloudinary WebP image CDN delivery",
      "Order tracking & email notifications",
    ],
    tech: ["Next.js", "MongoDB", "Mongoose", "Cloudinary", "Razorpay", "Nodemailer"],
    liveUrl: "#",
    githubUrl: "#",
    gradient: "from-emerald-500/25 via-emerald-500/10 to-transparent",
    accentColor: "text-emerald-400",
    icon: "🌿",
    year: "2025",
  },
  {
    id: "radius-studio",
    title: "Radius Studio",
    tagline: "Motion-rich creative agency portfolio",
    category: "Portfolio",
    description:
      "A high-impact portfolio website for a design studio — GSAP scroll-triggered animations, Sanity CMS-backed project pages, and a bespoke interactive case study layout.",
    features: [
      "GSAP & Framer Motion scroll animations",
      "Sanity CMS content management backend",
      "Dynamic project case study detail pages",
      "Interactive cursor & parallax effects",
      "Sub-second LCP with 100/100 Lighthouse score",
    ],
    tech: ["Next.js", "Sanity", "GSAP", "Framer Motion", "TypeScript"],
    liveUrl: "#",
    githubUrl: "#",
    gradient: "from-violet-500/25 via-violet-500/10 to-transparent",
    accentColor: "text-violet-400",
    icon: "🎨",
    year: "2025",
  },
  {
    id: "launchpad-landing",
    title: "LaunchPad",
    tagline: "High-conversion SaaS product launch page",
    category: "Landing Page",
    description:
      "A high-velocity product launch landing page for a SaaS startup — persuasive copy hierarchy, animated feature previews, social proof ticker, and waitlist email capture.",
    features: [
      "Animated feature highlights & bento grid",
      "Waitlist form with instant confirmation toast",
      "Countdown timer for launch deadline",
      "Social proof ticker with live user count",
      "A/B test-ready CTA section variants",
    ],
    tech: ["Next.js", "Framer Motion", "Resend", "Tailwind CSS", "TypeScript"],
    liveUrl: "#",
    githubUrl: "#",
    gradient: "from-amber-500/25 via-amber-500/10 to-transparent",
    accentColor: "text-amber-400",
    icon: "🚀",
    year: "2025",
    badge: "New",
  },
  {
    id: "nexora-ai-builder",
    title: "Nexora AI Builder",
    tagline: "AI-powered website generation engine",
    category: "AI Solutions",
    description:
      "The AI website generation engine powering Nexora's platform — Claude Sonnet 3.5 API integration, structured JSON output, dynamic component renderer, and inline editing.",
    features: [
      "Claude Sonnet 3.5 structured JSON generation",
      "Dynamic section component mapper & renderer",
      "Inline text editing with live preview",
      "AI credits system per user account",
      "One-click Save as Draft / Publish workflow",
    ],
    tech: ["Next.js", "Claude API", "Node.js", "MongoDB", "Better Auth", "TypeScript"],
    liveUrl: "#",
    githubUrl: "#",
    gradient: "from-rose-500/25 via-rose-500/10 to-transparent",
    accentColor: "text-rose-400",
    icon: "🤖",
    year: "2026",
    badge: "AI Live",
  },
  {
    id: "medconnect-app",
    title: "MedConnect",
    tagline: "Doctor appointment booking web app",
    category: "SaaS & Web App",
    description:
      "A HIPAA-informed doctor appointment booking platform — specialization filters, real-time slot availability, video consultation links, and patient history dashboard.",
    features: [
      "Doctor profile & specialization search",
      "Real-time availability slot calendar",
      "Video consultation room link generation",
      "Patient medical history & notes module",
      "Automated SMS appointment reminders",
    ],
    tech: ["Next.js", "PostgreSQL", "Prisma", "Twilio SMS", "WebRTC", "TypeScript"],
    liveUrl: "#",
    githubUrl: "#",
    gradient: "from-sky-500/25 via-sky-500/10 to-transparent",
    accentColor: "text-sky-400",
    icon: "🏥",
    year: "2024",
  },
  {
    id: "craftfolio",
    title: "Craftfolio",
    tagline: "Developer portfolio with live code preview",
    category: "Portfolio",
    description:
      "A developer portfolio with an embedded live code playground — Monaco Editor integration, animated skill bars, GitHub activity graph, and dark/light theme toggle.",
    features: [
      "Monaco Editor live code playground",
      "Animated skill proficiency bars",
      "GitHub contribution activity heatmap",
      "Multi-theme switcher (dark / light / neon)",
      "CMS-backed blog with MDX rendering",
    ],
    tech: ["Next.js", "Monaco Editor", "MDX", "GitHub API", "Framer Motion"],
    liveUrl: "#",
    githubUrl: "#",
    gradient: "from-orange-500/25 via-orange-500/10 to-transparent",
    accentColor: "text-orange-400",
    icon: "👨‍💻",
    year: "2024",
  },
  {
    id: "ecomart",
    title: "EcoMart",
    tagline: "Sustainable product marketplace",
    category: "E-Commerce",
    description:
      "A sustainable product marketplace connecting eco-conscious brands with buyers — vendor multi-store architecture, carbon footprint badges, and ethical supply chain transparency.",
    features: [
      "Multi-vendor store architecture",
      "Carbon footprint label per product",
      "Ethical supply chain transparency module",
      "Stripe Connect vendor payouts",
      "Product review moderation system",
    ],
    tech: ["Next.js", "Stripe Connect", "PostgreSQL", "Redis", "Cloudinary"],
    liveUrl: "#",
    githubUrl: "#",
    gradient: "from-teal-500/25 via-teal-500/10 to-transparent",
    accentColor: "text-teal-400",
    icon: "🌍",
    year: "2024",
  },
];

const categories: ProjectCategory[] = [
  "All",
  "SaaS & Web App",
  "E-Commerce",
  "Portfolio",
  "Landing Page",
  "AI Solutions",
];

export function PortfolioGridSection() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All");

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <Section id="portfolio-grid" className="pb-24">
      {/* Category filter pills */}
      <FadeInSection>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`portfolio-filter-${cat.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-primary-500 border-primary-500 text-white shadow-[0_0_14px_rgba(20,184,160,0.4)]"
                  : "border-border text-muted-fg hover:border-primary-400 hover:text-foreground bg-surface-1"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FadeInSection>

      {/* Project grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filtered.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.4 }}
            >
              <Card hover padding="none" className="group overflow-hidden h-full flex flex-col">
                {/* Project visual header */}
                <div
                  className={`relative h-44 bg-gradient-to-br ${project.gradient} border-b border-border flex items-center justify-center overflow-hidden`}
                >
                  <span className="text-5xl select-none opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300">
                    {project.icon}
                  </span>
                  {/* Overlay badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900/80 text-muted-fg border border-border backdrop-blur-sm">
                      {project.year}
                    </span>
                    {project.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30">
                        {project.badge}
                      </span>
                    )}
                  </div>
                  {/* Category chip at bottom */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-neutral-900/80 text-muted-fg border border-border backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                  {/* Link icons top-right */}
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Live demo of ${project.title}`}
                      className="h-7 w-7 rounded-lg bg-neutral-900/80 border border-border flex items-center justify-center text-xs hover:bg-primary-500/20 hover:border-primary-500/40 transition-all backdrop-blur-sm"
                    >
                      ↗
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub source of ${project.title}`}
                      className="h-7 w-7 rounded-lg bg-neutral-900/80 border border-border flex items-center justify-center text-xs hover:bg-neutral-700/80 transition-all backdrop-blur-sm"
                    >
                      ⌥
                    </a>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-4 sm:p-5">
                  <h3 className={`font-heading font-bold text-base text-foreground ${project.accentColor}`}>
                    {project.title}
                  </h3>
                  <p className="text-xs text-muted-fg mt-0.5 mb-2">{project.tagline}</p>
                  <p className="text-xs text-muted-fg leading-relaxed flex-1 mb-3">
                    {project.description}
                  </p>

                  {/* Key features */}
                  <ul className="space-y-1 mb-3">
                    {project.features.slice(0, 3).map((feat) => (
                      <li key={feat} className="flex items-start gap-1.5 text-[11px] text-muted-fg">
                        <span className="text-primary-400 mt-0.5 shrink-0">✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-surface-2 text-muted-fg border border-border"
                      >
                        {t}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-2 text-muted-fg border border-border">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="primary"
                      size="sm"
                      asChild
                      className="flex-1 text-xs"
                    >
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        Live Demo ↗
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex-1 text-xs"
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty state */}
      {filtered.length === 0 && (
        <FadeInSection>
          <div className="text-center py-20">
            <span className="text-5xl">🔍</span>
            <p className="mt-4 text-muted-fg text-sm">No projects found in this category yet.</p>
          </div>
        </FadeInSection>
      )}
    </Section>
  );
}
