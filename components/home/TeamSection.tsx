"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";
import { teamMembersData, type TeamMemberDetails } from "@/lib/team-data";
import { fetchTeamMembers } from "@/lib/api-client";

export function TeamSection({ initialMembers }: { initialMembers?: TeamMemberDetails[] }) {
  const [members, setMembers] = useState<TeamMemberDetails[]>(initialMembers || teamMembersData);

  useEffect(() => {
    fetchTeamMembers().then((data) => {
      if (data && data.length > 0) {
        setMembers(data);
      }
    });
  }, []);

  return (
    <Section id="team">
      {/* Centered Section Header */}
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
            Meet Our Experts
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            The Minds Behind <span className="gradient-text">Nexora</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-xl mx-auto leading-relaxed">
            A specialized engineering team from Mymensingh Polytechnic Institute (CST) building cutting-edge web products, sleek UI/UX, and hardened cyber security.
          </p>
        </div>
      </FadeInSection>

      {/* Team Cards Grid */}
      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {members.map((member) => (
          <Card
            key={member.slug}
            hover
            padding="none"
            className="overflow-hidden flex flex-col group h-full border-border/80 hover:border-primary-500/50 transition-all duration-300"
          >
            {/* Avatar / Profile Header Area */}
            <Link
              href={`/team/${member.slug}`}
              className={`relative h-44 sm:h-48 bg-gradient-to-br ${member.gradient} border-b border-border flex flex-col items-center justify-center p-4 cursor-pointer`}
            >
              {/* Decorative background glow */}
              <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

              {/* Anonymous Avatar / Profile Image */}
              <div className="relative h-20 w-20 rounded-2xl bg-surface border-2 border-primary-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-primary-500/70 transition-all duration-300 overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-surface-2/60 flex items-center justify-center text-muted-fg/70 group-hover:text-primary-400 transition-colors duration-300">
                    <svg
                      className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
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
                {/* Status indicator badge */}
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-surface flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </div>

              {/* Role Badge floating below avatar */}
              <div className="mt-3">
                <Badge variant={member.roleBadgeVariant} size="sm">
                  {member.shortRole}
                </Badge>
              </div>
            </Link>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <Link
                  href={`/team/${member.slug}`}
                  className="block group-hover:text-primary-400 transition-colors"
                >
                  <h3 className="font-heading font-bold text-base sm:text-lg text-foreground text-center group-hover:text-primary-400 transition-colors">
                    {member.name}
                  </h3>
                </Link>

                {/* Academic Institute Info */}
                <div className="mt-2.5 p-2 rounded-xl bg-surface-2/60 border border-border/70 text-center">
                  <p className="text-[11px] font-semibold text-primary-400">
                    {member.department}
                  </p>
                  <p className="text-[10px] text-muted-fg mt-0.5">
                    {member.institute}
                  </p>
                </div>

                {/* Bio */}
                <p className="mt-3 text-xs text-muted-fg leading-relaxed text-center">
                  {member.bio}
                </p>

                {/* Skills Tags */}
                <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap gap-1.5 justify-center">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-surface-2 text-muted-fg border border-border font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive View Details Action Button */}
              <div className="mt-5 pt-3 border-t border-border/60">
                <Link
                  href={`/team/${member.slug}`}
                  className="w-full py-2 px-3 rounded-xl bg-surface-2/70 hover:bg-primary-500/15 text-primary-300 hover:text-primary-200 border border-border/70 hover:border-primary-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 group/btn"
                >
                  <span>View Details & Expertise</span>
                  <span className="transition-transform group-hover/btn:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </StaggerList>
    </Section>
  );
}
