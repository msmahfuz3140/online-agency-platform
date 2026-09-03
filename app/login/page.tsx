"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToastPortal } from "@/components/ui/useToastPortal";
import { signInEmail } from "@/lib/auth-client";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { toast, ToastPortal } = useToastPortal();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = "Please enter a valid work email address.";
    }

    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
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
      toast("error", "Invalid Credentials", "Please address the errors marked below.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signInEmail({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!res.success) {
        setErrors({ general: res.error || "Invalid email or password." });
        toast(
          "error",
          "Authentication Failed",
          res.error || "Please check your login credentials."
        );
        setIsSubmitting(false);
        return;
      }

      // Success
      toast("success", "Welcome Back! 👋", `Logged in as ${res.user?.name || res.user?.email}`);

      // Small delay for toast visibility before redirect
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: any) {
      console.error("Login submission error:", err);
      setErrors({ general: "Network connection error. Please try again." });
      toast("error", "Connection Error", "Could not contact the authentication server.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      {/* Toast Notification Container */}
      <ToastPortal />

      {/* Futuristic Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-amber-500/8 rounded-full blur-[120px] pointer-events-none -z-10" />

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
          {/* Left Column: Value Prop */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-6">
            <div>
              <Badge variant="primary" size="sm" className="mb-3">
                Client & Creator Workspace
              </Badge>
              <h1 className="font-heading text-3xl font-extrabold text-foreground leading-tight">
                Log In to Your <span className="gradient-text">Command Center</span>
              </h1>
              <p className="mt-3 text-sm text-muted-fg leading-relaxed">
                Access your AI website generations, ongoing client projects, design deliverables, and developer collaboration desk.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { icon: "⚡", title: "AI Website Generator", desc: "Build & export layouts in seconds" },
                { icon: "💎", title: "100% Code Ownership", desc: "Full GitHub repository access" },
                { icon: "🛡️", title: "Enterprise Security", desc: "Encrypted session authentication" },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-surface-1/50 backdrop-blur-sm"
                >
                  <span className="text-lg">{f.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-foreground">{f.title}</p>
                    <p className="text-[11px] text-muted-fg">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Demo Credentials hint */}
            <div className="p-3.5 rounded-xl border border-primary-500/20 bg-primary-500/5 text-xs text-primary-300">
              <span className="font-bold">💡 Demo Credentials:</span>
              <p className="mt-1 text-[11px] text-muted-fg font-mono">
                admin@nexora.agency / Admin123!
              </p>
            </div>
          </div>

          {/* Right Column: Login Card */}
          <div className="lg:col-span-7">
            <Card
              padding="lg"
              className="border-border/80 bg-surface-1/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-6 sm:p-8"
            >
              <div className="mb-6 text-center sm:text-left">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Sign In
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-fg">
                  Enter your credentials to enter your workspace.
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
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-semibold text-foreground mb-1.5"
                  >
                    Email Address <span className="text-primary-400">*</span>
                  </label>
                  <input
                    id="login-email"
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

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-semibold text-foreground"
                    >
                      Password <span className="text-primary-400">*</span>
                    </label>
                    <span className="text-[11px] text-primary-400 hover:text-primary-300 transition-colors cursor-pointer">
                      Forgot password?
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      disabled={isSubmitting}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border bg-surface-2 text-sm text-foreground placeholder:text-muted-fg/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all ${
                        errors.password ? "border-red-500/80 bg-red-500/5" : "border-border"
                      } disabled:opacity-50`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-fg hover:text-foreground transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-400 font-medium">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="rounded border-border bg-surface-2 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-xs text-muted-fg">Stay signed in for 7 days</span>
                  </label>
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
                    {isSubmitting ? "Authenticating..." : "Sign In to Dashboard →"}
                  </Button>
                </div>
              </form>

              {/* Toggle to Register */}
              <div className="mt-6 pt-5 border-t border-border/60 text-center">
                <p className="text-xs text-muted-fg">
                  Don't have an account yet?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Sign up for free (5 AI credits) →
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
