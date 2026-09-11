"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ClientSidebar } from "@/components/dashboard/ClientSidebar";
import { ClientTopBar } from "@/components/dashboard/ClientTopBar";
import {
  getStoredUser,
  getSession,
  updateUserProfile,
  changeUserPassword,
  type UserSession,
} from "@/lib/auth-client";
import { uploadFile, validateFile } from "@/lib/upload";
import { useToastPortal } from "@/components/ui/useToastPortal";

export default function ClientSettingsPage() {
  const { toast, ToastPortal } = useToastPortal();
  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "security" | "plan">("profile");

  // Profile Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [company, setCompany] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Avatar Upload State
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarProgress, setAvatarProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredUser();
    if (stored) {
      populateUser(stored);
    }

    getSession().then((sessionUser) => {
      if (sessionUser) {
        populateUser(sessionUser);
      }
    });
  }, []);

  const populateUser = (u: UserSession) => {
    setUser(u);
    setName(u.name || "");
    setEmail(u.email || "");
    setPhoneNumber(u.phoneNumber || "");
    setCompany(u.company || "");
    setImageUrl(u.image || null);
  };

  if (!mounted) return null;

  // Initials for avatar fallback
  const initials = (name || user?.name || "Client")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Avatar upload handler
  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, { maxSizeMB: 10, allowPdf: false, allowImages: true });
    if (!validation.valid) {
      toast("error", "Invalid Image", validation.error || "Please select a JPG, PNG or WebP image under 10MB.");
      return;
    }

    setUploadingAvatar(true);
    setAvatarProgress(10);

    try {
      const res = await uploadFile(file, "avatar", (percent) => {
        setAvatarProgress(percent);
      });

      setImageUrl(res.url);

      // Save directly to user profile
      const updateRes = await updateUserProfile({ image: res.url });
      if (updateRes.success) {
        toast("success", "Photo Uploaded", "Your profile avatar has been updated in the cloud.");
      } else {
        toast("warning", "Photo Uploaded", "Image uploaded, but please click 'Save Changes' to update profile.");
      }
    } catch (err: any) {
      toast("error", "Upload Failed", err.message || "Failed to upload avatar to Cloudinary.");
    } finally {
      setUploadingAvatar(false);
      setAvatarProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    setImageUrl(null);
    try {
      await updateUserProfile({ image: "" });
      toast("info", "Avatar Removed", "Your profile photo has been reset to default monogram.");
    } catch {
      toast("error", "Error", "Could not remove avatar.");
    }
  };

  // Profile save handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast("error", "Invalid Name", "Please enter a valid name with at least 2 characters.");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await updateUserProfile({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        company: company.trim(),
        image: imageUrl || "",
      });

      if (res.success) {
        toast("success", "Profile Saved", "Your personal and business details have been synced.");
        if (res.user) setUser(res.user);
      } else {
        toast("error", "Update Failed", res.error || "Could not save profile changes.");
      }
    } catch (err: any) {
      toast("error", "Error", err.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Password save handler
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast("error", "Missing Field", "Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      toast("error", "Weak Password", "New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast("error", "Mismatch", "New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast("error", "Same Password", "New password must be different from your current password.");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await changeUserPassword({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        toast("success", "Password Updated", "Your account credentials have been securely updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast("error", "Security Error", res.error || "Failed to update password.");
      }
    } catch (err: any) {
      toast("error", "Error", err.message || "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  // Password strength score
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "Empty", color: "bg-neutral-700" };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 3) return { score, label: "Medium", color: "bg-amber-500" };
    return { score, label: "Strong & Secure", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="flex h-screen bg-[#070c16] text-foreground overflow-hidden relative">
      <ToastPortal />

      {/* Atmospheric ambient glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-primary-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/10 w-[500px] h-[300px] bg-amber-500/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Sidebar */}
      <ClientSidebar
        user={user}
        activeTab={"overview" as any}
        onSelectTab={() => {}}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <ClientTopBar
          user={user}
          activeTab="settings"
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-5xl w-full mx-auto space-y-6">
          {/* Breadcrumb & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1.5">
                <Link href="/dashboard" className="hover:text-primary-400 transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-white">Account Settings</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span>⚙️</span>
                <span>Account &amp; Profile Settings</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Manage your client identity, contact details, authentication credentials, and subscription.
              </p>
            </div>

            {/* VIP Status Pill */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left font-mono">
                <p className="text-[10px] text-neutral-400 uppercase leading-none">Security Level</p>
                <p className="text-xs font-bold text-emerald-300 capitalize leading-tight mt-0.5">
                  {user?.plan === "business" ? "Business VIP" : user?.plan === "pro" ? "Pro Client" : "Standard Client"}
                </p>
              </div>
            </div>
          </div>

          {/* Sub-Tabs Nav */}
          <div className="flex items-center gap-2 border-b border-white/[0.07] pb-1 overflow-x-auto">
            {[
              { id: "profile", label: "Profile & Identity", icon: "👤" },
              { id: "security", label: "Password & Security", icon: "🔒" },
              { id: "plan", label: "Plan & AI Credits", icon: "💎" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? "bg-primary-500/15 border border-primary-500/30 text-primary-300 shadow-[0_0_15px_rgba(20,184,160,0.15)]"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: PROFILE & IDENTITY */}
          {activeSubTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Avatar Section Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/40 border border-white/[0.08] backdrop-blur-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar Circle with live upload indicator */}
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary-500/30 via-primary-500/10 to-surface-2 border-2 border-primary-500/40 flex items-center justify-center font-bold text-xl text-primary-300 shadow-[0_0_20px_rgba(20,184,160,0.25)]">
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt={name || "User Avatar"}
                            className="w-full h-full object-cover"
                            onError={() => setImageUrl(null)}
                          />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>

                      {uploadingAvatar && (
                        <div className="absolute inset-0 rounded-full bg-black/70 flex flex-col items-center justify-center text-[10px] text-primary-300 font-mono">
                          <span className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mb-1" />
                          <span>{avatarProgress}%</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">Profile Photo</h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        High-resolution photo for client dashboard &amp; project communication.
                      </p>
                      <p className="text-[11px] font-mono text-neutral-500 mt-1">
                        JPG, PNG or WebP · Max 10MB
                      </p>
                    </div>
                  </div>

                  {/* Upload / Remove Actions */}
                  <div className="flex items-center gap-2.5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      onChange={handleAvatarSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingAvatar}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(20,184,160,0.3)] cursor-pointer flex items-center gap-1.5"
                    >
                      <span>📷</span>
                      <span>{uploadingAvatar ? "Uploading…" : "Change Photo"}</span>
                    </button>

                    {imageUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium transition-all border border-red-500/20 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Details Form */}
              <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 rounded-2xl bg-neutral-900/40 border border-white/[0.08] backdrop-blur-xl space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                  <span>📝</span> Personal &amp; Organization Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Full Name <span className="text-primary-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Shafin Ahmed"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-neutral-600"
                    />
                  </div>

                  {/* Primary Email */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-neutral-300">Email Address</label>
                      <span className="text-[10px] text-emerald-400 font-mono">🔒 Verified Identity</span>
                    </div>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.01] border border-white/[0.05] text-neutral-400 text-xs cursor-not-allowed font-mono"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Phone Number <span className="text-neutral-500 font-normal">(WhatsApp / Direct)</span>
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+880 1700 000000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-neutral-600 font-mono"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Fintech Global Ventures"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-white/[0.06]">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-[0_0_20px_rgba(20,184,160,0.35)] flex items-center gap-2 cursor-pointer"
                  >
                    {savingProfile ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving Changes…</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeSubTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <form onSubmit={handleSavePassword} className="p-5 sm:p-6 rounded-2xl bg-neutral-900/40 border border-white/[0.08] backdrop-blur-xl space-y-5 max-w-2xl">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                    <span>🔒</span> Change Account Password
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Keep your account secure by using a strong password with letters, numbers and symbols.
                  </p>
                </div>

                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Current Password <span className="text-primary-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-neutral-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs cursor-pointer"
                    >
                      {showCurrent ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    New Password <span className="text-primary-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-neutral-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs cursor-pointer"
                    >
                      {showNew ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-neutral-400">Strength:</span>
                        <span className="text-white font-bold">{strength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 rounded-full transition-all ${strength.score >= 1 ? strength.color : "bg-neutral-800"}`} />
                        <div className={`h-full flex-1 rounded-full transition-all ${strength.score >= 3 ? strength.color : "bg-neutral-800"}`} />
                        <div className={`h-full flex-1 rounded-full transition-all ${strength.score >= 4 ? strength.color : "bg-neutral-800"}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Confirm New Password <span className="text-primary-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-neutral-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs cursor-pointer"
                    >
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-white/[0.06]">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-neutral-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2 cursor-pointer"
                  >
                    {savingPassword ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                        <span>Updating Password…</span>
                      </>
                    ) : (
                      <>
                        <span>🛡️</span>
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* TAB 3: PLAN & SUBSCRIPTION */}
          {activeSubTab === "plan" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/40 border border-white/[0.08] backdrop-blur-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
                  <div>
                    <span className="text-[10px] font-mono text-primary-400 uppercase tracking-widest block mb-1">Current Tier</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      <span>{user?.plan === "business" ? "💎" : user?.plan === "pro" ? "👑" : "⚡"}</span>
                      <span className="capitalize">{user?.plan || "Free Starter"} Plan</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {user?.planStatus || "Active"}
                      </span>
                    </h3>
                  </div>

                  <Link
                    href="/pricing"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-teal-500 hover:from-primary-500 hover:to-teal-400 text-white text-xs font-semibold transition-all shadow-[0_0_20px_rgba(20,184,160,0.35)] flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span>Upgrade Plan</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">AI Generation Credits</p>
                    <p className="text-3xl font-extrabold text-primary-300 font-mono">
                      {user?.aiCreditsRemaining ?? 5} <span className="text-xs text-neutral-500 font-normal">credits</span>
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Use credits to generate full-stack websites, landing pages, and prototypes in seconds.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Engineering Support Access</p>
                    <p className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>⚡</span>
                      <span>Dedicated Lead Architect</span>
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Direct hotline &amp; sprint roadmap reviews with Founder MD Mahfuzul Haque.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
