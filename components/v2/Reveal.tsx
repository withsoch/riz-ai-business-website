"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

/**
 * CSS re-implementation of Build With Nav's scroll choreography.
 *
 * Nav drives it with GSAP + ScrollTrigger + SplitText + Lenis (four CDN
 * libraries, and a fonts gate that hides <body> until they load). The same
 * three moves — rise, stagger, and headline lines climbing out of a mask —
 * are cheap enough in CSS that none of that is worth the weight or the
 * white-screen risk. IntersectionObserver just flips `.is-in`; v2.css owns
 * the motion, including the reduced-motion opt-out.
 */

type RevealVariant = "rise" | "stagger" | "mask";

export default function Reveal({
  children,
  variant = "rise",
  as: Tag = "div",
  className = "",
  threshold = 0.15,
  rootMargin = "0px 0px -8% 0px",
}: {
  children: ReactNode;
  variant?: RevealVariant;
  as?: ElementType;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No reduced-motion branch needed: v2.css already forces the settled
    // state under prefers-reduced-motion, so observing is harmless there.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSeen(true);
        io.unobserve(el);
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  const base = variant === "mask" ? "v2-mask" : variant === "stagger" ? "v2-stagger" : "v2-rise";

  return (
    <Tag ref={ref} className={`${base}${seen ? " is-in" : ""}${className ? ` ${className}` : ""}`}>
      {children}
    </Tag>
  );
}
