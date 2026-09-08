"use client";
import { useState } from "react";
import AnimateIn from "@/components/AnimateIn";

export type Testimonial = {
  id: string;
  name: string;
  roleLine: string;
  quote: string;
  /** Short preview of `quote` for the clickable grid cards - full quote shows only in the featured box. */
  teaser?: string;
  initials: string;
  avatarUrl?: string;
  /** True until this is swapped for a real client quote. Not shown in the UI - internal tracking only. */
  isPlaceholder?: boolean;
  /** Placeholder - swap for the real company name once available. Shown only in the featured area. */
  fullCompany?: string;
  /** Placeholder value (e.g. "[LINKEDIN_URL_NAME]") - swap for the person's real LinkedIn URL. */
  linkedinUrl?: string;
  /** Placeholder href ("#") - not currently rendered; kept for when a case-study/testimonial page exists. */
  readMoreHref?: string;
};

// Placeholder quotes - swap for real ones before shipping.
// avatarUrl entries are AI-generated placeholder faces; swap for real client photos later.
export const testimonials: Testimonial[] = [
  {
    id: "automation-delivery",
    name: "Amara Whitfield",
    roleLine: "Founder, B2B SaaS",
    quote:
      "Riz didn't just wire up automations. He made us rebuild how we thought about the whole sales pipeline first. That's the part that actually stuck.",
    teaser:
      "Riz didn't just wire up automations. He made us rebuild how we thought about the whole sales pipeline first…",
    initials: "AW",
    avatarUrl: "/images/testimonials/amara.jpg",
    isPlaceholder: true,
    fullCompany: "Northline Cloud",
    linkedinUrl: "[LINKEDIN_URL_AMARA_WHITFIELD]",
    readMoreHref: "#",
  },
  {
    id: "ops-clarity",
    name: "Daniel Okafor",
    roleLine: "Head of Ops, logistics scale-up",
    quote:
      'We\'d tried three other "AI consultants" before Riz. He was the first one who asked about our process before touching a single tool.',
    teaser:
      'We\'d tried three other "AI consultants" before Riz. He was the first one who asked about our process…',
    initials: "DO",
    avatarUrl: "/images/testimonials/daniel.jpg",
    isPlaceholder: true,
    fullCompany: "Meridian Logistics",
    linkedinUrl: "[LINKEDIN_URL_DANIEL_OKAFOR]",
    readMoreHref: "#",
  },
  {
    id: "workshops",
    name: "Priya Nathan",
    roleLine: "COO, recruitment agency",
    quote:
      "The workshop paid for itself in the first week. My team stopped treating AI like a toy and started treating it like leverage.",
    teaser:
      "The workshop paid for itself in the first week. My team stopped treating AI like a toy…",
    initials: "PN",
    avatarUrl: "/images/testimonials/priya.jpg",
    isPlaceholder: true,
    fullCompany: "Harborview Recruiting",
    linkedinUrl: "[LINKEDIN_URL_PRIYA_NATHAN]",
    readMoreHref: "#",
  },
  {
    id: "advisory",
    name: "Marcus Feldt",
    roleLine: "Managing Partner, law firm",
    quote:
      "Straightforward, no-nonsense advisory. Riz told us what wouldn't work before we spent a cent building it.",
    teaser:
      "Straightforward, no-nonsense advisory. Riz told us what wouldn't work before we spent a cent…",
    initials: "MF",
    avatarUrl: "/images/testimonials/marcus.jpg",
    isPlaceholder: true,
    fullCompany: "Ashford Hale LLP",
    linkedinUrl: "[LINKEDIN_URL_MARCUS_FELDT]",
    readMoreHref: "#",
  },
];

export const trustedCompanies = ["Careem", "Bolt", "Wise"];

function Avatar({
  initials,
  avatarUrl,
  name,
  size,
}: {
  initials: string;
  avatarUrl?: string;
  name: string;
  size: number;
}) {
  const [errored, setErrored] = useState(false);

  const avatarInner =
    avatarUrl && !errored ? (
      <img
        src={avatarUrl}
        alt={name}
        className="testimonials-avatar-photo"
        style={{ width: size, height: size }}
        onError={() => setErrored(true)}
      />
    ) : (
      <div
        className="testimonials-avatar"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.32) }}
      >
        {initials}
      </div>
    );

  return (
    <span className="testimonials-avatar-wrap" style={{ width: size, height: size }}>
      {avatarInner}
    </span>
  );
}

function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z" />
    </svg>
  );
}

function TestimonialCard({
  t,
  onFeature,
  isRecent,
}: {
  t: Testimonial;
  onFeature?: (id: string) => void;
  isRecent?: boolean;
}) {
  const clickable = !!onFeature;

  return (
    <div
      className={`testimonials-card${clickable ? " testimonials-card-clickable" : ""}${
        isRecent ? " testimonials-card-recent" : ""
      }`}
      onClick={clickable ? () => onFeature!(t.id) : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `Feature ${t.name}'s testimonial` : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onFeature!(t.id);
              }
            }
          : undefined
      }
    >
      {isRecent && <span className="testimonials-card-badge">Previously featured</span>}
      <span className="testimonials-card-mark" aria-hidden="true">&ldquo;</span>
      <p className="testimonials-card-quote">{clickable && t.teaser ? t.teaser : t.quote}</p>
      <div className="testimonials-author">
        <Avatar initials={t.initials} avatarUrl={t.avatarUrl} name={t.name} size={36} />
        <div>
          <div className="testimonials-author-name">{t.name}</div>
          {/* Role/company/LinkedIn stay exclusive to the featured box - the payoff for clicking. */}
          {!clickable && <div className="testimonials-author-role">{t.roleLine}</div>}
        </div>
      </div>
      {clickable && (
        <button
          type="button"
          className="testimonials-readmore testimonials-readmore-card"
          onClick={(e) => {
            e.stopPropagation();
            onFeature!(t.id);
          }}
        >
          Read the full story <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}

type TestimonialsSectionProps = {
  /** "full" = featured pull-quote + 3-col grid + trust strip. "compact" = 2-card grid only. */
  variant?: "full" | "compact";
  heading: React.ReactNode;
  headingStyle?: React.CSSProperties;
  background?: string;
};

export default function TestimonialsSection({
  variant = "full",
  heading,
  headingStyle,
  background = "#F1EBDE",
}: TestimonialsSectionProps) {
  const [featuredId, setFeaturedId] = useState(testimonials[0].id);
  const [previousFeaturedId, setPreviousFeaturedId] = useState<string | null>(null);

  const handleFeature = (id: string) => {
    if (id === featuredId) return;
    setPreviousFeaturedId(featuredId);
    setFeaturedId(id);
  };

  const featured =
    variant === "full" ? testimonials.find((t) => t.id === featuredId) ?? testimonials[0] : null;
  const gridItems =
    variant === "full" ? testimonials.filter((t) => t.id !== featuredId) : testimonials.slice(0, 2);
  const gridBaseDelay = featured ? 220 : 120;

  return (
    <section
      className="testimonials-section"
      style={{ background, borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
    >
      <div className="max-w-site">
        <AnimateIn>
          <h2 style={{ marginBottom: variant === "full" ? 48 : 36, maxWidth: 640, ...headingStyle }}>
            {heading}
          </h2>
        </AnimateIn>

        {featured && (
          <AnimateIn delay={120}>
            <div className="testimonials-featured">
              <span className="testimonials-featured-mark" aria-hidden="true">&ldquo;</span>
              <div key={featured.id} className="testimonials-featured-content">
                <p className="testimonials-featured-quote">{featured.quote}</p>
                <div className="testimonials-featured-person">
                  <Avatar
                    initials={featured.initials}
                    avatarUrl={featured.avatarUrl}
                    name={featured.name}
                    size={68}
                  />
                  <div>
                    <div className="testimonials-featured-name-row">
                      <span className="testimonials-featured-name">{featured.name}</span>
                      {featured.linkedinUrl && !featured.linkedinUrl.startsWith("[") && (
                        <span
                          className="testimonials-linkedin-btn testimonials-linkedin-btn-inert"
                          aria-label={`${featured.name} on LinkedIn`}
                        >
                          <LinkedInIcon size={15} />
                        </span>
                      )}
                    </div>
                    <div className="testimonials-featured-role">
                      <span>{featured.roleLine}</span>
                      {featured.fullCompany && (
                        <span className="testimonials-featured-company">{featured.fullCompany}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        )}

        <div className={`testimonials-grid${variant === "compact" ? " compact" : ""}`}>
          {gridItems.map((t, i) => (
            <AnimateIn key={t.id} delay={gridBaseDelay + i * 80} className="testimonials-card-animate">
              <TestimonialCard
                t={t}
                onFeature={variant === "full" ? handleFeature : undefined}
                isRecent={variant === "full" && t.id === previousFeaturedId}
              />
            </AnimateIn>
          ))}
        </div>

      </div>
    </section>
  );
}
