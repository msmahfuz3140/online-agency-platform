"use client";

import React from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  accentColor?: "teal" | "amber" | "blue" | "purple";
  delay?: number;
  sparkline?: number[]; // mini bar values 0-100
}

const colorMap = {
  teal: {
    bg: "bg-primary-500/10",
    border: "border-primary-500/20",
    icon: "bg-primary-500/15 text-primary-400",
    glow: "shadow-[0_0_30px_rgba(20,184,160,0.08)]",
    bar: "bg-primary-500",
    text: "text-primary-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: "bg-amber-500/15 text-amber-400",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.08)]",
    bar: "bg-amber-500",
    text: "text-amber-400",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: "bg-blue-500/15 text-blue-400",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.08)]",
    bar: "bg-blue-500",
    text: "text-blue-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    icon: "bg-purple-500/15 text-purple-400",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.08)]",
    bar: "bg-purple-500",
    text: "text-purple-400",
  },
};

export function StatCard({
  label,
  value,
  suffix = "",
  prefix = "",
  icon,
  trend,
  accentColor = "teal",
  delay = 0,
  sparkline,
}: StatCardProps) {
  const colors = colorMap[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`relative rounded-2xl border ${colors.border} bg-[#111827] ${colors.glow} p-5 overflow-hidden group hover:border-opacity-50 transition-all duration-300`}
    >
      {/* Subtle hover glow backdrop */}
      <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className={`h-10 w-10 rounded-xl ${colors.icon} flex items-center justify-center shrink-0`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-[11px] font-semibold ${trend.value >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={trend.value >= 0 ? "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" : "M2.25 6 9 12.75l4.306-4.306a11.95 11.95 0 0 1 5.814 5.518l2.74 1.22m0 0-5.94 2.281m5.94-2.28-2.28-5.941"} />
              </svg>
              <span>{trend.value >= 0 ? "+" : ""}{trend.value}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <AnimatedCounter
            to={value}
            prefix={prefix}
            suffix={suffix}
            formatNumber
            className={`font-heading text-3xl font-extrabold ${colors.text}`}
          />
        </div>

        {/* Label */}
        <p className="text-xs text-neutral-500 font-medium">{label}</p>
        {trend && (
          <p className="text-[10px] text-neutral-600 mt-0.5">{trend.label}</p>
        )}

        {/* Sparkline mini bars */}
        {sparkline && sparkline.length > 0 && (
          <div className="flex items-end gap-0.5 mt-3 h-8">
            {sparkline.map((v, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: delay + 0.3 + i * 0.04, duration: 0.3, ease: "easeOut" }}
                style={{ height: `${Math.max(8, v)}%`, originY: 1 }}
                className={`flex-1 rounded-sm ${colors.bar} opacity-60 group-hover:opacity-80 transition-opacity`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
