"use client";
import { useEffect, useRef } from "react";

/**
 * Drifts an element's transform with scroll position at `factor` speed.
 * Lazily attaches the scroll listener only while the element is near the
 * viewport, and no-ops entirely under prefers-reduced-motion.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(factor: number) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let listening = false;

    function apply() {
      raf = 0;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerDelta = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-centerDelta * factor).toFixed(2)}px, 0)`;
    }

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !listening) {
          listening = true;
          window.addEventListener("scroll", onScroll, { passive: true });
          apply();
        } else if (!entry.isIntersecting && listening) {
          listening = false;
          window.removeEventListener("scroll", onScroll);
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [factor]);

  return ref;
}

/**
 * Ref for hero content that previously faded/lifted on scroll. The fade
 * washed out hero sections (cream background, coral accents, photo) almost
 * as soon as the user started scrolling, so the effect has been removed —
 * hero content now keeps full opacity and position for the whole page.
 * `distance` is kept in the signature so call sites don't need to change.
 */
export function useScrollFadeOut<T extends HTMLElement = HTMLDivElement>(_distance = 400) {
  const ref = useRef<T>(null);
  return ref;
}
