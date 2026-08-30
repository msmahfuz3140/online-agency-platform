import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

interface TeamMember {
  name: string;
  role: string;
  department: string;
  institute: string;
  bio: string;
  skills: string[];
  initials: string;
  gradient: string;
  roleBadgeVariant: "primary" | "warning" | "success" | "default";
}

const teamMembers: TeamMember[] = [
  {
    name: "MD Mahfuzul Haque",
    role: "Fullstack Web Developer",
    department: "Computer Science & Technology (CST)",
    institute: "Mymensingh Polytechnic Institute",
    bio: "Specializing in modern full-stack architectures, Next.js, high-performance APIs, and scalable SaaS solutions.",
    skills: ["Next.js", "TypeScript", "Node.js", "MongoDB", "Express.js"],
    initials: "MH",
    gradient: "from-primary-500/25 via-primary-500/10 to-transparent",
    roleBadgeVariant: "primary",
  },
  {
    name: "Jahidul Islam",
    role: "UI/UX Designer",
    department: "Computer Science & Technology (CST)",
    institute: "Mymensingh Polytechnic Institute",
    bio: "Crafting intuitive, accessible, and high-conversion design systems, wireframes, and digital product experiences.",
    skills: ["Figma", "UI/UX Design", "Design Systems", "Prototyping", "User Research"],
    initials: "JI",
    gradient: "from-amber-500/25 via-amber-500/10 to-transparent",
    roleBadgeVariant: "warning",
  },
  {
    name: "Saif Khan",
    role: "Cyber Security Specialist",
    department: "Computer Science & Technology (CST)",
    institute: "Mymensingh Polytechnic Institute",
    bio: "Focused on hardening infrastructure, threat modeling, network defense, and web application security auditing.",
    skills: ["Network Security", "App Hardening", "Penetration Testing", "Threat Analysis"],
    initials: "SK",
    gradient: "from-emerald-500/25 via-emerald-500/10 to-transparent",
    roleBadgeVariant: "success",
  },
  {
    name: "Koushik Kumar",
    role: "Ethical Hacking & Cyber Security",
    department: "Computer Science & Technology (CST)",
    institute: "Mymensingh Polytechnic Institute",
    bio: "Conducting proactive vulnerability assessments, ethical hacking, and ensuring zero-day security resilience.",
    skills: ["Ethical Hacking", "Vulnerability Assessment", "Security Audits", "Bug Bounty"],
    initials: "KK",
    gradient: "from-violet-500/25 via-violet-500/10 to-transparent",
    roleBadgeVariant: "default",
  },
];

export function TeamSection() {
  return (
    <Section id="team">
      {/* Centered Section Header */}
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
            Meet Our Experts
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            The Minds Behind <span className="gradient-text">Nexora</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-xl mx-auto leading-relaxed">
            A specialized engineering team from Mymensingh Polytechnic Institute (CST) building cutting-edge web products, sleek UI/UX, and hardened cyber security.
          </p>
        </div>
      </FadeInSection>

      {/* Team Cards Grid */}
      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {teamMembers.map((member) => (
          <Card
            key={member.name}
            hover
            padding="none"
            className="overflow-hidden flex flex-col group h-full"
          >
            {/* Avatar / Profile Header Area */}
            <div
              className={`relative h-44 sm:h-48 bg-gradient-to-br ${member.gradient} border-b border-border flex flex-col items-center justify-center p-4`}
            >
              {/* Decorative background glow */}
              <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

              {/* Demo Avatar Circle (ready for future image) */}
              <div className="relative h-20 w-20 rounded-2xl bg-surface border-2 border-primary-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-primary-500/70 transition-all duration-300">
                <span className="font-heading font-bold text-2xl text-foreground">
                  {member.initials}
                </span>
                {/* Status indicator badge */}
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-surface flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </div>

              {/* Role Badge floating below avatar */}
              <div className="mt-3">
                <Badge variant={member.roleBadgeVariant} size="sm">
                  {member.role}
                </Badge>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-heading font-bold text-base sm:text-lg text-foreground text-center">
                {member.name}
              </h3>

              {/* Academic Institute Info */}
              <div className="mt-2.5 p-2 rounded-xl bg-surface-2/60 border border-border/70 text-center">
                <p className="text-[11px] font-semibold text-primary-400">
                  {member.department}
                </p>
                <p className="text-[10px] text-muted-fg mt-0.5">
                  {member.institute}
                </p>
              </div>

              {/* Bio */}
              <p className="mt-3 text-xs text-muted-fg leading-relaxed text-center flex-1">
                {member.bio}
              </p>

              {/* Skills Tags */}
              <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-1.5 justify-center">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-surface-2 text-muted-fg border border-border font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social / Contact Links Placeholders */}
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-center gap-2">
                {["LinkedIn", "GitHub", "Twitter"].map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    aria-label={`${member.name}'s ${platform}`}
                    className="h-7 w-7 rounded-lg text-muted-fg hover:text-primary-400 hover:bg-surface-2 border border-border/50 flex items-center justify-center transition-colors text-[11px]"
                  >
                    {platform[0]}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </StaggerList>
    </Section>
  );
}
