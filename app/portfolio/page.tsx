import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";
import { PortfolioHeroSection } from "@/components/portfolio/PortfolioHeroSection";
import { PortfolioGridSection } from "@/components/portfolio/PortfolioGridSection";
import { PortfolioCTASection } from "@/components/portfolio/PortfolioCTASection";

export const metadata: Metadata = {
  title: "Portfolio — Projects, Case Studies & Live Demos | Nexora Agency",
  description:
    "Browse Nexora's complete project portfolio: SaaS dashboards, e-commerce stores, landing pages, portfolio websites, and AI-powered digital products with live demos and GitHub links.",
};

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PortfolioHeroSection />
        <PortfolioGridSection />
        <PortfolioCTASection />
      </main>
      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
