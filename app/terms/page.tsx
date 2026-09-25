import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { FadeInSection } from "@/components/motion/FadeInSection";

export const metadata: Metadata = {
  title: "Terms of Service | Nexora Agency",
  description:
    "Review the terms and conditions governing software development services, project engagements, milestone deliveries, and payment agreements with Nexora Agency.",
};

export default function TermsPage() {
  const lastUpdated = "September 25, 2026";

  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        {/* Header Hero */}
        <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-border bg-[#070c16]">
          <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <FadeInSection>
              <div className="flex justify-center mb-4">
                <Badge variant="warning">Service Agreement</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-foreground">
                Terms of Service
              </h1>
              <p className="mt-4 text-sm sm:text-base text-muted-fg max-w-2xl mx-auto leading-relaxed">
                Clear, transparent, and developer-friendly terms governing project roadmaps, code deliverables, and mutual warranties.
              </p>
              <p className="mt-3 text-xs text-amber-400 font-mono">
                Effective Date: {lastUpdated}
              </p>
            </FadeInSection>
          </div>
        </section>

        {/* Content Section */}
        <Section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="mx-auto max-w-3xl space-y-10 text-neutral-300 leading-relaxed text-sm sm:text-base">
            <FadeInSection>
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading border-b border-border pb-2">
                  1. Engagement &amp; Project Scope
                </h2>
                <p>
                  By submitting a project request or engaging Nexora Agency for digital engineering, you agree to these Terms. Each project begins with a comprehensive scoping phase detailing architecture blueprints, tech stack decisions, sprint milestones, and agreed deliverables.
                </p>
                <p>
                  Any alterations or feature additions outside the initial agreed Statement of Work (SOW) will be scoped as separate sprint additions.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading border-b border-border pb-2">
                  2. Sprint Execution &amp; Quality Standards
                </h2>
                <p>Nexora Agency commits to world-class software engineering standards:</p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li><strong className="text-foreground">Code Quality:</strong> Clean, typed, modular code adhering to modern Next.js and TypeScript conventions.</li>
                  <li><strong className="text-foreground">Performance:</strong> Core Web Vitals target of 90+ on desktop and mobile environments.</li>
                  <li><strong className="text-foreground">Staging Review:</strong> Clients receive access to live staging URLs before production deployment.</li>
                  <li><strong className="text-foreground">Bug Warranty:</strong> A standard 30-day post-launch warranty during which any defects attributable to our delivered code are rectified at zero additional cost.</li>
                </ul>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading border-b border-border pb-2">
                  3. Payment Terms &amp; Invoicing
                </h2>
                <p>
                  We offer structured milestone payments and accept Stripe (international credit/debit cards) as well as bKash and Nagad:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li><strong className="text-foreground">Project Deposits:</strong> Standard bespoke projects require an initial commencement deposit (typically 30% to 50%) prior to sprint kick-off.</li>
                  <li><strong className="text-foreground">Milestone Verification:</strong> Interim payments are tied to tangible milestones (e.g. Design Prototype Approved, Alpha Staging Deployed).</li>
                  <li><strong className="text-foreground">Final Release:</strong> Production deployment to client infrastructure occurs upon settlement of final invoices.</li>
                </ul>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading border-b border-border pb-2">
                  4. Intellectual Property Rights
                </h2>
                <p>
                  We believe in client autonomy. Upon full payment of the agreed project fees:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li>You own all custom source code, UI designs, brand assets, and content created specifically for your platform.</li>
                  <li>Nexora retains ownership of pre-existing proprietary boilerplates and open-source libraries incorporated into the build under standard MIT/Apache licenses.</li>
                  <li>Nexora reserves the right to showcase non-confidential project screenshots and anonymized metrics in our portfolio unless a strict white-label NDA is requested.</li>
                </ul>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading border-b border-border pb-2">
                  5. Contact &amp; Legal Inquiries
                </h2>
                <p>For contractual discussions or custom enterprise agreements, reach us at:</p>
                <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1 text-sm font-mono text-neutral-300">
                  <p>📧 Inquiries: <a href="mailto:support@nexoraagency.com" className="text-primary-400 hover:underline">support@nexoraagency.com</a></p>
                  <p>🏢 Lead Architect: MD Mahfuzul Haque</p>
                  <p>🚀 Start a Project: <Link href="/request-project" className="text-primary-400 hover:underline">Request a Project →</Link></p>
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
