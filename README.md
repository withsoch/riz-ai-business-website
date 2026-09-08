# riz-ai-business-website

Rizwan Mahmood's business-facing site — advisory, systems built through Soch,
and speaking. Next.js App Router, TypeScript, Tailwind v4.

The homepage is the design that was prototyped as `/v2` in
[`withsoch/riz-web-new`](https://github.com/withsoch/riz-web-new) and won.
`DESIGN-NOTES.md` records why it looks the way it does, what was taken from
buildwithnav.com, what was deliberately left out, and what's still open.

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in the webhook, see Booking below
npm run dev                    # http://localhost:3000
```

```bash
npm run build
npm run start
npm run lint
```

## Routes

```
/                      /services                 /guides
/about                 /services/consulting      /guides/[slug]
/booking               /services/projects        /blog
/case-studies          /services/speaking        /writing
```

Plus `app/api/writing-posts` — a JSON endpoint the homepage calls to refresh
the writing list client-side.

## Two design systems, on purpose

This is the single most important thing to know before editing anything.

| | Homepage (`/`) | Every other route |
|---|---|---|
| Styles | `app/home.css` | `app/globals.css` |
| Nav | `components/v2/V2Nav.tsx` — sticky, always visible, permanent CTA | `components/Navbar.tsx` — hides on scroll-down |
| Display face | Bebas Neue, condensed uppercase | Archivo |
| Buttons | 100px pills with a coral shadow | 8px rectangles |

Both share the same colour tokens from `app/globals.css`, so they don't clash
on colour — but they are visibly different systems, and the homepage is the
newer one. **The other routes have not been brought across yet.** That's the
main outstanding piece of work on this repo; see *Known issues*.

`components/ChromeGate.tsx` is what keeps the two navs from stacking: it
suppresses the shared `Navbar` on `/` only. Note it matches `/` **exactly** —
as a prefix it would match every path on the site.

### The `v2-` class prefix

Homepage class names all start with `v2-`. That's historical: this design
started life as a second homepage sitting beside the old one. The prefix was
kept rather than swept, because renaming ~300 selectors buys tidiness and
risks one silent miss. Read it as a namespace. Everything is scoped under
`.v2`, so homepage styles cannot leak into the older routes.

## Type system

Loaded via `next/font/google` in `app/layout.tsx` and consumed through CSS
custom properties:

| Role | Font | Variable |
|---|---|---|
| Display — headings | **Archivo** | `--font-display` |
| Body — copy, buttons, lists | **Inter Tight** | `--font-body` |
| Mono — figures, labels, dates | **IBM Plex Mono** | `--font-mono` |

Plus **Bebas Neue**, loaded in `components/displayFont.ts` and applied only on
the homepage via `--v2-display`. To run the homepage on Archivo instead,
change that one line in `app/home.css`.

**Watch out:** many declarations still use older variable names —
`--font-playfair`, `--font-fraunces`, `--font-inter-tight`, `--font-montserrat`,
`--font-dm-sans`, `--font-geist-mono`, `--font-dm-mono`, `--font-bebas`. Those
fonts are **not** loaded. Each is aliased to one of the three roles in
`app/globals.css`, so the names are historical labels, not the font in use. Map
by **role**, not by name — `--font-inter-tight`, despite the name, resolves to
the *display* face.

### Size rule

Every `font-size` in `app/` and `components/` follows: **minimum 14px, rounded
up to the next even number.** Nothing below 14, nothing odd, no fractions.

This is why the homepage's labels sit at 14px where buildwithnav.com runs
~10.5px, with wider letter-spacing buying back the small-caps read.

Sizes are declared four ways — CSS `font-size`, `clamp()`, inline
`fontSize: "14px"`, and bare numeric `fontSize: 14`. Any sweep has to cover all
four.

**Exception:** `public/guides/guide-styles.css` styles the standalone guide HTML
files, served as static assets rather than rendered by the app. It runs its own
scale and is not covered by the rule.

## Colour tokens

Defined in `:root` in `app/globals.css`. Contrast is against white unless noted.

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--ink` | `#22332C` | headings, emphasis | 13.3 |
| `--body` | `#333333` | body copy | 12.6 |
| `--ink2` | `#3C4642` | secondary text | 9.8 |
| `--muted` | `#55514A` | small labels, meta | 7.9 |
| `--faint` | `#5E594E` | dates, fine print | 7.0 |
| `--coral` | `#EA6A47` | accents, CTAs | 3.2 |
| `--amber` | `#D79A36` | occasional accent | 2.45 |

Note the direction trap: on the dark `--ink` blocks, "fainter" means *lighter*,
not darker. Darkening a grey that sits on a dark ground collapses its contrast.

The oranges sit below WCAG AA deliberately — a product decision, not an
oversight. Don't "fix" them without asking.

Text colours written as `rgba(34,51,44,α)` are floored at **α 0.72**, around 5:1
on both white and cream. A contrast audit reading `rgba()` as opaque will report
these as passing when they aren't — composite against the real background.

## Where content comes from

| Section | Source |
|---|---|
| Writing / blog | Substack RSS via `lib/substack.ts`, refreshed through `app/api/writing-posts` |
| Guides | Standalone HTML files in `public/guides/`, indexed at runtime by `lib/guides.ts` (it reads the directory, so filenames never appear in code) |
| Case studies | Hard-coded in `components/FeaturedCaseStudies.tsx` and `app/case-studies/page.tsx` |
| Homepage numbers, offers, fit list, FAQ | Hard-coded at the top of `app/page.tsx` and `components/v2/V2Faq.tsx` |

## Booking

Every "Book a call" trigger renders through **`CalBookingButton`**
(`components/CalModal.tsx`). Nothing links to cal.com or `/booking` directly.
Change the booking behaviour in one place.

The call is **60 minutes at $140**, stated on the hero CTA, the homepage offer
card, the booking card, the `/booking` page and the FAQ. Keep those in step.

The homepage booking form and `/services/consulting` both POST to
`NEXT_PUBLIC_N8N_CONSULTING_FORM_WEBHOOK`. The payload carries a `source` field
so they can be routed apart downstream. **With the env var unset, both forms
show an honest error and point at the calendar — they never fake a success.**
Set it in Vercel → Settings → Environment Variables as well as locally.

## Sounds

`lib/sounds.ts` synthesises small UI sounds with Web Audio — no audio files, so
nothing to load and nothing to 404:

- `playPopSound()` — the booking CTAs
- `playToggleSound()` — retained from the previous homepage's workflow demo,
  which this design does not use. Unreferenced today.

One shared `AudioContext`, created lazily inside the click that first needs it
because the autoplay policy demands it, everything in `try/catch` so audio can
never interfere with a booking, and silent for `prefers-reduced-motion`.

The separate `<audio>` player for the portrait track is unrelated — see
`contexts/audio-context.tsx`.

## Motion

`components/v2/Reveal.tsx` handles the homepage's three moves — rise, stagger,
and headline lines rising out of a mask — off one `IntersectionObserver`, with
`app/home.css` owning the motion and the `prefers-reduced-motion` opt-out.

buildwithnav.com does the same thing with GSAP + ScrollTrigger + SplitText +
Lenis, four CDN libraries and a fonts gate that hides `<body>` until they load.
That was not worth the weight or the white-screen risk.

`components/AnimateIn.tsx` is the equivalent for the older routes.

## Layout

```
app/          routes, globals.css (tokens + older-route CSS), home.css (homepage)
components/   shared UI; components/v2/* is the homepage's own kit
contexts/     audio-context.tsx — the portrait track player
hooks/        useParallax.ts
lib/          guides.ts, substack.ts, sounds.ts
public/       images, videos, audio, logos, guides/*.html
design.md     inventory of tokens as they appear in the code — STALE, see below
DESIGN-NOTES.md  why the homepage is the way it is; read before redesigning it
CV-AUDIT.md   what was checked against the CV, what was fixed, what is open
```

## Deployment

Not wired up yet. This repo has no Vercel project attached.

When it is: production branch `main`, and set
`NEXT_PUBLIC_N8N_CONSULTING_FORM_WEBHOOK` in the project's env vars or every
form on the site fails closed.

> **If a push to `main` doesn't reach the live site,** check Vercel → Settings →
> Git → **Production Branch**. Renaming a Git branch does not update that field,
> so it can end up pointing at a branch that no longer exists — at which point
> every push silently builds as a *Preview* and production freezes on its last
> good deploy. This bit the previous repo once.

## Known issues

- **The other routes are still on the old design.** `/about`, `/services/*`,
  `/case-studies`, `/guides`, `/blog` all use `app/globals.css`, the older nav
  and rectangular buttons. Anyone who clicks off the homepage sees the seam.
  Biggest outstanding job here.
- **`public/videos` is 109MB committed to git** (one file is 49MB), which is
  most of the repo. All 7 are used by `components/PersonalityCarousel.tsx` on
  the homepage. Moving them to Vercel Blob or another CDN would make this repo
  far cheaper to clone and deploy.
- **`design.md` is stale.** It documents Montserrat / Fraunces / Geist Mono as
  the type stack; the site runs Archivo / Inter Tight / IBM Plex Mono, plus
  Bebas Neue on the homepage. Regenerate or delete it.
- **`components/ServicesHubDiagram.tsx`** renders a 588-unit viewBox into a
  ~300px box, so its SVG labels come out at **5.4px** on screen. The only text
  on the site below the 14px floor. SVG `font-size` is in user units, so the
  size rule doesn't catch it; fixing it means resizing the graphic.
- **`public/Photos/riz-vespa.jpg`** (2MB) is referenced nowhere.
- **`CV-AUDIT.md`** still lists unresolved questions about claims on the site.
- **The homepage guarantee line is a placeholder position.** It runs an existing
  public line rather than a real risk-reversal offer. See `DESIGN-NOTES.md` →
  *Open decisions*.
