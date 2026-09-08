# Site vs CV — audit, September 2026

Every factual claim on the site checked against `Rizwan_Mahmood_Sep_2026_CV.pdf`.

## Fixed on this branch (`fix/cv-accuracy`)

| Where | Was | Now | CV says |
|---|---|---|---|
| `app/page.tsx` · By the numbers 01 | $3.9M · **Careem** | $3.9M · **Bolt** | "(Bolt) Cost Reduction: reducing courier costs from 21% to 14% of GMV (saving $3.9M) in 6 months… 20 countries across Europe & Africa" |
| `app/page.tsx` · By the numbers 04 | **4 Markets** · Scaled across · Bolt | **15 Countries** · Courier reporting frameworks · Bolt | "Introduced Courier Reporting Frameworks in 15 countries". "4 Markets" appears nowhere |
| `app/page.tsx` · company timeline | Careem 2015, Wise 2018, Bolt 2021, Now 2024 | Careem 2019, Bolt 2021, Wise 2025, Now 2026 | Careem Oct'19–Sep'20 · Bolt Oct'21–May'25 · Wise May'25–Nov'25 · Soch Jun'25– |

The timeline was also contradicting `/about`, which already had the right years.

## Checked and correct — no change needed

- **`/about` timeline** matches the CV throughout: AIESEC 2014, Perbal Clothing
  2015, ACCA 2016, S&P Global 2018 (CV: Apr'17–May'19), Careem 2019, Motive
  2020, Bolt 2021–23, Wise 2025, Soch 2025.
- **92% straight-through processing · Wise** — CV: "~92% straight-through matching".
- **20s dispatch, down from 3 min · Careem** — CV: "reducing dispatch time from 3
  minutes to 20 seconds", Ministry of Health KPK.
- **"10+ years"** — CV summary says "10+ years". Career spans Apr'17 to present
  (~9.5 yrs of employment), and the CV itself makes the 10+ claim.
- `/about` "$3.9M… 21% to 14% of GMV across 20 countries" — correct, and it is
  the homepage that was wrong.

## Open questions — deliberately not changed

These need Riz's call, because the CV does not settle them and guessing wrong
on his own bio is worse than leaving it.

1. **"4 continents" vs "3 continents".** The homepage and all three
   `/services` pages say four. `/about`'s bio line says four, but its
   *beyondFacts* card says "3 continents — ACCA · Asia · Middle East · Europe".
   Same page, two numbers. Middle East is not a continent; Asia + Europe +
   Africa is three, and Motive's Canadian work would make four.
2. **"Ten years. Four companies."** (`/about` line 361). The CV lists seven
   employers: S&P Global, Careem, Motive, Bolt, Wise, Shaping Wealth, Soch.
3. **S&P Global and Motive** appear on `/about` but not in the hero logo strip
   or the "Cambridge. ACCA. Careem. Bolt. Wise." line. No logo files exist for
   either in `public/logos/`.
4. **Absent from the site entirely:** Shaping Wealth / Lydia (Oct'25–present,
   fractional), Academy by Soch, and Soch's delivery numbers — 20+ workflows
   live, 7+ clients, ~40 hrs/week removed per engagement, org of 6.
5. **Cambridge** is claimed on `/about` but is not in the CV's education
   section, which lists only BSc Applied Accounting (Oxford Brookes, Upper
   Second, 2017) and ACCA Affiliate 2016.
6. **Testimonials** (`components/Testimonials.tsx`) — Amara Whitfield /
   Northline Cloud, Daniel Okafor, Priya Nathan, Marcus Feldt. Not verifiable
   and not a CV matter, but they undercut the parts that are true. Note that
   withsoch.com already carries named client logos: Shaping Wealth, Kuunda,
   Byzantine, Milkar, Khudi Venture, Ncon, Cycle Together.

## CV figures available but unused on the site

Wise: month-end close 8→3 days · manual journals −65% · VAT/GST analyst time
−30% · 12+ products and 13+ market launches into 70+ countries · time-to-market
−9% · reporting errors −3%. Bolt: 80%+ EU Workers' Directive compliance ·
manual effort −70% via two microservices · courier segmentation −1.3% of GMV ·
delivery assignment +12% efficiency · A/B delivery fees +$2.1M in 6 months.
Motive: certified ELD solution, Canadian market.
