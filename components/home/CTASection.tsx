"use client";

import { useState } from "react";
import Link from "next/link";
import { Section } from "../ui/Section";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { DiscoveryCallSchedulerModal } from "./DiscoveryCallSchedulerModal";

export function CTASection() {
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  return (
    <Section id="book-call">
      <FadeInSection>
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-primary-500/30 bg-gradient-to-br from-primary-500/15 via-primary-500/5 to-transparent px-6 py-12 sm:p-12 md:p-16 text-center shadow-[0_0_60px_rgba(20,184,160,0.12)]">
          {/* Ambient glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-primary-500/20 blur-[80px]" />
          </div>

          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-3 sm:mb-4">
              Ready when you are
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Let&apos;s build something<br className="hidden sm:block" />
              <span className="gradient-text"> remarkable together.</span>
            </h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-muted-fg max-w-lg mx-auto">
              Whether you have a detailed brief or just a rough idea — we&apos;ll figure
              it out together. Schedule a 30-minute free video strategy call with our CST engineering team.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto shadow-lg"
                onClick={() => setIsSchedulerOpen(true)}
              >
                📅 Book a Free 30-Min Call →
              </Button>
              <Button size="lg" variant="ghost" className="w-full sm:w-auto" asChild>
                <Link href="/#cost-calculator">Calculate Project Cost</Link>
              </Button>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Interactive Scheduler Modal */}
      <DiscoveryCallSchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
      />
    </Section>
  );
}
