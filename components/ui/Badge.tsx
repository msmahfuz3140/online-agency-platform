type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "outline";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  "bg-neutral-800 text-neutral-200 border border-neutral-700",
  primary:  "bg-primary-500/15 text-primary-400 border border-primary-500/30",
  success:  "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  warning:  "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  danger:   "bg-red-500/15 text-red-400 border border-red-500/30",
  outline:  "bg-transparent text-foreground border border-border",
};

const dotColors: Record<BadgeVariant, string> = {
  default:  "bg-neutral-400",
  primary:  "bg-primary-400",
  success:  "bg-emerald-400",
  warning:  "bg-amber-400",
  danger:   "bg-red-400",
  outline:  "bg-neutral-400",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[10px] px-2 py-0.5 rounded-full",
  md: "text-xs px-2.5 py-1 rounded-full",
};

export function Badge({ variant = "default", size = "md", dot = false, children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium tracking-wide whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {dot && (
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
