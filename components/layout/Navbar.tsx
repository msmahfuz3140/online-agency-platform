"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg border-b border-white/5" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm font-heading">N</span>
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-foreground group-hover:text-primary-400 transition-colors">
              Nexora
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-muted-fg hover:text-foreground hover:bg-neutral-800/60 rounded-lg transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-fg hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Button size="sm" variant="primary" asChild>
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="md:hidden p-2 text-muted-fg hover:text-foreground rounded-lg hover:bg-neutral-800/60 transition-all"
          >
            <motion.div
              animate={mobileOpen ? "open" : "closed"}
              className="w-5 h-5 flex flex-col justify-center gap-1"
            >
              <motion.span
                variants={{ open: { rotate: 45, y: 6 }, closed: { rotate: 0, y: 0 } }}
                className="block h-0.5 w-5 bg-current origin-center transition-all"
              />
              <motion.span
                variants={{ open: { opacity: 0, x: -8 }, closed: { opacity: 1, x: 0 } }}
                className="block h-0.5 w-5 bg-current"
              />
              <motion.span
                variants={{ open: { rotate: -45, y: -6 }, closed: { rotate: 0, y: 0 } }}
                className="block h-0.5 w-5 bg-current origin-center transition-all"
              />
            </motion.div>
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed top-16 inset-x-0 z-40 glass border-b border-white/5 md:hidden overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-muted-fg hover:text-foreground hover:bg-neutral-800/60 rounded-lg transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">Log in</Button>
                </Link>
                <Link href="/contact" className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">Get a Quote</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
