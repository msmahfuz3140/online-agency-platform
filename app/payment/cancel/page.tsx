"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative max-w-md w-full"
      >
        <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-2">Payment Cancelled</h1>
          <p className="text-neutral-400 text-sm leading-relaxed mb-6">
            No worries! Your payment was cancelled and no charge was made. You can try again anytime.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/pricing"
              className="w-full py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-400 transition-all shadow-[0_0_20px_rgba(20,184,160,0.3)] text-center"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="w-full py-3 rounded-xl bg-white/5 text-neutral-400 font-semibold text-sm hover:bg-white/10 hover:text-white transition-all text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
