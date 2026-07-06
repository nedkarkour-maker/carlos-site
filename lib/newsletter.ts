import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "newsletter");

export interface PostMeta {
  slug: string;
  title: string;
  /** ISO date from frontmatter, e.g. "2026-06-15". */
  date: string;
  /** Formatted for display, e.g. "JUN 2026" or "JUN 2026 · [DRAFT]". */
  displayDate: string;
  excerpt: string;
  /** Optional path into /public, e.g. "/images/IMG_5623.JPG". */
  cover?: string;
  draft: boolean;
}

export interface Post extends PostMeta {
  /** Raw MDX body (frontmatter stripped). */
  content: string;
}

function formatDisplayDate(date: string, draft: boolean): string {
  const label = new Date(`${date}T00:00:00`)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();
  return draft ? `${label} · [DRAFT]` : label;
}

function parsePost(filename: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const { title, date, excerpt, cover, draft } = data as Record<string, unknown>;

  if (typeof title !== "string" || title.length === 0) {
    throw new Error(`content/newsletter/${filename}: frontmatter needs a "title" string`);
  }
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`content/newsletter/${filename}: frontmatter needs a "date" in YYYY-MM-DD format`);
  }
  if (typeof excerpt !== "string" || excerpt.length === 0) {
    throw new Error(`content/newsletter/${filename}: frontmatter needs an "excerpt" string`);
  }
  if (cover !== undefined && typeof cover !== "string") {
    throw new Error(`content/newsletter/${filename}: "cover" must be a string path if present`);
  }

  const isDraft = draft === true;
  return {
    slug: filename.replace(/\.mdx$/, ""),
    title,
    date,
    displayDate: formatDisplayDate(date, isDraft),
    excerpt,
    cover,
    draft: isDraft,
    content,
  };
}

/** All posts, newest first. Returns [] if the content folder doesn't exist yet. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(parsePost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** A single post by slug, or null if it doesn't exist. */
export function getPost(slug: string): Post | null {
  // Slugs come from the URL — refuse anything that could escape the posts dir.
  if (!/^[\w-]+$/.test(slug)) return null;
  const file = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return parsePost(`${slug}.mdx`);
}
