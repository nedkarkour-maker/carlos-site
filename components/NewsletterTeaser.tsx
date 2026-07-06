import Link from "next/link";
import { newsletter } from "@/config/content";
import { getAllPosts } from "@/lib/newsletter";
import Reveal from "./Reveal";

export default function NewsletterTeaser() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section id="news" className="scroll-mt-20 bg-sail-2 py-[90px]">
      <Reveal className="wrap">
        <p className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-red-dark">
          {newsletter.eyebrow}
        </p>
        <h2 className="font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          {newsletter.title}
        </h2>
        <p className="mb-1.5 mt-3.5 max-w-[640px] text-base text-ink-soft">
          {newsletter.intro}
        </p>

        <div className="mt-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/newsletter/${post.slug}`}
              className="block border-t border-line-dark py-[22px] transition-[padding-left] duration-200 hover:pl-2"
            >
              <p className="font-mono text-xs tracking-[.05em] text-red-dark">
                {post.displayDate}
              </p>
              <h3 className="my-1.5 font-display text-[21px] font-bold">
                {post.title}
              </h3>
              <p className="max-w-[680px] text-[14.5px] text-ink-soft">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <Link
          href="/newsletter"
          className="mt-6 inline-block font-mono text-[13px] font-medium text-red-dark transition-colors hover:text-red"
        >
          {newsletter.allPostsLabel}
        </Link>
      </Reveal>
    </section>
  );
}
