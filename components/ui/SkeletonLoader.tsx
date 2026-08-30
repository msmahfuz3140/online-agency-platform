interface SkeletonProps {
  className?: string;
  /** Render as a circular shape (avatars, icons) */
  circle?: boolean;
  /** Width — Tailwind class e.g. "w-32" or "w-full" */
  width?: string;
  /** Height — Tailwind class e.g. "h-4" or "h-32" */
  height?: string;
}

export function Skeleton({ className = "", circle = false, width = "w-full", height = "h-4" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`${width} ${height} ${circle ? "rounded-full" : "rounded-lg"} bg-neutral-800 animate-pulse ${className}`}
    />
  );
}

/** A preset skeleton for card-shaped blocks */
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton circle width="w-10" height="h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton height="h-4" width="w-3/4" />
          <Skeleton height="h-3" width="w-1/2" />
        </div>
      </div>
      <Skeleton height="h-3" />
      <Skeleton height="h-3" width="w-4/5" />
      <Skeleton height="h-3" width="w-2/3" />
    </div>
  );
}

/** A preset skeleton for stat card blocks used in dashboards */
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 animate-pulse space-y-3">
      <Skeleton height="h-3" width="w-1/3" />
      <Skeleton height="h-8" width="w-1/2" />
      <Skeleton height="h-3" width="w-2/5" />
    </div>
  );
}
