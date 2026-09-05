import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";
import { RequestProjectHero } from "@/components/request-project/RequestProjectHero";
import { RequestProjectForm } from "@/components/request-project/RequestProjectForm";

export const metadata: Metadata = {
  title: "Request a Project | Nexora Agency",
  description:
    "Submit your project requirements and receive a detailed proposal from Nexora's senior engineers within 24 hours. Web apps, SaaS platforms, AI integrations, and more.",
  keywords: [
    "Request a Project",
    "Hire Web Developers",
    "Custom SaaS Development",
    "AI Integration Agency",
    "Next.js Development Agency",
    "Web App Development Quote",
    "Nexora Agency Project Request",
  ],
  openGraph: {
    title: "Request a Project | Nexora Agency",
    description:
      "Share your vision. Our senior engineers will deliver a detailed proposal within 24 hours.",
  },
};

export default function RequestProjectPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen">
        <RequestProjectHero />
        {/* Form section */}
        <section className="relative pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

              {/* Left sidebar — info */}
              <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-5 lg:sticky lg:top-24">
                {/* Why Nexora */}
                <div className="rounded-2xl border border-neutral-800/60 bg-neutral-950/60 backdrop-blur-sm p-6 space-y-4">
                  <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-widest">Why Nexora?</h2>
                  {[
                    { icon: "🏗️", title: "Senior Engineers Only", desc: "Every project is built by mid-to-senior level specialists, never juniors." },
                    { icon: "⚡", title: "Proven Delivery Speed", desc: "Our agile sprints ship production-ready code 2× faster than the industry norm." },
                    { icon: "🎯", title: "Fixed Scope, Fixed Price", desc: "No surprise invoices. We scope meticulously and honor our commitments." },
                    { icon: "🔐", title: "IP Ownership Guaranteed", desc: "You own 100% of the code, design assets, and intellectual property." },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-neutral-200">{item.title}</p>
                        <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="rounded-2xl border border-neutral-800/60 bg-neutral-950/60 backdrop-blur-sm p-6">
                  <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-widest mb-4">Track Record</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "50+", label: "Projects Shipped" },
                      { value: "98%", label: "Client Satisfaction" },
                      { value: "24h", label: "Avg Response Time" },
                      { value: "4", label: "Expert Engineers" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct contact */}
                <div className="rounded-2xl border border-primary-500/20 bg-primary-500/5 p-5 space-y-3">
                  <p className="text-sm font-semibold text-primary-300">Prefer direct contact?</p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Skip the form and email us directly. We read every message personally.
                  </p>
                  <a
                    href="mailto:contact@nexora.agency"
                    className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    contact@nexora.agency
                  </a>
                </div>
              </aside>

              {/* Right — main form */}
              <div className="flex-1 min-w-0">
                <RequestProjectForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
