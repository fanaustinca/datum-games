(async function () {
  const grid = document.getElementById("game-grid");
  const searchInput = document.getElementById("search-input");
  const tagBar = document.getElementById("tag-bar");
  const countEl = document.getElementById("result-count");

  const activeTags = new Set();
  let allGames = [];

  function applyFilters() {
    const query = searchInput.value.trim();
    const filtered = allGames.filter(
      (g) => window.DatumCatalog.matchesQuery(g, query) && window.DatumCatalog.matchesTags(g, activeTags)
    );
    window.DatumCatalog.renderGrid(grid, filtered);
    if (countEl) {
      countEl.textContent = `${filtered.length} game${filtered.length === 1 ? "" : "s"}`;
    }
  }

  function renderTagBar(tags) {
    tagBar.innerHTML = tags
      .map((t) => `<button class="tag-chip" data-tag="${t}">${t}</button>`)
      .join("");
    tagBar.querySelectorAll(".tag-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const tag = chip.dataset.tag;
        if (activeTags.has(tag)) {
          activeTags.delete(tag);
          chip.classList.remove("active");
        } else {
          activeTags.add(tag);
          chip.classList.add("active");
        }
        applyFilters();
      });
    });
  }

  try {
    allGames = await window.DatumCatalog.loadGames();
    renderTagBar(window.DatumCatalog.collectTags(allGames));
    applyFilters();
  } catch (err) {
    grid.innerHTML = `<div class="empty-state"><div class="glyph">⚠️</div><p>Couldn't load the game catalog. ${err.message}</p></div>`;
  }

  searchInput.addEventListener("input", applyFilters);
})();
