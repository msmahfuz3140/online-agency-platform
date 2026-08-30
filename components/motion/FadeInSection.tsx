"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Slide direction when entering */
  from?: "bottom" | "left" | "right" | "none";
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Threshold (0–1) of element visible before triggering */
  threshold?: number;
  /** Only animate once */
  once?: boolean;
}

const offsetMap = {
  bottom: { y: 32, x: 0 },
  left:   { y: 0, x: -32 },
  right:  { y: 0, x: 32 },
  none:   { y: 0, x: 0 },
};

export function FadeInSection({
  children,
  className = "",
  from = "bottom",
  delay = 0,
  threshold = 0.15,
  once = true,
}: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, render immediately without animation
  if (shouldReduceMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  const initial = { opacity: 0, ...offsetMap[from] };
  const animate = isInView
    ? { opacity: 1, y: 0, x: 0 }
    : initial;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={animate}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
}
