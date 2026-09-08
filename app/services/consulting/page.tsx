"use client";
import { useState, CSSProperties } from "react";
import AnimateIn from "@/components/AnimateIn";
import CalBookingButton from "@/components/CalModal";
import ConsultingHeroPhoto from "@/components/ConsultingHeroPhoto";
import DirectLineCTA from "@/components/DirectLineCTA";
import { ProofChip, ProofChipRow, ProofChipIconAward, ProofChipIconGlobe, ProofChipIconCheck } from "@/components/ProofChip";
import { useParallax, useScrollFadeOut } from "@/hooks/useParallax";

const checkBullet = (text: string, i: number) => (
  <AnimateIn as="li" key={text} delay={i * 80} className="svc-check-item">
    <span
      className="svc-check-icon"
      style={{ background: "color-mix(in srgb, var(--coral) 16%, transparent)", color: "var(--coral)" }}
    >
      ✓
    </span>
    <span>{text}</span>
  </AnimateIn>
);

const formats = [
  {
    title: "Strategy sessions",
    body: "90 minutes, recorded, actioned. We name the problem and leave with a clear direction.",
    accent: "var(--coral)",
  },
  {
    title: "Fractional ops",
    body: "1-2 days per week, embedded in your team. I run ops alongside you, not for you.",
    accent: "var(--amber)",
  },
  {
    title: "Advisory retainer",
    body: "Monthly, async-first. I'm in your corner when you need a clear head on hard decisions.",
    accent: "var(--ink2)",
  },
];

export default function ConsultingPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const heroTextureRef = useParallax<HTMLDivElement>(0.1);
  const heroFadeRef = useScrollFadeOut<HTMLDivElement>(380);

  return (
    <>
      <style>{`
        .consulting-format-card {
          position: relative;
          border: 1px solid var(--line);
          border-radius: 22px;
          padding: 2rem;
          padding-top: calc(2rem + 4px);
          background: #fff;
          box-shadow: 0 16px 40px rgba(234,106,71,0.10), 0 4px 14px rgba(34,51,44,0.05);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          overflow: hidden;
        }
        .consulting-format-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 48px rgba(234,106,71,0.16), 0 6px 18px rgba(34,51,44,0.08);
        }
        .consulting-format-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--format-accent, var(--coral));
        }
        .consulting-checklist-block {
          background: var(--cream-2);
          border: 1px solid var(--line);
          border-radius: 22px;
          padding: 2rem 2.25rem;
        }
        .consulting-checklist-block ul {
          display: flex;
          gap: 2.5rem;
        }
        .consulting-checklist-block .svc-check-item {
          flex: 1;
          margin-bottom: 0;
        }
        @media (max-width: 768px) {
          .consulting-checklist-block ul {
            flex-direction: column;
            gap: 14px;
          }
        }
        .consulting-eyebrow {
          font-family: var(--font-dm-mono), monospace;
          font-size: 0.875rem;
          color: var(--coral);
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.75rem;
        }
        .consulting-pricing-bar {
          margin-top: 2.5rem;
          padding: 1.5rem 2rem;
          background: var(--cream);
          border: 1px solid var(--line);
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: space-between;
          box-shadow: 0 16px 40px rgba(234,106,71,0.10), 0 4px 14px rgba(34,51,44,0.05);
        }
        .consulting-form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--line-2);
          border-radius: 11px;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 1rem;
          color: var(--ink);
          background: #fff;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .consulting-form-input:focus {
          border-color: var(--coral);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--coral) 18%, transparent);
        }
        .consulting-send-btn {
          border-radius: 100px;
        }
        .consulting-book-grid {
          display: grid;
          grid-template-columns: 56% 40%;
          gap: 4%;
          align-items: center;
        }
        #book.section-pad {
          padding: 72px 0;
        }
        @media (max-width: 767px) {
          #book.section-pad {
            padding: var(--section-pad-mobile) 0;
          }
        }
        .consulting-next-panel {
          margin-top: 0;
        }
        .consulting-step-item {
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
        }
        .consulting-step-item + .consulting-step-item {
          margin-top: 1.1rem;
        }
        .consulting-step-num {
          flex: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--coral);
          color: #fff;
          font-family: var(--font-dm-mono), monospace;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .consulting-step-text {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 1rem;
          color: var(--body);
          line-height: 1.6;
          padding-top: 0.15rem;
        }
        @media (max-width: 860px) {
          .consulting-book-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .consulting-next-panel {
            margin-top: 0.5rem;
          }
        }
      `}</style>
      {/* HERO */}
      <section className="svc-hero-section" style={{ background: "var(--cream-2)" }}>
        <div className="svc-hero-texture" ref={heroTextureRef} data-parallax />
        <div className="max-w-site consulting-hero-grid" ref={heroFadeRef}>
          <div className="consulting-hero-text">
            <AnimateIn delay={80}>
              <h1
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "clamp(2.25rem, 4vw, 3rem)",
                  lineHeight: 1.2,
                  color: "var(--ink)",
                  fontWeight: 700,
                  marginBottom: "1.25rem",
                  maxWidth: 580,
                }}
              >
                Clarity before{" "}
                <span style={{ fontFamily: "var(--font-fraunces), serif", fontStyle: "italic", color: "var(--coral)" }}>
                  systems
                </span>
                .
              </h1>
            </AnimateIn>
            <AnimateIn delay={180}>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "1.125rem",
                  color: "var(--body)",
                  lineHeight: 1.7,
                  maxWidth: 520,
                }}
              >
                I work with owners and founders who know something is wrong but can&apos;t quite name it. We name it together. Then we fix it.
              </p>
            </AnimateIn>
            <AnimateIn delay={240}>
              <ProofChipRow>
                <ProofChip icon={<ProofChipIconAward />}>10+ yrs ops · Careem · Bolt · Wise</ProofChip>
                <ProofChip icon={<ProofChipIconGlobe />}>4 continents</ProofChip>
                <ProofChip icon={<ProofChipIconCheck />}>Anthropic Partner</ProofChip>
              </ProofChipRow>
            </AnimateIn>
          </div>
          <AnimateIn delay={320} className="consulting-hero-photo-anim">
            <ConsultingHeroPhoto />
          </AnimateIn>
        </div>
      </section>

      <style>{`
        .consulting-hero-grid {
          display: grid;
          grid-template-columns: 58% 38%;
          gap: 4%;
          align-items: center;
        }
        .animate-in.consulting-hero-photo-anim {
          transform: translateX(48px);
        }
        .animate-in.visible.consulting-hero-photo-anim {
          transform: translateX(0);
        }
        .consulting-hero-photo {
          position: relative;
          height: 460px;
          max-height: 460px;
          border-radius: 8px 32px 32px 32px;
          overflow: hidden;
          transform: rotate(1.5deg);
          box-shadow: 0 24px 56px rgba(234,106,71,0.18), 0 8px 22px rgba(34,51,44,0.08);
          will-change: transform;
        }
        @media (max-width: 1024px) {
          .consulting-hero-grid {
            grid-template-columns: 56% 40%;
            gap: 4%;
          }
          .consulting-hero-photo {
            height: 380px;
            max-height: 380px;
          }
        }
        @media (max-width: 860px) {
          .consulting-hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .consulting-hero-photo {
            height: 320px;
            max-height: 320px;
            width: 100%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .consulting-hero-photo-anim {
            transform: none !important;
          }
        }
      `}</style>

      {/* FORMATS */}
      <section className="section-pad">
        <div className="max-w-site">
          <AnimateIn>
            <span className="consulting-eyebrow">The engagement</span>
            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "clamp(1.625rem, 2.5vw, 2rem)",
                color: "var(--ink)",
                fontWeight: 700,
                marginBottom: "2.5rem",
              }}
            >
              What this looks like.
            </h2>
          </AnimateIn>
          <div className="grid md:grid-cols-3 gap-5">
            {formats.map((f, i) => (
              <AnimateIn key={f.title} delay={i * 80}>
                <div
                  className="consulting-format-card"
                  style={{ "--format-accent": f.accent } as CSSProperties}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontSize: "1.25rem",
                      color: "var(--ink)",
                      fontWeight: 700,
                      marginBottom: "0.65rem",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: "1rem",
                      color: "var(--body)",
                      lineHeight: 1.7,
                    }}
                  >
                    {f.body}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <div className="consulting-checklist-block" style={{ margin: "2.5rem 0 0" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "Fixed intro call before anything is scoped",
                "Direct access, no account managers, no hand-offs",
                "Documentation and hand-over on everything we build",
              ].map((t, i) => checkBullet(t, i))}
            </ul>
          </div>

          <AnimateIn delay={400}>
            <div className="consulting-pricing-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "0.875rem",
                    color: "var(--coral)",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Pricing
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: "1.125rem",
                    color: "var(--ink)",
                    fontWeight: 600,
                  }}
                >
                  From $140/hr · Retainers from $2,400/mo
                </span>
              </div>
              <CalBookingButton className="btn-coral">Book a call →</CalBookingButton>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* BOOK */}
      <section id="book" className="section-pad" style={{ background: "var(--cream)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-site">
          <div className="consulting-book-grid">
          <div style={{ maxWidth: 600 }}>
            <AnimateIn>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "clamp(1.625rem, 2.5vw, 2rem)",
                  color: "var(--ink)",
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                }}
              >
                Tell me what&apos;s broken.
              </h2>
            </AnimateIn>
            <AnimateIn delay={80}>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "1rem",
                  color: "var(--muted)",
                  marginBottom: "1.25rem",
                }}
              >
                I&apos;ll reply within 48 hours. If there&apos;s a fit, we&apos;ll book a call. Or skip the form and book directly.
              </p>
            </AnimateIn>
            <AnimateIn delay={110}>
              <CalBookingButton className="btn-ghost" style={{ marginBottom: "2rem" }}>
                Book a call directly →
              </CalBookingButton>
            </AnimateIn>
            <AnimateIn delay={150}>
              {submitted ? (
                <div
                  style={{
                    padding: "2rem",
                    background: "#fff",
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontSize: "1.25rem",
                      color: "var(--coral)",
                      fontWeight: 600,
                    }}
                  >
                    Got it. Talk soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!name || !email || !problem) return;
                    const webhookUrl = process.env.NEXT_PUBLIC_N8N_CONSULTING_FORM_WEBHOOK;
                    if (!webhookUrl) {
                      setSubmitError(true);
                      return;
                    }
                    setSubmitting(true);
                    setSubmitError(false);
                    try {
                      const res = await fetch(webhookUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, email, problem, submittedAt: new Date().toISOString() }),
                      });
                      if (!res.ok) throw new Error("Webhook responded with an error");
                      setSubmitted(true);
                    } catch {
                      setSubmitError(true);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                  {[
                    { label: "Name", value: name, setter: setName, type: "text", placeholder: "Your name" },
                    { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "your@email.com" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label
                        style={{
                          fontFamily: "var(--font-dm-mono), monospace",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--muted)",
                          display: "block",
                          marginBottom: "0.4rem",
                        }}
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        required
                        className="consulting-form-input"
                      />
                    </div>
                  ))}
                  <div>
                    <label
                      style={{
                        fontFamily: "var(--font-dm-mono), monospace",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--muted)",
                        display: "block",
                        marginBottom: "0.4rem",
                      }}
                    >
                      What&apos;s the problem?
                    </label>
                    <textarea
                      placeholder="Describe what's eating your time or breaking down..."
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      required
                      rows={5}
                      className="consulting-form-input"
                      style={{ resize: "vertical" }}
                    />
                  </div>
                  {submitError && (
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        fontSize: "1rem",
                        color: "var(--coral)",
                      }}
                    >
                      Something went wrong — try booking a call directly instead.
                    </p>
                  )}
                  <div>
                    <button type="submit" className="btn-coral consulting-send-btn" disabled={submitting}>
                      {submitting ? "Sending..." : "Send →"}
                    </button>
                  </div>
                </form>
              )}
            </AnimateIn>
          </div>

          <AnimateIn delay={200} className="consulting-next-panel">
            <div className="consulting-checklist-block">
              <span className="consulting-eyebrow" style={{ marginBottom: "1.1rem" }}>
                What happens next
              </span>
              {[
                "You send it — takes 2 minutes, no calendar needed yet.",
                "I read it — within 48 hours, properly, not skimmed.",
                "If it's a fit, we book a call. If not, I'll tell you that too.",
              ].map((t, i) => (
                <div className="consulting-step-item" key={t}>
                  <span className="consulting-step-num">{i + 1}</span>
                  <span className="consulting-step-text">{t}</span>
                </div>
              ))}
            </div>
          </AnimateIn>
          </div>
        </div>
      </section>

      {/* DIRECT LINE */}
      <section className="section-pad" style={{ background: "var(--bg)" }}>
        <div className="max-w-site">
          <AnimateIn>
            <DirectLineCTA />
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
