"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";

const serviceFaqs = [
  {
    question: "Do I retain 100% ownership of the source code and assets?",
    answer:
      "Yes, completely. Unlike proprietary website builders that lock you into their monthly subscription, you own every line of Next.js code, Tailwind CSS styling, Figma design files, and database schemas. We transfer GitHub repositories and Vercel projects directly to you.",
  },
  {
    question: "How does your AI-accelerated workflow differ from generic AI website generators?",
    answer:
      "Generic AI builders produce messy, hallucinated HTML/CSS that breaks on mobile devices and cannot be modified by developers. Our engine uses Anthropic Claude Sonnet to generate deterministic, strictly typed JSON data structures that map directly into our pre-tested, high-performance React component library. You get bespoke artisanal quality in a fraction of the time.",
  },
  {
    question: "What is your typical turnaround time for custom services?",
    answer:
      "A high-converting landing page is typically delivered in 24–48 hours. A multi-page business website takes 3–5 days. Complex SaaS platforms and full-stack web applications take 1–2 weeks. We provide clear milestone updates throughout.",
  },
  {
    question: "Can I start with a simple landing page and upgrade to a full SaaS web app later?",
    answer:
      "Absolutely. Because all our projects are built on modular Next.js App Router and TypeScript, your codebase is inherently scalable. We can seamlessly add authentication, MongoDB models, Stripe payments, or AI generation engines whenever your business is ready.",
  },
  {
    question: "What kind of warranty and post-launch support do you offer?",
    answer:
      "Every project includes our 14-day zero-defect warranty. If any bugs, visual defects, or responsiveness issues arise within 14 days of launch, we patch them immediately at zero charge. We also offer ongoing monthly maintenance packages.",
  },
];

export function ServicesFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <Section id="services-faq" className="relative py-20 lg:py-28">
      <FadeInSection>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="primary" size="sm" className="mb-3">
            Clarity & Transparency
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-fg leading-relaxed">
            Everything you need to know about our service deliverables, timelines, and guarantees.
          </p>
        </div>
      </FadeInSection>

      <div className="max-w-3xl mx-auto space-y-4">
        {serviceFaqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <FadeInSection key={i} delay={i * 0.05}>
              <div className="rounded-2xl border border-border/80 bg-surface/50 overflow-hidden transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-2/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-foreground">
                    {faq.question}
                  </span>
                  <span className="h-8 w-8 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-primary-400 font-bold shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-border/40 text-xs sm:text-sm text-muted-fg leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeInSection>
          );
        })}
      </div>
    </Section>
  );
}
