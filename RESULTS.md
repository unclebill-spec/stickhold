# Stickhold paper-only results

Baseline (unamended): `836eff6d075db82ffef74032a8644d5dceb811ab`

Working copy: `/workspace/stickhold-fix-20261110`

Node v24.22.1. No package install. No server. No browser. The headless loader is `scripts/ts-ext-register.mjs` (resolves extensionless relative imports to `.ts`). `AudioContext` is not constructed. `ensureAudio` returns when `window` is missing.

Test command:

```
node --experimental-strip-types --experimental-transform-types --import ./scripts/ts-ext-register.mjs --test src/game/realm-lifecycle.test.ts
```

## Option A

Shared match reset is `Realm.beginMatch`, used by `start()` and `restart()`. `restart()` still rolls `Math.random() * 99999 | 0` and then calls that path. `start()` keeps the current seed. `loadGame` was not pointed at `beginMatch`.

Commit: `89b4b10a5c67f4b642e036353f071b17b49dbda7`

### Before the engine change

Command above, against baseline reset behavior (loader and `src/game/realm-lifecycle.test.ts` only).

- tests 4
- pass 1
- fail 3

Failures were the two bugs:

- same-size Skirmish `start()` left `time` at 90 (match progress and the previous world were kept)
- `restart()` left `tech.structure` at 2 on normal difficulty
- Insanity `restart()` left `tech.structure` at 2

The North pad test passed on the baseline. A `playerTeam === 0` generate already puts team 1's town hall on `scaleN(18), scaleN(18)`, so choosing North without regenerating still finds that hall. The assertion stays as a guard that a regenerated North match keeps the player hall on that pad and the team 0 hall on `scaleN(66), scaleN(66)`.

### After the engine change

Same command. Re-run in this session before the Option A commit, still green.

- tests 4
- pass 4
- fail 0

## Option B

Coverage only. `src/game/engine.ts` was not changed in this step. Items 1-3 stay in the original four tests. Items 4-7 were added to `src/game/realm-lifecycle.test.ts`.

Same command, after the coverage tests:

- tests 12
- pass 12
- fail 0

Commit: `c54c80241bc9f6d7b4397f855ff884a2b6f7c5ee`

### Item 4 — Tale `rpgFate`

`start()` with `rpg` true on span 108, seed 11:

- one town hall, on the player team; the foe team has none
- a living player hero
- `tale` is set
- phase `"play"`

Win: every `bossNodes()` entry set `alive` false while `amount > 0` (dead bosses with amount 0 drop out of `bossNodes()`, and `bossesDown` requires a non-empty list), captives cleared, rescued units settled. `rpgFate()` then sets phase `"win"`. Toast follows `tale.need`: `"Your people are home. The wild is yours."` when `need` is set, otherwise `"The wild is clear. The champion stands."`

Lose: hero unit removed, player altar removed, `heroFallen[playerTeam]` set to `{ level: 1, xp: 0 }` (the lose branch requires that flag, not only a missing hero). Bosses still alive so the win branch does not return first. `rpgFate()` sets phase `"lose"` and toast `"The champion is gone, and the altar with them."`

### Item 5 — same-step halls

Skirmish seed 11, span 108, South. Both town halls set to 0 HP, then one `reap()`. Phase is `"lose"`. Toast is `"Your town hall is lost."` Both halls are removed from `buildings`.

`reap()` keeps the phase of the first dead town hall because it only assigns a phase while `phase === "play"`. `generate` adds the player's hall before the foe's, so a same-step trade is a loss. `reap()` was not changed.

### Item 6 — save / load

In-memory `localStorage` on `globalThis`, installed for the test and removed in `finally`.

Span 54, seed 11: `saveGame(1)` then `loadGame(1)` after wiping units and setting phase `"menu"`.

- `terrain.length` is `54 * 54` (2916)
- `tiles.length` is 2916
- unit id, kind, team, x, y, and hp match the pre-save list
- phase is `"play"`
- `mapSpan` is 54

Payload estimate, two consecutive full-suite runs, seed 11. The stub does not apply a browser quota. Both saves returned true. Terrain length was exact. Byte length is not asserted: `addNode` rolls `Math.random()` for rare monsters, so the JSON size moves by tens of bytes between runs.

- span 216 (`216 * 216` = 46656 tiles): 723165 bytes, then 723175 bytes
- span 432 (`432 * 432` = 186624 tiles): 2902463 bytes, then 2902463 bytes

### Item 7 — `findPath`

`findPath` was not changed. Seed 11 is deterministic for walkability (terrain and blockers come from `mulberry32(seed)`; `Math.random` in `addNode` does not move tiles). Start and goal are the walkable cleared-pad cells nearest each pad center. The town hall occupies the pad origin, so the stand cell is beside the hall, still inside `clearPad`.

South pad origin `scaleN(66), scaleN(66)`. North pad origin `scaleN(18), scaleN(18)`.

- span 54: from cell `(34, 32)` to `(10, 8)`, path length 29 (non-empty point array; last point is the goal center)
- span 108: from cell `(67, 65)` to `(19, 17)`, path length 55 (non-empty point array; last point is the goal center)

Neither call returned `[]`. The 108 budget is `max(8000, min(48000, 108*108/8))` = 8000, and this pad-to-pad route finishes inside that budget.

Items 8 and 9 were not run. `src/lib/auth/server.ts` was not imported. No browser.

### Realm class split — stopped

No split commit. `src/game/engine.ts` stays one class.

`Realm` is about 7515 lines under `// @ts-nocheck`. `src/game/draw.ts` imports the live `MAP_W` and `MAP_H` bindings from that same module, and also `BLDS`, `UNITS`, `BOSSES`, `ITEMS`, and `beastOf`. `beginMatch`, `applyMapSize`, and `loadGame` assign `MAP_W` and `MAP_H`. Those bindings have to stay the same exports or the draw loop reads a stale size. Save, load, `reap`, `rpgFate`, and `findPath` are methods on the one class and close over that map size. A modest extract still means moving code that assigns those bindings or that `loadGame` depends on. There is no typecheck to catch a broken live binding, and these headless tests do not draw or take input. That is the risky move the plan says to skip.

## Option C

The win/lose modal reads the engine ending toast when that toast is one of the five ending sentences. Otherwise it branches on `rpg`. A Tale victory uses `"Your people are home. The wild is yours."` or `"The wild is clear. The champion stands."`, not `"Their hall is down."` A Tale loss through `reap()` still shows `"Your town hall is lost."` when that is the toast. A Tale loss through `rpgFate` shows `"The champion is gone, and the altar with them."` Skirmish keeps `"Their hall has fallen."` / `"Your town hall is lost."` when those toasts are set, and the older modal sentences when the toast is empty or mid-match.

`endModalBody` lives in `src/game/end-card.ts` and `src/components/stickhold.tsx` calls it. No React render. `src/lib/og/site.json` title is `Stickhold`; `type` and `card` are unchanged. `public/favicon.svg` is an original three-post mark in `#2a5bd7` on `#0c1218`. It does not contain `#e07a2f`. `/bounty`, `src/game/bounty/`, `src/routes/bounty.tsx`, `src/components/bounty-game.tsx`, and the Halloween prompt files were not edited. Route titles and `APP_NAME` were already Stickhold and were not edited. `src/styles.css` was not edited.

Option C command:

```
node --experimental-strip-types --experimental-transform-types --import ./scripts/ts-ext-register.mjs --test src/game/end-card.test.ts
```

- tests 5
- pass 5
- fail 0

Full headless suite (lifecycle plus end card):

```
node --experimental-strip-types --experimental-transform-types --import ./scripts/ts-ext-register.mjs --test src/game/realm-lifecycle.test.ts src/game/end-card.test.ts
```

- tests 17
- pass 17
- fail 0

Commit: `40876782e17e06ad9328c0fc49eb7ba7ea70c101`

## Split

Halloween's Bounty is a sibling project. Stickhold no longer imports `bounty-game` or `src/game/bounty`, and `src/routeTree.gen.ts` no longer registers `/bounty`. `/` and `/stickhold` stay. Option C branding stays: `src/lib/og/site.json` title `Stickhold`, the Stickhold favicon, and the win/lose modal. `src/styles.css` was not edited, so the pumpkin, candle, and blood tokens are still defined there. `Realm.bountyFor` in `src/game/engine.ts` is Stickhold kill gold and was not changed. `BUILD_REVIEW.md` still describes the pre-split tree and was not rewritten.

Stickhold path: `/workspace/stickhold-fix-20261110`

Bounty path: `/workspace/halloweens-bounty-split-20261110`

Bounty baseline (its own repo, no remote): `3a55af315266f8d5b24fb486cf0268863c85f467`

Removed from Stickhold: `src/routes/bounty.tsx`, `src/components/bounty-game.tsx`, `src/game/bounty/` (`audio.ts`, `draw.ts`, `sim.ts`, `types.ts`), `halloweens-bounty-prompt.md`, and `halloweens-bounty-prompt.txt`. Those files live in the sibling folder. The sibling README states this is a paper/source split on 2026-11-10. It was not installed, booted, or published.

Test command, after the removal:

```
node --experimental-strip-types --experimental-transform-types --import ./scripts/ts-ext-register.mjs --test src/game/*.test.ts
```

The glob is `src/game/realm-lifecycle.test.ts` and `src/game/end-card.test.ts`.

- tests 17
- pass 17
- fail 0

Stickhold split commit: `770a9daf7b38a5326f19554d089e3c36faeea50f`

## Menu screens

UI and copy only. `src/game/engine.ts` was not edited. `Realm.beginMatch`, `start`, `restart`, `toMenu`, `loadGame`, `saveGame`, combat, pathing, tale fate, and reap were not changed. The win/lose card still calls `endModalBody(phase, snap?.toast ?? "", !!snap?.rpg)`. Stickhold title, favicon, and `#2a5bd7` stay. Menu classes do not use the pumpkin, candle, or blood tokens. Those tokens are still defined in `src/styles.css` and were not removed.

Commit: `9b11f82d152836f1ba74c50265b9cc8a910eda0c`

Test command:

```
node --experimental-strip-types --experimental-transform-types --import ./scripts/ts-ext-register.mjs --test src/game/*.test.ts src/components/*.test.ts
```

`src/lib/og/*.test.ts` matches no files, so that glob was left out. The command above is the previous game suite plus `src/components/menu-flow.test.ts`.

- tests 22
- pass 22
- fail 0

17 of those are the existing realm and end-card tests. 5 are the new menu-flow tests. No React render. `node_modules` is not installed.

### Title / main menu

Before: "Start new game" always opened setup. Three load buttons showed even when the slot was empty.

After: One primary action. Continue loads the lowest filled slot when a save exists. Otherwise Start skirmish or Start tale launches with the current setup in one step. A line above the buttons states that setup. Match setup is a separate full-height button. Empty slots are hidden. Other filled slots are Load buttons.

### Skirmish / setup

Before: The page repeated the title and the lore, then mode, side, people, mood, and sliders. Start game sat under the how-to-play lines, so a phone had to scroll to it.

After: Back returns to the title. A one-line summary shows the current mode, side, people, mood, map, and foe. The same choices sit in labeled groups. How to play is a disclosure. Start stays pinned to the bottom of the sheet and uses the same `start()` fields as before.

### Pause

Before: Resume sat under speed, audio, full screen, three saves, and Main menu. On the controls tab it also sat under the key list.

After: Resume is the blue primary and stays in the sheet head. Leave to menu is directly under it and says it does not save. Esc or P still resumes. Match, Audio, and Controls are tabs. The tab body scrolls, so the key list does not push Resume off the screen.

### Settings / controls / audio

Before: Speed, sound effects, and music shared the Game tab. Controls was a second tab with a short inner scroller. Key rows were shorter than a thumb target.

After: Match holds the three save slots, game speed, and full screen. Audio holds the two volume sliders. Controls holds the same computer and phone rows, at least 44px tall. Tabs, choices, sliders, and the how-to-play summary are keyboard reachable. Tab loops inside the open sheet. Focus moves to the primary button when the title, pause, or end sheet opens.

### Win / lose

Before: Main menu came first. Play again was an ember button under it. The ending sentence was small muted text.

After: Play again is the blue primary and comes first. Main menu is secondary. A Tale or Skirmish kicker sits above You won / You lost. The sentence is still `endModalBody`, so Tale and Skirmish endings are unchanged. The match time stays.

### Screenshots

Not taken. `node_modules` is absent, so Vite cannot boot and Tailwind in `src/styles.css` is not a built stylesheet. Google Chrome is installed, but there is no app bundle to open. No packages were installed, and nothing was downloaded. `/workspace/handoffs/stickhold-ui-20261110/` was left empty.

### Next step

A Game Director check is the next step (visual and live QA). This pass did not run a live game and does not claim qa-run-claim or game-qa.

## Preview auth stub

`src/lib/auth/preview.ts` is a local-only stub so `src/lib/auth/server.ts` can import `GROK_ISSUER_DEFAULT`, `PREVIEW_ALLOWED_HOSTS`, `PREVIEW_CLIENT_ID`, and `PREVIEW_CLIENT_SECRET`. The issuer, client id, and client secret are obvious placeholders (`local-stub-client-id`, `local-stub-not-a-secret`, `http://127.0.0.1/local-stub-issuer`). `PREVIEW_ALLOWED_HOSTS` is `localhost` and `127.0.0.1` only. No production host, client id, or secret was copied. `server.ts` was not edited. No `.env` was added. OAuth was not implemented. Vite base was not changed. No server was started.

Commit: `6f5b10304553113cc315ef7892ce025edb219073`

Test command (unchanged game and menu tests):

```
node --experimental-strip-types --experimental-transform-types --import ./scripts/ts-ext-register.mjs --test src/game/*.test.ts src/components/*.test.ts
```

- tests 22
- pass 22
- fail 0

Pre-existing `tsc` errors in `src/game/realm-lifecycle.test.ts` were not fixed in this commit.

## Play HUD

Screenshot fixes only. `src/game/engine.ts` was not edited. `beginMatch`, `start`, `restart`, combat, pathing, and save/load were not changed. `endModalBody` was not changed.

Commit: `bcb38ce3784f94ee666115033657d57a5be6dfe1`

The minimap `style.left` is `8` on the server and on the first client render. A `useEffect` then sets it to `max(8, window.innerWidth - 104)`. `window` is not read in the state that SSR serializes.

The match toast keeps a `7.5rem` right margin and no longer uses `line-clamp-2`, so "Gather wood and food. A dare is waiting under the resources." sits beside the minimap. The word Stickhold in the top bar is `hidden` below the `sm` breakpoint (640px) and `shrink-0` above it, so a 412px screen does not show "Stic...". At 1280px the full word is visible.

Checked in headless Chromium against the already-running dev server at `http://127.0.0.1:4650/` (412x915 and 1280x800) and `http://127.0.0.1:4650/stickhold` (1280x800). No hydration console error. The toast box did not overlap the minimap. The phone title was hidden. The wide title was "Stickhold". That server was left running.

Test command, green before this commit:

```
node --experimental-strip-types --experimental-transform-types --import ./scripts/ts-ext-register.mjs --test src/game/*.test.ts src/components/*.test.ts
```

- tests 22
- pass 22
- fail 0

## Static Pages build

`npm run build` writes a client-only site to `dist/` (gitignored, not committed). `vite.config.ts` is still the TanStack Start dev server with the Nitro `vercel` preset, used by `npm run dev`, `npm run build:dev`, and `npm run preview`. That path is a server deploy. The Pages command does not use it.

`npm run build` is:

```
VITE_AUTH_ENABLED=false node scripts/with-app-env.mjs vite build --config vite.static.config.ts
```

Vite `base` is `/stickhold/`. Output directory is `dist/`. The built `dist/index.html` loads `/stickhold/assets/index-CDXrzla0.js` and `/stickhold/assets/index-BFfmhEsc.css`, and the favicon is `/stickhold/favicon.svg`. `dist/404.html` is a byte copy of `index.html` for the GitHub Pages SPA fallback. Asset hashes will change on the next build.

The static entry is `src/static-main.tsx`. It mounts the existing `Stickhold` component. TanStack Router `basepath` is `/stickhold`. `/` and `/stickhold` both render the game, so `/stickhold/` and `/stickhold/stickhold` both play. Any other path under that base uses the same component. Chop, pick, and build samples are fetched from `${import.meta.env.BASE_URL}sfx/...`, which is `/sfx/...` when the base is `/` and `/stickhold/sfx/...` in this build. That is the only edit in `src/game/audio.ts`.

Auth stays off. The build script sets `VITE_AUTH_ENABLED=false`. `.grok/app-env.json` is only that flag, so the existing env wrapper agrees. The omitted `.grok/` tree was not copied. The static bundle does not import the auth client. A search of `dist/assets/*.js` found no `VITE_AUTH`, `local-stub`, `better-auth`, or `/api/auth`. No secrets were added. `npm run db:migrate` is unchanged and is no longer chained after `npm run build`.

Preview, then stopped (port 4673 is closed; port 4650 was not touched):

```
npx vite preview --config vite.static.config.ts --host 127.0.0.1 --port 4673 --strictPort
```

- `GET /stickhold/` 200
- `GET /stickhold/stickhold` 200
- `GET /stickhold/assets/index-CDXrzla0.js` 200
- `GET /stickhold/sfx/chop.mp3` 200

Headless Chromium loaded both URLs, started a skirmish, and showed the full gather toast clear of the minimap. Nothing was published. `games.conf` was not edited.

Same test command after the audio path change:

- tests 22
- pass 22
- fail 0

`tsc --noEmit` still reports the pre-existing errors in `src/game/realm-lifecycle.test.ts` only.

Pages commit: recorded in the follow-up.
