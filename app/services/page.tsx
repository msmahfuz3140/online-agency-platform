import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";
import { ServicesHeroSection } from "@/components/services/ServicesHeroSection";
import { ServicesGridSection } from "@/components/services/ServicesGridSection";
import { ServiceWorkflowSection } from "@/components/services/ServiceWorkflowSection";
import { ServicesFAQSection } from "@/components/services/ServicesFAQSection";
import { ServicesCTASection } from "@/components/services/ServicesCTASection";

export const metadata: Metadata = {
  title: "Specialized Digital Services — Web, Cyber Security, UI/UX & AI | Nexora Agency",
  description:
    "Explore Nexora's 16 specialized digital engineering services: Full-Stack Web Development, Penetration Testing, Cyber Security Audits, UI/UX Design, Cloud Infrastructure, and AI Workflow Automations.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ServicesHeroSection />
        <Suspense
          fallback={
            <div className="py-24 text-center text-muted-fg font-mono text-xs flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-500 animate-ping" />
              Loading specialized services...
            </div>
          }
        >
          <ServicesGridSection />
        </Suspense>
        <ServiceWorkflowSection />
        <ServicesFAQSection />
        <ServicesCTASection />
      </main>
      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
