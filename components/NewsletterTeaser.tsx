import Image from "next/image";
import Link from "next/link";
import { newsletter } from "@/config/content";
import { getAllPosts } from "@/lib/newsletter";
import Reveal from "./Reveal";

/**
 * "Follow along" — the homepage preview of the newsletter: the latest few
 * published posts as compact cards. Reads the same MDX files as the
 * /newsletter archive, so there is nothing extra to update — publish a post
 * (set `draft: false` in its frontmatter) and it appears here by itself.
 * While every post is still a draft, the section renders nothing at all.
 */
export default function NewsletterTeaser() {
  const posts = getAllPosts()
    .filter((post) => !post.draft)
    .slice(0, 3);
  if (posts.length === 0) return null;

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
