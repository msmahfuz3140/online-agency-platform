"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";

type PlaygroundTab = "saas-metrics" | "dynamic-island" | "ai-streamer" | "ab-testing";
type Timeframe = "7D" | "30D" | "Q3" | "1Y";
type IslandState = "idle" | "ai-voice" | "deployment" | "checkout" | "security";
type AiPreset = "fintech-card" | "server-cluster" | "pricing-tier";
type AbVariant = "v1-legacy" | "v2-nexora";

// Sample dataset for SaaS Metrics Widget
const timeframeData: Record<
  Timeframe,
  {
    revenue: number[];
    labels: string[];
    mrr: string;
    growth: string;
    activeUsers: string;
    retention: string;
  }
> = {
  "7D": {
    revenue: [14.2, 16.5, 15.1, 18.4, 19.8, 17.9, 22.4],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    mrr: "$22,400",
    growth: "+18.2%",
    activeUsers: "3,420",
    retention: "98.4%",
  },
  "30D": {
    revenue: [42, 48, 55, 61, 68, 74, 82, 89, 94.8],
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9"],
    mrr: "$94,820",
    growth: "+26.4%",
    activeUsers: "12,850",
    retention: "97.8%",
  },
  Q3: {
    revenue: [182, 198, 215, 238, 259, 274.5],
    labels: ["Jul 1", "Jul 15", "Aug 1", "Aug 15", "Sep 1", "Sep 15"],
    mrr: "$274,500",
    growth: "+38.1%",
    activeUsers: "28,400",
    retention: "96.9%",
  },
  "1Y": {
    revenue: [410, 520, 640, 780, 930, 1140],
    labels: ["Q1 '25", "Q2 '25", "Q3 '25", "Q4 '25", "Q1 '26", "Q2 '26"],
    mrr: "$1,140,000",
    growth: "+64.5%",
    activeUsers: "84,600",
    retention: "98.1%",
  },
};

export function InteractiveComponentPlaygroundSection() {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>("saas-metrics");
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [copiedCode, setCopiedCode] = useState(false);

  // --- Sub-State: Module 1 (SaaS Metrics) ---
  const [timeframe, setTimeframe] = useState<Timeframe>("30D");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const activeMetrics = timeframeData[timeframe];

  // --- Sub-State: Module 2 (Dynamic Island) ---
  const [islandState, setIslandState] = useState<IslandState>("idle");

  // --- Sub-State: Module 3 (AI Streamer) ---
  const [aiPreset, setAiPreset] = useState<AiPreset>("fintech-card");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamProgress, setStreamProgress] = useState(100);

  // --- Sub-State: Module 4 (A/B Testing) ---
  const [abVariant, setAbVariant] = useState<AbVariant>("v2-nexora");
  const [simulatedTraffic, setSimulatedTraffic] = useState(25000);

  // Trigger simulated AI generation
  const handleGeneratePreset = (preset: AiPreset) => {
    setAiPreset(preset);
    setIsGenerating(true);
    setStreamProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setStreamProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 120);
  };

  // SVG Chart path calculation for Module 1
  const chartPoints = useMemo(() => {
    const data = activeMetrics.revenue;
    const minVal = Math.min(...data) * 0.85;
    const maxVal = Math.max(...data) * 1.1;
    const width = 460;
    const height = 150;
    const padding = 20;

    const points = data.map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
      return { x, y, val, label: activeMetrics.labels[idx] };
    });

    const pathString = points.reduce((acc, pt, idx) => {
      if (idx === 0) return `M ${pt.x},${pt.y}`;
      const prev = points[idx - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`;
    }, "");

    const areaString = `${pathString} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

    return { points, pathString, areaString, width, height };
  }, [activeMetrics]);

  // Code snippets for each module
  const codeSnippets: Record<PlaygroundTab, string> = {
    "saas-metrics": `// Nexora SaaS Financial Telemetry Component (Next.js 15 + Tailwind CSS)
import { useState } from "react";
import { motion } from "framer-motion";

export function FinancialTelemetryWidget({ timeframe = "30D" }) {
  const [activeRange, setActiveRange] = useState(timeframe);

  return (
    <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400">● Live MRR Velocity</span>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">$94,820.00</h3>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-black/50 rounded-xl border border-neutral-800">
          {["7D", "30D", "Q3", "1Y"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveRange(t)}
              className={\`px-3 py-1 text-xs rounded-lg font-mono transition-colors \${
                activeRange === t ? "bg-primary-500 text-white font-bold" : "text-neutral-400 hover:text-white"
              }\`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      {/* Dynamic Hardware-Accelerated SVG Curve */}
      <svg className="w-full h-36 overflow-visible" viewBox="0 0 460 150">
        <defs>
          <linearGradient id="curveGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#14b8a0" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <motion.path
          d="..."
          fill="url(#curveGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </svg>
    </div>
  );
}`,
    "dynamic-island": `// Nexora Tactile Dynamic Island Action Dock (React 19 + Framer Motion Springs)
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DynamicActionIsland() {
  const [state, setState] = useState<"idle" | "voice" | "deploy" | "checkout">("idle");

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="mx-auto rounded-full bg-black/90 border border-neutral-800 text-white shadow-2xl p-2.5 flex items-center justify-between"
    >
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-medium">Nexora Engine Ready</span>
          </motion.div>
        )}
        {state === "deploy" && (
          <motion.div key="deploy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 px-4">
            <span className="text-xs font-mono text-primary-400">Edge Build: 94%</span>
            <div className="w-24 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div className="w-[94%] h-full bg-primary-400 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}`,
    "ai-streamer": `// Nexora Streaming AI Component Synthesis Hook (Server-Driven UI)
import { useState } from "react";

export function useComponentStream() {
  const [tokens, setTokens] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const streamComponent = async (prompt: string) => {
    setIsStreaming(true);
    // Connects to Next.js 15 Route Handler via Server-Sent Events (SSE)
    const res = await fetch("/api/ai/synthesize-ui", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
    // Renders parsed component AST on the fly with Zero Hydration mismatch
  };

  return { streamComponent, isStreaming, tokens };
}`,
    "ab-testing": `// Nexora Conversion Optimization Engine (Edge A/B Routing)
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Edge-computed zero-latency A/B cookie assignment
  const cookie = req.cookies.get("nexora-exp-variant");
  const variant = cookie?.value || (Math.random() < 0.5 ? "v1-legacy" : "v2-nexora");

  const res = NextResponse.next();
  if (!cookie) {
    res.cookies.set("nexora-exp-variant", variant, { maxAge: 60 * 60 * 24 * 30 });
  }
  return res;
}`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // CRO metric calculations for Module 4
  const v1Conversions = Math.round(simulatedTraffic * 0.014);
  const v2Conversions = Math.round(simulatedTraffic * 0.089);
  const extraConversions = v2Conversions - v1Conversions;
  const extraRevenue = (extraConversions * 49).toLocaleString();

  return (
    <Section id="component-playground" className="py-20 sm:py-28 relative overflow-hidden border-t border-border/40">
      {/* Background Cybernetic Aura */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[300px] bg-amber-500/8 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Section Header */}
      <FadeInSection>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-4">
            <Badge variant="primary" size="md">
              🔬 Interactive UI/UX Sandbox • 60 FPS
            </Badge>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            The Nexora Live <span className="gradient-text">Component Playground</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-muted-fg leading-relaxed max-w-2xl mx-auto">
            Touch, test, and stress-test production-ready Nexora engineering modules live in your browser. Seamlessly inspect raw Next.js 15 TypeScript code powering each interaction.
          </p>

          {/* Quick Technical Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-lg border border-border/80 bg-surface-1 text-[11px] font-mono text-muted-fg">
              ⚡ Next.js 15 App Router
            </span>
            <span className="px-3 py-1 rounded-lg border border-border/80 bg-surface-1 text-[11px] font-mono text-muted-fg">
              💎 React 19 Client Hydrated
            </span>
            <span className="px-3 py-1 rounded-lg border border-border/80 bg-surface-1 text-[11px] font-mono text-muted-fg">
              🎯 60 FPS Spring Physics
            </span>
            <span className="px-3 py-1 rounded-lg border border-border/80 bg-surface-1 text-[11px] font-mono text-primary-400 font-bold">
              📱 100% Mobile Touch Ready
            </span>
          </div>
        </div>
      </FadeInSection>

      {/* Main Sandbox Container */}
      <div className="max-w-5xl mx-auto px-4">
        {/* Navigation Bar & Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 p-2 rounded-2xl bg-surface-1/80 border border-border/80 backdrop-blur-xl">
          {/* Module Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "saas-metrics", icon: "📊", label: "SaaS Telemetry" },
              { id: "dynamic-island", icon: "🏝️", label: "Dynamic Island" },
              { id: "ai-streamer", icon: "⚡", label: "AI Streamer" },
              { id: "ab-testing", icon: "🧪", label: "A/B CRO Delta" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as PlaygroundTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary-500 text-white shadow-[0_0_16px_rgba(20,184,160,0.35)]"
                      : "text-muted-fg hover:text-foreground hover:bg-surface-2"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mode Switcher: Live Preview vs Source Code */}
          <div className="flex items-center self-end sm:self-auto gap-1 p-1 rounded-xl bg-surface-2 border border-border">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "preview"
                  ? "bg-surface-3 text-foreground shadow-sm"
                  : "text-muted-fg hover:text-foreground"
              }`}
            >
              👁️ Interactive Preview
            </button>
            <button
              type="button"
              onClick={() => setViewMode("code")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "code"
                  ? "bg-primary-500/20 text-primary-300 border border-primary-500/40 shadow-sm"
                  : "text-muted-fg hover:text-foreground"
              }`}
            >
              {"< />"} Next.js 15 Code
            </button>
          </div>
        </div>

        {/* Dynamic Sandbox Display Body */}
        <Card
          padding="none"
          className="border border-border/80 bg-surface-1/90 backdrop-blur-xl shadow-2xl overflow-hidden relative min-h-[460px] flex flex-col justify-between"
        >
          {/* Top Control Bar inside Card */}
          <div className="px-5 py-3.5 border-b border-border/70 bg-surface-2/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-muted-fg hidden sm:inline">
                sandbox://nexora.agency/v2/{activeTab}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-fg">
              {viewMode === "preview" ? (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Reactive Runtime
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-3 hover:bg-neutral-700 text-foreground border border-border transition-colors cursor-pointer"
                >
                  {copiedCode ? "✓ Copied TypeScript" : "📋 Copy Source"}
                </button>
              )}
            </div>
          </div>

          {/* Card Body: Switches between Preview and Code */}
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
            {viewMode === "code" ? (
              /* --- Code View Drawer --- */
              <div className="relative font-mono text-xs text-neutral-300 overflow-x-auto max-h-[420px] p-4 rounded-xl bg-black/60 border border-neutral-800 leading-relaxed">
                <pre>
                  <code>{codeSnippets[activeTab]}</code>
                </pre>
              </div>
            ) : (
              /* --- Interactive Preview View --- */
              <AnimatePresence mode="wait">
                {/* 1. SaaS Financial Telemetry Module */}
                {activeTab === "saas-metrics" && (
                  <motion.div
                    key="saas-metrics"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Header & Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary-400 uppercase tracking-wider">
                            ● ARR Velocity Telemetry
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {activeMetrics.growth}
                          </span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-1">
                          {activeMetrics.mrr}
                        </h3>
                      </div>

                      {/* Timeframe selector pills */}
                      <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-2 border border-border">
                        {(["7D", "30D", "Q3", "1Y"] as Timeframe[]).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTimeframe(t)}
                            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                              timeframe === t
                                ? "bg-primary-500 text-white shadow-[0_0_12px_rgba(20,184,160,0.4)]"
                                : "text-muted-fg hover:text-foreground"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl bg-surface-2/80 border border-border/80">
                        <span className="text-[11px] text-muted-fg block">Active Workspaces</span>
                        <span className="text-base sm:text-lg font-bold text-foreground font-mono">
                          {activeMetrics.activeUsers}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-surface-2/80 border border-border/80">
                        <span className="text-[11px] text-muted-fg block">Net Retention</span>
                        <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
                          {activeMetrics.retention}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-surface-2/80 border border-border/80">
                        <span className="text-[11px] text-muted-fg block">LTV / CAC Ratio</span>
                        <span className="text-base sm:text-lg font-bold text-primary-300 font-mono">
                          4.8x
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-surface-2/80 border border-border/80">
                        <span className="text-[11px] text-muted-fg block">Cloud SLA Uptime</span>
                        <span className="text-base sm:text-lg font-bold text-foreground font-mono">
                          99.99%
                        </span>
                      </div>
                    </div>

                    {/* Interactive Animated SVG Chart */}
                    <div className="p-4 sm:p-6 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 relative">
                      <div className="flex items-center justify-between text-[11px] font-mono text-muted-fg mb-2">
                        <span>Revenue Curve ({timeframe})</span>
                        <span>Touch or hover data points</span>
                      </div>

                      <div className="relative w-full h-44 overflow-hidden">
                        <svg
                          viewBox={`0 0 ${chartPoints.width} ${chartPoints.height}`}
                          className="w-full h-full overflow-visible"
                        >
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#14b8a0" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#14b8a0" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Area Fill */}
                          <motion.path
                            d={chartPoints.areaString}
                            fill="url(#chartGradient)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                          />

                          {/* Line Stroke */}
                          <motion.path
                            d={chartPoints.pathString}
                            fill="none"
                            stroke="#14b8a0"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />

                          {/* Interactive Points */}
                          {chartPoints.points.map((pt, idx) => {
                            const isHovered = hoveredPoint === idx;
                            return (
                              <g
                                key={idx}
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredPoint(idx)}
                                onMouseLeave={() => setHoveredPoint(null)}
                                onClick={() => setHoveredPoint(idx)}
                              >
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r={isHovered ? 6 : 4}
                                  className={`transition-all duration-150 ${
                                    isHovered
                                      ? "fill-white stroke-primary-400 stroke-[3]"
                                      : "fill-primary-500 stroke-surface-1 stroke-2"
                                  }`}
                                />
                              </g>
                            );
                          })}
                        </svg>

                        {/* Interactive Tooltip Card */}
                        {hoveredPoint !== null && (
                          <div
                            className="absolute top-2 left-1/2 -translate-x-1/2 sm:translate-x-0 px-3 py-2 rounded-xl bg-surface-3/95 border border-primary-500/40 text-xs font-mono shadow-2xl backdrop-blur-md pointer-events-none"
                            style={{
                              left: `${(chartPoints.points[hoveredPoint].x / chartPoints.width) * 100}%`,
                              top: `${Math.max(10, (chartPoints.points[hoveredPoint].y / chartPoints.height) * 100 - 30)}%`,
                            }}
                          >
                            <div className="text-primary-300 font-bold">
                              {chartPoints.points[hoveredPoint].label}: ${chartPoints.points[hoveredPoint].val}K
                            </div>
                            <div className="text-[10px] text-muted-fg">Verified Stripe settlement</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Tactile Dynamic Island Action Dock Module */}
                {activeTab === "dynamic-island" && (
                  <motion.div
                    key="dynamic-island"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8 text-center"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-primary-400 uppercase tracking-wider">
                        ● Fluid Spring Physics Action Dock
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                        Apple-Grade Morphing Dynamic Island
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-fg mt-2 max-w-lg mx-auto">
                        Click any system trigger below to experience zero-lag layout morphing powered by Framer Motion springs.
                      </p>
                    </div>

                    {/* Central Morphing Dynamic Island */}
                    <div className="min-h-[110px] flex items-center justify-center px-2">
                      <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 340, damping: 28 }}
                        className="rounded-full bg-black/90 border border-neutral-700/80 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl px-5 py-3 text-white overflow-hidden max-w-full"
                      >
                        <AnimatePresence mode="wait">
                          {islandState === "idle" && (
                            <motion.div
                              key="idle"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="flex items-center gap-3"
                            >
                              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-xs font-mono font-semibold tracking-wide">
                                Nexora Core • Standby
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                                60 FPS
                              </span>
                            </motion.div>
                          )}

                          {islandState === "ai-voice" && (
                            <motion.div
                              key="ai-voice"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="flex items-center gap-4"
                            >
                              <div className="flex items-center gap-1">
                                <span className="h-4 w-1 bg-primary-400 rounded-full animate-[bounce_1s_infinite_100ms]" />
                                <span className="h-6 w-1 bg-primary-300 rounded-full animate-[bounce_1s_infinite_200ms]" />
                                <span className="h-3 w-1 bg-primary-500 rounded-full animate-[bounce_1s_infinite_300ms]" />
                                <span className="h-5 w-1 bg-primary-400 rounded-full animate-[bounce_1s_infinite_400ms]" />
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-bold text-white leading-none">AI Agent Transcribing</p>
                                <p className="text-[10px] font-mono text-primary-300 mt-1">
                                  "Build interactive SaaS pricing matrix"
                                </p>
                              </div>
                              <span className="text-xs">🎙️</span>
                            </motion.div>
                          )}

                          {islandState === "deployment" && (
                            <motion.div
                              key="deployment"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="flex items-center gap-4"
                            >
                              <span className="text-xs font-mono text-cyan-400 font-bold">🚀 Deploying</span>
                              <div className="w-28 sm:w-36 h-2 bg-neutral-800 rounded-full overflow-hidden">
                                <div className="w-[94%] h-full bg-gradient-to-r from-cyan-400 to-primary-400 rounded-full animate-pulse" />
                              </div>
                              <span className="text-[10px] font-mono text-neutral-400">94% (42ms)</span>
                            </motion.div>
                          )}

                          {islandState === "checkout" && (
                            <motion.div
                              key="checkout"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="flex items-center gap-3"
                            >
                              <span className="h-5 w-5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xs font-bold">
                                ✓
                              </span>
                              <div className="text-left">
                                <p className="text-xs font-bold text-emerald-400 leading-none">
                                  Stripe Webhook Verified
                                </p>
                                <p className="text-[10px] font-mono text-neutral-300 mt-1">
                                  +$4,800.00 ARR License Activated
                                </p>
                              </div>
                            </motion.div>
                          )}

                          {islandState === "security" && (
                            <motion.div
                              key="security"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="flex items-center gap-3"
                            >
                              <span className="text-base">🛡️</span>
                              <div className="text-left">
                                <p className="text-xs font-bold text-white leading-none">Air-Gap Vault Locked</p>
                                <p className="text-[10px] font-mono text-primary-300 mt-1">
                                  0 CVEs Found • 100% IP Transferred
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    {/* Interactive State Trigger Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {[
                        { state: "idle", label: "🟢 Standby" },
                        { state: "ai-voice", label: "🎙️ Voice AI" },
                        { state: "deployment", label: "🚀 Next.js Deploy" },
                        { state: "checkout", label: "💳 Stripe Settlement" },
                        { state: "security", label: "🛡️ Security Vault" },
                      ].map((item) => (
                        <button
                          key={item.state}
                          type="button"
                          onClick={() => setIslandState(item.state as IslandState)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            islandState === item.state
                              ? "bg-primary-500 text-white border-primary-400 shadow-[0_0_15px_rgba(20,184,160,0.3)]"
                              : "bg-surface-2 border-border text-muted-fg hover:text-foreground hover:bg-surface-3"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 3. AI Prompt-to-UI Component Streamer Module */}
                {activeTab === "ai-streamer" && (
                  <motion.div
                    key="ai-streamer"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-primary-400 uppercase tracking-wider">
                          ● Server-Driven UI Synthesis
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                          Simulated AI UI Streamer
                        </h3>
                      </div>

                      {/* Stream telemetry indicator */}
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-muted-fg">Throughput:</span>
                        <span className="px-2 py-0.5 rounded-md bg-surface-2 text-emerald-400 font-bold border border-border">
                          184 tokens/s
                        </span>
                      </div>
                    </div>

                    {/* Preset Prompt Triggers */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-fg font-medium">Prompt Presets:</span>
                      {[
                        { id: "fintech-card", label: "💳 Cyber Neo-Debit Card" },
                        { id: "server-cluster", label: "🖥️ Cloud Node Cluster" },
                        { id: "pricing-tier", label: "💎 High-Conversion Tier" },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          disabled={isGenerating}
                          onClick={() => handleGeneratePreset(preset.id as AiPreset)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            aiPreset === preset.id
                              ? "bg-primary-500/20 text-primary-300 border-primary-500/40 shadow-sm"
                              : "bg-surface-2 border-border text-muted-fg hover:text-foreground"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Rendered Dynamic Component Preview */}
                    <div className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-center min-h-[220px] relative overflow-hidden">
                      {isGenerating ? (
                        <div className="text-center space-y-3">
                          <div className="w-12 h-12 rounded-full border-2 border-primary-500/20 border-t-primary-500 animate-spin mx-auto" />
                          <p className="text-xs font-mono text-primary-300">
                            Streaming UI AST Tokens... {streamProgress}%
                          </p>
                        </div>
                      ) : (
                        <div className="w-full max-w-md">
                          {/* 3.1: Cyber Neo-Debit Card */}
                          {aiPreset === "fintech-card" && (
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="p-6 rounded-2xl bg-gradient-to-tr from-neutral-900 via-surface-2 to-neutral-900 border border-primary-500/40 shadow-2xl relative overflow-hidden text-white"
                            >
                              <div className="flex justify-between items-center mb-6">
                                <span className="font-heading font-extrabold text-sm tracking-widest text-primary-400">
                                  NEXORA APEX
                                </span>
                                <span className="text-xs font-mono text-emerald-400">● ACTIVE</span>
                              </div>
                              <div className="h-7 w-10 rounded bg-amber-400/80 mb-6 flex items-center justify-center text-[10px] text-black font-bold">
                                CHIP
                              </div>
                              <div className="font-mono text-lg sm:text-xl tracking-widest text-neutral-200 mb-4">
                                4829 •••• •••• 9201
                              </div>
                              <div className="flex justify-between items-end text-xs font-mono text-neutral-400">
                                <div>
                                  <span className="block text-[9px] uppercase">Cardholder</span>
                                  <span className="text-white font-bold">ALEXANDER REED</span>
                                </div>
                                <div>
                                  <span className="block text-[9px] uppercase">Expires</span>
                                  <span className="text-white font-bold">08/29</span>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* 3.2: Cloud Node Cluster */}
                          {aiPreset === "server-cluster" && (
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="p-5 rounded-2xl bg-surface-2 border border-border space-y-4"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground">
                                  Tokyo Edge Cluster (ap-northeast-1)
                                </span>
                                <span className="text-xs font-mono text-emerald-400">14ms Ping</span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-fg font-mono">
                                  <span>CPU Cluster Utilization</span>
                                  <span className="text-foreground font-bold">24.2%</span>
                                </div>
                                <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                                  <div className="w-[24%] h-full bg-primary-500 rounded-full" />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                                <div className="p-2 rounded-lg bg-surface-1 text-center">
                                  <span className="text-muted-fg text-[10px] block">Active Pods</span>
                                  <span className="font-bold text-emerald-400">32 / 32 Healthy</span>
                                </div>
                                <div className="p-2 rounded-lg bg-surface-1 text-center">
                                  <span className="text-muted-fg text-[10px] block">Cold Starts</span>
                                  <span className="font-bold text-primary-300">0.00ms (Edge)</span>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* 3.3: High-Conversion Tier */}
                          {aiPreset === "pricing-tier" && (
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="p-5 rounded-2xl bg-surface-2 border border-primary-500/50 shadow-xl relative"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-foreground text-sm">Enterprise Scale</h4>
                                <Badge variant="primary" size="sm">
                                  Recommended
                                </Badge>
                              </div>
                              <div className="text-2xl font-extrabold text-foreground mb-3 font-mono">
                                $199 <span className="text-xs font-normal text-muted-fg">/month</span>
                              </div>
                              <ul className="space-y-1.5 text-xs text-muted-fg mb-4">
                                <li className="flex items-center gap-1.5">
                                  <span className="text-emerald-400">✓</span> Unlimited High-Velocity Sprints
                                </li>
                                <li className="flex items-center gap-1.5">
                                  <span className="text-emerald-400">✓</span> Dedicated Senior Tech Lead
                                </li>
                              </ul>
                              <Button size="sm" variant="primary" className="w-full">
                                Instant Kickoff →
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 4. A/B Conversion Engine & CRO Delta Module */}
                {activeTab === "ab-testing" && (
                  <motion.div
                    key="ab-testing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-primary-400 uppercase tracking-wider">
                          ● Quantifiable CRO Architecture
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                          A/B Conversion Rate Benchmark
                        </h3>
                      </div>

                      {/* Variant Switcher */}
                      <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-2 border border-border">
                        <button
                          type="button"
                          onClick={() => setAbVariant("v1-legacy")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            abVariant === "v1-legacy"
                              ? "bg-neutral-800 text-neutral-300 shadow-sm"
                              : "text-muted-fg hover:text-foreground"
                          }`}
                        >
                          Variant A (Legacy)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAbVariant("v2-nexora")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            abVariant === "v2-nexora"
                              ? "bg-primary-500 text-white shadow-[0_0_12px_rgba(20,184,160,0.35)]"
                              : "text-muted-fg hover:text-foreground"
                          }`}
                        >
                          Variant B (Nexora 8.9%)
                        </button>
                      </div>
                    </div>

                    {/* Comparison Cards Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* V1 Legacy Card */}
                      <div
                        className={`p-5 rounded-2xl border transition-all ${
                          abVariant === "v1-legacy"
                            ? "bg-surface-2 border-red-500/50 shadow-lg"
                            : "bg-surface-1/40 border-border opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-neutral-400">Variant A: Generic Agency Site</span>
                          <span className="text-xs font-mono font-bold text-red-400">1.4% Conversion</span>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-neutral-800 space-y-2 mb-3">
                          <p className="text-xs font-semibold text-neutral-300">"We build custom websites."</p>
                          <p className="text-[11px] text-neutral-500">Generic layout, slow LCP (3.8s), no trust badges.</p>
                          <div className="h-8 w-24 bg-neutral-700 rounded-md flex items-center justify-center text-[11px] text-neutral-400">
                            Submit Form
                          </div>
                        </div>
                        <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                          <span>Bounce Rate: 68.4%</span>
                          <span>Avg Time: 34s</span>
                        </div>
                      </div>

                      {/* V2 Nexora Card */}
                      <div
                        className={`p-5 rounded-2xl border transition-all ${
                          abVariant === "v2-nexora"
                            ? "bg-surface-2 border-primary-500 shadow-[0_0_24px_rgba(20,184,160,0.2)]"
                            : "bg-surface-1/40 border-border opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-primary-300">Variant B: Nexora High-Velocity</span>
                          <span className="text-xs font-mono font-bold text-emerald-400">8.9% Conversion (+535%)</span>
                        </div>
                        <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/30 space-y-2 mb-3">
                          <p className="text-xs font-semibold text-white">"Ship Production Next.js in 48 Hours."</p>
                          <p className="text-[11px] text-primary-200/80">
                            Sub-second LCP (0.4s), interactive cost calculator, instant booking.
                          </p>
                          <div className="h-8 px-3 w-fit bg-primary-500 rounded-md flex items-center justify-center text-[11px] text-white font-bold">
                            Schedule 15-Min Sprint Call →
                          </div>
                        </div>
                        <div className="flex justify-between text-[11px] font-mono text-emerald-400">
                          <span>Bounce Rate: 18.2%</span>
                          <span>Avg Time: 3m 42s</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Traffic & Extra Revenue Slider */}
                    <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-3">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted-fg">Simulate Monthly Visitors:</span>
                        <span className="text-foreground font-bold">{simulatedTraffic.toLocaleString()} visitors</span>
                      </div>
                      <input
                        type="range"
                        min={5000}
                        max={100000}
                        step={5000}
                        value={simulatedTraffic}
                        onChange={(e) => setSimulatedTraffic(Number(e.target.value))}
                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
                      />
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 text-xs">
                        <div className="text-muted-fg">
                          Additional Monthly Customers:{" "}
                          <span className="text-emerald-400 font-bold font-mono">+{extraConversions} clients</span>
                        </div>
                        <div className="text-primary-300 font-mono font-bold">
                          Projected Value Lift: +${extraRevenue} /mo
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Bottom Card Footer with Direct CTA */}
          <div className="px-6 py-4 border-t border-border/70 bg-surface-2/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-muted-fg text-center sm:text-left">
              Need these interactive UI modules tailored for your startup?
            </span>
            <Button size="sm" variant="primary" asChild>
              <Link href="/contact">Engineer Your Custom Application →</Link>
            </Button>
          </div>
        </Card>
      </div>
    </Section>
  );
}
