"use client";

import { useState } from "react";
import { Section } from "../ui/Section";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // UI only — no backend yet
    setSubmitted(true);
    setEmail("");
  }

  return (
    <Section className="bg-surface/40">
      <FadeInSection>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">Newsletter</p>
          <h2 className="font-heading text-3xl font-bold">Stay in the loop.</h2>
          <p className="mt-3 text-sm text-muted-fg">
            Web dev deep-dives, agency insights, and occasional behind-the-scenes from our projects. Zero spam. Unsubscribe anytime.
          </p>

          {submitted ? (
            <div className="mt-8 flex flex-col items-center gap-2">
              <span className="text-3xl">🎉</span>
              <p className="text-sm font-medium text-foreground">You&apos;re on the list!</p>
              <p className="text-xs text-muted-fg">We&apos;ll be in touch with the good stuff.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 h-10 px-4 text-sm bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-fg focus:outline-none focus:border-primary-500 transition-colors"
              />
              <Button type="submit" variant="primary" size="md">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </FadeInSection>
    </Section>
  );
}
