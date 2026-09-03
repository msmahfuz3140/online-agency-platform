"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

type BillingCycle = "monthly" | "project";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: string;
  projectPrice: string;
  priceNote?: string;
  desc: string;
  badge?: string;
  badgeVariant?: "primary" | "warning" | "success" | "default";
  popular?: boolean;
  comingSoon?: boolean;
  features: PlanFeature[];
  cta: string;
  ctaHref: string;
  gradient?: string;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Try the AI website builder",
    monthlyPrice: "$0",
    projectPrice: "$0",
    desc: "A no-cost tier to explore Nexora's AI website generation engine. Perfect for experimenting with the platform before committing.",
    features: [
      { text: "5 AI website generations", included: true },
      { text: "3 pre-built templates", included: true },
      { text: "Preview & export HTML", included: true },
      { text: "Community support", included: true },
      { text: "Custom domain hosting", included: false },
      { text: "Unlimited AI generations", included: false },
      { text: "Priority support", included: false },
      { text: "Code ownership & GitHub export", included: false },
      { text: "Custom integrations", included: false },
      { text: "Dedicated project manager", included: false },
    ],
    cta: "Start for Free",
    ctaHref: "/register",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For freelancers & growing businesses",
    monthlyPrice: "$49",
    projectPrice: "$799",
    priceNote: "per project, from",
    desc: "Unlimited AI generations plus a dedicated engineering team for custom websites, landing pages, and business sites.",
    badge: "Coming Soon",
    badgeVariant: "warning",
    popular: true,
    comingSoon: true,
    features: [
      { text: "Unlimited AI website generations", included: true },
      { text: "All 50+ premium templates", included: true },
      { text: "Custom domain & SSL hosting", included: true },
      { text: "Code ownership & GitHub export", included: true },
      { text: "Priority support (< 24h response)", included: true },
      { text: "Up to 10-page custom website", included: true },
      { text: "Advanced SEO setup", included: true },
      { text: "3 rounds of revisions", included: true },
      { text: "Admin dashboard module", included: false },
      { text: "Dedicated project manager", included: false },
    ],
    cta: "Coming Soon",
    ctaHref: "#",
    gradient: "from-primary-500/15 via-primary-500/5 to-transparent",
  },
  {
    id: "business",
    name: "Business",
    tagline: "Full-stack apps, SaaS & enterprise",
    monthlyPrice: "$199",
    projectPrice: "$2,999",
    priceNote: "per project, from",
    desc: "End-to-end engineering for SaaS platforms, e-commerce stores, web applications, and complex custom systems.",
    badge: "Coming Soon",
    badgeVariant: "default",
    comingSoon: true,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Full-stack SaaS / web app development", included: true },
      { text: "Auth, billing & admin dashboard", included: true },
      { text: "Custom API integrations", included: true },
      { text: "Unlimited revisions", included: true },
      { text: "3-month post-launch support", included: true },
      { text: "Dedicated project manager", included: true },
      { text: "Team collaboration workspace", included: true },
      { text: "White-label AI engine access", included: true },
      { text: "SLA-backed uptime guarantee", included: true },
    ],
    cta: "Coming Soon",
    ctaHref: "#",
  },
];

const comparisonFeatures = [
  { feature: "AI Website Generations", free: "5 credits", pro: "Unlimited", business: "Unlimited" },
  { feature: "Templates Access", free: "3 free", pro: "50+", business: "All + custom" },
  { feature: "Custom Domain Hosting", free: "—", pro: "✓", business: "✓" },
  { feature: "Code Ownership & Export", free: "—", pro: "✓", business: "✓" },
  { feature: "Max Pages (Custom Build)", free: "—", pro: "Up to 10", business: "Unlimited" },
  { feature: "Revisions", free: "—", pro: "3 rounds", business: "Unlimited" },
  { feature: "Post-Launch Support", free: "—", pro: "—", business: "3 months" },
  { feature: "Admin Dashboard", free: "—", pro: "—", business: "✓" },
  { feature: "Dedicated PM", free: "—", pro: "—", business: "✓" },
  { feature: "SLA Uptime Guarantee", free: "—", pro: "—", business: "✓" },
];

function CheckIcon({ included }: { included: boolean }) {
  return included ? (
    <svg className="h-4 w-4 text-primary-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="h-4 w-4 text-neutral-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
    </svg>
  );
}

export function PricingPlansSection() {
  const [billing, setBilling] = useState<BillingCycle>("project");

  return (
    <Section id="pricing-plans" className="pb-0">
      {/* Billing toggle */}
      <FadeInSection>
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 p-1 rounded-full border border-border bg-surface-1">
            {(["project", "monthly"] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                id={`billing-toggle-${cycle}`}
                onClick={() => setBilling(cycle)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  billing === cycle
                    ? "bg-primary-500 text-white shadow-[0_0_12px_rgba(20,184,160,0.35)]"
                    : "text-muted-fg hover:text-foreground"
                }`}
              >
                {cycle === "project" ? "Per Project" : "Monthly Platform"}
              </button>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* Plan cards */}
      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-start">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            padding="lg"
            className={`relative flex flex-col ${
              plan.popular
                ? "border-primary-500/50 shadow-[0_0_48px_rgba(20,184,160,0.14)] sm:scale-[1.02] lg:scale-[1.03]"
                : ""
            } ${plan.comingSoon ? "opacity-90" : ""}`}
          >
            {/* "Most Popular" label */}
            {plan.popular && !plan.comingSoon && (
              <div className="absolute -top-3 inset-x-0 flex justify-center">
                <Badge variant="primary" size="sm">Most Popular</Badge>
              </div>
            )}

            {/* "Coming Soon" ribbon */}
            {plan.comingSoon && (
              <div className="absolute -top-3 inset-x-0 flex justify-center">
                <Badge variant={plan.badgeVariant ?? "default"} size="sm">Coming Soon</Badge>
              </div>
            )}

            {/* Plan header */}
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-fg">{plan.name}</p>
              <p className="text-[11px] text-muted-fg mt-0.5">{plan.tagline}</p>

              <motion.div
                key={billing}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                <span className="font-heading text-4xl font-bold text-foreground">
                  {billing === "project" ? plan.projectPrice : plan.monthlyPrice}
                </span>
                {billing === "project" && plan.priceNote && (
                  <span className="ml-1 text-xs text-muted-fg">{plan.priceNote}</span>
                )}
                {billing === "monthly" && (
                  <span className="ml-1 text-xs text-muted-fg">/month</span>
                )}
              </motion.div>
            </div>

            <p className="text-xs text-muted-fg leading-relaxed mb-5">{plan.desc}</p>

            {/* Feature list */}
            <ul className="space-y-2.5 flex-1 mb-7">
              {plan.features.map((f) => (
                <li key={f.text} className={`flex items-start gap-2 text-xs ${f.included ? "text-muted-fg" : "text-neutral-600 line-through decoration-neutral-700"}`}>
                  <CheckIcon included={f.included} />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {plan.comingSoon ? (
              <button
                disabled
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold border border-border text-muted-fg bg-surface-2 cursor-not-allowed opacity-60"
              >
                {plan.cta} — Coming Soon
              </button>
            ) : (
              <Button variant="primary" className="w-full" asChild>
                <Link href={plan.ctaHref}>{plan.cta}</Link>
              </Button>
            )}
          </Card>
        ))}
      </StaggerList>

      {/* Comparison table */}
      <FadeInSection delay={0.2}>
        <div className="mt-20 mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-2">
            Full Feature <span className="gradient-text">Comparison</span>
          </h2>
          <p className="text-sm text-muted-fg text-center">
            Exactly what's included in each tier — side by side.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-border bg-surface-1">
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-fg w-[40%]">
                  Feature
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-fg">Free</th>
                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-primary-400">
                  Pro <span className="text-amber-400 text-[9px] normal-case ml-1">soon</span>
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-fg">
                  Business <span className="text-amber-400 text-[9px] normal-case ml-1">soon</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row, idx) => (
                <tr
                  key={row.feature}
                  className={`border-b border-border/40 transition-colors hover:bg-surface-1/40 ${idx % 2 === 0 ? "" : "bg-surface-1/20"}`}
                >
                  <td className="py-3 px-4 text-xs text-foreground font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-xs text-muted-fg">{row.free}</td>
                  <td className="py-3 px-4 text-center text-xs font-semibold text-primary-400">{row.pro}</td>
                  <td className="py-3 px-4 text-center text-xs text-muted-fg">{row.business}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeInSection>
    </Section>
  );
}
