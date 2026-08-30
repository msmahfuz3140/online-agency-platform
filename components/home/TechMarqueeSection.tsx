import { FadeInSection } from "../motion/FadeInSection";

interface TechItem {
  name: string;
  category: "web" | "design" | "security" | "cloud";
  icon: string;
}

const row1: TechItem[] = [
  { name: "Next.js 16", category: "web", icon: "▲" },
  { name: "TypeScript", category: "web", icon: "TS" },
  { name: "React", category: "web", icon: "⚛" },
  { name: "Tailwind CSS", category: "web", icon: "🌊" },
  { name: "Node.js", category: "web", icon: "🟢" },
  { name: "Figma", category: "design", icon: "🎨" },
  { name: "Express.js", category: "web", icon: "⚡" },
  { name: "MongoDB", category: "web", icon: "🍃" },
  { name: "Framer Motion", category: "design", icon: "✨" },
  { name: "PostgreSQL", category: "web", icon: "🐘" },
  { name: "GraphQL", category: "web", icon: "◈" },
  { name: "Python", category: "web", icon: "🐍" },
];

const row2: TechItem[] = [
  { name: "Kali Linux", category: "security", icon: "🐉" },
  { name: "Burp Suite", category: "security", icon: "🛡️" },
  { name: "OWASP Hardening", category: "security", icon: "🔒" },
  { name: "Wireshark", category: "security", icon: "🦈" },
  { name: "Metasploit", category: "security", icon: "⚔️" },
  { name: "Nmap Scanning", category: "security", icon: "📡" },
  { name: "Docker", category: "cloud", icon: "🐳" },
  { name: "AWS Cloud", category: "cloud", icon: "☁️" },
  { name: "Vercel", category: "cloud", icon: "▲" },
  { name: "Stripe Billing", category: "cloud", icon: "💳" },
  { name: "Redis Cache", category: "cloud", icon: "🔴" },
  { name: "Git & CI/CD", category: "cloud", icon: "🐙" },
];

const dotColors: Record<TechItem["category"], string> = {
  web: "bg-primary-400",
  design: "bg-amber-400",
  security: "bg-emerald-400",
  cloud: "bg-violet-400",
};

function TechCard({ item }: { item: TechItem }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface/80 border border-border/80 hover:border-primary-500/50 hover:bg-surface transition-all duration-200 shadow-sm whitespace-nowrap select-none group">
      <span className="font-mono text-xs font-bold text-foreground group-hover:text-primary-400 transition-colors">
        {item.icon}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
        {item.name}
      </span>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[item.category]}`} />
    </div>
  );
}

export function TechMarqueeSection() {
  return (
    <section className="py-12 sm:py-16 border-y border-border/60 bg-surface/20 overflow-hidden relative">
      <FadeInSection>
        <div className="text-center mb-8 sm:mb-10 px-4">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-primary-400 mb-1.5">
            Enterprise Tooling & Technologies
          </p>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
            Built with modern industry-standard stacks
          </h3>
        </div>
      </FadeInSection>

      {/* Marquee with smooth gradient fade masks */}
      <div className="mask-gradient-x flex flex-col gap-3.5 sm:gap-4 overflow-hidden py-1">
        {/* Row 1 - Left to Right */}
        <div className="animate-marquee gap-3.5 sm:gap-4">
          {row1.concat(row1).map((item, idx) => (
            <TechCard key={`row1-${item.name}-${idx}`} item={item} />
          ))}
        </div>

        {/* Row 2 - Right to Left */}
        <div className="animate-marquee-reverse gap-3.5 sm:gap-4">
          {row2.concat(row2).map((item, idx) => (
            <TechCard key={`row2-${item.name}-${idx}`} item={item} />
          ))}
        </div>
      </div>

      {/* Categories Legend */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-4 text-[11px] text-muted-fg">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary-400" />
          <span>Full-Stack Web</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span>UI/UX & Design</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Cyber Security & Hacking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-violet-400" />
          <span>DevOps & Cloud</span>
        </div>
      </div>
    </section>
  );
}
