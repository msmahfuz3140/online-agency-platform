import Link from "next/link";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

interface ServiceItem {
  icon: string;
  pillar: string;
  pillarVariant: "primary" | "warning" | "success" | "default";
  title: string;
  desc: string;
  tags: string[];
  from: string;
}

const services: ServiceItem[] = [
  // 1. Website Related Everything
  {
    icon: "🌐",
    pillar: "Web Development",
    pillarVariant: "primary",
    title: "Full-Stack Website Development",
    desc: "Custom Next.js/React business sites, portfolios, CMS platforms, and web architectures built with 95+ Core Web Vitals performance.",
    tags: ["Next.js", "React", "TypeScript", "Node.js", "API"],
    from: "5-14 days",
  },
  // 2. UI/UX Design Related Everything
  {
    icon: "🎨",
    pillar: "UI/UX Design",
    pillarVariant: "warning",
    title: "UI/UX & Product Design",
    desc: "Complete Figma design systems, intuitive wireframes, responsive mobile/web layouts, conversion-driven UX, and clickable prototypes.",
    tags: ["Figma", "Design System", "Wireframing", "Prototyping"],
    from: "3-10 days",
  },
  // 3. Cyber Security Related Everything
  {
    icon: "🛡️",
    pillar: "Cyber Security",
    pillarVariant: "success",
    title: "Cyber Security & Penetration Testing",
    desc: "Thorough web application security audits, vulnerability scanning, OWASP Top 10 testing, threat mitigation, and infrastructure hardening.",
    tags: ["Penetration Testing", "OWASP", "Vulnerability Audit", "Hardening"],
    from: "3-7 days",
  },
  // 4. Digital Marketing Related Everything
  {
    icon: "📈",
    pillar: "Digital Marketing",
    pillarVariant: "default",
    title: "Technical SEO & Digital Marketing",
    desc: "Data-driven organic search optimization, keyword strategy, conversion rate optimization (CRO), analytics setup, and growth campaigns.",
    tags: ["Technical SEO", "CRO", "Google Analytics", "Growth"],
    from: "Ongoing",
  },
  // 5. SaaS & Web Apps
  {
    icon: "⚡",
    pillar: "Web Development",
    pillarVariant: "primary",
    title: "SaaS & Web Applications",
    desc: "End-to-end multi-tenant SaaS platforms with secure role-based auth, payment gateways (Stripe/Razorpay), and real-time interactive dashboards.",
    tags: ["SaaS Architecture", "Auth", "Billing", "Realtime DB"],
    from: "3-6 weeks",
  },
  // 6. Ethical Hacking & Security Audits
  {
    icon: "🔐",
    pillar: "Cyber Security",
    pillarVariant: "success",
    title: "Ethical Hacking & Code Auditing",
    desc: "Proactive white-hat security assessments, backend API stress tests, authentication bypass auditing, and defensive code review.",
    tags: ["Ethical Hacking", "API Security", "Bug Hunting", "Compliance"],
    from: "4-8 days",
  },
  // 7. E-Commerce & Online Stores
  {
    icon: "🛒",
    pillar: "Web Development",
    pillarVariant: "primary",
    title: "E-Commerce & Storefronts",
    desc: "Lightning-fast custom online stores with modern cart management, product catalogs, customer portals, and seamless checkout flows.",
    tags: ["E-Commerce", "Payment Gateways", "Cart/Checkout", "CMS"],
    from: "2-4 weeks",
  },
  // 8. AI Solutions & Automation
  {
    icon: "🤖",
    pillar: "AI & Automation",
    pillarVariant: "warning",
    title: "AI Website Builder & Automations",
    desc: "AI-powered web generation tools, LLM prompt engineering, automated customer onboarding workflows, and smart platform integrations.",
    tags: ["AI Builder", "Claude API", "Workflow Automations"],
    from: "Instant / Custom",
  },
];

const pillars = [
  { name: "Website Development", icon: "💻", count: "Websites, SaaS & E-Com" },
  { name: "UI/UX Product Design", icon: "✨", count: "Figma, Prototypes & Systems" },
  { name: "Cyber Security", icon: "🔒", count: "Pen Testing & Audits" },
  { name: "Digital Marketing", icon: "📊", count: "SEO & Growth Engine" },
];

export function ServicesOverviewSection() {
  return (
    <Section className="bg-surface/40" id="services">
      {/* Centered Section Header */}
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
            Complete Digital Solutions
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Our Core <span className="gradient-text">Services</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-2xl mx-auto leading-relaxed">
            From full-scale website engineering and award-winning UI/UX to offensive cyber security audits and digital marketing — everything your digital product needs.
          </p>
        </div>
      </FadeInSection>

      {/* 4 Pillars Quick Overview Badges */}
      <FadeInSection delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
          {pillars.map((p) => (
            <div
              key={p.name}
              className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-border/80 flex items-center gap-3 hover:border-primary-500/40 transition-colors shadow-sm"
            >
              <span className="text-2xl flex-shrink-0">{p.icon}</span>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  {p.name}
                </p>
                <p className="text-[11px] text-muted-fg truncate mt-0.5">
                  {p.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </FadeInSection>

      {/* Detailed Services Grid */}
      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {services.map((s) => (
          <Card
            key={s.title}
            hover
            padding="md"
            className="flex flex-col justify-between group h-full"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl sm:text-3xl">{s.icon}</span>
                <Badge variant={s.pillarVariant} size="sm">
                  {s.pillar}
                </Badge>
              </div>

              <h3 className="font-heading font-semibold text-sm sm:text-base text-foreground leading-snug">
                {s.title}
              </h3>

              <p className="mt-2 text-xs text-muted-fg leading-relaxed">
                {s.desc}
              </p>

              {/* Tag pills */}
              <div className="mt-3.5 flex flex-wrap gap-1">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-muted-fg border border-border/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-muted-fg">
                Delivery: <span className="text-primary-400 font-medium">{s.from}</span>
              </span>
              <span className="text-xs text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                Inquire →
              </span>
            </div>
          </Card>
        ))}
      </StaggerList>

      {/* Centered CTA button at bottom */}
      <FadeInSection delay={0.2}>
        <div className="mt-12 p-6 sm:p-8 rounded-2xl border border-primary-500/30 bg-surface/80 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto shadow-[0_12px_36px_rgba(20,184,160,0.06)]">
          <div className="text-center sm:text-left">
            <span className="text-xs font-mono font-semibold text-primary-400">13 SPECIALIZED OFFERINGS</span>
            <h4 className="font-heading text-lg sm:text-xl font-bold text-foreground mt-0.5">
              Looking for our complete catalog of services & deliverables?
            </h4>
            <p className="text-xs sm:text-sm text-muted-fg mt-1">
              Explore all 13 development, UI/UX, SEO, cloud, and AI engineering services.
            </p>
          </div>
          <Link href="/services" className="shrink-0">
            <Button variant="primary" size="md">
              View All 13 Services →
            </Button>
          </Link>
        </div>
      </FadeInSection>
    </Section>
  );
}
