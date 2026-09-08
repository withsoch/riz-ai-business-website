"use client";
import { useState } from "react";

/* ── geometry constants ──────────────────────────────────────────── */
const CX = 294;          // SVG center x
const CY = 252;          // SVG center y
const CR = 101;          // center circle radius
const OR = 182;          // orbit radius (center-to-node-center)
const NR = 62;           // node circle radius

// Node positions in the initial SVG viewport
// Consulting  -90° (top),  Projects +30° (bottom-right),  Workshops +150° (bottom-left)
const NODES = [
  { id: "consulting", cx: 294,                                          cy: CY - OR,       fill: "#EA6A47", num: "01", label: "CONSULTING" },
  { id: "projects",   cx: Math.round(CX + OR * Math.cos(Math.PI / 6)), cy: Math.round(CY + OR * Math.sin(Math.PI / 6)),  fill: "#22332C", num: "02", label: "PROJECTS"   },
  { id: "workshops",  cx: Math.round(CX + OR * Math.cos(5 * Math.PI / 6)), cy: Math.round(CY + OR * Math.sin(5 * Math.PI / 6)), fill: "#D79A36", num: "03", label: "WORKSHOPS"  },
] as const;
// → consulting (294, 70)   projects (452, 343)   workshops (136, 343)

/* ── component ───────────────────────────────────────────────────── */
export default function ServicesHubDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const paused = hovered !== null;

  const orbitStyle = {
    transformOrigin: `${CX}px ${CY}px`,
    animation: "svc-orbit 12s linear infinite",
    animationPlayState: paused ? "paused" : "running",
  } as React.CSSProperties;

  const counterStyle = (ncx: number, ncy: number) => ({
    transformOrigin: `${ncx}px ${ncy}px`,
    animation: "svc-counter 12s linear infinite",
    animationPlayState: paused ? "paused" : "running",
  } as React.CSSProperties);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <svg
      viewBox="0 0 588 504"
      style={{ width: "100%", maxWidth: 640, height: "auto" }}
    >
      {/* ── spokes (inside orbit group so they track the nodes) ───── */}
      <g style={orbitStyle}>
        {NODES.map((n) => (
          <line
            key={`spoke-${n.id}`}
            x1={CX} y1={CY} x2={n.cx} y2={n.cy}
            style={{ stroke: "var(--line)" }} strokeWidth="1.5" strokeDasharray="5 4"
          />
        ))}
      </g>

      {/* ── glow ring (static, sits on top of spokes) ─────────────── */}
      <circle cx={CX} cy={CY} r={CR + 28} fill="none" stroke="#FFFFFF" strokeWidth="30" />

      {/* ── center circle - pulse only, does NOT rotate ───────────── */}
      <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: "svc-pulse 3s ease-in-out infinite" } as React.CSSProperties}>
        <circle cx={CX} cy={CY} r={CR} fill="#22332C" />
        <text x={CX} y={CY - 20} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="14.5" fill="rgba(255,255,255,0.72)" letterSpacing="0.03em">The clearest</text>
        <text x={CX} y={CY + 2}  textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="14.5" fill="rgba(255,255,255,0.72)">ops in</text>
        <text x={CX} y={CY + 24} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="14.5" fill="rgba(255,255,255,0.72)">your space</text>
      </g>

      {/* ── orbiting nodes ────────────────────────────────────────── */}
      <g style={orbitStyle}>
        {NODES.map((n) => {
          const isHovered = hovered === n.id;
          return (
            <g key={n.id}>
              {/*
               * Counter-rotation group: rotates -θ around the node's INITIAL
               * SVG position.  Combined with the parent's +θ orbit, this keeps
               * all text inside the circle perfectly upright at every angle.
               */}
              <g style={counterStyle(n.cx, n.cy)}>
                {/* Scale wrapper - only scales the active hovered node */}
                <g
                  style={{
                    transformOrigin: `${n.cx}px ${n.cy}px`,
                    transform: isHovered ? "scale(1.08)" : "scale(1)",
                    transition: "transform 0.2s ease",
                    cursor: "pointer",
                  } as React.CSSProperties}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => goTo(n.id)}
                >
                  {/* circle */}
                  <circle
                    cx={n.cx}
                    cy={n.cy}
                    r={NR}
                    fill={n.fill}
                    stroke="#fff"
                    strokeWidth={isHovered ? 2 : 0}
                    style={{ transition: "stroke-width 0.2s ease" }}
                  />

                  {/* number - Playfair, centered in circle */}
                  <text
                    x={n.cx} y={n.cy - 11}
                    textAnchor="middle" dominantBaseline="auto"
                    fontFamily="Playfair Display, serif"
                    fontSize="28" fontWeight="700" fill="#fff"
                    style={{ pointerEvents: "none" } as React.CSSProperties}
                  >
                    {n.num}
                  </text>

                  {/* label - DM Mono, below number, stays inside circle */}
                  <text
                    x={n.cx} y={n.cy + 18}
                    textAnchor="middle" dominantBaseline="auto"
                    fontFamily="var(--font-dm-mono), monospace"
                    fontSize={isHovered ? "11" : "10.5"}
                    fill={isHovered ? "#fff" : "rgba(255,255,255,0.78)"}
                    letterSpacing="0.1em"
                    style={{ pointerEvents: "none", transition: "fill 0.2s ease" } as React.CSSProperties}
                  >
                    {n.label}
                  </text>

                  {/* native browser tooltip */}
                  <title>{n.label}</title>
                </g>
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
