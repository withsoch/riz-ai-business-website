import { XMLParser } from "fast-xml-parser";

export type SubstackPost = {
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
  categories: string[];
  image: string | null;
  isPaid: boolean;
};

const FEED_URL = "https://conversationswithriz.substack.com/feed";

// Real posts fetched from the feed above, kept as a static fallback so the
// site never renders a dead "Read" link if the live fetch fails.
export const FALLBACK_POSTS: SubstackPost[] = [
  {
    title: "Bolt called it a Performance Review. It was a Firing. I fought back. I Won.",
    link: "https://conversationswithriz.substack.com/p/bolt-called-it-a-performance-review",
    pubDate: "Tue, 02 Jun 2026 07:10:51 GMT",
    excerpt: "On wrongful termination, the Labour Dispute Committee, and what happens when you refuse to accept the lie.",
    categories: [],
    image: "https://substackcdn.com/image/fetch/$s_!jZ-5!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0a80a80f-019f-46b5-8fb0-e3b6bf411588_1613x687.jpeg",
    isPaid: false,
  },
  {
    title: "When Work Goes Wrong in Estonia: A Complete A-to-Z Guide to the Labour Dispute Committee (Töövaidluskomisjon)",
    link: "https://conversationswithriz.substack.com/p/when-work-goes-wrong-in-estonia-a",
    pubDate: "Mon, 22 Jun 2026 23:14:35 GMT",
    excerpt: "If you're reading this, something has probably happened. A termination letter. Unpaid wages. A boss mistreating you making your life miserable.",
    categories: [],
    image: "https://substackcdn.com/image/fetch/$s_!i3bL!,w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F977b0984-7b9d-42e6-9517-f900165a746f_864x864.png",
    isPaid: false,
  },
];

const PAYWALL_MARKERS = [
  "this post is for paid subscribers",
  "this post is for subscribers",
  "keep reading with a free trial",
  "keep reading with a 7-day free trial",
  "subscribe to keep reading",
  "class=\"paywall",
];

function isPaywalled(contentHtml: string): boolean {
  const lower = contentHtml.toLowerCase();
  return PAYWALL_MARKERS.some((marker) => lower.includes(marker));
}

function firstImageSrc(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^"]+)"/i);
  return match ? match[1] : null;
}

function cdataOrString(field: unknown): string {
  if (typeof field === "object" && field !== null) {
    return String((field as Record<string, unknown>).__cdata ?? "");
  }
  return String(field ?? "");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 1800 } });
    if (!res.ok) {
      return FALLBACK_POSTS;
    }

    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      cdataPropName: "__cdata",
      allowBooleanAttributes: true,
    });
    const parsed = parser.parse(xml);
    const raw = parsed?.rss?.channel?.item;
    const items: unknown[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
    if (items.length === 0) {
      return FALLBACK_POSTS;
    }

    const posts: SubstackPost[] = items.map((item) => {
      const i = item as Record<string, unknown>;
      const contentHtml = cdataOrString(i["content:encoded"]);
      const excerpt = stripHtml(cdataOrString(i.description)).slice(0, 200);

      const rawCategories = i.category;
      const categories = Array.isArray(rawCategories)
        ? rawCategories.map((c) => cdataOrString(c)).filter(Boolean)
        : rawCategories
          ? [cdataOrString(rawCategories)].filter(Boolean)
          : [];

      const enclosure = Array.isArray(i.enclosure) ? i.enclosure[0] : i.enclosure;
      const enclosureUrl =
        enclosure && typeof enclosure === "object"
          ? String((enclosure as Record<string, unknown>)["@_url"] ?? "")
          : "";
      const image = enclosureUrl || firstImageSrc(contentHtml) || null;

      return {
        title: cdataOrString(i.title),
        link: String(i.link ?? ""),
        pubDate: String(i.pubDate ?? ""),
        excerpt,
        categories,
        image,
        isPaid: isPaywalled(contentHtml),
      };
    });

    const valid = posts.filter((p) => p.title && p.link);
    if (valid.length === 0) {
      return FALLBACK_POSTS;
    }

    return valid.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  } catch {
    return FALLBACK_POSTS;
  }
}
