# Design notes — the homepage

Why the homepage looks the way it does.

It was built as a second homepage at `/v2` in
[`withsoch/riz-web-new`](https://github.com/withsoch/riz-web-new), sitting
beside the old one so the two could be compared directly rather than argued
about. It won, and in this repo it is the only homepage: `app/page.tsx`, styled
by `app/home.css`, with its own kit in `components/v2/`.

The notes below are kept as written, so the reasoning survives. Where they say
"/v2", read "the homepage". Where they say "the live site" or "`/`", read the
previous design, which does not exist in this repo — it is still in
`riz-web-new`'s history if it's ever needed.

---

## What buildwithnav.com actually is

Worth knowing before reading the rest: it is a **hand-written static HTML
site**, not Webflow. One 90KB file per page, ~660 lines of CSS inlined in a
`<style>` block, GSAP + ScrollTrigger + SplitText + Lenis from jsDelivr, and
a Netlify-style form post. Bebas Neue and DM Sans off Google Fonts. The CSS
still carries its edit history as section comments — `DESIGN PASS AUG 28`,
`TIGHTEN PASS`, `REVIEW FIXES AUG 28 PM`, `FINAL POLISH AUG 29` — appended
rather than merged, so later blocks override earlier ones.

Its palette is `#0D0D0D` / `#FF4500` / `#F8F6F2` / `#F1EDE6` / `#E8E2D9`.
Structurally that is the *same idea* as this site's ink / coral / paper /
cream / line — near-black text, one hot accent, two warm off-whites, a
hairline. That is why the merge works at all: the bones already matched. The
difference is temperature and confidence, not architecture.

---

## What was taken (structure)

| From Nav | Why it earns its place here |
|---|---|
| **Trust bar** — four counting stats under the hero | The biggest single win. `$3.9M`, `92%`, `20s` already existed on the live homepage — buried as rows of a filterable table roughly three screens down. They now land before the visitor decides whether to keep scrolling. |
| **Numbered offer cards** with a `Format / Length / For / You keep` spec grid, one flagged **Most booked** | The live route cards give a title, one sentence and a button. Buyers scoping a spend want a spec sheet. Nav's is the best version of this pattern I've seen. |
| **Published pricing, framed as a virtue** | Nav says it out loud: *"published, so you can budget without a call."* The prices were already on this site; the framing wasn't. |
| **Qualification** — a numbered fit list beside a dark *"Not for you if"* card | Disqualifying reads as confidence. The Soch sales playbook already keeps a disqualifiers list; it had never reached the website. |
| **FAQ accordion** | `components/faq-section.tsx` holds eight real answers **including all the pricing** and is imported by no page. It has been invisible to every visitor this site has ever had. `/v2` publishes that copy verbatim. |
| **Dual-path dark close** | The live site closes with a Cal.com modal only, which converts the ready and drops everyone else. Nav gives both a door: "the fast route" for the ready, a real inquiry form for the rest, with an in-place success state. |
| **Always-visible sticky nav** with a permanent CTA pill | `components/Navbar.tsx` hides on scroll-down. Nice to read, bad to convert: the highest-intent control on the page spends most of the session off-screen. |
| **Sticky mobile CTA**, revealed past the hero | Free conversion surface on the device most visitors are on. |
| **Craft details** — pill buttons with a coloured shadow, `.label` eyebrow with an accent tick, hairline section rhythm alternating white / paper / cream, 3% grain film, inset hero frame, headline lines rising out of a mask | This is most of what makes Nav *feel* expensive. Almost none of it is expensive. |

## What stayed Riz's

- **The palette.** Cream / coral / ink is warmer and more distinctive than
  Nav's black-and-`#FF4500`. Nav's orange is louder; this one is better.
- **"What I actually believe."** Nav has no equivalent section, and this is
  the most Riz thing on the site. Kept, re-typeset, not rewritten.
- **The asymmetric portrait hero.** Nav centres everything. The two-column
  hero with the full-bleed portrait is a better-owned asset, so it stayed —
  wearing Nav's eyebrow pill, frame, sweep and pill buttons.
- `FeaturedCaseStudies`, `PersonalityCarousel`, `Testimonials`, the writing
  rows. All reused as-is.

## What was deliberately *not* taken

- **The ninety-logo brand wall.** Nav has 90 real AI-brand partnerships. Riz
  has five logos he genuinely owns. The marquee carries the **stack as text**
  instead of padding the wall with brands he hasn't worked with.
- **The `$10K AI Audit` lead-magnet sprawl** and the `/claude`, `/hub`,
  `/skills`, `/council`, `/loop` free-resource network. A real strategy, but
  a separate project, not a homepage decision.
- **The guarantee.** Nav repeats *"if your people don't walk away with
  something real, you don't pay"* three times, and it is doing a lot of work
  for him. **That is a commercial promise, not a design pattern, so it wasn't
  mine to write.** In its slot `/v2` runs the closest thing already said in
  public — *"If it won't work, I'll tell you before you spend anything, not
  after"* — lifted from the FAQ copy. It de-risks honestly. If a real
  guarantee is wanted, `.v2-guar` in `app/v2/page.tsx` is where it goes.
- **Nav's sub-14px type.** His `.label` runs `0.66rem` (~10.5px) and his card
  meta `0.6rem`. This repo's type floor is 14px. Every label here is 14px with
  wider letter-spacing buying back the "small caps" read.
- **GSAP + ScrollTrigger + SplitText + Lenis.** Nav ships four CDN libraries
  and hides `<body>` until they load, with a 1800ms safety timeout in case
  they don't. `components/v2/Reveal.tsx` does the same three moves — rise,
  stagger, mask-reveal — in CSS off one IntersectionObserver, with no fonts
  gate and nothing to fail.

---

## Open decisions

1. **Bebas Neue.** It is what gives Nav its poster-sized authority, and it is
   the single biggest visual change here. It loads on `/v2` only
   (`components/v2/fonts.ts`), so the live three-face system is untouched. To
   run the whole merge on Archivo instead, change one line in `v2.css`:
   `--v2-display: var(--font-display);`. Worth looking at both before deciding.
2. **Type clash in the reused sections.** `FeaturedCaseStudies`,
   `Testimonials` and `PersonalityCarousel` still use Archivo, so the
   condensed-uppercase rhythm breaks where they appear. Either restyle their
   headers to match, or keep it as deliberate contrast between "poster"
   sections and "content" sections. Currently the latter, by default rather
   than by decision.
3. **The booking form endpoint.** It posts to
   `NEXT_PUBLIC_N8N_CONSULTING_FORM_WEBHOOK`, the same webhook
   `/services/consulting` already uses. With the env var unset it shows an
   honest error and points at the calendar — it never fakes a success. Worth
   deciding whether inquiries from both forms should land in one n8n flow or
   two.
4. **The announcement bar** currently points at `/guides` (16 files in
   `public/guides/`). It is the obvious slot for Soch Academy when
   `academy.withsoch.com` ships.

## Not yet verified

Everything above was checked in a desktop browser at ~1470px. The mobile
breakpoints are ported from Nav's and written to the same values, but the
browser window would not resize during this session, so **mobile was not
visually confirmed.** Worth a pass on a real phone before this goes anywhere.

---

## Blast radius

Not applicable any more — this is the whole homepage, not a patch beside one.

For the record, when it shipped in `riz-web-new` it added `app/v2/**`,
`components/v2/**` and `components/ChromeGate.tsx`, and changed exactly two
lines of `app/layout.tsx`. Every other route rendered identically. Those routes
came across to this repo unchanged, which is why the seam described in
`README.md` → *Two design systems* exists.
