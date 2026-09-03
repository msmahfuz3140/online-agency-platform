"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { useToastPortal } from "../ui/useToastPortal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const projectTopics = [
  "Custom Web Application",
  "AI Website Builder Engine",
  "SaaS Platform Development",
  "High-Converting Landing Page",
  "UI/UX Design & Architecture",
  "Website Redesign & Performance",
  "Other Inquiry",
];

interface FormData {
  name: string;
  email: string;
  subject: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactFormSection() {
  const { toast, ToastPortal } = useToastPortal();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "Custom Web Application",
    company: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@nexora.agency");
    setCopiedEmail(true);
    toast("info", "Email Copied", "contact@nexora.agency copied to your clipboard.");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Please provide your name (at least 2 characters).";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = "Please enter a valid work email address.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errs.message = "Please write a message with at least 5 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast("error", "Validation Error", "Please fill in all required fields accurately.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Server could not process your submission.");
      }

      // Success
      setIsSubmitted(true);
      toast(
        "success",
        "Inquiry Received Successfully! 🚀",
        "Our engineering team has received your message and will reply within 2-4 hours."
      );

      // Reset form state
      setFormData({
        name: "",
        email: "",
        subject: "Custom Web Application",
        company: "",
        message: "",
      });
      setErrors({});
    } catch (err: any) {
      console.error("Contact form error:", err);
      toast(
        "error",
        "Failed to Send Message",
        err.message || "An unexpected error occurred. Please try again or email us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact-form" className="py-16 sm:py-24">
      {/* Toast Notification Mount */}
      <ToastPortal />

      <div className="grid lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
        {/* Left Column: Direct Contacts & Channels */}
        <div className="lg:col-span-5 space-y-6">
          <FadeInSection>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
                Connect Directly
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                We're Here to Accelerate Your Digital Growth
              </h2>
              <p className="mt-3 text-sm text-muted-fg leading-relaxed">
                Skip the back-and-forth email chains. Reach out through your preferred channel, or book a live 15-minute scoping session.
              </p>
            </div>
          </FadeInSection>

          {/* Contact Details Cards */}
          <div className="space-y-3.5">
            {/* Email Card */}
            <Card padding="md" className="border-border/80 bg-surface-1/70 backdrop-blur-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 text-lg flex-shrink-0">
                    ✉️
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-fg">Direct Email Desk</p>
                    <p className="text-sm font-semibold text-foreground font-mono">
                      contact@nexora.agency
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="text-xs px-2.5 py-1 rounded-md border border-border bg-surface-2 hover:bg-surface-3 text-neutral-300 transition-colors"
                >
                  {copiedEmail ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </Card>

            {/* Discovery Call Card */}
            <Card padding="md" className="border-primary-500/30 bg-primary-500/5 backdrop-blur-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-300 text-lg flex-shrink-0">
                    📅
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-muted-fg">Instant Scheduling</p>
                      <Badge variant="primary" size="sm">Available Today</Badge>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      15-Min Scoping & Discovery Call
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="primary" asChild>
                  <Link href="/#discovery-call">Book Call →</Link>
                </Button>
              </div>
            </Card>

            {/* Location & Timezone Card */}
            <Card padding="md" className="border-border/80 bg-surface-1/70 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-lg flex-shrink-0">
                  🌐
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-fg">Headquarters & Availability</p>
                  <p className="text-sm font-semibold text-foreground">
                    Dhaka, Bangladesh (GMT+6) • Global Distributed Edge
                  </p>
                  <p className="text-xs text-primary-400 mt-0.5">
                    Operating 24/7 with continuous deployment pipelines
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Testimonial Quote */}
          <div className="p-4 rounded-2xl border border-border/80 bg-surface-1/40 text-xs text-muted-fg leading-relaxed">
            <p className="italic">
              "Nexora replied within 40 minutes on a Sunday, had our technical architecture outlined the next day, and launched our SaaS ahead of schedule."
            </p>
            <div className="mt-3 flex items-center gap-2 text-foreground font-semibold">
              <span className="h-5 w-5 rounded-full bg-primary-500/20 text-primary-400 text-[10px] font-bold flex items-center justify-center">
                SJ
              </span>
              <span>Samir Jenkins, Founder @ Finflow Inc.</span>
            </div>
          </div>
        </div>

        {/* Right Column: The Contact Form */}
        <div className="lg:col-span-7">
          <Card
            padding="lg"
            className="border-border/80 bg-surface-1/90 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.4)] relative overflow-hidden"
          >
            {/* Header */}
            <div className="mb-6">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                Send Us a Project Brief
              </h3>
              <p className="text-xs sm:text-sm text-muted-fg mt-1">
                Required fields are marked with an asterisk (<span className="text-primary-400">*</span>).
              </p>
            </div>

            {/* In-Form Success Banner */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-left flex items-start gap-3"
                >
                  <div className="h-7 w-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="flex-1 min-w-0 text-xs text-emerald-300">
                    <p className="font-bold text-sm text-emerald-200">
                      Message Dispatched to Engineering!
                    </p>
                    <p className="mt-1 leading-relaxed text-emerald-300/90">
                      Thank you for contacting Nexora. A senior engineer will review your inquiry and reach back out at your provided email within 2-4 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-2 text-xs font-semibold text-emerald-200 hover:underline"
                    >
                      Send another inquiry →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Row 1: Name & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-foreground mb-1.5"
                  >
                    Your Name <span className="text-primary-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
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

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-foreground mb-1.5"
                  >
                    Work Email <span className="text-primary-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
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
              </div>

              {/* Row 2: Subject & Company */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-foreground mb-1.5"
                  >
                    Project Category
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    disabled={isSubmitting}
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {projectTopics.map((topic) => (
                      <option key={topic} value={topic} className="bg-neutral-900 text-foreground">
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-company"
                    className="block text-xs font-semibold text-foreground mb-1.5"
                  >
                    Company / Organization <span className="text-muted-fg font-normal">(Optional)</span>
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    disabled={isSubmitting}
                    placeholder="e.g. Acme Corp"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface-2 text-sm text-foreground placeholder:text-muted-fg/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Row 3: Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-foreground"
                  >
                    Project Details & Scope <span className="text-primary-400">*</span>
                  </label>
                  <span className="text-[11px] text-muted-fg">
                    {formData.message.length} / 5000
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  disabled={isSubmitting}
                  placeholder="Describe your project, target audience, timeline, or any specific requirements you'd like us to know..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface-2 text-sm text-foreground placeholder:text-muted-fg/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-y ${
                    errors.message ? "border-red-500/80 bg-red-500/5" : "border-border"
                  } disabled:opacity-50`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{errors.message}</p>
                )}
              </div>

              {/* Submit Button & Guarantees */}
              <div className="pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="w-full shadow-[0_0_24px_rgba(20,184,160,0.3)] text-sm font-semibold"
                >
                  {isSubmitting ? "Delivering Message..." : "Send Project Inquiry →"}
                </Button>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-fg">
                  <span>🔒 256-bit Encrypted</span>
                  <span>•</span>
                  <span>⚡ 2-4h Response SLA</span>
                  <span>•</span>
                  <span>🛡️ Strict Confidentiality NDA</span>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Section>
  );
}
