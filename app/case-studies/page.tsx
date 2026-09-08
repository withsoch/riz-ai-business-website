"use client";
import { useState, useEffect, Suspense, CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";
import ScrollProgressBar from "@/components/ScrollProgressBar";

/* ─── data ──────────────────────────────────────────────────────────────────── */

const INDUSTRIES = [
  "All",
  "Real Estate",
  "Professional Services",
  "Healthcare",
  "E-commerce",
  "Technology",
  "Recruitment",
  "Financial Services",
  "Hospitality",
  "Marketing",
  "Education",
  "Logistics",
];

const STAT_CARDS = [
  { label: "SYSTEMS", number: "20", desc: "shipped across industries" },
  { label: "INDUSTRIES", number: "12", desc: "covered end to end" },
  { label: "MAX SAVING", number: "89%", desc: "time reduction achieved" },
  { label: "FASTEST", number: "1 WK", desc: "from brief to live" },
];

const CASE_IMAGES: Record<string, string> = {
  realEstate: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
  law: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80",
  healthcare: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
  ecommerce: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
  saas: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
  recruitment: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80",
  finance: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
  hospitality: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
  marketing: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80",
  education: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80",
  property: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
  accounting: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&q=80",
  coaching: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  logistics: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
};

const ACCENT_PALETTE = [
  "#C24629", // coral (brand-derived, darkened for AA contrast)
  "#B8562F", // rust
  "#5E7145", // olive / sage
  "#C2410C", // deep coral / burnt orange
  "#2E7C74", // teal
  "#8C6A1E", // muted gold
  "#B5576B", // dusty rose
  "#3E6B4F", // forest green
  "#8A4B3B", // terracotta
  "#A15A2A", // amber / ochre
];

const caseRowsBase = [
  {
    id: "cs-01",
    num: "01",
    tag: "REAL ESTATE · SALES",
    title: "AI Lead Qualification & Agent Routing",
    result: "8 min first contact · 34% conversion rate",
    industry: "Real Estate",
    imageKey: "realEstate",
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
    id: "cs-02",
    num: "02",
    tag: "LAW FIRM · OPERATIONS",
    title: "Client Intake Automation & Case Routing",
    result: "12 min response · 3 hrs/day saved",
    industry: "Professional Services",
    imageKey: "law",
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
    num: "03",
    tag: "HEALTHCARE · OPERATIONS",
    title: "Appointment Reminder & Slot Recovery",
    result: "50% fewer no-shows · 73% slots refilled",
    industry: "Healthcare",
    imageKey: "healthcare",
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
    num: "04",
    tag: "E-COMMERCE · SUPPORT",
    title: "AI Support Triage & Auto-Resolution",
    result: "67% auto-resolved · 18 min response",
    industry: "E-commerce",
    imageKey: "ecommerce",
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
    id: "cs-05",
    num: "05",
    tag: "B2B SAAS · SALES",
    title: "Trial-to-Paid Conversion Workflow",
    result: "2.1× conversion · 9% → 19%",
    industry: "Technology",
    imageKey: "saas",
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
    id: "cs-06",
    num: "06",
    tag: "RECRUITMENT · HR",
    title: "CV Screening & Candidate Ranking",
    result: "Same-day shortlist · 75% less time",
    industry: "Recruitment",
    imageKey: "recruitment",
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
  {
    id: "cs-07",
    num: "07",
    tag: "INSURANCE · SALES",
    title: "Lead Qualification & Personalised Nurture",
    result: "100% follow-up · 22% conversion",
    industry: "Financial Services",
    imageKey: "finance",
    details: {
      before: [
        "40% follow-up rate on inbound leads",
        "No nurture sequence",
        "2 hrs per quote preparation",
        "12% conversion rate",
      ],
      after: [
        "100% leads followed up in 10 min",
        "5-touch automated nurture",
        "45 min quote prep average",
        "22% conversion rate",
      ],
      outcomes: [
        { number: "100%", label: "lead follow-up rate / was 40%" },
        { number: "22%", label: "lead-to-client conversion / was 12%" },
        { number: "31 hrs", label: "per month recovered" },
      ],
      stack: ["n8n", "Claude API", "HubSpot", "Gmail", "Slack"],
      delivered: "2 weeks",
    },
  },
  {
    id: "cs-08",
    num: "08",
    tag: "HOSPITALITY · GUEST EXPERIENCE",
    title: "Reservation Upsell & Guest Feedback Loop",
    result: "14% upsell conversion · 31% feedback rate",
    industry: "Hospitality",
    imageKey: "hospitality",
    details: {
      before: [
        "No pre-visit communication",
        "0% upsell attempts",
        "Feedback ad hoc and unstructured",
        "No visibility on guest sentiment",
      ],
      after: [
        "Every guest gets personalised message",
        "14% upsell conversion",
        "31% feedback response rate",
        "Weekly sentiment summary automated",
      ],
      outcomes: [
        { number: "14%", label: "upsell conversion rate" },
        { number: "31%", label: "feedback response rate" },
        { number: "18 hrs", label: "per week admin recovered" },
      ],
      stack: ["n8n", "Twilio", "OpenTable", "Gmail", "Claude API"],
      delivered: "1 week",
    },
  },
  {
    id: "cs-09",
    num: "09",
    tag: "MARKETING AGENCY · OPERATIONS",
    title: "Automated Monthly Client Reporting",
    result: "89% time reduction · on time every month",
    industry: "Marketing",
    imageKey: "marketing",
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
    id: "cs-10",
    num: "10",
    tag: "EDUCATION · STUDENT SUCCESS",
    title: "Student Engagement & Completion",
    result: "Drop-off 42% → 28% · 5 hrs/week saved",
    industry: "Education",
    imageKey: "education",
    details: {
      before: [
        "42% student drop-off rate",
        "6 hrs/week on manual outreach",
        "No early warning system",
        "No completion recognition",
      ],
      after: [
        "28% drop-off rate",
        "1 hr/week reviewing AI drafts",
        "7-day early warning on disengagement",
        "Automated completion + upsell",
      ],
      outcomes: [
        { number: "72%", label: "course completion rate / was 58%" },
        { number: "5 hrs", label: "per week recovered" },
        { number: "−14pp", label: "drop-off improvement" },
      ],
      stack: ["n8n", "Claude API", "Teachable", "Gmail", "Airtable"],
      delivered: "2 weeks",
    },
  },
  {
    id: "cs-11",
    num: "11",
    tag: "PROPERTY MANAGEMENT · OPERATIONS",
    title: "Maintenance Request Triage & Dispatch",
    result: "<4 hr urgent dispatch · 12 hrs/week saved",
    industry: "Real Estate",
    imageKey: "property",
    details: {
      before: [
        "14 hrs/week ops manager on triage",
        "2-3 day dispatch on standard requests",
        "No audit trail",
        "No proactive tenant updates",
      ],
      after: [
        "2 hrs/week (manager reviews escalations)",
        "<4 hr urgent, same-day standard dispatch",
        "Full Airtable audit trail",
        "Automated tenant status updates",
      ],
      outcomes: [
        { number: "<4 hrs", label: "urgent dispatch / was 2-3 days" },
        { number: "12 hrs", label: "per week recovered" },
        { number: "100%", label: "requests tracked" },
      ],
      stack: ["n8n", "Claude API", "Retell AI", "Airtable", "Twilio"],
      delivered: "2 weeks",
    },
  },
  {
    id: "cs-12",
    num: "12",
    tag: "ACCOUNTING · FINANCE",
    title: "Accounts Payable Automation",
    result: "77% time reduction · same-day processing",
    industry: "Financial Services",
    imageKey: "accounting",
    details: {
      before: [
        "22 hrs/week manual AP processing",
        "3% data entry error rate",
        "5-7 day invoice-to-approval cycle",
        "Discrepancies found at payment stage",
      ],
      after: [
        "5 hrs/week (exceptions only)",
        "<0.5% error rate",
        "Same-day invoice processing",
        "100% discrepancies flagged before approval",
      ],
      outcomes: [
        { number: "77%", label: "reduction in AP time / 22 → 5 hrs" },
        { number: "<0.5%", label: "error rate / was 3%" },
        { number: "Same day", label: "invoice processing / was 5-7 days" },
      ],
      stack: ["n8n", "Claude API", "Xero API", "Gmail"],
      delivered: "3 weeks",
    },
  },
  {
    id: "cs-13",
    num: "13",
    tag: "HEALTH COACHING · SALES",
    title: "Discovery Call Booking & Pre-Call Prep",
    result: "52% conversion · 6 more coaching hrs/week",
    industry: "Healthcare",
    imageKey: "coaching",
    details: {
      before: [
        "90 min/day on intake admin",
        "20 hrs/week for coaching",
        "35% discovery-to-client conversion",
        "Coach gathering context during calls",
      ],
      after: [
        "15 min/day reviewing AI briefs",
        "26 hrs/week for coaching",
        "52% discovery-to-client conversion",
        "Full brief 30 min before each call",
      ],
      outcomes: [
        { number: "52%", label: "discovery-to-client rate / was 35%" },
        { number: "6 hrs", label: "more coaching per week" },
        { number: "75 min", label: "per day recovered" },
      ],
      stack: ["n8n", "Claude API", "Calendly", "Notion", "Gmail"],
      delivered: "1 week",
    },
  },
  {
    id: "cs-14",
    num: "14",
    tag: "B2B SAAS · CUSTOMER SUCCESS",
    title: "Churn Risk Detection & Intervention",
    result: "65% churn reduction · weekly health scores",
    industry: "Technology",
    imageKey: "saas",
    details: {
      before: [
        "4-6 churns per month, all reactive",
        "Monthly manual check-ins",
        "No health scores",
        "CSM time split equally",
      ],
      after: [
        "1-2 churns per month",
        "Weekly automated health scoring",
        "CSMs on at-risk accounts only",
        "Proactive outreach before concerns raised",
      ],
      outcomes: [
        { number: "65%", label: "reduction in monthly churn" },
        { number: "Weekly", label: "health scores all accounts" },
        { number: "2× more", label: "time on high-risk accounts" },
      ],
      stack: ["n8n", "Claude API", "HubSpot", "Slack", "Product webhook"],
      delivered: "3 weeks",
    },
  },
  {
    id: "cs-15",
    num: "15",
    tag: "FINTECH · OPERATIONS",
    title: "Transaction Anomaly Detection & Alerts",
    result: "<25 min merchant alert · 50% fewer false positives",
    industry: "Financial Services",
    imageKey: "finance",
    details: {
      before: [
        "6-8 hr merchant notification delay",
        "8 hrs/day manual triage",
        "12% false positive rate",
        "Reactive only",
      ],
      after: [
        "<25 min automated merchant alert",
        "2 hrs/day for genuine risk only",
        "6% false positive rate",
        "100% anomalies communicated proactively",
      ],
      outcomes: [
        { number: "<25 min", label: "merchant alert / was 6-8 hrs" },
        { number: "6 hrs", label: "per day analyst time saved" },
        { number: "50%", label: "false positive reduction" },
      ],
      stack: ["n8n", "Claude API", "Stripe API", "Slack", "Gmail"],
      delivered: "3 weeks",
    },
  },
  {
    id: "cs-16",
    num: "16",
    tag: "CONTENT · MARKETING",
    title: "Content Repurposing Pipeline",
    result: "4× output · $800/month saved · same day",
    industry: "Marketing",
    imageKey: "marketing",
    details: {
      before: [
        "$800/month VA cost for repurposing",
        "3-4 day lag from publish to social",
        "Inconsistent voice across channels",
        "1 content format per week",
      ],
      after: [
        "$0 additional cost",
        "Content repurposed same day",
        "Consistent voice, 20 min review",
        "4 formats per piece",
      ],
      outcomes: [
        { number: "4×", label: "content output per piece" },
        { number: "$800", label: "per month saved" },
        { number: "20 min", label: "coach review time per set" },
      ],
      stack: ["n8n", "Claude API", "Webflow", "Beehiiv", "Buffer", "Slack"],
      delivered: "1 week",
    },
  },
  {
    id: "cs-17",
    num: "17",
    tag: "MENTAL HEALTH · OPERATIONS",
    title: "Patient Intake & Therapist Matching",
    result: "<20 min response · 2 hrs/day saved",
    industry: "Healthcare",
    imageKey: "healthcare",
    details: {
      before: [
        "2 hrs/day on intake and matching",
        "48-72 hr wait for first response",
        "Matching based on memory",
        "Inconsistent onboarding",
      ],
      after: [
        "0 hrs/day on intake",
        "<20 min first response",
        "AI matching on 5 criteria",
        "Standardised onboarding every patient",
      ],
      outcomes: [
        { number: "<20 min", label: "first response / was 48-72 hrs" },
        { number: "2 hrs", label: "per day recovered" },
        { number: "100%", label: "consistent intake process" },
      ],
      stack: ["n8n", "Claude API", "Typeform", "Gmail", "Airtable"],
      delivered: "1 week",
    },
  },
  {
    id: "cs-18",
    num: "18",
    tag: "E-COMMERCE · MARKETING",
    title: "AI Personalised Abandoned Cart Recovery",
    result: "6.4% recovery rate · was 2.1%",
    industry: "E-commerce",
    imageKey: "ecommerce",
    details: {
      before: [
        "68% cart abandonment",
        "2.1% cart recovery rate",
        "1 generic recovery email",
        "Single touchpoint only",
      ],
      after: [
        "68% cart abandonment (unchanged)",
        "6.4% cart recovery rate",
        "3-email personalised sequence",
        "Style-matched messaging",
      ],
      outcomes: [
        { number: "6.4%", label: "cart recovery rate / was 2.1%" },
        { number: "3×", label: "more recovered revenue" },
        { number: "0 extra", label: "staff hours per week" },
      ],
      stack: ["n8n", "Claude API", "Shopify", "Klaviyo"],
      delivered: "2 weeks",
    },
  },
  {
    id: "cs-19",
    num: "19",
    tag: "LOGISTICS · OPERATIONS",
    title: "Proactive Shipment Delay Communication",
    result: "82% fewer WISMO tickets · 100% proactive",
    industry: "Logistics",
    imageKey: "logistics",
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
    id: "cs-20",
    num: "20",
    tag: "CONSULTING · BUSINESS DEV",
    title: "Automated Proposal Generation",
    result: "76% time reduction · same-day delivery",
    industry: "Professional Services",
    imageKey: "law",
    details: {
      before: [
        "6-8 hrs per proposal writing",
        "Proposals delivered Thursday-Friday",
        "Max 3 proposals per week",
        "Inconsistent quality",
      ],
      after: [
        "1.5 hrs per proposal",
        "Delivered same evening as discovery",
        "7 proposals per week capacity",
        "Consistent structure every time",
      ],
      outcomes: [
        { number: "76%", label: "reduction in proposal time" },
        { number: "Same eve", label: "proposal delivery / was Thu-Fri" },
        { number: "7/week", label: "proposal capacity / was 3" },
      ],
      stack: ["n8n", "Claude API", "Notion", "PDFShift", "Gmail"],
      delivered: "2 weeks",
    },
  },
];

const caseRows = caseRowsBase.map((row, i) => ({
  ...row,
  accent: ACCENT_PALETTE[i % ACCENT_PALETTE.length],
}));

/* ─── page ───────────────────────────────────────────────────────────────────── */

function CaseStudiesContent() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const caseParam = searchParams.get("case");
    if (!caseParam) return;
    setActiveCase(caseParam);
    requestAnimationFrame(() => {
      document.getElementById(caseParam)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [searchParams]);

  const visibleRows =
    activeFilter === "All"
      ? caseRows
      : caseRows.filter((row) => row.industry === activeFilter);

  return (
    <main style={{ background: "var(--bg)" }}>
      <style>{`
        .proof-row {
          display: grid;
          grid-template-columns: 60px 180px 1fr 1fr auto;
          gap: 24px;
          align-items: center;
          padding: 28px 0;
          border-bottom: 1px solid var(--line);
          border-left: 3px solid transparent;
          padding-left: 0;
          transition: background-color 0.22s ease, border-left-color 0.22s ease, border-left-width 0.22s ease, padding-left 0.22s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .proof-row:hover {
          background-color: var(--row-accent-bg-hover, rgba(234,106,71,0.02));
          border-left-color: var(--row-accent, #EA6A47);
          padding-left: 20px;
        }
        .proof-row.active {
          background-color: var(--row-accent-bg-active, rgba(234,106,71,0.06));
          border-left-color: var(--row-accent, #EA6A47);
          border-left-width: 4px;
          padding-left: 20px;
        }
        .proof-row-num {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          color: var(--row-accent, #EA6A47);
          letter-spacing: 0.1em;
        }
        .proof-row-tag {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
          color: var(--row-accent, #E8603C);
          letter-spacing: 0.08em;
          line-height: 1.4;
          text-transform: uppercase;
        }
        .proof-row-title {
          font-size: 20px;
          font-weight: 800;
          color: #22332C;
          font-family: var(--font-fraunces), serif;
        }
        .proof-row-result {
          font-size: 14px;
          color: rgba(34,51,44,0.72);
          line-height: 1.5;
        }
        .proof-row-arrow {
          display: inline-flex;
          color: #5E594E;
          transition: color 0.2s ease-out, transform 0.2s ease-out;
          justify-self: end;
        }
        .proof-row:hover .proof-row-arrow {
          color: var(--row-accent, #EA6A47);
        }
        .proof-row.active .proof-row-arrow {
          color: var(--row-accent, #EA6A47);
          transform: rotate(180deg);
        }

        /* filter tabs */
        .filter-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          border-bottom: 1px solid var(--line);
          margin-bottom: 48px;
          padding-bottom: 0;
        }
        .filter-tab {
          display: inline-flex;
          align-items: center;
          padding: 8px 4px;
          margin-right: 24px;
          font-size: 1rem;
          font-weight: 500;
          color: #4A4A45;
          cursor: pointer;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          border-radius: 0;
          white-space: nowrap;
          transition: all 0.25s ease;
        }
        .filter-tab:hover {
          color: #22332C;
          border-bottom-color: rgba(34,51,44,0.2);
        }
        .filter-tab.active {
          color: #22332C;
          font-weight: 700;
          border-bottom: 2px solid #EA6A47;
        }

        /* hero section */
        .case-hero-band {
          background: var(--cream);
          border-bottom: 1px solid var(--line);
        }
        .case-hero-section {
          padding: 112px 60px;
          max-width: 1360px;
          margin: 0 auto;
        }
        .case-hero-section.case-hero-section--list {
          padding: 52px 60px 0;
        }
        .case-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .case-hero-heading {
          font-family: inherit;
          font-size: 56px;
          font-weight: 900;
          color: #22332C;
          line-height: 1.05;
          margin-bottom: 20px;
        }
        .case-hero-heading .outline-num {
          color: #22332C;
          -webkit-text-fill-color: #22332C;
        }
        .case-hero-subtitle {
          font-family: inherit;
          font-size: 16px;
          color: rgba(34,51,44,0.72);
          margin-bottom: 36px;
        }
        .case-hero-inline-stats {
          display: flex;
          gap: 40px;
        }
        .case-hero-inline-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .case-hero-inline-stat-number {
          font-size: 28px;
          font-weight: 900;
          color: #EA6A47;
          font-family: inherit;
        }
        .case-hero-inline-stat-label {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
          color: #E8603C;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .case-stats-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .case-stat-card {
          background: #FFFFFF;
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 28px 24px;
          transition: all 0.25s ease;
        }
        .case-stat-card:hover {
          transform: translateY(-5px);
          border-color: #EA6A47;
          box-shadow: 0 8px 32px rgba(234,106,71,0.1);
        }
        .case-stat-card-label {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
          color: #E8603C;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .case-stat-card-number {
          font-size: 40px;
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(135deg, #22332C 0%, #EA6A47 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: cardStat 4s ease infinite alternate;
        }
        @keyframes cardStat {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .case-stat-card-divider {
          width: 24px;
          height: 2px;
          background: #EA6A47;
          border-radius: 2px;
          margin: 8px 0;
        }
        .case-stat-card-desc {
          font-size: 14px;
          color: rgba(34,51,44,0.72);
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .case-hero-section {
            padding: 64px 24px;
          }
          .case-hero-section.case-hero-section--list {
            padding: 32px 24px 0;
          }
          .case-hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .case-hero-heading {
            font-size: 40px;
          }
        }

        @media (max-width: 640px) {
          .proof-row {
            grid-template-columns: 32px 1fr auto;
            row-gap: 6px;
          }
          .proof-row-tag,
          .proof-row-result {
            grid-column: 1 / -1;
          }
        }

        .case-row-wrap {
          transition: opacity 0.2s ease;
        }
        .case-row-wrap.dimmed {
          opacity: 0.7;
        }
        .case-row-wrap.dimmed:hover {
          opacity: 1;
        }

        /* expanded case panel */
        .case-panel {
          position: relative;
          box-sizing: border-box;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          background: white;
          border: 1.5px solid transparent;
          border-top: none;
          border-radius: 0 0 20px 20px;
          transition: max-height 0.4s ease, opacity 0.3s ease;
        }
        .case-panel.active {
          max-height: 900px;
          opacity: 1;
          border-color: var(--line);
          box-shadow: inset 0 3px 0 0 var(--row-accent, #EA6A47);
        }
        .case-panel-header {
          background: #22332C;
          padding: 20px 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .case-panel-header-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--cream);
          font-family: var(--font-fraunces), serif;
        }
        .case-panel-close {
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
        .case-panel-close:hover {
          background: rgba(255,255,255,0.2);
        }
        .case-panel-content {
          display: grid;
          grid-template-columns: 280px 1fr 1fr;
          gap: 0;
        }
        .case-panel-image {
          width: 280px;
          min-height: 340px;
          overflow: hidden;
          position: relative;
        }
        .case-panel-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.85);
          display: block;
        }
        .case-panel-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(234,106,71,0.3) 0%, transparent 60%);
        }
        .case-panel-col-ba {
          padding: 32px 28px;
          border-right: 1px solid var(--line);
        }
        .case-panel-label-sm {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
          color: #E8603C;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }
        .case-panel-label-sm.after {
          color: #E8603C;
        }
        .case-panel-list-v2 {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .case-panel-list-v2 li {
          font-size: 14px;
          color: #22332C;
          font-weight: 500;
          line-height: 1.7;
        }
        .case-panel-list-v2.after li {
          color: #22332C;
          font-weight: 500;
        }
        .case-panel-divider-v2 {
          height: 1px;
          background: linear-gradient(90deg, #EA6A47, var(--line));
          margin: 16px 0;
        }
        .case-panel-col-outcomes {
          padding: 32px 28px;
        }
        .case-stat-v2 {
          border-left: 3px solid #EA6A47;
          padding-left: 14px;
          margin-bottom: 20px;
        }
        .case-stat-v2-number {
          font-size: 26px;
          font-weight: 900;
          color: #22332C;
          background: linear-gradient(90deg, #22332C, #EA6A47);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .case-stat-v2-desc {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          color: #5E594E;
          letter-spacing: 0.04em;
          margin-top: 2px;
        }
        .case-stack-pills-v2 {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .case-stack-pill-v2 {
          background: var(--cream);
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 4px 10px;
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          color: #22332C;
          font-weight: 500;
        }
        .case-delivered-v2-label {
          margin-top: 16px;
        }
        .case-delivered-v2-value {
          font-size: 16px;
          font-weight: 700;
          color: #22332C;
        }
        @media (max-width: 768px) {
          .case-panel-content {
            grid-template-columns: 1fr;
          }
          .case-panel-image {
            width: 100%;
            min-height: 200px;
          }
          .case-panel-col-ba {
            border-right: none;
            border-bottom: 1px solid var(--line);
          }
        }
      `}</style>

      <ScrollProgressBar />

      <div className="case-hero-band">
        <section className="case-hero-section">
          <div className="case-hero-grid">
            <div>
              <AnimateIn>
                <h1 className="case-hero-heading">
                  <span className="outline-num">20</span> systems.
                  <br />
                  Real problems.
                  <br />
                  Real outcomes.
                </h1>
                <div className="case-hero-inline-stats">
                  <div className="case-hero-inline-stat">
                    <span className="case-hero-inline-stat-number">12</span>
                    <span className="case-hero-inline-stat-label">INDUSTRIES</span>
                  </div>
                  <div className="case-hero-inline-stat">
                    <span className="case-hero-inline-stat-number">20</span>
                    <span className="case-hero-inline-stat-label">SYSTEMS</span>
                  </div>
                </div>
              </AnimateIn>
            </div>

            <div className="case-stats-cards">
              {STAT_CARDS.map((stat, i) => (
                <AnimateIn as="div" className="case-stat-card" key={stat.label} delay={i * 80}>
                  <div className="case-stat-card-label">{stat.label}</div>
                  <div
                    className="case-stat-card-number"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  >
                    {stat.number}
                  </div>
                  <div className="case-stat-card-divider" />
                  <div className="case-stat-card-desc">{stat.desc}</div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="case-hero-section case-hero-section--list">
        <div>
          <nav className="filter-tabs">
            {INDUSTRIES.map((industry) => (
              <button
                key={industry}
                onClick={() => setActiveFilter(industry)}
                className={`filter-tab${activeFilter === industry ? " active" : ""}`}
              >
                {industry}
              </button>
            ))}
          </nav>

          {visibleRows.map((row, i) => {
            const isActive = activeCase === row.id;
            const isDimmed = activeCase !== null && !isActive;
            const rowAccentStyle = {
              "--row-accent": row.accent,
              "--row-accent-bg-hover": `${row.accent}05`,
              "--row-accent-bg-active": `${row.accent}0F`,
            } as CSSProperties;
            return (
              <AnimateIn
                as="div"
                key={row.id}
                delay={Math.min(i, 6) * 80}
                className={`case-row-wrap${isDimmed ? " dimmed" : ""}`}
                style={rowAccentStyle}
              >
                <div
                  id={row.id}
                  className={`proof-row${isActive ? " active" : ""}`}
                  onClick={() => setActiveCase(isActive ? null : row.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveCase(isActive ? null : row.id);
                    }
                  }}
                >
                  <span className="proof-row-num">{row.num}</span>
                  <span className="proof-row-tag">{row.tag}</span>
                  <span className="proof-row-title">{row.title}</span>
                  <span className="proof-row-result">{row.result}</span>
                  <span className="proof-row-arrow" aria-hidden="true">
                    <ChevronDown size={18} strokeWidth={2} />
                  </span>
                </div>

                <div className={`case-panel${isActive ? " active" : ""}`}>
                  <div className="case-panel-header">
                    <span className="case-panel-header-title">{row.title}</span>
                    <button
                      className="case-panel-close"
                      onClick={() => setActiveCase(null)}
                    >
                      ✕ CLOSE
                    </button>
                  </div>

                  <div className="case-panel-content">
                    <div className="case-panel-image">
                      <img src={CASE_IMAGES[row.imageKey]} alt={row.title} />
                      <div className="case-panel-image-overlay" />
                    </div>

                    <div className="case-panel-col-ba">
                      <div className="case-panel-label-sm">BEFORE</div>
                      <ul className="case-panel-list-v2">
                        {row.details.before.map((item, i) => (
                          <li key={i}>
                            <span style={{ color: "rgba(34,51,44,0.72)" }}>→ </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="case-panel-divider-v2" />
                      <div className="case-panel-label-sm after">AFTER</div>
                      <ul className="case-panel-list-v2 after">
                        {row.details.after.map((item, i) => (
                          <li key={i}>
                            <span style={{ color: "#EA6A47" }}>→ </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="case-panel-col-outcomes">
                      <div className="case-panel-label-sm">OUTCOMES</div>
                      {row.details.outcomes.map((stat, i) => (
                        <div className="case-stat-v2" key={i}>
                          <div className="case-stat-v2-number">{stat.number}</div>
                          <div className="case-stat-v2-desc">{stat.label}</div>
                        </div>
                      ))}

                      <div className="case-panel-label-sm" style={{ marginTop: 24, marginBottom: 10 }}>
                        STACK
                      </div>
                      <div className="case-stack-pills-v2">
                        {row.details.stack.map((tech, i) => (
                          <span className="case-stack-pill-v2" key={i}>
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="case-panel-label-sm case-delivered-v2-label">
                        DELIVERED IN
                      </div>
                      <div className="case-delivered-v2-value">{row.details.delivered}</div>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default function CaseStudies() {
  return (
    <Suspense fallback={null}>
      <CaseStudiesContent />
    </Suspense>
  );
}
