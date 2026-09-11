"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative max-w-md w-full"
      >
        <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Successful! 🎉</h1>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Thank you for choosing Nexora Agency. Our team will reach out within 24 hours to kickstart your project.
            </p>

            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-left mb-6">
              <p className="text-xs text-teal-300 font-semibold mb-2">What happens next?</p>
              <ul className="space-y-2">
                {[
                  "You'll receive a confirmation email shortly",
                  "Our team will review your payment",
                  "A project manager will be assigned within 24h",
                  "Project kickoff meeting will be scheduled",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-400 transition-all shadow-[0_0_20px_rgba(20,184,160,0.3)] text-center"
              >
                Go to Dashboard →
              </Link>
              <Link
                href="/"
                className="w-full py-3 rounded-xl bg-white/5 text-neutral-400 font-semibold text-sm hover:bg-white/10 hover:text-white transition-all text-center"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
