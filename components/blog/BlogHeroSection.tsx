import { Badge } from "../ui/Badge";
import { Section } from "../ui/Section";
import { FadeInSection } from "../motion/FadeInSection";

export function BlogHeroSection() {
  return (
    <Section
      id="blog-hero"
      className="relative pt-32 pb-14 sm:pt-40 sm:pb-16 overflow-hidden border-b border-border/40"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-primary-500/10 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[200px] bg-amber-500/8 rounded-full blur-[90px] pointer-events-none -z-10" />

      <FadeInSection>
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Badge variant="primary" size="md">
              Engineering & Growth Insights
            </Badge>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
            From the <span className="gradient-text">Nexora Lab</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-muted-fg leading-relaxed max-w-2xl mx-auto">
            Practical breakdowns on web architecture, Next.js 15, AI generation engines, and real-world conversion case studies — written directly by our engineers.
          </p>

          {/* Quick topics pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              "All Articles",
              "Next.js 15",
              "Conversion Rate",
              "Claude API & AI",
              "Tailwind v4",
              "Architecture",
            ].map((topic, i) => (
              <span
                key={topic}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                  i === 0
                    ? "bg-primary-500/15 border-primary-500/40 text-primary-300 font-medium"
                    : "bg-surface-1/60 border-border text-muted-fg"
                }`}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </FadeInSection>
    </Section>
  );
}
