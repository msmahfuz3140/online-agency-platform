"use client";

import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";

export function MissionVisionSection() {
  return (
    <Section id="mission-vision" className="relative py-20 lg:py-28 bg-surface/30 border-y border-border/50">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-72 h-72 bg-primary-500/10 blur-[110px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 bg-amber-500/5 blur-[110px] rounded-full pointer-events-none" />

      {/* Header */}
      <FadeInSection>
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <Badge variant="primary" size="sm" className="mb-3">
            Purpose & Direction
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Our <span className="gradient-text">Mission & Vision</span> for the Web
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-fg leading-relaxed">
            The web is drowning in bloated templates and sluggish software. We are here to change
            the status quo through disciplined engineering and thoughtful automation.
          </p>
        </div>
      </FadeInSection>

      {/* Dual Mission & Vision Showcase */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Mission Card */}
        <FadeInSection from="left" delay={0.1}>
          <Card
            hover
            padding="lg"
            className="relative h-full overflow-hidden border-primary-500/30 bg-surface/70 shadow-[0_12px_40px_rgba(20,184,160,0.06)] flex flex-col justify-between"
          >
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary-500/15 blur-2xl rounded-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl p-3 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-400">
                  🎯
                </span>
                <Badge variant="primary" size="sm">
                  What We Do Daily
                </Badge>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                Our Mission
              </h3>

              <p className="mt-4 text-base text-neutral-300 leading-relaxed font-medium">
                To liberate high-growth businesses and innovators from exorbitant agency fees and technical inertia by delivering world-class, hardened, high-converting digital flagships in days.
              </p>

              <div className="mt-6 space-y-3 pt-6 border-t border-border/60">
                {[
                  "Demolish the 3-month agency waiting cycle using intelligent AI component orchestration.",
                  "Enforce 95+ Core Web Vitals and sub-second load times as an uncompromising baseline.",
                  "Empower clients with 100% full ownership of source code, design files, and zero lock-in.",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-muted-fg leading-relaxed">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/50 text-xs font-mono text-primary-400">
              [ TARGET: Zero Latency • Maximum Conversion ]
            </div>
          </Card>
        </FadeInSection>

        {/* Vision Card */}
        <FadeInSection from="right" delay={0.15}>
          <Card
            hover
            padding="lg"
            className="relative h-full overflow-hidden border-amber-500/30 bg-surface/70 shadow-[0_12px_40px_rgba(245,158,11,0.06)] flex flex-col justify-between"
          >
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/15 blur-2xl rounded-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  🔭
                </span>
                <Badge variant="warning" size="sm">
                  Where We Are Heading
                </Badge>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                Our Vision
              </h3>

              <p className="mt-4 text-base text-neutral-300 leading-relaxed font-medium">
                To pioneer the next-generation symbiotic agency model—where human design taste and AI generative precision fuse to build the most sophisticated digital experiences on earth.
              </p>

              <div className="mt-6 space-y-3 pt-6 border-t border-border/60">
                {[
                  "A world where non-technical founders can manifest enterprise-grade SaaS websites via conversational AI.",
                  "Zero tolerance for vulnerable or unmonitored code across production web environments.",
                  "Becoming the premier standard for full-stack Next.js and AI product engineering globally.",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      ★
                    </span>
                    <span className="text-xs sm:text-sm text-muted-fg leading-relaxed">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/50 text-xs font-mono text-amber-400">
              [ HORIZON: Autonomous Web Generation + Human Craft ]
            </div>
          </Card>
        </FadeInSection>
      </div>

      {/* 3 Strategic Pillars Banner */}
      <div className="mt-16 grid sm:grid-cols-3 gap-5">
        {[
          {
            number: "01",
            title: "Performance First",
            desc: "Sub-second LCP, minimal bundle payloads, and server-side edge optimization across all routes.",
          },
          {
            number: "02",
            title: "Deterministic AI",
            desc: "Structured JSON schemas mapped strictly to production React components—never hallucinations.",
          },
          {
            number: "03",
            title: "Hardened Security",
            desc: "Strict CSP headers, Better Auth token management, and continuous penetration testing.",
          },
        ].map((pillar) => (
          <FadeInSection key={pillar.number} delay={0.2}>
            <div className="p-5 rounded-xl border border-border bg-surface/50">
              <span className="text-xs font-mono font-bold text-primary-400">{pillar.number}</span>
              <h4 className="mt-1 font-heading font-bold text-sm text-foreground">{pillar.title}</h4>
              <p className="mt-1.5 text-xs text-muted-fg leading-relaxed">{pillar.desc}</p>
            </div>
          </FadeInSection>
        ))}
      </div>
    </Section>
  );
}
