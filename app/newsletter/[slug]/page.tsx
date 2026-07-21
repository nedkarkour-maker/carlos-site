import type { Metadata } from "next";
import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getAllPosts, getPost } from "@/lib/newsletter";

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

// Only slugs from generateStaticParams exist — anything else 404s.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Carlos Charabati`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      // Post covers are /public paths; metadataBase makes them absolute.
      // Without a cover, the site-wide opengraph-image applies.
      ...(post.cover ? { images: [post.cover] } : {}),
    },
  };
}

/* Token-styled building blocks for the MDX body. */
const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mb-4 mt-10 font-display text-2xl font-extrabold tracking-[-0.01em]"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mb-3 mt-8 font-display text-xl font-bold" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mt-4 text-[17px] leading-relaxed text-ink-soft" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="font-medium text-red-dark underline underline-offset-2 transition-colors hover:text-red"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="mt-4 list-disc space-y-2 pl-5 text-[17px] text-ink-soft marker:text-red"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-5 text-[17px] text-ink-soft marker:text-red"
      {...props}
    />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-6 border-l-4 border-red pl-4 font-display text-lg font-semibold text-ink"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-10 border-line-dark" {...props} />
  ),
};

export default async function NewsletterPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Navbar alwaysSolid />
      <main className="pb-20 pt-28">
        <article className="wrap max-w-[760px]">
          <Link
            href="/newsletter"
            className="font-mono text-[13px] text-ink-soft transition-colors hover:text-ink"
          >
            ← All posts
          </Link>
          <p className="mt-8 font-mono text-xs tracking-[.05em] text-red-dark">
            {post.displayDate}
          </p>
          <h1 className="mt-2 font-display text-[clamp(30px,5vw,48px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            {post.title}
          </h1>
          {post.cover && (
            <div className="relative mt-8 aspect-[2/1] overflow-hidden rounded-[10px]">
              <Image
                src={post.cover}
                alt=""
                fill
                priority
                sizes="(max-width: 800px) 100vw, 760px"
                className="object-cover"
              />
            </div>
          )}
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>
      </main>
      <Footer />
    </>
  );
}
