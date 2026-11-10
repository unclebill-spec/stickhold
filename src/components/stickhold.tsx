import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Coins,
  Hammer,
  Mountain,
  Pause,
  Play,
  Flag,
  Maximize2,
  Minimize2,
  Swords,
  TreePine,
  Users,
  Wheat,
} from "lucide-react";
import { drawRealm } from "@/game/draw";
import { endModalBody } from "@/game/end-card";
import { Realm, realmApi, type CmdId, type Controls, type Snap } from "@/game/engine";

function speedName(v: number) {
  if (v <= 0.5) return "Slow";
  if (v <= 1) return "Normal";
  if (v <= 1.5) return "Brisk";
  if (v <= 2) return "Fast";
  return "Very fast";
}

function saveSlots() {
  try {
    return [1, 2, 3].map((n) => !!localStorage.getItem(n === 1 ? "stickhold-save" : `stickhold-save-${n}`));
  } catch {
    return [false, false, false];
  }
}

function richName(step: number) {
  if (step <= 0) return "Low · half";
  if (step <= 1) return "Normal";
  if (step <= 2) return "High · double";
  if (step <= 3) return "Crazy · triple";
  return "Insanity · ten times";
}

const RICH = [0.5, 1, 2, 3, 10];
const MAP_SIZES = [54, 108, 216, 432];

function sizeName(step: number) {
  if (step <= 0) return "Small · half";
  if (step <= 1) return "Medium";
  if (step <= 2) return "Large · double";
  return "Insanity · four times";
}

function diffName(step: number) {
  if (step <= 0) return "Easy";
  if (step <= 1) return "Medium";
  if (step <= 2) return "Hard · +200";
  return "Insanity · +1000";
}

function fmt(t: number) {
  const s = Math.max(0, Math.floor(t));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function keyName(code: string) {
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  if (code.startsWith("Numpad")) return `Num ${code.slice(6)}`;
  if (code.startsWith("Arrow")) return code.slice(5);
  if (code === "Space") return "Space";
  if (code === "Escape") return "Esc";
  if (code === "Tab") return "Tab";
  return code;
}

function actName(mode: Controls["doubleClick"]) {
  if (mode === "screen") return "This type on screen";
  if (mode === "all") return "All of this type";
  return "Next fight";
}

function Choice({ on, onClick, title, note, hot = "bg-ink text-parchment" }: { on: boolean; onClick: () => void; title: string; note: string; hot?: string }) {
  return (
    <button type="button" onClick={onClick} className={`flex min-h-12 w-full flex-col items-center justify-center rounded-panel px-1 py-1 text-center ${on ? hot : "bg-parchment-deep"}`}>
      <span className="text-sm leading-tight font-semibold">{title}</span>
      <span className={`text-[10px] leading-tight ${on ? "text-parchment/80" : "text-muted"}`}>{note}</span>
    </button>
  );
}

function BindRow({ label, value, hot, onClick }: { label: string; value: string; hot: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-2 rounded-panel bg-parchment-deep px-2 py-1.5 text-left text-sm"
    >
      <span className="min-w-0 truncate">{label}</span>
      <span className={`shrink-0 font-semibold ${hot ? "text-blue" : ""}`}>{hot ? "Press a key" : value}</span>
    </button>
  );
}

function FullButton({ onFail }: { onFail: () => void }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const sync = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element };
      setOn(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);
  return (
    <button
      type="button"
      className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-panel bg-parchment-deep text-base font-semibold"
      aria-label={on ? "Leave full screen" : "Full screen"}
      onClick={() => {
        const doc = document as Document & {
          webkitFullscreenElement?: Element;
          webkitExitFullscreen?: () => Promise<void> | void;
        };
        const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
        const active = doc.fullscreenElement || doc.webkitFullscreenElement;
        if (active) {
          const exit = doc.exitFullscreen?.bind(doc) || doc.webkitExitFullscreen?.bind(doc);
          if (exit) void Promise.resolve(exit()).catch(() => onFail());
          return;
        }
        const req = el.requestFullscreen?.bind(el) || el.webkitRequestFullscreen?.bind(el);
        if (!req) {
          onFail();
          return;
        }
        void Promise.resolve(req()).catch(() => onFail());
      }}
    >
      {on ? <Minimize2 className="size-4" aria-hidden /> : <Maximize2 className="size-4" aria-hidden />}
      {on ? "Leave full screen" : "Full screen"}
    </button>
  );
}
export function Stickhold() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<HTMLCanvasElement>(null);
  const realmRef = useRef<Realm | null>(null);
  const [snap, setSnap] = useState<Snap | null>(null);
  const [side, setSide] = useState<0 | 1>(0);
  const [people, setPeople] = useState<"stick" | "dynasty" | "coven" | "egypt">("stick");
  const [mood, setMood] = useState<"passive" | "normal" | "aggressive">("normal");
  const [playMode, setPlayMode] = useState<"realm" | "rpg">("realm");
  const [richStep, setRichStep] = useState(1);
  const [mapStep, setMapStep] = useState(1);
  const [sizeStep, setSizeStep] = useState(1);
  const [diffStep, setDiffStep] = useState(1);
  const [slots, setSlots] = useState(saveSlots);
  const [menuPage, setMenuPage] = useState<"front" | "setup">("front");
  const [usedBtn, setUsedBtn] = useState("");
  const [pauseTab, setPauseTab] = useState<"game" | "controls">("game");
  const [mapPos, setMapPos] = useState(() => ({
    x: typeof window === "undefined" ? 8 : Math.max(8, window.innerWidth - 104),
    y: 104,
  }));
  const [workers, setWorkers] = useState(0);
  const workersRef = useRef(-1);
  const [watch, setWatch] = useState("Dawn");
  const watchRef = useRef("");
  const mapDrag = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const realm = new Realm(11);
    realmRef.current = realm;
    realmApi.hold = realm;
    const unsub = realm.subscribe(() => setSnap(realm.snapshot()));
    const detach = realm.mount(canvas, drawRealm);
    setSnap(realm.snapshot());
    let raf = 0;
    const paintMap = () => {
      const c = mapRef.current;
      if (c) {
        const ctx = c.getContext("2d");
        if (ctx) {
          const dpr = Math.min(2, window.devicePixelRatio || 1);
          if (c.width !== Math.floor(c.clientWidth * dpr)) {
            c.width = Math.floor(c.clientWidth * dpr);
            c.height = Math.floor(c.clientHeight * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          }
          realm.paintMinimap(ctx, c.clientWidth, c.clientHeight);
        }
      }
      const n = realm.units.filter((u) => u.team === realm.playerTeam && u.kind === "villager" && u.hp > 0 && !u.held).length;
      if (n !== workersRef.current) {
        workersRef.current = n;
        setWorkers(n);
      }
      if (realm.phase === "play" || realm.phase === "paused") {
        const word = realm.watch();
        const sky = realm.weather().name;
        const line = sky === "Clear" ? word : `${word} · ${sky}`;
        if (line !== watchRef.current) {
          watchRef.current = line;
          setWatch(line);
        }
      }
      raf = requestAnimationFrame(paintMap);
    };
    raf = requestAnimationFrame(paintMap);
    return () => {
      cancelAnimationFrame(raf);
      unsub();
      detach();
      realmApi.hold = null;
    };
  }, []);

  const realm = realmRef.current;
  const phase = snap?.phase ?? "menu";
  const workerMenu = !!snap?.selection?.commands.some((c) => c.id === "house");
  const run = (fn: (g: Realm) => void) => {
    if (realmRef.current) fn(realmRef.current);
  };

  return (
    <main className="realm relative h-dvh w-full overflow-hidden overscroll-none bg-ink text-ink">
      <style>{`@keyframes flagflash{0%,49%{background:#9f2d22;color:#f4efe4}50%,100%{background:#f4efe4;color:#9f2d22}}`}</style>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" aria-label="Realm map" />

      <div className="pointer-events-none absolute inset-0 flex flex-col">
        <header className="pointer-events-auto shrink-0 bg-parchment/95 px-2 pt-[max(0.25rem,env(safe-area-inset-top))] pb-1.5 shadow-sm">
          <div className="flex items-center gap-1.5">
            {phase === "play" || phase === "paused" ? (
              <button
                type="button"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-panel bg-blue text-parchment"
                onClick={() => run((g) => g.togglePause())}
                aria-label={phase === "paused" ? "Resume" : "Pause"}
              >
                {phase === "paused" ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>
            ) : null}
            <h1 className="min-w-0 truncate font-display text-lg leading-none font-semibold tracking-tight">Stickhold</h1>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 text-xs font-semibold">
              <Users className="size-3.5" aria-hidden />
              <span>
                {snap?.pop ?? 0}/{snap?.cap ?? 0}
              </span>
              <span className="text-muted">{snap?.rpg ? "Tale" : snap?.age === 4 ? "Age 5" : snap?.age === 3 ? "Age 4" : snap?.age === 2 ? "Age 3" : snap?.age === 1 ? "Village" : "Camp"}</span>
              <span className="tabular-nums text-muted">{fmt(snap?.time ?? 0)}</span>
              <span className="text-muted">{phase === "play" || phase === "paused" ? watch : ""}</span>
              {snap && snap.speed !== 1 ? <span className="text-muted">{snap.speed}×</span> : null}
            </span>
            {phase === "play" || phase === "paused" ? (
              <>
              <button
                type="button"
                className="inline-flex h-10 shrink-0 items-center gap-1 rounded-panel bg-parchment-deep px-2 text-xs font-semibold"
                onClick={() => run((g) => g.command("idle"))}
                title="Select idle villagers, or every villager if they are all busy"
              >
                <Users className="size-3.5" aria-hidden />
                {workers > 0 ? `Workers ${workers}` : "Workers"}
              </button>
              <button
                type="button"
                className="inline-flex h-10 shrink-0 items-center gap-1 rounded-panel bg-parchment-deep px-2 text-xs font-semibold"
                onClick={() => run((g) => g.command("army"))}
                title="Select every soldier"
              >
                <Swords className="size-3.5" aria-hidden />
                Army
              </button>
              </>
            ) : null}
          </div>
          <div className="mt-1 grid grid-cols-4 gap-1">
            <Resource icon={<Wheat className="size-3.5" />} label="Food" value={snap?.food ?? 0} />
            <Resource icon={<TreePine className="size-3.5" />} label="Wood" value={snap?.wood ?? 0} />
            <Resource icon={<Coins className="size-3.5" />} label="Gold" value={snap?.gold ?? 0} />
            <Resource icon={<Mountain className="size-3.5" />} label="Stone" value={snap?.stone ?? 0} />
          </div>
          {phase === "play" || phase === "paused" ? (
            <div className="mt-1 flex flex-col gap-1">
              {snap?.rpg && snap.bosses ? (
                <p className="rounded-panel bg-ink px-2 py-1 text-center text-xs font-semibold text-parchment">
                  {snap.bosses}
                </p>
              ) : null}
              {snap?.dare ? (
                <p className="rounded-panel bg-blue px-2 py-1 text-center text-xs font-semibold text-parchment">
                  Dare · {snap.dare}
                </p>
              ) : null}
              {snap?.fury ? (
                <p className="rounded-panel bg-red-700 px-2 py-1 text-center text-xs font-semibold text-parchment">
                  Fury · your units hit harder · {snap.fury}s
                </p>
              ) : null}
            </div>
          ) : null}
        </header>

        {phase === "play" || phase === "paused" ? (
          <div className="pointer-events-none px-2 pt-1">
            <button
              type="button"
              className={`pointer-events-auto inline-flex h-9 items-center gap-1 rounded-panel px-2 text-[10px] font-semibold shadow-sm ${snap?.alarm ? "bg-red-700 text-parchment" : "bg-parchment text-ink"}`}
              style={snap?.alarm ? { animation: "flagflash 0.65s steps(2, end) infinite" } : undefined}
              onClick={() => run((g) => (g.controls.flag === "idle" ? g.selectIdle() : g.focusFight()))}
              aria-label={snap?.controls.flag === "idle" ? "Select an idle villager" : "Go to the next fight"}
            >
              <Flag className="size-3.5" aria-hidden />
              {snap?.controls.flag === "idle" ? "Idle" : "Fight"}
            </button>
          </div>
        ) : null}

        {snap?.need ? (
          <div className="pointer-events-none absolute inset-x-0 top-28 z-30 flex justify-center px-4">
            <p className="max-w-sm rounded-panel bg-parchment px-4 py-3 text-center text-sm font-semibold text-ink shadow-lg">
              {snap.need}
            </p>
          </div>
        ) : null}

        {snap?.toast ? (
          <p className="pointer-events-none mx-2 mt-2 line-clamp-2 max-w-lg rounded-panel bg-ink/90 px-3 py-1.5 text-center text-sm font-semibold text-parchment">
            {snap.toast}
          </p>
        ) : null}

        <div className="flex-1" />

        {snap?.selection ? (
          <section className={`pointer-events-auto mx-2 mb-[max(0.35rem,env(safe-area-inset-bottom))] rounded-panel bg-parchment/95 shadow-sm ${workerMenu ? "px-1 py-1" : "px-1.5 py-1.5"}`}>
            <div className={`flex items-center justify-between gap-2 ${workerMenu ? "mb-0.5" : "mb-1"}`}>
              <div className="min-w-0">
                <h2 className={`font-display leading-none font-semibold ${workerMenu ? "text-sm" : "text-base leading-tight"}`}>{workerMenu ? "Build" : snap.selection.title}</h2>
                <p className="truncate text-[10px] leading-tight text-muted">{workerMenu ? snap.selection.title : snap.selection.subtitle}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {snap.selection.maxHp > 0 ? (
                  <p className="text-[10px] font-semibold tabular-nums">
                    {snap.selection.hp}
                    <span className="text-muted">/{snap.selection.maxHp}</span>
                  </p>
                ) : null}
                {workerMenu ? (
                  <button type="button" className="inline-flex h-7 items-center rounded-panel bg-ink px-2 text-[10px] font-semibold text-parchment" onClick={() => run((g) => g.command("stop"))}>
                    Stop
                  </button>
                ) : null}
              </div>
            </div>
            {snap.selection.commands.length ? (
              <div className={`grid gap-0.5 ${workerMenu ? "grid-cols-6" : "grid-cols-5 gap-1"}`}>
                {snap.selection.commands.filter((cmd) => !(workerMenu && cmd.id === "stop")).map((cmd) => {
                  const build = BUILD_IDS.has(cmd.id);
                  const detail = cmd.disabled ? cmd.hint || "Locked" : cmd.cost;
                  return (
                  <button
                    key={cmd.id}
                    type="button"
                    disabled={cmd.disabled}
                    title={cmd.cost && cmd.hint && cmd.hint !== cmd.cost ? `${cmd.hint}. ${cmd.cost}` : cmd.hint || cmd.cost}
                    onClick={(e) => {
                      setUsedBtn("");
                      requestAnimationFrame(() => setUsedBtn(cmd.id));
                      window.setTimeout(() => setUsedBtn((id) => (id === cmd.id ? "" : id)), 420);
                      run((g) => g.command(cmd.id as CmdId, e.shiftKey ? 5 : 1));
                    }}
                    className={`relative inline-flex w-full min-w-0 flex-col items-center justify-center rounded-panel text-center text-parchment disabled:opacity-40 ${cmd.id === "stop" || cmd.id === "demolish" ? "bg-ink" : "bg-blue"} ${build || workerMenu ? "h-10 px-0.5 py-0.5" : "min-h-11 px-0.5 py-0.5"} ${usedBtn === cmd.id ? "btn-used" : ""}`}
                  >
                    {cmd.pie != null && cmd.pie < 0.995 ? (
                      <span
                        aria-hidden
                        className="absolute top-0.5 right-0.5 size-3 rounded-full"
                        style={{ background: `conic-gradient(#f7f1e4 ${cmd.pie * 360}deg, #8d8680 0deg)` }}
                      />
                    ) : null}
                    {build ? <BuildIcon id={cmd.id} /> : null}
                    <span className={`w-full truncate leading-none font-semibold ${build ? "text-[9px]" : "text-xs leading-tight"}`}>{cmd.label}</span>
                    {detail ? <span className={`w-full truncate leading-none text-parchment/80 ${build ? "text-[8px]" : "text-[10px] leading-tight"}`}>{detail}</span> : null}
                  </button>
                  );
                })}
              </div>
            ) : null}
            {snap.selection.queue.length ? (
              <div className="mt-1 flex items-end gap-1" aria-label="Training queue">
                {snap.selection.queue.map((kind, i) => (
                  <TinyMan key={`${kind}-${i}`} kind={kind} lead={i === 0} />
                ))}
              </div>
            ) : null}
            {snap.placing ? (
              <p className="mt-1 text-[11px] leading-tight text-muted">{PLACE_NOTE[snap.placing] ?? "Tap the next ground square. Stop cancels."}</p>
            ) : null}
          </section>
        ) : phase === "play" || phase === "paused" ? (
          <p className="pointer-events-none mx-2 mb-[max(0.5rem,env(safe-area-inset-bottom))] max-w-md rounded-panel bg-ink/80 px-3 py-1.5 text-xs font-semibold text-parchment">
            Left click selects. Shift adds. Spears beat horses, bows beat footmen, horses beat bows.
          </p>
        ) : null}
      </div>

      <canvas
        ref={mapRef}
        className="absolute z-20 size-24 cursor-grab touch-none rounded-panel border border-line bg-parchment shadow-sm active:cursor-grabbing"
        style={{ left: mapPos.x, top: mapPos.y }}
        aria-label="Minimap. Drag to move it. Tap to jump the view."
        onPointerDown={(e) => {
          mapDrag.current = { x: e.clientX, y: e.clientY, ox: mapPos.x, oy: mapPos.y, moved: false };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = mapDrag.current;
          if (!d) return;
          const dx = e.clientX - d.x;
          const dy = e.clientY - d.y;
          if (Math.hypot(dx, dy) > 6) d.moved = true;
          if (!d.moved) return;
          const el = e.currentTarget;
          const w = el.offsetWidth;
          const h = el.offsetHeight;
          setMapPos({
            x: Math.min(window.innerWidth - w, Math.max(0, d.ox + dx)),
            y: Math.min(window.innerHeight - h, Math.max(0, d.oy + dy)),
          });
        }}
        onPointerUp={(e) => {
          const d = mapDrag.current;
          mapDrag.current = null;
          if (!d || d.moved) return;
          const c = mapRef.current;
          const realm = realmRef.current;
          if (!c || !realm) return;
          const r = c.getBoundingClientRect();
          realm.minimapClick(e.clientX - r.left, e.clientY - r.top, c.clientWidth, c.clientHeight);
        }}
      />

      {phase === "menu" ? (
        <div
          className="absolute inset-0 z-40 overflow-y-auto bg-ink/35 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          onPointerDown={() => run((g) => { g.ensureAudio(); g.score.startMenu(); })}
        >
          <div className="mx-auto flex min-h-full w-full max-w-md items-center">
          {menuPage === "front" ? (
          <div className="w-full rounded-panel bg-parchment p-4 shadow-sm">
            <p className="text-sm font-semibold tracking-wide text-blue uppercase">Start</p>
            <h2 className="font-display text-4xl leading-none font-semibold">Stickhold</h2>
            <p className="mt-2 text-base leading-snug text-muted">Start a new game, or return to a saved one.</p>
            <button
              type="button"
              className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-panel bg-blue text-base font-semibold text-parchment"
              onClick={() => setMenuPage("setup")}
            >
              Start new game
            </button>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  disabled={!slots[i]}
                  className="inline-flex h-12 items-center justify-center rounded-panel bg-ink text-sm font-semibold text-parchment disabled:opacity-40"
                  onClick={() => run((g) => g.loadGame(i + 1))}
                >
                  Load {i + 1}
                </button>
              ))}
            </div>
          </div>
          ) : (
          <div className="w-full rounded-panel bg-parchment p-4 shadow-sm">
            <button type="button" className="text-sm font-semibold text-blue" onClick={() => setMenuPage("front")}>
              Back
            </button>
            <p className="mt-2 text-sm font-semibold tracking-wide text-blue uppercase">Camp age</p>
            <h2 className="font-display text-4xl leading-none font-semibold">Stickhold</h2>
            <p className="mt-2 text-base leading-snug text-muted">
              A small stick-figure realm. Gather four resources, raise a handful of buildings, and take the other town hall
              across the ford.
            </p>
            <p className="mt-2 text-sm font-semibold">How do you want to play?</p>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <Choice on={playMode === "realm"} title="Skirmish" note="Take their hall" onClick={() => setPlayMode("realm")} />
              <Choice on={playMode === "rpg"} title="Tale" note="Free your people" onClick={() => setPlayMode("rpg")} />
            </div>
            <p className="mt-3 text-sm font-semibold">Where do you start?</p>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <Choice on={side === 0} title="South" note={people === "stick" ? "Blue champion" : "Bottom of the map"} onClick={() => setSide(0)} hot="bg-blue text-parchment" />
              <Choice on={side === 1} title="North" note={people === "stick" ? "Red chieftain" : "Top of the map"} onClick={() => setSide(1)} hot="bg-ember text-parchment" />
            </div>
            {people !== "stick" ? <p className="mt-1 text-xs leading-snug text-muted">The other camp stays ordinary sticks.</p> : null}
            <p className="mt-3 text-sm font-semibold">Who are your people?</p>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <Choice on={people === "stick"} title="Stickhold" note="The original camps" onClick={() => setPeople("stick")} />
              <Choice on={people === "dynasty"} title="Dynasty" note="Long bows, a halberd" onClick={() => setPeople("dynasty")} hot="bg-ember text-parchment" />
              <Choice on={people === "coven"} title="Circle" note="Soldiers that cast" onClick={() => setPeople("coven")} hot="bg-[#6d3fa8] text-parchment" />
              <Choice on={people === "egypt"} title="Egypt" note="Chariots and gold" onClick={() => setPeople("egypt")} hot="bg-[#1a4f7a] text-parchment" />
            </div>
            {playMode === "realm" ? (
            <>
            <p className="mt-3 text-sm font-semibold">How does the enemy act?</p>
            <div className="mt-1 grid grid-cols-3 gap-2">
              <Choice on={mood === "passive"} title="Passive" note="Fights if hit" onClick={() => setMood("passive")} />
              <Choice on={mood === "normal"} title="Normal" note="Fights on sight" onClick={() => setMood("normal")} />
              <Choice on={mood === "aggressive"} title="Hunts" note="Comes for you" onClick={() => setMood("aggressive")} />
            </div>
            </>
            ) : null}
            <Slider
              label="Starting resources"
              hint="What you have at the first moment"
              valueLabel={richName(richStep)}
              min={0}
              max={4}
              step={1}
              value={richStep}
              onChange={(v) => {
                setRichStep(v);
                run((g) => {
                  g.rich = RICH[v] ?? 1;
                  g.applyRich();
                  g.emit();
                });
              }}
            />
            <Slider
              label="Map resources"
              hint="How much is lying on the ground"
              valueLabel={richName(mapStep)}
              min={0}
              max={4}
              step={1}
              value={mapStep}
              onChange={(v) => {
                setMapStep(v);
                run((g) => {
                  g.mapRich = RICH[v] ?? 1;
                  g.applyRich();
                  g.emit();
                });
              }}
            />
            <Slider
              label="Map size"
              hint="Small is half. Insanity is four times as wide"
              valueLabel={sizeName(sizeStep)}
              min={0}
              max={3}
              step={1}
              value={sizeStep}
              onChange={(v) => {
                setSizeStep(v);
                run((g) => {
                  g.mapSpan = MAP_SIZES[v] ?? 108;
                });
              }}
            />
            {playMode === "realm" ? (
            <>
            <Slider
              label="Enemy strength"
              hint="Higher means a smarter enemy with more goods"
              valueLabel={diffName(diffStep)}
              min={0}
              max={3}
              step={1}
              value={diffStep}
              onChange={(v) => {
                setDiffStep(v);
                run((g) => {
                  g.difficulty = v;
                });
              }}
            />
            <p className="mt-1 text-sm leading-snug text-muted">
              {diffStep <= 0
                ? "A slower enemy with a smaller army."
                : diffStep <= 1
                  ? "The current enemy."
                  : diffStep <= 2
                    ? "Smarter, and 200 extra of each resource."
                    : "Much smarter, 1000 extra of each resource, and they start in the Village Age."}
            </p>
            </>
            ) : null}
            <ul className="mt-3 space-y-1 text-sm leading-snug">
              <li className="flex gap-2">
                <Swords className="mt-0.5 size-4 shrink-0" aria-hidden />
                Tap a person to select them. Drag a box around several. Tap the ground, a tree, or an enemy to give an order.
              </li>
              <li className="flex gap-2">
                <Hammer className="mt-0.5 size-4 shrink-0" aria-hidden />
                Villagers build. The town hall trains people and advances the age. Pause is the button at the top left.
              </li>
            </ul>
            <button
              type="button"
              className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-panel bg-blue text-base font-semibold text-parchment"
              onClick={() =>
                run((g) => {
                  g.playerTeam = side;
                  g.faction = people;
                  g.rpg = playMode === "rpg";
                  g.mood = mood;
                  g.rich = RICH[richStep] ?? 1;
                  g.mapRich = RICH[mapStep] ?? 1;
                  g.mapSpan = MAP_SIZES[sizeStep] ?? 108;
                  g.difficulty = diffStep;
                  g.provoked = false;
                  g.start();
                })
              }
            >
              Start game
            </button>
          </div>
          )}
          </div>
        </div>
      ) : null}

      {phase === "paused" && snap ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-ink/50 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="w-full max-w-sm rounded-panel bg-parchment p-5 shadow-sm">
            <h2 className="font-display text-3xl leading-none font-semibold">Paused</h2>
            <p className="mt-1 text-sm text-muted">Nothing moves until you resume.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`inline-flex h-10 items-center justify-center rounded-panel text-sm font-semibold ${pauseTab === "game" ? "bg-ink text-parchment" : "bg-parchment-deep"}`}
                onClick={() => setPauseTab("game")}
              >
                Game
              </button>
              <button
                type="button"
                className={`inline-flex h-10 items-center justify-center rounded-panel text-sm font-semibold ${pauseTab === "controls" ? "bg-ink text-parchment" : "bg-parchment-deep"}`}
                onClick={() => setPauseTab("controls")}
              >
                Controls
              </button>
            </div>
            {pauseTab === "game" ? (
              <>
            <Slider
              label="Game speed"
              valueLabel={`${speedName(snap.speed)} · ${snap.speed}×`}
              min={0.5}
              max={3}
              step={0.5}
              value={snap.speed}
              onChange={(v) => run((g) => g.setSpeed(v))}
            />
            <Slider
              label="Sound effects"
              valueLabel={`${Math.round(snap.sfx * 100)}%`}
              min={0}
              max={1}
              step={0.05}
              value={snap.sfx}
              onChange={(v) => run((g) => g.setSfx(v))}
            />
            <Slider
              label="Music"
              valueLabel={`${Math.round(snap.music * 100)}%`}
              min={0}
              max={1}
              step={0.05}
              value={snap.music}
              onChange={(v) => run((g) => g.setMusic(v))}
            />
              </>
            ) : snap.controls ? (
              <div className="mt-3 flex max-h-64 flex-col gap-1.5 overflow-y-auto pr-1">
                <p className="text-xs leading-snug text-muted">Tap a key row, then press the new key. Arrow keys always move the view.</p>
                <p className="text-xs font-semibold tracking-wide text-blue uppercase">Computer</p>
                <BindRow label="Pan up" value={keyName(snap.controls.panUp)} hot={snap.capture === "panUp"} onClick={() => run((g) => { g.capture = "panUp"; g.emit(); })} />
                <BindRow label="Pan down" value={keyName(snap.controls.panDown)} hot={snap.capture === "panDown"} onClick={() => run((g) => { g.capture = "panDown"; g.emit(); })} />
                <BindRow label="Pan left" value={keyName(snap.controls.panLeft)} hot={snap.capture === "panLeft"} onClick={() => run((g) => { g.capture = "panLeft"; g.emit(); })} />
                <BindRow label="Pan right" value={keyName(snap.controls.panRight)} hot={snap.capture === "panRight"} onClick={() => run((g) => { g.capture = "panRight"; g.emit(); })} />
                <BindRow label="Pause" value={keyName(snap.controls.pause)} hot={snap.capture === "pause"} onClick={() => run((g) => { g.capture = "pause"; g.emit(); })} />
                <BindRow label="Pause also" value={keyName(snap.controls.pauseAlt)} hot={snap.capture === "pauseAlt"} onClick={() => run((g) => { g.capture = "pauseAlt"; g.emit(); })} />
                <BindRow label="Idle villagers" value={keyName(snap.controls.idle)} hot={snap.capture === "idle"} onClick={() => run((g) => { g.capture = "idle"; g.emit(); })} />
                <BindRow label="Cycle unit type" value={keyName(snap.controls.cycle)} hot={snap.capture === "cycle"} onClick={() => run((g) => { g.capture = "cycle"; g.emit(); })} />
                {snap.controls.group.map((code, i) => (
                  <BindRow
                    key={i}
                    label={`Group ${i}`}
                    value={keyName(code)}
                    hot={snap.capture === `group${i}`}
                    onClick={() => run((g) => { g.capture = `group${i}`; g.emit(); })}
                  />
                ))}
                <BindRow
                  label="Save group with"
                  value={snap.controls.groupMod === "alt" ? "Alt" : snap.controls.groupMod === "shift" ? "Shift" : "Ctrl"}
                  hot={false}
                  onClick={() => run((g) => g.patchControls({ groupMod: g.controls.groupMod === "ctrl" ? "alt" : g.controls.groupMod === "alt" ? "shift" : "ctrl" }))}
                />
                <BindRow
                  label="Drag box select"
                  value={snap.controls.selectButton === 2 ? "Right button" : "Left button"}
                  hot={false}
                  onClick={() => run((g) => g.patchControls({ selectButton: g.controls.selectButton === 0 ? 2 : 0 }))}
                />
                <BindRow
                  label="Command click"
                  value={snap.controls.commandButton === 0 ? "Left button" : "Right button"}
                  hot={false}
                  onClick={() => run((g) => g.patchControls({ commandButton: g.controls.commandButton === 2 ? 0 : 2 }))}
                />
                <BindRow
                  label="Mouse wheel"
                  value={snap.controls.wheelDir < 0 ? "Scroll up zooms out" : "Scroll up zooms in"}
                  hot={false}
                  onClick={() => run((g) => g.patchControls({ wheelDir: g.controls.wheelDir < 0 ? 1 : -1 }))}
                />
                <BindRow label="Double-click a unit" value={actName(snap.controls.doubleClick)} hot={false} onClick={() => run((g) => g.cycleMode("doubleClick"))} />
                <p className="mt-2 text-xs font-semibold tracking-wide text-blue uppercase">Phone</p>
                <NoteRow label="Slide one finger" value="Moves the view" />
                <NoteRow label="Hold, then drag" value="Selects a group" />
                <BindRow
                  label="Pinch"
                  value={snap.controls.pinchDir < 0 ? "Spread zooms out" : "Spread zooms in"}
                  hot={false}
                  onClick={() => run((g) => g.patchControls({ pinchDir: g.controls.pinchDir < 0 ? 1 : -1 }))}
                />
                <BindRow label="Double-tap a unit" value={actName(snap.controls.doubleTap)} hot={false} onClick={() => run((g) => g.cycleMode("doubleTap"))} />
                <BindRow
                  label="Flag button"
                  value={snap.controls.flag === "idle" ? "Finds idle villagers" : "Jumps to a fight"}
                  hot={false}
                  onClick={() => run((g) => g.patchControls({ flag: g.controls.flag === "fight" ? "idle" : "fight" }))}
                />
              </div>
            ) : null}
            <FullButton onFail={() => run((g) => g.say("Full screen is not available in this view."))} />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="inline-flex h-12 items-center justify-center rounded-panel bg-ink text-sm font-semibold text-parchment"
                  onClick={() =>
                    run((g) => {
                      if (g.saveGame(n)) setSlots(saveSlots());
                    })
                  }
                >
                  Save {n}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-panel bg-parchment-deep text-base font-semibold"
              onClick={() => {
                setMenuPage("front");
                run((g) => g.toMenu());
              }}
            >
              Main menu
            </button>
            <button
              type="button"
              className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-panel bg-blue text-base font-semibold text-parchment"
              onClick={() => run((g) => g.togglePause())}
            >
              <Play className="size-4" aria-hidden />
              Resume
            </button>
            <p className="mt-2 text-center text-sm text-muted">{snap.controls ? `${keyName(snap.controls.pauseAlt)} or ${keyName(snap.controls.pause)} also resumes.` : "P or Esc also resumes."}</p>
          </div>
        </div>
      ) : null}

      {phase === "win" || phase === "lose" ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-ink/45 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="w-full max-w-sm rounded-panel bg-parchment p-5 text-center shadow-sm">
            <h2 className="font-display text-3xl font-semibold">{phase === "win" ? "You won" : "You lost"}</h2>
            <p className="mt-2 text-sm text-muted">{endModalBody(phase, snap?.toast ?? "", !!snap?.rpg)}</p>
            <p className="mt-1 text-sm font-semibold tabular-nums">{fmt(snap?.time ?? 0)}</p>
            <button
              type="button"
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-panel bg-parchment-deep text-base font-semibold"
              onClick={() => {
                setMenuPage("front");
                run((g) => g.toMenu());
              }}
            >
              Main menu
            </button>
            <button
              type="button"
              className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-panel bg-ember text-base font-semibold text-parchment"
              onClick={() => run((g) => g.restart())}
            >
              Play again
            </button>
          </div>
        </div>
      ) : null}

      <span className="sr-only">{realm ? "ready" : "loading"}</span>
    </main>
  );
}

const BUILD_IDS = new Set(["wall", "house", "farm", "dump", "barracks", "altar", "temple", "shop", "tower", "range", "stable", "yard", "smith", "husbandry", "school", "keep"]);
const PLACE_NOTE: Record<string, string> = {
  wall: "Walls block paths. Tap the next square. Stop cancels.",
  house: "Houses raise how many people you can field. Tap the ground.",
  farm: "A farm is a food field. Tap the ground.",
  dump: "The store holds what villagers gather. Tap the ground.",
  barracks: "Barracks train soldiers. Tap the ground.",
  altar: "The altar hires your hero. Tap the ground.",
  temple: "The temple calls priests and, later, your god. Tap the ground.",
  shop: "The shop sells gear for gold. Tap the ground.",
  tower: "Towers shoot enemies that come close. Tap the ground.",
  range: "The archery range trains bowmen. Tap the ground.",
  stable: "The stable trains riders. Tap the ground.",
  yard: "The siege yard builds rams and catapults. Tap the ground.",
  smith: "The smith makes arms and walls stronger. Tap the ground.",
  husbandry: "Herds make your people tougher and gathering richer. Tap the ground.",
  school: "The school trains mages. Tap the ground.",
  keep: "The keep trains the guard. Tap the ground.",
};

function BuildIcon({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {id === "wall" ? <path d="M3 14V7M8 14V5M13 14V7M2 14h12" /> : null}
      {id === "house" ? <path d="M2.5 14V8L8 3.5 13.5 8V14M6 14v-3.5h4V14" /> : null}
      {id === "farm" ? <path d="M8 14V3M8 6C5 6 4 9 4 9M8 8c3 0 4 3 4 3M8 4.5C6 3.5 5.5 5.5 5.5 5.5" /> : null}
      {id === "dump" ? <path d="M3 6h10v8H3zM3 9h10M6 6V4h4v2" /> : null}
      {id === "barracks" ? <path d="M8 2v8M6 4.5h4M6.5 13h3M11 7.5a2 2.5 0 1 1 0 5" /> : null}
      {id === "altar" ? <path d="M8 2.5 12 7.5 8 13.5 4 7.5z" /> : null}
      {id === "temple" ? <path d="M8 2.2a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2M8 5.6V12M4.5 13.5h7M8 3.8V2M6.2 4.2 5 3.2M9.8 4.2 11 3.2" /> : null}
      {id === "shop" ? <path d="M8 5.2a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2M8 6.6v2.6" /> : null}
      {id === "tower" ? <path d="M6 14V6h4v8M5 6h6M7 4h2v2M8 4V2" /> : null}
      {id === "range" ? <path d="M5 3c4 2.2 4 7.8 0 10M5 8h7M12 8l-1.4-1.2M12 8l-1.4 1.2" /> : null}
      {id === "stable" ? <path d="M2 12l2.5-4h5l2-2.2h2.5M5 8v4M9.5 8v4M13 5.5v2" /> : null}
      {id === "yard" ? <path d="M2 12h8l4-6M13 4.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4M4 13.5a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6" /> : null}
      {id === "smith" ? <path d="M3 13 9 7M7.5 5.5l3-3 2.2 2.2-3 3M3 12.5h6" /> : null}
      {id === "husbandry" ? <path d="M3 9.5h7v3.5H3zM10 11h2.5M4.5 9.5V7.5M8 9.5V7.5M3 8.2h2" /> : null}
      {id === "school" ? <path d="M8 14V5.2M8 3.4a1.4 1.4 0 1 1 .01 0" /> : null}
      {id === "keep" ? <path d="M5 14V5h4v9M5 5h4M9 5l4 1.4L9 8" /> : null}
    </svg>
  );
}

function TinyMan({ kind, lead }: { kind: string; lead: boolean }) {
  const tunic =
    kind === "hero" ? "#e2b340" : kind === "archer" ? "#5c8fbf" : kind === "warrior" ? "#c47a3a" : kind === "sword" ? "#c5ccd1" : kind === "cavalry" ? "#8a5a3a" : kind === "club" ? "#6b4630" : "#e6c15a";
  return (
    <svg width={lead ? 16 : 13} height={lead ? 24 : 20} viewBox="0 0 16 24" aria-hidden className={lead ? "" : "opacity-80"}>
      <circle cx="8" cy="4" r="2.6" fill="#f7f1e4" stroke="#1c1915" strokeWidth="1" />
      <line x1="8" y1="7" x2="8" y2="14" stroke={tunic} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="8" y1="9" x2="3.5" y2="13" stroke="#1c1915" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="8" y1="9" x2="12.5" y2="13" stroke="#1c1915" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="8" y1="14" x2="5" y2="21" stroke="#1c1915" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="8" y1="14" x2="11" y2="21" stroke="#1c1915" strokeWidth="1.1" strokeLinecap="round" />
      {kind === "scout" ? <line x1="12.5" y1="13" x2="14.5" y2="8" stroke="#e4eaf0" strokeWidth="1.3" strokeLinecap="round" /> : null}
    </svg>
  );
}

function NoteRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex w-full items-center justify-between gap-2 px-2 py-1 text-left text-sm text-muted">
      <span className="min-w-0 truncate">{label}</span>
      <span className="shrink-0">{value}</span>
    </p>
  );
}

function Slider({
  label,
  hint,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="mt-3 block">
      <span className="flex items-baseline justify-between gap-3 text-sm font-semibold">
        <span>{label}</span>
        <span className="text-muted">{valueLabel}</span>
      </span>
      {hint ? <span className="mt-0.5 block text-xs leading-tight text-muted">{hint}</span> : null}
      <input
        className="mt-1 h-11 w-full accent-blue"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueLabel}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function Resource({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <span className="inline-flex h-8 w-full min-w-0 items-center justify-center gap-1 rounded-panel bg-parchment-deep px-1 text-xs font-semibold tabular-nums">
      <span className="text-blue" aria-hidden>
        {icon}
      </span>
      <span className="truncate text-[10px] text-muted">{label}</span>
      {value}
    </span>
  );
}
