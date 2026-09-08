"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/v2/Reveal";

/**
 * Build With Nav's accordion.
 *
 * These eight answers, pricing included, previously lived in
 * components/faq-section.tsx — a component imported by no page, invisible to
 * every visitor the site ever had. This is where they finally render, so that
 * file has been deleted rather than left as a second copy of the same copy
 * waiting to drift out of sync with this one.
 *
 * If the pricing changes, it changes here. See also README.md → Booking.
 */

const ITEMS = [
  {
    q: "How is this different from just using ChatGPT ourselves?",
    a: "Nothing stops you from opening ChatGPT tomorrow. But AI doesn't think for you — it thinks like you, just faster. Feed it a messy process and you get messy output at scale, not less mess. Most of what I do happens before any tool gets touched: getting the actual process clear enough that automating it doesn't just automate the chaos.",
  },
  {
    q: "What if our process isn't “automation-ready” yet?",
    a: "Then we're not automating yet — we're fixing that first. This is the most common reason automation projects fail, and it's usually not a tool problem. Step one is always: get clear on what's actually happening today, on paper, before anything gets built.",
  },
  {
    q: "What does this actually cost?",
    a: "Advisory starts at $140/hr, no retainer required. A single 1:1 strategy session is a flat $140. Full custom builds go through Soch and get scoped per project, since “build me an automation” can mean a two-week fix or a much bigger system — you'll get a real number before anything starts, not a guess.",
  },
  {
    q: "How long does a build actually take?",
    a: "Depends on the system, but the case studies on this site run from about two weeks for a focused build. You'll know the real timeline after we've mapped the actual workflow — not before.",
  },
  {
    q: "Do we need a technical team already in place?",
    a: "No. Most of the people I work with don't have one. The systems are built to be handed over with documentation and training, not left as something only an engineer can touch.",
  },
  {
    q: "What happens after it's built — are we locked into you?",
    a: "No lock-in, by design. You get the documentation, the training, and you own the system outright. If something breaks in year two, you shouldn't need me to fix it.",
  },
  {
    q: "What if it just doesn't work for our specific situation?",
    a: "Then I'll tell you that before you spend anything — not after. Part of the job is being honest about what won't work, not just saying yes to keep the call going.",
  },
  {
    q: "What's the difference between working with you directly vs. Soch?",
    a: "Working with me directly is advisory — thinking, strategy, coaching, workshops. Soch is where the heavy build work actually happens — the end-to-end automation systems get delivered there, not here.",
  },
];

function Row({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Measured on click rather than read during render: on the first paint the
  // ref is still null, and a hard-coded fallback height either clips long
  // answers or leaves dead space under short ones.
  const toggle = () => {
    const el = bodyRef.current;
    if (el) el.style.maxHeight = open ? "0px" : `${el.scrollHeight}px`;
    setOpen((v) => !v);
  };

  return (
    <div className={`v2-qa${open ? " is-open" : ""}`}>
      <button type="button" onClick={toggle} aria-expanded={open}>
        <span>{q}</span>
        <span className="v2-qa-icon" aria-hidden="true">
          +
        </span>
      </button>
      <div className="v2-qa-a" ref={bodyRef} role="region">
        <p>{a}</p>
      </div>
    </div>
  );
}

export default function V2Faq() {
  return (
    <section className="v2-sec v2-sec--off2" id="faq">
      <div className="v2-faq-in">
        <Reveal>
          <div className="v2-head v2-head--center">
            <span className="v2-label v2-label--center">Before you book</span>
            <h2 className="v2-h2">
              The things people ask <span className="oh">before they book.</span>
            </h2>
          </div>
        </Reveal>
        <div className="v2-qa-list">
          {ITEMS.map((item) => (
            <Row key={item.q} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
