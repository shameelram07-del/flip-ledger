# Flip Ledger

Shameel's tool-flipping tracker. He buys used tools cheaply (mostly Trade Me), cleans them up and resells on Trade Me and Facebook Marketplace. Papatoetoe, Auckland, NZ.

- Repo: https://github.com/shameelram07-del/flip-ledger (branch `main`)
- Live: https://shameelram07-del.github.io/flip-ledger/ (GitHub Pages, deploys from `main` root, takes 1–2 min)
- `index.html` is the whole app. `data.json` is the only thing that normally changes.
- Every number on the page is worked out from `data.json`. Never hard-code totals anywhere.

## How Shameel works

- Very short replies, 2–3 lines. Plain English. Offer more only if asked.
- One step at a time. Concise tables when listing things.
- Only change what he asks for. Don't expand or "improve" content unasked.
- He mostly views the page on his iPhone.

## Your job

When he says he **bought**, **sold**, **listed**, **collected**, or **got paid** for something:
1. Edit `data.json` (see rules below).
2. Set `"updated"` to today's date (`YYYY-MM-DD`).
3. Check the JSON still parses.
4. Commit with a one-line message (e.g. `Sold Ryobi table saw #1 for $150`) and push to `main`.
5. Reply with a 1–2 line confirmation and the new profit total.

## Hard rules for the data

- Only add items he says he has **bought** or **sold**. Never add offers, watchlist items or things he's thinking about.
- Fuel is always a negative line (a trip in `trips`, never an item).
- Each stock item needs three prices: `list` (list at), `accept` (accept down to), `worst` (worst case).
- He prefers fast turnover with good profit over big profit with slow turnover. If asked for pricing, price to sell quickly.
- Mention faults honestly in `note`.
- Anything he says is **not confirmed** goes in `unconfirmed` (`["cost"]` or `["sold"]`) and stays there until he confirms.
- Kept items (`status: "kept"`) and disputed items (`status: "disputed"`) never count towards profit.

## data.json shape

```json
{
  "updated": "2026-10-30",
  "goal": 5000,
  "fuelPrice": 3.41,
  "litresPer100km": 8,
  "weeks": [ { "n": 1, "label": "19–26 Oct", "start": "2026-10-19" } ],
  "estimate": { "week": 3, "fuel": 40 },
  "items": [ ... ],
  "trips": [ { "id": 1, "week": 1, "km": 216, "fuel": 59, "label": "Trip 1" } ]
}
```

### Item fields

| Field | Meaning |
|---|---|
| `id` | short kebab-case, unique, e.g. `ryobi-ts-1` |
| `name` | as he describes it, brand + model if known |
| `status` | `sold`, `stock`, `kept`, `disputed` |
| `cost` | what he paid. `0` if it was his own (`own: true`) |
| `own` | `true` if it was already his, not bought to flip |
| `boughtWeek` / `soldWeek` | week number (see `weeks`). `null` if own |
| `bought` / `soldDate` | exact dates `YYYY-MM-DD` if he gives them, else `null` |
| `trip` | trip `id` if it was picked up on a fuel trip, else `null` |
| `note` | faults, pick-up location, anything he says |
| `unconfirmed` | list of fields not yet confirmed, e.g. `["cost"]` |

Stock only: `list`, `accept`, `worst`, `collected` (`false` = paid but not picked up yet), `listed` (`true` = up on Trade Me / Marketplace).

Sold only: `sold` (price), `paid` (`false` = waiting on the money).

### Weeks

Weeks run Monday to Sunday-ish; week 1 started 19 Oct 2026. When a new week starts, add it to `weeks` with `n`, `label` and `start`. Move `estimate.week` forward to the new current week.

## Common updates

**Bought something**
Add an item with `status: "stock"`, `cost`, `boughtWeek`, `collected: false` if not picked up yet, `listed: false`, and his `list` / `accept` / `worst`. If he hasn't given prices, ask for them in one line.

**Collected it** → `collected: true`.
**Listed it** → `listed: true`.
**Sold it** → `status: "sold"`, add `sold` and `soldWeek`, set `paid: false` unless he says the money is in. Remove `list` / `accept` / `worst` / `listed` / `collected`.
**Money came in** → `paid: true`.
**Fuel / pick-up trip** → add to `trips` with `km` and `fuel` (dollars, positive number; the page shows it as negative). Fuel ≈ km × 8 / 100 × 3.41.
**Keeping something** → `status: "kept"`, `cost` only.
**Paid from the joint account** → add "paidFrom": "joint" to the item.
**Paid the joint account back** → add { "date": "YYYY-MM-DD", "amount": N } to a top-level "repaid" list.

## What the page shows (don't change unless asked)

Dark 'Night Shift' page in a scroll-flow style (60/30/10 'Sunset' palette: near-black, warm white, orange accent, set by data-pal="sunset" on <html>; other palettes navy/forest/midnight can be previewed with ?pal=; Instrument Serif headings; ambient glow that takes the brand colour of the tool on screen). Board only: full-screen hero with Money made so far that shrinks away as you scroll, with a thin progress line (paid sales minus everything bought to flip, sold or not, minus fuel; kept items left out) against the $5k car goal, a plain one-line note, then four tiles: Profit on items sold, Pace per week, Still to sell, Owed back to joint account. Keep it plain English for a non-accountant. Bottom tab bar: Board (Highlights, Pipeline To collect / At home / Listed / Sold, then the 'Every flip' reel where each sold flip takes the full screen in its brand colour as you scroll, then a 'Less rush. More profit.' statement). Other tabs open with a big serif title that animates in (words rise from a mask, the orange word blurs in and gets an underline swash, then the line under it fades up) and drifts up as you scroll; sections fade up as you scroll · Stock (list/accept/worst ladders, totals table) · Weeks (bar chart, week rows) · Goal (road-to-the-car bar, projection slider, pay-back, where the money went) · Items (search, All / Sold / Stock / Kept) · Deals (today's used Trade Me deals from `deals.json`). `story.html` is a separate scroll story (Find · Fix · Flip) linked from the end of the Board: giant words behind cut-out photos of real tools in `story/`, numbers read live from data.json. `?tab=deals` (or any tab name) opens that tab.

## deals.json (morning Trade Me deals)

A scheduled Trade Me check runs hourly at :38 (8:38am–10:38pm NZ); at :15 past the next hour (the check can take 25+ minutes), a second scheduled task in the main Claude session copies its result into `deals.json` and pushes it (scheduled check sessions can't push to GitHub themselves). It never touches `data.json`. Shape: `{"updated": "<text>", "sections": [{"id", "name", "rule", "items": [{"title", "url", "price", "ptype", "location", "closes", "verdict": "good"|"watch"|"skip", "note"}], "footnote"?, "empty"?}]}`. Section ids: `table-saws`, `mitre-saws`, `nail-guns`, `power-tools`, `tool-sets`, `wood-stain`, `sewing-machines`, `home-gym`, `treadmills`, `fish-tanks`, `keter`. Auckland only, used, Buy Now or offers.

## Reference

- Car: 2025 Mitsubishi Outlander 2.0L, ~8 L/100 km. Boot ~110 cm wide × 80 cm high.
- Fuel $3.41/L.
- Trade Me no longer charges casual sellers a success fee.
- Good used tools sell for about 55–60% of new price.
