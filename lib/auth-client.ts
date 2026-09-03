"use client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  aiCreditsRemaining: number;
}

export interface AuthResponse {
  success: boolean;
  user?: UserSession;
  token?: string;
  error?: string;
}

const STORAGE_KEY = "nexora_auth_user";

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
    const res = await fetch(`${API_BASE_URL}/api/auth/sign-up/email`, {
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

    const user: UserSession = body.user || {
      id: body.id || `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: "user",
      aiCreditsRemaining: 5,
    };

    setStoredUser(user);

    return {
      success: true,
      user,
      token: body.token,
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
    const res = await fetch(`${API_BASE_URL}/api/auth/sign-in/email`, {
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
    await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
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
 * Fetch current session
 */
export async function getSession(): Promise<UserSession | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/get-session`, {
      credentials: "include",
    });
    if (!res.ok) return getStoredUser();
    const data = await res.json();
    if (data && data.user) {
      setStoredUser(data.user);
      return data.user;
    }
    return getStoredUser();
  } catch {
    return getStoredUser();
  }
}
