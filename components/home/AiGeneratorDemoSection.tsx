"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";

interface PresetSite {
  id: string;
  name: string;
  category: string;
  icon: string;
  prompt: string;
  themeColor: string;
  accentBg: string;
  navTitle: string;
  heroBadge: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  features: { title: string; desc: string; icon: string }[];
}

const presets: PresetSite[] = [
  {
    id: "saas",
    name: "CloudFlow SaaS",
    category: "B2B Software",
    icon: "🚀",
    prompt: "Modern dark-mode landing page for an AI analytics platform with real-time dashboards and team workflows.",
    themeColor: "text-primary-400 border-primary-500/40 bg-primary-500/10",
    accentBg: "from-primary-500/20 via-primary-500/5 to-transparent",
    navTitle: "CloudFlow AI",
    heroBadge: "v2.4 Released with Claude Sonnet 4.6",
    headline: "Automate your engineering telemetry with AI.",
    subheadline: "Real-time metrics, anomaly detection, and automated incident response for modern engineering teams.",
    ctaText: "Start 14-Day Free Trial",
    features: [
      { title: "Real-Time Telemetry", desc: "Sub-millisecond metric ingestion and streaming dashboards.", icon: "⚡" },
      { title: "AI Root-Cause", desc: "Automated issue diagnosis using advanced LLM reasoning.", icon: "🤖" },
      { title: "Zero Setup CI/CD", desc: "Connect your GitHub repo and get instant deployment pipelines.", icon: "🔄" },
    ],
  },
  {
    id: "security",
    name: "Nexus Cyber Defense",
    category: "Cyber Security",
    icon: "🛡️",
    prompt: "Hardened cybersecurity agency website offering penetration testing, zero-day threat defense, and compliance audits.",
    themeColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    accentBg: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    navTitle: "Nexus Security",
    heroBadge: "OWASP & SOC2 Type II Certified",
    headline: "Offensive security audits for high-risk platforms.",
    subheadline: "Continuous vulnerability assessments, white-hat pen testing, and zero-trust infrastructure hardening.",
    ctaText: "Schedule Security Audit",
    features: [
      { title: "Penetration Testing", desc: "Comprehensive white-box & black-box application security tests.", icon: "⚔️" },
      { title: "API Hardening", desc: "Zero-trust token verification and automated rate-limit defense.", icon: "🔒" },
      { title: "24/7 Threat Guard", desc: "Live intrusion detection and rapid incident response teams.", icon: "📡" },
    ],
  },
  {
    id: "cafe",
    name: "Aura Artisan Roasters",
    category: "Coffee & Food",
    icon: "☕",
    prompt: "Boutique specialty coffee roastery website with online ordering, bean subscription, and cafe locator.",
    themeColor: "text-amber-400 border-amber-500/40 bg-amber-500/10",
    accentBg: "from-amber-500/20 via-amber-500/5 to-transparent",
    navTitle: "Aura Roasters",
    heroBadge: "Direct-Trade Ethically Sourced Beans",
    headline: "Crafted single-origin coffee, roasted to perfection.",
    subheadline: "Experience micro-lot coffees delivered fresh to your door every week with our custom roast subscriptions.",
    ctaText: "Shop Fresh Roasts",
    features: [
      { title: "Micro-Lot Single Origin", desc: "Directly sourced from high-altitude farms in Ethiopia & Colombia.", icon: "🌱" },
      { title: "Weekly Subscriptions", desc: "Custom roast schedules roasted and shipped within 24 hours.", icon: "📦" },
      { title: "Master Barista Tasting", desc: "Detailed tasting notes, cupping scores, and brewing recipes.", icon: "☕" },
    ],
  },
  {
    id: "agency",
    name: "Vanguard Studio",
    category: "Design Agency",
    icon: "✨",
    prompt: "Award-winning creative design studio portfolio specializing in 3D WebGL, branding, and luxury digital products.",
    themeColor: "text-violet-400 border-violet-500/40 bg-violet-500/10",
    accentBg: "from-violet-500/20 via-violet-500/5 to-transparent",
    navTitle: "Vanguard Studio",
    heroBadge: "Awwwards Site of the Day Winner",
    headline: "We design brands that dominate digital culture.",
    subheadline: "High-impact brand identities, immersive 3D interactive web experiences, and bespoke motion design systems.",
    ctaText: "View Case Studies",
    features: [
      { title: "Brand Identity", desc: "Complete visual identities, bespoke typography, and design guidelines.", icon: "🎨" },
      { title: "Interactive 3D Web", desc: "Three.js and WebGL experiences that captivate modern audiences.", icon: "💎" },
      { title: "Design Systems", desc: "Scalable Figma component libraries built for hyper-growth teams.", icon: "📐" },
    ],
  },
];

export function AiGeneratorDemoSection() {
  const [activePreset, setActivePreset] = useState<PresetSite>(presets[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [activeDevice, setActiveDevice] = useState<"desktop" | "mobile">("desktop");

  const handleSelectPreset = (preset: PresetSite) => {
    if (preset.id === activePreset.id || isGenerating) return;
    setIsGenerating(true);
    setGenerationStep(1);

    // Simulate fast AI generation steps
    setTimeout(() => setGenerationStep(2), 350);
    setTimeout(() => {
      setActivePreset(preset);
      setGenerationStep(3);
    }, 750);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStep(0);
    }, 1000);
  };

  return (
    <Section id="ai-generator-demo" className="relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-500/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <Badge variant="primary" dot className="mb-3">
            Live AI Preview Engine
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            See the <span className="gradient-text">AI Website Builder</span> in Action
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-2xl mx-auto leading-relaxed">
            Click any prompt preset below to watch our Claude-powered engine assemble structure, design tokens, copy, and React components in real time.
          </p>
        </div>
      </FadeInSection>

      {/* Interactive Preset Chips */}
      <FadeInSection delay={0.1}>
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-8">
          {presets.map((p) => {
            const isActive = p.id === activePreset.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p)}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-surface-2 border-primary-500 shadow-[0_0_20px_rgba(20,184,160,0.25)] text-foreground scale-[1.02]"
                    : "bg-surface/70 border-border/80 text-muted-fg hover:text-foreground hover:bg-surface hover:border-border"
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border/60 text-muted-fg hidden xs:inline">
                  {p.category}
                </span>
              </button>
            );
          })}
        </div>
      </FadeInSection>

      {/* Active Prompt Preview Bar */}
      <FadeInSection delay={0.15}>
        <div className="max-w-4xl mx-auto mb-6 p-3.5 sm:p-4 rounded-2xl bg-surface/90 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-primary-400 font-mono text-xs font-bold px-2 py-1 rounded bg-primary-500/10 border border-primary-500/20 flex-shrink-0">
              PROMPT:
            </span>
            <p className="text-xs sm:text-sm text-foreground/90 truncate font-mono">
              &quot;{activePreset.prompt}&quot;
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            {/* Device Switcher */}
            <div className="flex items-center bg-surface-2 border border-border rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveDevice("desktop")}
                className={`px-2 py-1 rounded ${
                  activeDevice === "desktop" ? "bg-surface text-foreground font-semibold" : "text-muted-fg"
                }`}
                aria-label="Desktop Preview"
              >
                🖥️ Desktop
              </button>
              <button
                type="button"
                onClick={() => setActiveDevice("mobile")}
                className={`px-2 py-1 rounded ${
                  activeDevice === "mobile" ? "bg-surface text-foreground font-semibold" : "text-muted-fg"
                }`}
                aria-label="Mobile Preview"
              >
                📱 Mobile
              </button>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Live Interactive Browser Preview Mockup */}
      <FadeInSection delay={0.2}>
        <div
          className={`mx-auto rounded-3xl border border-neutral-800 bg-neutral-950 shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-300 ${
            activeDevice === "mobile" ? "max-w-sm" : "max-w-4xl"
          }`}
        >
          {/* Window Chrome Header */}
          <div className="px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>

            <div className="flex-1 max-w-xs mx-auto py-1 px-3 rounded-md bg-neutral-950/80 border border-neutral-800 text-[11px] font-mono text-neutral-400 text-center truncate">
              🔒 https://preview.nexora.ai/generated/{activePreset.id}
            </div>

            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </div>
          </div>

          {/* Canvas Body */}
          <div className="relative min-h-[460px] p-6 sm:p-8 bg-neutral-950 flex flex-col justify-between overflow-hidden">
            {/* Ambient inner glow based on theme */}
            <div
              className={`absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br ${activePreset.accentBg} blur-[90px] pointer-events-none transition-all duration-500`}
            />

            {/* Simulated AI Loading Overlay */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  key="generating-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 backdrop-blur-md bg-neutral-950/85 flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="h-12 w-12 rounded-2xl bg-primary-500/20 border border-primary-500 flex items-center justify-center animate-spin text-xl mb-4">
                    ⚡
                  </div>
                  <p className="font-heading font-bold text-base text-foreground">
                    {generationStep === 1 && "Synthesizing layout structure with Claude Sonnet 4.6..."}
                    {generationStep === 2 && "Writing SEO copy & generating React UI components..."}
                    {generationStep === 3 && "Assembling theme tokens & rendering site!"}
                  </p>
                  <p className="text-xs text-muted-fg mt-1">Generating full-stack page in milliseconds...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generated Page Content */}
            <div className="relative z-10">
              {/* Generated Mini Navbar */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-xs">
                    {activePreset.icon}
                  </div>
                  <span className="font-heading font-bold text-sm text-foreground">
                    {activePreset.navTitle}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-neutral-400 font-medium">
                  <span>Features</span>
                  <span>Pricing</span>
                  <span>About</span>
                </div>
                <button
                  type="button"
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary-500 text-white font-medium shadow-sm hover:bg-primary-600 transition-colors"
                >
                  Get Started
                </button>
              </div>

              {/* Generated Mini Hero */}
              <div className="max-w-xl">
                <span
                  className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full border mb-3 ${activePreset.themeColor}`}
                >
                  {activePreset.heroBadge}
                </span>

                <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-[1.15] tracking-tight">
                  {activePreset.headline}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg">
                  {activePreset.subheadline}
                </p>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-white text-neutral-950 text-xs sm:text-sm font-semibold hover:bg-neutral-200 transition-colors shadow-md"
                  >
                    {activePreset.ctaText} →
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs sm:text-sm font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Documentation
                  </button>
                </div>
              </div>

              {/* Generated 3 Features */}
              <div className="mt-8 pt-6 border-t border-neutral-800/80 grid sm:grid-cols-3 gap-3">
                {activePreset.features.map((feat) => (
                  <div
                    key={feat.title}
                    className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors"
                  >
                    <span className="text-lg">{feat.icon}</span>
                    <h4 className="font-heading font-semibold text-xs text-foreground mt-1.5">
                      {feat.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Builder Action Bar */}
            <div className="mt-8 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
              <p className="text-xs text-neutral-400 text-center sm:text-left">
                Want to generate a custom website for your business with full code export?
              </p>
              <Button size="sm" variant="primary" asChild className="whitespace-nowrap">
                <Link href="/contact">Build With Nexora AI →</Link>
              </Button>
            </div>
          </div>
        </div>
      </FadeInSection>
    </Section>
  );
}
