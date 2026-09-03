"use client";

import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

const storyTimeline = [
  {
    year: "2024",
    tag: "The Genesis",
    title: "The CST Engineering Crucible",
    desc: "Nexora began inside the Computer Science & Technology labs at Mymensingh Polytechnic Institute. Frustrated by slow, cookie-cutter website builders and bloated legacy agencies charging five figures for basic WordPress setups, we set out to build something radically faster and engineered to perfection.",
    stats: "01",
  },
  {
    year: "Early 2025",
    tag: "The Shift",
    title: "Bridging Bespoke Code & AI Engines",
    desc: "We saw the rise of AI as an accelerator, not a shortcut. Instead of generating low-quality AI gibberish, we engineered a deterministic system: Anthropic Claude generates strict, component-mapped JSON schemas that compile directly into our hardened, accessible React & Next.js design system.",
    stats: "02",
  },
  {
    year: "Present & Beyond",
    tag: "Global Impact",
    title: "A Modern Full-Stack Agency Powerhouse",
    desc: "Today, Nexora operates as a hybrid tech agency: delivering custom enterprise SaaS applications, bespoke brand flagships, and instantaneous AI-driven website generation for founders, growing SMBs, and international innovators.",
    stats: "03",
  },
];

const coreValues = [
  {
    icon: "💎",
    title: "Obsessive Craftsmanship",
    desc: "Zero cookie-cutter templates. Every layout, typography pair, micro-interaction, and API endpoint is built with deliberate intentionality and pride.",
  },
  {
    icon: "⚡",
    title: "Uncompromising Velocity",
    desc: "Speed is our greatest competitive advantage. We leverage our proprietary AI component architecture to cut production timelines from months down to 48 hours.",
  },
  {
    icon: "🛡️",
    title: "Security by Default",
    desc: "With specialized cyber security engineering built into our leadership, every site ships hardened with CSRF protection, OWASP auditing, and safe authentication.",
  },
  {
    icon: "🤝",
    title: "Radical Transparency",
    desc: "No technical jargon or hostage situations. You own 100% of your source code, assets, and deployment keys with zero vendor lock-in.",
  },
];

export function AgencyStorySection() {
  return (
    <Section id="agency-story" className="relative py-20 lg:py-28">
      {/* Section Header */}
      <FadeInSection>
        <div className="max-w-3xl mb-16 sm:mb-20">
          <Badge variant="primary" size="sm" className="mb-3">
            Our Journey & Roots
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            From technical curiosity to a{" "}
            <span className="gradient-text">relentless digital agency.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-fg leading-relaxed">
            We didn&apos;t start with venture capital or corporate slide decks. We started with a text editor,
            a deep respect for computer science fundamentals, and an obsession with shipping products that
            actually make our clients money.
          </p>
        </div>
      </FadeInSection>

      {/* Story Evolution Cards */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
        {storyTimeline.map((item, index) => (
          <FadeInSection key={item.title} delay={index * 0.12} from="bottom">
            <Card
              hover
              padding="lg"
              className="relative h-full flex flex-col justify-between overflow-hidden border-border/80 bg-surface/50"
            >
              {/* Top Accent line & watermark */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-amber-500 opacity-80" />
              <span className="absolute top-3 right-5 font-heading text-5xl font-black text-neutral-800/40 select-none pointer-events-none">
                {item.stats}
              </span>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    {item.year}
                  </span>
                  <span className="text-xs text-muted-fg font-medium">{item.tag}</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mt-2">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-muted-fg leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-primary-400 font-mono">
                <span>Phase {item.stats}</span>
                <span>•</span>
                <span>Verified Milestones</span>
              </div>
            </Card>
          </FadeInSection>
        ))}
      </div>

      {/* Core Values Section */}
      <div className="mt-24 pt-16 border-t border-border/60">
        <FadeInSection>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
              Our Compass
            </p>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Four Core Values That Anchor Everything We Build
            </h3>
          </div>
        </FadeInSection>

        <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coreValues.map((v) => (
            <Card key={v.title} hover padding="md" className="bg-surface/60 border-border/70">
              <div className="h-10 w-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-xl mb-4">
                {v.icon}
              </div>
              <h4 className="font-heading font-bold text-base text-foreground">{v.title}</h4>
              <p className="mt-2 text-xs text-muted-fg leading-relaxed">{v.desc}</p>
            </Card>
          ))}
        </StaggerList>
      </div>
    </Section>
  );
}
