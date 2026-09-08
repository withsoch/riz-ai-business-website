// Small UI sounds, synthesised with Web Audio rather than shipped as audio
// files so they cost nothing to load and can never 404.
//
// One AudioContext is shared by every sound and created lazily inside the
// click that first needs it, which is what the browser's autoplay policy
// requires. Everything is wrapped in try/catch: a sound failing must never
// interfere with what the user actually clicked.

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedCtx) sharedCtx = new AudioCtx();
  if (sharedCtx.state === "suspended") sharedCtx.resume();
  return sharedCtx;
}

type Tone = {
  /** Start frequency in Hz. */
  from: number;
  /** Optional end frequency — the tone glides to it over `glide` seconds. */
  to?: number;
  /** Seconds to reach `to`. */
  glide?: number;
  /** Peak gain, 0-1. */
  gain: number;
  /** Seconds from start until the tone has decayed to silence. */
  decay: number;
  /** Seconds to wait before this tone starts. */
  delay?: number;
};

function playTones(tones: Tone[]) {
  // These sounds are decoration, not feedback anyone depends on, so stay
  // silent for people who have asked for reduced motion.
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    for (const tone of tones) {
      const start = now + (tone.delay ?? 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(tone.from, start);
      if (tone.to !== undefined) {
        osc.frequency.exponentialRampToValueAtTime(tone.to, start + (tone.glide ?? 0.06));
      }
      gain.gain.setValueAtTime(tone.gain, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.decay);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + tone.decay + 0.01);
    }
  } catch {
    // Fail silently - e.g. Web Audio unsupported or blocked before user gesture.
  }
}

/** Played on every "Book a call" CTA. A bright two-tone pop. */
export function playPopSound() {
  playTones([
    { from: 420, to: 900, glide: 0.06, gain: 0.16, decay: 0.14 },
    { from: 1320, gain: 0.05, decay: 0.09, delay: 0.01 },
  ]);
}

/** Played by the manual/automated toggle in the workflow demo. */
export function playToggleSound() {
  playTones([{ from: 520, to: 880, glide: 0.08, gain: 0.15, decay: 0.12 }]);
}
