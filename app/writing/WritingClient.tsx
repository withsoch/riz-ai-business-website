"use client";
import { useState } from "react";

export type Post = {
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
  thumbnail?: string;
};

function formatDate(raw: string): string {
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

export default function WritingClient({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState("");

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section style={{ padding: "4rem 0 5rem" }}>
      <div className="max-w-site">
        <input
          type="text"
          placeholder="Search posts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 480,
            padding: "0.75rem 1rem",
            border: "1px solid var(--line-2)",
            borderRadius: 8,
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "1rem",
            color: "var(--ink)",
            background: "#fff",
            outline: "none",
            marginBottom: "2.5rem",
            display: "block",
            boxShadow: "var(--shadow)",
          }}
        />

        {filtered.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "var(--muted)",
              fontSize: "1rem",
            }}
          >
            No posts found.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {filtered.map((post) => (
              <a
                key={post.link}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", display: "block", height: "100%" }}
              >
                <article
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: 18,
                    background: "#fff",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "var(--shadow)",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "var(--shadow-lg)";
                    el.style.transform = "translateY(-3px)";
                    el.style.borderColor = "var(--coral)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "var(--shadow)";
                    el.style.transform = "none";
                    el.style.borderColor = "var(--line)";
                  }}
                >
                  {post.thumbnail && (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        overflow: "hidden",
                        background: "var(--cream)",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={post.thumbnail}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  )}

                  <div
                    style={{
                      padding: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem",
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-dm-mono), monospace",
                        fontSize: "1rem",
                        color: "var(--faint)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {formatDate(post.pubDate)}
                    </span>

                    <h2
                      style={{
                        fontFamily: "var(--font-playfair), serif",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "var(--ink)",
                        lineHeight: 1.4,
                        flex: 1,
                        margin: 0,
                      }}
                    >
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p
                        style={{
                          fontFamily: "var(--font-dm-sans), sans-serif",
                          fontSize: "0.875rem",
                          color: "var(--body)",
                          lineHeight: 1.65,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {post.excerpt}
                      </p>
                    )}

                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        fontSize: "1rem",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        color: "var(--coral)",
                        marginTop: "0.25rem",
                      }}
                    >
                      Read on Substack →
                    </span>
                  </div>
                </article>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
