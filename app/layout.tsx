import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

// Heading font — Space Grotesk: modern, geometric, distinctive
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Body font — Inter: clean, highly legible, premium SaaS standard
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// Mono font — for code snippets / tech details
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nexora Agency — Premium Web & AI Solutions",
    template: "%s | Nexora Agency",
  },
  description:
    "Nexora is a premium digital agency specializing in web development, UI/UX design, and AI-powered website generation. We build fast, beautiful, and scalable digital products.",
  keywords: ["web agency", "AI website builder", "Next.js", "web development", "UI/UX design"],
  authors: [{ name: "Nexora Agency" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nexora Agency",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground"
      >
        {children}
      </body>
    </html>
  );
}
