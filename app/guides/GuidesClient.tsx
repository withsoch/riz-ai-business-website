"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { ArrowIcon, SearchIcon } from "./icons";
import type { GuideMeta } from "@/lib/guides";

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
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" className="gd-squiggle" aria-hidden="true">
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

function GridCard({ guide }: { guide: GuideMeta }) {
  return (
    <Link href={`/guides/${guide.slug}`} className="gd-gcard-link">
      <article className="gd-gcard">
        <div className="gd-gcard-tags">
          <span className="gd-pill gd-pill-topic">{guide.category}</span>
          <span className="gd-pill gd-pill-tool">{guide.tool}</span>
        </div>
        <h3 className="gd-gcard-title">{guide.title}</h3>
        <span className="gd-gcard-read">
          Read guide <ArrowIcon size={12} />
        </span>
      </article>
    </Link>
  );
}

export default function GuidesClient({ guides }: { guides: GuideMeta[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [tool, setTool] = useState("All tools");
  const [year, setYear] = useState("All years");
  const [sort, setSort] = useState<"recent" | "oldest" | "az" | "za">("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [kbdLabel, setKbdLabel] = useState("Ctrl K");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sortWrapRef = useRef<HTMLDivElement>(null);
  const yearWrapRef = useRef<HTMLDivElement>(null);

  const SORT_OPTIONS: { value: "recent" | "oldest" | "az" | "za"; label: string }[] = [
    { value: "recent", label: "Most recent" },
    { value: "oldest", label: "Oldest first" },
    { value: "az", label: "A-Z" },
    { value: "za", label: "Z-A" },
  ];
  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Most recent";

  useEffect(() => {
    if (!sortOpen && !yearOpen) return;
    function handleClick(e: MouseEvent) {
      if (sortOpen && sortWrapRef.current && !sortWrapRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
      if (yearOpen && yearWrapRef.current && !yearWrapRef.current.contains(e.target as Node)) {
        setYearOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSortOpen(false);
        setYearOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [sortOpen, yearOpen]);

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

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(guides.map((g) => g.category))).sort()],
    [guides]
  );

  const tools = useMemo(
    () => ["All tools", ...Array.from(new Set(guides.map((g) => g.tool))).sort()],
    [guides]
  );

  const years = useMemo(
    () =>
      Array.from(new Set(guides.map((g) => (g.date || "").slice(0, 4)).filter(Boolean))).sort(
        (a, b) => b.localeCompare(a)
      ),
    [guides]
  );
  const showYearFilter = years.length > 1;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guides
      .filter((g) => {
        const matchesQuery =
          !q || g.title.toLowerCase().includes(q) || g.excerpt.toLowerCase().includes(q);
        const matchesCategory = category === "All" || g.category === category;
        const matchesTool = tool === "All tools" || g.tool === tool;
        const matchesYear = year === "All years" || (g.date || "").slice(0, 4) === year;
        return matchesQuery && matchesCategory && matchesTool && matchesYear;
      })
      .sort((a, b) => {
        if (sort === "az") return a.title.localeCompare(b.title);
        if (sort === "za") return b.title.localeCompare(a.title);
        return sort === "oldest"
          ? (a.date || "").localeCompare(b.date || "")
          : (b.date || "").localeCompare(a.date || "");
      });
  }, [guides, search, category, tool, year, sort]);

  const filtersActive =
    search.trim() !== "" || category !== "All" || tool !== "All tools" || year !== "All years";

  const latest = useMemo(
    () =>
      guides.length
        ? [...guides].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0]
        : null,
    [guides]
  );

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setTool("All tools");
    setYear("All years");
  }

  return (
    <>
      <style>{`
        main.flex-1 {
          flex: 0 1 auto;
        }
        .gd-hero {
          padding-top: 112px;
          padding-bottom: 64px;
          background: var(--cream);
          position: relative;
          overflow: hidden;
        }
        .gd-hero .max-w-site {
          position: relative;
          z-index: 1;
        }
        .gd-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 64px;
          align-items: center;
        }
        .gd-hero-right {
          position: relative;
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gd-hero-title {
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: clamp(3.5rem, 7vw, 6rem);
          line-height: 1.02;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: var(--ink);
          margin: 0 0 4rem;
        }
        .gd-hero-em {
          position: relative;
          display: inline-block;
          font-family: var(--font-fraunces), serif;
          font-style: italic;
          color: var(--coral);
          white-space: nowrap;
        }
        .gd-squiggle {
          position: absolute;
          left: -2px;
          right: -2px;
          bottom: -0.4em;
          width: calc(100% + 4px);
          height: 0.2em;
          pointer-events: none;
        }
        .gd-hero-sub {
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1.125rem;
          color: var(--body);
          line-height: 1.7;
          max-width: 48ch;
          margin: 0 0 1.75rem;
        }
        .gd-search-wrap {
          position: relative;
          width: 100%;
          max-width: 440px;
        }
        .gd-search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          display: flex;
          pointer-events: none;
        }
        .gd-search-input {
          width: 100%;
          height: 48px;
          padding: 0 84px 0 48px;
          border: 1px solid var(--line-2);
          border-radius: 12px;
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1rem;
          color: var(--ink);
          background: #fff;
          outline: none;
          box-shadow: var(--shadow);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .gd-search-input::placeholder { color: var(--muted); }
        .gd-search-input:focus {
          border-color: var(--coral);
          box-shadow: 0 0 0 4px rgba(234,106,71,0.12);
        }
        .gd-kbd {
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

        .gd-filters {
          background: var(--cream);
          padding: 44px 0 36px;
          text-align: left;
        }
        .gd-filter-row {
          margin-top: 32px;
        }
        .gd-filter-row:first-child {
          margin-top: 0;
        }
        .gd-filter-script {
          font-family: var(--font-caveat), 'Caveat', cursive;
          font-size: 1.375rem;
          color: var(--coral);
          display: block;
          margin-bottom: 10px;
          transform: rotate(-1.5deg);
        }
        .gd-filter-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 10px;
        }
        .gd-filter-pill {
          font-family: var(--font-montserrat), sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--ink);
          background: #fff;
          border: 1px solid var(--line-2);
          border-radius: 999px;
          padding: 9px 20px;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .gd-filter-pill:hover {
          border-color: var(--coral);
          color: var(--coral);
          transform: translateY(-1px);
        }
        .gd-filter-pill.is-active {
          background: var(--coral);
          border-color: var(--coral);
          color: #fff;
        }
        .gd-filter-pill.is-active:hover {
          color: #fff;
          background: var(--coral-d);
          border-color: var(--coral-d);
        }
        .gd-results-count {
          display: inline-block;
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 0.875rem;
          letter-spacing: 0.04em;
          color: var(--body);
        }
        .gd-grid-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        @media (max-width: 640px) {
          .gd-grid-toolbar {
            align-items: flex-start;
          }
        }
        .gd-clear-btn {
          margin-left: 12px;
          background: none;
          border: 1px solid var(--line-2);
          border-radius: 8px;
          padding: 5px 12px;
          font-family: var(--font-montserrat), sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--body);
          cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .gd-clear-btn:hover {
          border-color: var(--ink);
          color: var(--ink);
        }

        .gd-sort-wrap {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .gd-sort-label {
          font-size: 0.875rem;
        }
        .gd-sort-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 40px;
          padding: 0 14px;
          border: 1px solid var(--line-2);
          border-radius: 12px;
          font-family: var(--font-montserrat), sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--ink);
          background: #fff;
          box-shadow: var(--shadow);
          cursor: pointer;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .gd-sort-btn:hover {
          border-color: var(--coral);
        }
        .gd-sort-btn.is-open {
          border-color: var(--coral);
          box-shadow: 0 0 0 4px rgba(234,106,71,0.12);
        }
        .gd-sort-chevron {
          display: flex;
          color: var(--muted);
          transition: transform 0.2s ease;
        }
        .gd-sort-btn.is-open .gd-sort-chevron {
          transform: rotate(180deg);
          color: var(--coral);
        }
        .gd-sort-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 180px;
          background: var(--cream);
          border: 1px solid var(--line-2);
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
          padding: 6px;
          z-index: 10;
        }
        .gd-sort-option {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          border-radius: 8px;
          padding: 9px 12px;
          font-family: var(--font-montserrat), sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--ink);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .gd-sort-option:hover {
          background: rgba(234,106,71,0.1);
          color: var(--coral);
        }
        .gd-sort-option.is-selected {
          background: var(--coral);
          color: #fff;
        }

        .gd-grid-section {
          padding: 56px 0 96px;
          min-height: calc(100vh - 120px);
          box-sizing: border-box;
        }
        .gd-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .gd-gcard-link {
          display: block;
          height: 100%;
          text-decoration: none;
        }
        .gd-gcard {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--cream);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 1.75rem;
          transition: box-shadow 0.25s var(--ease), transform 0.25s var(--ease), border-color 0.25s var(--ease);
        }
        .gd-gcard:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-3px);
          border-color: var(--line-2);
        }
        .gd-gcard-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 1rem;
        }
        .gd-gcard-title {
          font-family: var(--font-fraunces), serif;
          font-weight: 700;
          font-size: 1.25rem;
          line-height: 1.35;
          color: var(--ink);
          margin: 0 0 1.5rem;
          flex: 1;
        }
        .gd-gcard-read {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-montserrat), sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: var(--coral);
          transition: color 0.2s ease, gap 0.2s ease;
        }
        .gd-gcard:hover .gd-gcard-read {
          color: var(--coral-d);
          gap: 9px;
        }

        .gd-float-wrap {
          position: relative;
          z-index: 1;
          display: block;
          width: 100%;
          max-width: 320px;
        }
        .gd-float-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
          text-align: left;
          text-decoration: none;
          width: 100%;
          background: #fff;
          border: 1px solid var(--line-2);
          border-radius: 18px;
          padding: 1.75rem;
          box-shadow: var(--shadow-lg);
          transform: rotate(-1deg);
          transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease);
        }
        .gd-float-card:hover {
          transform: rotate(0deg) translateY(-4px);
          box-shadow: 0 24px 56px rgba(34,51,44,0.16);
        }
        .gd-float-label {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
          background: var(--coral);
          border-radius: 999px;
          padding: 5px 12px;
        }
        .gd-float-title {
          font-family: var(--font-fraunces), serif;
          font-weight: 600;
          font-size: 1.375rem;
          line-height: 1.35;
          color: var(--ink);
          margin: 0 0 1rem;
        }
        .gd-float-date {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          color: var(--muted);
        }
        .gd-float-card .gd-gcard-read { font-size: 14px; }
        .gd-float-card:hover .gd-gcard-read {
          color: var(--coral-d);
          gap: 9px;
        }

        .gd-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.75rem;
          padding: 4rem 1rem;
          max-width: 440px;
          margin: 0 auto;
        }
        .gd-empty-icon { color: var(--coral); opacity: 0.45; }
        .gd-empty-title {
          font-family: var(--font-fraunces), serif;
          font-weight: 600;
          font-size: 1.5rem;
          color: var(--ink);
          margin: 0;
        }
        .gd-empty-body {
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1rem;
          color: var(--body);
          line-height: 1.6;
          margin: 0 0 0.5rem;
        }

        @media (max-width: 1024px) {
          .gd-grid { grid-template-columns: repeat(2, 1fr); }
          .gd-hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .gd-hero-right {
            min-height: 0;
            justify-content: flex-start;
          }
          .gd-float-wrap { max-width: 100%; }
          .gd-float-card {
            max-width: 100%;
            transform: none;
          }
          .gd-float-card:hover {
            transform: translateY(-4px);
          }
        }
        @media (max-width: 767px) {
          .gd-hero { padding-top: 104px; }
          .gd-filters { padding-top: 36px; }
          .gd-search-input { padding-right: 16px; }
          .gd-kbd { display: none; }
        }
        @media (max-width: 640px) {
          .gd-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <ScrollProgressBar />

      <section className="gd-hero">
        <div className="max-w-site">
          <div className="gd-hero-grid">
            <div className="gd-hero-left">
              <AnimateIn delay={80}>
                <h1 className="gd-hero-title">
                  All the{" "}
                  <span className="gd-hero-em">
                    guides
                    <SquiggleUnderline />
                  </span>
                  .
                </h1>
              </AnimateIn>
              <AnimateIn delay={150}>
                <p className="gd-hero-sub">
                  Practical automation guides for engineers and founders. Pick a topic, pick a tool,
                  and dig in.
                </p>
              </AnimateIn>
              <AnimateIn delay={220}>
                <div className="gd-search-wrap">
                  <span className="gd-search-icon">
                    <SearchIcon />
                  </span>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search guides…"
                    aria-label="Search guides"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="gd-search-input"
                  />
                  <span className="gd-kbd">{kbdLabel}</span>
                </div>
              </AnimateIn>
            </div>
            <div className="gd-hero-right">
              {latest && (
                <AnimateIn delay={300} className="gd-float-wrap">
                  <Link href={`/guides/${latest.slug}`} className="gd-float-card">
                    <span className="gd-float-label">Latest guide</span>
                    <h2 className="gd-float-title">{latest.title}</h2>
                    {latest.date && <span className="gd-float-date">{latest.date}</span>}
                    <span className="gd-gcard-read">
                      Read guide <ArrowIcon size={12} />
                    </span>
                  </Link>
                </AnimateIn>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="gd-filters">
        <div className="max-w-site">
          <div className="gd-filter-row">
            <span className="gd-filter-script">filter by topic</span>
            <div className="gd-filter-pills" role="group" aria-label="Filter by topic">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`gd-filter-pill${category === c ? " is-active" : ""}`}
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="gd-filter-row">
            <span className="gd-filter-script">filter by AI tool</span>
            <div className="gd-filter-pills" role="group" aria-label="Filter by AI tool">
              {tools.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`gd-filter-pill${tool === t ? " is-active" : ""}`}
                  aria-pressed={tool === t}
                  onClick={() => setTool(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {showYearFilter && (
            <div className="gd-filter-row">
              <span className="gd-filter-script">filter by year</span>
              <div className="gd-sort-wrap" ref={yearWrapRef}>
                <button
                  type="button"
                  className={`gd-sort-btn${yearOpen ? " is-open" : ""}`}
                  aria-haspopup="listbox"
                  aria-expanded={yearOpen}
                  onClick={() => setYearOpen((v) => !v)}
                >
                  {year}
                  <span className="gd-sort-chevron">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                {yearOpen && (
                  <div className="gd-sort-menu" role="listbox" aria-label="Filter by year">
                    {["All years", ...years].map((y) => (
                      <button
                        key={y}
                        type="button"
                        role="option"
                        aria-selected={year === y}
                        className={`gd-sort-option${year === y ? " is-selected" : ""}`}
                        onClick={() => {
                          setYear(y);
                          setYearOpen(false);
                        }}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="gd-grid-section">
        <div className="max-w-site">
          <div className="gd-grid-toolbar">
            <span className="gd-results-count">
              Showing {filtered.length} of {guides.length} guides
              {filtersActive && (
                <button type="button" className="gd-clear-btn" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </span>
            <div className="gd-sort-wrap" ref={sortWrapRef}>
              <span className="meta-label gd-sort-label">Sort by</span>
              <button
                type="button"
                className={`gd-sort-btn${sortOpen ? " is-open" : ""}`}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen((v) => !v)}
              >
                {activeSortLabel}
                <span className="gd-sort-chevron">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              {sortOpen && (
                <div className="gd-sort-menu" role="listbox" aria-label="Sort by">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={sort === opt.value}
                      className={`gd-sort-option${sort === opt.value ? " is-selected" : ""}`}
                      onClick={() => {
                        setSort(opt.value);
                        setSortOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="gd-empty">
              <span className="gd-empty-icon">
                <SearchIcon size={40} />
              </span>
              <h2 className="gd-empty-title">No guides match that filter</h2>
              <p className="gd-empty-body">
                Try changing your search or clearing filters to explore all guides.
              </p>
              <button type="button" className="btn-ghost" onClick={clearFilters}>
                View all guides
              </button>
            </div>
          ) : (
            <div className="gd-grid">
              {filtered.map((guide, i) => (
                <AnimateIn key={guide.slug} delay={Math.min(i, 6) * 60}>
                  <GridCard guide={guide} />
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
