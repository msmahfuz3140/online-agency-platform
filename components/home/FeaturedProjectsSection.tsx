import Link from "next/link";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

const projects = [
  {
    title: "Finflow",
    category: "SaaS Dashboard",
    description: "A multi-tenant SaaS finance dashboard with real-time analytics, team roles, and Stripe integration.",
    tech: ["Next.js", "Prisma", "Stripe", "Recharts"],
    gradient: "from-primary-500/20 via-primary-500/5 to-transparent",
    accent: "primary" as const,
  },
  {
    title: "Bloom Co.",
    category: "E-commerce Store",
    description: "A full-stack e-commerce store for a plant nursery — custom CMS, cart, and Razorpay checkout.",
    tech: ["Next.js", "MongoDB", "Cloudinary", "Razorpay"],
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    accent: "success" as const,
  },
  {
    title: "Radius Studio",
    category: "Portfolio Website",
    description: "A motion-rich portfolio for a design studio — GSAP animations, CMS-backed project pages.",
    tech: ["Next.js", "Sanity", "GSAP", "Framer Motion"],
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    accent: "default" as const,
  },
];

export function FeaturedProjectsSection() {
  return (
    <Section id="portfolio-preview">
      {/* Centered, balanced header across all screen sizes */}
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">Our Work</p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-xl mx-auto leading-relaxed">
            A selection of recent websites, web apps, and platforms crafted for ambitious businesses.
          </p>
        </div>
      </FadeInSection>

      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => (
          <Card key={p.title} hover padding="none" className="overflow-hidden group">
            {/* Project image area */}
            <div className={`h-44 sm:h-48 bg-gradient-to-br ${p.gradient} border-b border-border flex items-center justify-center relative`}>
              <div className="absolute inset-0 flex items-end p-4">
                <Badge variant={p.accent} size="sm">{p.category}</Badge>
              </div>
              <span className="font-heading text-5xl font-bold text-white/10 group-hover:text-white/20 transition-colors select-none">
                {p.title[0]}
              </span>
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="font-heading font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-xs text-muted-fg leading-relaxed">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-surface-2 text-muted-fg border border-border">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </StaggerList>

      {/* Centered CTA button at bottom */}
      <FadeInSection delay={0.2}>
        <div className="mt-10 sm:mt-12 text-center">
          <Button variant="ghost" asChild>
            <Link href="/portfolio">View all projects & case studies →</Link>
          </Button>
        </div>
      </FadeInSection>
    </Section>
  );
}
