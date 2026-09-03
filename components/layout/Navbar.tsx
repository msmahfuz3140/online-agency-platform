"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";

interface DropdownChild {
  label: string;
  href: string;
  desc: string;
  icon: string;
  badge?: string;
}

interface NavItem {
  label: string;
  href?: string;
  children?: DropdownChild[];
}

const navItems: NavItem[] = [
  {
    label: "Services",
    children: [
      {
        label: "Web & SaaS Development",
        href: "/#services",
        desc: "Custom Next.js, React, Node.js & SaaS web apps",
        icon: "💻",
      },
      {
        label: "UI/UX Product Design",
        href: "/#services",
        desc: "Figma design systems, wireframes & prototypes",
        icon: "✨",
      },
      {
        label: "Cyber Security & Audits",
        href: "/#services",
        desc: "Penetration testing & OWASP vulnerability audits",
        icon: "🛡️",
        badge: "Security",
      },
      {
        label: "Technical SEO & Marketing",
        href: "/#services",
        desc: "Organic search growth & conversion optimization",
        icon: "📈",
      },
      {
        label: "AI Website Generator",
        href: "/#ai-generator-demo",
        desc: "Instant live AI web creation from prompts",
        icon: "🤖",
        badge: "AI Live",
      },
      {
        label: "Component Architecture",
        href: "/#component-library",
        desc: "Modular Next.js React component blocks",
        icon: "🧩",
      },
    ],
  },
  {
    label: "Work",
    children: [
      {
        label: "Featured Projects",
        href: "/#portfolio-preview",
        desc: "Recent websites, SaaS dashboards & client case studies",
        icon: "💼",
      },
      {
        label: "Measurable Impact",
        href: "/#impact",
        desc: "Before vs. After client transformation results",
        icon: "📊",
      },
      {
        label: "Client Testimonials",
        href: "/#testimonials",
        desc: "Real feedback from founders & businesses worldwide",
        icon: "💬",
      },
      {
        label: "Agency Comparison",
        href: "/#comparison",
        desc: "Nexora Hybrid vs. Traditional vs. DIY Builders",
        icon: "⚖️",
        badge: "Compare",
      },
    ],
  },
  {
    label: "Pricing",
    children: [
      {
        label: "Fixed-Tier Packages",
        href: "/#pricing",
        desc: "Transparent packages with clear deliverables",
        icon: "💳",
      },
      {
        label: "Interactive Cost Calculator",
        href: "/#cost-calculator",
        desc: "Instant custom price & timeline estimator",
        icon: "💰",
        badge: "Instant",
      },
      {
        label: "Project Pathways",
        href: "/#pathways",
        desc: "DIY AI vs. Hybrid Polish vs. Bespoke Enterprise",
        icon: "🛣️",
      },
      {
        label: "Client Guarantees",
        href: "/#guarantees",
        desc: "100% Code Ownership & 14-day free warranty",
        icon: "💎",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Blog",
    href: "/blog",
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>("Services");
  const [activeSection, setActiveSection] = useState<string>("");
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = [
        "cost-calculator",
        "pricing",
        "portfolio-preview",
        "services",
        "component-library",
        "pathways",
        "comparison",
        "team",
        "why-choose-us",
        "impact",
        "guarantees",
        "about",
        "book-call",
        "faq",
      ];

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll on mobile
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      {/* Floating Capsule Header Container */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none"
      >
        <div
          className={`mx-auto max-w-7xl h-14 sm:h-16 rounded-2xl sm:rounded-full px-3.5 sm:px-6 flex items-center justify-between pointer-events-auto transition-all duration-300 ${
            scrolled || mobileOpen
              ? "bg-neutral-950/90 backdrop-blur-2xl border border-neutral-800 shadow-[0_12px_40px_rgba(0,0,0,0.7)] ring-1 ring-white/5"
              : "bg-neutral-950/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center shadow-[0_0_16px_rgba(20,184,160,0.5)] group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-sm font-heading">N</span>
            </div>
            <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-foreground group-hover:text-primary-400 transition-colors">
              Nexora
            </span>
          </Link>

          {/* Desktop Navigation Links — visible on md: (768px+) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isDropdownOpen = activeDropdown === item.label;

              const isActive =
                item.href === `/#${activeSection}` ||
                (hasChildren &&
                  item.children?.some(
                    (c) => c.href.includes(activeSection) && activeSection !== ""
                  ));

              if (hasChildren) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-150 ${
                        isDropdownOpen || isActive
                          ? "text-white bg-neutral-800/90 shadow-sm"
                          : "text-neutral-300 hover:text-white hover:bg-neutral-800/50"
                      }`}
                      aria-expanded={isDropdownOpen}
                    >
                      <span>{item.label}</span>
                      <motion.span
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-[10px] text-neutral-400"
                      >
                        ▾
                      </motion.span>
                    </button>

                    {/* Dropdown Menu Panel */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-88 p-2 rounded-2xl bg-neutral-950/95 backdrop-blur-2xl border border-neutral-800/90 shadow-[0_24px_70px_rgba(0,0,0,0.85)] z-50 overflow-hidden ring-1 ring-white/10"
                        >
                          <div className="space-y-1">
                            {item.children?.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-neutral-900/90 border border-transparent hover:border-neutral-800 transition-all duration-150 group"
                              >
                                <span className="h-8 w-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-base flex-shrink-0 group-hover:scale-105 group-hover:border-primary-500/40 transition-all">
                                  {child.icon}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-foreground group-hover:text-primary-400 transition-colors truncate">
                                      {child.label}
                                    </p>
                                    {child.badge && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                        {child.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-muted-fg leading-snug mt-0.5 truncate">
                                    {child.desc}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href || "#"}
                  className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-150 ${
                    isActive
                      ? "text-white bg-neutral-800/90 shadow-sm"
                      : "text-neutral-300 hover:text-white hover:bg-neutral-800/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA & Login */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/login"
              className="text-xs lg:text-sm font-medium text-neutral-300 hover:text-white transition-colors px-2 py-1"
            >
              Log in
            </Link>
            <Button
              size="sm"
              variant="primary"
              className="rounded-full px-4 shadow-[0_0_20px_rgba(20,184,160,0.3)] text-xs font-semibold"
              asChild
            >
              <Link href="/contact">Get a Quote →</Link>
            </Button>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden p-2 text-neutral-300 hover:text-white rounded-xl hover:bg-neutral-800 transition-all"
          >
            <div className="w-5 h-5 flex flex-col justify-center gap-[5px]">
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.22 }}
                className="block h-0.5 w-5 bg-current rounded-full origin-center"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.18 }}
                className="block h-0.5 w-5 bg-current rounded-full"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.22 }}
                className="block h-0.5 w-5 bg-current rounded-full origin-center"
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/75 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed top-20 inset-x-0 z-40 md:hidden max-h-[calc(100vh-6rem)] overflow-y-auto px-3"
            >
              <div className="rounded-3xl border border-neutral-800 bg-neutral-950/95 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] overflow-hidden p-3.5 space-y-1.5 ring-1 ring-white/10">
                {navItems.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const isExpanded = mobileExpanded === item.label;

                  if (hasChildren) {
                    return (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-neutral-850 bg-neutral-900/60 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setMobileExpanded(isExpanded ? null : item.label)}
                          className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-foreground hover:bg-neutral-800/60 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span>{item.label === "Services" ? "⚡" : item.label === "Work" ? "💼" : "💳"}</span>
                            <span>{item.label}</span>
                          </span>
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs text-muted-fg"
                          >
                            ▾
                          </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-2.5 pb-2.5 space-y-1"
                            >
                              {item.children?.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                                >
                                  <span className="text-base p-1.5 rounded-lg bg-surface border border-border flex-shrink-0">
                                    {child.icon}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground truncate">
                                      {child.label}
                                    </p>
                                    <p className="text-[10px] text-muted-fg truncate mt-0.5">
                                      {child.desc}
                                    </p>
                                  </div>
                                  {child.badge && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary-500/20 text-primary-400">
                                      {child.badge}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href || "#"}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-neutral-600">→</span>
                    </Link>
                  );
                })}

                {/* Bottom CTA bar inside mobile menu */}
                <div className="pt-3 mt-2 border-t border-neutral-800/80 flex gap-2">
                  <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full text-neutral-300 rounded-xl">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/contact" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full rounded-xl">
                      Get a Quote →
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
