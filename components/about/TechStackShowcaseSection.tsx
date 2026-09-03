"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";

type Category = "All" | "Frontend" | "Backend" | "AI Engine" | "Data & Cloud" | "Security";

interface TechItem {
  name: string;
  category: Category;
  role: string;
  badge: string;
  icon: string;
  description: string;
}

const techItems: TechItem[] = [
  {
    name: "Next.js 16 (Turbopack)",
    category: "Frontend",
    role: "Fullstack React Framework",
    badge: "App Router",
    icon: "▲",
    description: "Server Components, streaming SSR, edge middleware, and sub-second page loads.",
  },
  {
    name: "React 19",
    category: "Frontend",
    role: "Core UI Library",
    badge: "Concurrent",
    icon: "⚛️",
    description: "Next-gen transitions, fine-grained state reactivity, and optimized client rendering.",
  },
  {
    name: "TypeScript",
    category: "Frontend",
    role: "Type Safety Standard",
    badge: "Strict Mode",
    icon: "📘",
    description: "End-to-end contract validation between frontend props and backend JSON APIs.",
  },
  {
    name: "Tailwind CSS v4",
    category: "Frontend",
    role: "Design Token Engine",
    badge: "Zero Runtime",
    icon: "🎨",
    description: "Modern CSS-first utility architecture with custom charcoal and electric teal palettes.",
  },
  {
    name: "Framer Motion",
    category: "Frontend",
    role: "Hardware-Accelerated Animation",
    badge: "60 FPS",
    icon: "✨",
    description: "Fluid scroll choreography, staggered entrance lists, and micro-interactions.",
  },
  {
    name: "Node.js & Express",
    category: "Backend",
    role: "High-Throughput API Gateway",
    badge: "RESTful",
    icon: "🟢",
    description: "Lightweight, event-driven backend servicing auth, user profiles, and AI streams.",
  },
  {
    name: "Anthropic Claude (Sonnet 4.6)",
    category: "AI Engine",
    role: "Structured Website Compiler",
    badge: "Strict JSON",
    icon: "🤖",
    description: "Prompt-to-component translation without hallucinated CSS or unmaintainable HTML.",
  },
  {
    name: "MongoDB & Mongoose",
    category: "Data & Cloud",
    role: "Document Data Platform",
    badge: "NoSQL",
    icon: "🍃",
    description: "Flexible JSON schemas storing website documents, user credits, and audit logs.",
  },
  {
    name: "Cloudinary CDN",
    category: "Data & Cloud",
    role: "Media Optimization Pipeline",
    badge: "Auto AVIF/WebP",
    icon: "☁️",
    description: "Instant responsive image delivery, asset transformations, and ultra-fast global caching.",
  },
  {
    name: "Better Auth",
    category: "Security",
    role: "Session & Credential Security",
    badge: "Mongo Adapter",
    icon: "🔐",
    description: "Hardened session cookies, CSRF protection, and role-based access control.",
  },
  {
    name: "Recharts",
    category: "Frontend",
    role: "Data Analytics & Sparklines",
    badge: "SVG Native",
    icon: "📊",
    description: "Interactive analytics dashboards for website performance and client growth stats.",
  },
  {
    name: "Vercel Edge Network",
    category: "Data & Cloud",
    role: "Global Deployment Infrastructure",
    badge: "<50ms TTFB",
    icon: "⚡",
    description: "Worldwide Anycast routing, edge functions, and automatic HTTPS / DDoS defense.",
  },
];

const categories: Category[] = ["All", "Frontend", "Backend", "AI Engine", "Data & Cloud", "Security"];

export function TechStackShowcaseSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const filteredItems = selectedCategory === "All"
    ? techItems
    : techItems.filter((item) => item.category === selectedCategory);

  return (
    <Section id="tech-stack" className="relative py-20 lg:py-28 bg-surface/20 border-t border-border/50">
      <FadeInSection>
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge variant="primary" size="sm" className="mb-3">
            Architectural DNA
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Our Battle-Tested <span className="gradient-text">Technology Stack</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-fg leading-relaxed">
            We don&apos;t chase fads. We select tools that guarantee lightning-fast performance,
            bulletproof type safety, and seamless AI composability.
          </p>
        </div>
      </FadeInSection>

      {/* Category Filter Pills */}
      <FadeInSection delay={0.1}>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary-500 text-white shadow-[0_0_16px_rgba(20,184,160,0.35)]"
                  : "bg-surface-2 text-muted-fg hover:text-foreground hover:bg-neutral-800 border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FadeInSection>

      {/* Tech Cards Grid */}
      <motion.div
        layout
        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        <AnimatePresence>
          {filteredItems.map((tech) => (
            <motion.div
              key={tech.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <Card hover padding="md" className="h-full bg-surface/60 border-border/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl h-10 w-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center">
                      {tech.icon}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 border border-primary-500/20">
                      {tech.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-foreground mt-2">
                    {tech.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary-400 mt-0.5">
                    {tech.role}
                  </p>
                  <p className="text-xs text-muted-fg leading-relaxed mt-2.5">
                    {tech.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-fg font-mono">
                  <span>{tech.category}</span>
                  <span className="text-emerald-400 font-medium">Verified</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Why Our Stack Matters */}
      <FadeInSection delay={0.2}>
        <div className="mt-16 p-6 sm:p-8 rounded-2xl border border-border/80 bg-surface/40 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="h-12 w-12 rounded-2xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center text-2xl shrink-0 text-primary-400">
              ⚡
            </div>
            <div>
              <h4 className="font-heading font-bold text-base sm:text-lg text-foreground text-center sm:text-left">
                Why this architecture gives your business an unfair advantage
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-muted-fg leading-relaxed text-center sm:text-left">
                By pairing Next.js App Router with Claude&apos;s deterministic JSON compiler, your site enjoys
                instant page loads, zero code debt, and seamless future scalability. You are never trapped
                inside a slow, proprietary CMS that crashes when traffic spikes.
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>
    </Section>
  );
}
