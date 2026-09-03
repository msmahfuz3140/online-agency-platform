import Link from "next/link";
import { Section } from "../ui/Section";
import { FadeInSection } from "../motion/FadeInSection";
import { Button } from "../ui/Button";

export function CaseStudiesCTASection() {
  return (
    <Section id="case-studies-cta" className="pb-24">
      <FadeInSection>
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-neutral-900 to-primary-500/10 p-8 sm:p-12 lg:p-16 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent"
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
            Your Story Next
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Let&apos;s Build a{" "}
            <span className="gradient-text">Case Study-Worthy</span>
            <br className="hidden sm:block" /> Project Together
          </h2>
          <p className="mt-4 text-base text-muted-fg max-w-xl mx-auto leading-relaxed">
            Every project in our case study archive started with a single conversation. Tell us your problem
            — we&apos;ll engineer the outcome.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/#book-call">Book a Free Discovery Call</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/portfolio">View All Projects →</Link>
            </Button>
          </div>
        </div>
      </FadeInSection>
    </Section>
  );
}
