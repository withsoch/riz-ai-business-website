import fs from "fs";
import path from "path";

export type GuideMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tool: string;
  readingTime: number;
};

const GUIDES_DIR = path.join(process.cwd(), "public", "guides");
const SLUG_PATTERN = /^[a-z0-9-]+$/;
const WORDS_PER_MINUTE = 200;

function extractTag(html: string, pattern: RegExp): string {
  return html.match(pattern)?.[1]?.trim() ?? "";
}

function estimateReadingTime(html: string): number {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  const text = body
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function parseGuide(slug: string, html: string): GuideMeta {
  const title = extractTag(html, /<title>([^<]*)<\/title>/i) || slug;
  const excerpt = extractTag(html, /<meta\s+name=["']guide-excerpt["']\s+content=["']([^"']*)["']/i);
  const date = extractTag(html, /<meta\s+name=["']guide-date["']\s+content=["']([^"']*)["']/i);
  const category = extractTag(html, /<meta\s+name=["']guide-category["']\s+content=["']([^"']*)["']/i) || "Guide";
  const tool = extractTag(html, /<meta\s+name=["']guide-tool["']\s+content=["']([^"']*)["']/i) || "General";
  const readingTime = estimateReadingTime(html);

  return { slug, title, excerpt, date, category, tool, readingTime };
}

export function getAllGuides(): GuideMeta[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];

  return fs
    .readdirSync(GUIDES_DIR)
    .filter((file) => file.endsWith(".html") && SLUG_PATTERN.test(file.replace(/\.html$/, "")))
    .map((file) => {
      const slug = file.replace(/\.html$/, "");
      const html = fs.readFileSync(path.join(GUIDES_DIR, file), "utf-8");
      return parseGuide(slug, html);
    });
}

export function getGuide(slug: string): GuideMeta | null {
  if (!SLUG_PATTERN.test(slug)) return null;

  const filePath = path.join(GUIDES_DIR, `${slug}.html`);
  if (!fs.existsSync(filePath)) return null;

  const html = fs.readFileSync(filePath, "utf-8");
  return parseGuide(slug, html);
}

export function getRelatedGuides(slug: string, category: string, limit = 3): GuideMeta[] {
  return getAllGuides()
    .filter((g) => g.slug !== slug && g.category === category)
    .slice(0, limit);
}
