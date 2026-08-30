"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface StaggerListProps {
  children: React.ReactNode;
  className?: string;
  /** Delay between each child in seconds */
  staggerDelay?: number;
  /** Initial delay before the list starts animating */
  initialDelay?: number;
  /** Direction items enter from */
  from?: "bottom" | "left" | "right";
}

const offsetMap = {
  bottom: { y: 24, x: 0 },
  left:   { y: 0, x: -24 },
  right:  { y: 0, x: 24 },
};

export function StaggerList({
  children,
  className = "",
  staggerDelay = 0.08,
  initialDelay = 0,
  from = "bottom",
}: StaggerListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: initialDelay,
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0, x: 0 }
      : { opacity: 0, ...offsetMap[from] },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      {/* Wrap each direct child in a motion.div with the item variant */}
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>
      }
    </motion.div>
  );
}
