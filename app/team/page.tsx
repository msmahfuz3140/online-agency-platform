import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getAllTeamMembers } from "@/lib/team-data";
import { fetchTeamMembers } from "@/lib/api-client";

export const metadata: Metadata = {
  title: "Engineering Team & Founders — Leadership Core | Nexora Agency",
  description:
    "Meet the CST leadership team behind Nexora: full-stack systems architects, UI/UX design specialists, cyber security engineers, and offensive security auditors from Mymensingh Polytechnic Institute.",
};

export default async function TeamPage() {
  const fallbackMembers = getAllTeamMembers();
  const apiMembers = await fetchTeamMembers();
  const members = apiMembers && apiMembers.length > 0 ? apiMembers : fallbackMembers;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-white/[0.06]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

          <Section className="relative z-10 text-center">
            {/* Breadcrumb */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-muted-fg mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-primary-400">Engineering Team</span>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-3">
              CST Core Leadership
            </p>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
              The Engineering Minds Behind <span className="gradient-text">Nexora</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-fg max-w-2xl mx-auto leading-relaxed">
              A specialized full-stack engineering team rooted in Computer Science & Technology (CST) at Mymensingh Polytechnic Institute. Delivering high-throughput Next.js systems, luxury UI/UX, and zero-trust security.
            </p>

            {/* Quick Metrics */}
            <div className="mt-10 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-surface-1/60 border border-white/[0.06] backdrop-blur-md">
                <p className="font-heading text-2xl font-bold text-primary-400">100/100</p>
                <p className="text-xs text-muted-fg mt-1">Core Web Vitals</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-1/60 border border-white/[0.06] backdrop-blur-md">
                <p className="font-heading text-2xl font-bold text-amber-400">&lt; 100ms</p>
                <p className="text-xs text-muted-fg mt-1">API Response Latency</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-1/60 border border-white/[0.06] backdrop-blur-md">
                <p className="font-heading text-2xl font-bold text-cyan-400">0</p>
                <p className="text-xs text-muted-fg mt-1">Breach Record</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-1/60 border border-white/[0.06] backdrop-blur-md">
                <p className="font-heading text-2xl font-bold text-emerald-400">100%</p>
                <p className="text-xs text-muted-fg mt-1">Code Ownership</p>
              </div>
            </div>
          </Section>
        </div>

        {/* Team Grid */}
        <Section className="py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {members.map((member) => {
              const isFounder = member.slug === "md-mahfuzul-haque";

              return (
                <Card
                  key={member.slug}
                  padding="none"
                  className="relative overflow-hidden group border border-white/[0.08] hover:border-primary-500/40 transition-all duration-300 bg-surface-1/80 backdrop-blur-sm"
                >
                  <div className={`p-6 sm:p-8 bg-gradient-to-br ${member.gradient} to-transparent`}>
                    {/* Top Row: Avatar & Badges */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="relative h-16 w-16 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center font-heading font-black text-white text-xl shadow-xl group-hover:scale-105 transition-transform">
                        {member.initials}
                        {isFounder && (
                          <span
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-amber-400 text-black border-2 border-background flex items-center justify-center text-xs font-bold shadow-lg"
                            title="Founder & Lead Systems Architect"
                          >
                            👑
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <Badge variant={member.roleBadgeVariant || "primary"} size="sm">
                          {member.shortRole || member.role}
                        </Badge>
                        <span className="text-[10px] font-mono text-muted-fg">
                          CST Division
                        </span>
                      </div>
                    </div>

                    {/* Name & Title */}
                    <div className="mt-5">
                      <h3 className="font-heading text-2xl font-bold text-foreground group-hover:text-primary-300 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs text-primary-400 font-medium mt-0.5">
                        {member.role}
                      </p>
                      <p className="text-xs text-muted-fg font-mono mt-0.5">
                        📍 {member.location} • {member.institute}
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3">
                      {member.bio || member.tagline}
                    </p>

                    {/* Skills pills */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {member.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-white/[0.05] border border-white/[0.08] text-neutral-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 5 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.02] text-neutral-500">
                          +{member.skills.length - 5} more
                        </span>
                      )}
                    </div>

                    {/* Stats Grid */}
                    {member.stats && member.stats.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                        {member.stats.map((s) => (
                          <div key={s.label} className="p-2 rounded-xl bg-white/[0.03]">
                            <p className="text-sm font-bold font-heading text-white">{s.value}</p>
                            <p className="text-[9px] text-muted-fg truncate mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bottom Link Action */}
                    <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <Link
                        href={`/team/${member.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors group-hover:translate-x-1 transition-transform"
                      >
                        <span>View Full Profile & Case Studies</span>
                        <span>→</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        {member.socialLinks?.github && (
                          <a
                            href={member.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-muted-fg hover:text-white hover:bg-white/[0.08] transition-colors"
                            title="GitHub"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                          </a>
                        )}
                        {member.socialLinks?.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-muted-fg hover:text-white hover:bg-white/[0.08] transition-colors"
                            title="LinkedIn"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-primary-500/15 via-surface-2 to-amber-500/10 border border-primary-500/30 text-center relative overflow-hidden shadow-2xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
              Ready to collaborate with our engineering team?
            </h2>
            <p className="mt-2 text-sm text-muted-fg max-w-xl mx-auto">
              Get direct architectural feedback from MD Mahfuzul Haque and the CST core. No junior handoffs, no middle managers.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Button size="md" variant="primary" asChild>
                <Link href="/request-project">Request a Project →</Link>
              </Button>
              <Button size="md" variant="secondary" asChild>
                <Link href="/contact">Schedule Architecture Call</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
      <FloatingAiAssistant />
    </div>
  );
}
