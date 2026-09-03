import { Badge } from "../ui/Badge";
import { Section } from "../ui/Section";
import { FadeInSection } from "../motion/FadeInSection";

const trustPillars = [
  { icon: "⚡", label: "Sub-2h Response SLA", desc: "Fast engineering reply" },
  { icon: "🔒", label: "NDA Guaranteed", desc: "Complete IP protection" },
  { icon: "💎", label: "100% Code Ownership", desc: "Zero vendor lock-in" },
  { icon: "👨‍💻", label: "Senior Developers Only", desc: "No sales middlemen" },
];

export function ContactHeroSection() {
  return (
    <Section
      id="contact-hero"
      className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 overflow-hidden border-b border-border/40"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[200px] bg-amber-500/8 rounded-full blur-[100px] pointer-events-none -z-10" />

      <FadeInSection>
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Badge variant="primary" size="md">
              Direct Engineering Line
            </Badge>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
            Let's Engineer Something <span className="gradient-text">Exceptional</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted-fg leading-relaxed max-w-2xl mx-auto">
            Ready to turn your vision into high-performance software? Fill out the brief below or contact our engineering desk directly. We analyze your requirements and get back to you within hours.
          </p>

          {/* Quick trust pillars ticker */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {trustPillars.map((tp) => (
              <div
                key={tp.label}
                className="p-3.5 rounded-xl border border-border/80 bg-surface-1/60 backdrop-blur-sm text-left flex flex-col justify-center shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{tp.icon}</span>
                  <span className="text-xs font-bold text-foreground truncate">{tp.label}</span>
                </div>
                <span className="text-[11px] text-muted-fg leading-tight">{tp.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeInSection>
    </Section>
  );
}
