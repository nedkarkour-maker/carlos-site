"use client";

import Image from "next/image";
import Link from "next/link";
import { useContent } from "@/lib/locale";
import Reveal from "./Reveal";

/** The post fields the teaser cards need (serialized from the server). */
export interface TeaserPost {
  slug: string;
  title: string;
  displayDate: string;
  excerpt: string;
  cover?: string;
}

/**
 * Client half of the "Follow along" section: renders the cards and the
 * section copy in the active language. The posts themselves are read from
 * disk by the server half (NewsletterTeaser.tsx) and passed down — post
 * content stays English-only for now.
 */
export default function NewsletterTeaserView({
  posts,
}: {
  posts: TeaserPost[];
}) {
  const { newsletter } = useContent();
  return (
    <section className="pb-[90px]">
      <Reveal className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-red-dark">
              {newsletter.eyebrow}
            </p>
            <h2 className="font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              {newsletter.title}
            </h2>
            <p className="mt-[14px] max-w-[560px] text-[15px] text-ink-soft">
              {newsletter.intro}
            </p>
          </div>
          <Link
            href="/newsletter"
            className="font-mono text-[13px] font-semibold text-red-dark transition-colors hover:text-red"
          >
            {newsletter.allPostsLabel}
          </Link>
        </div>

        <div className="mt-9 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/newsletter/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-[10px] border border-line-dark bg-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(21,32,31,0.08)]"
            >
              {post.cover && (
                <div className="relative aspect-[5/3] overflow-hidden">
                  <Image
                    src={post.cover}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col px-[22px] py-[20px]">
                <p className="font-mono text-xs tracking-[.05em] text-red-dark">
                  {post.displayDate}
                </p>
                <h3 className="my-1.5 font-display text-[19px] font-bold leading-snug">
                  {post.title}
                </h3>
                <p className="line-clamp-2 text-[14px] text-ink-soft">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
