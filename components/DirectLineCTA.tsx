"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CalBookingButton from "@/components/CalModal";

type DirectLineCTAProps = {
  heading?: React.ReactNode;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  secondaryExternal?: boolean;
};

const AI_PROMPT =
  "I'm about to talk with Rizwan Mahmood, an operator and AI builder who's worked at Careem, Bolt, and Wise, and now runs the AI studio Soch. Help me think through what to ask him and where he might genuinely be useful.";

const ENCODED_AI_PROMPT = encodeURIComponent(AI_PROMPT);

function ChatGPTIcon() {
  return (
    <svg viewBox="0 0 24 24" width={26} height={26} fill="#0D0D0D" aria-hidden="true">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 5.7332A4.485 4.485 0 0 1 4.7213 3.7823v5.6772a.7664.7664 0 0 0 .3879.6765l5.8428 3.3685-2.02 1.1685a.0757.0757 0 0 1-.071 0l-4.8455-2.7935A4.504 4.504 0 0 1 2.35 5.7332zm16.5963 3.8558L13.0932 6.2151l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8404 2.7935a4.4992 4.4992 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 6.8449V4.5125a.0662.0662 0 0 1 .0284-.0615l4.8404-2.7899a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0623a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4599a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997z" />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={26} height={26} fill="none" aria-hidden="true">
      <g stroke="#D97757" strokeWidth={2.2} strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="8" />
        <line x1="12" y1="16" x2="12" y2="22" />
        <line x1="2" y1="12" x2="8" y2="12" />
        <line x1="16" y1="12" x2="22" y2="12" />
        <line x1="4.9" y1="4.9" x2="9.2" y2="9.2" />
        <line x1="14.8" y1="14.8" x2="19.1" y2="19.1" />
        <line x1="19.1" y1="4.9" x2="14.8" y2="9.2" />
        <line x1="9.2" y1="14.8" x2="4.9" y2="19.1" />
      </g>
    </svg>
  );
}

function PerplexityIcon() {
  return (
    <svg viewBox="0 0 24 24" width={26} height={26} fill="#1F1F1F" aria-hidden="true">
      <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.0765 0v7.0896H1.6026v10.3976h2.4739v6.3542l6.7591-6.4471v6.4471h1.1554v-6.5372l6.6521 6.5372v-6.4471h2.4739V7.0896zM13.7331 2.6199v4.4697l-3.4763 3.0011V5.9497l3.4763-3.3298zm-8.4212.0177L8.7 5.9603v4.1354L5.3119 7.1618V2.6376zM2.7579 8.2449h1.9989v6.5518l-1.9989-1.7212V8.2449zm1.1958 8.3218l3.7592 3.2371v2.6903l-3.7592-3.5772v-2.3502zm4.9146 4.1697v-5.6524l-3.7395-3.2202V9.5807l4.895 4.2255v6.9302zm1.1554-6.9433l4.895-4.2223v3.4693l-3.7592 3.2192v5.6533l-1.1358.923v-6.9425zm8.6541 2.6905l-3.7592 3.5772v-2.6906l3.7592-3.2367v2.3501zM21.2421 13.078l-1.9989 1.7212V8.2449h1.9989v4.8331z" />
    </svg>
  );
}

const AI_OPTIONS = [
  {
    name: "ChatGPT",
    href: `https://chat.openai.com/?q=${ENCODED_AI_PROMPT}`,
    icon: <ChatGPTIcon />,
  },
  {
    name: "Claude",
    href: `https://claude.ai/new?q=${ENCODED_AI_PROMPT}`,
    icon: <ClaudeIcon />,
  },
  {
    name: "Perplexity",
    href: `https://www.perplexity.ai/search?q=${ENCODED_AI_PROMPT}`,
    icon: <PerplexityIcon />,
  },
];

export default function DirectLineCTA({
  heading = (
    <>
      Have a chat{" "}
      <span className="chat-hayat-heading-accent">with me?</span>
    </>
  ),
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  secondaryExternal = true,
}: DirectLineCTAProps) {
  const [aiPickerOpen, setAiPickerOpen] = useState(false);
  const aiWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aiPickerOpen) return;

    function handlePointerDown(e: MouseEvent) {
      if (aiWrapRef.current && !aiWrapRef.current.contains(e.target as Node)) {
        setAiPickerOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAiPickerOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [aiPickerOpen]);

  return (
    <>
      <style>{`
        .chat-hayat-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #F1EBDE 0%, rgba(232,96,60,0.08) 100%);
          border-radius: 24px;
          padding: 64px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 52px;
          align-items: center;
          box-shadow: 0 24px 64px rgba(234,106,71,0.14), 0 4px 16px rgba(34,51,44,0.06);
        }
        .chat-hayat-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(34,51,44,0.08) 1px, transparent 1px);
          background-size: 18px 18px;
          opacity: 0.5;
          pointer-events: none;
        }
        .chat-hayat-photo-col,
        .chat-hayat-card > div:last-child {
          position: relative;
          z-index: 1;
        }
        .chat-hayat-photo-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .chat-hayat-photo {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          object-fit: cover;
          object-position: top center;
          border: 4px solid #ffffff;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          display: block;
        }
        .chat-hayat-heading {
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: 40px;
          font-weight: 900;
          color: #22332C;
          line-height: 1.2;
          margin: 0 0 16px;
        }
        .chat-hayat-heading-accent {
          color: #EA6A47;
          font-style: italic;
        }
        .chat-hayat-desc {
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: 16px;
          color: rgba(34,51,44,0.72);
          line-height: 1.7;
          margin: 0 0 28px;
          max-width: 440px;
        }
        .chat-hayat-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .chat-hayat-btn-primary {
          display: inline-flex;
          align-items: center;
          background: #22332C;
          color: var(--cream);
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: 16px;
          font-weight: 600;
          padding: 14px 28px;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.25s ease;
        }
        .chat-hayat-btn-primary:hover {
          background: #EA6A47;
        }
        button.chat-hayat-btn-primary {
          border: none;
          cursor: pointer;
        }
        .chat-hayat-btn-secondary {
          display: inline-flex;
          align-items: center;
          background: #ffffff;
          color: #22332C;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: 16px;
          font-weight: 600;
          padding: 14px 28px;
          border-radius: 100px;
          border: none;
          text-decoration: none;
          transition: background 0.25s ease;
        }
        .chat-hayat-btn-secondary:hover {
          background: rgba(255,255,255,0.8);
        }
        button.chat-hayat-btn-secondary {
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        button.chat-hayat-btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(34,51,44,0.12);
        }
        .chat-hayat-ai-wrap {
          display: inline-flex;
          align-items: center;
          gap: 14px;
        }
        .chat-hayat-ai-picker {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .chat-hayat-ai-circle {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(34,51,44,0.18), 0 2px 6px rgba(34,51,44,0.1);
          text-decoration: none;
          animation: chatHayatPopIn 150ms ease-out backwards;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .chat-hayat-ai-circle:hover,
        .chat-hayat-ai-circle:focus-visible {
          transform: scale(1.1);
          box-shadow: 0 12px 26px rgba(34,51,44,0.24), 0 4px 10px rgba(34,51,44,0.14);
        }
        .chat-hayat-ai-tooltip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #22332C;
          background: #ffffff;
          padding: 4px 10px;
          border-radius: 100px;
          box-shadow: 0 4px 12px rgba(34,51,44,0.14);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease;
        }
        .chat-hayat-ai-circle:hover .chat-hayat-ai-tooltip,
        .chat-hayat-ai-circle:focus-visible .chat-hayat-ai-tooltip {
          opacity: 1;
        }
        @keyframes chatHayatPopIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .chat-hayat-credit {
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: 14px;
          color: rgba(34,51,44,0.72);
          font-style: italic;
          margin: 20px 0 0;
        }
        @media (max-width: 768px) {
          .chat-hayat-card {
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
            gap: 32px;
            padding: 40px 28px;
          }
          .chat-hayat-card::before {
            background-size: 14px 14px;
          }
          .chat-hayat-buttons {
            justify-content: center;
          }
          .chat-hayat-ai-wrap {
            flex-wrap: wrap;
            justify-content: center;
          }
          .chat-hayat-ai-picker {
            width: 100%;
            justify-content: center;
          }
          .chat-hayat-desc {
            max-width: none;
          }
        }
      `}</style>

      <div className="chat-hayat-card">
        {/* Left col - photo */}
        <div className="chat-hayat-photo-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/riz-photo-new.jpg"
            alt="Rizwan Mahmood"
            className="chat-hayat-photo"
          />
        </div>

        {/* Right col - content */}
        <div>
          <h2 className="chat-hayat-heading">{heading}</h2>

          {description && <p className="chat-hayat-desc">{description}</p>}

          <div className="chat-hayat-buttons" style={{ marginTop: description ? 0 : 8 }}>
            {primaryHref ? (
              <a href={primaryHref} className="chat-hayat-btn-primary">
                {primaryLabel}
              </a>
            ) : (
              <CalBookingButton className="chat-hayat-btn-primary">
                {primaryLabel ?? "Book a call →"}
              </CalBookingButton>
            )}

            {secondaryHref ? (
              secondaryExternal ? (
                <a
                  href={secondaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chat-hayat-btn-secondary"
                >
                  {secondaryLabel}
                </a>
              ) : (
                <Link href={secondaryHref} className="chat-hayat-btn-secondary">
                  {secondaryLabel}
                </Link>
              )
            ) : (
              <div className="chat-hayat-ai-wrap" ref={aiWrapRef}>
                <button
                  type="button"
                  className="chat-hayat-btn-secondary"
                  onClick={() => setAiPickerOpen((open) => !open)}
                  aria-expanded={aiPickerOpen}
                  aria-haspopup="menu"
                >
                  {secondaryLabel ?? "Ask an AI about Riz →"}
                </button>
                {aiPickerOpen && (
                  <div className="chat-hayat-ai-picker" role="menu">
                    {AI_OPTIONS.map((opt, i) => (
                      <a
                        key={opt.name}
                        href={opt.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chat-hayat-ai-circle"
                        style={{ animationDelay: `${i * 50}ms` }}
                        aria-label={`Ask ${opt.name} about Riz`}
                        role="menuitem"
                      >
                        {opt.icon}
                        <span className="chat-hayat-ai-tooltip">{opt.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
