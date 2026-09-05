"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToastPortal } from "@/components/ui/useToastPortal";
import { signInEmail, signInSocial } from "@/lib/auth-client";

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
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      const isRegistered = params.get("registered");
      const emailParam = params.get("email");

      if (emailParam) {
        setFormData((prev) => ({ ...prev, email: decodeURIComponent(emailParam) }));
      }

      if (isRegistered === "true") {
        toast(
          "success",
          "Account Created! 🎉",
          "Registration completed. Please enter your password to sign in."
        );
      } else if (urlError) {
        toast("error", "Sign In Alert", decodeURIComponent(urlError));
      }
    }
  }, [toast]);

  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    try {
      const res = await signInSocial(provider);
      if (!res.success) {
        toast(
          "error",
          `${provider === "google" ? "Google" : "GitHub"} Login Failed`,
          res.error || "Could not complete social sign in."
        );
        setSocialLoading(null);
      }
    } catch (err: any) {
      toast("error", "Sign In Error", err?.message || "Failed to initiate social login.");
      setSocialLoading(null);
    }
  };

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

      // Check role: if staff/admin, redirect directly to /admin, otherwise /dashboard
      const userRole = res.user?.role || "user";
      const isStaff = ["superadmin", "admin", "manager", "developer", "support", "editor"].includes(userRole);

      // Small delay for toast visibility, auto-refresh and redirect
      setTimeout(() => {
        router.refresh();
        router.push(isStaff ? "/admin" : "/dashboard");
      }, 400);
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

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  id="google-login-btn"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isSubmitting || socialLoading !== null}
                  className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/80 bg-surface-2/80 hover:bg-surface-3 hover:border-primary-500/40 text-xs font-semibold text-foreground transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm group"
                >
                  {socialLoading === "google" ? (
                    <span className="inline-block w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>{socialLoading === "google" ? "Connecting..." : "Google"}</span>
                </button>

                <button
                  type="button"
                  id="github-login-btn"
                  onClick={() => handleSocialLogin("github")}
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

              {/* Elegant Divider */}
              <div className="relative flex items-center justify-center mb-6">
                <div className="border-t border-border/80 w-full" />
                <span className="bg-surface-1 px-3 text-[11px] uppercase tracking-wider text-muted-fg font-semibold relative shrink-0">
                  Or continue with email
                </span>
              </div>

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
