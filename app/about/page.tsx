import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";
import { AboutHeroSection } from "@/components/about/AboutHeroSection";
import { AgencyStorySection } from "@/components/about/AgencyStorySection";
import { MissionVisionSection } from "@/components/about/MissionVisionSection";
import { FounderProfileSection } from "@/components/about/FounderProfileSection";
import { TechStackShowcaseSection } from "@/components/about/TechStackShowcaseSection";
import { AchievementsSection } from "@/components/about/AchievementsSection";
import { AboutCTASection } from "@/components/about/AboutCTASection";

export const metadata: Metadata = {
  title: "About Us — Story, Team & Technology | Nexora Agency",
  description:
    "Discover Nexora Agency: our CST engineering roots at Mymensingh Polytechnic Institute, mission, leadership team led by MD Mahfuzul Haque, cutting-edge technology stack, and client milestones.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <AboutHeroSection />
        <AgencyStorySection />
        <MissionVisionSection />
        <FounderProfileSection />
        <TechStackShowcaseSection />
        <AchievementsSection />
        <AboutCTASection />
      </main>
      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
