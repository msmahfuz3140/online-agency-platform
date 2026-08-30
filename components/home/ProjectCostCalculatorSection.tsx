"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "../ui/Section";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";

interface ProjectTypeOption {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
  baseDays: number;
  desc: string;
}

interface FeatureAddon {
  id: string;
  name: string;
  icon: string;
  price: number;
  days: number;
  category: string;
}

const projectTypes: ProjectTypeOption[] = [
  {
    id: "landing",
    name: "High-Converting Landing Page",
    icon: "🎯",
    basePrice: 350,
    baseDays: 5,
    desc: "Single-page campaign or product launch site with conversion UX.",
  },
  {
    id: "business",
    name: "Full Corporate Website",
    icon: "🏢",
    basePrice: 650,
    baseDays: 12,
    desc: "Multi-page company presence with CMS, contact flows, and SEO.",
  },
  {
    id: "saas",
    name: "Full-Stack SaaS Platform",
    icon: "⚡",
    basePrice: 1400,
    baseDays: 24,
    desc: "Custom web app with auth, database, billing, and real-time dashboard.",
  },
  {
    id: "ecommerce",
    name: "Custom E-Commerce Store",
    icon: "🛒",
    basePrice: 850,
    baseDays: 16,
    desc: "Online storefront with product catalog, cart, and payment checkout.",
  },
  {
    id: "security",
    name: "Cyber Security & Pen-Test Audit",
    icon: "🛡️",
    basePrice: 500,
    baseDays: 6,
    desc: "Comprehensive vulnerability assessment, API audit, and report.",
  },
  {
    id: "design",
    name: "Complete UI/UX Design System",
    icon: "🎨",
    basePrice: 450,
    baseDays: 8,
    desc: "Figma design system, high-fidelity prototypes, and user flows.",
  },
];

const featureAddons: FeatureAddon[] = [
  { id: "auth", name: "User Auth & Roles", icon: "🔐", price: 150, days: 2, category: "Backend" },
  { id: "payments", name: "Payment Gateway (Stripe/Razorpay)", icon: "💳", price: 200, days: 3, category: "Backend" },
  { id: "ai", name: "AI Features / Claude API", icon: "🤖", price: 250, days: 3, category: "AI & Tools" },
  { id: "seo", name: "Advanced Technical SEO Setup", icon: "📈", price: 120, days: 1, category: "Marketing" },
  { id: "pentest", name: "Security Hardening & Audit", icon: "🛡️", price: 200, days: 2, category: "Security" },
  { id: "cms", name: "Headless CMS Integration", icon: "📝", price: 180, days: 2, category: "Content" },
  { id: "speed", name: "95+ Core Web Vitals Optimization", icon: "⚡", price: 100, days: 1, category: "Performance" },
  { id: "animations", name: "Custom 3D / Framer Motion Animations", icon: "✨", price: 160, days: 2, category: "Frontend" },
];

export function ProjectCostCalculatorSection() {
  const [selectedType, setSelectedType] = useState<ProjectTypeOption>(projectTypes[0]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["seo", "speed"]);
  const [isExpress, setIsExpress] = useState<boolean>(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculation
  const { totalPrice, totalDays } = useMemo(() => {
    let price = selectedType.basePrice;
    let days = selectedType.baseDays;

    featureAddons.forEach((addon) => {
      if (selectedAddons.includes(addon.id)) {
        price += addon.price;
        days += addon.days;
      }
    });

    if (isExpress) {
      price = Math.round(price * 1.3);
      days = Math.max(3, Math.round(days * 0.65));
    }

    return { totalPrice: price, totalDays: days };
  }, [selectedType, selectedAddons, isExpress]);

  // Query string for contact link
  const contactUrl = useMemo(() => {
    const addonNames = featureAddons
      .filter((a) => selectedAddons.includes(a.id))
      .map((a) => a.name)
      .join(", ");
    return `/contact?type=${encodeURIComponent(selectedType.name)}&addons=${encodeURIComponent(
      addonNames
    )}&estimate=${totalPrice}&speed=${isExpress ? "Express" : "Standard"}`;
  }, [selectedType, selectedAddons, totalPrice, isExpress]);

  return (
    <Section id="cost-calculator" className="relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-500/10 blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <Badge variant="primary" dot className="mb-3">
            Instant Estimate
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Interactive Project <span className="gradient-text">Cost Calculator</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-2xl mx-auto leading-relaxed">
            Select your project type and desired features to calculate an instant, transparent estimate with delivery timeline.
          </p>
        </div>
      </FadeInSection>

      {/* Calculator Grid */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
        {/* Left Options Column */}
        <div className="space-y-8">
          {/* 1. Project Type */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-6 w-6 rounded-full bg-primary-500/20 text-primary-400 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
                Select Your Project Foundation
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-3.5">
              {projectTypes.map((type) => {
                const isSelected = selectedType.id === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                      isSelected
                        ? "bg-surface border-primary-500 shadow-[0_0_24px_rgba(20,184,160,0.2)] scale-[1.01]"
                        : "bg-surface/60 border-border/80 hover:border-border hover:bg-surface"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{type.icon}</span>
                        <span className="font-heading font-bold text-sm text-foreground">
                          ${type.basePrice}
                        </span>
                      </div>
                      <p className="font-heading font-semibold text-xs sm:text-sm text-foreground">
                        {type.name}
                      </p>
                      <p className="text-[11px] text-muted-fg mt-1 leading-snug">
                        {type.desc}
                      </p>
                    </div>
                    <p className="text-[10px] text-primary-400 font-medium mt-3">
                      Est. Base: {type.baseDays} business days
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Addon Features */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary-500/20 text-primary-400 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
                  Add Features & Capabilities
                </h3>
              </div>
              <span className="text-xs text-muted-fg">Multi-select</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
              {featureAddons.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all duration-200 ${
                      isChecked
                        ? "bg-surface border-primary-500/80 shadow-sm"
                        : "bg-surface/50 border-border/70 hover:border-border hover:bg-surface/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg flex-shrink-0">{addon.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {addon.name}
                        </p>
                        <p className="text-[10px] text-muted-fg">+{addon.days} days</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-semibold text-primary-400 font-mono">
                        +${addon.price}
                      </span>
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                          isChecked
                            ? "bg-primary-500 border-primary-500 text-white"
                            : "border-border bg-surface-2"
                        }`}
                      >
                        {isChecked && (
                          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Delivery Urgency */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-6 w-6 rounded-full bg-primary-500/20 text-primary-400 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
                Delivery Timeline Speed
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsExpress(false)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  !isExpress
                    ? "bg-surface border-primary-500 shadow-sm"
                    : "bg-surface/50 border-border/70 text-muted-fg"
                }`}
              >
                <p className="text-xs font-bold text-foreground">🟢 Standard Timeline</p>
                <p className="text-[10px] text-muted-fg mt-0.5">Regular sprint delivery schedule</p>
              </button>

              <button
                type="button"
                onClick={() => setIsExpress(true)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isExpress
                    ? "bg-surface border-primary-500 shadow-[0_0_20px_rgba(20,184,160,0.2)]"
                    : "bg-surface/50 border-border/70 text-muted-fg"
                }`}
              >
                <p className="text-xs font-bold text-primary-400">⚡ Express Delivery (+30%)</p>
                <p className="text-[10px] text-muted-fg mt-0.5">Priority expedited delivery (40% faster)</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Summary Card (Sticky) */}
        <div className="sticky top-24">
          <div className="p-6 sm:p-7 rounded-3xl bg-neutral-950 border border-primary-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Header glow */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary-500/15 blur-[60px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-primary-400">
                    Estimate Summary
                  </p>
                  <h4 className="font-heading font-bold text-base text-foreground mt-0.5">
                    {selectedType.name}
                  </h4>
                </div>
                <span className="text-2xl">{selectedType.icon}</span>
              </div>

              {/* Price & Timeline Display */}
              <div className="py-6 border-b border-border space-y-4">
                <div>
                  <p className="text-xs text-muted-fg">Total Estimated Investment</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                      ${totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-fg">USD</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border text-xs">
                  <span className="text-muted-fg">Estimated Delivery:</span>
                  <span className="font-semibold text-primary-400">
                    ~ {totalDays} Business Days
                  </span>
                </div>
              </div>

              {/* Included Checklist Items */}
              <div className="py-5 space-y-2 text-xs">
                <p className="font-semibold text-foreground text-[11px] uppercase tracking-wider">
                  Included in this scope:
                </p>
                <div className="space-y-1.5 text-muted-fg">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{selectedType.name} Base Architecture</span>
                  </div>
                  {selectedAddons.map((id) => {
                    const addon = featureAddons.find((a) => a.id === id);
                    if (!addon) return null;
                    return (
                      <div key={id} className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{addon.name}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>14-Day Free Post-Launch Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>100% Full Code Ownership</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Button variant="primary" size="lg" className="w-full shadow-lg" asChild>
                  <Link href={contactUrl}>Claim This Estimate →</Link>
                </Button>
                <p className="text-[10px] text-muted-fg text-center mt-2.5">
                  No commitment required · Lock in this pricing today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
