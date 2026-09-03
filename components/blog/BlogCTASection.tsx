import Link from "next/link";
import { Button } from "../ui/Button";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";

export function BlogCTASection() {
  return (
    <Section id="blog-cta" className="pb-24">
      <FadeInSection>
        <Card
          padding="lg"
          className="relative overflow-hidden border-primary-500/30 bg-gradient-to-br from-surface-1 via-surface-2 to-surface-1 text-center max-w-4xl mx-auto p-8 sm:p-12 shadow-[0_0_50px_rgba(20,184,160,0.1)]"
        >
          {/* Subtle glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary-500/15 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <Badge variant="primary" size="sm">
                Custom Web Solutions
              </Badge>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Have a Project in Mind? Let's Engineer It Together.
            </h2>

            <p className="mt-3 text-sm sm:text-base text-muted-fg max-w-xl mx-auto leading-relaxed">
              Whether you need a high-converting landing page, a multi-tenant SaaS application, or an AI-powered platform — Nexora brings your vision to production.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="primary" asChild>
                <Link href="/#discovery-call">Book a 15-Min Discovery Call →</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/portfolio">Explore Our Portfolio</Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-fg">
              100% Code Ownership • 14-Day Free Post-Launch Warranty • Zero Lock-In
            </p>
          </div>
        </Card>
      </FadeInSection>
    </Section>
  );
}
