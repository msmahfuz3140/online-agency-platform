import { Badge } from "../ui/Badge";
import { Section } from "../ui/Section";
import { FadeInSection } from "../motion/FadeInSection";
import { AnimatedCounter } from "../motion/AnimatedCounter";

const stats = [
  { value: 3, suffix: "x", label: "Avg. Revenue Growth" },
  { value: 95, suffix: "%", label: "Client Retention Rate" },
  { value: 50, suffix: "+", label: "Businesses Transformed" },
  { value: 100, suffix: "k+", label: "End Users Served" },
];

export function CaseStudiesHeroSection() {
  return (
    <Section
      id="case-studies-hero"
      className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28"
    >
      {/* Background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-0 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary-500/8 blur-[100px]"
      />

      <FadeInSection>
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="warning" size="sm" className="mb-4">
            Case Studies
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Real Problems.{" "}
            <span className="gradient-text">Real Results.</span>
            <br className="hidden sm:block" /> No Fluff.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-fg max-w-2xl mx-auto leading-relaxed">
            Deep-dives into how we diagnose client challenges, engineer precise solutions, and deliver
            measurable business outcomes — with data to back every claim.
          </p>
        </div>
      </FadeInSection>

      {/* Stats */}
      <FadeInSection delay={0.15}>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl sm:text-4xl font-bold text-amber-400">
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
