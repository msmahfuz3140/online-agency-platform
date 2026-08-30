import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

interface Guarantee {
  icon: string;
  badge: string;
  badgeVariant: "primary" | "warning" | "success" | "default";
  title: string;
  desc: string;
  bullet: string;
}

const guarantees: Guarantee[] = [
  {
    icon: "💎",
    badge: "IP Ownership",
    badgeVariant: "primary",
    title: "100% Full Code Ownership",
    desc: "You receive the full clean source code, Git repository, Figma design files, and deployment access. Zero vendor lock-in, ever.",
    bullet: "Complete intellectual property handover upon project completion",
  },
  {
    icon: "⚡",
    badge: "Speed Guarantee",
    badgeVariant: "warning",
    title: "95+ PageSpeed & Sub-Second Load",
    desc: "We engineer websites with Next.js 16 Server Components and edge caching. If your site scores below 90 on Google PageSpeed, we optimize it for free.",
    bullet: "Guaranteed Core Web Vitals green score & global CDN delivery",
  },
  {
    icon: "🔒",
    badge: "Security Standard",
    badgeVariant: "success",
    title: "OWASP Hardened & Pentested",
    desc: "Built and audited by our in-house ethical hackers. Every endpoint, auth token, and database query is hardened against SQLi, XSS, and CSRF.",
    bullet: "Zero critical security vulnerabilities guaranteed at launch",
  },
  {
    icon: "🤝",
    badge: "Post-Launch Peace of Mind",
    badgeVariant: "default",
    title: "14-Day Free Bug-Fix Warranty",
    desc: "We stay with you after launch. Any unexpected bug, UI quirk, or configuration issue reported within 14 days is fixed immediately at zero charge.",
    bullet: "Dedicated Slack/WhatsApp support line with priority response",
  },
];

export function TrustGuaranteesSection() {
  return (
    <Section id="guarantees" className="relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-primary-500/10 blur-[130px] pointer-events-none" />

      {/* Section Header */}
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <Badge variant="success" dot className="mb-3">
            Risk-Free Partnership
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Our Ironclad <span className="gradient-text">Client Guarantees</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-2xl mx-auto leading-relaxed">
            We hold ourselves to the highest standards in the industry. Every contract comes backed by these 4 foundational commitments.
          </p>
        </div>
      </FadeInSection>

      {/* 4 Guarantees Grid */}
      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {guarantees.map((g) => (
          <Card
            key={g.title}
            hover
            padding="md"
            className="flex flex-col justify-between group h-full bg-surface/80 border-border/80"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
                  {g.icon}
                </div>
                <Badge variant={g.badgeVariant} size="sm">
                  {g.badge}
                </Badge>
              </div>

              <h3 className="font-heading font-bold text-sm sm:text-base text-foreground leading-snug">
                {g.title}
              </h3>

              <p className="mt-2 text-xs text-muted-fg leading-relaxed">
                {g.desc}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-border/60 flex items-start gap-2">
              <span className="text-emerald-400 font-bold text-xs mt-0.5">✓</span>
              <p className="text-[11px] text-foreground/90 leading-snug">
                {g.bullet}
              </p>
            </div>
          </Card>
        ))}
      </StaggerList>
    </Section>
  );
}
