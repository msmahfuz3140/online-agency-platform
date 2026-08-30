import { Section } from "../ui/Section";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

const steps = [
  {
    step: "01",
    title: "Discovery Call",
    desc: "We start with a 30-minute call to understand your business, goals, and what success looks like for your project.",
    icon: "📞",
  },
  {
    step: "02",
    title: "Proposal & Scope",
    desc: "You receive a detailed written proposal with scope, timeline, pricing, and a design direction — within 48 hours.",
    icon: "📄",
  },
  {
    step: "03",
    title: "Design & Build",
    desc: "We design in Figma first, get your sign-off, then build in code. You see real progress every 3–5 days.",
    icon: "⚙️",
  },
  {
    step: "04",
    title: "Review & Launch",
    desc: "A round of revisions, final QA, performance audit, then we hand off or deploy — and stay on call for 14 days.",
    icon: "🚀",
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works">
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">The Process</p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">How it works</h2>
          <p className="mt-3 sm:mt-4 text-sm text-muted-fg max-w-md mx-auto">
            No black boxes. No ghost mode. A clear 4-step process that keeps you in the loop.
          </p>
        </div>
      </FadeInSection>

      {/* Mobile: vertical timeline | Desktop: horizontal grid */}
      <StaggerList className="relative">
        {/* Desktop horizontal connector */}
        <div className="hidden lg:block absolute top-[2.5rem] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px bg-border z-0" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {steps.map((s, i) => (
            <div key={s.step} className="relative flex sm:flex-col">
              {/* Mobile vertical connector */}
              {i < steps.length - 1 && (
                <div className="sm:hidden absolute left-[2rem] top-[4.5rem] bottom-[-1rem] w-px bg-border z-0" />
              )}

              <div className="relative z-10 flex sm:flex-col gap-4 sm:gap-0 h-full bg-surface border border-border rounded-2xl p-5 hover:border-primary-500/40 transition-all duration-300">
                {/* Icon circle for mobile timeline */}
                <div className="flex-shrink-0 sm:flex-shrink h-10 w-10 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center sm:mb-3">
                  <span className="text-lg">{s.icon}</span>
                </div>
                <div>
                  <span className="font-mono text-xs text-primary-400 mb-1 block">{s.step}</span>
                  <h3 className="font-heading font-semibold text-sm sm:text-base text-foreground mb-1.5">{s.title}</h3>
                  <p className="text-xs text-muted-fg leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </StaggerList>
    </Section>
  );
}
