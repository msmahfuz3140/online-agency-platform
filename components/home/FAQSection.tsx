"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { FadeInSection } from "../motion/FadeInSection";

const faqs = [
  {
    q: "How long does a typical project take?",
    a: "It depends on scope. Landing pages take 3–7 days, business websites 1–3 weeks, and full SaaS applications 4–10 weeks. We always give you a timeline in the proposal before we start.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. All our work is delivered remotely. We work with clients across Europe, North America, Southeast Asia, and the Middle East. Communication happens over Slack and Zoom.",
  },
  {
    q: "What's included in the pricing?",
    a: "Design, development, basic SEO setup, deployment, and a post-launch support window. We don't charge separately for project management or communication.",
  },
  {
    q: "Can I use my own domain and hosting?",
    a: "Absolutely. We deploy to your preferred platform (Vercel, Netlify, AWS, etc.) and your own domain. You own everything — code, content, and infrastructure.",
  },
  {
    q: "What is the AI Website Generator?",
    a: "It's a tool built into our platform that lets you input your business information and have Claude AI generate a complete website structure, content, and layout — rendered using our pre-built component library. You can then customize it or hand it to us for refinement.",
  },
  {
    q: "Do you offer ongoing maintenance?",
    a: "Yes. We offer monthly maintenance retainers for content updates, security patches, dependency upgrades, and minor feature additions. Pricing varies by scope.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left transition-colors hover:text-primary-400"
        aria-expanded={open}
      >
        <span className="text-sm sm:text-base font-medium text-foreground">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 h-5 w-5 flex items-center justify-center text-muted-fg"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-xs sm:text-sm text-muted-fg leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  return (
    <Section className="bg-surface/40" id="faq">
      <div className="max-w-3xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">FAQ</p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-md mx-auto leading-relaxed">
              Everything you need to know about our process, pricing, and deliverables.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div className="divide-y divide-border/50">
            {faqs.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </FadeInSection>
      </div>
    </Section>
  );
}
