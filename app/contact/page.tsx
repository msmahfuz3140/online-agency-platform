import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";
import { ContactHeroSection } from "@/components/contact/ContactHeroSection";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactFAQSection } from "@/components/contact/ContactFAQSection";

export const metadata: Metadata = {
  title: "Contact Us & Project Inquiry | Nexora Agency",
  description:
    "Get in touch directly with Nexora Agency's engineering team for custom web applications, SaaS platforms, AI website builder solutions, and UI/UX design. Guaranteed response within 2-4 hours.",
  keywords: [
    "Contact Nexora Agency",
    "Hire Web Developers",
    "Next.js Agency Contact",
    "Custom SaaS Development",
    "AI Solution Development",
    "Web Engineering Consultation",
  ],
  openGraph: {
    title: "Contact Us & Project Inquiry | Nexora Agency",
    description:
      "Direct line to senior engineers for web development, SaaS, and AI platforms. Sub-2h response SLA.",
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ContactHeroSection />
        <ContactFormSection />
        <ContactFAQSection />
      </main>
      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
