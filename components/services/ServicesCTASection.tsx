"use client";

import Link from "next/link";
import { Section } from "../ui/Section";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";

export function ServicesCTASection() {
  return (
    <Section id="services-cta" className="relative py-20 lg:py-28 overflow-hidden">
      <FadeInSection>
        <div className="relative rounded-3xl border border-primary-500/30 bg-gradient-to-b from-surface via-surface/90 to-surface-2 p-8 sm:p-12 lg:p-16 text-center max-w-5xl mx-auto overflow-hidden shadow-[0_20px_60px_rgba(20,184,160,0.1)]">
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary-500/15 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 right-10 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <Badge variant="primary" size="sm" dot className="mb-4">
              Start Your Project Today
            </Badge>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground max-w-2xl mx-auto">
              Ready to ship a web presence that{" "}
              <span className="gradient-text">outperforms your competition?</span>
            </h2>

            <p className="mt-5 text-sm sm:text-base text-muted-fg max-w-xl mx-auto leading-relaxed">
              Use our instant cost calculator to configure your scope, or schedule a direct architectural discovery call with our CST engineering team.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/#cost-calculator">
                <Button variant="primary" size="lg">
                  Calculate Instant Cost →
                </Button>
              </Link>
              <Link href="/#ai-generator-demo">
                <Button variant="secondary" size="lg">
                  Launch AI Generator
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-fg">
              100% Code Ownership • No Lock-in • 14-Day Guarantee
            </p>
          </div>
        </div>
      </FadeInSection>
    </Section>
  );
}
