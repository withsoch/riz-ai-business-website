"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Writing", href: "/blog" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [darkHero, setDarkHero] = useState(false);
  const [navOffset, setNavOffset] = useState<number | null>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

  // Align the nav group's left edge with the hero photo's left edge (when present),
  // while keeping the logo untouched and the nav right-aligned otherwise.
  useEffect(() => {
    const recompute = () => {
      const logoEl = logoRef.current;
      if (!logoEl) return;
      const photoEl = document.querySelector(".hz-photo-card");
      if (!photoEl) {
        setNavOffset(null); // fallback: right-align within the navbar
        return;
      }
      const photoLeft = photoEl.getBoundingClientRect().left;
      const logoRight = logoEl.getBoundingClientRect().right;
      const diff = photoLeft - logoRight;
      setNavOffset(diff > 40 ? diff : null);
    };

    const raf = requestAnimationFrame(recompute);
    window.addEventListener("resize", recompute);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", recompute);
    };
  }, [pathname, scrolled]);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      const pastThreshold = y > 80;
      setScrolled(pastThreshold);
      setHidden(pastThreshold && y > lastY);
      lastY = y;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Re-detect dark hero whenever the route changes, after the new page renders
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setDarkHero(!!document.querySelector('[data-hero="dark"]'));
      // Also reset scroll state on navigation (page starts at top)
      setScrolled(window.scrollY > 80);
      setHidden(false);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Keep the nav visible whenever the mobile drawer is open
  useEffect(() => {
    if (open) setHidden(false);
  }, [open]);

  // White text only when we're at the top of a dark-hero page
  const light = darkHero && !scrolled;

  const textColor = light ? "rgba(255,255,255,0.82)" : "var(--body)";
  const textHover = light ? "#ffffff" : "var(--ink)";
  const logoColor = light ? "#ffffff" : "var(--ink)";
  const barColor = light ? "#ffffff" : "var(--ink)";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition:
          "background 0.25s ease, backdrop-filter 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
        transform: hidden && !open ? "translateY(-100%)" : "translateY(0)",
        background: scrolled ? "rgba(255,255,255,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        boxShadow: scrolled ? "0 8px 24px rgba(34,51,44,0.08)" : "none",
      }}
    >
      <div
        className="max-w-site flex items-center justify-between md:justify-start"
        style={{ height: scrolled ? 60 : 68, transition: "height 0.25s ease" }}
      >
        <Link ref={logoRef} href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <span
            className="animate-pulse-dot"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#EA6A47",
              display: "inline-block",
              marginTop: 2,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: logoColor,
              letterSpacing: "-0.02em",
              transition: "color 0.3s ease",
            }}
          >
            Riz
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-8"
          style={{ marginLeft: navOffset != null ? navOffset : "auto" }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 500,
                fontSize: "1rem",
                color: textColor,
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = textHover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className="flex md:hidden flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <span
            style={{
              display: "block", width: 22, height: 2,
              background: barColor, borderRadius: 2,
              transition: "transform 0.2s, background 0.3s ease",
              transform: open ? "translateY(6px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block", width: 22, height: 2,
              background: barColor, borderRadius: 2,
              opacity: open ? 0 : 1,
              transition: "opacity 0.2s, background 0.3s ease",
            }}
          />
          <span
            style={{
              display: "block", width: 22, height: 2,
              background: barColor, borderRadius: 2,
              transition: "transform 0.2s, background 0.3s ease",
              transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 360 : 0,
          transition: "max-height 0.3s ease",
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          borderTop: open ? "1px solid var(--line)" : "none",
        }}
      >
        <div className="max-w-site flex flex-col gap-2 py-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 500,
                fontSize: "1.125rem",
                color: "var(--body)",
                textDecoration: "none",
                padding: "0.5rem 0",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
