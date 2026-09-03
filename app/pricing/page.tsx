import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";
import { PricingHeroSection } from "@/components/pricing/PricingHeroSection";
import { PricingPlansSection } from "@/components/pricing/PricingPlansSection";
import { PricingFAQSection } from "@/components/pricing/PricingFAQSection";

export const metadata: Metadata = {
  title: "Pricing — Free, Pro & Business Plans | Nexora Agency",
  description:
    "Transparent pricing plans from Nexora Agency: a free AI website builder tier, plus Pro and Business tiers (coming soon) for custom websites, SaaS apps, and enterprise digital solutions.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PricingHeroSection />
        <PricingPlansSection />
        <PricingFAQSection />
      </main>
      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
