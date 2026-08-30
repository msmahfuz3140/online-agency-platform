import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { AgencyIntroSection } from "@/components/home/AgencyIntroSection";
import { TechMarqueeSection } from "@/components/home/TechMarqueeSection";
import { AiGeneratorDemoSection } from "@/components/home/AiGeneratorDemoSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { FeaturedProjectsSection } from "@/components/home/FeaturedProjectsSection";
import { ClientImpactSection } from "@/components/home/ClientImpactSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ServicesOverviewSection } from "@/components/home/ServicesOverviewSection";
import { TeamSection } from "@/components/home/TeamSection";
import { ClientReviewsSection } from "@/components/home/ClientReviewsSection";
import { ProjectCostCalculatorSection } from "@/components/home/ProjectCostCalculatorSection";
import { PricingPreviewSection } from "@/components/home/PricingPreviewSection";
import { TrustGuaranteesSection } from "@/components/home/TrustGuaranteesSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AgencyIntroSection />
        <TechMarqueeSection />
        <AiGeneratorDemoSection />
        <WhyChooseUsSection />
        <FeaturedProjectsSection />
        <ClientImpactSection />
        <HowItWorksSection />
        <ServicesOverviewSection />
        <TeamSection />
        <ClientReviewsSection />
        <ProjectCostCalculatorSection />
        <PricingPreviewSection />
        <TrustGuaranteesSection />
        <FAQSection />
        <CTASection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
