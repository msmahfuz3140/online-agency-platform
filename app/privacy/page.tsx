import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { FadeInSection } from "@/components/motion/FadeInSection";

export const metadata: Metadata = {
  title: "Privacy Policy | Nexora Agency",
  description:
    "Learn how Nexora Agency collects, protects, and handles client data, project requirements, and personal information in compliance with global standards.",
};

export default function PrivacyPage() {
  const lastUpdated = "September 25, 2026";

  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        {/* Header Hero */}
        <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-border bg-[#070c16]">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <FadeInSection>
              <div className="flex justify-center mb-4">
                <Badge variant="primary">Legal &amp; Compliance</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-foreground">
                Privacy Policy
              </h1>
              <p className="mt-4 text-sm sm:text-base text-muted-fg max-w-2xl mx-auto leading-relaxed">
                At Nexora Agency, we uphold strict standards of client privacy, intellectual property protection, and encrypted data processing.
              </p>
              <p className="mt-3 text-xs text-primary-400 font-mono">
                Effective Date: {lastUpdated}
              </p>
            </FadeInSection>
          </div>
        </section>

        {/* Content Section */}
        <Section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="mx-auto max-w-3xl space-y-10 text-neutral-300 leading-relaxed text-sm sm:text-base">
            <FadeInSection>
              <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-5 sm:p-6 mb-8">
                <h3 className="text-base font-semibold text-primary-300 font-heading mb-2">
                  🔒 Strict Confidentiality Guarantee (NDA Standard)
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400">
                  All proprietary code, wireframes, business logic, customer databases, and architectural specifications shared with Nexora Agency are strictly treated as confidential under standard Non-Disclosure Agreements (NDA).
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading border-b border-border pb-2">
                  1. Information We Collect
                </h2>
                <p>
                  When you engage with Nexora Agency—whether requesting a proposal, opening an account, or interacting with our development services—we collect the following categories of information:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li>
                    <strong className="text-foreground">Contact &amp; Identification Data:</strong> Your name, work email address, company name, phone number, and primary location.
                  </li>
                  <li>
                    <strong className="text-foreground">Project Specifications:</strong> Technical briefs, user stories, design tokens, budget ranges, timeline constraints, and file attachments uploaded via our platform.
                  </li>
                  <li>
                    <strong className="text-foreground">Billing &amp; Transaction Details:</strong> Payment confirmation identifiers, invoice receipts, and transaction timestamps. Note: All card processing is handled securely via Stripe; we never store raw credit card numbers.
                  </li>
                  <li>
                    <strong className="text-foreground">Technical Logs:</strong> IP address, browser type, device information, and session timestamps collected automatically to maintain system security and prevent fraud.
                  </li>
                </ul>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading border-b border-border pb-2">
                  2. How We Use Your Information
                </h2>
                <p>We use collected data solely for legitimate business purposes:</p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li>To provide, architect, develop, test, and deploy customized software solutions.</li>
                  <li>To communicate sprint updates, staging URL deployments, and milestone deliverables.</li>
                  <li>To issue invoices, verify payments (Stripe, bKash, Nagad), and maintain tax compliance.</li>
                  <li>To respond to customer support inquiries and provide post-launch maintenance.</li>
                  <li>To continuously optimize platform performance and ensure system uptime.</li>
                </ul>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading border-b border-border pb-2">
                  3. Client Code &amp; Data Ownership
                </h2>
                <p>
                  Upon settlement of final project milestones, <strong className="text-foreground">100% of all intellectual property, source code, database schemas, and digital assets</strong> created specifically for your project transfer directly to you. Nexora Agency retains no ownership rights over your proprietary code or business data.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading border-b border-border pb-2">
                  4. Third-Party Service Providers
                </h2>
                <p>
                  We partner with world-class cloud infrastructure providers to deliver high-availability systems:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li><strong className="text-foreground">Cloud Hosting:</strong> Vercel (Edge runtime, Next.js serverless hosting).</li>
                  <li><strong className="text-foreground">Database Layer:</strong> MongoDB Atlas (Encrypted at rest with AES-256).</li>
                  <li><strong className="text-foreground">Asset Delivery:</strong> Cloudinary (Secure CDN file and screenshot delivery).</li>
                  <li><strong className="text-foreground">Payment Processors:</strong> Stripe Inc., bKash Limited, and Nagad.</li>
                </ul>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading border-b border-border pb-2">
                  5. Contact Our Privacy Team
                </h2>
                <p>
                  If you have questions, wish to exercise data rights, or request an NDA execution prior to project discussion, please contact:
                </p>
                <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1 text-sm font-mono text-neutral-300">
                  <p>📧 Email: <a href="mailto:support@nexoraagency.com" className="text-primary-400 hover:underline">support@nexoraagency.com</a></p>
                  <p>🏢 Founder: MD Mahfuzul Haque</p>
                  <p>🌐 Website: <Link href="/" className="text-primary-400 hover:underline">Nexora Agency</Link></p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
