"use client";

import { useEffect, useState } from "react";

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      if (process.env.NEXT_PUBLIC_API_URL?.includes("localhost")) {
        return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
      }
      return "http://localhost:5000";
    }
  }
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://online-agency-platform-backend.vercel.app"
  ).replace(/\/+$/, "");
}

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://online-agency-platform-backend.vercel.app"
).replace(/\/+$/, "");

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const primary = getApiBaseUrl();
  const secondary = "https://online-agency-platform-backend.vercel.app";

  try {
    const res = await fetch(`${primary}${path}`, init);
    if (!res.ok && res.status === 404 && primary !== secondary) {
      try {
        const fallbackRes = await fetch(`${secondary}${path}`, init);
        if (fallbackRes.ok) return fallbackRes;
      } catch {}
    }
    return res;
  } catch (primaryErr) {
    if (primary !== secondary) {
      try {
        return await fetch(`${secondary}${path}`, init);
      } catch {}
    }
    throw primaryErr;
  }
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phoneNumber?: string;
  company?: string;
  role: string;
  aiCreditsRemaining: number;
  plan?: "free" | "pro" | "business";
  planStatus?: "active" | "inactive" | "expired";
  planExpiresAt?: string | null;
  planActivatedAt?: string | null;
  createdAt?: string | Date;
}

export interface AuthResponse {
  success: boolean;
  user?: UserSession;
  token?: string;
  error?: string;
}

const STORAGE_KEY = "nexora_auth_user";
export const AUTH_CHANGE_EVENT = "nexora_auth_change";

export function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserSession | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.error("Failed to update stored user:", err);
  } finally {
    // Notify all listeners in current window
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: user }));
  }
}

/**
 * Register with email and password via Better Auth route
 */
export async function signUpEmail(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const res = await apiFetch("/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: body.message || body.error || "Registration failed. Please verify your details.",
      };
    }

    setStoredUser(null);
    try {
      await apiFetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Best-effort cookie clear; redirect still proceeds
    }

    return {
      success: true,
      user: body.user || {
        id: body.id || `usr_${Date.now()}`,
        name: data.name,
        email: data.email,
        role: "user",
        aiCreditsRemaining: 5,
      },
    };
  } catch (err: any) {
    console.error("signUpEmail error:", err);
    return {
      success: false,
      error: err.message || "Network error. Make sure the backend server is running.",
    };
  }
}

/**
 * Sign in with email and password via Better Auth route
 */
export async function signInEmail(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const res = await apiFetch("/api/auth/sign-in/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: body.message || body.error || "Invalid email or password.",
      };
    }

    const user: UserSession = body.user || {
      id: body.id || `usr_${Date.now()}`,
      name: body.name || data.email.split("@")[0],
      email: data.email,
      role: body.role || "user",
      aiCreditsRemaining: body.aiCreditsRemaining ?? 5,
    };

    setStoredUser(user);

    return {
      success: true,
      user,
      token: body.token,
    };
  } catch (err: any) {
    console.error("signInEmail error:", err);
    return {
      success: false,
      error: err.message || "Network error. Make sure the backend server is running.",
    };
  }
}

/**
 * Sign out session
 */
export async function signOut(): Promise<{ success: boolean }> {
  try {
    await apiFetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.warn("Sign out remote call warning:", err);
  } finally {
    setStoredUser(null);
  }
  return { success: true };
}

/**
 * Sign in / Register with Social OAuth Provider (Google, GitHub) via Better Auth
 */
export async function signInSocial(
  provider: "google" | "github",
  callbackURL?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const callback =
      callbackURL ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/dashboard`
        : "http://localhost:3000/dashboard");

    const res = await apiFetch("/api/auth/sign-in/social", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        provider,
        callbackURL: callback,
      }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error:
          body.message ||
          body.error ||
          `Failed to initialize ${provider} login. Please ensure OAuth credentials are configured in backend/.env`,
      };
    }

    // Better Auth returns { url: "...", redirect: true }
    if (body.url) {
      if (typeof window !== "undefined") {
        window.location.href = body.url;
      }
      return { success: true, url: body.url };
    }

    if (body.user) {
      setStoredUser(body.user);
      return { success: true };
    }

    return {
      success: false,
      error: "No authorization URL returned from auth server.",
    };
  } catch (err: any) {
    console.error(`signInSocial (${provider}) error:`, err);
    return {
      success: false,
      error:
        err.message ||
        "Network error. Make sure the backend server is running.",
    };
  }
}

/**
 * Fetch current session
 */
export async function getSession(tokenOverride?: string): Promise<UserSession | null> {
  try {
    let token = tokenOverride;
    if (!token && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      token = params.get("session_token") || params.get("token") || undefined;
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["x-session-token"] = token;
    }

    const [authRes, meRes] = await Promise.all([
      apiFetch("/api/auth/get-session", { credentials: "include", headers }).catch(() => null),
      apiFetch("/api/user/me", { credentials: "include", headers }).catch(() => null),
    ]);

    let meData: any = null;
    if (meRes && meRes.ok) {
      const meJson = await meRes.json().catch(() => null);
      if (meJson?.success && meJson?.user) {
        meData = meJson.user;
      }
    }

    if (authRes && authRes.ok) {
      const data = await authRes.json();
      if (data && data.user) {
        const formattedUser: UserSession = {
          id: data.user.id || data.user._id || meData?.id || `usr_${Date.now()}`,
          name: meData?.name || data.user.name || data.user.email?.split("@")[0] || "User",
          email: meData?.email || data.user.email || "",
          image: meData?.image !== undefined ? meData.image : data.user.image || null,
          phoneNumber: meData?.phoneNumber || "",
          company: meData?.company || "",
          role: meData?.role || data.user.role || "user",
          aiCreditsRemaining: meData?.aiCreditsRemaining ?? data.user.aiCreditsRemaining ?? 5,
          plan: meData?.plan || "free",
          planStatus: meData?.planStatus || "active",
          planExpiresAt: meData?.planExpiresAt || null,
          planActivatedAt: meData?.planActivatedAt || null,
          createdAt: meData?.createdAt || undefined,
        };
        setStoredUser(formattedUser);

        // If authenticated via URL token param, clean up URL
        if (token && typeof window !== "undefined") {
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete("session_token");
            url.searchParams.delete("token");
            window.history.replaceState({}, document.title, url.toString());
          } catch {}
        }

        return formattedUser;
      }
    }

    if (meData) {
      const stored = getStoredUser();
      const updated: UserSession = {
        ...(stored || {}),
        id: meData.id || stored?.id || `usr_${Date.now()}`,
        name: meData.name || stored?.name || "User",
        email: meData.email || stored?.email || "",
        image: meData.image !== undefined ? meData.image : stored?.image || null,
        phoneNumber: meData.phoneNumber !== undefined ? meData.phoneNumber : stored?.phoneNumber || "",
        company: meData.company !== undefined ? meData.company : stored?.company || "",
        role: meData.role || stored?.role || "user",
        aiCreditsRemaining: meData.aiCreditsRemaining ?? stored?.aiCreditsRemaining ?? 5,
        plan: meData.plan || "free",
        planStatus: meData.planStatus || "active",
        planExpiresAt: meData.planExpiresAt || null,
        planActivatedAt: meData.planActivatedAt || null,
        createdAt: meData.createdAt || stored?.createdAt,
      };
      setStoredUser(updated);

      if (token && typeof window !== "undefined") {
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete("session_token");
          url.searchParams.delete("token");
          window.history.replaceState({}, document.title, url.toString());
        } catch {}
      }

      return updated;
    }

    return getStoredUser();
  } catch {
    return getStoredUser();
  }
}

/**
 * Update client profile details (Name, Image, Phone, Company)
 */
export async function updateUserProfile(data: {
  name?: string;
  image?: string | null;
  phoneNumber?: string;
  company?: string;
}): Promise<{ success: boolean; user?: UserSession; message?: string; error?: string }> {
  try {
    const res = await apiFetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      return { success: false, error: json.message || "Failed to update profile." };
    }

    const current = getStoredUser();
    const updated: UserSession = {
      ...(current || {}),
      id: json.user?.id || current?.id || `usr_${Date.now()}`,
      name: json.user?.name || data.name || current?.name || "Client",
      email: json.user?.email || current?.email || "",
      image: json.user?.image !== undefined ? json.user.image : (data.image !== undefined ? data.image : current?.image),
      phoneNumber: json.user?.phoneNumber !== undefined ? json.user.phoneNumber : (data.phoneNumber !== undefined ? data.phoneNumber : current?.phoneNumber),
      company: json.user?.company !== undefined ? json.user.company : (data.company !== undefined ? data.company : current?.company),
      role: json.user?.role || current?.role || "user",
      aiCreditsRemaining: json.user?.aiCreditsRemaining ?? current?.aiCreditsRemaining ?? 5,
      plan: current?.plan || "free",
      planStatus: current?.planStatus || "active",
      planExpiresAt: current?.planExpiresAt || null,
      planActivatedAt: current?.planActivatedAt || null,
    };

    setStoredUser(updated);
    return { success: true, user: updated, message: json.message };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error updating profile." };
  }
}

/**
 * Change user password
 */
export async function changeUserPassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const stored = getStoredUser();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (stored?.email) headers["x-user-email"] = stored.email;
    if (stored?.id) headers["x-user-id"] = stored.id;
    if (stored?.role) headers["x-user-role"] = stored.role;

    const res = await apiFetch("/api/user/change-password", {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      return { success: false, error: json.message || "Failed to change password." };
    }

    return { success: true, message: json.message || "Password updated successfully." };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error changing password." };
  }
}

/**
 * Request 6-digit OTP code to reset forgotten password
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await apiFetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      return { success: false, error: json.message || "Failed to send reset code. Please check your email." };
    }

    return { success: true, message: json.message || "Reset code sent to your email." };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error requesting password reset." };
  }
}

/**
 * Verify OTP code and set new password
 */
export async function resetPasswordWithOtp(data: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await apiFetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        email: data.email.trim(),
        otp: data.otp.trim(),
        newPassword: data.newPassword,
      }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      return { success: false, error: json.message || "Failed to reset password." };
    }

    return { success: true, message: json.message || "Password successfully reset." };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error resetting password." };
  }
}

/**
 * React hook for instantaneous, reactive auth state subscription
 */
export function useCurrentUser() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getStoredUser());

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<UserSession | null>;
      setUser(customEvent.detail !== undefined ? customEvent.detail : getStoredUser());
    };

    const storageHandler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setUser(getStoredUser());
      }
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  return { user, isAuthenticated: mounted && !!user };
}
