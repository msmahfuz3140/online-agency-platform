"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FileUpload } from "@/components/ui/FileUpload";
import { getStoredUser } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface PlanInfo {
  id: "pro" | "business";
  name: string;
  priceUSD: string;
  priceBDT: string;
  amountUSD: number;  // in cents
  amountBDT: number;  // in paisa
}

export const PLANS: Record<string, PlanInfo> = {
  pro: {
    id: "pro",
    name: "Pro Plan",
    priceUSD: "$49",
    priceBDT: "৳5,490",
    amountUSD: 4900,
    amountBDT: 549000,
  },
  business: {
    id: "business",
    name: "Business Plan",
    priceUSD: "$199",
    priceBDT: "৳21,990",
    amountUSD: 19900,
    amountBDT: 2199000,
  },
};

type PaymentTab = "stripe" | "bkash" | "nagad";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanInfo | null;
}

// ─── Small helpers ─────────────────────────────────────────────────────────────
function TabButton({
  active,
  onClick,
  icon,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
        active
          ? `${color} shadow-lg scale-[1.02]`
          : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 px-2.5 py-1 text-xs rounded-md bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-all duration-150 border border-teal-500/30 font-mono"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

// ─── Stripe Form ───────────────────────────────────────────────────────────────
function StripeForm({ plan, onSuccess }: { plan: PlanInfo; onSuccess: (id: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");

    try {
      // 1. Create payment intent on backend
      const intentRes = await fetch(`${API_URL}/api/payment/create-stripe-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, clientName: name, clientEmail: email }),
      });
      const intentData = await intentRes.json();

      if (!intentData.success) {
        setError(intentData.message || "Failed to create payment. Please try again.");
        setLoading(false);
        return;
      }

      if (intentData.mock) {
        // Stripe not configured — simulate success for demo
        await new Promise(r => setTimeout(r, 1500));
        const confirmRes = await fetch(`${API_URL}/api/payment/confirm-stripe-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: intentData.clientSecret,
            planId: plan.id,
            clientName: name,
            clientEmail: email,
          }),
        });
        const confirmData = await confirmRes.json();
        onSuccess(confirmData.paymentId || "mock_payment");
        return;
      }

      // 2. In real mode: use Stripe.js to confirm card payment
      // For now, confirm via backend
      const confirmRes = await fetch(`${API_URL}/api/payment/confirm-stripe-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: intentData.clientSecret.split("_secret_")[0],
          planId: plan.id,
          clientName: name,
          clientEmail: email,
        }),
      });
      const confirmData = await confirmRes.json();
      onSuccess(confirmData.paymentId);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Billing Info</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-teal-500/50 focus:bg-white/8 transition-all"
              required
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-teal-500/50 transition-all"
              required
            />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-teal-400" viewBox="0 0 24 24" fill="currentColor"><path d="M2 10h20M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Card Details
        </p>
        <div>
          <label className="text-xs text-neutral-400 mb-1 block">Card Number</label>
          <input
            value={card}
            onChange={e => setCard(formatCard(e.target.value))}
            placeholder="4242 4242 4242 4242"
            className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-teal-500/50 transition-all font-mono tracking-wider"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Expiry</label>
            <input
              value={expiry}
              onChange={e => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-teal-500/50 transition-all font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">CVC</label>
            <input
              value={cvc}
              onChange={e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="123"
              className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-teal-500/50 transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          ⚠️ {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-sm hover:from-teal-400 hover:to-teal-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_20px_rgba(20,184,160,0.3)] hover:shadow-[0_0_30px_rgba(20,184,160,0.5)] flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Pay {plan.priceUSD} Securely
          </>
        )}
      </button>
      <p className="text-center text-xs text-neutral-600">
        🔒 Secured by Stripe · 256-bit SSL encryption
      </p>
    </form>
  );
}

// ─── Manual Payment Form (bKash / Nagad) ──────────────────────────────────────
function ManualPaymentForm({
  plan,
  method,
  merchantNumber,
  onSuccess,
}: {
  plan: PlanInfo;
  method: "bkash" | "nagad";
  merchantNumber: string;
  onSuccess: (id: string) => void;
}) {
  const isBkash = method === "bkash";
  const color = isBkash ? "pink" : "orange";
  const colorClass = isBkash
    ? "text-pink-400 bg-pink-500/10 border-pink-500/30"
    : "text-orange-400 bg-orange-500/10 border-orange-500/30";
  const btnClass = isBkash
    ? "from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]"
    : "from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  // Auto-fill from stored session if available
  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
    }
  }, []);

  // Bangladeshi phone number helper functions
  // Valid formats: 01712345678, +8801712345678, 8801712345678, with optional spaces/dashes
  // Operators: 013, 014, 015, 016, 017, 018, 019 (11 digits total)
  const cleanBdPhone = (val: string) => {
    return val.replace(/[\s-]/g, "").replace(/^(\+?88)/, "");
  };

  const isValidBdPhone = (val: string) => {
    const cleaned = cleanBdPhone(val);
    return /^01[3-9]\d{8}$/.test(cleaned);
  };

  const cleanedPhone = cleanBdPhone(senderNumber);
  const isPhoneFilled = senderNumber.trim().length > 0;
  const isPhoneValid = isValidBdPhone(senderNumber);

  const endpoint = method === "bkash"
    ? `${API_URL}/api/payment/submit-bkash-confirmation`
    : `${API_URL}/api/payment/submit-nagad-confirmation`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderNumber.trim()) {
      setError("অনুগ্রহ করে আপনার সেন্ডার মোবাইল নম্বর দিন (Sender number is required).");
      return;
    }

    if (!isValidBdPhone(senderNumber)) {
      setError("অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01712345678)");
      return;
    }

    if (!transactionId.trim()) {
      setError(`Please enter the Transaction ID from your ${isBkash ? "bKash" : "Nagad"} app.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = getStoredUser();
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          clientName: name,
          clientEmail: email,
          userId: user?.id || null,
          senderMobileNumber: cleanedPhone,
          transactionId: transactionId.trim().toUpperCase(),
          screenshotUrl: screenshotUrl || "",
          screenshotNote: screenshotUrl || "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(data.paymentId);
      } else {
        setError(data.message || "Submission failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-2">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? (isBkash ? "bg-pink-500 text-white" : "bg-orange-500 text-white") : "bg-white/10 text-neutral-500"}`}>{s}</div>
            {s < 2 && <div className={`h-px w-8 transition-all ${step >= 2 ? (isBkash ? "bg-pink-500" : "bg-orange-500") : "bg-white/10"}`} />}
          </div>
        ))}
        <span className="ml-2 text-xs text-neutral-400">{step === 1 ? "Send Money" : "Confirm Payment"}</span>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {/* Merchant info */}
          <div className={`p-4 rounded-xl border ${colorClass} space-y-3`}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">{isBkash ? "bKash" : "Nagad"} Send Money To</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold font-mono tracking-wider">{merchantNumber}</p>
                <p className="text-xs opacity-60 mt-1">Nexora Agency • {isBkash ? "Personal" : "Personal"} Account</p>
              </div>
              <CopyButton text={merchantNumber} />
            </div>
          </div>

          {/* Amount */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Amount to Send</span>
            <span className={`text-xl font-bold font-mono ${isBkash ? "text-pink-300" : "text-orange-300"}`}>
              {plan.priceBDT}
            </span>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {[
              `Open your ${isBkash ? "bKash" : "Nagad"} app`,
              `Go to "Send Money"`,
              `Enter the number: ${merchantNumber}`,
              `Enter amount: ${plan.priceBDT}`,
              `Complete the transaction & note the Transaction ID`,
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-xs text-neutral-400">
                <span className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${isBkash ? "bg-pink-500/20 text-pink-400" : "bg-orange-500/20 text-orange-400"}`}>{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${btnClass} text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2`}
          >
            I&apos;ve Sent the Money →
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.form initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Your Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-teal-500/50 transition-all" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-teal-500/50 transition-all" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-neutral-400 block">
                Your {isBkash ? "bKash" : "Nagad"} Number (Sender)
              </label>
              <span className="text-[10px] font-mono text-neutral-500">BD 11-digit</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-neutral-400 font-mono">
                🇧🇩 +88
              </div>
              <input
                value={senderNumber}
                onChange={e => setSenderNumber(e.target.value.replace(/[^\d+\s-]/g, ""))}
                placeholder="017XXXXXXXX"
                maxLength={16}
                className={`w-full pl-16 pr-10 py-2.5 text-sm rounded-lg bg-white/5 border transition-all font-mono text-white placeholder:text-neutral-600 focus:outline-none ${
                  !isPhoneFilled
                    ? "border-white/10 focus:border-teal-500/50"
                    : isPhoneValid
                    ? "border-emerald-500/50 bg-emerald-500/5 focus:border-emerald-500"
                    : "border-amber-500/50 bg-amber-500/5 focus:border-amber-500"
                }`}
                required
              />
              {isPhoneFilled && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {isPhoneValid ? (
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </div>

            {/* Inline validation message */}
            {isPhoneFilled && (
              <div className="mt-1.5">
                {isPhoneValid ? (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span>✓</span>
                    <span>সঠিক বাংলাদেশী নম্বর (Valid 11-digit BD number: {cleanedPhone})</span>
                  </p>
                ) : (
                  <div className="flex items-center justify-between text-xs text-amber-400">
                    <span>
                      {cleanedPhone.length < 11
                        ? `১১ ডিজিটের নম্বর প্রয়োজন (${cleanedPhone.length}/11 digit) — যেমন: 01712345678`
                        : "013-019 দিয়ে শুরু হওয়া ১১ ডিজিট হতে হবে"}
                    </span>
                    <span className="font-mono text-[11px] opacity-75">{cleanedPhone.length}/11</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Transaction ID</label>
            <input
              value={transactionId}
              onChange={e => setTransactionId(e.target.value)}
              placeholder="e.g. 9N5K3D2W8B"
              className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-teal-500/50 transition-all font-mono tracking-wider"
              required
            />
            <p className="text-xs text-neutral-600 mt-1">Found in your {isBkash ? "bKash" : "Nagad"} app → Transaction History</p>
          </div>

          {/* Screenshot Upload */}
          <div>
            <FileUpload
              folder="payment"
              accept="image/*"
              maxSizeMB={10}
              allowPdf={false}
              label={`Payment Screenshot (optional)`}
              hint="Upload your payment confirmation screenshot"
              value={screenshotUrl}
              onChange={(url) => setScreenshotUrl(url)}
              onRemove={() => setScreenshotUrl("")}
              showPreview={true}
            />
          </div>

          {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">⚠️ {error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="px-4 py-3 rounded-xl bg-white/5 text-neutral-400 text-sm hover:bg-white/10 transition-all">← Back</button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3.5 rounded-xl bg-gradient-to-r ${btnClass} text-white font-bold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {loading ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Submitting...</>
              ) : (
                <>✓ Confirm Payment</>
              )}
            </button>
          </div>
          <p className="text-center text-xs text-neutral-600">Our team will verify your payment within 24 hours</p>
        </motion.form>
      )}
    </div>
  );
}

// ─── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ plan, method, onClose }: { plan: PlanInfo; method: PaymentTab; onClose: () => void }) {
  const isManual = method === "bkash" || method === "nagad";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6 space-y-4"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/20 flex items-center justify-center">
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-8 h-8 text-teal-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <motion.path d="M5 13l4 4L19 7" />
        </motion.svg>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-1">
          {isManual ? "Confirmation Received!" : "Payment Successful!"}
        </h3>
        <p className="text-sm text-neutral-400">
          {isManual
            ? "Our team will verify your payment within 24 hours and reach out to get your project started."
            : `Thank you! Your ${plan.name} subscription is now active.`}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-left space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Plan</span>
          <span className="text-teal-300 font-semibold">{plan.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Payment Method</span>
          <span className="text-white capitalize">{method === "stripe" ? "Card (Stripe)" : method === "bkash" ? "bKash" : "Nagad"}</span>
        </div>
        {isManual && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Status</span>
            <span className="text-amber-400">⏳ Awaiting Verification</span>
          </div>
        )}
      </div>

      <div className="flex gap-2.5 w-full">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-all cursor-pointer"
        >
          Close
        </button>
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold text-sm text-center transition-all shadow-[0_0_15px_rgba(20,184,160,0.3)] flex items-center justify-center gap-1.5"
        >
          Go to Dashboard →
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────
export function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [activeTab, setActiveTab] = useState<PaymentTab>("stripe");
  const [success, setSuccess] = useState(false);
  const [merchantNumbers, setMerchantNumbers] = useState({ bkash: "01XXXXXXXXX", nagad: "01XXXXXXXXX" });

  const fetchMerchantNumbers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/payment/contact-info`);
      const data = await res.json();
      if (data.success) setMerchantNumbers(data.data);
    } catch {}
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMerchantNumbers();
      setSuccess(false);
      setActiveTab("stripe");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, fetchMerchantNumbers]);

  if (!plan) return null;

  const tabs: { id: PaymentTab; label: string; color: string; icon: React.ReactNode }[] = [
    {
      id: "stripe",
      label: "Card / Stripe",
      color: "bg-teal-500/20 text-teal-300 border border-teal-500/30",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
      ),
    },
    {
      id: "bkash",
      label: "bKash",
      color: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
      ),
    },
    {
      id: "nagad",
      label: "Nagad",
      color: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header gradient */}
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all z-10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>

              <div className="p-6">
                {success ? (
                  <SuccessScreen plan={plan} method={activeTab} onClose={onClose} />
                ) : (
                  <>
                    {/* Plan summary */}
                    <div className="mb-6">
                      <p className="text-xs text-teal-400 font-semibold uppercase tracking-widest mb-1">Payment</p>
                      <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                      <p className="text-sm text-neutral-400 mt-0.5">
                        {activeTab === "stripe" ? (
                          <span className="text-2xl font-bold text-teal-300">{plan.priceUSD}</span>
                        ) : (
                          <span className="text-2xl font-bold text-teal-300">{plan.priceBDT}</span>
                        )}
                        <span className="ml-2 text-sm">{activeTab === "stripe" ? "USD" : "BDT"}</span>
                      </p>
                    </div>

                    {/* Payment method tabs */}
                    <div className="flex gap-2 mb-6">
                      {tabs.map(tab => (
                        <TabButton
                          key={tab.id}
                          active={activeTab === tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          icon={tab.icon}
                          label={tab.label}
                          color={tab.color}
                        />
                      ))}
                    </div>

                    {/* Tab content */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {activeTab === "stripe" && (
                          <StripeForm plan={plan} onSuccess={() => setSuccess(true)} />
                        )}
                        {activeTab === "bkash" && (
                          <ManualPaymentForm
                            plan={plan}
                            method="bkash"
                            merchantNumber={merchantNumbers.bkash}
                            onSuccess={() => setSuccess(true)}
                          />
                        )}
                        {activeTab === "nagad" && (
                          <ManualPaymentForm
                            plan={plan}
                            method="nagad"
                            merchantNumber={merchantNumbers.nagad}
                            onSuccess={() => setSuccess(true)}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
