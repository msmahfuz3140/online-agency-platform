"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

export type ServiceCategory =
  | "All"
  | "Website Development"
  | "Design & Optimization"
  | "DevOps & Infrastructure"
  | "AI Solutions";

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  timeline: string;
  icon: string;
  tagline: string;
  description: string;
  deliverables: string[];
  techStack: string[];
  highlight?: boolean;
}

export const servicesData: ServiceItem[] = [
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    category: "Website Development",
    timeline: "48h – 3 Days",
    icon: "💼",
    tagline: "Showcase your craft and win high-ticket clients.",
    description:
      "A bespoke, responsive portfolio engineered to position you as an undisputed authority. Built with high-impact case study templates, interactive media galleries, and sub-second load times.",
    deliverables: [
      "Custom interactive case study layout",
      "Cloudinary WebP/AVIF media optimization",
      "Dynamic inquiry intake & contact form",
      "100/100 Core Web Vitals benchmark",
    ],
    techStack: ["Next.js 15", "Tailwind CSS", "Framer Motion", "Cloudinary"],
  },
  {
    id: "business-website",
    title: "Business Website",
    category: "Website Development",
    timeline: "3 – 5 Days",
    icon: "🏢",
    tagline: "High-trust corporate presence that commands market respect.",
    description:
      "A modern, multi-page business hub designed to convert prospects into contracts. Features structured lead capture, dynamic service catalogs, credibility badges, and local SEO schema.",
    deliverables: [
      "5 to 10 multi-page responsive architecture",
      "Interactive service & pricing breakdown",
      "Company bio, team cards & trust guarantees",
      "Integrated booking & appointment calendar",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    highlight: true,
  },
  {
    id: "landing-page",
    title: "Landing Page",
    category: "Website Development",
    timeline: "24h – 48 Hours",
    icon: "🚀",
    tagline: "Laser-focused sales funnel built for peak conversion rates.",
    description:
      "High-velocity landing pages purpose-built for product launches, ad campaigns, and waitlist signups. Engineered with persuasive copywriting hierarchy, social proof tickers, and zero bounce latency.",
    deliverables: [
      "Conversion-optimized hero with dynamic CTA",
      "Animated feature highlights & comparison table",
      "Interactive FAQ accordion with AnimatePresence",
      "Integrated email newsletter / lead capture hook",
    ],
    techStack: ["React 19", "Next.js", "Framer Motion", "Tailwind v4"],
  },
  {
    id: "saas-website",
    title: "SaaS Website",
    category: "Website Development",
    timeline: "5 – 7 Days",
    icon: "⚡",
    tagline: "Product marketing site that turns visitors into active subscribers.",
    description:
      "A slick, modern SaaS marketing site designed to showcase product capabilities. Features interactive product UI previews, tiered pricing matrices, changelog feeds, and smooth authentication redirects.",
    deliverables: [
      "Annual/Monthly pricing toggle with calculator",
      "Interactive feature mockups & bento grid cards",
      "Customer reviews & metrics transformation block",
      "Better Auth login/register integration ready",
    ],
    techStack: ["Next.js 16", "Better Auth", "Recharts", "Tailwind CSS"],
    highlight: true,
  },
  {
    id: "ecommerce-website",
    title: "E-commerce Website",
    category: "Website Development",
    timeline: "5 – 8 Days",
    icon: "🛍️",
    tagline: "Ultra-fast digital storefront built for frictionless checkouts.",
    description:
      "High-performance e-commerce platform with instant catalog search, responsive shopping cart drawer, secure payment processing, and streamlined mobile checkout experience.",
    deliverables: [
      "Product catalog with category & tag filtering",
      "Slide-out cart drawer with instant quantity sync",
      "Secure Stripe / digital gateway checkout flow",
      "Order confirmation email & customer receipt",
    ],
    techStack: ["Next.js", "MongoDB", "Stripe API", "Cloudinary"],
  },
  {
    id: "web-application",
    title: "Web Application",
    category: "Website Development",
    timeline: "1 – 2 Weeks",
    icon: "🖥️",
    tagline: "Complex full-stack applications built for reliability and scale.",
    description:
      "End-to-end web applications with authenticated client portals, role-based access control, relational and document database management, and asynchronous background tasks.",
    deliverables: [
      "Role-based authenticated user & admin portal",
      "CRUD database schemas & RESTful endpoints",
      "Interactive data visualizations & dashboards",
      "Comprehensive error boundary & audit logging",
    ],
    techStack: ["Next.js App Router", "Express.js", "MongoDB", "TypeScript"],
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    category: "Design & Optimization",
    timeline: "3 – 5 Days",
    icon: "🎨",
    tagline: "Figma design systems, wireframes, and prototypes that inspire.",
    description:
      "Human-centered design systems crafted with obsessive attention to visual hierarchy, accessibility (WCAG 2.1), modern dark/light typography, and seamless developer handoff specs.",
    deliverables: [
      "Complete Figma component library with auto-layout",
      "High-fidelity interactive desktop & mobile prototypes",
      "Consistent color tokens, typography & spacing scale",
      "User journey maps and conversion flow wireframes",
    ],
    techStack: ["Figma", "Design Tokens", "UX Research", "WCAG 2.1"],
  },
  {
    id: "website-redesign",
    title: "Website Redesign",
    category: "Design & Optimization",
    timeline: "3 – 5 Days",
    icon: "🔄",
    tagline: "Transform outdated sites into modern, high-converting flagships.",
    description:
      "Overhaul sluggish, outdated websites into sleek, modern digital powerhouses without losing your hard-earned SEO ranking, backlinks, or historical domain authority.",
    deliverables: [
      "Complete visual and architectural UI overhaul",
      "Core Web Vitals performance boost from 40 to 95+",
      "301 SEO redirect mapping to preserve Google rankings",
      "Migration from legacy WordPress/Wix to Next.js",
    ],
    techStack: ["Next.js 16", "Turbopack", "SEO Audit", "Tailwind CSS"],
  },
  {
    id: "seo-optimization",
    title: "SEO Optimization",
    category: "Design & Optimization",
    timeline: "2 – 4 Days",
    icon: "📈",
    tagline: "Dominate search rankings and attract qualified organic buyers.",
    description:
      "Technical, on-page, and semantic SEO tuning designed to push your site to the top of Google. Includes JSON-LD rich snippets, OpenGraph cards, speed tuning, and canonical structure.",
    deliverables: [
      "Schema.org JSON-LD structured data implementation",
      "Dynamic XML sitemap & robots.txt configuration",
      "Core Web Vitals speed optimization (LCP, FID, CLS)",
      "Meta tags, OpenGraph previews & keyword hierarchy",
    ],
    techStack: ["Next.js Metadata API", "Schema.org", "Lighthouse", "Google Search Console"],
  },
  {
    id: "website-maintenance",
    title: "Website Maintenance",
    category: "DevOps & Infrastructure",
    timeline: "Ongoing / 24h SLA",
    icon: "🛠️",
    tagline: "Proactive security, uptime monitoring, and continuous updates.",
    description:
      "Sleep peacefully knowing your digital flagship is monitored 24/7. We handle dependency updates, automated backups, security patching, bug fixes, and on-demand content tweaks.",
    deliverables: [
      "24/7 uptime monitoring & instant alert dispatch",
      "Regular npm dependency & security patch upgrades",
      "Automated database snapshots and offsite backups",
      "Dedicated priority slack/email support channel",
    ],
    techStack: ["GitHub Actions", "Uptime Monitoring", "Sentry", "Mongo Backups"],
  },
  {
    id: "hosting-setup",
    title: "Hosting Setup",
    category: "DevOps & Infrastructure",
    timeline: "12 – 24 Hours",
    icon: "☁️",
    tagline: "Enterprise cloud hosting with zero downtime edge deployments.",
    description:
      "Seamless cloud deployment setup with edge CDN routing, automated continuous integration (CI/CD), environment variable isolation, and automatic global caching rules.",
    deliverables: [
      "Vercel, Render, Railway or AWS cloud provisioning",
      "Automated git push-to-deploy CI/CD workflow",
      "Global Anycast edge CDN configuration",
      "DDoS defense & automatic SSL certificate renewal",
    ],
    techStack: ["Vercel Edge", "AWS / Render", "Cloudflare", "GitHub CI/CD"],
  },
  {
    id: "domain-setup",
    title: "Domain Setup",
    category: "DevOps & Infrastructure",
    timeline: "12 Hours",
    icon: "🌐",
    tagline: "Frictionless DNS mapping, SSL encryption, and email deliverability.",
    description:
      "Eliminate domain confusion. We configure your custom domain, nameservers, DNSSEC records, and enterprise email security records (SPF, DKIM, DMARC) for maximum inbox delivery.",
    deliverables: [
      "Custom domain connection & DNS propagation check",
      "SPF, DKIM, DMARC records to prevent email spam flags",
      "Auto-renewing TLS 1.3 HTTPS encryption",
      "Apex-to-WWW or WWW-to-Apex automatic redirect rules",
    ],
    techStack: ["Cloudflare DNS", "DNSSEC", "SPF/DKIM/DMARC", "TLS 1.3"],
  },
  {
    id: "ai-solution-development",
    title: "AI Solution Development",
    category: "AI Solutions",
    timeline: "3 – 7 Days",
    icon: "🤖",
    tagline: "Supercharge your business with custom Claude-powered AI workflows.",
    description:
      "Harness the power of Anthropic Claude Sonnet to automate business operations. From instant AI website generation engines to intelligent customer copilot chat systems and structured data extractors.",
    deliverables: [
      "Custom Anthropic Claude 3.5 / Sonnet API integration",
      "Deterministic JSON schema generation pipeline",
      "Real-time streaming AI response handlers",
      "Prompt safety guardrails and token quota controls",
    ],
    techStack: ["Anthropic Claude", "JSON Schema", "Node.js REST", "Better Auth"],
    highlight: true,
  },
];

const categories: ServiceCategory[] = [
  "All",
  "Website Development",
  "Design & Optimization",
  "DevOps & Infrastructure",
  "AI Solutions",
];

export function ServicesGridSection() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("All");

  const filteredServices =
    selectedCategory === "All"
      ? servicesData
      : servicesData.filter((s) => s.category === selectedCategory);

  return (
    <Section id="services-list" className="relative py-20 lg:py-28">
      {/* Section Header */}
      <FadeInSection>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="primary" size="sm" className="mb-3">
            Core Offerings
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Explore Our <span className="gradient-text">13 Specialized Services</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-fg leading-relaxed">
            Every service is executed with production-grade Next.js, rigorous cybersecurity,
            and deterministic AI speed. Select a category below to filter.
          </p>
        </div>
      </FadeInSection>

      {/* Category Tabs */}
      <FadeInSection delay={0.1}>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? servicesData.length
                : servicesData.filter((s) => s.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-primary-500 text-white shadow-[0_0_18px_rgba(20,184,160,0.35)]"
                    : "bg-surface-2 text-muted-fg hover:text-foreground hover:bg-neutral-800 border border-border"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-neutral-800 text-muted-fg"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </FadeInSection>

      {/* Services Grid wrapped in StaggerList */}
      <StaggerList className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            hover
            padding="lg"
            className={`relative flex flex-col justify-between h-full bg-surface/60 border-border/80 transition-all duration-300 ${
              service.highlight
                ? "border-primary-500/40 shadow-[0_8px_30px_rgba(20,184,160,0.08)] ring-1 ring-primary-500/20"
                : ""
            }`}
          >
            {/* Highlight Banner if Popular */}
            {service.highlight && (
              <div className="absolute top-0 right-0">
                <span className="inline-block bg-primary-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow-sm">
                  Popular Choice
                </span>
              </div>
            )}

            <div>
              {/* Header meta */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl h-12 w-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center shadow-inner">
                  {service.icon}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-surface-2 text-muted-fg border border-border/70">
                    ⏱ {service.timeline}
                  </span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="mb-3">
                <span className="text-[11px] uppercase tracking-wider font-mono text-primary-400 font-semibold block mb-1">
                  {service.category}
                </span>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  {service.title}
                </h3>
                <p className="text-xs font-medium text-neutral-300 mt-1">
                  {service.tagline}
                </p>
              </div>

              {/* Full Description */}
              <p className="text-xs text-muted-fg leading-relaxed mt-2.5">
                {service.description}
              </p>

              {/* Deliverables Checklist */}
              <div className="mt-5 pt-4 border-t border-border/60">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-fg mb-2.5">
                  Key Deliverables:
                </p>
                <ul className="space-y-2">
                  {service.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                      <span className="h-4 w-4 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-snug">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Stack & CTA */}
            <div className="mt-6 pt-5 border-t border-border/60">
              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {service.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-muted-fg border border-border/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Link href="/#cost-calculator" className="w-full">
                  <Button variant="primary" size="sm" className="w-full text-xs">
                    Get Estimate →
                  </Button>
                </Link>
                <Link href="/#ai-generator-demo" className="w-full">
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    Try AI Demo
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </StaggerList>
    </Section>
  );
}
