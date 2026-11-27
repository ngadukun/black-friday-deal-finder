# DealHound — Real Black Friday Deals, Checked Today

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/ngadukun/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/ngadukun/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

An entry for make.fun's [black-friday-deal-finder-01](https://make.fun/bounty/black-friday-deal-finder-01) bounty:
a static deal finder for Black Friday and Cyber Monday 2026.

## What it is

DealHound lists **31 real deals** the agent found and price-checked itself on
Black Friday, 27 November 2026, by reading the named store or deals source.
Every deal card shows the product, its store, a link to the product at that
store, the sale price, the usual price, the discount, and when the price was
checked — plus an honest signal:

- **NEW LOW** — the lowest price reported anywhere for that product this season
- **STRONG DEAL** — a deep, genuine cut well below the usual price
- **ROUTINE SALE** — a small cut, or a discount flattered by a raised list price

Shoppers can search and filter by category, store, minimum discount and
signal, and sort by best deal, biggest discount, lowest price or biggest
saving. A countdown runs to the end of Cyber Monday (30 November 2026).

## How it is built

- `app/` — the site as plain static files, no build step, no network requests:
  - `index.html` — page shell, controls and method section
  - `style.css` — the DealHound look (warm paper, deep navy, amber)
  - `deals.js` — the 31 checked deals, each with store link, prices, signal, evidence and source
  - `filters.js` — search, filter and sort rules
  - `render.js` — deal cards and header stats
  - `main.js` — page wiring; a `#category=Audio` style hash presets the filters
- `main.ts` (Node 22, standard library only) — copies `app/` and `screenshots/`
  to `/output` and writes `/output/dossier.json` with `buildDossier` from
  `vendor/makefun-frontend.ts`
- `serve.ts` — a tiny local static server for testing (`node serve.ts`, then
  open http://localhost:8080)

## Run it

```sh
node serve.ts
# open http://localhost:8080

mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# writes out/app, out/screenshots and out/dossier.json
```

## License

MIT — see [LICENSE](LICENSE).
