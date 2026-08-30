import Link from "next/link";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

interface Pathway {
  step: string;
  badge: string;
  badgeVariant: "primary" | "warning" | "success" | "default";
  title: string;
  subtitle: string;
  desc: string;
  timeline: string;
  idealFor: string;
  features: string[];
  cta: string;
  ctaVariant: "primary" | "secondary";
  popular?: boolean;
}

const pathways: Pathway[] = [
  {
    step: "Pathway 01",
    badge: "Instant DIY",
    badgeVariant: "default",
    title: "Instant AI Web Generation",
    subtitle: "Prompt to Functional Site in 60s",
    desc: "Input your business brief and let Claude Sonnet 4.6 generate a complete, mobile-responsive website layout with copy and structure instantly.",
    timeline: "⚡ 60 Seconds",
    idealFor: "Solo founders, rapid MVPs & early concepts",
    features: [
      "AI Prompt-to-Layout generation",
      "Tailored industry copywriting",
      "Responsive React component preview",
      "Instant code export",
    ],
    cta: "Generate With AI Free",
    ctaVariant: "secondary",
    popular: false,
  },
  {
    step: "Pathway 02",
    badge: "Most Popular",
    badgeVariant: "primary",
    title: "AI Draft + CST Expert Polish",
    subtitle: "Best Value: AI Speed + Human Craft",
    desc: "Generate your initial structure with AI, then have our CST engineering & design team customize Figma layouts, optimize SEO, and connect your backend.",
    timeline: "🚀 5 – 10 Business Days",
    idealFor: "Startups, growing SMBs & brands wanting perfection",
    features: [
      "Everything in AI Generation",
      "Bespoke Figma UI/UX refinement",
      "Custom animations & 95+ PageSpeed",
      "14-Day free post-launch support",
    ],
    cta: "Start Hybrid Project →",
    ctaVariant: "primary",
    popular: true,
  },
  {
    step: "Pathway 03",
    badge: "Enterprise",
    badgeVariant: "success",
    title: "Bespoke Full-Stack & Cyber Audit",
    subtitle: "Custom SaaS, Databases & Pen-Testing",
    desc: "Ground-up software engineering from scratch. Custom authentication, multi-tenant databases, Stripe billing, and offensive cyber security testing.",
    timeline: "🛡️ 2 – 4 Weeks",
    idealFor: "SaaS platforms, fin-tech, high-traffic portals",
    features: [
      "Custom Next.js 16 full-stack architecture",
      "Role-based auth & database modeling",
      "Full OWASP penetration testing audit",
      "Dedicated Slack channel & SLA support",
    ],
    cta: "Request Custom Scope",
    ctaVariant: "secondary",
    popular: false,
  },
];

export function ClientPathwaySection() {
  return (
    <Section id="pathways" className="relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-500/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <Badge variant="primary" dot className="mb-3">
            Tailored Engagement
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Choose Your <span className="gradient-text">Project Pathway</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-2xl mx-auto leading-relaxed">
            Whether you want an instant AI-generated prototype or a full-scale enterprise build with cyber security auditing — we have the perfect pathway for you.
          </p>
        </div>
      </FadeInSection>

      {/* 3 Pathway Cards */}
      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
        {pathways.map((p) => (
          <Card
            key={p.title}
            hover
            padding="lg"
            className={`flex flex-col justify-between group h-full relative ${
              p.popular
                ? "border-primary-500/60 shadow-[0_0_40px_rgba(20,184,160,0.18)] bg-surface ring-1 ring-primary-500/30"
                : "bg-surface/80"
            }`}
          >
            {p.popular && (
              <div className="absolute -top-3 inset-x-0 flex justify-center">
                <Badge variant="primary" size="sm">
                  ⚡ Recommended Pathway
                </Badge>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] font-bold text-primary-400">
                  {p.step}
                </span>
                <Badge variant={p.badgeVariant} size="sm">
                  {p.badge}
                </Badge>
              </div>

              <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground">
                {p.title}
              </h3>

              <p className="mt-1 text-xs font-semibold text-primary-400">
                {p.subtitle}
              </p>

              <p className="mt-3 text-xs text-muted-fg leading-relaxed">
                {p.desc}
              </p>

              <div className="mt-4 p-2.5 rounded-xl bg-surface-2 border border-border/80 text-xs">
                <span className="text-muted-fg">Turnaround: </span>
                <span className="font-bold text-foreground">{p.timeline}</span>
              </div>

              {/* Checklist */}
              <ul className="mt-5 space-y-2 text-xs">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-muted-fg">
                    <span className="text-primary-400 font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-border/60">
              <Button
                variant={p.ctaVariant}
                className="w-full"
                asChild
              >
                <Link href={p.title.includes("AI") ? "/#ai-generator-demo" : "/contact"}>
                  {p.cta}
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </StaggerList>
    </Section>
  );
}
