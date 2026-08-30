"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useInView, useReducedMotion, motion } from "framer-motion";

interface AnimatedCounterProps {
  /** The final number to count up to */
  to: number;
  /** Duration of the count-up animation in seconds */
  duration?: number;
  /** Optional suffix to append (e.g., "+", "k", "%") */
  suffix?: string;
  /** Optional prefix (e.g., "$") */
  prefix?: string;
  /** Format with locale separators (e.g. 1,000) */
  formatNumber?: boolean;
  className?: string;
}

export function AnimatedCounter({
  to,
  duration = 1.8,
  suffix = "",
  prefix = "",
  formatNumber = true,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: shouldReduceMotion ? 10000 : 60,
    damping: shouldReduceMotion ? 1000 : 14,
    mass: 0.8,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(to);
    }
  }, [isInView, motionValue, to]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const value = Math.round(latest);
        ref.current.textContent =
          prefix +
          (formatNumber ? value.toLocaleString() : String(value)) +
          suffix;
      }
    });
    return unsubscribe;
  }, [springValue, prefix, suffix, formatNumber]);

  return (
    <motion.span ref={ref} className={className}>
      {prefix}0{suffix}
    </motion.span>
  );
}
