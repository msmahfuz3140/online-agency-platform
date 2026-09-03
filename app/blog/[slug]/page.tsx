import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAiAssistant } from "@/components/home/FloatingAiAssistant";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlogContentRenderer } from "@/components/blog/BlogContentRenderer";
import { BlogShareButtons } from "@/components/blog/BlogShareButtons";
import { BlogCTASection } from "@/components/blog/BlogCTASection";
import { blogPosts } from "@/lib/blog-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: "Post Not Found | Nexora Agency",
    };
  }

  return {
    title: `${post.title} | Nexora Agency Blog`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Related posts (excluding current post)
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Article Header Section */}
        <Section className="pt-32 pb-10 sm:pt-40 sm:pb-12 border-b border-border/40">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb / Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors mb-6"
            >
              <span>←</span>
              <span>Back to all articles</span>
            </Link>

            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <Badge variant="primary" size="sm">
                {post.category}
              </Badge>
              <span className="text-xs text-muted-fg">•</span>
              <span className="text-xs text-muted-fg">{post.readingTime}</span>
              <span className="text-xs text-muted-fg">•</span>
              <span className="text-xs text-muted-fg">{formatDate(post.publishedAt)}</span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-4 text-base sm:text-lg text-muted-fg leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author */}
            <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center font-bold text-sm text-primary-400">
                  {post.author.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
                  <p className="text-xs text-muted-fg">{post.author.role}</p>
                </div>
              </div>

              {/* Share buttons */}
              <BlogShareButtons title={post.title} />
            </div>
          </div>
        </Section>

        {/* Visual Cover Banner */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 my-8">
          <div
            className={`w-full h-52 sm:h-72 rounded-2xl bg-gradient-to-br ${post.coverGradient} border border-border flex flex-col items-center justify-center p-6 text-center shadow-lg relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-surface-1/20 backdrop-blur-[1px]" />
            <span className="text-7xl sm:text-8xl select-none relative z-10 opacity-70 hover:scale-105 transition-transform duration-300">
              {post.coverIcon}
            </span>
            <span className="mt-3 text-xs uppercase tracking-widest text-muted-fg font-mono relative z-10">
              Nexora Technical Deep-Dive
            </span>
          </div>
        </div>

        {/* Main Article Body */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <BlogContentRenderer content={post.content} />

          {/* Tags */}
          <div className="mt-12 pt-6 border-t border-border/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-fg mb-3">
              Topics Covered
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-surface-2 border border-border text-muted-fg hover:text-foreground transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Bio Box */}
          <div className="mt-10 p-6 rounded-2xl border border-border bg-surface-1">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center font-bold text-base text-primary-400 flex-shrink-0">
                {post.author.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    {post.author.name}
                  </h3>
                  <Badge variant="primary" size="sm">
                    Author
                  </Badge>
                </div>
                <p className="text-xs text-primary-400 mt-0.5">{post.author.role}</p>
                <p className="mt-2 text-xs text-muted-fg leading-relaxed">
                  Building high-performance web applications and AI tools at Nexora Agency. Helping founders and businesses launch next-generation digital products with clean architecture.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Read Next Section */}
        {relatedPosts.length > 0 && (
          <Section className="py-12 border-t border-border/40 bg-surface-1/30">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-1">
                    Continue Reading
                  </p>
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    Recommended Articles
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-xs text-primary-400 hover:text-primary-300 font-semibold"
                >
                  View all →
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {relatedPosts.map((rp) => (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`} className="block group">
                    <Card hover padding="md" className="h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-surface-2 text-muted-fg">
                          {rp.category}
                        </span>
                        <span className="text-[10px] text-muted-fg">{rp.readingTime}</span>
                      </div>
                      <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary-400 transition-colors leading-snug mb-2 flex-1">
                        {rp.title}
                      </h3>
                      <p className="text-[11px] text-muted-fg line-clamp-2 mb-3">
                        {rp.excerpt}
                      </p>
                      <div className="text-[11px] text-primary-400 font-semibold flex items-center gap-1 mt-auto">
                        <span>Read article</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* CTA Section */}
        <BlogCTASection />
      </main>
      <Footer />
      <FloatingAiAssistant />
    </>
  );
}
