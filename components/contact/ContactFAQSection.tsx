"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { FadeInSection } from "../motion/FadeInSection";

const faqs = [
  {
    q: "How quickly will someone reply to my inquiry?",
    a: "We guarantee a response from a senior engineer within 2 to 4 business hours. During US/EU daytime hours, our typical reply time is under 45 minutes.",
  },
  {
    q: "Can you sign a Mutual NDA before we share sensitive project details?",
    a: "Yes, absolutely. We regularly sign mutual Non-Disclosure Agreements (NDAs) before reviewing proprietary designs, database schemas, or business workflows. Simply note it in your message or request our standard mutual NDA template.",
  },
  {
    q: "What should I prepare before contacting Nexora?",
    a: "A brief summary of your product or business, your target timeline, and any design or feature references are helpful, but not required. If you only have an early concept, our engineers will help you scope out the technical architecture from scratch.",
  },
  {
    q: "Do you build full-stack web applications and AI tools, or only static websites?",
    a: "We specialize in end-to-end full-stack engineering: Next.js 15 frontends, Express/Node.js REST APIs, MongoDB/PostgreSQL databases, and Claude/OpenAI AI generation engines. We engineer everything from high-converting landing pages to complex multi-tenant SaaS platforms.",
  },
  {
    q: "How does project pricing and payment work?",
    a: "We offer transparent fixed-price milestones with 100% code ownership. For custom projects, payments are typically split into milestones (e.g. 50% kickoff, 50% post-launch QA after 14-day warranty).",
  },
];

export function ContactFAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <Section id="contact-faq" className="pb-24 border-t border-border/40">
      <FadeInSection>
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
            Frequently Asked Questions
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Before You Reach Out
          </h2>
          <p className="mt-2 text-sm text-muted-fg">
            Everything you need to know about working with Nexora Agency.
          </p>
        </div>
      </FadeInSection>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <FadeInSection key={faq.q} delay={idx * 0.05}>
              <Card
                padding="none"
                className={`overflow-hidden border transition-all duration-200 ${
                  isOpen ? "border-primary-500/40 bg-surface-1" : "border-border bg-surface-1/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-sm sm:text-base font-semibold text-foreground">
                    {faq.q}
                  </span>
                  <span
                    className={`text-sm font-mono flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-45 text-primary-400" : "text-muted-fg"
                    }`}
                  >
                    +
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 text-xs sm:text-sm text-muted-fg leading-relaxed border-t border-border/40 mt-1">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </FadeInSection>
          );
        })}
      </div>
    </Section>
  );
}
