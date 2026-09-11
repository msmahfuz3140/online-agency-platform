import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { AgencyIntroSection } from "@/components/home/AgencyIntroSection";
import { TechMarqueeSection } from "@/components/home/TechMarqueeSection";
import { AiGeneratorDemoSection } from "@/components/home/AiGeneratorDemoSection";
import { AiComponentLibrarySection } from "@/components/home/AiComponentLibrarySection";
import { ClientPathwaySection } from "@/components/home/ClientPathwaySection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { ComparisonMatrixSection } from "@/components/home/ComparisonMatrixSection";
import { FeaturedProjectsSection } from "@/components/home/FeaturedProjectsSection";
import { ClientImpactSection } from "@/components/home/ClientImpactSection";
import { PerformanceComparisonSliderSection } from "@/components/home/PerformanceComparisonSliderSection";
import { InteractiveComponentPlaygroundSection } from "@/components/home/InteractiveComponentPlaygroundSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { SprintEngineRoadmapSection } from "@/components/home/SprintEngineRoadmapSection";
import { ServicesOverviewSection } from "@/components/home/ServicesOverviewSection";
import { TeamSection } from "@/components/home/TeamSection";
import { ClientReviewsSection } from "@/components/home/ClientReviewsSection";
import { ProjectCostCalculatorSection } from "@/components/home/ProjectCostCalculatorSection";
import { PricingPreviewSection } from "@/components/home/PricingPreviewSection";
import { TrustGuaranteesSection } from "@/components/home/TrustGuaranteesSection";
import { EnterpriseSecurityVaultSection } from "@/components/home/EnterpriseSecurityVaultSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-hidden max-w-full">
        <HeroSection />
        <AgencyIntroSection />
        <TechMarqueeSection />
        <AiGeneratorDemoSection />
        <AiComponentLibrarySection />
        <InteractiveComponentPlaygroundSection />
        <ClientPathwaySection />
        <WhyChooseUsSection />
        <ComparisonMatrixSection />
        <FeaturedProjectsSection />
        <ClientImpactSection />
        <PerformanceComparisonSliderSection />
        <HowItWorksSection />
        <SprintEngineRoadmapSection />
        <ServicesOverviewSection />
        <TeamSection />
        <ClientReviewsSection />
        <ProjectCostCalculatorSection />
        <PricingPreviewSection />
        <TrustGuaranteesSection />
        <EnterpriseSecurityVaultSection />
        <FAQSection />
        <CTASection />
        <NewsletterSection />
      </main>
      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
