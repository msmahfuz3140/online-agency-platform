"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface AiGeneratorLauncherProps {
  creditsRemaining: number;
}

const PRESET_IDEAS = [
  {
    category: "SaaS Platform",
    prompt: "Modern dark-mode SaaS landing page for an AI agent analytics tool with tier pricing and live charts.",
  },
  {
    category: "E-Commerce",
    prompt: "Minimalist Scandinavian furniture store with responsive product catalog, cart drawer, and currency switcher.",
  },
  {
    category: "FinTech",
    prompt: "High-yield wealth management dashboard with real-time portfolio metrics, security audit badges, and KYC onboarding.",
  },
  {
    category: "Agency Flagship",
    prompt: "Elite boutique branding agency website with bold kinetic typography, case study grids, and client review carousel.",
  },
];

export function AiGeneratorLauncher({ creditsRemaining }: AiGeneratorLauncherProps) {
  const [prompt, setPrompt] = useState("");
  const [activeCategory, setActiveCategory] = useState("SaaS Platform");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [previewResult, setPreviewResult] = useState<string | null>(null);

  const handleSelectPreset = (p: { category: string; prompt: string }) => {
    setActiveCategory(p.category);
    setPrompt(p.prompt);
  };

  const handleSimulateGeneration = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationStep(1);
    setPreviewResult(null);

    setTimeout(() => setGenerationStep(2), 800);
    setTimeout(() => setGenerationStep(3), 1600);
    setTimeout(() => {
      setIsGenerating(false);
      setPreviewResult(`Synthesized Next.js 16 JSON Schema for: "${prompt.slice(0, 48)}…"`);
    }, 2400);
  };

  return (
    <div className="relative rounded-3xl border border-primary-500/30 bg-surface-1 dark:bg-gradient-to-br dark:from-[#0c1322] dark:via-[#09111e] dark:to-[#070d18] p-4 sm:p-7 shadow-xl overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-500/8 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-border dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-500 dark:text-amber-300 font-mono font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <span>⏳</span> Coming Soon • In Active Development
            </span>
            <span className="text-xs text-muted-fg font-mono">• Instant Web Blueprint</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            AI Website Generator Engine
          </h2>
          <p className="text-xs text-muted-fg mt-1 max-w-xl leading-relaxed">
            Type your business vision in plain English. The Claude engine outputs complete Next.js component blueprints in under 10 seconds. (Coming soon for automated generation).
          </p>
        </div>

        {/* Credit Token Counter */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface-2 border border-border shadow-inner shrink-0">
          <div className="h-9 w-9 rounded-xl bg-primary-500/20 border border-primary-500/40 flex items-center justify-center font-bold text-sm text-primary-400">
            ⚡
          </div>
          <div>
            <div className="text-xs font-bold text-foreground font-mono">
              {creditsRemaining} / 5 Credits
            </div>
            <span className="text-[10px] text-emerald-500 font-medium">
              Free Daily Allocation Active
            </span>
          </div>
        </div>
      </div>

      {/* Preset Category Pills */}
      <div className="relative z-10 mt-5">
        <span className="text-[11px] font-semibold text-muted-fg uppercase tracking-wider block mb-2 font-mono">
          Suggested Archetypes:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_IDEAS.map((preset) => (
            <button
              key={preset.category}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === preset.category
                  ? "bg-primary-500/25 border border-primary-500/50 text-foreground font-semibold shadow-[0_0_14px_rgba(20,184,160,0.2)]"
                  : "bg-surface-2 border border-border text-muted-fg hover:text-foreground hover:bg-surface-3"
              }`}
            >
              <span>{preset.category === "SaaS Platform" ? "🚀" : preset.category === "E-Commerce" ? "🛍️" : preset.category === "FinTech" ? "💳" : "🎨"}</span>
              <span>{preset.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Prompt Box */}
      <div className="relative z-10 mt-4 space-y-3">
        <div className="relative rounded-2xl border border-border bg-surface-2/70 p-3 sm:p-4 focus-within:border-primary-500/70 focus-within:shadow-[0_0_24px_rgba(20,184,160,0.25)] transition-all">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your website concept (e.g. Modern SaaS landing page with pricing tables, testimonials, and contact form)..."
            rows={3}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-fg resize-none outline-none leading-relaxed"
          />

          <div className="mt-2 pt-2 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
              <span>Next.js 16</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>WCAG 2.1 Compliant</span>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={isGenerating || !prompt.trim()}
              onClick={handleSimulateGeneration}
              className="rounded-xl px-5 text-xs font-semibold shadow-[0_0_20px_rgba(20,184,160,0.3)] disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-black animate-ping" />
                  <span>Synthesizing Schema…</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>Generate Blueprint</span>
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Live Generation Progress Terminal */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3.5 rounded-xl bg-black/60 border border-primary-500/30 text-xs font-mono space-y-1.5"
            >
              <div className="flex items-center justify-between text-primary-300">
                <span>[CLAUDE_SONNET_STREAM] Parsing prompt semantics…</span>
                <span className="animate-pulse">● PROCESSING</span>
              </div>
              {generationStep >= 1 && (
                <p className="text-neutral-400 text-[11px]">
                  &gt; Resolving layout hierarchy: Hero Section, Feature Grid, Tier Matrices.
                </p>
              )}
              {generationStep >= 2 && (
                <p className="text-neutral-400 text-[11px]">
                  &gt; Synthesizing HSL color tokens (Electric Teal #14b8a0, Warm Amber #f59e0b).
                </p>
              )}
              {generationStep >= 3 && (
                <p className="text-emerald-400 text-[11px]">
                  &gt; JSON Component AST Generated successfully. Compiling preview…
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Output */}
        {previewResult && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🎉</span>
              <div>
                <span className="font-semibold text-emerald-300 block">
                  AI Architecture Blueprint Ready!
                </span>
                <span className="text-neutral-400 text-[11px]">{previewResult}</span>
              </div>
            </div>
            <Link href="/request-project">
              <Button size="sm" variant="secondary" className="text-[11px] rounded-lg">
                Convert to Production Build →
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
