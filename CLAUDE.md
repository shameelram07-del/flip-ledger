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

## What the page shows (don't change unless asked)

Black balance header (profit, pace, goal bar, and **Account should hold**: paid sales minus everything bought, kept items included, minus fuel), then a bottom tab bar only:
**Board** (To collect / At home / Listed / Sold) · **Stock** (list/accept/worst per item, totals table) · **Weeks** · **Goal** (projection slider, pay-back, where the money went) · **Items** (sold + stock) · **Kept**.

## Reference

- Car: 2025 Mitsubishi Outlander 2.0L, ~8 L/100 km. Boot ~110 cm wide × 80 cm high.
- Fuel $3.41/L.
- Trade Me no longer charges casual sellers a success fee.
- Good used tools sell for about 55–60% of new price.
