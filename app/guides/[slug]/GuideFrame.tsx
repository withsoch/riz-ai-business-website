"use client";
import { useEffect, useRef, useState } from "react";

export default function GuideFrame({ src, title }: { src: string; title: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let resizeObserver: ResizeObserver | null = null;

    function measure() {
      const doc = iframe?.contentDocument;
      if (!doc?.documentElement) return;
      const h = Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0);
      if (h > 0) setHeight(h);
    }

    function handleLoad() {
      measure();
      const doc = iframe?.contentDocument;
      if (doc?.body && "ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(() => measure());
        resizeObserver.observe(doc.body);
      }
    }

    iframe.addEventListener("load", handleLoad);
    return () => {
      iframe.removeEventListener("load", handleLoad);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      scrolling="no"
      style={{ height, overflow: "hidden" }}
    />
  );
}
