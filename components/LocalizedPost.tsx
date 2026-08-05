"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/lib/locale";

/**
 * Shows a newsletter post in the visitor's chosen language.
 *
 * The locale toggle is client-side (localStorage) but MDX is compiled on
 * the server at build time, so both language bodies are rendered upstream
 * and passed in as slots — this component only picks which one to show.
 * That costs a little page weight on translated posts and keeps the site
 * fully static, which is the trade the rest of the site already makes.
 *
 * `fr` is null for posts that haven't been translated; those render in
 * English in both languages, unchanged from before.
 */
export default function LocalizedPost({
  en,
  fr,
  cover,
}: {
  en: { title: string; displayDate: string; body: ReactNode };
  fr: { title: string; displayDate: string; body: ReactNode } | null;
  /** Same hero image in both languages, rendered between title and body. */
  cover?: ReactNode;
}) {
  const { locale } = useLocale();
  const post = locale === "fr" && fr ? fr : en;

  return (
    <>
      <p className="mt-8 font-mono text-xs tracking-[.05em] text-red-dark">
        {post.displayDate}
      </p>
      <h1 className="mt-2 font-display text-[clamp(30px,5vw,48px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        {post.title}
      </h1>
      {cover}
      {post.body}
    </>
  );
}

/** The date/title/excerpt block of a card in the newsletter index. */
export function LocalizedPostMeta({
  en,
  fr,
}: {
  en: { title: string; displayDate: string; excerpt: string };
  fr: { title: string; displayDate: string; excerpt: string } | null;
}) {
  const { locale } = useLocale();
  const post = locale === "fr" && fr ? fr : en;

  return (
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
  );
}
