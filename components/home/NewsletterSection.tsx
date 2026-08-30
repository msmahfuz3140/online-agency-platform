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
    setSubmitted(true);
    setEmail("");
  }

  return (
    <Section className="bg-surface/40">
      <FadeInSection>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">Newsletter</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold">Stay in the loop.</h2>
          <p className="mt-3 text-sm text-muted-fg leading-relaxed">
            Web dev deep-dives, agency insights, and occasional behind-the-scenes from our projects. Zero spam.
          </p>

          {submitted ? (
            <div className="mt-8 flex flex-col items-center gap-2">
              <span className="text-3xl">🎉</span>
              <p className="text-sm font-medium text-foreground">You&apos;re on the list!</p>
              <p className="text-xs text-muted-fg">We&apos;ll be in touch with the good stuff.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-2.5">
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full sm:flex-1 h-11 px-4 text-sm bg-surface border border-border rounded-xl text-foreground placeholder:text-muted-fg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-colors"
              />
              <Button type="submit" variant="primary" size="md" className="h-11 w-full sm:w-auto whitespace-nowrap">
                Subscribe →
              </Button>
            </form>
          )}
        </div>
      </FadeInSection>
    </Section>
  );
}
