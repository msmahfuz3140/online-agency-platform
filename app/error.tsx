"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorProps) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log exception for telemetry
    console.error("Runtime error caught by Nexora boundary:", error);
  }, [error]);

  const handleCopyDiagnostics = () => {
    const diagnosticData = `NEXORA SYSTEM DIAGNOSTICS:
Time: ${new Date().toISOString()}
Digest: ${error.digest || "N/A"}
Message: ${error.message || "Unknown error"}
Stack: ${error.stack || "Not available"}
`;
    navigator.clipboard.writeText(diagnosticData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Red/amber emergency atmospheric aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/3 right-1/3 w-[450px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Cyber grid background overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 -z-10"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(239,68,68,0.15) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="w-full max-w-2xl mx-auto text-center relative z-10">
          {/* Status Chip */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur-md mb-6 shadow-[0_0_24px_rgba(239,68,68,0.2)]"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-red-400">
              SYSTEM ANOMALY • CODE 500
            </span>
          </motion.div>

          {/* Holographic glowing icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
            className="my-4 inline-flex items-center justify-center"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-surface-1 border border-red-500/30 flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(239,68,68,0.25)]">
                ⚠️
              </div>
              <div className="absolute -inset-1 rounded-3xl border border-red-500/20 blur-sm pointer-events-none" />
            </div>
          </motion.div>

          {/* Title & description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Unexpected System <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-orange-400">Interruption</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-fg leading-relaxed max-w-md mx-auto">
              A runtime disturbance occurred while executing this component. Don't worry, your session data is secure.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-medium text-sm shadow-[0_0_25px_rgba(239,68,68,0.35)] hover:from-red-500 hover:to-amber-500 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span>↻</span>
              <span>Re-Attempt Execution</span>
            </button>

            <Button size="lg" variant="secondary" asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </motion.div>

          {/* Technical Diagnostics Accordion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 text-left rounded-2xl border border-border/80 bg-surface-1/90 backdrop-blur-md overflow-hidden shadow-lg"
          >
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono text-muted-fg hover:text-foreground hover:bg-surface-2/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500/70" />
                <span>Diagnostics & Crash Telemetry</span>
                {error.digest && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-muted-fg border border-border">
                    ID: {error.digest}
                  </span>
                )}
              </div>
              <span>{showDetails ? "▲ Hide" : "▼ Show"}</span>
            </button>

            {showDetails && (
              <div className="p-4 border-t border-border/60 bg-[#0d1117] font-mono text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted-fg uppercase tracking-wider">
                    Error Log Stack
                  </span>
                  <button
                    onClick={handleCopyDiagnostics}
                    className="text-[11px] px-2 py-0.5 rounded border border-border bg-surface-2 text-neutral-300 hover:text-white transition-colors"
                  >
                    {copied ? "✓ Copied!" : "📋 Copy Diagnostics"}
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-black/50 border border-neutral-800 text-red-400 overflow-x-auto max-h-48 text-[11px] leading-relaxed">
                  <p className="font-semibold text-neutral-200">
                    {error.name || "Error"}: {error.message || "An unexpected error occurred."}
                  </p>
                  {error.digest && (
                    <p className="text-neutral-500 mt-1">Digest ID: {error.digest}</p>
                  )}
                  {error.stack && (
                    <pre className="text-neutral-500 mt-2 text-[10px] whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Support footnote */}
          <p className="mt-8 text-xs text-muted-fg">
            Need urgent assistance? Reach our engineering desk directly at{" "}
            <Link href="/#discovery-call" className="text-primary-400 hover:underline">
              support@nexora.agency
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
