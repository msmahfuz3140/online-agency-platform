import { forwardRef } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card({ hover = false, glass = false, padding = "md", children, className = "", ...props }, ref) {
    const base = "rounded-2xl border transition-all duration-300";
    const glassClass = glass
      ? "glass"
      : "bg-surface border-border";
    const hoverClass = hover
      ? "hover:border-primary-500/40 hover:shadow-[0_8px_32px_rgba(20,184,160,0.12)] hover:-translate-y-0.5 cursor-pointer"
      : "";

    return (
      <div
        ref={ref}
        className={`${base} ${glassClass} ${hoverClass} ${paddingMap[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
