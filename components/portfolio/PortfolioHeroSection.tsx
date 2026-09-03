import { Badge } from "../ui/Badge";
import { Section } from "../ui/Section";
import { FadeInSection } from "../motion/FadeInSection";
import { AnimatedCounter } from "../motion/AnimatedCounter";

const stats = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
  { value: 13, suffix: "", label: "Service Categories" },
  { value: 48, suffix: "h", label: "Avg. Turnaround" },
];

export function PortfolioHeroSection() {
  return (
    <Section
      id="portfolio-hero"
      className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28"
    >
      {/* Background glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary-500/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px]"
      />

      <FadeInSection>
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="primary" size="sm" className="mb-4">
            Our Work
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Work That{" "}
            <span className="gradient-text">Speaks Louder</span>
            <br className="hidden sm:block" /> Than Words
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-fg max-w-2xl mx-auto leading-relaxed">
            Every project here is a precision-engineered digital product — not a template, not a shortcut.
            Browse our full portfolio spanning SaaS, e-commerce, portfolios, landing pages, and AI solutions.
          </p>
        </div>
      </FadeInSection>

      {/* Stat row */}
      <FadeInSection delay={0.15}>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl sm:text-4xl font-bold text-primary-400">
                <AnimatedCounter to={s.value} suffix={s.suffix} formatNumber={false} />
              </p>
              <p className="mt-1 text-xs text-muted-fg">{s.label}</p>
            </div>
          ))}
        </div>
      </FadeInSection>
    </Section>
  );
}
