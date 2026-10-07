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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nxoraagency.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nexora Agency — Premium Web & Digital Solutions",
    template: "%s | Nexora Agency",
  },
  description:
    "Nexora is a premium digital agency specializing in full-stack web development, UI/UX product design, and cybersecurity audits. We build fast, secure, and scalable digital products.",
  keywords: ["web agency", "Next.js 15", "web development", "UI/UX design", "cybersecurity", "Nexora Agency"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Nexora Agency",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "Nexora Agency Logo",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('nexora_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = storedTheme || (prefersDark ? 'dark' : 'light');
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden max-w-full"
      >
        {children}
      </body>
    </html>
  );
}

