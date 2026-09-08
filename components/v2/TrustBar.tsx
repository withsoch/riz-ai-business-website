"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Build With Nav's four-up trust bar, sitting directly under the hero and
 * counting up on first sight.
 *
 * The numbers are Riz's own — they already existed on the live homepage, but
 * as row six of a filterable "By the numbers" table roughly three screens
 * down. Nav's version earns more because it runs before the visitor has
 * decided whether to keep scrolling.
 *
 * `prefix`/`suffix` stay static; only `value` animates, so "$3.9M+" counts
 * the 3.9 and leaves the currency and the plus alone.
 */

type Stat = {
  prefix?: string;
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
};

const STATS: Stat[] = [
  { prefix: "$", value: 3.9, decimals: 1, suffix: "M", label: "Courier costs saved · Bolt" },
  { value: 92, suffix: "%", label: "Straight-through processing · Wise" },
  { value: 20, suffix: "s", label: "Dispatch time, was 3 min · Careem" },
  { value: 10, suffix: "+ yrs", label: "Inside high-growth operations" },
];

const DURATION = 900;

export default function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (reduced) {
          setProgress(1);
          return;
        }
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          // power2.out, the same easing Nav's counters use
          setProgress(1 - Math.pow(1 - t, 2));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="v2-trust">
      <div className="v2-trust-in" ref={ref}>
        {STATS.map((s) => (
          <div className="v2-ts" key={s.label}>
            <span className="v2-tn">
              {s.prefix}
              {(s.value * progress).toFixed(s.decimals ?? 0)}
              <span className="accent">{s.suffix}</span>
            </span>
            <span className="v2-tl">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
