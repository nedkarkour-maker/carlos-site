import { getAllPosts } from "@/lib/newsletter";
import NewsletterTeaserView, { type TeaserPost } from "./NewsletterTeaserView";

/**
 * "Follow along" — the homepage preview of the newsletter: the latest few
 * published posts as compact cards. Reads the same MDX files as the
 * /newsletter archive, so there is nothing extra to update — publish a post
 * (set `draft: false` in its frontmatter) and it appears here by itself.
 * While every post is still a draft, the section renders nothing at all.
 *
 * This half runs on the server (it reads the post files from disk); the
 * cards themselves render in NewsletterTeaserView so the section copy can
 * follow the EN/FR toggle.
 */
export default function NewsletterTeaser() {
  const posts: TeaserPost[] = getAllPosts()
    .filter((post) => !post.draft)
    .slice(0, 3)
    .map(({ slug, title, displayDate, excerpt, cover }) => ({
      slug,
      title,
      displayDate,
      excerpt,
      cover,
    }));
  if (posts.length === 0) return null;

  return <NewsletterTeaserView posts={posts} />;
}
