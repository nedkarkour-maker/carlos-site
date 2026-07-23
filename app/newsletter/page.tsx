import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { newsletter } from "@/config/content";
import { getAllPosts } from "@/lib/newsletter";

export const metadata: Metadata = {
  title: "Newsletter — Carlos Charabati",
  description: newsletter.intro,
};

export default function NewsletterPage() {
  // Only published posts are listed — drafts stay hidden here, on the
  // homepage teaser and in the sitemap alike.
  const posts = getAllPosts().filter((post) => !post.draft);

  return (
    <>
      <Navbar alwaysSolid />
      <main>
        <header className="bg-teal-900 pb-14 pt-32 text-sail">
          <div className="wrap">
            <p className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-red-bright">
              {newsletter.eyebrow}
            </p>
            <h1 className="font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              {newsletter.title}
            </h1>
            <p className="mt-3.5 max-w-[640px] text-base text-sail/70">
              {newsletter.intro}
            </p>
          </div>
        </header>

        <section className="wrap py-16">
          {posts.length === 0 && (
            <p className="font-mono text-sm text-ink-soft">
              No posts yet — the first one lands soon.
            </p>
          )}
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/newsletter/${post.slug}`}
              className="flex items-center justify-between gap-6 border-b border-line-dark py-[22px] transition-[padding-left] duration-200 first:border-t hover:pl-2"
            >
              <div>
                <p className="font-mono text-xs tracking-[.05em] text-red-dark">
                  {post.displayDate}
                </p>
                <h2 className="my-1.5 font-display text-[21px] font-bold">
                  {post.title}
                </h2>
                <p className="max-w-[680px] text-[14.5px] text-ink-soft">
                  {post.excerpt}
                </p>
              </div>
              {post.cover && (
                <div className="relative hidden aspect-[4/3] w-40 shrink-0 overflow-hidden rounded-md sm:block">
                  <Image
                    src={post.cover}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              )}
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
