"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CalBookingButton from "@/components/CalModal";

/**
 * Nav bar in the Build With Nav mould: sticky, always visible, blurred, with
 * the booking CTA living permanently in the top right as a coral pill.
 *
 * Deliberately different from components/Navbar.tsx — which still serves every
 * other route — and which hides itself on scroll-down. That is a nice reading experience and a bad conversion one —
 * the single highest-intent control on the page spends most of the session
 * off-screen. Nav never lets it leave.
 */

const LINKS = [
  { label: "Work with me", href: "#work" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Guides", href: "/guides" },
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/about" },
];

export default function V2Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`v2-nav${scrolled ? " is-scrolled" : ""}`}>
      <Link href="/" className="v2-logo">
        <span className="v2-logo-dot" />
        <span className="v2-logo-word">Riz</span>
      </Link>

      <button
        className={`v2-burger${open ? " is-open" : ""}`}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`v2-mobile-nav${open ? " is-open" : ""}`}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#book" className="v2-ncta" onClick={() => setOpen(false)}>
          Book a call
        </a>
      </div>

      <div className="v2-nl">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <CalBookingButton className="v2-ncta">Book a call</CalBookingButton>
      </div>
    </nav>
  );
}
