"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToastPortal } from "@/components/ui/useToastPortal";
import { signUpEmail } from "@/lib/auth-client";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { toast, ToastPortal } = useToastPortal();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast("error", "Validation Error", "Please review the form fields marked in red.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signUpEmail({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!res.success) {
        setErrors({ general: res.error || "Registration could not be completed." });
        toast(
          "error",
          "Registration Failed",
          res.error || "Please check your information and try again."
        );
        setIsSubmitting(false);
        return;
      }

      // Success
      toast(
        "success",
        "Account Created! 🚀",
        `Welcome to Nexora, ${formData.name.trim()}! 5 AI credits have been credited.`
      );

      // Brief delay for toast animation
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: any) {
      console.error("Registration error:", err);
      setErrors({ general: "Network connection error. Please try again." });
      toast("error", "Connection Error", "Could not reach authentication servers.");
      setIsSubmitting(false);
    }
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
                Free Developer & Founder Tier
              </Badge>
              <h1 className="font-heading text-3xl font-extrabold text-foreground leading-tight">
                Start Building With <span className="gradient-text">Nexora</span>
              </h1>
              <p className="mt-3 text-sm text-muted-fg leading-relaxed">
                Create an account to test our AI generation engine, manage your web development sprints, and export production code.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { icon: "🎁", title: "5 Free AI Credits", desc: "Generate full websites instantly upon signup" },
                { icon: "⚡", title: "Instant Layout Generator", desc: "Structured React/Next.js component mapping" },
                { icon: "💎", title: "100% Code Ownership", desc: "Export clean Next.js code with zero lock-in" },
                { icon: "🔒", title: "No Credit Card Required", desc: "Explore all free tier capabilities risk-free" },
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

          {/* Right Column: Register Card */}
          <div className="lg:col-span-7">
            <Card
              padding="lg"
              className="border-border/80 bg-surface-1/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-6 sm:p-8"
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
                  Get started in 30 seconds. No credit card needed.
                </p>
              </div>

              {/* General Form Error Banner */}
              {errors.general && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="register-name"
                    className="block text-xs font-semibold text-foreground mb-1.5"
                  >
                    Full Name <span className="text-primary-400">*</span>
                  </label>
                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface-2 text-sm text-foreground placeholder:text-muted-fg/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all ${
                      errors.name ? "border-red-500/80 bg-red-500/5" : "border-border"
                    } disabled:opacity-50`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="register-email"
                    className="block text-xs font-semibold text-foreground mb-1.5"
                  >
                    Work Email Address <span className="text-primary-400">*</span>
                  </label>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface-2 text-sm text-foreground placeholder:text-muted-fg/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all ${
                      errors.email ? "border-red-500/80 bg-red-500/5" : "border-border"
                    } disabled:opacity-50`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400 font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Password Fields (Grid) */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="register-password"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Password <span className="text-primary-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="register-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        disabled={isSubmitting}
                        placeholder="Min. 6 chars"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 pr-9 rounded-xl border bg-surface-2 text-sm text-foreground placeholder:text-muted-fg/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all ${
                          errors.password ? "border-red-500/80 bg-red-500/5" : "border-border"
                        } disabled:opacity-50`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-fg hover:text-foreground transition-colors p-1"
                      >
                        {showPassword ? "👁️" : "🙈"}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-[11px] text-red-400 font-medium">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="register-confirm-password"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Confirm Password <span className="text-primary-400">*</span>
                    </label>
                    <input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      disabled={isSubmitting}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface-2 text-sm text-foreground placeholder:text-muted-fg/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all ${
                        errors.confirmPassword ? "border-red-500/80 bg-red-500/5" : "border-border"
                      } disabled:opacity-50`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-[11px] text-red-400 font-medium">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="rounded border-border bg-surface-2 text-primary-500 focus:ring-primary-500 mt-0.5"
                    />
                    <span className="text-xs text-muted-fg leading-snug">
                      I agree to the{" "}
                      <span className="text-primary-400 hover:underline">Terms of Service</span> and{" "}
                      <span className="text-primary-400 hover:underline">Privacy Policy</span>.
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-xs text-red-400 font-medium">{errors.terms}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    size="lg"
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    className="w-full shadow-[0_0_24px_rgba(20,184,160,0.3)] text-sm font-semibold"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Free Account →"}
                  </Button>
                </div>
              </form>

              {/* Toggle to Login */}
              <div className="mt-6 pt-5 border-t border-border/60 text-center">
                <p className="text-xs text-muted-fg">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Sign in here →
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
