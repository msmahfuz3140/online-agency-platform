import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";
import { BlogHeroSection } from "@/components/blog/BlogHeroSection";
import { BlogListSection } from "@/components/blog/BlogListSection";
import { BlogCTASection } from "@/components/blog/BlogCTASection";

export const metadata: Metadata = {
  title: "Blog & Engineering Insights | Nexora Agency",
  description:
    "Technical teardowns, Next.js best practices, AI engineering architectures, and real client conversion case studies from the engineers at Nexora Agency.",
  keywords: [
    "Web Development Blog",
    "Next.js 15 App Router",
    "Conversion Rate Optimization",
    "Claude AI API Web Generator",
    "SaaS Architecture",
    "Nexora Agency",
  ],
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <BlogHeroSection />
        <BlogListSection />
        <BlogCTASection />
      </main>
      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
