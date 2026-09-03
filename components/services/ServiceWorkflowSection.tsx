"use client";

import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

const workflowSteps = [
  {
    step: "01",
    title: "Discovery & Architectural Blueprint",
    timeline: "Day 1",
    desc: "We analyze your target market, user flows, and technical requirements. We establish clear milestone deliverables, choose optimal data schemas, and lock in the timeline.",
    badge: "Strategy",
  },
  {
    step: "02",
    title: "Design System & High-Fidelity UI",
    timeline: "Days 2–3",
    desc: "Our UI/UX team creates Figma design tokens, responsive mobile/desktop layouts, and interactive wireframes that convert. You review and sign off before code begins.",
    badge: "Design",
  },
  {
    step: "03",
    title: "Next.js & AI Rapid Engineering",
    timeline: "Days 3–5",
    desc: "We build clean, typed Next.js components, integrate Claude-driven deterministic JSON workflows, wire up MongoDB schemas, and test with hardware-accelerated animations.",
    badge: "Development",
  },
  {
    step: "04",
    title: "Hardened Security & Production Launch",
    timeline: "Day 5+",
    desc: "Our cyber security division audits every endpoint, secures CORS & session cookies, verifies 100/100 Lighthouse scores, and deploys to the global Vercel Edge.",
    badge: "Deployment",
  },
];

export function ServiceWorkflowSection() {
  return (
    <Section id="service-workflow" className="relative py-20 lg:py-28 bg-surface/30 border-y border-border/50">
      <FadeInSection>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="sm" className="mb-3">
            Execution Standard
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            How We Deliver <span className="gradient-text">Exceptional Work</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-fg leading-relaxed">
            Our hybrid engineering workflow eliminates bureaucratic delay.
            We take your project from initial idea to live production deployment with unmatched precision.
          </p>
        </div>
      </FadeInSection>

      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {workflowSteps.map((step, idx) => (
          <Card
            key={step.title}
            hover
            padding="lg"
            className="relative flex flex-col justify-between h-full bg-surface/60 border-border/80"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading font-black text-4xl text-primary-400/50">
                  {step.step}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-muted-fg border border-border">
                  {step.timeline}
                </span>
              </div>

              <Badge variant="primary" size="sm" className="mb-2">
                {step.badge}
              </Badge>

              <h3 className="font-heading font-bold text-lg text-foreground mt-1">
                {step.title}
              </h3>

              <p className="mt-2.5 text-xs text-muted-fg leading-relaxed">
                {step.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span>●</span> Step {idx + 1} of 4 Complete
            </div>
          </Card>
        ))}
      </StaggerList>
    </Section>
  );
}
