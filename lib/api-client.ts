import { servicesData, ServiceItem } from "@/components/services/ServicesGridSection";
import { teamMembersData, TeamMemberDetails } from "./team-data";
import { blogPosts, BlogPost } from "./blog-data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch all services from MongoDB with resilient offline fallback
 */
export async function fetchServices(category?: string): Promise<ServiceItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/services`);
    if (category && category !== "All") {
      url.searchParams.set("category", category);
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch services: ${res.statusText}`);
    }

    const json = await res.json();
    if (json && json.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
  } catch (err) {
    console.warn("Using fallback local services data:", err);
  }

  // Resilient fallback
  if (category && category !== "All") {
    return servicesData.filter((s) => s.category === category);
  }
  return servicesData;
}

/**
 * Fetch a single service by ID
 */
export async function fetchServiceById(id: string): Promise<ServiceItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) return json.data;
    }
  } catch (err) {
    console.warn("Using fallback service by id:", err);
  }

  return servicesData.find((s) => s.id === id) || null;
}

/**
 * Fetch portfolio projects from MongoDB
 */
export async function fetchPortfolio(category?: string): Promise<any[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/portfolio`);
    if (category && category !== "All") {
      url.searchParams.set("category", category);
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Using fallback portfolio data:", err);
  }

  return [];
}

/**
 * Fetch all team members from MongoDB
 */
export async function fetchTeamMembers(): Promise<TeamMemberDetails[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/team`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Using fallback team data:", err);
  }

  return teamMembersData;
}

/**
 * Fetch individual team member by slug
 */
export async function fetchTeamMemberBySlug(
  slug: string
): Promise<TeamMemberDetails | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/team/${slug}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.data) return json.data;
    }
  } catch (err) {
    console.warn("Using fallback team member by slug:", err);
  }

  return teamMembersData.find((m) => m.slug === slug) || null;
}

/**
 * Fetch all blog posts from MongoDB
 */
export async function fetchBlogPosts(
  category?: string,
  tag?: string
): Promise<BlogPost[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/blog`);
    if (category && category !== "All") {
      url.searchParams.set("category", category);
    }
    if (tag) {
      url.searchParams.set("tag", tag);
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Using fallback blog data:", err);
  }

  let filtered = blogPosts;
  if (category && category !== "All") {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (tag) {
    filtered = filtered.filter((p) => p.tags.includes(tag));
  }
  return filtered;
}

/**
 * Fetch a single blog post by slug
 */
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/${slug}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.data) return json.data;
    }
  } catch (err) {
    console.warn("Using fallback blog post by slug:", err);
  }

  return blogPosts.find((p) => p.slug === slug) || null;
}
