"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";

interface ComponentBlock {
  id: string;
  name: string;
  category: string;
  icon: string;
  variantsCount: number;
  description: string;
  previewTitle: string;
  previewSnippet: string;
  reactProps: string[];
}

const componentBlocks: ComponentBlock[] = [
  {
    id: "hero",
    name: "Hero Section Blocks",
    category: "Layout",
    icon: "🌟",
    variantsCount: 8,
    description: "High-impact conversion hero headers with animated typography, CTAs, video/device mockups, and ambient background glows.",
    previewTitle: "Hero_Split_CardStack_v3",
    previewSnippet: `<HeroSection variant="split-visual" glowColor="teal" animation="spring">
  <Headline gradient>We build digital products that convert</Headline>
  <StatsCounter live metrics={[{ to: 120, suffix: "+" }]} />
</HeroSection>`,
    reactProps: ["variant: 'split' | 'centered' | 'video'", "glow: boolean", "animatedCounter: true"],
  },
  {
    id: "features",
    name: "Feature Grids & Bento",
    category: "Content",
    icon: "🍱",
    variantsCount: 12,
    description: "Modern Bento-box layouts, interactive hover cards, icon grids, and staggered scroll-reveal components.",
    previewTitle: "BentoGrid_Interactive_v2",
    previewSnippet: `<BentoGrid columns={3} hoverGlow={true}>
  <BentoCard icon="⚡" title="Speed-First" span={2} />
  <BentoCard icon="🛡️" title="Cyber Security" span={1} />
</BentoGrid>`,
    reactProps: ["columns: 2 | 3 | 4", "staggerDelay: 0.08", "hoverEffect: 'glow' | 'lift'"],
  },
  {
    id: "pricing",
    name: "Pricing Tables & Toggles",
    category: "E-Commerce",
    icon: "💳",
    variantsCount: 6,
    description: "Monthly/annual billing toggles, highlighted popular tier cards, feature checklists, and Stripe checkout buttons.",
    previewTitle: "PricingTable_Tiered_v4",
    previewSnippet: `<PricingGrid tiers={[Starter, Growth, Scale]}>
  <TierCard popular={true} glowRing={true} ctaText="Get Started" />
</PricingGrid>`,
    reactProps: ["popularGlow: true", "currency: 'USD' | 'BDT'", "discountBadge: '-20%'"],
  },
  {
    id: "reviews",
    name: "Social Proof & Testimonials",
    category: "Trust",
    icon: "⭐",
    variantsCount: 7,
    description: "Star rating blocks, verified client badge cards, marquee review carousels, and video testimonial modals.",
    previewTitle: "TestimonialGrid_StarRating_v2",
    previewSnippet: `<ReviewGrid layout="masonry" starRating={5}>
  <ClientCard author="Tahmid R." role="Founder, PayPath" verified={true} />
</ReviewGrid>`,
    reactProps: ["showStars: true", "avatarType: 'initials' | 'image'", "verifiedBadge: true"],
  },
  {
    id: "cta",
    name: "Conversion CTA Banners",
    category: "Action",
    icon: "📣",
    variantsCount: 5,
    description: "High-converting action cards with ambient glow, dual action buttons, and newsletter capture forms.",
    previewTitle: "CtaBanner_GlowAmbient_v3",
    previewSnippet: `<CtaSection variant="gradient-glow" shape="rounded-3xl">
  <Heading>Ready to build something remarkable?</Heading>
  <Button variant="primary">Book Free Discovery Call</Button>
</CtaSection>`,
    reactProps: ["glowRadius: '80px'", "dualButton: true", "backdropBlur: 'xl'"],
  },
  {
    id: "contact",
    name: "Interactive Forms & Booking",
    category: "Forms",
    icon: "📝",
    variantsCount: 6,
    description: "Lead qualification forms, date/time meeting schedulers, file upload attachments, and instant confirmation toast.",
    previewTitle: "ContactForm_MultiStep_v2",
    previewSnippet: `<ContactForm withScheduler={true} validation="zod">
  <Step1 fields={["name", "email", "budget"]} />
  <Step2 fields={["timeline", "brief"]} />
</ContactForm>`,
    reactProps: ["instantValidation: true", "rateLimiter: true", "toastOnSuccess: true"],
  },
];

export function AiComponentLibrarySection() {
  const [activeTab, setActiveTab] = useState<ComponentBlock>(componentBlocks[0]);

  return (
    <Section id="component-library" className="bg-surface/30 relative">
      {/* Header */}
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <Badge variant="primary" dot className="mb-3">
            Modular React Engine
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            AI-Powered <span className="gradient-text">Component Architecture</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-2xl mx-auto leading-relaxed">
            Our AI doesn&apos;t spit out messy spaghetti code. It intelligently arranges curated, enterprise-grade Next.js React components tailored to your exact business.
          </p>
        </div>
      </FadeInSection>

      {/* Tabs list */}
      <FadeInSection delay={0.1}>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {componentBlocks.map((block) => {
            const isSelected = block.id === activeTab.id;
            return (
              <button
                key={block.id}
                type="button"
                onClick={() => setActiveTab(block)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-surface border-primary-500 text-foreground shadow-[0_0_20px_rgba(20,184,160,0.25)] scale-[1.02]"
                    : "bg-surface/60 border-border/80 text-muted-fg hover:text-foreground hover:bg-surface"
                }`}
              >
                <span>{block.icon}</span>
                <span>{block.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary-500/15 text-primary-400 font-mono">
                  {block.variantsCount} variants
                </span>
              </button>
            );
          })}
        </div>
      </FadeInSection>

      {/* Interactive Component Viewer Frame */}
      <FadeInSection delay={0.2}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-neutral-800 bg-neutral-950/90 shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-6 sm:p-8 relative overflow-hidden ring-1 ring-white/5"
          >
            {/* Ambient corner glow */}
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary-500/10 blur-[80px] pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
              {/* Left Info & Schema */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{activeTab.icon}</span>
                  <Badge variant="primary" size="sm">
                    {activeTab.category} Component
                  </Badge>
                </div>

                <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                  {activeTab.name}
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm text-muted-fg leading-relaxed">
                  {activeTab.description}
                </p>

                {/* React Props Tags */}
                <div className="mt-6">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-primary-400 font-bold mb-2">
                    Configurable React Props:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTab.reactProps.map((prop) => (
                      <span
                        key={prop}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-neutral-300"
                      >
                        {prop}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 text-xs text-muted-fg">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Fully accessible (WAI-ARIA) & TypeScript typed</span>
                </div>
              </div>

              {/* Right Code & Snippet Preview Box */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 font-mono text-xs overflow-x-auto shadow-inner">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-neutral-400 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                    <span className="ml-2 text-foreground font-semibold">
                      {activeTab.previewTitle}.tsx
                    </span>
                  </div>
                  <span className="text-[10px] text-primary-400 font-bold">REACT TSX</span>
                </div>

                <pre className="text-neutral-300 leading-relaxed overflow-x-auto">
                  <code>{activeTab.previewSnippet}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </FadeInSection>
    </Section>
  );
}
