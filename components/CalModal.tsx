"use client";

import { useEffect, useId } from "react";
import { getCalApi } from "@calcom/embed-react";
import { playPopSound } from "@/lib/sounds";

const CAL_LINK = "https://cal.com/consult-with-riz/consultingcall";
const CAL_NAMESPACE = "consultingcall";

export default function CalBookingButton({
  children,
  className,
  style,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  // Each button instance gets its own Cal namespace so Cal's internal
  // per-namespace state (and any DOM it injects) can never be confused
  // across the multiple "Book a call" triggers rendered on a page.
  const instanceId = useId();
  const namespace = `${CAL_NAMESPACE}${instanceId.replace(/[:]/g, "-")}`;

  useEffect(() => {
    let cancelled = false;

    (async function initCal() {
      try {
        const cal = await getCalApi({ namespace });
        if (cancelled) return;
        cal("ui", {
          theme: "auto",
          styles: { branding: { brandColor: "#000000" } },
        });
      } catch {
        // If the embed script fails to load, the plain <a> href still works.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Every "Book a call" trigger on the site renders through this component,
    // so the click sound only needs to live here.
    playPopSound();

    // Stop the native anchor from navigating/opening a new tab on its own.
    // Cal's embed script uses a delegated click listener (not the anchor's
    // default action) to open the popup, so preventDefault() here doesn't
    // interfere with it — only the native href navigation is suppressed.
    e.preventDefault();

    onClick?.();

    // Timeout-based fallback: if the popup never signals readiness,
    // clear any stuck overlay and fall back to opening a new tab.
    //
    // IMPORTANT: this selector must never be able to match one of our own
    // trigger <a> elements (they all carry data-cal-namespace too — that's
    // ours, not Cal's). It previously included "[data-cal-namespace]",
    // which could match — and then .remove() — a live "Book a call" button
    // elsewhere on the page (e.g. the Navbar's, which never unmounts across
    // client-side navigation) instead of Cal's actual popup overlay. Only
    // target Cal's real injected containers, and explicitly exclude anchors
    // as a safety net.
    const timer = setTimeout(() => {
      const overlay = document.querySelector(
        ".cal-embed:not(a), #cal-embed-container:not(a)"
      );
      if (overlay && !document.querySelector("[data-cal-link] iframe")) {
        overlay.remove();
      }
      window.open(CAL_LINK, "_blank", "noopener,noreferrer");
    }, 4500);

    getCalApi({ namespace })
      .then((cal) => {
        cal("on", {
          action: "linkReady",
          callback: () => clearTimeout(timer),
        });
      })
      .catch(() => {
        clearTimeout(timer);
      });
  };

  return (
    <a
      href={CAL_LINK}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      data-cal-link={CAL_LINK.replace("https://cal.com/", "")}
      data-cal-namespace={namespace}
      data-cal-config={JSON.stringify({ layout: "month_view" })}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
