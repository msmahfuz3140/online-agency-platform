"use client";

import Link from "next/link";
import { Section } from "../ui/Section";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";

export function ServicesHeroSection() {
  return (
    <Section
      as="section"
      className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-surface/40 to-background"
    >
      {/* Background Gradients & Grid Pattern */}
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Breadcrumb / Tag */}
        <FadeInSection from="bottom" delay={0.05}>
          <div className="inline-flex items-center gap-2 mb-6">
            <Link
              href="/"
              className="text-xs text-muted-fg hover:text-primary-400 transition-colors"
            >
              Home
            </Link>
            <span className="text-xs text-muted-fg/40">/</span>
            <Badge variant="primary" size="sm" dot>
              Full-Spectrum Digital Services
            </Badge>
          </div>
        </FadeInSection>

        {/* Main Title */}
        <FadeInSection from="bottom" delay={0.12}>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            World-class web engineering, UI/UX, and{" "}
            <span className="gradient-text">AI solutions</span> tailored for scale.
          </h1>
        </FadeInSection>

        {/* Subtitle */}
        <FadeInSection from="bottom" delay={0.2}>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted-fg leading-relaxed max-w-2xl mx-auto font-normal">
            Whether you need an instant AI-accelerated MVP, a bespoke SaaS web application, or a hardened enterprise cloud infrastructure, we deliver production-ready code engineered to convert.
          </p>
        </FadeInSection>

        {/* Guarantees Ribbon */}
        <FadeInSection from="bottom" delay={0.28}>
          <div className="mt-10 pt-8 border-t border-border/60 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-fg">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-400" />
              <span>13 Specialized Offerings</span>
            </div>
            <span className="hidden sm:inline text-border">•</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>100% Source Code Ownership</span>
            </div>
            <span className="hidden sm:inline text-border">•</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>Sub-Second 100/100 Speed</span>
            </div>
            <span className="hidden sm:inline text-border">•</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              <span>14-Day Free Warranty</span>
            </div>
          </div>
        </FadeInSection>
      </div>
    </Section>
  );
}
