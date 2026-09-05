"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

export function RequestProjectHero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-accent-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-5 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase border-primary-500/40 text-primary-400 bg-primary-500/10">
            🚀 Start Your Project
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight"
        >
          Let's Build Something{" "}
          <span className="gradient-text">Extraordinary</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed"
        >
          Share your vision and requirements. Our senior engineers will review your request and deliver a detailed proposal within <span className="text-primary-400 font-semibold">24 hours</span>.
        </motion.p>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-neutral-500"
        >
          {[
            { icon: "⚡", text: "24-hour response" },
            { icon: "🔒", text: "NDA upon request" },
            { icon: "💬", text: "Free discovery call" },
            { icon: "🎯", text: "Fixed-price quotes" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
