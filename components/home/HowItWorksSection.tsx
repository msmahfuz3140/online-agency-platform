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
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">The Process</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold">How it works</h2>
          <p className="mt-4 text-muted-fg max-w-md mx-auto text-sm">
            No black boxes. No ghost mode. A clear 4-step process that keeps you in the loop.
          </p>
        </div>
      </FadeInSection>

      <StaggerList className="grid md:grid-cols-4 gap-6 relative">
        {steps.map((s, i) => (
          <div key={s.step} className="relative flex flex-col">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-[calc(50%+28px)] right-[-calc(50%-28px)] h-px bg-border z-0" />
            )}
            <div className="relative z-10 flex flex-col h-full bg-surface border border-border rounded-2xl p-6 hover:border-primary-500/40 transition-all duration-300">
              <span className="text-3xl mb-4">{s.icon}</span>
              <span className="font-mono text-xs text-primary-400 mb-2">{s.step}</span>
              <h3 className="font-heading font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-xs text-muted-fg leading-relaxed flex-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </StaggerList>
    </Section>
  );
}
