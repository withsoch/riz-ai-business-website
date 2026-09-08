"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import "./home.css";
import { bebasNeue } from "@/components/displayFont";
import Reveal from "@/components/v2/Reveal";
import V2Nav from "@/components/v2/V2Nav";
import TrustBar from "@/components/v2/TrustBar";
import V2Faq from "@/components/v2/V2Faq";
import V2Booking from "@/components/v2/V2Booking";

import CalBookingButton from "@/components/CalModal";
import FeaturedCaseStudies from "@/components/FeaturedCaseStudies";
import PersonalityCarousel from "@/components/PersonalityCarousel";
import TestimonialsSection from "@/components/Testimonials";
import { type SubstackPost, FALLBACK_POSTS } from "@/lib/substack";

/* ============================================================
   Homepage.

   What came from buildwithnav.com (structure):
     · proof before persuasion — trust bar + logo wall above the fold
     · numbered 01/02/03 offer cards with a Format/Length/For/You keep
       spec grid and one featured "most booked" card
     · published pricing, stated as a virtue
     · qualification: a fit list beside a dark "not for you if" card
     · the FAQ accordion
     · the dual-path dark close — calendar for the ready, form for the rest
     · pill buttons, hairline section rhythm, grain, hero frame, sticky
       mobile CTA, headline lines rising out of a mask

   What stayed Riz's (soul):
     · the cream/coral/ink palette — warmer and more distinctive than
       Nav's black-and-#FF4500 agency look
     · "What I actually believe", which Nav has no equivalent of and which
       is the most Riz thing on the site
     · the asymmetric portrait hero, the personality carousel, the case
       study expandables, the writing rows, the real testimonials

   Deliberately NOT taken: a ninety-brand logo flex, lead-magnet
   sprawl, and a hard "you don't pay" guarantee — that last one is a
   commercial promise, not a design decision. See the note above
   .v2-guar below, and DESIGN-NOTES.md for the full record.
   ============================================================ */

const STACK = [
  "n8n", "Claude API", "OpenAI API", "Postgres", "Apify", "Whisper",
  "Smartlead", "ClickUp", "Attio", "Notion", "Slack", "Next.js",
  "Vercel", "Make", "Zapier", "Clay",
];

const FIT = [
  {
    n: "01",
    title: "You are the bottleneck",
    body: "Every decision routes through you. You already know it. What you don't have is the week it would take to sit down and fix it.",
  },
  {
    n: "02",
    title: "You've bought tools that didn't stick",
    body: "The subscriptions are live. Nobody uses them. The process underneath never changed, so the tool had nothing to hold on to.",
  },
  {
    n: "03",
    title: "Ops-heavy, roughly 3 to 30 people",
    body: "Enough repeated process to be worth automating, small enough that you can still change how it works without a committee.",
  },
  {
    n: "04",
    title: "You want to own it afterwards",
    body: "Documentation, training, and a system your team can touch. Not a dependency on the person who built it.",
  },
];

const NOT_FIT = [
  "You want AI bolted onto a process nobody has written down yet",
  "You're shopping for the cheapest pair of hands, not the clearest thinking",
  "You want a deck and a strategy document, not a system that runs",
  "You need enterprise procurement, legal review and a six-month pilot",
];

const ROUTES = [
  {
    n: "01",
    title: "1:1 advisory & fractional ops",
    desc: "You bring the vague problem. We name it properly, then decide what to do about it. Sometimes that's a build. Often it's cheaper than that.",
    meta: [
      ["Format", "Strategy session, or embedded 1–2 days a week"],
      ["Length", "90 minutes, recorded — or ongoing"],
      ["For", "Owners, founders, and the small team around them"],
      ["You keep", "The recording, the decisions, and a direction"],
    ],
    price: "From $140/hr",
    priceNote: "· retainers from $2,400/mo",
    links: [
      { label: "See how it runs", href: "/services/consulting", accent: true },
    ],
    featured: false,
  },
  {
    n: "02",
    title: "A system built and shipped",
    desc: "The heavy build work, delivered through Soch. We map your process, design the automation, build it in n8n and Claude, and hand it back documented.",
    meta: [
      ["Format", "Discovery → build → handover, fixed scope"],
      ["Length", "From about two weeks"],
      ["For", "Ops-heavy teams with a process worth fixing"],
      ["You keep", "The system, the docs, the training. No lock-in."],
    ],
    price: "Project-based",
    priceNote: "· from $3,500",
    links: [
      { label: "See Soch ↗", href: "https://withsoch.com", accent: true, external: true },
      { label: "Details", href: "/services/projects", accent: false },
    ],
    featured: true,
    badge: "Most booked",
  },
  {
    n: "03",
    title: "Speaking & workshops",
    desc: "No slide decks to sit through. Teams leave with a working automation they built themselves, live, in the room — something they can point to on Monday.",
    meta: [
      ["Format", "Keynote, or hands-on team workshop"],
      ["Length", "45 minutes to a full day"],
      ["For", "Conferences, offsites, ops and leadership teams"],
      ["You keep", "The automation your team built in the room"],
    ],
    price: "On enquiry",
    priceNote: "· four continents so far",
    links: [{ label: "Topics and formats", href: "/services/speaking", accent: true }],
    featured: false,
  },
];

const HOW = [
  "1 · Tell me what's broken",
  "2 · We scope it on a call",
  "3 · We fix the thinking, then build",
  "4 · You own it, documented",
];

function formatRowDate(pubDate: string): string {
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return `${parsed.getFullYear()} · ${String(parsed.getMonth() + 1).padStart(2, "0")}`;
}

export default function V2Home() {
  const [posts, setPosts] = useState<SubstackPost[]>(FALLBACK_POSTS);
  const [stickyOn, setStickyOn] = useState(false);

  useEffect(() => {
    fetch("/api/writing-posts")
      .then((res) => (res.ok ? res.json() : null))
      .then((p: SubstackPost[] | null) => {
        if (p && p.length) setPosts(p);
      })
      .catch(() => {});
  }, []);

  // Nav reveals its sticky mobile CTA once you're past the hero, so it never
  // covers the hero's own buttons.
  useEffect(() => {
    const onScroll = () => setStickyOn(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`v2 ${bebasNeue.variable}`}>
      <div className="v2-grain" aria-hidden="true" />

      {/* ---------- ANNOUNCEMENT BAR ---------- */}
      <div className="v2-bar">
        <Link href="/guides">
          <span className="v2-bar-tag">Free</span>
          <span className="v2-bar-txt">
            16 practical AI guides — built from actual client work
          </span>
          <span className="v2-bar-arrow">→</span>
        </Link>
      </div>

      <V2Nav />

      {/* ---------- HERO ---------- */}
      <section className="v2-hero" id="hero">
        <div className="v2-hero-dots" aria-hidden="true" />
        <div className="v2-hero-frame" aria-hidden="true" />

        <div className="v2-hero-inner">
          <div className="v2-hero-grid">
            <div>
              <Reveal>
                <p className="v2-eyebrow">
                  <span className="dot" />
                  AI advisory & automation systems · Tallinn
                </p>
              </Reveal>

              {/* Nav's two-beat headline: name the wrong answer, then the
                  right one. Riz's live H1 says the same thing in one breath
                  ("I help owners think clearly enough that automation
                  works") — splitting it gives the second line somewhere to
                  land, and something to underline. */}
              <h1 className="v2-h1">
                <Reveal variant="mask" as="span">
                  <span>Your business doesn&apos;t need more AI.</span>
                </Reveal>
                <Reveal variant="mask" as="span">
                  <span>
                    <span className="v2-h1-2">
                      It needs to think clearly first.
                      <span className="v2-sweep" aria-hidden="true" />
                    </span>
                  </span>
                </Reveal>
              </h1>

              <Reveal>
                <p className="v2-hero-sub">
                  I&apos;m Riz. Ten years running operations at Careem, Bolt and Wise — then I
                  started building the systems instead of just running them.{" "}
                  <b>AI scales whatever you feed it: messy input, messy output.</b> I come in
                  before the build, not after it breaks.
                </p>
              </Reveal>

              <Reveal>
                <div className="v2-cta-row">
                  <CalBookingButton className="v2-btn-o">
                    Book a 60-min call · $140 <span className="v2-arr">→</span>
                  </CalBookingButton>
                  <Link href="/case-studies" className="v2-btn-g">
                    See what I&apos;ve built <span className="v2-arr">→</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <div className="v2-hero-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/riz-photo-new.jpg" alt="Rizwan Mahmood" />
                <div className="v2-photo-tag">
                  <strong>Rizwan Mahmood</strong>
                  <span>Tallinn, EE</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- TRUST BAR ---------- */}
      <TrustBar />

      {/* ---------- TICKER ---------- */}
      <div className="v2-ticker">
        <div className="v2-ticker-head">
          <span className="v2-ticker-eyebrow">Where the ten years were spent</span>
        </div>
        <Reveal variant="stagger" className="v2-biglogos">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/careem.png" alt="Careem" />
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/bolt.png" alt="Bolt" />
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/wise.svg" alt="Wise" />
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/anthropic.png" alt="Anthropic" />
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/n8n.svg" alt="n8n" />
          </div>
        </Reveal>
        <p className="v2-plus">
          Careem · Bolt · Motive · Wise — and now an{" "}
          <span>Anthropic Claude Partner Network</span> member
        </p>
        {/* Nav runs 90 client logos here. Riz has five he genuinely owns, so
            the marquee carries the stack as text instead of padding the wall
            with brands he hasn't worked with. */}
        <div className="v2-ticker-wrap">
          <div className="v2-ticker-track">
            {[...STACK, ...STACK].map((tool, i) => (
              <span className="v2-ti" key={`${tool}-${i}`}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- BELIEF (Riz's, kept) ---------- */}
      <section className="v2-sec v2-sec--white v2-belief">
        <div className="v2-w v2-belief-grid">
          <div>
            <Reveal>
              <div className="v2-head">
                <span className="v2-label">What I actually believe</span>
                <h2 className="v2-h2">
                  AI doesn&apos;t think for you.
                  <br />
                  <span className="oh">It thinks like you.</span>
                </h2>
              </div>
            </Reveal>
            <Reveal>
              <p>
                Everyone&apos;s selling AI like it&apos;s a brain you can rent. It isn&apos;t. It
                thinks <em>like</em> you, faster and at scale. Feed it muddled thinking and you
                get muddled output — just more of it.
              </p>
            </Reveal>
            <Reveal>
              <p className="v2-belief-key">
                Feed it clarity and it becomes <span className="coral">leverage.</span>
              </p>
            </Reveal>
            <Reveal>
              <p>
                So the work was never &ldquo;add AI.&rdquo; The work is: get clear on the actual
                problem, design the system, then let the machine run it. The teams I watched
                scale weren&apos;t the ones with the best tools. They were the ones who thought
                clearly before they built.
              </p>
            </Reveal>
            <Reveal>
              <div className="v2-belief-close">
                <div className="v2-belief-close-main">That&apos;s the whole game.</div>
                <div className="v2-belief-close-sub">Think first. Then automate.</div>
                <Link href="/about" className="v2-btn-g">
                  About Riz <span className="v2-arr">→</span>
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="v2-belief-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Photos/riz-restaurant.jpg" alt="Rizwan Mahmood" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- FIT / NOT FIT ---------- */}
      <section className="v2-sec v2-sec--off">
        <div className="v2-w v2-fit-grid">
          <div>
            <Reveal>
              <div className="v2-head">
                <span className="v2-label">Who this is for</span>
                <h2 className="v2-h2">
                  This works best
                  <br />
                  <span className="oh">for four kinds of people.</span>
                </h2>
              </div>
            </Reveal>
            <ul className="v2-fitlist">
              {FIT.map((f) => (
                <Reveal as="li" key={f.n}>
                  <span className="v2-fit-n">{f.n}</span>
                  <span>
                    <b>{f.title}</b>
                    <span>{f.body}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal>
            <div className="v2-notfor">
              <h3>Not for you if</h3>
              <ul>
                {NOT_FIT.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <p>
                <b>I&apos;ll say so on the first call.</b> Part of the job is being honest about
                what won&apos;t work, not saying yes to keep the call going.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- THREE WAYS TO WORK ---------- */}
      <section className="v2-sec v2-sec--white" id="work">
        <div className="v2-w">
          <Reveal>
            <div className="v2-head">
              <span className="v2-label">What you can book</span>
              <h2 className="v2-h2">
                Three ways
                <br />
                <span className="oh">to work with me.</span>
              </h2>
              <p className="v2-sub">
                Same order every time: get clear on the actual problem, design the system, then
                let the machine run it. Prices are published so you can budget without booking a
                call to find out.
              </p>
              <div className="v2-how">
                {HOW.map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="v2-wwm-grid">
            {ROUTES.map((r) => (
              <Reveal key={r.n}>
                <div className={`v2-wwm${r.featured ? " is-feat" : ""}`}>
                  {r.badge && <span className="v2-wwm-badge">{r.badge}</span>}
                  <div className="v2-wwm-num">{r.n}</div>
                  <div className="v2-wwm-t">{r.title}</div>
                  <p className="v2-wwm-d">{r.desc}</p>
                  <div className="v2-wwm-meta">
                    {r.meta.map(([k, v]) => (
                      <div key={k}>
                        <b>{k}</b>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="v2-wwm-price">
                    {r.price} <span>{r.priceNote}</span>
                  </div>
                  <div className="v2-wwm-links">
                    {r.links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        {...("external" in l && l.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className={`v2-wwm-link${l.accent ? "" : " v2-wwm-link--muted"}`}
                      >
                        {l.label} <span className="v2-arr">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Nav repeats a hard guarantee here: "if your people don't walk
              away with something real, you don't pay." That is a commercial
              promise, not a design pattern, so it isn't mine to write. This
              is the closest thing Riz has already said in public — it does
              the same de-risking job and it's true. Swap it for a real
              guarantee if you want to make one. */}
          <Reveal>
            <div className="v2-guar">
              If it won&apos;t work, I&apos;ll tell you{" "}
              <span>before you spend anything</span> — not after.
            </div>
          </Reveal>

          <Reveal>
            <div className="v2-wwm-cta">
              <CalBookingButton className="v2-btn-o">
                Check my availability <span className="v2-arr">→</span>
              </CalBookingButton>
              <p className="v2-wwm-alt">
                Not sure which one? <a href="#book">Describe the problem instead →</a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- PROOF: CASE STUDIES (Riz's, kept) ---------- */}
      <FeaturedCaseStudies />

      {/* ---------- PERSONALITY (Riz's, kept) ---------- */}
      <section className="v2-sec v2-sec--off2">
        <div className="v2-w" style={{ marginBottom: 40 }}>
          <Reveal>
            <div className="v2-head">
              <span className="v2-label">The human behind it</span>
              <h2 className="v2-h2">
                Where systems
                <br />
                <span className="oh">meet personality.</span>
              </h2>
              <p className="v2-sub">
                I don&apos;t just build the machines. I talk about them too — stand-up,
                breakdowns, the podcast. There&apos;s a person behind the automations.
              </p>
            </div>
          </Reveal>
        </div>
        <PersonalityCarousel />
      </section>

      {/* ---------- TESTIMONIALS (Riz's, kept) ---------- */}
      <TestimonialsSection
        heading={
          <>
            Don&apos;t take <span style={{ color: "var(--coral)", fontStyle: "italic" }}>my word</span> for it.
          </>
        }
      />

      {/* ---------- WRITING ---------- */}
      <section className="v2-sec v2-sec--white v2-writing">
        <div className="v2-w">
          <Reveal>
            <div className="v2-head">
              <span className="v2-label">Notes from the work</span>
              <h2 className="v2-h2">
                I think <span className="oh">out loud.</span>
              </h2>
              <p className="v2-sub">
                Automation, operations, and using AI without losing the plot. New stuff most
                weeks.
              </p>
            </div>
          </Reveal>

          <div className="v2-writing-list">
            {posts.slice(0, 3).map((post, i) => (
              <Reveal key={post.link}>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v2-wrow"
                >
                  <span className="v2-wrow-i">{String(i + 1).padStart(2, "0")}</span>
                  <span className="v2-wrow-meta">
                    <span className="v2-wrow-date">{formatRowDate(post.pubDate)}</span>
                    {post.categories[0] && (
                      <span className="v2-wrow-chip">{post.categories[0]}</span>
                    )}
                  </span>
                  <span className="v2-wrow-body">
                    <span className="v2-wrow-title">{post.title}</span>
                    <span className="v2-wrow-ex">{post.excerpt}</span>
                  </span>
                  <span className="v2-wrow-cta">Read →</span>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div style={{ marginTop: 40, textAlign: "center" }}>
              <Link href="/blog" className="v2-btn-g">
                Read everything <span className="v2-arr">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <V2Faq />

      {/* ---------- BOOKING ---------- */}
      <V2Booking />

      {/* ---------- STICKY MOBILE CTA ---------- */}
      <div className={`v2-sticky${stickyOn ? " is-in" : ""}`}>
        <a href="#book">Book a call →</a>
      </div>
    </div>
  );
}
