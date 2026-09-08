"use client";
import { useEffect, useRef } from "react";

export default function ScrollProgressBar() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    function apply() {
      raf = 0;
      const el = fillRef.current;
      if (!el) return;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
      el.style.transform = `scaleX(${progress})`;
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    apply();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 60,
        pointerEvents: "none",
      }}
    >
      <div
        ref={fillRef}
        style={{
          height: "100%",
          width: "100%",
          background: "var(--coral)",
          transform: "scaleX(0)",
          transformOrigin: "left",
          willChange: "transform",
        }}
      />
    </div>
  );
}
