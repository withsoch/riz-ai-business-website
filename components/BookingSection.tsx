import AnimateIn from "@/components/AnimateIn";
import CalBookingButton from "@/components/CalModal";

const included = [
  "60-minute deep dive over Zoom",
  "Pre-call questionnaire so I come prepared",
  "Recording sent after the call",
  "Personalised action plan",
  "1 week of async follow-up",
];

const topics = [
  "Implementing AI tools or workflows in your day-to-day",
  "Building an AI side project",
  "Operations and process design",
  "Starting or sharpening a personal brand",
];

const coralDot = (
  <span
    style={{
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "var(--coral)",
      flexShrink: 0,
      marginTop: "0.45rem",
      display: "inline-block",
    }}
  />
);

export default function BookingSection() {
  return (
    <section
      id="booking"
      style={{ background: "var(--cream)", borderTop: "1px solid var(--line)" }}
    >
      {/* TOP BANNER */}
      <div style={{ textAlign: "center", padding: "64px 1.5rem 64px" }}>
        <AnimateIn delay={80}>
          {/* Main heading - DM Sans bold, 56px desktop */}
          <h2
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "var(--ink)",
              lineHeight: 1.15,
              marginBottom: "0.75rem",
            }}
          >
            Book a{" "}
            <span
              style={{
                background: "var(--amber)",
                padding: "2px 8px",
                borderRadius: 4,
                fontStyle: "normal",
              }}
            >
              1:1 strategy
            </span>{" "}
            session.
          </h2>
        </AnimateIn>
      </div>

      {/* DETAILS CARD */}
      <div className="max-w-site" style={{ paddingBottom: "5rem" }}>
        <AnimateIn delay={220}>
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              border: "1px solid var(--line)",
              overflow: "hidden",
            }}
          >
            {/* Two-column body */}
            <div className="grid md:grid-cols-2">
              {/* Left column */}
              <div
                style={{
                  padding: "1.875rem",
                  borderBottom: "1px solid var(--line)",
                }}
                className="md:border-b-0 md:border-r md:border-r-[color:var(--line)]"
              >
                <p
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "1rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--coral)",
                    marginBottom: "1.25rem",
                  }}
                >
                  What&apos;s Included
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  {included.map((item, i) => (
                    <AnimateIn
                      as="li"
                      key={i}
                      delay={i * 80}
                      style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}
                    >
                      {coralDot}
                      <span
                        style={{
                          fontFamily: "var(--font-dm-sans), sans-serif",
                          fontSize: "1rem",
                          color: "var(--body)",
                          lineHeight: 1.65,
                        }}
                      >
                        {item}
                      </span>
                    </AnimateIn>
                  ))}
                </ul>
              </div>

              {/* Right column */}
              <div style={{ padding: "1.875rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "1rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--coral)",
                    marginBottom: "1.25rem",
                  }}
                >
                  Bring Your Questions On
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  {topics.map((item, i) => (
                    <AnimateIn
                      as="li"
                      key={i}
                      delay={i * 80}
                      style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}
                    >
                      {coralDot}
                      <span
                        style={{
                          fontFamily: "var(--font-dm-sans), sans-serif",
                          fontSize: "1rem",
                          color: "var(--body)",
                          lineHeight: 1.65,
                        }}
                      >
                        {item}
                      </span>
                    </AnimateIn>
                  ))}
                </ul>
              </div>
            </div>

            {/* BOTTOM ROW */}
            <div
              style={{
                borderTop: "1px solid var(--line)",
                padding: "1.75rem 2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1.25rem",
              }}
            >
              <div>
                <p className="meta-label" style={{ marginBottom: "0.4rem" }}>
                  Investment
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    fontWeight: 700,
                    color: "var(--ink)",
                    lineHeight: 1.1,
                  }}
                >
                  $140 / session
                </p>
              </div>
              <CalBookingButton className="btn-coral" style={{ flexShrink: 0 }}>
                Book a call →
              </CalBookingButton>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
