import Link from "next/link";
import Image from "next/image";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

const projects = [
  {
    title: "Tutor Finder",
    category: "Web App & Booking",
    description: "An intuitive tutor finding and session booking platform with real-time slot scheduling, tutor verification, and booking management.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Express.js", "MongoDB"],
    gradient: "from-primary-500/20 via-primary-500/5 to-transparent",
    accent: "primary" as const,
    image: "/images/projects/tutor-finder.png",
  },
  {
    title: "Blood Donation",
    category: "Healthcare & Emergency",
    description: "Emergency blood donor network and request system with geolocation matching, donor eligibility tracking, and instant alerts.",
    tech: ["React", "Node.js", "MongoDB", "Express", "REST API"],
    gradient: "from-red-500/20 via-red-500/5 to-transparent",
    accent: "danger" as const,
    image: "/images/projects/blood-donation.png",
  },
  {
    title: "Coaching Center",
    category: "EdTech & LMS",
    description: "A comprehensive coaching LMS platform featuring student progress tracking, course catalogs, notice boards, and role-based administration.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    accent: "warning" as const,
    image: "/images/projects/coaching-center.jpg",
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

      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Card key={p.title} hover padding="none" className="overflow-hidden group flex flex-col h-full border-border/70 hover:border-primary-500/40 transition-all duration-300">
            {/* Project image area with real thumbnail */}
            <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-900 border-b border-border">
              <Image
                src={p.image}
                alt={`${p.title} thumbnail`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 z-10">
                <Badge variant={p.accent} size="sm">{p.category}</Badge>
              </div>
            </div>
            <div className="p-4 sm:p-5 flex flex-col flex-1">
              <h3 className="font-heading font-semibold text-base sm:text-lg text-foreground group-hover:text-primary-300 transition-colors">
                {p.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-fg leading-relaxed flex-1">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                {p.tech.map((t) => (
                  <span key={t} className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-surface-2 text-neutral-300 border border-border">
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
