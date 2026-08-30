import Link from "next/link";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

const plans = [
  {
    name: "Starter",
    price: "$499",
    desc: "Perfect for freelancers and solo founders who need a professional online presence.",
    features: ["Portfolio or landing page", "Up to 5 pages", "Mobile responsive", "Basic SEO setup", "1 round of revisions", "7-day delivery"],
    cta: "Get Started",
    popular: false,
    variant: "secondary" as const,
  },
  {
    name: "Growth",
    price: "$1,499",
    desc: "For growing businesses that need a full website with CMS, lead capture, and integrations.",
    features: ["Up to 12 pages", "Headless CMS integration", "Contact forms + CRM", "Advanced SEO", "3 rounds of revisions", "Performance guarantee", "14-day delivery"],
    cta: "Most Popular",
    popular: true,
    variant: "primary" as const,
  },
  {
    name: "Scale",
    price: "Custom",
    desc: "Full-stack SaaS apps, e-commerce, or complex platforms with custom architecture.",
    features: ["Full-stack application", "Auth + billing system", "Admin dashboard", "API integrations", "Unlimited revisions", "3-month support"],
    cta: "Request a Quote",
    popular: false,
    variant: "secondary" as const,
  },
];

export function PricingPreviewSection() {
  return (
    <Section id="pricing">
      <FadeInSection>
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">Pricing</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold">Transparent pricing.</h2>
          <p className="mt-4 text-muted-fg max-w-sm mx-auto text-sm">
            No surprise invoices. Fixed-scope packages with clear deliverables.
          </p>
        </div>
      </FadeInSection>

      <StaggerList className="grid md:grid-cols-3 gap-6 items-start">
        {plans.map((p) => (
          <Card
            key={p.name}
            padding="lg"
            className={`relative ${p.popular ? "border-primary-500/50 shadow-[0_0_40px_rgba(20,184,160,0.15)]" : ""}`}
          >
            {p.popular && (
              <div className="absolute -top-3 inset-x-0 flex justify-center">
                <Badge variant="primary" size="sm">Most Popular</Badge>
              </div>
            )}
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-fg">{p.name}</p>
            <p className="mt-2 font-heading text-4xl font-bold text-foreground">{p.price}</p>
            <p className="mt-2 text-xs text-muted-fg leading-relaxed">{p.desc}</p>

            <ul className="mt-6 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-muted-fg">
                  <svg className="h-4 w-4 text-primary-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button variant={p.variant} className="w-full" asChild>
                <Link href="/contact">{p.cta}</Link>
              </Button>
            </div>
          </Card>
        ))}
      </StaggerList>

      <FadeInSection delay={0.2}>
        <p className="text-center mt-8 text-xs text-muted-fg">
          Need something custom?{" "}
          <Link href="/contact" className="text-primary-400 hover:underline">Let&apos;s talk →</Link>
        </p>
      </FadeInSection>
    </Section>
  );
}
