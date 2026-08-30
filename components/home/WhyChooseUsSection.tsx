import Link from "next/link";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

interface ValueProp {
  icon: string;
  badge: string;
  badgeVariant: "primary" | "warning" | "success" | "default";
  title: string;
  highlight: string;
  description: string;
  perks: string[];
}

const valueProps: ValueProp[] = [
  {
    icon: "💰",
    badge: "Cost Efficiency",
    badgeVariant: "success",
    title: "Affordable & Transparent Pricing",
    highlight: "Agency Quality at 60% Less Cost",
    description:
      "Get top-tier, custom-coded web applications and UI/UX design without the exorbitant $20,000+ agency markup. Fixed milestone-based pricing with zero hidden fees.",
    perks: ["No hidden consultation fees", "Budget-friendly for startups & SMBs", "Milestone-based stage payments"],
  },
  {
    icon: "💎",
    badge: "Premium Quality",
    badgeVariant: "primary",
    title: "Uncompromising Quality & Speed",
    highlight: "95+ Lighthouse Score Guaranteed",
    description:
      "We build exclusively with modern enterprise stacks (Next.js 16, TypeScript, Tailwind CSS, Framer Motion). Your website loads in under 1 second and scores 95+ on Core Web Vitals.",
    perks: ["Clean, documented TypeScript code", "Pixel-perfect mobile responsiveness", "Custom UI/UX designed in Figma"],
  },
  {
    icon: "🛡️",
    badge: "Extended Support",
    badgeVariant: "warning",
    title: "Extended Long-Term Support",
    highlight: "We Don't Disappear After Launch",
    description:
      "Most freelancers leave immediately upon delivery. We provide extended post-launch support, regular performance checkups, security patching, and on-demand maintenance retainers.",
    perks: ["Extended post-launch bug warranty", "Direct communication via Slack/WhatsApp", "Fast emergency response window"],
  },
  {
    icon: "🔒",
    badge: "Security First",
    badgeVariant: "success",
    title: "Security & Zero Vulnerabilities",
    highlight: "Hardened by Cyber Security Experts",
    description:
      "With ethical hacking and cyber security specialists on our core team, every backend API, authentication system, and database connection is pentested and hardened against attacks.",
    perks: ["OWASP Top 10 vulnerability checks", "Encrypted auth & sanitized inputs", "DDoS and rate-limiting protection"],
  },
  {
    icon: "⚡",
    badge: "Fast Turnaround",
    badgeVariant: "primary",
    title: "Rapid Delivery & Live Demos",
    highlight: "See Real Progress Every 3-5 Days",
    description:
      "No weeks of radio silence. You receive staging preview links and interactive Figma prototypes regularly throughout development so you are always in total control.",
    perks: ["Iterative sprint deliverables", "Live staging preview URLs", "Fast revisions with quick turnaround"],
  },
  {
    icon: "🎯",
    badge: "All-In-One Team",
    badgeVariant: "default",
    title: "Complete Digital Suite Under 1 Roof",
    highlight: "No Need to Hire 4 Separate Contractors",
    description:
      "Full-stack developers, UI/UX designers, cyber security testers, and technical SEO marketers working as one cohesive unit to make your digital venture a success.",
    perks: ["Design + Dev + Security + SEO", "Smooth inter-disciplinary handoff", "Unified project management"],
  },
];

export function WhyChooseUsSection() {
  return (
    <Section id="why-choose-us" className="relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-500/5 blur-[120px] pointer-events-none" />

      {/* Centered Section Header */}
      <FadeInSection>
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
            Why Clients Choose Us
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            The Nexora <span className="gradient-text">Advantage</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-2xl mx-auto leading-relaxed">
            Why founders, businesses, and startups choose our team over overpriced agencies and unreliable freelancers.
          </p>
        </div>
      </FadeInSection>

      {/* Value Proposition Cards Grid */}
      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {valueProps.map((prop) => (
          <Card
            key={prop.title}
            hover
            padding="lg"
            className="flex flex-col justify-between group h-full relative overflow-hidden"
          >
            {/* Top row */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-2xl group-hover:scale-110 group-hover:border-primary-500/40 transition-all duration-300">
                  {prop.icon}
                </div>
                <Badge variant={prop.badgeVariant} size="sm">
                  {prop.badge}
                </Badge>
              </div>

              <h3 className="font-heading font-bold text-base sm:text-lg text-foreground leading-snug">
                {prop.title}
              </h3>

              <p className="mt-1 text-xs font-semibold text-primary-400">
                {prop.highlight}
              </p>

              <p className="mt-3 text-xs text-muted-fg leading-relaxed">
                {prop.description}
              </p>
            </div>

            {/* Perks checklist */}
            <div className="mt-5 pt-4 border-t border-border/60">
              <ul className="space-y-2">
                {prop.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-[11px] text-muted-fg">
                    <svg
                      className="h-3.5 w-3.5 text-primary-400 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </StaggerList>

      {/* Bottom Guarantee Banner */}
      <FadeInSection delay={0.2}>
        <div className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-3xl bg-surface/80 border border-primary-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="font-heading font-bold text-base sm:text-lg text-foreground">
              Ready to experience the difference?
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-muted-fg">
              Book a 30-minute discovery call. We&apos;ll discuss your project scope, roadmap, and provide a fixed quote.
            </p>
          </div>
          <Button variant="primary" size="md" asChild className="whitespace-nowrap flex-shrink-0">
            <Link href="/contact">Get a Free Proposal →</Link>
          </Button>
        </div>
      </FadeInSection>
    </Section>
  );
}
