import { Badge } from "../ui/Badge";
import { Section } from "../ui/Section";
import { FadeInSection } from "../motion/FadeInSection";

export function PricingHeroSection() {
  return (
    <Section
      id="pricing-hero"
      className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[600px] rounded-full bg-primary-500/10 blur-[120px]"
      />

      <FadeInSection>
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="primary" size="sm" className="mb-4">
            Pricing
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Transparent Pricing.{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text">Zero Surprises.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-fg max-w-2xl mx-auto leading-relaxed">
            Fixed-scope packages with crystal-clear deliverables. No hidden fees, no vague timelines,
            no scope creep surprises. Just engineering excellence at a defined cost.
          </p>

          {/* Guarantee badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              "✓ 100% Code Ownership",
              "✓ 14-day Free Warranty",
              "✓ On-Time Delivery Guarantee",
              "✓ No Lock-in Contracts",
            ].map((g) => (
              <span
                key={g}
                className="text-xs px-3 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-400"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </FadeInSection>
    </Section>
  );
}
