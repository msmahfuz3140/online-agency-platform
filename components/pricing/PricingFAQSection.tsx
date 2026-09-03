import Link from "next/link";
import { Section } from "../ui/Section";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

const faqs = [
  {
    q: "Are Pro and Business available right now?",
    a: "Pro and Business tiers are currently in development and will be available soon. The Free tier and AI website generation engine are live now. Join the waitlist to be notified on launch.",
  },
  {
    q: "What does 'Coming Soon' mean for Pro/Business?",
    a: "These tiers are fully designed and planned — no checkout or payment is linked. You can explore the features listed, but purchasing is not yet possible. We'll announce availability via our newsletter.",
  },
  {
    q: "What's included in the Free tier today?",
    a: "The Free tier gives you 5 AI website generations, access to 3 starter templates, a live preview, and HTML export. No credit card required.",
  },
  {
    q: "Will my Free account transfer to a paid plan?",
    a: "Yes. When Pro/Business launches, your existing account and any generated websites will be preserved. You'll be able to upgrade without losing your work.",
  },
  {
    q: "Do you offer custom quotes for agencies?",
    a: "Absolutely. For agencies, white-label partnerships, or large-scale builds outside our standard tiers, get in touch via our contact page and we'll put together a tailored proposal.",
  },
];

export function PricingFAQSection() {
  return (
    <Section id="pricing-faq" className="py-20 lg:py-28">
      <FadeInSection>
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
            Pricing FAQ
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold">
            Common Questions About <span className="gradient-text">Our Plans</span>
          </h2>
        </div>
      </FadeInSection>

      <StaggerList className="max-w-2xl mx-auto space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="p-5 rounded-xl border border-border bg-surface-1 hover:border-primary-500/30 transition-colors"
          >
            <p className="text-sm font-semibold text-foreground mb-2">{faq.q}</p>
            <p className="text-xs text-muted-fg leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </StaggerList>

      <FadeInSection delay={0.2}>
        <p className="text-center mt-8 text-xs text-muted-fg">
          Still have questions?{" "}
          <Link href="/contact" className="text-primary-400 hover:underline">
            Send us a message →
          </Link>
        </p>
      </FadeInSection>
    </Section>
  );
}
