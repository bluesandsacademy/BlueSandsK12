import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "[supabase-admin] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. " +
    "Admin operations will fail until these are set in .env.local."
  );
}

// Admin client — uses the service role key.
// BYPASSES all RLS policies. Use ONLY in API routes (server-side), never in client components.
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  serviceRoleKey || "placeholder-service-role-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ---------------------------------------------------------------------------
// Shared helper: transform a raw Supabase post row into the shape the
// UI components expect (backward-compatible with the JSON-file schema).
// ---------------------------------------------------------------------------
export function normalisePost(row) {
  if (!row) return null;

  // Build a flat author string for legacy components (takes first author)
  const firstAuthor = row.post_authors?.[0]?.authors;
  const authorName = firstAuthor?.name || row._author_name || "Blue Sands Academy";

  // Normalise tags to { label, color } array
  const tags = (row.post_tags || []).map((pt) => ({
    label: pt.tags?.name || pt.name || pt.label || "",
    color: pt.tags?.color || pt.color || "primary",
  }));

  // Normalise media array
  const media = row.post_media || [];
  const coverImage = row.cover_image || media.find((m) => m.role === "cover")?.url || "";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    description: row.excerpt || "",   // legacy alias
    content: row.content || { blocks: [] },
    content_html: row.content_html || "",
    image: coverImage,                // legacy alias
    cover_image: coverImage,
    cover_image_public_id: row.cover_image_public_id || "",
    author: authorName,              // legacy flat string
    authors: (row.post_authors || []).map((pa) => pa.authors),
    date: formatPostDate(row.publish_date || row.created_at),
    publishDate: row.publish_date ? row.publish_date.split("T")[0] : "",
    publish_date: row.publish_date,
    status: row.status,
    visibility: row.visibility || "public",
    featured: row.featured || false,
    allow_comments: row.allow_comments !== false,
    tags,
    categories: (row.post_categories || []).map((pc) => pc.categories),
    media,
    series: row.series_posts?.[0] || null,
    seo_title: row.seo_title || "",
    seo_description: row.seo_description || "",
    og_image: row.og_image || "",
    canonical_url: row.canonical_url || "",
    views_count: row.views_count || 0,
    likes_count: row.likes_count || 0,
    comments_count: row.comments_count || 0,
    reading_time: row.reading_time || 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function formatPostDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Shared Supabase query for fetching posts with all relations
// ---------------------------------------------------------------------------
export const POST_SELECT = `
  *,
  post_authors (
    role, display_order,
    authors ( id, name, slug, avatar_url, bio, twitter, linkedin )
  ),
  post_tags (
    tags ( id, name, slug, color )
  ),
  post_categories (
    categories ( id, name, slug, parent_id )
  ),
  post_media ( * ),
  series_posts (
    position,
    series ( id, title, slug )
  )
`;
