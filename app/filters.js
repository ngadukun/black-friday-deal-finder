// DealHound filtering and sorting: every rule a shopper can apply on the page.
// Pure functions over the deal list, so the same code drives the live page and
// the numbers shown in the header stats.

export function discountPercent(deal) {
  return Math.round((1 - deal.sale / deal.usual) * 100);
}

export function savedAmount(deal) {
  return Math.round((deal.usual - deal.sale) * 100) / 100;
}

export function signalRank(deal) {
  // New lows first, then strong deals, then routine sales.
  if (deal.signal === "newlow") return 0;
  if (deal.signal === "strong") return 1;
  return 2;
}

export function matchesSearch(deal, query) {
  if (!query) return true;
  const hay = (deal.product + " " + deal.store + " " + deal.category).toLowerCase();
  return query.toLowerCase().trim().split(/\s+/).every((word) => hay.includes(word));
}

export function applyFilters(deals, state) {
  let out = deals.slice();
  if (state.category && state.category !== "All") {
    out = out.filter((d) => d.category === state.category);
  }
  if (state.store && state.store !== "All stores") {
    out = out.filter((d) => d.store === state.store);
  }
  if (state.minDiscount && state.minDiscount > 0) {
    out = out.filter((d) => discountPercent(d) >= state.minDiscount);
  }
  if (state.signal && state.signal !== "any") {
    out = out.filter((d) => d.signal === state.signal);
  }
  out = out.filter((d) => matchesSearch(d, state.query));
  return sortDeals(out, state.sort);
}

export function sortDeals(deals, sort) {
  const list = deals.slice();
  if (sort === "discount") {
    list.sort((a, b) => discountPercent(b) - discountPercent(a) || a.sale - b.sale);
  } else if (sort === "price") {
    list.sort((a, b) => a.sale - b.sale);
  } else if (sort === "savings") {
    list.sort((a, b) => savedAmount(b) - savedAmount(a));
  } else {
    // "best" — signal first, then biggest discount.
    list.sort((a, b) => signalRank(a) - signalRank(b) || discountPercent(b) - discountPercent(a));
  }
  return list;
}

export function summarize(deals) {
  if (deals.length === 0) {
    return { count: 0, totalSaved: 0, avgDiscount: 0, newLows: 0, best: null };
  }
  const totalSaved = deals.reduce((sum, d) => sum + savedAmount(d), 0);
  const avgDiscount = Math.round(
    deals.reduce((sum, d) => sum + discountPercent(d), 0) / deals.length,
  );
  const newLows = deals.filter((d) => d.signal === "newlow").length;
  const best = sortDeals(deals, "best")[0];
  return { count: deals.length, totalSaved, avgDiscount, newLows, best };
}
