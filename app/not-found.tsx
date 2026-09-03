"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const quickRoutes = [
  {
    title: "Main Headquarters",
    desc: "Return to the primary agency overview, services & case previews",
    href: "/",
    icon: "⚡",
    tag: "Home",
  },
  {
    title: "Client Portfolio",
    desc: "Explore 8+ production web apps, SaaS dashboards & live demos",
    href: "/portfolio",
    icon: "💼",
    tag: "Work",
  },
  {
    title: "Agency Services",
    desc: "Full-stack development, UI/UX architecture & AI automation",
    href: "/services",
    icon: "🚀",
    tag: "Services",
  },
  {
    title: "Nexora Lab Blog",
    desc: "Read real-world Next.js engineering breakdowns & case studies",
    href: "/blog",
    icon: "🧠",
    tag: "Insights",
  },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Futuristic background lighting & radar glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-amber-500/8 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[250px] bg-violet-500/8 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Cyber grid lines overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 -z-10"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(20,184,160,0.15) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="w-full max-w-3xl mx-auto text-center relative z-10">
          {/* Status Chip */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(20,184,160,0.2)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
            </span>
            <span className="text-xs font-mono font-semibold tracking-wider uppercase text-primary-300">
              STATUS 404 • ROUTE DEVIATION DETECTED
            </span>
          </motion.div>

          {/* Huge glowing 404 visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 200 }}
            className="relative select-none my-2"
          >
            <div className="font-heading text-8xl sm:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-300 to-neutral-700 drop-shadow-[0_0_60px_rgba(20,184,160,0.25)]">
              404
            </div>

            {/* Glowing orbital ring around 404 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-24 sm:h-32 border border-primary-500/20 rounded-[100%] rotate-12 pointer-events-none -z-10 shadow-[0_0_30px_rgba(20,184,160,0.2)]" />
          </motion.div>

          {/* Heading & description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Lost in the <span className="gradient-text">Digital Void</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-fg max-w-lg mx-auto leading-relaxed">
              The coordinate you are searching for does not exist or has been shifted during our continuous deployment cycle. Let's redirect you back onto track.
            </p>
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button size="lg" variant="primary" asChild>
              <Link href="/">
                <span className="flex items-center gap-2">
                  <span>← Back to Command Center</span>
                </span>
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/portfolio">Explore Our Work</Link>
            </Button>
          </motion.div>

          {/* Quick Route Shortcuts Grid */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-12 text-left"
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-fg font-semibold">
                Alternative Navigation Coordinates
              </span>
              <span className="text-[10px] font-mono text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/20">
                ACTIVE
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              {quickRoutes.map((r, i) => (
                <Link key={r.title} href={r.href} className="block group">
                  <Card
                    hover
                    padding="sm"
                    className="p-4 border-border/80 bg-surface-1/70 backdrop-blur-md group-hover:border-primary-500/50 transition-all duration-300 h-full flex items-center gap-3.5"
                  >
                    <div className="h-10 w-10 rounded-xl bg-surface-2 border border-border/80 flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 group-hover:border-primary-500/40 transition-all duration-300">
                      {r.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-foreground group-hover:text-primary-400 transition-colors truncate">
                          {r.title}
                        </p>
                        <Badge variant="default" size="sm" className="text-[9px] px-1.5 py-0">
                          {r.tag}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-fg truncate mt-0.5">{r.desc}</p>
                    </div>
                    <span className="text-xs text-muted-fg group-hover:text-primary-400 group-hover:translate-x-1 transition-all">
                      →
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Diagnostic status line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 pt-6 border-t border-border/40 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono text-muted-fg/80"
          >
            <span>CODE: <strong className="text-foreground">404_NOT_FOUND</strong></span>
            <span>•</span>
            <span>EDGE_NODE: <strong className="text-foreground">GLOBAL_MESH</strong></span>
            <span>•</span>
            <span>AI_ASSISTANT: <strong className="text-primary-400">READY (BOTTOM RIGHT)</strong></span>
          </motion.div>
        </div>
      </main>
      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
