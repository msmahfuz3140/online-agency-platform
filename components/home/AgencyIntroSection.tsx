import Link from "next/link";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

const highlights = [
  {
    icon: "⚡",
    title: "Speed-First Development",
    desc: "Every site we ship scores 95+ on Core Web Vitals. Performance is not optional — it's a deliverable.",
  },
  {
    icon: "🎨",
    title: "Design That Converts",
    desc: "We obsess over UX so your visitors stay longer, trust faster, and convert at higher rates.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Generation",
    desc: "Generate a fully structured website from your business brief in minutes using our Claude-powered engine.",
  },
  {
    icon: "🔒",
    title: "Secure by Default",
    desc: "Auth, rate limiting, input validation — every project ships hardened from day one.",
  },
];

export function AgencyIntroSection() {
  return (
    <Section className="bg-surface/40">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left */}
        <FadeInSection from="left">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-3">Who we are</p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            A small team with an <span className="gradient-text">outsized impact.</span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-muted-fg leading-relaxed">
            Nexora was founded with one goal: to give ambitious businesses the same digital
            quality that was once exclusive to companies with million-dollar budgets. We combine
            thoughtful design, clean engineering, and AI tools to ship products that stand out.
          </p>
          <p className="mt-4 text-sm sm:text-base text-muted-fg leading-relaxed">
            We work closely with founders, startups, and growing SMBs who want a web presence
            that actually reflects how good their product is — not just a template with a logo swap.
          </p>
          <div className="mt-7 sm:mt-8">
            <Button variant="secondary" asChild>
              <Link href="/about">Learn about our story →</Link>
            </Button>
          </div>
        </FadeInSection>

        {/* Right — highlight grid */}
        <FadeInSection from="right" delay={0.1}>
          <StaggerList className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {highlights.map((h) => (
              <Card key={h.title} hover padding="md">
                <span className="text-2xl">{h.icon}</span>
                <h3 className="mt-3 font-heading font-semibold text-sm text-foreground">{h.title}</h3>
                <p className="mt-1.5 text-xs text-muted-fg leading-relaxed">{h.desc}</p>
              </Card>
            ))}
          </StaggerList>
        </FadeInSection>
      </div>
    </Section>
  );
}
