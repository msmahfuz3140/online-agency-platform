"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToastPortal } from "@/components/ui/useToastPortal";
import { signUpEmail, signInSocial } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}

export default function RegisterPage() {
  const { toast, ToastPortal } = useToastPortal();

  // Registration step: "form" -> "otp"
  const [step, setStep] = useState<"form" | "otp">("form");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);

  // OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(60);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for OTP resend cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // Focus the first OTP box when entering OTP step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  const handleSocialSignUp = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    try {
      const res = await signInSocial(provider);
      if (!res.success) {
        toast(
          "error",
          `${provider === "google" ? "Google" : "GitHub"} Sign Up Failed`,
          res.error || "Could not complete registration."
        );
        setSocialLoading(null);
      }
    } catch (err: any) {
      toast("error", "Sign Up Error", err?.message || "Failed to initialize social registration.");
      setSocialLoading(null);
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Full name must be at least 2 characters.";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = "Please provide a valid email address.";
    }

    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    if (!formData.agreedToTerms) {
      errs.terms = "You must accept the terms of service to continue.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof FormErrors] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  // Step 1: Submit Form -> Send OTP to Gmail
  const handleInitiateSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast("error", "Validation Error", "Please review the form fields marked in red.");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          name: formData.name.trim(),
          type: "registration",
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        const msg = json.message || "Could not send verification code. Please check your email.";
        setErrors({ general: msg });
        toast("error", "Registration Check", msg);
        setIsSubmitting(false);
        return;
      }

      // Success: advance to OTP verification step
      setStep("otp");
      setResendCooldown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError(null);
      toast(
        "success",
        "Verification Code Sent 🔐",
        `We've sent a 6-digit code to ${formData.email.trim()}. Check your inbox.`
      );
    } catch (err: any) {
      console.error("OTP send error:", err);
      setErrors({ general: "Network connection error. Please try again." });
      toast("error", "Connection Error", "Could not reach authentication servers.");
    }
    setIsSubmitting(false);
  };

  // OTP Input Handling
  const handleOtpChange = (index: number, val: string) => {
    // Only accept numbers
    const clean = val.replace(/\D/g, "");
    if (!clean && val !== "") return;

    const newDigits = [...otpDigits];
    newDigits[index] = clean ? clean.slice(-1) : "";
    setOtpDigits(newDigits);
    setOtpError(null);

    // Auto-advance
    if (clean && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits are entered
    if (clean && index === 5 && newDigits.every((d) => d !== "")) {
      handleVerifyAndRegister(newDigits.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setOtpDigits(newDigits);
    setOtpError(null);

    // Focus last filled or first empty
    const nextIdx = Math.min(pasted.length, 5);
    otpInputsRef.current[nextIdx]?.focus();

    if (pasted.length === 6) {
      handleVerifyAndRegister(pasted);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setOtpLoading(true);
    setOtpError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          name: formData.name.trim(),
          type: "registration",
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setResendCooldown(60);
        toast("success", "New Code Dispatched", `A fresh 6-digit code has been sent to ${formData.email}.`);
      } else {
        setOtpError(json.message || "Failed to resend code.");
      }
    } catch {
      setOtpError("Network error. Could not resend code.");
    }
    setOtpLoading(false);
  };

  // Step 2: Verify OTP -> Complete Better Auth Registration
  const handleVerifyAndRegister = async (fullOtp?: string) => {
    const code = fullOtp || otpDigits.join("");
    if (code.length !== 6) {
      setOtpError("Please enter the complete 6-digit code.");
      return;
    }

    setOtpLoading(true);
    setOtpError(null);

    try {
      // 1. Verify OTP with Backend
      const verifyRes = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          otp: code,
        }),
      });

      const verifyJson = await verifyRes.json();

      if (!verifyRes.ok || !verifyJson.success) {
        setOtpError(verifyJson.message || "Invalid or expired verification code.");
        setOtpLoading(false);
        return;
      }

      // 2. Complete Account Creation with Verified Email
      const res = await signUpEmail({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!res.success) {
        setOtpError(res.error || "Account could not be activated.");
        setOtpLoading(false);
        return;
      }

      // Success!
      toast(
        "success",
        "Account Verified & Created! 🎉",
        `Welcome to Nexora, ${formData.name.trim()}! Please sign in with your credentials to access your workspace.`
      );

      if (typeof window !== "undefined") {
        window.localStorage.removeItem("nexora_auth_user");
        window.location.href = `/login?registered=true&email=${encodeURIComponent(formData.email.trim())}`;
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setOtpError("Verification error. Please try again.");
    }
    setOtpLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      {/* Toast Notification Container */}
      <ToastPortal />

      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-amber-500/8 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Cyber Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(20,184,160,0.12) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="w-full max-w-4xl mx-auto">
        {/* Top Branding Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-heading font-black text-black text-base shadow-[0_0_20px_rgba(20,184,160,0.4)] group-hover:scale-105 transition-transform">
              N
            </span>
            <span className="font-heading font-bold text-lg text-foreground tracking-tight">
              Nexora<span className="text-primary-400">.</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-muted-fg hover:text-foreground transition-colors flex items-center gap-1"
          >
            <span>←</span>
            <span>Back to Main Site</span>
          </Link>
        </div>

        {/* Auth Split Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Perks and Value Prop */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-6">
            <div>
              <Badge variant="primary" size="sm" className="mb-3">
                Verified Founder Tier
              </Badge>
              <h1 className="font-heading text-3xl font-extrabold text-foreground leading-tight">
                Start Building With <span className="gradient-text">Nexora</span>
              </h1>
              <p className="mt-3 text-sm text-muted-fg leading-relaxed">
                Create a verified account to test our AI generation engine, manage your web development sprints, and export production code.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { icon: "🔐", title: "Gmail OTP Verified", desc: "Enterprise 2FA-ready account protection" },
                { icon: "🎁", title: "5 Free AI Credits", desc: "Generate full websites instantly upon signup" },
                { icon: "⚡", title: "Instant Layout Generator", desc: "Structured React/Next.js component mapping" },
                { icon: "💎", title: "100% Code Ownership", desc: "Export clean Next.js code with zero lock-in" },
              ].map((p) => (
                <div
                  key={p.title}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-surface-1/50 backdrop-blur-sm"
                >
                  <span className="text-lg">{p.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-foreground">{p.title}</p>
                    <p className="text-[11px] text-muted-fg">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Register Card with 2-Step Flow */}
          <div className="lg:col-span-7">
            <Card
              padding="lg"
              className="border-border/80 bg-surface-1/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-6 sm:p-8"
            >
              <AnimatePresence mode="wait">
                {step === "form" ? (
                  /* ─── STEP 1: REGISTRATION FORM ──────────────────────────────── */
                  <motion.div
                    key="step-form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6 text-center sm:text-left">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h2 className="font-heading text-2xl font-bold text-foreground">
                          Create Account
                        </h2>
                        <Badge variant="success" size="sm">
                          5 Credits Gifted
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-muted-fg">
                        Get started in 30 seconds. An email verification code will be sent to your Gmail.
                      </p>
                    </div>

                    {/* General Form Error Banner */}
                    {errors.general && (
                      <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{errors.general}</span>
                      </div>
                    )}

                    {/* Social Registration Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <button
                        type="button"
                        id="google-register-btn"
                        onClick={() => handleSocialSignUp("google")}
                        disabled={isSubmitting || socialLoading !== null}
                        className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/80 bg-surface-2/80 hover:bg-surface-3 hover:border-primary-500/40 text-xs font-semibold text-foreground transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm group"
                      >
                        {socialLoading === "google" ? (
                          <span className="inline-block w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                        )}
                        <span>{socialLoading === "google" ? "Connecting..." : "Google"}</span>
                      </button>

                      <button
                        type="button"
                        id="github-register-btn"
                        onClick={() => handleSocialSignUp("github")}
                        disabled={isSubmitting || socialLoading !== null}
                        className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/80 bg-surface-2/80 hover:bg-surface-3 hover:border-primary-500/40 text-xs font-semibold text-foreground transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm group"
                      >
                        {socialLoading === "github" ? (
                          <span className="inline-block w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4 shrink-0 fill-current text-white transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                        )}
                        <span>{socialLoading === "github" ? "Connecting..." : "GitHub"}</span>
                      </button>
                    </div>

                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/80" />
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider font-mono">
                        <span className="bg-surface-1 px-3 text-muted-fg">
                          Or register with email verification
                        </span>
                      </div>
                    </div>

                    {/* Email Registration Form */}
                    <form onSubmit={handleInitiateSignUp} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">
                          Full Name <span className="text-primary-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. David Vance"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-foreground bg-surface-2/60 placeholder:text-muted-fg/60 focus:outline-none transition-all ${
                            errors.name ? "border-red-500/50 bg-red-500/5" : "border-border/80 focus:border-primary-500/50 focus:bg-surface-2"
                          }`}
                        />
                        {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">
                          Gmail / Work Email <span className="text-primary-400">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="yourname@gmail.com"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-foreground bg-surface-2/60 placeholder:text-muted-fg/60 focus:outline-none transition-all ${
                            errors.email ? "border-red-500/50 bg-red-500/5" : "border-border/80 focus:border-primary-500/50 focus:bg-surface-2"
                          }`}
                        />
                        {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email}</p>}
                      </div>

                      {/* Password */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">
                            Password <span className="text-primary-400">*</span>
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min 6 chars"
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-foreground bg-surface-2/60 placeholder:text-muted-fg/60 focus:outline-none transition-all ${
                              errors.password ? "border-red-500/50 bg-red-500/5" : "border-border/80 focus:border-primary-500/50 focus:bg-surface-2"
                            }`}
                          />
                          {errors.password && <p className="mt-1 text-[11px] text-red-400">{errors.password}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">
                            Confirm Password <span className="text-primary-400">*</span>
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repeat password"
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-foreground bg-surface-2/60 placeholder:text-muted-fg/60 focus:outline-none transition-all ${
                              errors.confirmPassword ? "border-red-500/50 bg-red-500/5" : "border-border/80 focus:border-primary-500/50 focus:bg-surface-2"
                            }`}
                          />
                          {errors.confirmPassword && <p className="mt-1 text-[11px] text-red-400">{errors.confirmPassword}</p>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-muted-fg hover:text-foreground">
                          <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            className="rounded border-border bg-surface-2 accent-primary-500"
                          />
                          <span>Show passwords</span>
                        </label>
                      </div>

                      {/* Terms */}
                      <div>
                        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-muted-fg pt-1">
                          <input
                            type="checkbox"
                            name="agreedToTerms"
                            checked={formData.agreedToTerms}
                            onChange={handleChange}
                            className="mt-0.5 rounded border-border bg-surface-2 accent-primary-500"
                          />
                          <span>
                            I agree to the{" "}
                            <Link href="/terms" className="text-primary-400 hover:underline">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primary-400 hover:underline">
                              Privacy Policy
                            </Link>
                            .
                          </span>
                        </label>
                        {errors.terms && <p className="mt-1 text-[11px] text-red-400">{errors.terms}</p>}
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full rounded-xl shadow-[0_0_24px_rgba(20,184,160,0.3)] mt-2 font-semibold text-xs"
                        loading={isSubmitting}
                      >
                        Verify Email &amp; Create Account →
                      </Button>
                    </form>

                    <p className="mt-6 text-center text-xs text-muted-fg">
                      Already have an account?{" "}
                      <Link href="/login" className="font-semibold text-primary-400 hover:underline">
                        Sign In here
                      </Link>
                    </p>
                  </motion.div>
                ) : (
                  /* ─── STEP 2: OTP VERIFICATION SCREEN ────────────────────────── */
                  <motion.div
                    key="step-otp"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="text-center space-y-5"
                  >
                    {/* Security Badge Header */}
                    <div className="flex flex-col items-center">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-400/20 to-primary-600/10 border border-primary-500/30 flex items-center justify-center text-2xl mb-3 shadow-[0_0_24px_rgba(20,184,160,0.25)]">
                        🔐
                      </div>
                      <Badge variant="primary" size="sm" className="mb-2">
                        GMAIL 2FA VERIFICATION
                      </Badge>
                      <h2 className="font-heading text-2xl font-bold text-foreground">
                        Check Your Inbox
                      </h2>
                      <p className="mt-1.5 text-xs text-muted-fg max-w-sm mx-auto">
                        We sent a 6-digit security code to{" "}
                        <strong className="text-primary-300 font-mono">{formData.email}</strong>. Enter it below to activate your account.
                      </p>
                    </div>

                    {/* OTP Error Notice */}
                    {otpError && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 max-w-sm mx-auto">
                        {otpError}
                      </div>
                    )}

                    {/* 6-Digit OTP Inputs */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpInputsRef.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={handleOtpPaste}
                          className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono font-bold text-xl rounded-xl border transition-all select-none ${
                            digit
                              ? "border-primary-400 bg-primary-500/15 text-primary-300 shadow-[0_0_12px_rgba(20,184,160,0.25)]"
                              : "border-border/80 bg-surface-2/70 text-foreground focus:border-primary-500/50 focus:bg-surface-2"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="space-y-3 pt-2">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => handleVerifyAndRegister()}
                        loading={otpLoading}
                        className="w-full rounded-xl shadow-[0_0_24px_rgba(20,184,160,0.3)] font-semibold text-xs"
                      >
                        Verify &amp; Activate Account 🎉
                      </Button>

                      {/* Resend Timer & Edit Email */}
                      <div className="flex items-center justify-between text-xs text-muted-fg pt-2 px-1">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={resendCooldown > 0 || otpLoading}
                          className={`cursor-pointer transition-colors ${
                            resendCooldown > 0
                              ? "text-muted-fg cursor-not-allowed"
                              : "text-primary-400 hover:text-primary-300 font-semibold underline"
                          }`}
                        >
                          {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Verification Code ↻"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setStep("form")}
                          disabled={otpLoading}
                          className="text-muted-fg hover:text-foreground underline cursor-pointer text-xs"
                        >
                          Change Email Address
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
