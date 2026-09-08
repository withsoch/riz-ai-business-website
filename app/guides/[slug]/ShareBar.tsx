"use client";
import { useState } from "react";
import { CheckIcon, CopyIcon, LinkedInIcon, XIcon } from "../icons";

function currentUrl(): string {
  return typeof window !== "undefined" ? window.location.href : "";
}

export default function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(currentUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable - silently ignore
    }
  }

  function handleLinkedIn() {
    const url = encodeURIComponent(currentUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
  }

  function handleX() {
    const url = encodeURIComponent(currentUrl());
    const text = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="gd-share">
      <button type="button" className="gd-share-btn" onClick={handleLinkedIn} aria-label="Share on LinkedIn">
        <LinkedInIcon />
      </button>
      <button type="button" className="gd-share-btn" onClick={handleX} aria-label="Share on X">
        <XIcon />
      </button>
      <button type="button" className="gd-share-btn" onClick={handleCopy} aria-label="Copy link">
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}
