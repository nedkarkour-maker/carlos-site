import type { MetadataRoute } from "next";
import { site } from "@/config/content";
import { getAllPosts } from "@/lib/newsletter";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...getAllPosts()
      .filter((post) => !post.draft)
      .map(
        (post): MetadataRoute.Sitemap[number] => ({
          url: `${site.url}/newsletter/${post.slug}`,
          lastModified: new Date(`${post.date}T00:00:00`),
          changeFrequency: "yearly",
          priority: 0.6,
        }),
      ),
  ];
}
