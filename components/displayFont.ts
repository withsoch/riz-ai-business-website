import { Bebas_Neue } from "next/font/google";

/**
 * The condensed display face the /v2 and /v3 prototypes share.
 *
 * Loaded here rather than in app/layout.tsx so it only ships on the routes
 * that opt in — the live site's three-face system (Archivo / Inter Tight /
 * IBM Plex Mono) is untouched.
 *
 * To drop it and run a prototype on Riz's own display face instead, change
 * --v2-display / --v3-display in that prototype's CSS. Nothing else moves.
 */
export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
});
