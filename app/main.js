// DealHound page wiring: reads the controls, filters the deals and renders
// the grid. A hash like #category=Audio or #sort=discount presets the filters,
// so a shared link opens the finder already filtered.

import { DEALS, CATEGORIES, STORES, CHECKED_NOTE } from "./deals.js";
import { applyFilters, summarize } from "./filters.js";
import { renderDeals, renderStats } from "./render.js";

const grid = document.getElementById("deal-grid");
const countEl = document.getElementById("result-count");
const statsEl = document.getElementById("stats");
const searchEl = document.getElementById("search");
const categoryEl = document.getElementById("categories");
const storeEl = document.getElementById("store-filter");
const discountEl = document.getElementById("discount-filter");
const signalEl = document.getElementById("signal-filter");
const sortEl = document.getElementById("sort");
const noteEl = document.getElementById("checked-note");

const state = {
  query: "",
  category: "All",
  store: "All stores",
  minDiscount: 0,
  signal: "any",
  sort: "best",
};

function readHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  if (params.get("category") && CATEGORIES.includes(params.get("category"))) {
    state.category = params.get("category");
  }
  if (params.get("store") && STORES.includes(params.get("store"))) {
    state.store = params.get("store");
  }
  if (params.get("sort")) state.sort = params.get("sort");
  if (params.get("signal")) state.signal = params.get("signal");
  if (params.get("min")) state.minDiscount = Number(params.get("min")) || 0;
  if (params.get("q")) state.query = params.get("q");
}

function buildChips() {
  categoryEl.innerHTML = CATEGORIES.map(
    (c) =>
      '<button type="button" class="chip' + (c === state.category ? " active" : "") +
      '" data-category="' + c + '">' + c + "</button>",
  ).join("");
  categoryEl.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.category = chip.dataset.category;
      refresh();
    });
  });
}

function buildStoreOptions() {
  storeEl.innerHTML = STORES.map(
    (s) => '<option value="' + s + '"' + (s === state.store ? " selected" : "") + ">" + s + "</option>",
  ).join("");
}

function syncControls() {
  searchEl.value = state.query;
  discountEl.value = String(state.minDiscount);
  signalEl.value = state.signal;
  sortEl.value = state.sort;
  storeEl.value = state.store;
}

function refresh() {
  const visible = applyFilters(DEALS, state);
  renderDeals(visible, grid, countEl, DEALS.length);
  buildChips();
  syncControls();
}

function startCountdown() {
  const end = new Date("2026-11-30T23:59:59-05:00").getTime();
  const el = document.getElementById("countdown");
  function tick() {
    const left = Math.max(0, end - Date.now());
    const days = Math.floor(left / 86400000);
    const hours = Math.floor((left % 86400000) / 3600000);
    const mins = Math.floor((left % 3600000) / 60000);
    el.textContent = "Cyber Monday ends in " + days + "d " + hours + "h " + mins + "m";
  }
  tick();
  setInterval(tick, 60000);
}

readHash();
buildStoreOptions();
noteEl.textContent = CHECKED_NOTE;
renderStats(summarize(DEALS), statsEl);
refresh();
startCountdown();

searchEl.addEventListener("input", () => {
  state.query = searchEl.value;
  refresh();
});
storeEl.addEventListener("change", () => {
  state.store = storeEl.value;
  refresh();
});
discountEl.addEventListener("change", () => {
  state.minDiscount = Number(discountEl.value);
  refresh();
});
signalEl.addEventListener("change", () => {
  state.signal = signalEl.value;
  refresh();
});
sortEl.addEventListener("change", () => {
  state.sort = sortEl.value;
  refresh();
});
