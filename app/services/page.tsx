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
  title: "Our Services — Web, SaaS, UI/UX & AI Development | Nexora Agency",
  description:
    "Explore Nexora's 13 core digital engineering services: Portfolio, Business, Landing Page, SaaS, E-commerce, Web Application, UI/UX Design, Redesign, SEO, Maintenance, Hosting, Domain, and AI Solution Development.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ServicesHeroSection />
        <ServicesGridSection />
        <ServiceWorkflowSection />
        <ServicesFAQSection />
        <ServicesCTASection />
      </main>
      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
