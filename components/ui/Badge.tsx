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
  default:  "bg-surface-2 text-foreground border border-border dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700",
  primary:  "bg-primary-500/15 text-primary-700 dark:text-primary-300 border border-primary-500/30 font-semibold",
  success:  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold",
  warning:  "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-semibold",
  danger:   "bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30 font-semibold",
  outline:  "bg-transparent text-foreground border border-border",
};

const dotColors: Record<BadgeVariant, string> = {
  default:  "bg-muted-fg dark:bg-neutral-400",
  primary:  "bg-primary-600 dark:bg-primary-400",
  success:  "bg-emerald-600 dark:bg-emerald-400",
  warning:  "bg-amber-600 dark:bg-amber-400",
  danger:   "bg-red-600 dark:bg-red-400",
  outline:  "bg-muted-fg dark:bg-neutral-400",
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
