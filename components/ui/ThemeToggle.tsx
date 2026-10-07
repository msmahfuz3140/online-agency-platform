"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("nexora_theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("nexora_theme", next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={`h-9 w-9 rounded-xl border border-border bg-surface flex items-center justify-center text-muted-fg transition-all opacity-70 ${className}`}
        aria-label="Toggle Theme"
      >
        <span className="text-sm">🌓</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`h-9 w-9 rounded-xl border border-border/80 bg-surface/90 hover:bg-surface-2 text-foreground flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer ${className}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
    >
      {theme === "dark" ? (
        <svg
          className="h-4 w-4 text-amber-400 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z" />
        </svg>
      ) : (
        <svg
          className="h-4 w-4 text-cyan-600 dark:text-cyan-400 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 7C10 10.866 13.134 14 17 14C18.4576 14 19.8135 13.5546 20.9388 12.7915C20.4358 17.4332 16.4862 21 11.6667 21C6.32791 21 2 16.6721 2 11.3333C2 6.5138 5.56684 2.56422 10.2085 2.06118C9.44538 3.18648 9 4.54242 9 6C9 6.33777 9.02384 6.67026 9.06995 6.9954C9.37021 6.99846 9.68266 7 10 7Z" />
        </svg>
      )}
    </button>
  );
}
