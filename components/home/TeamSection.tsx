"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";
import { teamMembersData, type TeamMemberDetails } from "@/lib/team-data";
import { fetchTeamMembers } from "@/lib/api-client";

const CATEGORIES = [
  { id: "all", label: "All Core Team", icon: "👥" },
  { id: "fullstack", label: "Fullstack Architecture", icon: "⚡" },
  { id: "design", label: "UI/UX & Product", icon: "🎨" },
  { id: "security", label: "Cyber Resilience", icon: "🛡️" },
  { id: "offensive", label: "Offensive Auditing", icon: "⚔️" },
];

export function TeamSection({ initialMembers }: { initialMembers?: TeamMemberDetails[] }) {
  const [members, setMembers] = useState<TeamMemberDetails[]>(initialMembers || teamMembersData);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetchTeamMembers().then((data) => {
      if (data && data.length > 0) {
        setMembers(data);
      }
    });
  }, []);

  const getMemberCategory = (slug: string) => {
    switch (slug) {
      case "md-mahfuzul-haque":
        return "fullstack";
      case "jahidul-islam":
        return "design";
      case "saif-khan":
        return "security";
      case "koushik-roy":
        return "offensive";
      default:
        return "all";
    }
  };

  const filteredMembers = members.filter((m) => {
    if (activeCategory === "all") return true;
    return getMemberCategory(m.slug) === activeCategory;
  });

  const getRoleAccent = (slug: string) => {
    switch (slug) {
      case "md-mahfuzul-haque":
        return {
          glow: "rgba(20, 184, 160, 0.35)",
          border: "border-primary-500/40 hover:border-primary-400",
          tagBg: "bg-primary-500/15 text-primary-300 border-primary-500/30",
          badgeColor: "primary" as const,
          crown: true,
          topStat: "100/100 Core Web Vitals",
        };
      case "jahidul-islam":
        return {
          glow: "rgba(245, 158, 11, 0.35)",
          border: "border-amber-500/40 hover:border-amber-400",
          tagBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          badgeColor: "warning" as const,
          crown: false,
          topStat: "+38% Avg Conversion Uplift",
        };
      case "saif-khan":
        return {
          glow: "rgba(16, 185, 129, 0.35)",
          border: "border-emerald-500/40 hover:border-emerald-400",
          tagBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
          badgeColor: "success" as const,
          crown: false,
          topStat: "0 Breaches • 100% Zero-Trust",
        };
      case "koushik-roy":
        return {
          glow: "rgba(168, 85, 247, 0.35)",
          border: "border-purple-500/40 hover:border-purple-400",
          tagBg: "bg-purple-500/15 text-purple-300 border-purple-500/30",
          badgeColor: "default" as const,
          crown: false,
          topStat: "70+ Vulnerabilities Uncovered",
        };
      default:
        return {
          glow: "rgba(255, 255, 255, 0.15)",
          border: "border-white/20 hover:border-white/40",
          tagBg: "bg-white/10 text-white border-white/20",
          badgeColor: "primary" as const,
          crown: false,
          topStat: "Senior Specialist",
        };
    }
  };

  return (
    <Section id="team" className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-r from-primary-500/10 via-amber-500/5 to-purple-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <FadeInSection>
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary-500/15 via-white/[0.04] to-amber-500/15 border border-primary-500/30 shadow-[0_0_20px_rgba(20,184,160,0.15)] mb-4">
            <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-primary-300 uppercase">
              CST Core Leadership • Mymensingh Polytechnic Institute
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            The Engineering Minds Behind <span className="gradient-text">Nexora</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-muted-fg max-w-2xl mx-auto leading-relaxed">
            Direct collaboration with foundational systems architects, UI/UX designers, and cyber security leads. Zero junior handoffs. Zero communication friction.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-primary-500 text-black shadow-[0_0_18px_rgba(20,184,160,0.4)] scale-105"
                    : "bg-surface-2/80 text-muted-fg hover:text-white hover:bg-surface-3 border border-border/60"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* Team Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMembers.map((member, idx) => {
            const accent = getRoleAccent(member.slug);
            const isFounder = accent.crown;

            return (
              <motion.div
                key={member.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                className="h-full flex"
              >
                <div
                  className={`w-full rounded-3xl bg-[#0c1222]/80 border ${accent.border} flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl relative group hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300`}
                >
                  {/* Top Ambient Highlight Glow */}
                  <div
                    className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b opacity-25 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top, ${accent.glow}, transparent 70%)` }}
                  />

                  {/* Header Area */}
                  <div className="p-6 pb-4 relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      {/* Avatar with Status Pulse */}
                      <div className="relative">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-white/10 via-surface-2 to-surface-1 border-2 border-white/15 group-hover:border-primary-400/80 flex items-center justify-center font-heading font-black text-white text-xl shadow-lg transition-all duration-300 group-hover:scale-105">
                          {member.initials}
                        </div>

                        {/* Founder Crown / Badge */}
                        {isFounder ? (
                          <span
                            className="absolute -top-2.5 -right-2.5 h-7 w-7 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-black border-2 border-[#0c1222] flex items-center justify-center text-xs font-black shadow-lg animate-bounce"
                            title="Founder & Systems Architect"
                          >
                            👑
                          </span>
                        ) : (
                          <span
                            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#0c1222] flex items-center justify-center"
                            title="Available for Q3 client delivery"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                          </span>
                        )}
                      </div>

                      {/* Division Badge */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 uppercase">
                          CST Core
                        </span>
                        <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Active Lead
                        </span>
                      </div>
                    </div>

                    {/* Name & Role */}
                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        <Link href={`/team/${member.slug}`} className="hover:underline">
                          <h3 className="font-heading font-extrabold text-lg text-white group-hover:text-primary-300 transition-colors">
                            {member.name}
                          </h3>
                        </Link>
                      </div>

                      <p className="text-xs font-semibold text-primary-400 mt-0.5">
                        {member.role}
                      </p>

                      <p className="text-[11px] text-muted-fg font-mono mt-1">
                        📍 {member.location}
                      </p>
                    </div>

                    {/* Department Pill */}
                    <div className="mt-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-[11px] font-semibold text-neutral-200">
                        {member.department}
                      </p>
                      <p className="text-[10px] text-muted-fg mt-0.5">
                        {member.institute}
                      </p>
                    </div>

                    {/* Bio Snippet */}
                    <p className="mt-3 text-xs text-neutral-400 leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Key Highlight Metric Banner */}
                    <div className="mt-4 py-2 px-3 rounded-xl bg-gradient-to-r from-white/[0.04] to-transparent border-l-2 border-primary-400">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-muted-fg">Key Benchmark</p>
                      <p className="text-xs font-bold font-heading text-white mt-0.5">
                        {accent.topStat}
                      </p>
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-1">
                      {member.skills.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-neutral-300 border border-white/[0.06]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="p-5 pt-3 border-t border-white/[0.06] bg-black/30 relative z-10 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      {/* Social icons */}
                      <div className="flex items-center gap-1.5">
                        {member.socialLinks?.github && (
                          <a
                            href={member.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                            title="GitHub Profile"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                          </a>
                        )}
                        {member.socialLinks?.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                            title="LinkedIn Profile"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                        )}
                        {member.socialLinks?.email && (
                          <a
                            href={`mailto:${member.socialLinks.email}`}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                            title="Direct Email"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                          </a>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-primary-400 font-semibold">
                        View Dossier →
                      </span>
                    </div>

                    {/* Primary Button */}
                    <Link
                      href={`/team/${member.slug}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-primary-500 hover:text-black text-white text-xs font-bold text-center border border-white/10 hover:border-primary-500 shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 group/btn"
                    >
                      <span>Architectural Case Studies</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Trust & Guarantee Banner */}
      <FadeInSection>
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary-500/10 via-surface-2 to-amber-500/10 border border-primary-500/25 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-2xl shrink-0">
              💎
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-base">
                Direct Engineering Partnership Guarantee
              </h4>
              <p className="text-xs text-muted-fg mt-0.5 max-w-xl">
                Every line of production code is reviewed by MD Mahfuzul Haque. Zero outsourcing, 100% intellectual property ownership, and comprehensive architectural documentation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/team"
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 text-xs font-semibold transition-colors"
            >
              All Team Credentials →
            </Link>
            <Link
              href="/request-project"
              className="px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-400 text-black text-xs font-bold shadow-[0_0_16px_rgba(20,184,160,0.3)] transition-colors"
            >
              Book Technical Review →
            </Link>
          </div>
        </div>
      </FadeInSection>
    </Section>
  );
}
