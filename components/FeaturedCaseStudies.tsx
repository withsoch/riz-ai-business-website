"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Home, Megaphone, Cpu, Truck, Scale, Stethoscope, ShoppingCart, Users } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";

/* ─── data - 4 selected from the full case studies list ──────────────────── */

const FEATURED_CASES = [
  {
    id: "cs-01",
    tag: "REAL ESTATE · SALES",
    icon: Home,
    title: "AI Lead Qualification & Agent Routing",
    result: "8 min first contact · was 24-48 hrs",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
    hero: { number: "34%", label: "lead-to-appointment rate / was 18%" },
    details: {
      before: [
        "40 leads/week, called in arrival order",
        "24-48 hr average first contact",
        "18% lead-to-appointment rate",
        "No prioritisation",
      ],
      after: [
        "High-intent leads contacted in 8 min",
        "Automated nurture for unqualified leads",
        "34% lead-to-appointment rate",
        "Agents working only qualified leads",
      ],
      outcomes: [
        { number: "8 min", label: "lead to first contact / was 24-48 hrs" },
        { number: "34%", label: "lead-to-appointment / was 18%" },
        { number: "22 hrs", label: "per week recovered" },
      ],
      stack: ["n8n", "Claude API", "GoHighLevel", "Twilio", "Gmail"],
      delivered: "2 weeks",
    },
  },
  {
    id: "cs-09",
    tag: "MARKETING AGENCY · OPERATIONS",
    icon: Megaphone,
    title: "Automated Monthly Client Reporting",
    result: "Delivered 1st of every month",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80",
    hero: { number: "89%", label: "reduction in reporting time" },
    details: {
      before: [
        "3 days per client per month on reporting",
        "12 clients = 36 analyst-days monthly",
        "Reports consistently late",
        "Formulaic commentary",
      ],
      after: [
        "4 hrs per client per month",
        "Delivered 1st of every month",
        "Claude-written commentary",
        "Analyst doing strategy work",
      ],
      outcomes: [
        { number: "89%", label: "reduction in reporting time" },
        { number: "1st", label: "of every month without fail" },
        { number: "12 hrs", label: "analyst time freed per week" },
      ],
      stack: ["n8n", "Claude API", "Google Ads API", "Meta API", "PDFShift", "Gmail"],
      delivered: "3 weeks",
    },
  },
  {
    id: "cs-05",
    tag: "B2B SAAS · SALES",
    icon: Cpu,
    title: "Trial-to-Paid Conversion Workflow",
    result: "High-intent users contacted in <4 hrs · was 3-4 days",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
    hero: { number: "2.1×", label: "trial-to-paid conversion / 9% → 19%" },
    details: {
      before: [
        "9% trial-to-paid conversion",
        "Sales chasing 200 trials equally",
        "3-4 day follow-up lag",
        "No behavioural signals in CRM",
      ],
      after: [
        "19% trial-to-paid conversion",
        "Sales focused on top 20% only",
        "<4 hr contact for high-intent users",
        "Weekly behavioural scoring",
      ],
      outcomes: [
        { number: "2.1×", label: "trial-to-paid conversion / 9% → 19%" },
        { number: "<4 hrs", label: "response to high-intent" },
        { number: "28 hrs", label: "per week saved" },
      ],
      stack: ["n8n", "Clay", "Claude API", "HubSpot", "Slack"],
      delivered: "3 weeks",
    },
  },
  {
    id: "cs-19",
    tag: "LOGISTICS · OPERATIONS",
    icon: Truck,
    title: "Proactive Shipment Delay Communication",
    result: "100% delays communicated proactively",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
    hero: { number: "82%", label: "fewer WISMO tickets / 340+ → <60" },
    details: {
      before: [
        "340+ WISMO tickets per month",
        "1.5 support roles on WISMO full-time",
        "Reactive, customers contacting first",
        "No branded delay communication",
      ],
      after: [
        "<60 WISMO tickets per month",
        "1.5 roles redeployed to value work",
        "100% of delays communicated proactively",
        "Client-branded delay communications",
      ],
      outcomes: [
        { number: "82%", label: "fewer WISMO tickets / 340+ → <60" },
        { number: "100%", label: "delays communicated proactively" },
        { number: "1.5 roles", label: "redeployed to value work" },
      ],
      stack: ["n8n", "Claude API", "ShipStation", "Shopify", "Gmail", "Slack"],
      delivered: "2 weeks",
    },
  },
  {
    id: "cs-02",
    tag: "LAW FIRM · OPERATIONS",
    icon: Scale,
    title: "Client Intake Automation & Case Routing",
    result: "12 min response · was 24-48 hrs",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80",
    hero: { number: "12 min", label: "average first response / was 24-48 hrs" },
    details: {
      before: [
        "3 hrs/day paralegal time on intake",
        "24-48 hr response to inquiries",
        "1 in 5 urgent matters missed same-day",
        "Manual routing errors",
      ],
      after: [
        "<12 min average first response",
        "100% urgent matters flagged same-day",
        "0 hrs/day paralegal triage time",
        "97% correct practice area routing",
      ],
      outcomes: [
        { number: "12 min", label: "average first response / was 24-48 hrs" },
        { number: "3 hrs", label: "per day recovered" },
        { number: "100%", label: "urgent matters flagged same-day" },
      ],
      stack: ["n8n", "Claude API", "Clio", "Calendly", "Gmail", "Slack"],
      delivered: "2 weeks",
    },
  },
  {
    id: "cs-03",
    tag: "HEALTHCARE · OPERATIONS",
    icon: Stethoscope,
    title: "Appointment Reminder & Slot Recovery",
    result: "50% fewer no-shows · 73% slots refilled",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
    hero: { number: "50%", label: "reduction in no-shows / 18% → 9%" },
    details: {
      before: [
        "18% no-show rate (32 appts/week lost)",
        "2.5 hrs/day manual reminder calls",
        "Cancelled slots left empty",
        "No confirmation tracking",
      ],
      after: [
        "9% no-show rate",
        "0 hrs/day manual reminders",
        "73% cancelled slots filled same day",
        "Confirmation tracked automatically",
      ],
      outcomes: [
        { number: "50%", label: "reduction in no-shows / 18% → 9%" },
        { number: "2.5 hrs", label: "per day recovered" },
        { number: "73%", label: "cancelled slots refilled same day" },
      ],
      stack: ["n8n", "Twilio", "Google Calendar", "Gmail"],
      delivered: "1 week",
    },
  },
  {
    id: "cs-04",
    tag: "E-COMMERCE · SUPPORT",
    icon: ShoppingCart,
    title: "AI Support Triage & Auto-Resolution",
    result: "67% auto-resolved · 18 min response",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
    hero: { number: "67%", label: "tickets auto-resolved" },
    details: {
      before: [
        "120+ tickets/week, 100% manual",
        "4-6 hr average first response",
        "2 agents on routine queries only",
        "No prioritisation",
      ],
      after: [
        "67% tickets auto-resolved",
        "<18 min average first response",
        "Agents on complex tickets only",
        "Routine queries resolved before agents start",
      ],
      outcomes: [
        { number: "67%", label: "tickets auto-resolved" },
        { number: "18 min", label: "average first response / was 4-6 hrs" },
        { number: "24 hrs", label: "per week recovered" },
      ],
      stack: ["n8n", "Claude API", "Shopify", "Gmail", "Zendesk"],
      delivered: "2 weeks",
    },
  },
  {
    id: "cs-06",
    tag: "RECRUITMENT · HR",
    icon: Users,
    title: "CV Screening & Candidate Ranking",
    result: "Same-day shortlist · 75% less time",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80",
    hero: { number: "75%", label: "less recruiter screening time" },
    details: {
      before: [
        "80 applications per role average",
        "4-5 days to produce shortlist",
        "60% of week on screening",
        "Inconsistent scoring",
      ],
      after: [
        "Same-day shortlist every role",
        "15% of week on screening",
        "Consistent 8-criteria scoring",
        "Top candidates invited same day",
      ],
      outcomes: [
        { number: "Same day", label: "shortlist every time / was 4-5 days" },
        { number: "75%", label: "less recruiter screening time" },
        { number: "0", label: "qualified CVs missed" },
      ],
      stack: ["n8n", "Claude API", "Airtable", "Gmail"],
      delivered: "1 week",
    },
  },
];

/* ─── component ─────────────────────────────────────────────────────────── */

export default function FeaturedCaseStudies() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [panelCase, setPanelCase] = useState(FEATURED_CASES[0]);

  function toggleCard(row: (typeof FEATURED_CASES)[number]) {
    if (openId === row.id) {
      setOpenId(null);
      return;
    }
    setPanelCase(row);
    setOpenId(row.id);
  }

  return (
    <section
      style={{
        background: "var(--paper)",
        backgroundImage:
          "radial-gradient(circle, rgba(30,36,31,0.05) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        boxShadow: "inset 0 1px 0 rgba(30,36,31,0.06)",
        borderTop: "1px solid var(--line)",
      }}
      className="section-pad"
    >
      <style>{`
        .fcs-header-divider {
          height: 1px;
          background: linear-gradient(90deg, #EA6A47, var(--line) 60%);
          margin: 28px 0 44px;
        }

        .fcs-grid {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .fcs-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          align-items: stretch;
          gap: 20px;
        }

        .fcs-card-wrap {
          height: 100%;
          display: flex;
        }

        .fcs-card {
          position: relative;
          background: #ffffff;
          border: 1.5px solid var(--line);
          border-radius: 16px;
          padding: 22px 22px 20px;
          width: 100%;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(34,51,44,0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .fcs-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(34,51,44,0.16);
          border-color: #EA6A47;
        }
        .fcs-card.active {
          border-color: #EA6A47;
          box-shadow: 0 12px 32px rgba(234,106,71,0.14);
        }

        .fcs-card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .fcs-card-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(234,106,71,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.25s ease;
        }
        .fcs-card:hover .fcs-card-icon,
        .fcs-card.active .fcs-card-icon {
          background: #EA6A47;
        }
        .fcs-card:hover .fcs-card-icon svg,
        .fcs-card.active .fcs-card-icon svg {
          stroke: #ffffff;
        }
        .fcs-card-tag {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 0.875rem;
          font-weight: 600;
          color: #E8603C;
          letter-spacing: 0.05em;
          line-height: 1.35;
          text-transform: uppercase;
        }

        .fcs-card-stat {
          font-size: 34px;
          font-weight: 900;
          line-height: 1;
          color: var(--coral);
        }
        .fcs-card-stat-desc {
          font-size: 14px;
          color: rgba(34,51,44,0.72);
          line-height: 1.45;
          margin: 5px 0 0;
        }
        .fcs-card-divider {
          width: 24px;
          height: 2px;
          background: #EA6A47;
          border-radius: 2px;
          margin: 16px 0 14px;
        }
        .fcs-card-title {
          font-family: var(--font-fraunces), serif;
          font-size: 16px;
          font-weight: 800;
          color: #22332C;
          line-height: 1.3;
          margin: 0 0 6px;
        }
        .fcs-card-result {
          font-size: 16px;
          color: rgba(34,51,44,0.72);
          line-height: 1.45;
          margin: 0;
          flex: 1;
        }
        .fcs-card-bottom {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-top: auto;
          padding-top: 10px;
        }
        .fcs-card-chevron {
          display: inline-flex;
          color: #5E594E;
          transition: color 0.2s ease-out, transform 0.2s ease-out;
        }
        .fcs-card:hover .fcs-card-chevron {
          color: #EA6A47;
          transform: scale(1.15);
        }
        .fcs-card.active .fcs-card-chevron {
          color: #EA6A47;
          transform: rotate(180deg);
        }
        .fcs-card.active:hover .fcs-card-chevron {
          transform: rotate(180deg) scale(1.15);
        }

        .fcs-panel {
          box-sizing: border-box;
          max-height: 0;
          overflow: hidden;
          background: white;
          background-clip: padding-box;
          border: 1.5px solid transparent;
          border-radius: 20px;
          margin-top: 0;
          transition: max-height 0.4s ease, border-color 0.3s ease, margin-top 0.4s ease;
        }
        .fcs-panel.active {
          max-height: 900px;
          border-color: var(--line);
          margin-top: 28px;
        }
        .fcs-panel-inner {
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .fcs-panel.active .fcs-panel-inner {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.15s;
        }
        .fcs-panel-header {
          background: #22332C;
          padding: 20px 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 20px 20px 0 0;
        }
        .fcs-panel-header-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--cream);
          font-family: var(--font-fraunces), serif;
        }
        .fcs-panel-close {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          color: var(--cream);
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          padding: 6px 14px;
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.25s ease;
        }
        .fcs-panel-close:hover {
          background: rgba(255,255,255,0.2);
        }
        .fcs-panel-content {
          display: grid;
          grid-template-columns: 280px 1fr 1fr;
          gap: 0;
        }
        .fcs-panel-image {
          width: 280px;
          min-height: 340px;
          overflow: hidden;
          position: relative;
        }
        .fcs-panel-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.85);
          display: block;
        }
        .fcs-panel-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(234,106,71,0.3) 0%, transparent 60%);
        }
        .fcs-panel-col-ba {
          padding: 32px 28px;
          border-right: 1px solid var(--line);
        }
        .fcs-panel-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .fcs-panel-list li {
          font-size: 14px;
          color: #22332C;
          font-weight: 500;
          line-height: 1.7;
        }
        .fcs-panel-list.after li {
          color: #22332C;
          font-weight: 500;
        }
        .fcs-panel-divider {
          height: 1px;
          background: linear-gradient(90deg, #EA6A47, var(--line));
          margin: 16px 0;
        }
        .fcs-panel-col-outcomes {
          padding: 32px 28px;
        }
        .fcs-stat {
          border-left: 3px solid #EA6A47;
          padding-left: 14px;
          margin-bottom: 20px;
        }
        .fcs-stat-number {
          font-size: 26px;
          font-weight: 900;
          background: linear-gradient(90deg, #22332C, #EA6A47);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .fcs-stat-desc {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          color: #5E594E;
          letter-spacing: 0.04em;
          margin-top: 2px;
        }
        .fcs-stack-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .fcs-stack-pill {
          background: var(--cream);
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 4px 10px;
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          color: #22332C;
          font-weight: 500;
        }
        .fcs-delivered-value {
          font-size: 16px;
          font-weight: 700;
          color: #22332C;
        }

        .fcs-view-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 40px;
          background: #22332C;
          color: var(--cream);
          font-family: var(--font-inter-tight), sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 14px 30px;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.22s ease, transform 0.22s ease;
        }
        .fcs-view-all:hover {
          background: #EA6A47;
          transform: translateY(-2px) scale(1.02);
        }
        .fcs-view-all-arrow {
          display: inline-block;
          transition: transform 0.22s ease;
        }
        .fcs-view-all:hover .fcs-view-all-arrow {
          transform: translateX(4px);
        }

        @media (max-width: 1100px) {
          .fcs-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 560px) {
          .fcs-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .fcs-panel-content {
            grid-template-columns: 1fr;
          }
          .fcs-panel-image {
            width: 100%;
            min-height: 200px;
          }
          .fcs-panel-col-ba {
            border-right: none;
            border-bottom: 1px solid var(--line);
          }
        }

        @media (hover: none) {
          .fcs-card:hover {
            transform: none;
            box-shadow: 0 2px 12px rgba(34,51,44,0.06);
            border-color: var(--line);
          }
          .fcs-card.active:hover {
            border-color: #EA6A47;
          }
        }
      `}</style>

      <div className="max-w-site">
        <AnimateIn>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: "#22332C", marginBottom: 12 }}>
            Proven results across industries.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(34,51,44,0.72)", margin: 0, maxWidth: 560 }}>
            Eight systems, eight industries, real numbers behind each one.
          </p>
        </AnimateIn>
        <div className="fcs-header-divider" />

        <div className="fcs-grid">
          {[FEATURED_CASES.slice(0, 4), FEATURED_CASES.slice(4, 8)].map((rowCases, rowIdx) => {
            const rowHasOpen = rowCases.some((c) => c.id === openId);
            return (
              <div key={rowIdx}>
                <div className="fcs-row">
                  {rowCases.map((row, i) => {
                    const isActive = openId === row.id;
                    const Icon = row.icon;
                    return (
                      <AnimateIn as="div" key={row.id} delay={(rowIdx * 4 + i) * 90} className="fcs-card-wrap">
                        <div
                          className={`fcs-card${isActive ? " active" : ""}`}
                          onClick={() => toggleCard(row)}
                          role="button"
                          tabIndex={0}
                          aria-expanded={isActive}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleCard(row);
                            }
                          }}
                        >
                          <div className="fcs-card-top">
                            <span className="fcs-card-icon">
                              <Icon size={16} strokeWidth={1.8} color="#EA6A47" />
                            </span>
                            <span className="fcs-card-tag">{row.tag}</span>
                          </div>

                          <div className="fcs-card-stat">{row.hero.number}</div>
                          <p className="fcs-card-stat-desc">{row.hero.label}</p>

                          <div className="fcs-card-divider" />

                          <h3 className="fcs-card-title">{row.title}</h3>
                          <p className="fcs-card-result">{row.result}</p>

                          <div className="fcs-card-bottom">
                            <span className="fcs-card-chevron" aria-hidden="true">
                              <ChevronDown size={18} strokeWidth={2} />
                            </span>
                          </div>
                        </div>
                      </AnimateIn>
                    );
                  })}
                </div>

                <div className={`fcs-panel${rowHasOpen ? " active" : ""}`}>
                  <div className="fcs-panel-inner">
                    <div className="fcs-panel-header">
                      <span className="fcs-panel-header-title">{panelCase.title}</span>
                      <button className="fcs-panel-close" onClick={() => setOpenId(null)}>
                        ✕ CLOSE
                      </button>
                    </div>

                    <div className="fcs-panel-content">
                      <div className="fcs-panel-image">
                        <img src={panelCase.image} alt={panelCase.title} />
                        <div className="fcs-panel-image-overlay" />
                      </div>

                      <div className="fcs-panel-col-ba">
                        <p className="meta-label" style={{ marginBottom: 12 }}>BEFORE</p>
                        <ul className="fcs-panel-list">
                          {panelCase.details.before.map((item, idx) => (
                            <li key={idx}>
                              <span style={{ color: "rgba(34,51,44,0.72)" }}>→ </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="fcs-panel-divider" />
                        <p className="meta-label after" style={{ marginBottom: 12 }}>AFTER</p>
                        <ul className="fcs-panel-list after">
                          {panelCase.details.after.map((item, idx) => (
                            <li key={idx}>
                              <span style={{ color: "#EA6A47" }}>→ </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="fcs-panel-col-outcomes">
                        <p className="meta-label" style={{ marginBottom: 20 }}>OUTCOMES</p>
                        {panelCase.details.outcomes.map((stat, idx) => (
                          <div className="fcs-stat" key={idx}>
                            <div className="fcs-stat-number">{stat.number}</div>
                            <div className="fcs-stat-desc">{stat.label}</div>
                          </div>
                        ))}

                        <p className="meta-label" style={{ marginTop: 24, marginBottom: 10 }}>
                          STACK
                        </p>
                        <div className="fcs-stack-pills">
                          {panelCase.details.stack.map((tech, idx) => (
                            <span className="fcs-stack-pill" key={idx}>
                              {tech}
                            </span>
                          ))}
                        </div>

                        <p className="meta-label" style={{ marginTop: 16, marginBottom: 6 }}>
                          DELIVERED IN
                        </p>
                        <div className="fcs-delivered-value">{panelCase.details.delivered}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Link href="/case-studies" className="fcs-view-all">
          View All Case Studies
          <span className="fcs-view-all-arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
