# Hero's Proof — PWA Kit 📜✨

Turn herosproof.github.io into an installable, offline-capable app.
Everything goes into the **root repo** (the one named `herosproof.github.io`).

## What's in this kit

| File | What it does |
|---|---|
| `index.html` | Your hub, with PWA tags + service worker registration already added |
| `manifest.json` | App identity: name, icon, colors, full-screen mode, home-screen shortcuts |
| `sw.js` | Service worker — caches the hub AND all sub-quests for offline use |
| `icon-192.png`, `icon-512.png` | Home-screen / install icons (scroll on deep purple) |
| `icon-512-maskable.png` | Padded version for Android's adaptive icon shapes |
| `apple-touch-icon.png` | iPhone home-screen icon (180×180) |

## How to install (5 minutes)

1. Open your **herosproof.github.io** repo (the root one, not a sub-quest repo).
2. Upload all 7 files to the **root** of that repo. `index.html` replaces your
   current hub file — it's identical except for the PWA additions.
3. Commit. Wait a minute or two for GitHub Pages to redeploy.
4. Visit https://herosproof.github.io on your phone:
   - **Android (Chrome):** you'll get an "Install app" prompt, or use
     menu ⋮ → "Add to Home screen".
   - **iPhone (Safari):** Share button → "Add to Home Screen".
5. It now launches full-screen from its own icon, no address bar. 🎉

## Why one service worker covers everything

`sw.js` sits at the root of the domain, so its "scope" is the entire
herosproof.github.io site — including `/story-mode`, `/word-quest`,
`/kanji-quest`, and every other sub-quest repo. Once a student visits a
quest while online, it's cached and will open offline afterward.

You do NOT need to add anything to the sub-quest repos. (Optional nicety:
paste the same `<script>` registration block from the bottom of `index.html`
into each sub-quest so the worker also installs for students who arrive at
a quest directly via a shared link, without passing through the hub first.)

## Updating the app later

- Normal edits to any page work as before — the worker uses network-first
  for pages, so students online always get the newest version.
- After a **big** update where you want to nuke old cached assets, open
  `sw.js` and bump `const VERSION = 'hp-v1'` to `'hp-v2'`. That clears the
  old cache on everyone's next visit.

## Quick checks after deploying

- https://herosproof.github.io/manifest.json should show the JSON.
- https://herosproof.github.io/sw.js should show the worker code.
- In Chrome desktop: DevTools → Application tab → Manifest / Service Workers
  should both show green.
