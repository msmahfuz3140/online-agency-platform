"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";

const metrics = [
  {
    title: "Google Lighthouse",
    before: "31 / 100",
    after: "99 / 100",
    delta: "+219% Boost",
    positive: true,
    desc: "From critical red to perfect green performance score",
  },
  {
    title: "Largest Contentful Paint (LCP)",
    before: "6.8s",
    after: "0.6s",
    delta: "11.3x Faster",
    positive: true,
    desc: "First key visual element renders in under 600ms on mobile",
  },
  {
    title: "Trial Signup Conversion",
    before: "1.2%",
    after: "8.7%",
    delta: "+7.25x Increase",
    positive: true,
    desc: "Optimized value hooks & zero-latency edge delivery",
  },
  {
    title: "JavaScript Payload",
    before: "3.8 MB",
    after: "142 KB",
    delta: "-96% Lighter",
    positive: true,
    desc: "React Server Components ship zero runtime JS for static sections",
  },
];

export function PerformanceComparisonSliderSection() {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <Section id="performance-benchmark" className="py-20 sm:py-28 relative overflow-hidden border-t border-border/40">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-red-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[350px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <FadeInSection>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-4">
            <Badge variant="primary" size="md">
              Measurable Speed & Conversion Proof
            </Badge>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Drag to Reveal the <span className="gradient-text">Performance Transformation</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-muted-fg leading-relaxed max-w-2xl mx-auto">
            See the stark contrast between a bloated legacy WordPress site and our rebuilt Next.js 15 App Router architecture with global edge caching.
          </p>

          {/* Quick preset selector buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSliderPos(15)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                sliderPos < 30
                  ? "bg-red-500/20 border-red-500/40 text-red-300"
                  : "bg-surface-2 border-border text-muted-fg hover:text-foreground"
              }`}
            >
              Inspect Legacy Site (Before)
            </button>
            <button
              type="button"
              onClick={() => setSliderPos(50)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                sliderPos >= 40 && sliderPos <= 60
                  ? "bg-primary-500/20 border-primary-500/40 text-primary-300"
                  : "bg-surface-2 border-border text-muted-fg hover:text-foreground"
              }`}
            >
              50 / 50 Split View
            </button>
            <button
              type="button"
              onClick={() => setSliderPos(85)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                sliderPos > 70
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-surface-2 border-border text-muted-fg hover:text-foreground"
              }`}
            >
              Nexora Edge Rebuild (After)
            </button>
          </div>
        </div>
      </FadeInSection>

      {/* The Interactive Before/After Comparison Container */}
      <FadeInSection delay={0.1}>
        <div className="max-w-5xl mx-auto px-4">
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
            className="relative h-[360px] sm:h-[420px] rounded-2xl border border-border/80 overflow-hidden select-none cursor-ew-resize shadow-2xl bg-neutral-950"
          >
            {/* RIGHT SIDE: NEXORA AFTER (Underneath base) */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-[#031d17] p-6 sm:p-8 flex flex-col justify-between">
              {/* Header Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    AFTER: Nexora Next.js 15 + Edge Engine
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                  <span>Score: 99/100</span>
                  <span>⚡</span>
                </div>
              </div>

              {/* Mock UI Showcase */}
              <div className="my-auto space-y-4 max-w-lg ml-auto text-right">
                <div className="inline-block text-left p-4 rounded-xl border border-primary-500/30 bg-surface-1/90 backdrop-blur-md shadow-[0_0_30px_rgba(20,184,160,0.15)]">
                  <div className="flex items-center gap-2 text-xs font-mono text-primary-300 mb-2">
                    <span>✓ React Server Components</span>
                    <span>•</span>
                    <span>0ms Hydration Lag</span>
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                    Next-Gen Scalable Architecture
                  </h3>
                  <p className="text-xs text-muted-fg mt-1 leading-relaxed">
                    Zero layout shift, AVIF responsive image assets, and instant Edge SSR globally distributed via 300+ PoPs.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      TTFB: 42ms
                    </span>
                    <span className="px-2 py-0.5 rounded bg-primary-500/20 text-primary-300 font-bold">
                      LCP: 0.6s
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-2 text-muted-fg">
                      Clean Next.js 15
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom status badge */}
              <div className="flex items-center justify-end text-xs font-mono text-emerald-400">
                <span>● 100% Core Web Vitals Passed</span>
              </div>
            </div>

            {/* LEFT SIDE: LEGACY BEFORE (Clipped dynamically by sliderPos) */}
            <div
              style={{ width: `${sliderPos}%` }}
              className="absolute inset-y-0 left-0 border-r-2 border-primary-400 overflow-hidden bg-gradient-to-br from-[#1a0f0f] via-neutral-900 to-[#120a0a] p-6 sm:p-8 flex flex-col justify-between"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between min-w-[320px] sm:min-w-[440px]">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                    BEFORE: Slow Legacy CMS / Monolith
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
                  <span>Score: 31/100</span>
                  <span>⚠️</span>
                </div>
              </div>

              {/* Sluggish Legacy Visual */}
              <div className="my-auto space-y-4 max-w-sm min-w-[280px]">
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/30 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-xs font-mono text-red-400 mb-2">
                    <span>⚠️ 42 Unused Plugins</span>
                    <span>•</span>
                    <span>Render Blocking</span>
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-neutral-300">
                    Sluggish User Experience
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    9.4s Time to Interactive on 4G mobile, massive JavaScript bundles, unoptimized JPEGs causing high bounce rates.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                      TTFB: 2,840ms
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                      LCP: 6.8s
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-2 text-neutral-500 line-through">
                      WordPress bloat
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom status badge */}
              <div className="flex items-center text-xs font-mono text-red-400 min-w-[250px]">
                <span>⨯ 3 Failed Core Web Vitals</span>
              </div>
            </div>

            {/* DRAGGABLE SLIDER DIVIDER HANDLE */}
            <div
              style={{ left: `${sliderPos}%` }}
              className="absolute inset-y-0 -translate-x-1/2 pointer-events-none flex flex-col items-center justify-center z-30"
            >
              <div className="w-1 h-full bg-primary-400 shadow-[0_0_16px_rgba(20,184,160,0.8)]" />
              <div className="absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-neutral-900 border-2 border-primary-400 flex items-center justify-center shadow-[0_0_24px_rgba(20,184,160,0.6)] text-xs font-bold text-primary-300 pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
                ⇄
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-fg mt-3">
            💡 <em>Click or drag the slider handle horizontally to compare before and after architecture.</em>
          </p>
        </div>
      </FadeInSection>

      {/* 4 Quantitative Metrics Comparison Cards */}
      <div className="max-w-5xl mx-auto px-4 mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <FadeInSection key={m.title} delay={i * 0.08}>
            <Card padding="md" className="border-border/80 bg-surface-1/70 backdrop-blur-md h-full flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-fg uppercase tracking-wider mb-2">
                  {m.title}
                </p>
                <div className="flex items-baseline gap-3 my-2">
                  <span className="text-xs font-mono line-through text-red-400/80">{m.before}</span>
                  <span className="text-xs text-muted-fg">→</span>
                  <span className="font-heading text-2xl font-extrabold text-foreground">{m.after}</span>
                </div>
                <div className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-300 mb-3">
                  {m.delta}
                </div>
              </div>
              <p className="text-xs text-muted-fg leading-relaxed pt-2 border-t border-border/40">
                {m.desc}
              </p>
            </Card>
          </FadeInSection>
        ))}
      </div>

      {/* Free Speed Audit Callout Banner */}
      <FadeInSection delay={0.3}>
        <div className="max-w-5xl mx-auto px-4 mt-10">
          <div className="p-6 rounded-2xl border border-primary-500/30 bg-gradient-to-r from-primary-500/10 via-surface-2 to-surface-1 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-foreground">
                Want to know your website's exact bottlenecks?
              </h4>
              <p className="text-xs sm:text-sm text-muted-fg mt-0.5">
                Our engineers will run a full PageSpeed, TTFB & conversion audit on your current site — 100% free.
              </p>
            </div>
            <Button size="md" variant="primary" className="flex-shrink-0" asChild>
              <Link href="/contact">Request Free Speed Audit →</Link>
            </Button>
          </div>
        </div>
      </FadeInSection>
    </Section>
  );
}
