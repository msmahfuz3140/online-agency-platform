import Link from "next/link";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { AnimatedCounter } from "../motion/AnimatedCounter";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

interface MetricCard {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
}

const impactMetrics: MetricCard[] = [
  {
    value: 34,
    suffix: "%",
    prefix: "+",
    label: "Conversion Rate Uplift",
    sublabel: "Average sales increase after full custom redesign",
  },
  {
    value: 98,
    suffix: "%",
    prefix: "",
    label: "Google PageSpeed Average",
    sublabel: "Sub-second load times across mobile and desktop",
  },
  {
    value: 120,
    suffix: "+",
    prefix: "",
    label: "Security Audits Completed",
    sublabel: "Zero critical breach incidents on deployed client apps",
  },
  {
    value: 48,
    suffix: " hrs",
    prefix: "< ",
    label: "Fastest Milestone Turnaround",
    sublabel: "From initial kickoff call to interactive Figma staging",
  },
];

interface CaseSpotlight {
  client: string;
  category: string;
  metric: string;
  metricLabel: string;
  before: string;
  after: string;
  badge: "primary" | "warning" | "success";
}

const spotlights: CaseSpotlight[] = [
  {
    client: "Bloom Nurseries",
    category: "E-Commerce",
    metric: "+34% Sales",
    metricLabel: "Monthly Revenue Increase",
    before: "Slow 4.2s Wix template with cart abandonment issues",
    after: "Custom Next.js 16 store loading in 0.7s with Razorpay 1-click checkout",
    badge: "success",
  },
  {
    client: "Finflow Dashboard",
    category: "FinTech SaaS",
    metric: "60 FPS",
    metricLabel: "Smooth Real-Time Telemetry",
    before: "Laggy legacy React tables struggling with 5,000+ data rows",
    after: "Server Component architecture with edge streaming & Recharts graphs",
    badge: "primary",
  },
  {
    client: "Radius Design Studio",
    category: "Creative Agency",
    metric: "Site of Day",
    metricLabel: "Design Excellence Award",
    before: "Generic uninspired WordPress portfolio with static images",
    after: "Immersive GSAP + Framer Motion interactive showcase driving international leads",
    badge: "warning",
  },
];

export function ClientImpactSection() {
  return (
    <Section id="impact" className="bg-surface/30 relative">
      {/* Header */}
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <Badge variant="primary" dot className="mb-3">
            Proven Results
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Real Impact, <span className="gradient-text">Measurable Results</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-2xl mx-auto leading-relaxed">
            We don&apos;t just deliver pretty websites — we engineer high-performance digital engines that measurably grow your business.
          </p>
        </div>
      </FadeInSection>

      {/* 4 Big Metrics Cards */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
        {impactMetrics.map((m) => (
          <div
            key={m.label}
            className="p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 text-center flex flex-col justify-center items-center hover:border-primary-500/40 transition-colors shadow-sm"
          >
            <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              <AnimatedCounter
                to={m.value}
                suffix={m.suffix}
                prefix={m.prefix}
                className="gradient-text"
              />
            </div>
            <p className="font-heading font-bold text-xs sm:text-sm text-foreground mt-2">
              {m.label}
            </p>
            <p className="text-[11px] text-muted-fg mt-1 leading-snug">
              {m.sublabel}
            </p>
          </div>
        ))}
      </StaggerList>

      {/* Before & After Case Spotlights */}
      <FadeInSection delay={0.15}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground">
            Transformation Spotlights
          </h3>
          <span className="text-xs text-primary-400 font-medium hidden sm:inline">
            Before vs. After Results
          </span>
        </div>
      </FadeInSection>

      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {spotlights.map((item) => (
          <Card
            key={item.client}
            hover
            padding="lg"
            className="flex flex-col justify-between group h-full bg-surface"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant={item.badge} size="sm">
                  {item.category}
                </Badge>
                <div className="text-right">
                  <p className="font-heading font-bold text-sm text-foreground">
                    {item.metric}
                  </p>
                  <p className="text-[10px] text-muted-fg">{item.metricLabel}</p>
                </div>
              </div>

              <h4 className="font-heading font-bold text-base text-foreground mb-4">
                {item.client}
              </h4>

              {/* Before Box */}
              <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 mb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">
                  Before Nexora
                </p>
                <p className="text-xs text-muted-fg leading-snug">{item.before}</p>
              </div>

              {/* After Box */}
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  After Transformation
                </p>
                <p className="text-xs text-foreground/90 leading-snug">{item.after}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border/50">
              <Link
                href="/portfolio"
                className="text-xs font-semibold text-primary-400 group-hover:underline flex items-center justify-between"
              >
                <span>Read Full Case Study</span>
                <span>→</span>
              </Link>
            </div>
          </Card>
        ))}
      </StaggerList>
    </Section>
  );
}
