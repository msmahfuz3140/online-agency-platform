"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface TimeSlot {
  time: string;
  available: boolean;
}

const defaultSlots: TimeSlot[] = [
  { time: "10:00 AM", available: true },
  { time: "11:30 AM", available: true },
  { time: "02:00 PM", available: true },
  { time: "03:30 PM", available: false },
  { time: "05:00 PM", available: true },
  { time: "07:30 PM", available: true },
];

export function DiscoveryCallSchedulerModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedTime, setSelectedTime] = useState<string>("11:30 AM");
  const [step, setStep] = useState<"time" | "details" | "confirmed">("time");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    projectType: "Full-Stack Web App",
  });

  // Next 5 business days
  const days = [
    { label: "Mon", date: "Tomorrow", dayNum: 1 },
    { label: "Tue", date: "Sep 2", dayNum: 2 },
    { label: "Wed", date: "Sep 3", dayNum: 3 },
    { label: "Thu", date: "Sep 4", dayNum: 4 },
    { label: "Fri", date: "Sep 5", dayNum: 5 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setStep("confirmed");
  };

  const handleReset = () => {
    setStep("time");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-xl rounded-3xl bg-neutral-950 border border-neutral-800 shadow-[0_24px_80px_rgba(0,0,0,0.9)] p-6 sm:p-8 overflow-hidden z-10 ring-1 ring-white/10"
          >
            {/* Header Ambient Glow */}
            <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-primary-500/15 blur-[70px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              type="button"
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close scheduler"
            >
              ✕
            </button>

            {step === "time" && (
              <div>
                <Badge variant="primary" size="sm" className="mb-2">
                  Free 30-Min Strategy Call
                </Badge>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                  Schedule a Video Meeting
                </h3>
                <p className="mt-1 text-xs text-muted-fg leading-relaxed">
                  Choose a date and time to discuss your project scope, roadmap, and pricing with our CST team.
                </p>

                {/* Day Picker */}
                <div className="mt-6">
                  <p className="text-xs font-semibold text-foreground mb-2.5">
                    1. Select Date:
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {days.map((d) => (
                      <button
                        key={d.dayNum}
                        type="button"
                        onClick={() => setSelectedDay(d.dayNum)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          selectedDay === d.dayNum
                            ? "bg-primary-500 border-primary-500 text-white shadow-[0_0_16px_rgba(20,184,160,0.4)]"
                            : "bg-surface border-border text-neutral-300 hover:bg-neutral-800"
                        }`}
                      >
                        <p className="text-[10px] uppercase font-bold opacity-80">{d.label}</p>
                        <p className="text-xs font-bold mt-0.5">{d.date}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Picker */}
                <div className="mt-6">
                  <p className="text-xs font-semibold text-foreground mb-2.5">
                    2. Select Time (GMT+6 / Local):
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {defaultSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          !slot.available
                            ? "opacity-30 cursor-not-allowed border-border/50 bg-neutral-900 line-through"
                            : selectedTime === slot.time
                            ? "bg-surface border-primary-500 text-primary-400 shadow-sm"
                            : "bg-surface border-border text-neutral-300 hover:border-neutral-700"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-800 flex justify-between items-center">
                  <span className="text-xs text-muted-fg">
                    Selected: <strong className="text-foreground">{days.find((d) => d.dayNum === selectedDay)?.date} @ {selectedTime}</strong>
                  </span>
                  <Button variant="primary" size="md" onClick={() => setStep("details")}>
                    Next: Your Details →
                  </Button>
                </div>
              </div>
            )}

            {step === "details" && (
              <form onSubmit={handleSubmit}>
                <button
                  type="button"
                  onClick={() => setStep("time")}
                  className="text-xs text-primary-400 mb-3 hover:underline flex items-center gap-1"
                >
                  ← Change Time Slot
                </button>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  Your Contact Information
                </h3>
                <p className="text-xs text-muted-fg mt-1">
                  We&apos;ll send the Google Meet invitation and calendar invite to this email.
                </p>

                <div className="mt-5 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-fg mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Mahfuzul Haque"
                      className="w-full h-10 px-3.5 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-fg mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full h-10 px-3.5 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-fg mb-1">
                      Project Type
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-primary-500"
                    >
                      <option>Full-Stack Web App / SaaS</option>
                      <option>Custom Website / Landing Page</option>
                      <option>UI/UX Product Design</option>
                      <option>Cyber Security Penetration Audit</option>
                      <option>AI Website Builder Integration</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="md" onClick={() => setStep("time")}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" size="md">
                    Confirm Call Booking ✓
                  </Button>
                </div>
              </form>
            )}

            {step === "confirmed" && (
              <div className="text-center py-4">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                  ✓
                </div>
                <h3 className="font-heading font-bold text-2xl text-foreground">
                  Meeting Confirmed!
                </h3>
                <p className="mt-2 text-sm text-muted-fg max-w-sm mx-auto">
                  Thank you, <strong className="text-foreground">{formData.name}</strong>. A Google Meet link and calendar invitation has been sent to <strong className="text-foreground">{formData.email}</strong>.
                </p>

                <div className="mt-5 p-4 rounded-2xl bg-surface border border-border text-xs text-left max-w-sm mx-auto space-y-1.5">
                  <p>📅 <strong>Date:</strong> {days.find((d) => d.dayNum === selectedDay)?.date}</p>
                  <p>⏰ <strong>Time:</strong> {selectedTime}</p>
                  <p>📹 <strong>Platform:</strong> Google Meet (Link sent via Email)</p>
                </div>

                <div className="mt-6">
                  <Button variant="primary" size="md" onClick={handleReset}>
                    Done & Return to Site
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
