import Link from "next/link";
import { Badge } from "../ui/Badge";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { FadeInSection } from "../motion/FadeInSection";
import { StaggerList } from "../motion/StaggerList";
import { blogPosts, type BlogPost } from "@/lib/blog-data";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card hover padding="none" className="overflow-hidden sm:flex">
        {/* Visual */}
        <div
          className={`sm:w-72 lg:w-80 h-52 sm:h-auto flex-shrink-0 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center border-b sm:border-b-0 sm:border-r border-border`}
        >
          <span className="text-6xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300 select-none">
            {post.coverIcon}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="warning" size="sm">Featured</Badge>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-surface-2 text-muted-fg">
              {post.category}
            </span>
            <span className="text-[10px] text-muted-fg">{post.readingTime}</span>
          </div>

          <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground group-hover:text-primary-400 transition-colors leading-snug mb-2">
            {post.title}
          </h2>
          <p className="text-xs text-muted-fg leading-relaxed flex-1 mb-4">{post.excerpt}</p>

          {/* Meta */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-xs font-bold text-primary-400">
              {post.author.initials}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-foreground">{post.author.name}</p>
              <p className="text-[10px] text-muted-fg">{formatDate(post.publishedAt)}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group h-full">
      <Card hover padding="none" className="overflow-hidden h-full flex flex-col">
        {/* Visual */}
        <div
          className={`h-40 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center border-b border-border`}
        >
          <span className="text-5xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300 select-none">
            {post.coverIcon}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-surface-2 text-muted-fg">
              {post.category}
            </span>
            <span className="text-[10px] text-muted-fg">{post.readingTime}</span>
          </div>

          <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary-400 transition-colors leading-snug mb-1.5 flex-1">
            {post.title}
          </h3>
          <p className="text-[11px] text-muted-fg leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-surface-2 text-muted-fg border border-border">
                {t}
              </span>
            ))}
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/40">
            <div className="h-6 w-6 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-[10px] font-bold text-primary-400">
              {post.author.initials}
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground">{post.author.name}</p>
              <p className="text-[9px] text-muted-fg">{formatDate(post.publishedAt)}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function BlogListSection() {
  const featured = blogPosts.filter((p) => p.featured);
  const regular = blogPosts.filter((p) => !p.featured);

  return (
    <Section id="blog-list" className="pb-24">
      {/* Section header */}
      <FadeInSection>
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
            Insights & Engineering
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            From the <span className="gradient-text">Nexora Lab</span>
          </h2>
          <p className="mt-3 text-sm text-muted-fg max-w-xl leading-relaxed">
            Technical deep-dives, case study breakdowns, and honest takes on the tools and frameworks
            we use to build for our clients.
          </p>
        </div>
      </FadeInSection>

      {/* Featured posts */}
      {featured.length > 0 && (
        <FadeInSection>
          <div className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-3">
              Featured
            </p>
            <div className="space-y-4">
              {featured.map((post) => (
                <FeaturedPostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </FadeInSection>
      )}

      {/* Regular posts grid */}
      {regular.length > 0 && (
        <>
          <FadeInSection>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-4 mt-10">
              More Articles
            </p>
          </FadeInSection>
          <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {regular.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </StaggerList>
        </>
      )}
    </Section>
  );
}
