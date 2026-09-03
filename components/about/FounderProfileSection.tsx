"use client";

import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

interface TeamLeadership {
  name: string;
  role: string;
  department: string;
  bio: string;
  skills: string[];
  initials: string;
  badgeVariant: "primary" | "warning" | "success" | "default";
}

const leadershipTeam: TeamLeadership[] = [
  {
    name: "Jahidul Islam",
    role: "Co-Founder & Head of UI/UX Design",
    department: "Computer Science & Technology (CST)",
    bio: "Obsessed with design systems, human-centered interaction, accessibility, and high-conversion wireframing.",
    skills: ["Figma Systems", "Interaction Design", "UX Research", "Brand Identity"],
    initials: "JI",
    badgeVariant: "warning",
  },
  {
    name: "Saif Khan",
    role: "Co-Founder & Cyber Security Lead",
    department: "Computer Science & Technology (CST)",
    bio: "Architecting zero-trust infrastructure, app hardening, penetration testing, and defense-in-depth protocols.",
    skills: ["Infrastructure Hardening", "Penetration Testing", "Threat Modeling", "DevSecOps"],
    initials: "SK",
    badgeVariant: "success",
  },
  {
    name: "Koushik Kumar",
    role: "Lead Security Auditor & Ethical Hacker",
    department: "Computer Science & Technology (CST)",
    bio: "Proactively uncovering zero-day vulnerabilities, OWASP compliance auditing, and ensuring watertight client APIs.",
    skills: ["Ethical Hacking", "Vulnerability Auditing", "OWASP Top 10", "Network Forensics"],
    initials: "KK",
    badgeVariant: "default",
  },
];

export function FounderProfileSection() {
  return (
    <Section id="leadership" className="relative py-20 lg:py-28">
      {/* Section Header */}
      <FadeInSection>
        <div className="max-w-3xl mb-14 sm:mb-18">
          <Badge variant="primary" size="sm" className="mb-3">
            Leadership & Vision
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Meet the Founder & <span className="gradient-text">Engineering Core</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-fg leading-relaxed">
            Nexora is led by builders who write code every single day. No detached project managers
            or bloated bureaucracy—just direct engineering collaboration with craftsmen who care.
          </p>
        </div>
      </FadeInSection>

      {/* Primary Founder Spotlight: MD Mahfuzul Haque */}
      <FadeInSection from="bottom">
        <Card
          hover
          padding="none"
          className="relative overflow-hidden border-primary-500/40 bg-gradient-to-br from-surface via-surface/90 to-surface-2 shadow-[0_16px_48px_rgba(20,184,160,0.08)] mb-14"
        >
          {/* Top ambient glow bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary-500 via-primary-400 to-amber-500" />

          <div className="p-6 sm:p-8 lg:p-12 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Founder Avatar & Quick Bio Column */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary-500 to-amber-500 opacity-40 blur-lg group-hover:opacity-75 transition duration-500" />
                <div className="relative h-32 w-32 sm:h-36 sm:w-36 rounded-2xl bg-neutral-900 border-2 border-primary-500/40 flex items-center justify-center shadow-xl">
                  <span className="font-heading font-black text-4xl sm:text-5xl text-foreground">
                    MH
                  </span>
                  <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-3 border-neutral-900 flex items-center justify-center" title="Active & Building">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  </span>
                </div>
              </div>

              <h3 className="mt-5 font-heading font-bold text-2xl text-foreground">
                MD Mahfuzul Haque
              </h3>
              <p className="text-sm font-semibold text-primary-400 mt-1">
                Founder & Principal Systems Architect
              </p>

              {/* Institution badge */}
              <div className="mt-3 px-3 py-1 rounded-full bg-surface-2 border border-border/80 text-[11px] text-muted-fg font-mono">
                CST • Mymensingh Polytechnic Institute
              </div>

              {/* Social / Connect links */}
              <div className="mt-5 flex items-center gap-2">
                {["GitHub", "LinkedIn", "Twitter / X"].map((platform) => (
                  <span
                    key={platform}
                    className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-muted-fg hover:text-primary-400 transition-colors cursor-pointer"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            {/* Founder Detailed Narrative & Philosophy Column */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <Badge variant="primary" size="sm" className="mb-4">
                  Founder&apos;s Philosophy
                </Badge>
                <blockquote className="font-heading text-lg sm:text-xl font-medium text-neutral-200 leading-snug italic border-l-2 border-primary-500 pl-4 py-1">
                  &ldquo;A website is not an ornament—it is a business engine. If it takes 5 seconds to load,
                  it is failing. If it breaks under load, it is failing. Our mission at Nexora is to deliver
                  absolute engineering purity, blazing speed, and AI leverage without ever cutting corners.&rdquo;
                </blockquote>

                <p className="mt-5 text-sm sm:text-base text-muted-fg leading-relaxed">
                  As the architect behind Nexora&apos;s core engine, Mahfuzul leads the integration of modern
                  full-stack systems (Next.js 15, Node.js, Express, MongoDB) with Claude-powered deterministic
                  AI pipelines. With deep grounding in computer science fundamentals from Mymensingh Polytechnic
                  Institute, he enforces rigorous code quality, zero-latency edge delivery, and modular design token standards.
                </p>

                {/* Core Competencies Grid */}
                <div className="mt-6 pt-6 border-t border-border/60">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-fg mb-3">
                    Architectural Specializations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Full-Stack Next.js 15+",
                      "TypeScript Engineering",
                      "AI JSON Schema Pipelines",
                      "Distributed REST APIs",
                      "MongoDB & Mongoose Optimization",
                      "Performance & CWV 100/100",
                    ].map((spec) => (
                      <span
                        key={spec}
                        className="text-xs font-mono px-2.5 py-1 rounded-md bg-surface-2 text-primary-300 border border-primary-500/20"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </FadeInSection>

      {/* Core Leadership Team Grid */}
      <div>
        <FadeInSection>
          <div className="mb-8">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              The Leadership & Domain Specialists
            </h3>
            <p className="text-sm text-muted-fg mt-1">
              Every client project is overseen directly by specialized CST engineers.
            </p>
          </div>
        </FadeInSection>

        <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leadershipTeam.map((member) => (
            <Card key={member.name} hover padding="lg" className="bg-surface/50 border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center font-heading font-bold text-base text-foreground">
                    {member.initials}
                  </div>
                  <Badge variant={member.badgeVariant} size="sm">
                    {member.role.split("&")[0].trim()}
                  </Badge>
                </div>

                <h4 className="font-heading font-bold text-lg text-foreground">
                  {member.name}
                </h4>
                <p className="text-xs text-primary-400 font-medium mt-0.5">
                  {member.role}
                </p>
                <p className="text-[11px] text-muted-fg font-mono mt-1">
                  {member.department}
                </p>

                <p className="mt-3 text-xs text-muted-fg leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap gap-1.5">
                {member.skills.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-muted-fg border border-border"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </StaggerList>
      </div>
    </Section>
  );
}
