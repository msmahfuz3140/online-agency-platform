import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "https://nxoraagency.com"
  ).replace(/\/+$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
