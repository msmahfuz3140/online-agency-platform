"use client";

import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";
import { AnimatedCounter } from "../motion/AnimatedCounter";

const statMetrics = [
  {
    value: 250,
    suffix: "+",
    label: "Web Projects Shipped",
    desc: "From early-stage SaaS to enterprise brand flagships.",
  },
  {
    value: 99,
    suffix: ".8%",
    label: "Client Satisfaction",
    desc: "Long-term relationships and 5-star verified reviews.",
  },
  {
    value: 48,
    prefix: "<",
    suffix: "h",
    label: "Rapid AI Turnaround",
    desc: "From initial business prompt to live staging preview.",
  },
  {
    value: 100,
    suffix: "/100",
    label: "Lighthouse CWV Standard",
    desc: "Zero-compromise speed, accessibility, and SEO scoring.",
  },
  {
    value: 42,
    prefix: "$",
    suffix: "M+",
    label: "Client Revenue Influenced",
    desc: "Measurable conversion lift across all shipped platforms.",
  },
  {
    value: 0,
    prefix: "",
    suffix: "",
    label: "Security Vulnerabilities",
    desc: "Hardened by our dedicated cyber security division.",
  },
];

const milestones = [
  {
    badge: "Milestone",
    year: "2024",
    title: "CST Innovation Recognition",
    desc: "Recognized at Mymensingh Polytechnic Institute for breakthrough web architecture and full-stack systems engineering.",
  },
  {
    badge: "Engineering",
    year: "2025",
    title: "Anthropic Claude Engine v1 Launch",
    desc: "Completed our proprietary JSON-to-React component compilation pipeline, cutting turnaround from weeks to 48 hours.",
  },
  {
    badge: "Security",
    year: "2025",
    title: "OWASP Top 10 Hardened Standard",
    desc: "Implemented continuous penetration testing and automated vulnerability assessments across all deployed client nodes.",
  },
  {
    badge: "Scale",
    year: "2026",
    title: "International SaaS Clientele",
    desc: "Expanded delivery to founders and digital brands across North America, Europe, and Asia with 99.8% retention.",
  },
];

export function AchievementsSection() {
  return (
    <Section id="achievements" className="relative py-20 lg:py-28">
      {/* Header */}
      <FadeInSection>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="sm" className="mb-3">
            Track Record & Evidence
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Proven Results, <span className="gradient-text">Zero Guesswork.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-fg leading-relaxed">
            We measure our success strictly by the speed, security, and conversion impact we deliver
            to our clients. Numbers that speak for themselves.
          </p>
        </div>
      </FadeInSection>

      {/* Animated Counter Stats Grid */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-20">
        {statMetrics.map((stat) => (
          <Card
            key={stat.label}
            hover
            padding="lg"
            className="bg-surface/50 border-border/80 flex flex-col justify-between group"
          >
            <div>
              <div className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight group-hover:text-primary-400 transition-colors">
                <AnimatedCounter
                  to={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={2}
                />
              </div>
              <h3 className="mt-3 font-heading font-bold text-sm sm:text-base text-foreground">
                {stat.label}
              </h3>
            </div>
            <p className="mt-2 text-xs text-muted-fg leading-relaxed">
              {stat.desc}
            </p>
          </Card>
        ))}
      </StaggerList>

      {/* Milestones & Timeline */}
      <div className="pt-16 border-t border-border/60">
        <FadeInSection>
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <Badge variant="primary" size="sm" className="mb-2">
              Key Milestones
            </Badge>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Milestones That Shaped Our Agency
            </h3>
          </div>
        </FadeInSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {milestones.map((m, idx) => (
            <FadeInSection key={m.title} delay={idx * 0.1}>
              <div className="p-5 rounded-2xl border border-border/80 bg-surface/40 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-primary-400">
                      {m.year}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-surface-2 text-muted-fg border border-border">
                      {m.badge}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-foreground">
                    {m.title}
                  </h4>
                  <p className="mt-2 text-xs text-muted-fg leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-border/40 text-[10px] font-mono text-emerald-400">
                  ✓ Verified Record
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </Section>
  );
}
