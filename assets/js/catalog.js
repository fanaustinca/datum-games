/**
 * Datum Games catalog loader.
 * Fetches games.json (relative to site root) and exposes helpers
 * for rendering the grid, search, and tag filtering. No backend —
 * everything runs from the static JSON file.
 */

const CATALOG_PATH = window.DATUM_ROOT ? `${window.DATUM_ROOT}games.json` : "games.json";

async function loadGames() {
  const res = await fetch(CATALOG_PATH, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load games.json (${res.status})`);
  const games = await res.json();
  return games.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}

function gameHref(game) {
  const root = window.DATUM_ROOT || "";
  return `${root}play.html?id=${encodeURIComponent(game.id)}`;
}

function cardTemplate(game) {
  const tags = game.tags.map((t) => `<span class="pill">${t}</span>`).join("");
  return `
    <a class="card" href="${gameHref(game)}" data-id="${game.id}">
      <div class="card-thumb" style="background: linear-gradient(135deg, ${game.color}33, ${game.color}0d);">
        ${game.featured ? '<span class="card-featured-badge">FEATURED</span>' : ""}
        <span>${game.icon || "🎮"}</span>
      </div>
      <div class="card-body">
        <h3>${game.title}</h3>
        <p class="tagline">${game.tagline || ""}</p>
        <div class="card-tags">${tags}</div>
      </div>
    </a>
  `;
}

function renderGrid(container, games) {
  if (!games.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="glyph">🔍</div>
        <p>No games match your search yet.</p>
      </div>`;
    return;
  }
  container.innerHTML = games.map(cardTemplate).join("");
}

function collectTags(games) {
  const set = new Set();
  games.forEach((g) => (g.tags || []).forEach((t) => set.add(t)));
  return [...set].sort();
}

function matchesQuery(game, query) {
  if (!query) return true;
  const haystack = [game.title, game.tagline, game.description, ...(game.tags || [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function matchesTags(game, activeTags) {
  if (!activeTags.size) return true;
  return (game.tags || []).some((t) => activeTags.has(t));
}

window.DatumCatalog = { loadGames, renderGrid, collectTags, matchesQuery, matchesTags, gameHref };
