export interface InquiryCategoryMeta {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  department: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentColor: string;
  description: string;
}

export const INQUIRY_CATEGORIES: InquiryCategoryMeta[] = [
  {
    id: "web-dev",
    name: "Website Development",
    shortName: "Web Dev",
    icon: "🌐",
    department: "Website Engineering Division",
    badgeBg: "bg-blue-500/15",
    badgeBorder: "border-blue-500/30",
    badgeText: "text-blue-300",
    accentColor: "blue",
    description: "Next.js web apps, portfolios, storefronts & SaaS landing pages",
  },
  {
    id: "cyber-security",
    name: "Cyber Security & Audits",
    shortName: "Cyber Security",
    icon: "🛡️",
    department: "Cyber Security & Audits Division",
    badgeBg: "bg-emerald-500/15",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-300",
    accentColor: "emerald",
    description: "Penetration testing, vulnerability assessments & API hardening",
  },
  {
    id: "ai-solutions",
    name: "AI Solutions",
    shortName: "AI Solutions",
    icon: "⚡",
    department: "AI Systems & Blueprints Team",
    badgeBg: "bg-amber-500/15",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-300",
    accentColor: "amber",
    description: "AI website generator, Claude pipelines & automation bots",
  },
  {
    id: "devops-cloud",
    name: "DevOps & Infrastructure",
    shortName: "DevOps & Cloud",
    icon: "☁️",
    department: "DevOps & Edge Architecture Team",
    badgeBg: "bg-cyan-500/15",
    badgeBorder: "border-cyan-500/30",
    badgeText: "text-cyan-300",
    accentColor: "cyan",
    description: "Cloudflare DNS, Docker containers & CI/CD pipeline automation",
  },
  {
    id: "design-optimization",
    name: "Design & Optimization",
    shortName: "Design & UI/UX",
    icon: "✨",
    department: "Design Systems & UX Lab",
    badgeBg: "bg-purple-500/15",
    badgeBorder: "border-purple-500/30",
    badgeText: "text-purple-300",
    accentColor: "purple",
    description: "High-conversion Figma layouts, micro-animations & Web Vitals",
  },
  {
    id: "general-inquiry",
    name: "General Inquiry",
    shortName: "General / Direct",
    icon: "💬",
    department: "Executive Leadership Team",
    badgeBg: "bg-primary-500/15",
    badgeBorder: "border-primary-500/30",
    badgeText: "text-primary-300",
    accentColor: "teal",
    description: "Direct executive correspondence & custom enterprise contracts",
  },
];

const DEFAULT_CATEGORY: InquiryCategoryMeta = INQUIRY_CATEGORIES[5]; // General Inquiry

/**
 * Extracts and maps any inquiry subject or explicit category string
 * into the standardized InquiryCategoryMeta object.
 */
export function getInquiryCategory(
  subject?: string,
  explicitCategory?: string
): InquiryCategoryMeta {
  const combined = `${explicitCategory || ""} ${subject || ""}`.trim().toLowerCase();

  // 1. Explicit bracket match from subject, e.g. "Direct Service Inquiry: Portfolio [Website Development]"
  if (subject) {
    const match = subject.match(/\[(.*?)\]/);
    if (match && match[1]) {
      const bracketStr = match[1].toLowerCase();
      if (bracketStr.includes("cyber") || bracketStr.includes("security") || bracketStr.includes("audit")) {
        return INQUIRY_CATEGORIES[1];
      }
      if (bracketStr.includes("web") || bracketStr.includes("site") || bracketStr.includes("portfolio")) {
        return INQUIRY_CATEGORIES[0];
      }
      if (bracketStr.includes("ai") || bracketStr.includes("automation") || bracketStr.includes("bot")) {
        return INQUIRY_CATEGORIES[2];
      }
      if (bracketStr.includes("devops") || bracketStr.includes("cloud") || bracketStr.includes("infra")) {
        return INQUIRY_CATEGORIES[3];
      }
      if (bracketStr.includes("design") || bracketStr.includes("ui") || bracketStr.includes("ux")) {
        return INQUIRY_CATEGORIES[4];
      }
    }
  }

  // 2. Keyword heuristic checks
  if (
    combined.includes("security") ||
    combined.includes("cyber") ||
    combined.includes("audit") ||
    combined.includes("penetration") ||
    combined.includes("vulnerability") ||
    combined.includes("owasp")
  ) {
    return INQUIRY_CATEGORIES[1];
  }

  if (
    combined.includes("website") ||
    combined.includes("web development") ||
    combined.includes("portfolio") ||
    combined.includes("landing page") ||
    combined.includes("storefront") ||
    combined.includes("ecommerce") ||
    combined.includes("fullstack") ||
    combined.includes("next.js")
  ) {
    return INQUIRY_CATEGORIES[0];
  }

  if (
    combined.includes("ai solutions") ||
    combined.includes("ai system") ||
    combined.includes("ai builder") ||
    combined.includes("generator") ||
    combined.includes("automation") ||
    combined.includes("machine learning") ||
    combined.includes("claude")
  ) {
    return INQUIRY_CATEGORIES[2];
  }

  if (
    combined.includes("devops") ||
    combined.includes("cloud") ||
    combined.includes("docker") ||
    combined.includes("infrastructure") ||
    combined.includes("deployment")
  ) {
    return INQUIRY_CATEGORIES[3];
  }

  if (
    combined.includes("design") ||
    combined.includes("ui") ||
    combined.includes("ux") ||
    combined.includes("optimization") ||
    combined.includes("speed")
  ) {
    return INQUIRY_CATEGORIES[4];
  }

  return DEFAULT_CATEGORY;
}
