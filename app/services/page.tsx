"use client";
import { useEffect, useRef, useState } from "react";
import AnimateIn from "@/components/AnimateIn";
import ServicesHubDiagram from "@/components/ServicesHubDiagram";
import TestimonialsSection from "@/components/Testimonials";
import DirectLineCTA from "@/components/DirectLineCTA";
import CalBookingButton from "@/components/CalModal";
import { useParallax, useScrollFadeOut } from "@/hooks/useParallax";

const SERVICE_IDS = ["consulting", "projects", "workshops"];

/* ─── shared micro-styles ─────────────────────────── */
const sublineStyle = (color: string): React.CSSProperties => ({
  color,
});

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans), sans-serif",
  color: "var(--body)",
};

const checkBullet = (color: string, text: string, i: number) => (
  <AnimateIn as="li" key={text} delay={i * 80} className="svc-check-item">
    <span
      className="svc-check-icon"
      style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}
    >
      ✓
    </span>
    <span>{text}</span>
  </AnimateIn>
);

const sectionDivider = (
  <div style={{ borderTop: "1px solid var(--line)", marginTop: 0 }} />
);

/* ─── shared hook: drives card animations from viewport + motion prefs ─── */
function useCardAnimation<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, active: inView && !reducedMotion };
}

/* ─── mockup: Clarity Session booking widget ─────── */
function ConsultingMockup() {
  const { ref, active } = useCardAnimation<HTMLDivElement>();
  const [slot, setSlot] = useState(1);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSlot((s) => (s + 1) % 3), 3000);
    return () => clearInterval(id);
  }, [active]);

  const slots = [
    { time: "Mon · 9:00 AM" },
    { time: "Tue · 2:00 PM" },
    { time: "Thu · 11:00 AM" },
  ];

  return (
    <div
      ref={ref}
      style={{
        border: "1px solid var(--line)",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
        maxWidth: 460,
        marginLeft: "auto",
      }}
    >
      {/* coral header */}
      <div
        style={{
          background: "var(--coral)",
          padding: "1.5rem 1.75rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "1.125rem",
            color: "#fff",
          }}
        >
          <span className={`svc-anim-tick${active ? " is-active" : ""}`}>◎</span>
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 600,
              fontSize: "1.125rem",
              color: "#fff",
            }}
          >
            Clarity Session
          </p>
          <p
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.72)",
              marginTop: "0.15rem",
            }}
          >
            60 min · From $140
          </p>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "1.75rem", background: "#fff" }}>
        <p className="meta-label" style={{ marginBottom: "0.85rem" }}>
          Available this week
        </p>

        {slots.map((slotItem, i) => {
          const selected = i === slot;
          return (
            <div
              key={slotItem.time}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.9rem",
                borderRadius: 8,
                marginBottom: "0.5rem",
                background: selected ? "var(--coral)" : "var(--cream-2)",
                border: selected ? "none" : "1px solid var(--line)",
                transition: "background 0.5s ease, border-color 0.5s ease",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: selected ? "#fff" : "var(--muted)",
                  flexShrink: 0,
                  transition: "background 0.5s ease",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "0.875rem",
                  color: selected ? "#fff" : "var(--body)",
                  flex: 1,
                  transition: "color 0.5s ease",
                }}
              >
                {slotItem.time}
              </span>
              {selected && (
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "0.875rem",
                    color: "#FFFFFF",
                  }}
                >
                  Selected
                </span>
              )}
            </div>
          );
        })}

        <div
          style={{
            marginTop: "1rem",
            background: "var(--ink)",
            borderRadius: 8,
            padding: "0.8rem",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              color: "#fff",
            }}
          >
            Book this slot →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── mockup: workflow diagram (dark card) ───────── */
function wfNode(
  icon: string,
  label: string,
  accentBg: string,
  accentBorder: string,
  textColor: string,
  iconColor: string,
  isActive: boolean
) {
  return (
    <div
      style={{
        position: "relative",
        background: accentBg,
        border: `1px solid ${isActive ? "var(--coral)" : accentBorder}`,
        borderRadius: 7,
        padding: "0.5rem 0.85rem",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        flexShrink: 0,
        boxShadow: isActive
          ? "0 0 0 3px rgba(234,106,71,0.18), 0 0 14px rgba(234,106,71,0.35)"
          : "none",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      {isActive && (
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--coral)",
            boxShadow: "0 0 6px rgba(234,106,71,0.85)",
          }}
        />
      )}
      <span style={{ fontSize: "0.875rem", color: isActive ? "var(--coral)" : iconColor }}>
        {icon}
      </span>
      <span
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "1rem",
          color: textColor,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

const wfArrow = (
  <span style={{ color: "rgba(255,255,255,0.72)", fontSize: "1rem", flexShrink: 0 }}>
    →
  </span>
);

function ProjectsMockup() {
  const { ref, active } = useCardAnimation<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const totalSteps = 7;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setStep((s) => (s + 1) % totalSteps), 800);
    return () => clearInterval(id);
  }, [active]);

  const isStep = (i: number) => active && step === i;

  return (
    <div ref={ref} className="wf-card">
      <div className="wf-dotgrid" aria-hidden="true" />
      <div className="wf-card-inner">
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "1rem",
              color: "var(--coral)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Active Workflow
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "0.875rem",
              color: "#4ade80",
            }}
          >
            <span
              className="animate-pulse-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#4ade80",
                display: "inline-block",
              }}
            />
            Live
          </span>
        </div>

        {/* flow */}
        <div className="wf-flow">
          {/* row 1 */}
          <div className="wf-flow-row">
            {wfNode("▶", "New Lead", "rgba(234,106,71,0.22)", "rgba(234,106,71,0.4)", "rgba(255,255,255,0.9)", "var(--coral)", isStep(0))}
            {wfArrow}
            {wfNode("⋯", "Tag Filter", "rgba(255,255,255,0.07)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.72)", "rgba(255,255,255,0.72)", isStep(1))}
            {wfArrow}
            {wfNode("✳", "Enrich", "rgba(215,154,54,0.18)", "rgba(215,154,54,0.35)", "rgba(255,255,255,0.85)", "var(--amber)", isStep(2))}
          </div>

          {/* connector: branch from Enrich down into row 2 */}
          <div className="wf-elbow" />

          {/* row 2 */}
          <div className="wf-flow-row">
            {wfNode("✦", "Claude Draft", "rgba(167,139,250,0.16)", "rgba(167,139,250,0.4)", "rgba(255,255,255,0.88)", "#C4B5FD", isStep(3))}
            {wfArrow}
            {wfNode("◎", "Human Review", "rgba(255,255,255,0.07)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.72)", "rgba(255,255,255,0.72)", isStep(4))}
          </div>

          {/* connector: row 2 down into row 3 */}
          <div className="wf-elbow" />

          {/* row 3 */}
          <div className="wf-flow-row">
            {wfNode("□", "CRM Save", "rgba(255,255,255,0.07)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.72)", "rgba(255,255,255,0.72)", isStep(5))}
            {wfArrow}
            {wfNode("✉", "Notify", "rgba(255,255,255,0.07)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.72)", "rgba(255,255,255,0.72)", isStep(6))}
          </div>
        </div>

        {/* status + tech stack */}
        <div
          style={{
            marginTop: "1.75rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="wf-status-row">
            <span>⏱ Last run · 2m ago</span>
            <span>↻ 1,240 runs</span>
            <span style={{ color: "#4ade80" }}>✓ 0 errors</span>
          </div>

          <div
            style={{
              marginTop: "0.9rem",
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {["n8n", "Claude", "Airtable", "Slack"].map((t) => (
              <span
                key={t}
                style={{
                  padding: "0.3rem 0.75rem",
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.06)",
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── mockup: workshop event card ────────────────── */
function WorkshopsMockup() {
  const { ref, active } = useCardAnimation<HTMLDivElement>();
  const [row, setRow] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setRow((r) => (r + 1) % 3), 1333);
    return () => clearInterval(id);
  }, [active]);

  const rows = [
    { icon: "⏱", label: "Duration", value: "Half-day or full-day" },
    { icon: "◎", label: "Format", value: "Interactive sessions" },
    { icon: "◈", label: "Audience", value: "Teams up to 30 people" },
  ];

  return (
    <div
      ref={ref}
      style={{
        border: "1px solid var(--line)",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
        maxWidth: 460,
        marginLeft: "auto",
      }}
    >
      {/* amber header */}
      <div style={{ background: "var(--amber)", padding: "2rem 1.75rem", position: "relative" }}>
        <span className="meta-label" style={{ color: "#22332C" }}>
          Live Workshop
        </span>
        <h4
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--ink)",
            lineHeight: 1.2,
            marginTop: "0.4rem",
            marginBottom: "0.3rem",
          }}
        >
          AI Leverage for Ops Teams
        </h4>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "0.875rem",
            color: "var(--ink)",
          }}
        >
          In-person or remote
        </p>

        <div
          className="svc-anim-progress-track"
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "rgba(34,51,44,0.18)" }}
        >
          <div className={`svc-anim-progress-fill${active ? " is-active" : ""}`} />
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "1.75rem", background: "#fff" }}>
        {rows.map((rowItem, i) => {
          const isActive = active && row === i;
          return (
            <div
              key={rowItem.label}
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                marginBottom: "0.9rem",
              }}
            >
              <span
                style={{
                  color: "var(--amber)",
                  flexShrink: 0,
                  fontSize: "1rem",
                  marginTop: "0.1rem",
                  display: "inline-block",
                  transform: isActive ? "scale(1.3)" : "scale(1)",
                  transition: "transform 0.4s ease",
                }}
              >
                {rowItem.icon}
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "0.875rem",
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.1rem",
                  }}
                >
                  {rowItem.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "0.875rem",
                    color: "var(--ink)",
                    lineHeight: 1.4,
                  }}
                >
                  {rowItem.value}
                </p>
              </div>
            </div>
          );
        })}

        <div
          style={{
            marginTop: "0.5rem",
            background: "var(--amber)",
            borderRadius: 8,
            padding: "0.8rem",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              color: "var(--ink)",
            }}
          >
            Enquire about a session →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── page ────────────────────────────────────────── */
export default function Services() {
  const [active, setActive] = useState(SERVICE_IDS[0]);
  const heroTextureRef = useParallax<HTMLDivElement>(0.1);
  const heroFadeRef = useScrollFadeOut<HTMLDivElement>(380);

  useEffect(() => {
    const onScroll = () => {
      for (let i = SERVICE_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SERVICE_IDS[i]);
        if (el && el.getBoundingClientRect().top <= 160) {
          setActive(SERVICE_IDS[i]);
          return;
        }
      }
      setActive(SERVICE_IDS[0]);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="svc-hero-section" style={{ background: "var(--cream)" }}>
        <div className="svc-hero-texture svc-hero-texture--strong" ref={heroTextureRef} data-parallax />
        <div className="max-w-site">
          <div className="svc-hero-inner" ref={heroFadeRef}>
            {/* left: text + pills */}
            <div>
              <AnimateIn delay={60}>
                <h1 className="svc-hero-title">Work with Riz.</h1>
              </AnimateIn>
              <AnimateIn delay={240}>
                <div className="svc-tabs">
                  {[
                    { label: "Consulting", id: "consulting" },
                    { label: "Projects", id: "projects" },
                    { label: "Workshops", id: "workshops" },
                  ].map((pill) => (
                    <a
                      key={pill.id}
                      href={`#${pill.id}`}
                      className={`svc-tab${active === pill.id ? " active" : ""}`}
                    >
                      {pill.label}
                    </a>
                  ))}
                </div>
              </AnimateIn>
            </div>

            {/* right: hub diagram SVG */}
            <div className="svc-hero-diagram">
              <AnimateIn delay={300}>
                <ServicesHubDiagram />
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {sectionDivider}

      {/* CONSULTING ── id for anchor */}
      <section
        id="consulting"
        className="svc-section"
        style={{
          background: "#fff",
          scrollMarginTop: 96,
        }}
      >
        <div className="max-w-site">
          <div className="svc-row">
            {/* left: text */}
            <div className="svc-row-text">
              <AnimateIn>
                <p className="svc-subline" style={sublineStyle("var(--coral)")}>Consult Riz.</p>
              </AnimateIn>
              <AnimateIn delay={100}>
                <p className="svc-body" style={bodyStyle}>
                  Bring your toughest questions, vague problems or just
                  schedule to bounce off interesting ideas
                </p>
              </AnimateIn>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem" }}>
                {[
                  "Ops and process diagnosis",
                  "AI readiness assessment",
                  "Fractional advisory",
                  "Tool stack audit",
                  "Roadmap you can execute without me",
                ].map((b, i) => checkBullet("var(--coral)", b, i))}
              </ul>
              <AnimateIn delay={260}>
                <CalBookingButton className="btn-coral">
                  Book a call →
                </CalBookingButton>
              </AnimateIn>
            </div>

            {/* right: booking widget mockup */}
            <div className="svc-row-card">
              <AnimateIn delay={150}>
                <ConsultingMockup />
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* coral divider after consulting */}
      <div style={{ borderTop: "1.5px solid var(--coral)", opacity: 0.35 }} />

      {/* PROJECTS */}
      <section
        id="projects"
        className="svc-section"
        style={{
          background: "var(--cream)",
          scrollMarginTop: 96,
        }}
      >
        <div className="max-w-site">
          <div className="svc-row">
            {/* left: text */}
            <div className="svc-row-text">
              <AnimateIn>
                <p className="svc-subline" style={sublineStyle("var(--ink)")}>Create systems with Soch.</p>
              </AnimateIn>
              <AnimateIn delay={100}>
                <p className="svc-body" style={bodyStyle}>
                  I build automations, agents, and internal tools. Through my
                  company Soch, we take it from idea to deployed.
                </p>
              </AnimateIn>
              <AnimateIn delay={140}>
                <p className="svc-body" style={bodyStyle}>
                  Every build is scoped up front and delivered through Soch,
                  with weekly demos so you&apos;re never guessing what&apos;s shipping.
                  When it&apos;s done, you get full documentation and a proper
                  handover. No retainer required to keep it running.
                </p>
              </AnimateIn>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem" }}>
                {[
                  "n8n workflow automations",
                  "AI agents and internal tools",
                  "End-to-end build and handover",
                  "Claude/LLM agent integrations",
                  "Docs, training & handover included",
                ].map((b, i) => checkBullet("var(--ink)", b, i))}
              </ul>
              <AnimateIn delay={260}>
                <a
                  href="https://withsoch.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    minHeight: 52,
                    padding: "0.75rem 1.75rem",
                    borderRadius: 8,
                    background: "var(--ink)",
                    color: "#fff",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textDecoration: "none",
                  }}
                >
                  See Soch →
                </a>
              </AnimateIn>
            </div>

            {/* right: workflow diagram mockup */}
            <div className="svc-row-card">
              <AnimateIn delay={150}>
                <ProjectsMockup />
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {sectionDivider}

      {/* WORKSHOPS */}
      <section
        id="workshops"
        className="svc-section"
        style={{
          background: "#fff",
          scrollMarginTop: 96,
        }}
      >
        <div className="max-w-site">
          <div className="svc-row">
            {/* left: text */}
            <div className="svc-row-text">
              <AnimateIn>
                <p className="svc-subline" style={sublineStyle("var(--amber)")}>Your team, upskilled.</p>
              </AnimateIn>
              <AnimateIn delay={100}>
                <p className="svc-body" style={bodyStyle}>
                  Talks and sessions on AI leverage and the future of work.
                  In-person or remote.
                </p>
              </AnimateIn>
              <AnimateIn delay={140}>
                <p className="svc-body" style={bodyStyle}>
                  No slide decks to sit through. Teams leave with a working
                  automation they built themselves, live, in the room.
                  Something they can point to on Monday morning.
                </p>
              </AnimateIn>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem" }}>
                {[
                  "Keynotes and conference talks",
                  "Team AI workshops",
                  "Executive education sessions",
                  "Hands-on, build-in-session format",
                  "Tailored to your team's actual workflows",
                ].map((b, i) => checkBullet("var(--amber)", b, i))}
              </ul>
              <AnimateIn delay={260}>
                <CalBookingButton
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    minHeight: 52,
                    padding: "0.75rem 1.75rem",
                    borderRadius: 8,
                    background: "var(--amber)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textDecoration: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Enquire →
                </CalBookingButton>
              </AnimateIn>
            </div>

            {/* right: workshop event card mockup */}
            <div className="svc-row-card">
              <AnimateIn delay={150}>
                <WorkshopsMockup />
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {sectionDivider}

      {/* TESTIMONIALS */}
      <TestimonialsSection
        heading={
          <>
            Don&apos;t take <span style={{ color: "var(--coral)", fontStyle: "italic" }}>my word</span> for it.
          </>
        }
      />

      {sectionDivider}

      {/* BOTTOM CTA - reused Direct Line component from the homepage */}
      <section className="section-pad" style={{ background: "var(--cream)" }}>
        <div className="max-w-site">
          <AnimateIn>
            <DirectLineCTA />
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
