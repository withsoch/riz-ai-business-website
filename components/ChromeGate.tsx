"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Suppresses shared page chrome on routes that ship their own.
 *
 * Only the homepage does. It renders components/v2/V2Nav.tsx — a sticky,
 * always-visible bar with a permanent booking CTA — and would otherwise stack
 * it under components/Navbar.tsx, which still serves every other route and
 * hides itself on scroll-down. The shared Footer is left alone: the homepage
 * wants it.
 *
 * Note `exact` rather than a prefix match. "/" as a prefix matches every path
 * on the site, which would strip the nav from the whole thing.
 *
 * Root layouts are server components and can't read the pathname, so the
 * check has to happen in a client boundary like this one.
 */
const SELF_CHROMED: Record<"nav" | "footer", { exact: string[]; prefix: string[] }> = {
  nav: { exact: ["/"], prefix: [] },
  footer: { exact: [], prefix: [] },
};

export default function ChromeGate({
  slot,
  children,
}: {
  slot: "nav" | "footer";
  children: ReactNode;
}) {
  const pathname = usePathname();
  const rules = SELF_CHROMED[slot];
  const owned =
    rules.exact.includes(pathname) ||
    rules.prefix.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (owned) return null;
  return <>{children}</>;
}
