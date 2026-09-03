import Link from "next/link";
import { Section } from "../ui/Section";
import { FadeInSection } from "../motion/FadeInSection";
import { Button } from "../ui/Button";

export function PortfolioCTASection() {
  return (
    <Section id="portfolio-cta" className="pb-24">
      <FadeInSection>
        <div className="relative rounded-2xl overflow-hidden border border-primary-500/20 bg-gradient-to-br from-primary-500/10 via-neutral-900 to-amber-500/10 p-8 sm:p-12 lg:p-16 text-center">
          {/* Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent"
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-3">
            Start a Project
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Ready to Build Your{" "}
            <span className="gradient-text">Next Digital Product?</span>
          </h2>
          <p className="mt-4 text-base text-muted-fg max-w-xl mx-auto leading-relaxed">
            Whether you need a portfolio, SaaS app, e-commerce store, or AI-powered solution — we engineer it precisely for your goals.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/#book-call">Book a Free Discovery Call</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/case-studies">Read Case Studies →</Link>
            </Button>
          </div>
        </div>
      </FadeInSection>
    </Section>
  );
}
