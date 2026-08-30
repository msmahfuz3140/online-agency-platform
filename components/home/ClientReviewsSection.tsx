import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";

const reviews = [
  {
    name: "Tahmid Rahman",
    role: "Founder, PayPath BD",
    rating: 5,
    text: "Nexora delivered our SaaS dashboard in 6 weeks — ahead of schedule and beyond what we imagined. The attention to performance and UX detail was unreal for the price point.",
    avatar: "TR",
  },
  {
    name: "Sadia Islam",
    role: "CEO, Bloom Nurseries",
    rating: 5,
    text: "Our e-commerce store used to be a Wix template. Now it's a custom Next.js storefront that loads in under 1 second. Conversions went up 34% in the first month.",
    avatar: "SI",
  },
  {
    name: "Alex Kim",
    role: "Design Director, Radius Studio",
    rating: 5,
    text: "The team understood our creative vision immediately. They pushed our portfolio site further than we expected — the GSAP scroll animations get compliments every week.",
    avatar: "AK",
  },
  {
    name: "Rafiul Hossain",
    role: "CTO, StackFlow",
    rating: 5,
    text: "What impressed me most was the code quality. Clean TypeScript, proper testing, thorough README. We could onboard our own devs to the codebase in a day.",
    avatar: "RH",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-4 w-4 text-accent-400 fill-accent-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
        </svg>
      ))}
    </div>
  );
}

export function ClientReviewsSection() {
  return (
    <Section className="bg-surface/40">
      <FadeInSection>
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">Testimonials</p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Loved by the teams{" "}
            <br className="hidden sm:inline" />
            <span className="gradient-text">we build for.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-fg max-w-md mx-auto leading-relaxed">
            Real feedback from founders, product leaders, and growing teams worldwide.
          </p>
        </div>
      </FadeInSection>

      <StaggerList className="grid md:grid-cols-2 gap-4 sm:gap-5">
        {reviews.map((r) => (
          <Card key={r.name} hover padding="lg">
            <StarRating count={r.rating} />
            <p className="mt-4 text-sm text-foreground leading-relaxed">&ldquo;{r.text}&rdquo;</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-400">{r.avatar}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-fg">{r.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </StaggerList>
    </Section>
  );
}
