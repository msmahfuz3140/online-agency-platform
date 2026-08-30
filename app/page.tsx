import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { AgencyIntroSection } from "@/components/home/AgencyIntroSection";
import { TechMarqueeSection } from "@/components/home/TechMarqueeSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { FeaturedProjectsSection } from "@/components/home/FeaturedProjectsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ServicesOverviewSection } from "@/components/home/ServicesOverviewSection";
import { TeamSection } from "@/components/home/TeamSection";
import { ClientReviewsSection } from "@/components/home/ClientReviewsSection";
import { PricingPreviewSection } from "@/components/home/PricingPreviewSection";
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
        <WhyChooseUsSection />
        <FeaturedProjectsSection />
        <HowItWorksSection />
        <ServicesOverviewSection />
        <TeamSection />
        <ClientReviewsSection />
        <PricingPreviewSection />
        <FAQSection />
        <CTASection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
