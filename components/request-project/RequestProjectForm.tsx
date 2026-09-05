"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToastPortal } from "@/components/ui/useToastPortal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  // Step 1 – Contact
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  // Step 2 – Project
  projectTitle: string;
  projectType: string;
  requirements: string;
  techStack: string[];
  referenceUrls: string;
  // Step 3 – Scoping
  budget: string;
  timeline: string;
}

interface FormErrors {
  clientName?: string;
  clientEmail?: string;
  projectTitle?: string;
  projectType?: string;
  requirements?: string;
  budget?: string;
  timeline?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECT_TYPES = [
  { value: "web-app", label: "Web Application", icon: "🌐" },
  { value: "saas-platform", label: "SaaS Platform", icon: "☁️" },
  { value: "ai-integration", label: "AI Integration", icon: "🤖" },
  { value: "ecommerce", label: "E-commerce", icon: "🛍️" },
  { value: "mobile-app", label: "Mobile App", icon: "📱" },
  { value: "api-backend", label: "API / Backend", icon: "⚙️" },
  { value: "ui-ux-design", label: "UI/UX Design", icon: "🎨" },
  { value: "other", label: "Other", icon: "💡" },
];

const BUDGET_OPTIONS = [
  { value: "under-5k", label: "< $5,000", desc: "Starter / MVP" },
  { value: "5k-15k", label: "$5k – $15k", desc: "Small Product" },
  { value: "15k-50k", label: "$15k – $50k", desc: "Full-Scale Build" },
  { value: "50k-100k", label: "$50k – $100k", desc: "Enterprise Feature" },
  { value: "over-100k", label: "$100k+", desc: "Large Platform" },
  { value: "discuss", label: "Let's Discuss", desc: "Open to Scoping" },
];

const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP", desc: "Expedited delivery" },
  { value: "1-month", label: "1 Month", desc: "Fast turnaround" },
  { value: "1-3-months", label: "1–3 Months", desc: "Standard timeline" },
  { value: "3-6-months", label: "3–6 Months", desc: "Complex project" },
  { value: "6-plus-months", label: "6+ Months", desc: "Large-scale build" },
  { value: "flexible", label: "Flexible", desc: "No hard deadline" },
];

const TECH_STACK_OPTIONS = [
  "Next.js", "React", "Node.js", "TypeScript", "Python",
  "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST API",
  "AWS", "Vercel", "Docker", "Kubernetes", "Stripe",
];

// ─── Sub-components ────────────────────────────────────────────────────────────
function StepIndicator({ step, totalSteps }: { step: number; totalSteps: number }) {
  const steps = ["Contact", "Project", "Scoping"];
  return (
    <div className="flex items-center justify-center gap-0 mb-10 w-full">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < step;
        const active = idx === step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                  ${done ? "bg-primary-500 border-primary-500 text-white" : ""}
                  ${active ? "bg-primary-500/20 border-primary-500 text-primary-400 shadow-[0_0_14px_rgba(20,184,160,0.5)]" : ""}
                  ${!done && !active ? "bg-neutral-800 border-neutral-700 text-neutral-500" : ""}
                `}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : idx}
              </div>
              <span className={`text-xs font-medium transition-colors duration-300 ${active ? "text-primary-400" : done ? "text-primary-500/70" : "text-neutral-600"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all duration-500 ${done ? "bg-primary-500" : "bg-neutral-800"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function InputField({
  label, id, required, error, children,
}: {
  label: string; id: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-neutral-300">
        {label} {required && <span className="text-primary-400">*</span>}
      </label>
      {children}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-400 flex items-center gap-1"
          >
            <span>⚠</span> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  "w-full bg-neutral-900/60 border border-neutral-700/60 rounded-xl px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200";

// ─── Steps ────────────────────────────────────────────────────────────────────
function Step1({
  data, errors, onChange,
}: {
  data: FormData; errors: FormErrors; onChange: (field: keyof FormData, val: string) => void;
}) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Your Contact Details</h3>
        <p className="text-sm text-neutral-500">We'll use this to get back to you with a detailed proposal.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="Full Name" id="clientName" required error={errors.clientName}>
          <input
            id="clientName"
            type="text"
            placeholder="Alex Johnson"
            value={data.clientName}
            onChange={(e) => onChange("clientName", e.target.value)}
            className={`${inputClass} ${errors.clientName ? "border-red-500/60 focus:ring-red-500/20 focus:border-red-500" : ""}`}
          />
        </InputField>
        <InputField label="Work Email" id="clientEmail" required error={errors.clientEmail}>
          <input
            id="clientEmail"
            type="email"
            placeholder="alex@company.com"
            value={data.clientEmail}
            onChange={(e) => onChange("clientEmail", e.target.value)}
            className={`${inputClass} ${errors.clientEmail ? "border-red-500/60 focus:ring-red-500/20 focus:border-red-500" : ""}`}
          />
        </InputField>
        <InputField label="Phone Number" id="clientPhone">
          <input
            id="clientPhone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={data.clientPhone}
            onChange={(e) => onChange("clientPhone", e.target.value)}
            className={inputClass}
          />
        </InputField>
        <InputField label="Company / Organization" id="clientCompany">
          <input
            id="clientCompany"
            type="text"
            placeholder="Acme Inc."
            value={data.clientCompany}
            onChange={(e) => onChange("clientCompany", e.target.value)}
            className={inputClass}
          />
        </InputField>
      </div>
    </motion.div>
  );
}

function Step2({
  data, errors, onChange, onTechToggle,
}: {
  data: FormData; errors: FormErrors;
  onChange: (field: keyof FormData, val: string) => void;
  onTechToggle: (tech: string) => void;
}) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Project Details</h3>
        <p className="text-sm text-neutral-500">Tell us what you want to build — the more detail, the better.</p>
      </div>
      <InputField label="Project Title" id="projectTitle" required error={errors.projectTitle}>
        <input
          id="projectTitle"
          type="text"
          placeholder="AI-powered SaaS CRM Platform"
          value={data.projectTitle}
          onChange={(e) => onChange("projectTitle", e.target.value)}
          className={`${inputClass} ${errors.projectTitle ? "border-red-500/60 focus:ring-red-500/20 focus:border-red-500" : ""}`}
        />
      </InputField>

      {/* Project Type Grid */}
      <div>
        <label className="text-sm font-semibold text-neutral-300 mb-3 block">
          Project Type <span className="text-primary-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PROJECT_TYPES.map((pt) => (
            <button
              key={pt.value}
              type="button"
              onClick={() => onChange("projectType", pt.value)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer
                ${data.projectType === pt.value
                  ? "border-primary-500 bg-primary-500/15 text-primary-300 shadow-[0_0_14px_rgba(20,184,160,0.25)]"
                  : "border-neutral-700/60 bg-neutral-900/40 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
                }`}
            >
              <span className="text-xl leading-none">{pt.icon}</span>
              <span className="text-xs text-center leading-tight">{pt.label}</span>
              {data.projectType === pt.value && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
        {errors.projectType && (
          <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.projectType}</p>
        )}
      </div>

      <InputField label="Requirements & Description" id="requirements" required error={errors.requirements}>
        <textarea
          id="requirements"
          rows={5}
          placeholder="Describe what the project should do, core features you need, target users, existing systems to integrate with, any special requirements…"
          value={data.requirements}
          onChange={(e) => onChange("requirements", e.target.value)}
          className={`${inputClass} resize-none leading-relaxed ${errors.requirements ? "border-red-500/60 focus:ring-red-500/20 focus:border-red-500" : ""}`}
        />
        <span className="text-xs text-neutral-600 self-end">{data.requirements.length}/10,000</span>
      </InputField>

      {/* Tech Stack */}
      <div>
        <label className="text-sm font-semibold text-neutral-300 mb-3 block">
          Preferred Tech Stack <span className="text-neutral-600 font-normal">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK_OPTIONS.map((tech) => {
            const active = data.techStack.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => onTechToggle(tech)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer
                  ${active
                    ? "border-primary-500 bg-primary-500/15 text-primary-300"
                    : "border-neutral-700/60 bg-neutral-900/30 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
                  }`}
              >
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      <InputField label="Reference URLs" id="referenceUrls">
        <input
          id="referenceUrls"
          type="text"
          placeholder="https://example.com, https://another.com"
          value={data.referenceUrls}
          onChange={(e) => onChange("referenceUrls", e.target.value)}
          className={inputClass}
        />
        <span className="text-xs text-neutral-600">Comma-separated links for inspiration or competitor sites</span>
      </InputField>
    </motion.div>
  );
}

function Step3({
  data, errors, onChange,
}: {
  data: FormData; errors: FormErrors; onChange: (field: keyof FormData, val: string) => void;
}) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-7"
    >
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Budget & Timeline</h3>
        <p className="text-sm text-neutral-500">Help us match you with the right scope and team.</p>
      </div>

      {/* Budget */}
      <div>
        <label className="text-sm font-semibold text-neutral-300 mb-3 block">
          Budget Range <span className="text-primary-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BUDGET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange("budget", opt.value)}
              className={`flex flex-col gap-0.5 px-4 py-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer
                ${data.budget === opt.value
                  ? "border-primary-500 bg-primary-500/15 shadow-[0_0_14px_rgba(20,184,160,0.25)]"
                  : "border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600"
                }`}
            >
              <span className={`text-sm font-bold ${data.budget === opt.value ? "text-primary-300" : "text-neutral-200"}`}>
                {opt.label}
              </span>
              <span className="text-xs text-neutral-500">{opt.desc}</span>
            </button>
          ))}
        </div>
        {errors.budget && (
          <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.budget}</p>
        )}
      </div>

      {/* Timeline */}
      <div>
        <label className="text-sm font-semibold text-neutral-300 mb-3 block">
          Desired Timeline <span className="text-primary-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TIMELINE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange("timeline", opt.value)}
              className={`flex flex-col gap-0.5 px-4 py-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer
                ${data.timeline === opt.value
                  ? "border-accent-500 bg-accent-500/10 shadow-[0_0_14px_rgba(245,158,11,0.2)]"
                  : "border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600"
                }`}
            >
              <span className={`text-sm font-bold ${data.timeline === opt.value ? "text-accent-400" : "text-neutral-200"}`}>
                {opt.label}
              </span>
              <span className="text-xs text-neutral-500">{opt.desc}</span>
            </button>
          ))}
        </div>
        {errors.timeline && (
          <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.timeline}</p>
        )}
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-4 space-y-2">
        <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest">What happens next?</p>
        {[
          "We review your request within 24 hours",
          "A senior engineer will reach out for a discovery call",
          "You'll receive a detailed proposal with timeline & pricing",
          "Project kickoff upon agreement",
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-2.5 text-sm text-neutral-400">
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-xs flex items-center justify-center font-bold">
              {i + 1}
            </span>
            {step}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center py-6 px-4 space-y-6"
    >
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping" />
        <div className="relative w-24 h-24 rounded-full bg-primary-500/10 border-2 border-primary-500 flex items-center justify-center">
          <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white">Request Submitted!</h3>
        <p className="text-neutral-400 max-w-md mx-auto text-sm leading-relaxed">
          Your project request has been received. A senior engineer will review it and reach out within <span className="text-primary-400 font-semibold">24 hours</span> with a tailored proposal.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl border border-neutral-700 text-sm text-neutral-300 hover:border-neutral-500 hover:text-white transition-all duration-200"
        >
          Submit Another Request
        </button>
        <a
          href="/"
          className="px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(20,184,160,0.3)]"
        >
          Back to Home
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const INITIAL_DATA: FormData = {
  clientName: "", clientEmail: "", clientPhone: "", clientCompany: "",
  projectTitle: "", projectType: "", requirements: "", techStack: [], referenceUrls: "",
  budget: "", timeline: "",
};

export function RequestProjectForm() {
  const { toast, ToastPortal } = useToastPortal();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onChange = useCallback((field: keyof FormData, val: string) => {
    setData((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const onTechToggle = useCallback((tech: string) => {
    setData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }));
  }, []);

  const validateStep = (s: number): boolean => {
    const errs: FormErrors = {};
    if (s === 1) {
      if (!data.clientName.trim() || data.clientName.trim().length < 2)
        errs.clientName = "Please provide your full name (at least 2 characters).";
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!data.clientEmail.trim() || !emailRegex.test(data.clientEmail.trim()))
        errs.clientEmail = "Please enter a valid email address.";
    }
    if (s === 2) {
      if (!data.projectTitle.trim() || data.projectTitle.trim().length < 3)
        errs.projectTitle = "Please provide a project title (at least 3 characters).";
      if (!data.projectType)
        errs.projectType = "Please select a project type.";
      if (!data.requirements.trim() || data.requirements.trim().length < 20)
        errs.requirements = "Please describe your requirements (at least 20 characters).";
    }
    if (s === 3) {
      if (!data.budget) errs.budget = "Please select a budget range.";
      if (!data.timeline) errs.timeline = "Please select a timeline.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        referenceUrls: data.referenceUrls
          ? data.referenceUrls.split(",").map((u) => u.trim()).filter(Boolean)
          : [],
      };
      const res = await fetch(`${API_BASE_URL}/api/project-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed.");
      setIsSubmitted(true);
    } catch (err: any) {
      toast("error", "Submission Failed", err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setData(INITIAL_DATA);
    setErrors({});
    setStep(1);
    setIsSubmitted(false);
  };

  return (
    <>
      <ToastPortal />
      <div className="w-full max-w-2xl mx-auto">
        {/* Glassmorphic card */}
        <div className="relative rounded-2xl border border-neutral-800/60 bg-neutral-950/80 backdrop-blur-xl shadow-[0_0_60px_rgba(20,184,160,0.08)] overflow-hidden">
          {/* Glow aura top */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 px-6 sm:px-10 pt-10 pb-8">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <SuccessScreen key="success" onReset={handleReset} />
              ) : (
                <motion.div key="form">
                  <StepIndicator step={step} totalSteps={3} />
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <Step1 key="s1" data={data} errors={errors} onChange={onChange} />
                    )}
                    {step === 2 && (
                      <Step2 key="s2" data={data} errors={errors} onChange={onChange} onTechToggle={onTechToggle} />
                    )}
                    {step === 3 && (
                      <Step3 key="s3" data={data} errors={errors} onChange={onChange} />
                    )}
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-800/60">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={step === 1}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-700 text-sm text-neutral-400 hover:border-neutral-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>

                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3].map((d) => (
                        <div
                          key={d}
                          className={`rounded-full transition-all duration-300 ${d === step ? "w-6 h-1.5 bg-primary-500" : d < step ? "w-1.5 h-1.5 bg-primary-500/60" : "w-1.5 h-1.5 bg-neutral-700"}`}
                        />
                      ))}
                    </div>

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold shadow-[0_0_20px_rgba(20,184,160,0.35)] hover:shadow-[0_0_28px_rgba(20,184,160,0.5)] transition-all duration-200"
                      >
                        Continue
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-[0_0_20px_rgba(20,184,160,0.35)] hover:shadow-[0_0_28px_rgba(20,184,160,0.5)] transition-all duration-200"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Submitting…
                          </>
                        ) : (
                          <>
                            Submit Request
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
