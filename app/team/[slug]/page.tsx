import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import {
  getAllTeamMembers,
  getTeamMemberBySlug,
} from "@/lib/team-data";
import { fetchTeamMemberBySlug } from "@/lib/api-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const members = getAllTeamMembers();
  return members.map((member) => ({
    slug: member.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = (await fetchTeamMemberBySlug(slug)) || getTeamMemberBySlug(slug);

  if (!member) {
    return {
      title: "Team Member Not Found | Nexora Agency",
    };
  }

  return {
    title: `${member.name} — ${member.role} | Nexora Engineering Team`,
    description: `${member.name} (${member.role}) specializes in ${member.skills.join(
      ", "
    )} at Nexora Agency. ${member.tagline}`,
    keywords: [
      member.name,
      member.role,
      member.department,
      "Nexora Agency",
      ...member.skills,
    ],
    openGraph: {
      title: `${member.name} — ${member.role} | Nexora`,
      description: member.tagline,
      type: "profile",
    },
  };
}

export default async function TeamMemberDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const member = (await fetchTeamMemberBySlug(slug)) || getTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const allMembers = getAllTeamMembers();
  const otherMembers = allMembers.filter((m) => m.slug !== member.slug);

  return (
    <>
      <Navbar />

      <main className="flex-1 min-h-screen bg-background text-foreground w-full max-w-full overflow-x-clip">
        {/* Top Hero Header Section */}
        <div className="relative pt-20 sm:pt-28 pb-10 sm:pb-14 border-b border-border/60 bg-surface/30 overflow-hidden w-full">
          {/* Constrained responsive background gradient blur */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 sm:h-80 bg-gradient-to-b ${member.gradient} opacity-20 blur-3xl pointer-events-none`}
          />
          <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

          {/* Standard container matching entire website */}
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            {/* Breadcrumb Navigation */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-fg mb-4 sm:mb-6">
              <Link
                href="/"
                className="hover:text-primary-400 transition-colors flex items-center gap-1"
              >
                <span>Home</span>
              </Link>
              <span>/</span>
              <Link
                href="/#team"
                className="hover:text-primary-400 transition-colors"
              >
                <span>Team</span>
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
                {member.name}
              </span>
            </div>

            {/* Back button */}
            <Link
              href="/#team"
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors group mb-6 sm:mb-8"
            >
              <span className="transition-transform group-hover:-translate-x-1">
                &larr;
              </span>
              <span>Back to All Team Members</span>
            </Link>

            {/* Profile Hero Card */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full min-w-0">
              {/* Avatar Column */}
              <div className="lg:col-span-4 flex flex-col items-center text-center w-full min-w-0">
                <div className="relative group">
                  {/* Glowing background aura */}
                  <div
                    className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-primary-500/30 via-accent-500/20 to-primary-400/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-500"
                  />

                  {/* Avatar Container */}
                  <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-3xl bg-surface border-2 border-primary-500/40 flex items-center justify-center shadow-2xl overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-surface-2/70 flex items-center justify-center text-muted-fg/70 group-hover:text-primary-400 transition-colors duration-300">
                        {/* Anonymous Avatar Silhouette Icon */}
                        <svg
                          className="w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300 group-hover:scale-105"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Active Status Beacon */}
                    <span
                      className="absolute -bottom-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-emerald-500 border-2 sm:border-3 border-surface flex items-center justify-center"
                      title="Active & Available"
                    >
                      <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white animate-pulse" />
                    </span>
                  </div>
                </div>

                {/* Live Availability Status */}
                <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/90 border border-emerald-500/30 text-[11px] text-emerald-400 font-mono text-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
                  <span>Available for Architectural Review</span>
                </div>
              </div>

              {/* Bio & Headlines Column */}
              <div className="lg:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left w-full min-w-0">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
                  <Badge variant={member.roleBadgeVariant} size="md">
                    {member.role}
                  </Badge>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-surface-2 border border-border text-muted-fg">
                    {member.department}
                  </span>
                </div>

                <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground break-words">
                  {member.name}
                </h1>

                <p className="mt-2 text-xs sm:text-base font-medium text-primary-400">
                  {member.institute} • {member.location}
                </p>

                <p className="mt-4 text-sm sm:text-base text-muted-fg max-w-2xl leading-relaxed break-words">
                  {member.tagline}
                </p>

                {/* Quick Action CTA Row */}
                <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 w-full">
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full sm:w-auto shadow-lg shadow-primary-500/20"
                    >
                      Consult With {member.name.split(" ")[0]}
                    </Button>
                  </Link>

                  {/* Social links */}
                  {member.socialLinks.github && (
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-surface border border-border text-xs text-muted-fg hover:text-primary-400 hover:border-primary-500/40 transition-colors flex items-center gap-1.5"
                    >
                      <svg
                        className="w-4 h-4 fill-current flex-shrink-0"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                  )}

                  {member.socialLinks.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-surface border border-border text-xs text-muted-fg hover:text-primary-400 hover:border-primary-500/40 transition-colors flex items-center gap-1.5"
                    >
                      <svg
                        className="w-4 h-4 fill-current flex-shrink-0"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {member.socialLinks.portfolio && (
                    <a
                      href={member.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-surface border border-border text-xs text-muted-fg hover:text-primary-400 hover:border-primary-500/40 transition-colors flex items-center gap-1.5"
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      <span>Portfolio</span>
                    </a>
                  )}

                  <a
                    href={`mailto:${member.socialLinks.email}`}
                    className="px-3 py-2 rounded-xl bg-surface border border-border text-xs text-muted-fg hover:text-primary-400 hover:border-primary-500/40 transition-colors flex items-center gap-1.5"
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-8 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full min-w-0">
              {member.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 sm:p-4 rounded-2xl bg-surface/60 border border-border/80 backdrop-blur-sm flex flex-col items-center justify-center text-center min-w-0 overflow-hidden"
                >
                  <span className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-foreground gradient-text truncate max-w-full">
                    {stat.value}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-fg mt-1 font-medium leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* In-Depth Profile Content Section */}
        <Section className="py-10 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 w-full min-w-0">
            {/* Left Main Column (8 Cols) */}
            <div className="lg:col-span-8 space-y-8 sm:space-y-10 w-full min-w-0">
              {/* Detailed Background & Professional Narrative */}
              <Card padding="lg" className="border-border/80 bg-surface/50 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-2 w-2 rounded-full bg-primary-400 flex-shrink-0" />
                  <h2 className="font-heading font-bold text-lg sm:text-2xl text-foreground break-words">
                    Engineering Background & Focus
                  </h2>
                </div>

                <div className="space-y-4 text-sm sm:text-base text-muted-fg leading-relaxed break-words">
                  {member.fullBio.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Philosophy Quote */}
                <div className="mt-6 pt-6 border-t border-border/70 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-400 mb-2 font-mono">
                    Professional Philosophy
                  </p>
                  <blockquote className="font-heading text-sm sm:text-base italic text-neutral-200 border-l-3 border-primary-500 pl-4 py-1 break-words">
                    &ldquo;{member.philosophy}&rdquo;
                  </blockquote>
                </div>
              </Card>

              {/* Core Domain Expertise (Deep Breakdown) */}
              <div className="w-full min-w-0">
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-accent-400 flex-shrink-0" />
                    <h2 className="font-heading font-bold text-lg sm:text-2xl text-foreground break-words">
                      Core Domain Expertise & Specializations
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-fg">
                    A rigorous breakdown of technical areas where {member.name.split(" ")[0]} engineers production solutions.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 w-full min-w-0">
                  {member.coreExpertise.map((expertise) => (
                    <Card
                      key={expertise.title}
                      hover
                      padding="md"
                      className="border-border/80 bg-surface/50 flex flex-col justify-between min-w-0 overflow-hidden"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-500/15 text-primary-300 border border-primary-500/20">
                            {expertise.badge}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-base text-foreground mb-2 break-words">
                          {expertise.title}
                        </h3>

                        <p className="text-xs text-muted-fg leading-relaxed break-words">
                          {expertise.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap gap-1">
                        {expertise.highlightSkills.map((hSkill) => (
                          <span
                            key={hSkill}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-muted-fg border border-border"
                          >
                            {hSkill}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Featured Key Projects & Architectural Contributions */}
              <div className="w-full min-w-0">
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    <h2 className="font-heading font-bold text-lg sm:text-2xl text-foreground break-words">
                      Key Architectural Milestones & Deliverables
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-fg">
                    Proven platforms, infrastructure, and audit projects delivered with verified outcomes.
                  </p>
                </div>

                <div className="space-y-4 w-full min-w-0">
                  {member.featuredProjects.map((proj) => (
                    <Card
                      key={proj.title}
                      hover
                      padding="md"
                      className="border-border/80 bg-surface/50 min-w-0 overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2 min-w-0">
                        <h3 className="font-heading font-bold text-base sm:text-lg text-foreground break-words">
                          {proj.title}
                        </h3>
                        <span className="text-xs font-semibold text-primary-400 font-mono flex-shrink-0">
                          {proj.role}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-fg leading-relaxed break-words">
                        {proj.description}
                      </p>

                      <div className="mt-3 p-2.5 rounded-xl bg-surface-2/60 border border-border/60 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 min-w-0">
                        <span className="text-xs font-bold text-emerald-400 font-mono flex-shrink-0">
                          Outcome:
                        </span>
                        <span className="text-xs text-muted-fg break-words">
                          {proj.metrics}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {proj.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface text-muted-fg border border-border"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar Column (4 Cols) */}
            <div className="lg:col-span-4 space-y-6 w-full min-w-0">
              {/* Direct Booking / Consultation Box */}
              <Card
                padding="lg"
                className="border-primary-500/40 bg-gradient-to-br from-surface via-surface/90 to-surface-2 shadow-xl shadow-primary-500/5 relative overflow-hidden min-w-0"
              >
                <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-primary-500 to-accent-500" />

                <h3 className="font-heading font-bold text-lg text-foreground mb-1 break-words">
                  Collaborate Directly
                </h3>
                <p className="text-xs text-muted-fg leading-relaxed mb-4 break-words">
                  Need {member.name.split(" ")[0]}&apos;s specialized expertise on your web application architecture, security audit, or design sprint?
                </p>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-xs text-muted-fg">
                    <svg
                      className="w-4 h-4 text-primary-400 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Direct engineering consultation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-fg">
                    <svg
                      className="w-4 h-4 text-primary-400 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Tailored sprint & project quote</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-fg">
                    <svg
                      className="w-4 h-4 text-primary-400 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Zero detached middle managers</span>
                  </div>
                </div>

                <Link href="/contact" className="block w-full">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                  >
                    Start a Project
                  </Button>
                </Link>
              </Card>

              {/* Technical Arsenal / Categorized Skills Matrix */}
              <Card padding="md" className="border-border/80 bg-surface/50 min-w-0 overflow-hidden">
                <h3 className="font-heading font-bold text-base text-foreground mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                  <span>Technical Arsenal</span>
                </h3>

                <div className="space-y-4 min-w-0">
                  {member.categorizedSkills.map((cat) => (
                    <div key={cat.category} className="min-w-0">
                      <p className="text-[11px] font-semibold text-primary-300 mb-1.5 font-mono">
                        {cat.category}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-surface-2 text-muted-fg border border-border/80"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Education & Credentials */}
              <Card padding="md" className="border-border/80 bg-surface/50 min-w-0 overflow-hidden">
                <h3 className="font-heading font-bold text-base text-foreground mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span>Academic & Credentials</span>
                </h3>

                <div className="space-y-3.5 min-w-0">
                  {member.credentials.map((cred) => (
                    <div
                      key={cred.degree}
                      className="p-3 rounded-xl bg-surface-2/60 border border-border/60 min-w-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-foreground break-words">
                          {cred.degree}
                        </span>
                        <span className="text-[10px] font-mono text-primary-400 flex-shrink-0">
                          {cred.period}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-muted-fg">
                        {cred.institution}
                      </p>
                      <p className="text-[10px] text-muted-fg/80 mt-1 leading-relaxed break-words">
                        {cred.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Teammates Navigator */}
              <Card padding="md" className="border-border/80 bg-surface/50 min-w-0 overflow-hidden">
                <h3 className="font-heading font-bold text-base text-foreground mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                  <span>Meet Other Teammates</span>
                </h3>

                <div className="space-y-2 min-w-0">
                  {otherMembers.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/team/${other.slug}`}
                      className="p-2.5 rounded-xl bg-surface-2/50 hover:bg-surface-2 border border-border/60 hover:border-primary-500/40 transition-all flex items-center gap-3 group min-w-0"
                    >
                      <div className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center text-muted-fg group-hover:text-primary-400 transition-colors flex-shrink-0">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="text-xs font-bold text-foreground truncate group-hover:text-primary-400 transition-colors">
                          {other.name}
                        </p>
                        <p className="text-[10px] text-muted-fg truncate">
                          {other.shortRole}
                        </p>
                      </div>

                      <span className="text-muted-fg group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all text-xs flex-shrink-0">
                        &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* Bottom Conversion Section */}
        <Section className="py-12 sm:py-16 border-t border-border/60 bg-gradient-to-b from-surface/30 to-surface/80">
          <div className="text-center max-w-2xl mx-auto px-4">
            <Badge variant="primary" size="sm" className="mb-3">
              Full Engineering Team
            </Badge>
            <h2 className="font-heading text-xl sm:text-3xl font-bold tracking-tight text-foreground break-words">
              Ready to Build With Our CST Engineering Core?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-fg leading-relaxed">
              Whether you need high-performance Next.js full-stack development, modern Figma UI/UX design systems, or rigorous penetration testing, our team delivers with zero overhead.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Schedule a Discovery Call
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  View Pricing & Sprints
                </Button>
              </Link>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
