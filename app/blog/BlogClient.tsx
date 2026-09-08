"use client";
import { useState, useEffect, useRef } from "react";
import AnimateIn from "@/components/AnimateIn";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { useParallax, useScrollFadeOut } from "@/hooks/useParallax";
import type { SubstackPost } from "@/lib/substack";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function SquiggleUnderline() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.getBoundingClientRect();
    const timer = setTimeout(() => {
      path.style.transition = "stroke-dashoffset 0.8s ease-out";
      path.style.strokeDashoffset = "0";
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" className="writing-squiggle" aria-hidden="true">
      <path
        ref={pathRef}
        d="M2 10 Q 26 2, 50 9 T 100 8 T 150 10 T 198 6"
        fill="none"
        stroke="var(--coral)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatDate(pubDate: string): string {
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return `${parsed.getFullYear()} · ${String(parsed.getMonth() + 1).padStart(2, "0")}`;
}

export default function BlogClient({ posts }: { posts: SubstackPost[] }) {
  const [search, setSearch] = useState("");
  const [kbdLabel, setKbdLabel] = useState("Ctrl K");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const quoteRef = useParallax<HTMLSpanElement>(0.15);
  const dotsRef = useParallax<HTMLDivElement>(0.1);
  const heroFadeRef = useScrollFadeOut<HTMLDivElement>(380);

  useEffect(() => {
    if (typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform)) {
      setKbdLabel("⌘K");
    }
  }, []);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  const latest = posts[0];

  return (
    <>
      <style>{`
        .writing-hero {
          padding-top: 112px;
          padding-bottom: 64px;
          background: var(--cream-2);
          overflow: hidden;
        }
        .writing-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 64px;
          align-items: center;
        }
        .writing-hero-title {
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: clamp(3.5rem, 7vw, 6rem);
          line-height: 1.02;
          font-weight: 900;
          color: var(--ink);
          margin: 0 0 1.1rem;
        }
        .writing-hero-accent {
          position: relative;
          display: inline-block;
          font-family: var(--font-fraunces), serif;
          font-style: italic;
          color: var(--coral);
        }
        .writing-squiggle {
          position: absolute;
          left: -2px;
          right: -2px;
          bottom: -0.16em;
          width: calc(100% + 4px);
          height: 0.2em;
          pointer-events: none;
        }
        .writing-hero-sub {
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: 1.25rem;
          color: var(--body);
          line-height: 1.7;
          max-width: 48ch;
          margin: 0 0 2.25rem;
        }
        .writing-search-wrap {
          position: relative;
          width: 100%;
          max-width: 480px;
          margin-bottom: 1.5rem;
        }
        .writing-search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          display: flex;
          pointer-events: none;
        }
        .writing-search-input {
          width: 100%;
          height: 56px;
          padding: 0 84px 0 48px;
          border: 1px solid var(--line-2);
          border-radius: 12px;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: 1rem;
          color: var(--ink);
          background: #fff;
          outline: none;
          box-shadow: var(--shadow);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .writing-search-input::placeholder { color: var(--muted); }
        .writing-search-input:focus {
          border-color: var(--coral);
          box-shadow: 0 0 0 4px rgba(234,106,71,0.12);
        }
        .writing-kbd {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 0.875rem;
          color: var(--muted);
          border: 1px solid var(--line-2);
          border-radius: 6px;
          padding: 4px 8px;
          pointer-events: none;
          background: var(--cream-2);
        }

        .writing-hero-right {
          position: relative;
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .writing-hero-decor {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .writing-hero-quote {
          position: absolute;
          top: -40px;
          right: 10%;
          font-family: var(--font-fraunces), serif;
          font-size: 220px;
          line-height: 1;
          color: var(--coral);
          opacity: 0.07;
          user-select: none;
        }
        .writing-hero-dots {
          position: absolute;
          bottom: -20px;
          left: -10px;
          width: 140px;
          height: 140px;
          background-image: radial-gradient(var(--line-2) 1.5px, transparent 1.5px);
          background-size: 16px 16px;
          opacity: 0.8;
        }
        .writing-featured-card {
          position: relative;
          z-index: 1;
          display: block;
          width: 100%;
          max-width: 320px;
          background: #fff;
          border: 1px solid var(--line-2);
          border-radius: 18px;
          padding: 1.75rem;
          box-shadow: var(--shadow-lg);
          text-decoration: none;
          transform: rotate(-1deg);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .writing-featured-card:hover {
          transform: rotate(0deg) translateY(-4px);
          box-shadow: 0 24px 56px rgba(34,51,44,0.16);
        }
        .writing-featured-tag {
          display: inline-block;
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #E8603C;
          margin-bottom: 0.75rem;
        }
        .writing-featured-title {
          font-family: var(--font-fraunces), serif;
          font-size: 1.375rem;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.35;
          margin: 0 0 1rem;
        }
        .writing-featured-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: 1rem;
          color: var(--muted);
          margin-bottom: 0.5rem;
        }
        .writing-featured-dot { opacity: 0.5; }
        .writing-featured-arrow {
          display: inline-flex;
          color: var(--coral);
          margin-top: 0.25rem;
        }

        .writing-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 2.5rem;
        }
        .writing-divider-label {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #E8603C;
          white-space: nowrap;
        }
        .writing-divider-rule {
          flex: 1;
          height: 1px;
          background: var(--line);
          position: relative;
        }
        .writing-divider-rule::before {
          content: "";
          position: absolute;
          left: 0;
          top: -1px;
          width: 48px;
          height: 3px;
          background: var(--coral);
        }

        .blog-post-card {
          border: 1px solid var(--line);
          border-radius: 18px;
          background: #fff;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .blog-post-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-5px);
        }
        .blog-post-thumb {
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--cream-2);
          flex-shrink: 0;
        }
        .blog-post-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .blog-post-body {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }
        .blog-post-paid-pill {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--coral);
          border: 1px solid var(--coral);
          border-radius: 999px;
          padding: 2px 9px;
        }

        @media (max-width: 1024px) {
          .writing-hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .writing-hero-right {
            min-height: 0;
            justify-content: flex-start;
          }
          .writing-featured-card {
            max-width: 100%;
            transform: none;
          }
          .writing-featured-card:hover {
            transform: translateY(-4px);
          }
          .writing-hero-quote { display: none; }
        }
        @media (max-width: 640px) {
          .writing-kbd { display: none; }
          .writing-search-input { padding-right: 16px; }
        }
      `}</style>

      <ScrollProgressBar />

      {/* HERO */}
      <section className="writing-hero">
        <div className="max-w-site">
          <div className="writing-hero-grid" ref={heroFadeRef}>
            <div className="writing-hero-left">
              <AnimateIn delay={90}>
                <h1 className="writing-hero-title">
                  I think{" "}
                  <span className="writing-hero-accent">
                    out loud
                    <SquiggleUnderline />
                  </span>
                  .
                </h1>
              </AnimateIn>
              <AnimateIn delay={180}>
                <p className="writing-hero-sub">
                  Notes on automation, operations, and using AI without losing the plot.
                </p>
              </AnimateIn>

              <AnimateIn delay={270}>
                <div className="writing-search-wrap">
                  <span className="writing-search-icon">
                    <SearchIcon />
                  </span>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search posts…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="writing-search-input"
                  />
                  <span className="writing-kbd">{kbdLabel}</span>
                </div>
              </AnimateIn>
            </div>

            <div className="writing-hero-right">
              <div className="writing-hero-decor" aria-hidden="true">
                <span className="writing-hero-quote" ref={quoteRef} data-parallax>&ldquo;</span>
                <div className="writing-hero-dots" ref={dotsRef} data-parallax />
              </div>
              {latest && (
                <AnimateIn delay={220}>
                  <a
                    href={latest.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="writing-featured-card"
                  >
                    <span className="writing-featured-tag">LATEST</span>
                    <h2 className="writing-featured-title">{latest.title}</h2>
                    <div className="writing-featured-meta">
                      <span>{formatDate(latest.pubDate)}</span>
                      {latest.categories[0] && (
                        <>
                          <span className="writing-featured-dot">•</span>
                          <span>{latest.categories[0]}</span>
                        </>
                      )}
                    </div>
                    <span className="writing-featured-arrow">
                      <ArrowIcon />
                    </span>
                  </a>
                </AnimateIn>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-site">
        <div className="writing-divider">
          <span className="writing-divider-label">Latest posts</span>
          <span className="writing-divider-rule" />
        </div>
      </div>

      {/* POSTS */}
      <section style={{ padding: "3rem 0 5rem" }}>
        <div className="max-w-site">
          {filtered.length === 0 ? (
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "var(--muted)", fontSize: "1rem" }}>
              No posts found.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map((p, i) => (
                <AnimateIn key={p.link} delay={i * 80}>
                <div className="blog-post-card">
                  {p.image && (
                    <div className="blog-post-thumb">
                      <img src={p.image} alt="" loading="lazy" />
                    </div>
                  )}
                  <div className="blog-post-body">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-mono), monospace",
                        fontSize: "1rem",
                        color: "var(--faint)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {formatDate(p.pubDate)}
                    </span>
                    {p.categories[0] && <span className="tag-pill">{p.categories[0]}</span>}
                    {p.isPaid && <span className="blog-post-paid-pill">Paid post</span>}
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      color: "var(--ink)",
                      lineHeight: 1.4,
                      flex: 1,
                    }}
                  >
                    {p.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: "0.875rem",
                      color: "var(--body)",
                      lineHeight: 1.65,
                    }}
                  >
                    {p.excerpt}
                  </p>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--coral)",
                      textDecoration: "none",
                    }}
                  >
                    Read →
                  </a>
                  </div>
                </div>
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
