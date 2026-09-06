"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { submitContactMessage } from "@/lib/api-client";
import { getStoredUser } from "@/lib/auth-client";
import type { ServiceItem } from "./ServicesGridSection";

interface ServiceInquiryModalProps {
  open: boolean;
  onClose: () => void;
  service: ServiceItem | null;
}

export function ServiceInquiryModal({
  open,
  onClose,
  service,
}: ServiceInquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill user info and message when service changes
  useEffect(() => {
    const user = getStoredUser();
    if (service) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user?.name || "",
        email: prev.email || user?.email || "",
        message: prev.message
          ? prev.message
          : `Hello Nexora Team, I am interested in your "${service.title}" (${service.category}) service. Here are our project requirements: `,
      }));
      setSubmitted(false);
      setErrorMsg(null);
    }
  }, [service, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg("Please provide your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMsg("Please describe your project needs in at least 10 characters.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const user = getStoredUser();
    const res = await submitContactMessage({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      subject: `Direct Service Inquiry: ${service?.title || "Custom Solution"} [${service?.category || "General"}]`,
      category: service?.category || "General",
      message: formData.message.trim(),
      userId: user?.id,
    });

    setSubmitting(false);

    if (res.success) {
      setSubmitted(true);
      // Track sent inquiry in localStorage so user's inbox always displays it immediately
      if (typeof window !== "undefined") {
        try {
          const key = "nexora_client_inquiries";
          const list = JSON.parse(localStorage.getItem(key) || "[]");
          if (res.data?.id) list.unshift(res.data.id);
          localStorage.setItem(key, JSON.stringify(Array.from(new Set(list))));
        } catch {}
      }
    } else {
      setErrorMsg(res.error || "Failed to send message. Please try again.");
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrorMsg(null);
    onClose();
  };

  // WhatsApp quick-link
  const whatsappUrl = service
    ? `https://wa.me/8801700000000?text=${encodeURIComponent(
        `Hi Nexora Agency, I am interested in your "${service.title}" service.`
      )}`
    : "#";

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={submitted ? "Inquiry Sent!" : "Direct Message Our Team"}
      description={
        submitted
          ? "We have received your project inquiry."
          : `Direct intake for "${service?.title || "Specialized Service"}". Directly reviewed by leadership.`
      }
      size="lg"
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            className="py-4 sm:py-6 px-1 sm:px-3 text-center"
          >
            {/* Pulsing checkmark badge */}
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-500/20 border border-primary-500/50 flex items-center justify-center mb-4 sm:mb-5 text-2xl sm:text-3xl shadow-[0_0_24px_rgba(20,184,160,0.35)]">
              ✨
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-heading text-foreground">
              Direct Message Dispatched!
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-muted-fg max-w-sm mx-auto leading-relaxed">
              Thank you, <span className="text-foreground font-semibold">{formData.name}</span>! Your inquiry for{" "}
              <span className="text-primary-400 font-semibold">{service?.title}</span> has been logged directly to our executive inbox.
            </p>

            <div className="mt-4 sm:mt-5 p-3 sm:p-3.5 rounded-xl bg-surface-2 border border-border/80 text-xs text-neutral-300 max-w-sm mx-auto">
              <span className="font-mono text-primary-400 font-semibold">⚡ Guaranteed SLA:</span> We will review your scope and reply to <span className="font-mono text-white break-all">{formData.email}</span> within 2–4 hours.
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center items-stretch sm:items-center">
              <Link href="/dashboard/messages" onClick={handleClose} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto text-xs py-2.5 sm:py-2 font-semibold shadow-[0_0_16px_rgba(20,184,160,0.35)] flex items-center justify-center gap-1.5"
                >
                  <span>💬 View in My Message Inbox →</span>
                </Button>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full sm:w-auto text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 text-xs py-2.5 sm:py-2 flex items-center justify-center gap-1.5"
                >
                  <span>💬 WhatsApp</span>
                </Button>
              </a>
              <Button
                variant="ghost"
                size="sm"
                className="w-full sm:w-auto text-xs py-2.5 sm:py-2"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
          >
            {/* Selected Service Snippet Banner */}
            {service && (
              <div className="mb-4 sm:mb-5 p-3 sm:p-3.5 rounded-xl bg-surface-2/90 border border-primary-500/25 relative overflow-hidden">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5">
                  <div className="flex items-start xs:items-center gap-2.5 sm:gap-3 min-w-0">
                    <span className="text-2xl sm:text-3xl h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-surface border border-border flex items-center justify-center shadow-inner shrink-0">
                      {service.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-foreground truncate max-w-[210px] sm:max-w-xs">
                          {service.title}
                        </h4>
                        <Badge variant="primary" size="sm" className="text-[9px] sm:text-[10px] py-0 px-1.5">
                          {service.category}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-fg mt-0.5 line-clamp-1">
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  <span className="self-start xs:self-center text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-surface text-primary-400 border border-border shrink-0">
                    ⏱ {service.timeline}
                  </span>
                </div>
              </div>
            )}

            {/* Error message banner */}
            {errorMsg && (
              <div className="mb-3.5 p-2.5 sm:p-3 rounded-xl bg-danger-500/10 border border-danger-500/30 text-danger-400 text-xs flex items-center gap-2">
                <span className="shrink-0">⚠️</span>
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Your Full Name <span className="text-primary-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Mahfuzul Haque"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-3.5 py-2.5 sm:py-2 text-base sm:text-xs rounded-xl bg-surface-2 border border-border text-foreground placeholder:text-muted-fg/60 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Email Address <span className="text-primary-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-3.5 py-2.5 sm:py-2 text-base sm:text-xs rounded-xl bg-surface-2 border border-border text-foreground placeholder:text-muted-fg/60 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                  />
                </div>
              </div>

              {/* WhatsApp & Company Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1 flex items-center justify-between">
                    <span>Phone / WhatsApp</span>
                    <span className="text-muted-fg text-[10px] font-normal">Optional</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+880 1700-000000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-3.5 py-2.5 sm:py-2 text-base sm:text-xs rounded-xl bg-surface-2 border border-border text-foreground placeholder:text-muted-fg/60 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1 flex items-center justify-between">
                    <span>Company / Brand</span>
                    <span className="text-muted-fg text-[10px] font-normal">Optional</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Organization / Brand Name"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-3.5 py-2.5 sm:py-2 text-base sm:text-xs rounded-xl bg-surface-2 border border-border text-foreground placeholder:text-muted-fg/60 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Message text area */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1 flex items-center justify-between">
                  <span>Project Scope & Message <span className="text-primary-400">*</span></span>
                  <span className="text-[10px] text-muted-fg">Min. 10 chars</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share a brief summary of what you need, target launch date, or specific questions..."
                  className="w-full px-3 sm:px-3.5 py-2.5 sm:py-2 text-base sm:text-xs rounded-xl bg-surface-2 border border-border text-foreground placeholder:text-muted-fg/60 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all resize-none min-h-[74px] sm:min-h-[82px]"
                />
              </div>

              {/* Mobile-friendly Action Bar */}
              <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/60">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-muted-fg order-2 sm:order-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0" />
                  <span>Direct reply within <strong className="text-foreground">2–4 hours</strong></span>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2 order-1 sm:order-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    disabled={submitting}
                    className="w-full sm:w-auto text-xs py-2.5 sm:py-2 text-muted-fg hover:text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={submitting}
                    className="w-full sm:w-auto text-xs py-2.5 sm:py-2 font-semibold shadow-[0_0_16px_rgba(20,184,160,0.3)] flex items-center justify-center gap-1.5"
                  >
                    <span>Send Direct Message</span>
                    <span>→</span>
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
