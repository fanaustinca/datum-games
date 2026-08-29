# Datum Games

A free, static browser game hub. No backend, no build step, no accounts —
just HTML/CSS/JS hosted on GitHub Pages.

Live site: `https://<your-username>.github.io/datum-games/`

## How it works

- `games.json` is the entire catalog. Every game on the site is one entry
  in this file.
- `index.html` fetches `games.json`, renders the search bar, tag filters,
  and the card grid.
- `play.html?id=<game-id>` looks up a game by id and loads it into an
  iframe. This is the page every card links to.
- Each game lives in its own folder under `games/<id>/` (or can point at
  any external URL — see below).

Nothing talks to a server. `games.json` is just a static file fetched by
the browser, so the whole site can be hosted anywhere that serves static
files, including GitHub Pages.

## Adding a new game

1. Drop the game's files into `games/<your-game-id>/`, with a self-contained
   `index.html` as the entry point (the way `games/snake/` and
   `games/memory-match/` are set up). The game must run entirely in the
   browser — no server calls back to Datum Games.
   - If a game is already hosted elsewhere (e.g. itch.io), you can skip
     step 1 and just point `path` at its URL directly.
2. Add an entry to `games.json`:

   ```json
   {
     "id": "your-game-id",
     "title": "Your Game Title",
     "tagline": "One short line shown on the card.",
     "description": "A couple of sentences shown on the play page.",
     "path": "games/your-game-id/index.html",
     "icon": "🎮",
     "color": "#39e6ff",
     "tags": ["arcade", "singleplayer"],
     "added": "2026-08-29",
     "featured": false
   }
   ```

   - `id` must be unique and URL-safe (used in `play.html?id=...`).
   - `icon` is any emoji, used on the card thumbnail and play page.
   - `color` tints the card thumbnail background.
   - `tags` power both search and the tag filter chips — reuse existing
     tags where it makes sense so filters stay useful.
   - `featured` pins the game to the top of the grid and adds a badge.
   - `source` (optional) — a link to the game's official/original page
     (e.g. its itch.io listing). When set, a "View on <sourceLabel>"
     button appears on the play page. `sourceLabel` defaults to `itch.io`.
   - `gate` (optional, boolean) — set `true` when `path` shouldn't
     auto-load. Instead the play page shows a landing panel with the
     `source` link first and a "Play here instead" button that loads
     `path` into the iframe on click. Use this for platforms like
     itch.io that block being embedded directly (their page sends a
     `frame-ancestors` CSP), where you're instead pointing `path` at a
     self-hosted mirror. It also gives the official page top billing
     for search indexing while still letting people play in-place.
   - `mobileOnly` (optional, boolean) — set `true` for touch/camera-only
     experiences (e.g. AR games). The play page shows a small banner
     suggesting the visitor switch to a phone if their device doesn't
     look like one (checked via `(pointer: coarse)`). It doesn't block
     desktop visitors, just warns them.
3. Commit and push. GitHub Pages redeploys automatically.

That's it — no other file needs to change. The search bar, tag filters,
and grid all derive themselves from `games.json`.

## Local preview

Any static file server works, e.g.:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Opening `index.html` directly via `file://` will NOT work — `fetch()`
can't load `games.json` from the filesystem in most browsers.

## Project structure

```
datum-games/
├── index.html          # homepage: search + tag filters + grid
├── play.html            # game player page (reads ?id=)
├── 404.html
├── games.json            # the catalog — add games here
├── assets/
│   ├── css/style.css
│   ├── js/catalog.js     # fetch + filter/search helpers
│   ├── js/app.js         # homepage wiring
│   └── img/favicon.svg
└── games/
    ├── snake/index.html
    └── memory-match/index.html
```
