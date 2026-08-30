import Link from "next/link";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

const services = [
  { icon: "🌐", title: "Portfolio Website", desc: "A stunning digital portfolio to showcase your work and attract premium clients.", from: "7 days" },
  { icon: "🏢", title: "Business Website", desc: "Full-featured company website with CMS, SEO, and lead capture built in.", from: "14 days" },
  { icon: "🎯", title: "Landing Page", desc: "High-converting landing page optimized for your campaign or product launch.", from: "5 days" },
  { icon: "⚡", title: "SaaS Application", desc: "Full-stack SaaS with auth, billing, dashboards, and multi-tenant architecture.", from: "4 weeks" },
  { icon: "🛒", title: "E-commerce Store", desc: "Custom storefront with product management, cart, checkout, and payment gateway.", from: "3 weeks" },
  { icon: "🤖", title: "AI Website Generation", desc: "Describe your business and our AI generates a complete, deployable website in minutes.", from: "Minutes" },
];

export function ServicesOverviewSection() {
  return (
    <Section className="bg-surface/40" id="services">
      <FadeInSection>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">What We Do</p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">Services</h2>
          </div>
          <Button variant="ghost" asChild className="self-start sm:self-auto">
            <Link href="/services">All services →</Link>
          </Button>
        </div>
      </FadeInSection>

      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {services.map((s) => (
          <Card key={s.title} hover padding="md" className="group">
            <span className="text-2xl sm:text-3xl">{s.icon}</span>
            <h3 className="mt-3 sm:mt-4 font-heading font-semibold text-sm sm:text-base text-foreground">{s.title}</h3>
            <p className="mt-2 text-xs text-muted-fg leading-relaxed">{s.desc}</p>
            <div className="mt-3 sm:mt-4 flex items-center justify-between">
              <span className="text-[10px] text-muted-fg">
                From <span className="text-primary-400 font-medium">{s.from}</span>
              </span>
              <span className="text-xs text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more →
              </span>
            </div>
          </Card>
        ))}
      </StaggerList>
    </Section>
  );
}
