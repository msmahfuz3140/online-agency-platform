import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";
import { CaseStudiesHeroSection } from "@/components/case-studies/CaseStudiesHeroSection";
import { CaseStudiesListSection } from "@/components/case-studies/CaseStudiesListSection";
import { CaseStudiesCTASection } from "@/components/case-studies/CaseStudiesCTASection";

export const metadata: Metadata = {
  title: "Case Studies — Problem, Solution & Results | Nexora Agency",
  description:
    "Read Nexora's in-depth case studies: how we diagnosed real client problems, engineered precise digital solutions, and delivered measurable business results — with data to prove it.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <CaseStudiesHeroSection />
        <CaseStudiesListSection />
        <CaseStudiesCTASection />
      </main>
      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
