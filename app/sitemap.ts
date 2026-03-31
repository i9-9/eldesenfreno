import type { MetadataRoute } from "next";
import editions from "./editions";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eldesenfreno.com";

const staticRoutes = [
  "",
  "/shop",
  "/blog",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = editions.map((edition) => ({
    url: `${siteUrl}/product/${edition.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries];
}
