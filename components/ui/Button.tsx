"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
  asChild?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: [
    "bg-primary-500 text-white",
    "hover:bg-primary-600 active:bg-primary-700",
    "shadow-[0_0_0_0_rgba(20,184,160,0)] hover:shadow-[0_0_20px_rgba(20,184,160,0.35)]",
    "border border-primary-500/20",
  ].join(" "),

  secondary: [
    "bg-surface-2 text-foreground",
    "hover:bg-neutral-700 active:bg-neutral-800",
    "border border-border",
  ].join(" "),

  ghost: [
    "bg-transparent text-foreground",
    "hover:bg-neutral-800/60 active:bg-neutral-800",
    "border border-transparent hover:border-border",
  ].join(" "),

  danger: [
    "bg-red-600 text-white",
    "hover:bg-red-700 active:bg-red-800",
    "border border-red-500/20",
  ].join(" "),
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-md gap-1.5",
  md: "h-10 px-5 text-sm rounded-lg gap-2",
  lg: "h-12 px-7 text-base rounded-xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", loading = false, children, className = "", disabled, ...props },
    ref
  ) {
    const base =
      "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none";

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        disabled={disabled || loading}
        className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span>Loading…</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
