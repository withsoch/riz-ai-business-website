import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, getRelatedGuides } from "@/lib/guides";
import GuideCard from "../GuideCard";
import { ArrowIcon } from "../icons";
import ShareBar from "./ShareBar";
import GuideFrame from "./GuideFrame";

function formatDate(raw: string): string {
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return {
    title: `${guide.title} · Rizwan Mahmood`,
    description: guide.excerpt || undefined,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = getRelatedGuides(guide.slug, guide.category);

  return (
    <section className="gd-detail">
      <style>{`
        .gd-detail {
          padding: 112px 0 112px;
          background: #F5EFE0;
        }
        .gd-detail-wrap {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .gd-breadcrumb {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 0.875rem;
          letter-spacing: 0.04em;
          color: var(--muted);
          margin-bottom: 1.25rem;
        }
        .gd-breadcrumb a {
          color: var(--coral);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .gd-breadcrumb a:hover {
          color: var(--coral-d, var(--coral));
        }
        .gd-detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 1rem;
        }
        .gd-detail-title {
          font-family: var(--font-fraunces), serif;
          font-weight: 600;
          font-size: clamp(28px, 4vw, 40px);
          letter-spacing: -0.5px;
          line-height: 1.15;
          color: var(--ink);
          margin: 0 0 1.25rem;
        }
        .gd-detail-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 1.5rem;
        }
        .gd-detail-meta-left {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          color: var(--muted);
        }
        .gd-detail-dot { opacity: 0.5; }
        .gd-share {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .gd-share-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid var(--line-2);
          background: #fff;
          color: var(--muted);
          cursor: pointer;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .gd-share-btn:hover {
          color: var(--coral);
          border-color: var(--coral);
        }
        .gd-divider {
          height: 1px;
          background: var(--line);
          margin-bottom: 2rem;
        }
        .gd-iframe-wrap {
          background: #F5EFE0;
        }
        .gd-iframe-wrap iframe {
          width: 100%;
          border: none;
          display: block;
        }
        .gd-related {
          margin-top: 3rem;
        }
        .gd-related-heading {
          font-family: var(--font-fraunces), serif;
          font-weight: 600;
          font-size: 1.5rem;
          color: var(--ink);
          margin: 0 0 1.5rem;
        }
        .gd-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 28px;
        }
        .gd-detail-cta {
          text-align: center;
          margin-top: 3rem;
        }
        .gd-detail-cta .btn-coral {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 1rem 2rem;
        }

        @media (max-width: 640px) {
          .gd-detail { padding: 64px 0; }
          .gd-detail-wrap { padding: 0 24px; }
          .gd-detail-meta { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="gd-detail-wrap">
        <div className="gd-detail-tags">
          <span className="gd-pill gd-pill-topic">{guide.category}</span>
          <span className="gd-pill gd-pill-tool">{guide.tool}</span>
        </div>

        <h1 className="gd-detail-title">{guide.title}</h1>

        <div className="gd-detail-meta">
          <div className="gd-detail-meta-left">
            <span>{formatDate(guide.date)}</span>
            <span className="gd-detail-dot">·</span>
            <span>{guide.readingTime} min read</span>
          </div>
          <ShareBar title={guide.title} />
        </div>

        <div className="gd-divider" />

        <div className="gd-iframe-wrap">
          <GuideFrame src={`/guides/${guide.slug}.html`} title={guide.title} />
        </div>

        {related.length > 0 && (
          <div className="gd-related">
            <h2 className="gd-related-heading">Explore related guides</h2>
            <div className="gd-related-grid">
              {related.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          </div>
        )}

        <div className="gd-detail-cta">
          <Link href="/guides" className="btn-coral">
            View all guides <ArrowIcon size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
