"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AnimateIn from "@/components/AnimateIn";
import CalBookingButton from "@/components/CalModal";
import { useParallax } from "@/hooks/useParallax";

function EmailMeButton({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fall back to mailto.
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <a href={`mailto:${email}`} className={className} onClick={handleClick}>
      {copied ? "Copied!" : "Email me"}
    </a>
  );
}

// Official brand glyphs (simple-icons path data), rendered as transparent
// currentColor fills - no solid box behind the mark.
function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
    </svg>
  );
}

function SubstackIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
    </svg>
  );
}

const socialLinks = [
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/consult-with-riz/", Icon: LinkedInIcon, brand: "#0A66C2" },
  { label: "INSTAGRAM", href: "https://www.instagram.com/etz.riz/reels/", Icon: InstagramIcon, brand: "#E4405F" },
  { label: "SUBSTACK", href: "https://conversationswithriz.substack.com/", Icon: SubstackIcon, brand: "#FF6719" },
];

const navColumns = [
  {
    label: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Case studies", href: "/case-studies" },
      { label: "About", href: "/about" },
      { label: "Writing", href: "/blog" },
      { label: "Guides", href: "/guides" },
    ],
  },
  {
    label: "Work with me",
    links: [
      { label: "Consulting", href: "/services/consulting" },
      { label: "Speaking", href: "/services/speaking" },
      { label: "All 20 systems →", href: "/case-studies" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "Soch → withsoch.com", href: "https://withsoch.com", external: true },
      { label: "riz@withsoch.com", href: "mailto:riz@withsoch.com" },
      { label: "Anthropic Partner", href: null, logo: "/logos/anthropic.png" },
    ],
  },
];

function FooterNavLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="ftr-link">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="ftr-link">
      {children}
    </Link>
  );
}

export default function Footer({ showCta }: { showCta?: boolean } = {}) {
  const pathname = usePathname();
  const shouldShowCta = showCta ?? (pathname !== "/" && !pathname?.startsWith("/services"));
  const watermarkRef = useParallax<HTMLDivElement>(0.15);

  return (
    <footer className="ftr-root">
      <style>{`
        .ftr-root {
          position: relative;
          background: var(--paper);
          overflow: hidden;
          border-top: 1px solid #EA6A47;
          padding: 56px clamp(20px, 5vw, 60px) 40px;
        }
        .ftr-dotgrid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(34,51,44,0.06) 1px, transparent 1px);
          background-size: 22px 22px;
          pointer-events: none;
          z-index: 0;
        }
        .ftr-glow {
          position: absolute;
          top: -140px;
          right: -100px;
          width: 560px;
          height: 560px;
          background: radial-gradient(circle, rgba(234,106,71,0.16), transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .ftr-watermark {
          position: absolute;
          right: -2%;
          bottom: -10%;
          font-family: var(--font-fraunces), serif;
          font-weight: 900;
          font-size: clamp(6rem, 20vw, 22rem);
          line-height: 0.8;
          letter-spacing: -0.02em;
          color: #22332C;
          opacity: 0.03;
          white-space: nowrap;
          user-select: none;
          pointer-events: none;
          z-index: 1;
        }
        .ftr-inner {
          position: relative;
          z-index: 2;
          max-width: 1360px;
          margin: 0 auto;
        }

        /* CTA band */
        .ftr-cta-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 40px;
          flex-wrap: wrap;
          padding-bottom: 48px;
        }
        .ftr-cta-headline {
          font-family: var(--font-fraunces), serif;
          font-weight: 700;
          font-size: clamp(2rem, 4vw, 3.25rem);
          line-height: 1.1;
          color: #22332C;
          max-width: 620px;
          margin: 0;
        }
        .ftr-cta-accent {
          color: #EA6A47;
          font-style: italic;
        }
        .ftr-cta-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .ftr-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #EA6A47;
          color: #22332C;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-weight: 700;
          font-size: 16px;
          padding: 0 28px;
          min-height: var(--btn-height);
          border-radius: var(--btn-radius);
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .ftr-btn-primary:hover {
          background: #CE5430;
          transform: translateY(-2px);
        }
        .ftr-btn-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: #22332C;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-weight: 700;
          font-size: 16px;
          padding: 0 28px;
          min-height: var(--btn-height);
          border-radius: var(--btn-radius);
          border: 1.5px solid rgba(34,51,44,0.25);
          text-decoration: none;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .ftr-btn-ghost:hover {
          border-color: #EA6A47;
          color: #EA6A47;
        }

        .ftr-divider {
          height: 1px;
          background: rgba(234,106,71,0.4);
          margin-bottom: 56px;
        }

        /* Main grid */
        .ftr-grid {
          display: grid;
          grid-template-columns: minmax(260px, 1.3fr) repeat(3, 1fr);
          gap: 40px;
        }
        .ftr-brand-name {
          font-family: var(--font-fraunces), serif;
          font-weight: 700;
          font-size: 1.75rem;
          color: #22332C;
          margin: 0 0 8px;
        }
        .ftr-tagline {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          color: rgba(34,51,44,0.72);
          letter-spacing: 0.02em;
          margin: 0 0 24px;
        }
        .ftr-social-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .ftr-social-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(34,51,44,0.18);
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.08em;
          color: rgba(34,51,44,0.72);
          text-decoration: none;
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        }
        .ftr-social-chip svg {
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .ftr-social-chip:hover {
          border-color: var(--brand, #EA6A47);
          color: var(--brand, #EA6A47);
        }
        .ftr-social-chip:hover svg {
          transform: scale(1.12);
        }
        .ftr-footnote {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          color: rgba(34,51,44,0.72);
          margin: 20px 0 0;
        }
        .ftr-col-heading {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #EA6A47;
          margin: 0 0 18px;
        }
        .ftr-link {
          position: relative;
          display: block;
          width: fit-content;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: rgba(34,51,44,0.85);
          text-decoration: none;
          margin-bottom: 14px;
          transition: color 0.2s ease, padding-left 0.2s ease;
        }
        .ftr-link::before {
          content: "→";
          position: absolute;
          left: -16px;
          top: 0;
          opacity: 0;
          color: #EA6A47;
          transition: opacity 0.2s ease, left 0.2s ease;
        }
        .ftr-link:hover {
          color: #EA6A47;
          padding-left: 18px;
        }
        .ftr-link:hover::before {
          opacity: 1;
          left: 0;
        }
        .ftr-static {
          display: block;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: rgba(34,51,44,0.72);
          margin-bottom: 14px;
        }
        .ftr-static-inline {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ftr-static-logo {
          height: 20px;
          width: auto;
          flex-shrink: 0;
          opacity: 0.75;
        }

        @media (max-width: 1024px) {
          .ftr-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px 24px;
          }
        }

        @media (max-width: 640px) {
          .ftr-root {
            padding: 48px 24px 32px;
          }
          .ftr-cta-row {
            flex-direction: column;
            align-items: flex-start;
            padding-bottom: 32px;
          }
          .ftr-cta-actions {
            width: 100%;
            flex-direction: column;
          }
          .ftr-btn-primary,
          .ftr-btn-ghost {
            width: 100%;
            justify-content: center;
          }
          .ftr-divider {
            margin-bottom: 40px;
          }
          .ftr-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .ftr-watermark {
            font-size: 28vw;
            bottom: -4%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ftr-root .animate-in {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="ftr-dotgrid" />
      <div className="ftr-glow" />
      <div className="ftr-watermark" aria-hidden="true" ref={watermarkRef} data-parallax>RIZWAN</div>

      <div className="ftr-inner">
        {shouldShowCta && (
          <>
            {/* CTA band */}
            <AnimateIn>
              <div className="ftr-cta-row">
                <div>
                  <h2 className="ftr-cta-headline">
                    Got a process <span className="ftr-cta-accent">worth fixing?</span>
                  </h2>
                </div>
                <div className="ftr-cta-actions">
                  <CalBookingButton className="ftr-btn-primary">Book a call</CalBookingButton>
                  <EmailMeButton email="riz@withsoch.com" className="ftr-btn-ghost" />
                </div>
              </div>
            </AnimateIn>

            <div className="ftr-divider" />
          </>
        )}

        {/* Main grid */}
        <div className="ftr-grid">
          <AnimateIn delay={0}>
            <div>
              <p className="ftr-brand-name">Rizwan Mahmood.</p>
              <p className="ftr-tagline">Operator. Builder. AI systems. Tallinn.</p>
              <div className="ftr-social-row">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ftr-social-chip"
                    style={{ "--brand": s.brand } as React.CSSProperties}
                  >
                    <s.Icon size={16} />
                    {s.label}
                  </a>
                ))}
              </div>
              <p className="ftr-footnote">© 2026 · Built on proof. Not persuasion.</p>
            </div>
          </AnimateIn>

          {navColumns.map((col, i) => (
            <AnimateIn key={col.label} delay={(i + 1) * 80}>
              <div>
                <p className="ftr-col-heading">{col.label}</p>
                {col.links.map((l) =>
                  l.href ? (
                    <FooterNavLink key={l.label} href={l.href} external={"external" in l ? l.external : undefined}>
                      {l.label}
                    </FooterNavLink>
                  ) : "logo" in l && l.logo ? (
                    <span key={l.label} className="ftr-static ftr-static-inline">
                      <img src={l.logo} alt="" className="ftr-static-logo" />
                      {l.label}
                    </span>
                  ) : (
                    <span key={l.label} className="ftr-static">
                      {l.label}
                    </span>
                  )
                )}
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </footer>
  );
}
