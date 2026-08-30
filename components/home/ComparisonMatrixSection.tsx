import { Section } from "../ui/Section";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";

interface ComparisonRow {
  feature: string;
  traditional: string;
  diy: string;
  nexora: string;
  isHighlight?: boolean;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "Pricing & Investment",
    traditional: "$15,000 – $30,000+",
    diy: "$25/mo (Ongoing lock-in)",
    nexora: "$350 – $1,400 (Fixed transparent)",
    isHighlight: true,
  },
  {
    feature: "Delivery Timeline",
    traditional: "8 – 16 Weeks",
    diy: "Days of DIY frustration",
    nexora: "Minutes (AI) + 5-14 Days (Human)",
    isHighlight: true,
  },
  {
    feature: "Full Code & IP Ownership",
    traditional: "Varies / Often restricted",
    diy: "❌ No (Platform locked)",
    nexora: "✅ 100% Full Git Repo & Files",
    isHighlight: true,
  },
  {
    feature: "Performance & PageSpeed",
    traditional: "Often bloated CMS templates",
    diy: "50-70 PageSpeed (Heavy scripts)",
    nexora: "⚡ 95+ Core Web Vitals Guaranteed",
    isHighlight: true,
  },
  {
    feature: "Cyber Security & Auditing",
    traditional: "Extra $3,000 – $5,000 add-on",
    diy: "❌ Zero custom pen-testing",
    nexora: "🛡️ Included by in-house Security Team",
    isHighlight: true,
  },
  {
    feature: "UI/UX & Design Freedom",
    traditional: "Good but slow revisions",
    diy: "Rigid, cookie-cutter templates",
    nexora: "🎨 Bespoke Figma + Modern React",
    isHighlight: false,
  },
  {
    feature: "Post-Launch Warranty",
    traditional: "Expensive hourly retainers",
    diy: "Generic bot support tickets",
    nexora: "🤝 14-Day Free Support + Dedicated Slack",
    isHighlight: false,
  },
  {
    feature: "Integrated AI Builder",
    traditional: "❌ Not available",
    diy: "Basic text auto-fill",
    nexora: "🤖 Claude Sonnet 4.6 Engine",
    isHighlight: false,
  },
];

export function ComparisonMatrixSection() {
  return (
    <Section id="comparison" className="relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-500/10 blur-[140px] pointer-events-none" />

      {/* Header */}
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <Badge variant="primary" dot className="mb-3">
            The Smart Choice
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Why Nexora Beats <span className="gradient-text">Old Alternatives</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-2xl mx-auto leading-relaxed">
            See how our AI-accelerated engineering model outperforms traditional overpriced agencies and restrictive DIY website builders.
          </p>
        </div>
      </FadeInSection>

      {/* Comparison Table */}
      <FadeInSection delay={0.15}>
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden ring-1 ring-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-neutral-800 bg-surface/50">
                  <th className="p-4 sm:p-5 text-xs font-semibold uppercase tracking-wider text-muted-fg w-1/3">
                    Feature & Metric
                  </th>
                  <th className="p-4 sm:p-5 text-xs font-semibold text-neutral-400 w-1/5">
                    Traditional Agency
                  </th>
                  <th className="p-4 sm:p-5 text-xs font-semibold text-neutral-400 w-1/5">
                    DIY Builders (Wix/WP)
                  </th>
                  <th className="p-4 sm:p-5 text-xs font-bold text-primary-400 bg-primary-500/10 border-x border-primary-500/30 w-1/4">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
                      <span>Nexora Hybrid</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-xs sm:text-sm">
                {comparisonData.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={`transition-colors hover:bg-neutral-900/40 ${
                      idx % 2 === 0 ? "bg-transparent" : "bg-surface/20"
                    }`}
                  >
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 text-neutral-400">
                      {row.traditional}
                    </td>
                    <td className="p-4 sm:p-5 text-neutral-400">
                      {row.diy}
                    </td>
                    <td className="p-4 sm:p-5 font-semibold text-foreground bg-primary-500/10 border-x border-primary-500/30">
                      <span className="text-primary-300 font-bold">{row.nexora}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom highlight bar */}
          <div className="p-4 sm:p-5 bg-primary-500/10 border-t border-primary-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-xs text-primary-300 font-medium">
              💡 Get the power of a Silicon Valley agency + instant AI prototyping at 60% less cost.
            </p>
            <span className="text-xs font-bold text-foreground">
              Zero compromises on speed, design, or security.
            </span>
          </div>
        </div>
      </FadeInSection>
    </Section>
  );
}
