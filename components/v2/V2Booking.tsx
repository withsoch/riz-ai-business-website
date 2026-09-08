"use client";

import { useState } from "react";
import CalBookingButton from "@/components/CalModal";
import Reveal from "@/components/v2/Reveal";

/**
 * Build With Nav's two-path close, on Riz's ink rather than Nav's pure black.
 *
 * The live site closes with a single Cal.com modal. That converts the people
 * who arrived ready to book and drops everyone else — the ones who want to
 * describe the problem first, or who are scoping for a team and can't commit
 * a calendar slot yet. Nav gives both a door: "the fast route" for the ready,
 * a real inquiry form for the rest, and an in-place success state so neither
 * loses the page.
 *
 * The form posts to the same n8n webhook the consulting page already uses
 * (NEXT_PUBLIC_N8N_CONSULTING_FORM_WEBHOOK). With the env var unset it shows
 * an honest error and points at the calendar — it never fakes a success.
 */

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/consult-with-riz/" },
  { label: "Instagram", href: "https://www.instagram.com/etz.riz/reels/" },
  { label: "Substack", href: "https://conversationswithriz.substack.com/" },
];

const FORMATS = [
  "1:1 advisory or a strategy session",
  "A system built and shipped (via Soch)",
  "Speaking or a team workshop",
  "Not sure yet",
];

export default function V2Booking() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [format, setFormat] = useState(FORMATS[0]);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_CONSULTING_FORM_WEBHOOK;
    if (!webhookUrl) {
      setFailed(true);
      return;
    }

    setSending(true);
    setFailed(false);
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          headcount,
          format,
          problem: message,
          source: "v2-homepage",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Webhook responded with an error");
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="v2-book" id="book">
      <div className="v2-w">
        <Reveal>
          <div className="v2-head v2-head--center">
            <span className="v2-label v2-label--center">Work with Riz</span>
            <h2 className="v2-h2">
              Got a process
              <br />
              <span className="oh">worth fixing?</span>
            </h2>
            <p className="v2-sub v2-sub--center">
              Tell me what&apos;s broken and I&apos;ll come back within 48 hours with a straight
              answer on whether I&apos;m the right person for it. Or skip the form and take a slot
              on the calendar.
            </p>
            <p className="v2-book-guar">
              If it won&apos;t work, I&apos;ll tell you before you spend anything — not after.
            </p>
          </div>
        </Reveal>

        <div className="v2-book-grid">
          <Reveal>
            <div className="v2-book-card">
              <h3>The fast route</h3>
              <p>
                Sixty minutes, $140. Bring the vague problem, the half-built automation, or the
                process nobody wants to admit is broken. You leave with a direction.
              </p>
              <CalBookingButton className="v2-btn-o">
                Book a call <span className="v2-arr">→</span>
              </CalBookingButton>
              <p className="v2-book-note" style={{ marginTop: 20 }}>
                Prefer email? <a href="mailto:riz@withsoch.com">riz@withsoch.com</a>
              </p>
            </div>
          </Reveal>

          {sent ? (
            <div className="v2-book-success">
              <h3>Got it. Talk soon.</h3>
              <p>
                That came straight to me, not to a team. I&apos;ll read it myself and come back
                within 48 hours — including if the honest answer is that I&apos;m not the right
                person for this.
              </p>
              <p className="v2-book-note">In the meantime:</p>
              <div className="v2-bs-links">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <Reveal>
              <form className="v2-book-form" onSubmit={handleSubmit}>
                <div className="v2-book-2col">
                  <div>
                    <label htmlFor="v2-name">Your name</label>
                    <input
                      id="v2-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="v2-email">Email</label>
                    <input
                      id="v2-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="v2-book-2col">
                  <div>
                    <label htmlFor="v2-company">Company</label>
                    <input
                      id="v2-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="v2-headcount">Team size</label>
                    <input
                      id="v2-headcount"
                      type="text"
                      placeholder="e.g. 12"
                      value={headcount}
                      onChange={(e) => setHeadcount(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="v2-format">What are you after?</label>
                  <select
                    id="v2-format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    {FORMATS.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="v2-message">What&apos;s broken?</label>
                  <textarea
                    id="v2-message"
                    rows={4}
                    required
                    placeholder="The process, the timeline, and what you'd want to be true in three months"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="v2-btn-o"
                  disabled={sending}
                  style={{ justifySelf: "start", opacity: sending ? 0.6 : 1 }}
                >
                  {sending ? "Sending…" : "Send it"} <span className="v2-arr">→</span>
                </button>

                {failed && (
                  <p className="v2-book-err">
                    That didn&apos;t send. Book a call directly, or email riz@withsoch.com.
                  </p>
                )}

                <p className="v2-book-note">
                  Goes straight to my inbox. I answer everything myself. Questions first?{" "}
                  <a href="#faq">Read the FAQ</a>.
                </p>
              </form>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
