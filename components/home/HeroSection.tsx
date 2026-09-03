"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { AnimatedCounter } from "../motion/AnimatedCounter";

const stats = [
  { value: 120, suffix: "+", label: "Projects Delivered" },
  { value: 98,  suffix: "%", label: "Client Satisfaction" },
  { value: 5,   suffix: "+", label: "Years Experience" },
  { value: 40,  suffix: "+", label: "Happy Clients" },
];

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-dvh flex items-center pt-16 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[700px] h-[300px] sm:h-[500px] lg:h-[700px] rounded-full bg-primary-500/10 blur-[80px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full bg-accent-500/8 blur-[80px] sm:blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 items-center">

          {/* Left — Copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Badge variant="primary" dot className="mb-4 sm:mb-5">
                Now with AI Website Generation
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="font-heading text-[2rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              We build{" "}
              <span className="gradient-text">digital products</span>{" "}
              that convert.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-muted-fg leading-relaxed max-w-xl"
            >
              Nexora is a premium digital agency crafting high-performance websites,
              SaaS products, and AI-generated web experiences — designed to impress
              and built to grow your business.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3"
            >
              <Button size="lg" variant="primary" className="w-full sm:w-auto" asChild>
                <Link href="/contact">Start a Project →</Link>
              </Button>
              <Button size="lg" variant="ghost" className="w-full sm:w-auto" asChild>
                <Link href="/portfolio">View Our Work</Link>
              </Button>
            </motion.div>

            {/* Premium Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-border"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-surface/70 border border-border/80 hover:border-primary-500/40 hover:bg-surface transition-all duration-200 shadow-sm text-center group"
                  >
                    <div className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                      <AnimatedCounter to={s.value} suffix={s.suffix} className="gradient-text" />
                    </div>
                    <p className="mt-1 text-xs text-muted-fg font-medium leading-snug">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Project preview cards (desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:flex flex-col gap-4"
          >
            {[
              { title: "Finflow Dashboard", type: "SaaS",        color: "from-primary-500/20 to-primary-500/5" },
              { title: "Bloom E-commerce",  type: "E-commerce", color: "from-accent-500/20 to-accent-500/5"  },
              { title: "Radius Portfolio",  type: "Portfolio",  color: "from-violet-500/20 to-violet-500/5"  },
            ].map((proj, i) => (
              <motion.div
                key={proj.title}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className={`rounded-2xl border border-border bg-gradient-to-br ${proj.color} p-5 flex items-center gap-4`}
              >
                <div className="h-10 w-10 rounded-xl bg-surface-2 border border-border flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{proj.title}</p>
                  <p className="text-xs text-muted-fg mt-0.5">{proj.type} · Live</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
