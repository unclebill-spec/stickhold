# Stickhold build review

Static source review of this sanitized folder only. Nothing here was installed, typechecked, linted, tested, booted, or played. `npm`, Vite, `startup.sh`, project scripts, and the network were not run. This is not a claim that the game builds or runs.

`REVIEW_OMISSIONS.txt` records that `src/lib/auth/preview.ts` was removed on purpose, along with platform caches, PWA scaffolding under `public/__grok/`, and deployment metadata. Auth and preview-login behavior that depends on the omitted module cannot be assessed from this copy.

Screenshots and `screenshots/app-builder-*.json` were read as files already in the tree. They were not recaptured in this pass. Those JSON files still describe a page titled "Halloweens Bounty".

## 1. Game identity

The playable product described by the current routes and UI is **Stickhold**, a single-player isometric stick-figure strategy game in the browser.

Evidence:

- `src/routes/index.tsx` and `src/routes/stickhold.tsx` both render `Stickhold`. The index document title is "Stickhold", and the description is "A small stick-figure realm. Gather, build, and take the enemy town hall."
- `src/routes/__root.tsx` sets the app name to "Stickhold" and the theme color to `#2a5bd7`.
- `src/components/stickhold.tsx` is the menu, HUD, pause screen, and win/lose overlay. The setup copy says: gather four resources, raise buildings, and take the other town hall across the ford.
- `src/game/engine.ts` is the match (`Realm`). `src/game/draw.ts` paints it. `src/game/audio.ts` is the mixer.

Two ways to play are wired in the setup menu and in `Realm.start()`:

- **Skirmish** (`rpg === false`). Two camps, four resources (food, wood, gold, stone), ages from Camp through Age 5, and a win or loss when a town hall reaches 0 HP (`Realm.reap`).
- **Tale** (`rpg === true`). A hero, caged people, neutral villages on team `2`, bosses (`alpha`, `brood`, `gore`, `chief`), and a separate ending in `Realm.rpgFate`.

The player camp can be Stickhold, Dynasty, Circle (`coven`), or Egypt. That choice is the player's side only. The other camp stays the default stick faction. Start corner is South (team 0) or North (team 1). Enemy posture is Passive, Normal, or Hunts. Sliders set starting stock, ground piles, map span (`54`, `108`, `216`, `432`), and, in Skirmish, enemy strength.

The unit and building tables in `UNITS` and `BLDS` cover villagers and soldiers (club, spear line, archers, cavalry, mages, hero, temple deities, siege), plus houses, farms, stores, barracks, ranges, stables, temple, altar, shop, smith, husbandry, towers, walls, school, keep, and siege yard. The map also has trees, berries, mines, herds, fish, animals, nests, a treasure cart, weather, and a day clock. Three `localStorage` slots (`stickhold-save`, `stickhold-save-2`, `stickhold-save-3`) persist a version-2 snapshot. Controls and audio prefs use `stickhold-controls` and `stickhold-audio`.

The package name is still `app-builder-workspace`. That name is the template, not the game title.

**Halloween's Bounty** is a second game in the same tree. It is the `/bounty` route (`src/routes/bounty.tsx`, `src/components/bounty-game.tsx`, `src/game/bounty/*`) plus `halloweens-bounty-prompt.md`. Its own copy calls it a short night raid with one hero, gold, and lumber. It does not share `Realm`. This review does not go further into that game. Leftovers from it still sit on Stickhold surfaces: `src/lib/og/site.json` title is "Halloweens Bounty", `public/favicon.svg` is a pumpkin, and `src/styles.css` still defines pumpkin, candle, and blood tokens.

## 2. Architecture and entrypoints

Browser app on TanStack Start, React 19, Vite, and Tailwind 4. `package.json` scripts call `scripts/with-app-env.mjs` and then Vite. `vite.config.ts` registers Tailwind, TanStack Start, React, a dev-only PGLite bootstrap, an `/auth/popup` middleware, and a Nitro `vercel` preset for build and preview. Those scripts were not executed.

| Piece | Role |
| --- | --- |
| `src/router.tsx` | `getRouter()` over the generated route tree |
| `src/routeTree.gen.ts` | Routes `/`, `/stickhold`, `/bounty` |
| `src/routes/__root.tsx` | HTML shell, `AuthProvider`, `PreviewHostBridge` |
| `src/components/stickhold.tsx` | React HUD around one canvas |
| `src/game/engine.ts` | `Realm`: map, orders, combat, AI, save/load |
| `src/game/draw.ts` | `drawRealm` isometric canvas renderer |
| `src/game/audio.ts` | `Score`: procedural music plus chop/pick/build buffers |
| `src/lib/auth/*`, `src/lib/db.ts`, `migrations/auth/` | Template auth and database. The Stickhold match does not read them |
| `src/lib/multiplayer/p2p.ts` | WebRTC helper. Stickhold does not import it |

`Stickhold()` constructs `new Realm(11)` once, stores it on `realmApi.hold` and `window.__stickhold`, and calls `realm.mount(canvas, drawRealm)`. `mount` owns a `requestAnimationFrame` loop. While the phase is `"play"`, it accumulates time scaled by `speed` (0.5 to 3), caps the backlog at 0.35s, and runs `step(1/30)` up to a small guard count. Menu phase still steps, only to drift the camera. Paused, win, and lose phases do not step. A second frame loop in the React component paints the minimap and pushes worker count and clock text into React state. `Realm.emit` pushes a `snapshot()` into React about every 150ms during play, and immediately on selection and menu actions.

`AuthProvider` returns its children unchanged. Stickhold does not render `SignInGate`. `src/lib/auth/server.ts` imports `./preview`, and that file is absent. No other file in this tree imports `src/lib/auth/server.ts`. Whether a future server entry would fail to load that module was not executed.

Map width and height are mutable module globals, `MAP_W` and `MAP_H`, starting at 108. `draw.ts` imports them as live bindings. Fog arrays are sized from those globals.

## 3. Obvious, code-grounded issues

### A new Skirmish does not always start a new match

`Stickhold` builds the world in the constructor with seed `11`. `start()` calls `applyMapSize()`, which calls `generate` only when `mapSpan` differs from `MAP_W` or the tile count does not match. It calls `generate` again only when `this.rpg` is true. For a Skirmish that stays on the current span, `start()` sets the phase to `"play"`, resets stock through `applyRich()`, applies the difficulty bonus, and leaves the existing units, buildings, age, tech, and `time` in place.

The first Start on the default 108 map therefore plays the menu world from seed 11. Main menu (`toMenu`) does not rebuild that world. A second Start at the same size continues the previous camps, with stock put back to the starting bags. Tale mode does call `generate(this.seed)` and avoids this. Changing the map size also regenerates, because `applyMapSize` notices the span change.

`start()` never rolls a new seed. Only `restart()` does (`Math.random() * 99999 | 0`).

### Play again keeps researched tech

`restart()` copies tiles, nodes, units, buildings, and stock from a fresh `Realm`, and it sets `age` back to `[0, 0]`. It does not replace `this.tech`. Smith, husbandry, ward, and rampart ranks stay, and `techRank` still multiplies hit points, damage, and gathering on the new match. `applyDifficulty()` can then raise the enemy age again on Insanity, on top of those leftover ranks.

`restart()` also generates the temporary realm before copying `playerTeam` and `rpg`. Tale mode repairs that with a second `generate`. Skirmish relies on both town halls already existing and on team ids, which the generator does assign as team 0 in the south and team 1 in the north.

### Tale endings use the Skirmish sentences

`rpgFate` wins when bosses are down and caged or unhoused people are gone, and it loses when the hero is gone and the altar is gone. The React overlay for `phase === "win" | "lose"` always says "Their hall is down." or "They took your hall." The engine toast for a Tale ending is a different sentence and is not what that modal shows. A Tale can also lose through `reap()` if the player's own town hall hits 0, which is a hall loss, and that same modal text is still the only one.

If two town halls are at 0 HP in one `reap` pass, the first dead hall in `this.buildings` sets the phase, and later halls are ignored because the phase is no longer `"play"`. `generate` adds the player's hall first, so a same-step trade is recorded as a loss.

### Long paths give up and walk straight

`findPath` stops after `max(8000, min(48000, cellCount / 8))` expansions and returns `[]` when the goal was not reached. On a 108 or 216 map that budget stays 8000. On a 432 map it is 23328, against 186624 cells. `moveTo` then, when the goal tile can be stood on, seeks in a straight line and slides on blocked axes. A river, rocks, or a wall can stall that walk. This was not timed. It is the control flow written in `findPath` and `moveTo`.

Each search also allocates full-map `Float64Array` and `Int32Array` buffers. `separate()` compares every living pair of units on every 30 Hz step.

### Several sound calls do nothing

`Realm.blip` has an empty body. Age-up, win, and lose call it, so those stingers do not play. `Score.tone`, `hammer`, `hit`, `arrow`, `thud`, `crackle`, `work`, `goman`, and `bleat` are empty. Chop, pick, build-loop, clank, splash, lightning, bell, and the procedural music loop are implemented. Chop and pick wait two seconds between plays, and the first call only starts `fetch("/sfx/chop.mp3")` and the pick and build files. Those files exist under `public/sfx/`. Decode success was not tested.

### Save size follows the whole map

`saveGame` writes every tile into a terrain string, a node-index array, and a deco string, plus units, buildings, nodes, and fog masks. A 432 map is 186624 tiles. `localStorage.setItem` is wrapped, and failure surfaces as "Could not save." Whether a large slot fits the browser quota was not measured.

### Other source facts worth keeping in view

- `src/game/engine.ts` and `src/game/draw.ts` begin with `// @ts-nocheck`. The exported `Unit` and `Building` types at the bottom of the engine file are not checked against the class.
- `.realm button:not(:disabled):active` in `src/styles.css` forces every pressed button to blue parchment, including ember, ink, and parchment buttons.
- `src/styles.css` imports Fraunces and Source Sans 3 from Google Fonts. That request was not made here.
- The root document links `/__grok/manifest.webmanifest` and `/__grok/icon-180.png`. `public/__grok/` is not in this copy. The Vite PWA plugin may synthesize those URLs at serve time. That was not run.
- `stock` only has teams 0 and 1. Tale villagers on team 2 wander around `home` and do not deposit resources in the paths read here. A later order that made them drop off would read `this.stock[2]` and throw inside the frame loop, which has no try/catch.

## 4. Improvement options

### Option A. Make Start and Play again build a clean match

Add one reset path used by `start()` and `restart()`. It should set seed, `playerTeam`, `faction`, `rpg`, `mood`, richness, span, and difficulty, then regenerate, then zero `time`, `age`, `tech`, selection, groups, militia, fury, and tale progress. Skirmish and Tale should both go through it, including a second Start at the same map size.

Tradeoff: the change is local to `Realm` and fixes the first thing a player does. The risk is resetting something `loadGame` must keep. Load should stay on its own path. A shared reset also has to keep North versus South and the faction bonuses, which are applied during `generate`. This does not fix path budgets, save size, or the Halloween leftovers.

### Option B. Cover match setup with a small headless test, then split the file

`Realm` can be constructed without `mount` if `localStorage` is missing. `loadControls` and `loadPrefs` already return defaults in that case. A node test can call `start` twice, call `restart` after writing `tech`, and assert seed, age, tech, building counts, and phase. After that, the unchecked 7k-line class can be split (map, orders, combat) without guessing.

Tradeoff: this is the way to keep option A from regressing, and `node --test` is already the script style in `package.json`. Importing `engine.ts` pulls `audio.ts`, which is safe until a method touches `AudioContext`, so the test must not call `ensureAudio`. A full split of `draw.ts` coupling (`MAP_W`, dozens of `realm` methods) is a large follow-up and should wait until the lifecycle assertions exist. Writing the tests was not done in this pass.

### Option C. Align the end card and the public name with Stickhold

Point the win/lose modal at the engine toast, or branch it on `snap.rpg`, so a Tale victory does not say the enemy hall fell. Set `src/lib/og/site.json` and `public/favicon.svg` to Stickhold, and leave `/bounty` and `src/game/bounty/` in place.

Tradeoff: small and visible, and it removes a real contradiction between the route title and the share card. It does not fix match reset. Replacing the favicon and the OG title in the same edit as any Halloween's Bounty work would mix the two games. Treat the bounty route as untouched.

## 5. Recommended first option

Do **option A**, and add the headless assertions from **option B** only for `start` and `restart` before changing anything else.

Those two methods are the match boundary. The source shows a same-size Skirmish Start keeps the previous world, and Play again keeps tech ranks. Players hit that before pathfinding, save quota, or branding. Keeping the test on construction plus `start` / `restart` avoids the canvas, the dev server, and the omitted preview-auth module. Option C is a good second edit once a new game is actually a new game.

## 6. Future test plan

Not run in this pass. Do not treat a green imagination of this list as a result.

Stay off `startup.sh`, `npm install`, and any script that opens a server, a browser, or the network, until the review copy is allowed to execute. The existing `scripts/browser-smoke.mjs` path was not run. The JSON verdicts under `screenshots/` are old captures of a Halloweens Bounty title and are not a baseline for current Stickhold.

When execution is allowed, a focused first slice:

1. Import `Realm` under `node --test` with no `localStorage`. Construct with a fixed seed.
2. Set Skirmish, span 108, South, Stickhold. Call `start()`. Record town-hall ids, unit ids, `time`, `age`, and `tech`. Mutate stock and `tech[0].weaponry`. Call `start()` again at the same span. Expect a new generation, `time === 0`, tech ranks at 0, and starting stock from `applyRich` plus difficulty. Expect North to put the player hall on the north pad (`scaleN(18)`, `scaleN(18)`), not to leave team 0's hall as the player's.
3. Research a tech rank, call `restart()`, and expect ranks at 0, `age` at 0 except the Insanity enemy age bump inside `applyDifficulty`, and a seed different from the pre-restart seed.
4. Tale: `start()` with `rpg` true. Expect no second town hall on the foe team, a player hero, and `tale`. Drive `rpgFate` conditions directly (boss nodes dead, no captives) and expect phase `"win"`. Remove the hero and the altar and expect phase `"lose"`. Assert the modal copy separately once it reads that phase, in a component test or a later browser pass.
5. Put both town halls at 0 HP and call `reap` once. Record which phase wins. That locks the same-step behavior before anyone changes it.
6. `saveGame` / `loadGame` against an in-memory `localStorage` on the 54 map. Expect terrain length `54 * 54`, units restored, and phase `"play"`. Repeat a size estimate for 216 and 432 without assuming quota.
7. One `findPath` from the south pad to the north pad on 54 and on 108. Record whether the result is a path or `[]`. That confirms the budget note with data.
8. Leave `src/lib/auth/server.ts` out of this slice. Loading it resolves `./preview`, which is omitted. Existing auth unit tests under `src/lib/auth/*.test.ts` do not import that missing module. They were not run here either.
9. A browser pass, only after the headless slice is green, would open `/`, start a Skirmish, return to the menu, start again, and check that built houses are gone. Then win a Tale fixture and read the modal. That pass did not happen here.

`tsc` and ESLint were not run. `@ts-nocheck` means a clean typecheck would still say nothing about `Realm` or `drawRealm`.
