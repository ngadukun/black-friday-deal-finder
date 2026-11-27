// DealHound rendering: turns the filtered deal list into cards on the page,
// and paints the header stats. No network calls — everything comes from the
// deal data the page already loaded.

import { discountPercent, savedAmount } from "./filters.js";
import { CHECKED_AT } from "./deals.js";

export const SIGNAL_LABEL = {
  newlow: "NEW LOW",
  strong: "STRONG DEAL",
  routine: "ROUTINE SALE",
};

export function money(value) {
  return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function cardHtml(deal) {
  const pct = discountPercent(deal);
  const saved = savedAmount(deal);
  return (
    '<article class="card signal-' + deal.signal + '">' +
    '<div class="card-top"><span class="tag">' + deal.category + '</span>' +
    '<span class="store">' + deal.store + '</span></div>' +
    '<h3>' + deal.product + '</h3>' +
    '<div class="prices"><span class="sale">' + money(deal.sale) + '</span>' +
    '<span class="usual">' + money(deal.usual) + '</span>' +
    '<span class="pct">-' + pct + '%</span></div>' +
    '<p class="save-line">You save ' + money(saved) + ' (' + pct + '% off)</p>' +
    '<p class="signal"><span class="badge">' + SIGNAL_LABEL[deal.signal] + '</span> ' +
    deal.evidence + '</p>' +
    '<p class="checked">Checked ' + CHECKED_AT + ' · Source: ' + deal.source + '</p>' +
    '<a class="buy" href="' + deal.link + '" target="_blank" rel="noopener">View at ' + deal.store + ' &rarr;</a>' +
    '</article>'
  );
}

export function renderDeals(list, gridEl, countEl, total) {
  gridEl.innerHTML = list.map(cardHtml).join("");
  if (list.length === 0) {
    gridEl.innerHTML =
      '<p class="empty">No deals match those filters. Loosen the discount or clear the search and try again.</p>';
  }
  countEl.textContent = "Showing " + list.length + " of " + total + " deals";
}

export function renderStats(summary, statsEl) {
  statsEl.innerHTML =
    '<div class="stat"><strong>' + summary.count + '</strong><span>checked deals</span></div>' +
    '<div class="stat"><strong>' + summary.avgDiscount + '%</strong><span>average discount</span></div>' +
    '<div class="stat"><strong>' + money(summary.totalSaved) + '</strong><span>total savings if you bought one of each</span></div>' +
    '<div class="stat"><strong>' + summary.newLows + '</strong><span>new lowest prices</span></div>';
}
