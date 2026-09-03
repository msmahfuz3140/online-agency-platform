"use client";

import { useState } from "react";

interface BlogShareButtonsProps {
  title: string;
}

export function BlogShareButtons({ title }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`"${title}" by @nexora_agency`);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-fg font-medium mr-2">Share article:</span>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-1 hover:bg-surface-2 text-xs text-foreground transition-colors"
      >
        <span>{copied ? "✓ Copied!" : "🔗 Copy Link"}</span>
      </button>

      <button
        type="button"
        onClick={handleShareTwitter}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-1 hover:bg-surface-2 text-xs text-foreground transition-colors"
      >
        <span>𝕏 Post</span>
      </button>

      <button
        type="button"
        onClick={handleShareLinkedIn}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-1 hover:bg-surface-2 text-xs text-foreground transition-colors"
      >
        <span>in LinkedIn</span>
      </button>
    </div>
  );
}
