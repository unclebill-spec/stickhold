import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Pause } from "lucide-react";
import { NightScore } from "@/game/bounty/audio";
import { drawHorseman, drawWorld, screenToWorld } from "@/game/bounty/draw";
import { Sim } from "@/game/bounty/sim";
import {
  BUILD,
  FACTION_LIST,
  FACTION_META,
  SKILL_TIP,
  SKILLS,
  TIER_COLOR,
  ITEM_META,
  TRAIN,
  type BKind,
  type Faction,
  type Mood,
  type UnitKind,
} from "@/game/bounty/types";

type Phase = "title" | "setup" | "play";

export function BountyGame() {
  const [phase, setPhase] = useState<Phase>("title");
  const [you, setYou] = useState<Faction>("vampire");
  const [foe, setFoe] = useState<Faction>("wolf");
  const [mood, setMood] = useState<Mood>("normal");
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim | null>(null);
  const scoreRef = useRef<NightScore | null>(null);
  const keys = useRef(new Set<string>());
  const drag = useRef<{ x: number; y: number; sx: number; sy: number; moved: boolean; box: boolean } | null>(null);
  const hold = useRef<number | null>(null);
  const lastTap = useRef(0);

  useEffect(() => {
    const c = titleRef.current;
    if (!c || phase === "play") return;
    let raf = 0;
    const loop = (t: number) => {
      const parent = c.parentElement;
      if (parent) {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        if (c.width !== Math.floor(w * dpr)) {
          c.width = Math.floor(w * dpr);
          c.height = Math.floor(h * dpr);
        }
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          drawHorseman(ctx, w, h, t / 1000);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    const sim = new Sim(you, foe, mood);
    simRef.current = sim;
    setTick((n) => n + 1);
    const score = scoreRef.current ?? new NightScore();
    scoreRef.current = score;
    score.unlock();
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      sim.held = keys.current;
      sim.paused = pausedRef.current;
      sim.step(dt);
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        if (canvas.width !== Math.floor(w * dpr)) {
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
        }
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          const sx = sim.shake ? (Math.random() - 0.5) * 6 : 0;
          ctx.save();
          ctx.translate(sx, 0);
          drawWorld(ctx, sim, w, h);
          const d = drag.current;
          if (d?.box && d.moved) {
            ctx.strokeStyle = "#f2c14d";
            ctx.strokeRect(d.sx, d.sy, d.x - d.sx, d.y - d.sy);
          }
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const hud = window.setInterval(() => setTick((n) => n + 1), 200);
    const down = (e: KeyboardEvent) => {
      if (e.code === "Escape") setPaused((p) => !p);
      if (e.ctrlKey || e.metaKey) {
        const num = e.code.replace("Digit", "");
        if (e.code.startsWith("Digit")) {
          const list = sim.selectedUnits().map((u) => u.id);
          groups.current[num] = list;
          e.preventDefault();
        }
      } else if (e.code.startsWith("Digit") && groups.current[e.code.replace("Digit", "")]) {
        const ids = groups.current[e.code.replace("Digit", "")];
        sim.selection = ids.map((id) => ({ t: "u" as const, id }));
      }
      keys.current.add(e.code);
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.code);
    const blur = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    window.__controlsTest = {
      getYaw: () => sim.cam.x,
      getSpeed: () => (keys.current.size ? 1 : 0),
      setKeys: (codes: string[]) => {
        keys.current = new Set(codes);
      },
      getCam: () => ({ x: sim.cam.x, y: sim.cam.y }),
    };
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(hud);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [phase, you, foe, mood]);

  const pausedRef = useRef(false);
  const groups = useRef<Record<string, number[]>>({});
  pausedRef.current = paused;

  const pointerPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    const sim = simRef.current;
    if (!canvas || !sim) return null;
    const r = canvas.getBoundingClientRect();
    const sx = e.clientX - r.left;
    const sy = e.clientY - r.top;
    return { sx, sy, w: r.width, h: r.height, world: screenToWorld(sx, sy, sim.cam, r.width, r.height) };
  };

  const onDown = (e: PointerEvent) => {
    const p = pointerPos(e);
    if (!p || !simRef.current) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: p.sx, y: p.sy, sx: p.sx, sy: p.sy, moved: false, box: false };
    if (hold.current) window.clearTimeout(hold.current);
    hold.current = window.setTimeout(() => {
      if (drag.current && !drag.current.moved) drag.current.box = true;
    }, 280);
    simRef.current.hover = p.world;
  };

  const onMove = (e: PointerEvent) => {
    const p = pointerPos(e);
    if (!p || !simRef.current) return;
    simRef.current.hover = p.world;
    if (!drag.current) return;
    const dx = p.sx - drag.current.x;
    const dy = p.sy - drag.current.y;
    if (!drag.current.box && Math.hypot(p.sx - drag.current.sx, p.sy - drag.current.sy) > 8) {
      if (hold.current) window.clearTimeout(hold.current);
      drag.current.moved = true;
      simRef.current.cam.x -= dx / simRef.current.cam.z;
      simRef.current.cam.y -= dy / simRef.current.cam.z;
      drag.current.x = p.sx;
      drag.current.y = p.sy;
      return;
    }
    if (drag.current.box) {
      drag.current.moved = true;
      drag.current.x = p.sx;
      drag.current.y = p.sy;
    }
  };

  const onUp = (e: PointerEvent) => {
    const p = pointerPos(e);
    const sim = simRef.current;
    const d = drag.current;
    drag.current = null;
    if (!p || !sim || !d) return;
    if (hold.current) window.clearTimeout(hold.current);
    if (d.box && d.moved) {
      const a = screenToWorld(d.sx, d.sy, sim.cam, p.w, p.h);
      sim.selectBox(a.x, a.y, p.world.x, p.world.y);
      setTick((n) => n + 1);
      return;
    }
    if (d.moved) return;
    const now = performance.now();
    const u = sim.unitAt(p.world.x, p.world.y, 0.75);
    if (u && u.team === 0 && now - lastTap.current < 320) {
      sim.selectType(u.kind);
      lastTap.current = 0;
      setTick((n) => n + 1);
      return;
    }
    lastTap.current = now;
    if (sim.place || sim.selectedUnits().length) {
      sim.command(p.world.x, p.world.y);
      scoreRef.current?.blip();
    } else {
      sim.selectAt(p.world.x, p.world.y, false);
    }
    setTick((n) => n + 1);
  };

  const sim = simRef.current;
  void tick;

  return (
    <div className="relative h-full w-full overflow-hidden bg-night text-moon">
      {phase !== "play" && (
        <div className="absolute inset-0">
          <canvas ref={titleRef} className="h-full w-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-end gap-4 px-4 pb-8">
            <div className="w-full max-w-md rounded-panel border border-panel-edge bg-panel/90 p-5 backdrop-blur-sm">
              <p className="font-display text-3xl text-candle">Halloweens Bounty</p>
              <p className="mt-1 text-sm text-mist">A night raid for gold, lumber, and one hero.</p>
              {phase === "title" ? (
                <button
                  className="mt-4 h-12 w-full rounded-panel bg-pumpkin font-semibold text-ink"
                  onClick={() => {
                    scoreRef.current = scoreRef.current ?? new NightScore();
                    scoreRef.current.unlock();
                    setPhase("setup");
                  }}
                >
                  Begin
                </button>
              ) : (
                <Setup
                  you={you}
                  foe={foe}
                  mood={mood}
                  setYou={setYou}
                  setFoe={setFoe}
                  setMood={setMood}
                  onStart={() => setPhase("play")}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <div className="absolute inset-0" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}>
            <canvas ref={canvasRef} className="h-full w-full touch-none" />
          </div>
          {sim && (
            <>
          <header className="pointer-events-none absolute left-0 right-0 top-0 flex items-start justify-between gap-2 p-3">
            <button
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-panel border border-panel-edge bg-panel text-moon"
              onClick={() => setPaused(true)}
              aria-label="Pause"
            >
              <Pause size={18} />
            </button>
            <div className="pointer-events-none rounded-panel border border-panel-edge bg-panel/90 px-3 py-2 text-sm">
              <span className="text-candle">{sim.gold[0]} gold</span>
              <span className="mx-2 text-mist">·</span>
              <span>{sim.wood[0]} lumber</span>
              <span className="mx-2 text-mist">·</span>
              <span>
                {sim.popOf(0).used}/{sim.popOf(0).cap}
              </span>
            </div>
            <Minimap sim={sim} />
          </header>
          {sim.toastT > 0 && (
            <p className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 rounded-panel bg-panel/90 px-3 py-1 text-sm text-candle">
              {sim.toast}
            </p>
          )}
          <CommandBar sim={sim} onChange={() => setTick((n) => n + 1)} />
          {paused && (
            <PauseMenu
              score={scoreRef.current}
              speed={sim.speed}
              onSpeed={(s) => {
                sim.speed = s;
                setTick((n) => n + 1);
              }}
              onClose={() => setPaused(false)}
            />
          )}
          {sim.winner !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-night/70 p-4">
              <div className="max-w-sm rounded-panel border border-panel-edge bg-panel p-5 text-center">
                <p className="font-display text-2xl text-candle">{sim.winner === 0 ? "The night is yours" : "The hall has fallen"}</p>
                <button
                  className="mt-4 h-11 w-full rounded-panel bg-pumpkin font-semibold text-ink"
                  onClick={() => {
                    scoreRef.current?.stop();
                    scoreRef.current = null;
                    simRef.current = null;
                    setPaused(false);
                    setPhase("title");
                  }}
                >
                  Return
                </button>
              </div>
            </div>
          )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function Setup({
  you,
  foe,
  mood,
  setYou,
  setFoe,
  setMood,
  onStart,
}: {
  you: Faction;
  foe: Faction;
  mood: Mood;
  setYou: (f: Faction) => void;
  setFoe: (f: Faction) => void;
  setMood: (m: Mood) => void;
  onStart: () => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <Field label="Your faction">
        {FACTION_LIST.map((f) => (
          <Pick key={f} active={you === f} color={FACTION_META[f].color} label={FACTION_META[f].name} onClick={() => setYou(f)} />
        ))}
      </Field>
      <p className="text-xs text-mist">{FACTION_META[you].blurb}</p>
      <Field label="Enemy">
        {FACTION_LIST.map((f) => (
          <Pick key={f} active={foe === f} color={FACTION_META[f].color} label={FACTION_META[f].name} onClick={() => setFoe(f)} />
        ))}
      </Field>
      <Field label="Enemy mood">
        {(["passive", "normal", "aggressive"] as Mood[]).map((m) => (
          <Pick key={m} active={mood === m} color="#e07a2f" label={m} onClick={() => setMood(m)} />
        ))}
      </Field>
      <p className="text-xs text-mist">
        {mood === "passive"
          ? "They fight only if you come to their hall."
          : mood === "normal"
            ? "They strike if they see you, and they do not hunt."
            : "They will come looking for your hall."}
      </p>
      <button className="h-12 rounded-panel bg-pumpkin font-semibold text-ink" onClick={onStart}>
        Start the night
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-wide text-mist">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pick({ active, color, label, onClick }: { active: boolean; color: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`h-10 rounded-panel border px-3 text-sm capitalize ${active ? "border-candle text-candle" : "border-panel-edge text-moon"}`}
      style={{ boxShadow: active ? `inset 0 0 0 1px ${color}` : undefined }}
    >
      {label}
    </button>
  );
}

function Minimap({ sim }: { sim: Sim }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#141c28";
    ctx.fillRect(0, 0, 120, 120);
    for (let y = 0; y < 42; y++) {
      for (let x = 0; x < 42; x++) {
        const t = sim.tiles[y * 42 + x];
        ctx.fillStyle = t === 3 || t === 4 ? "#243028" : t === 11 ? "#f2c14d" : t === 6 ? "#5c656e" : "#1c2a22";
        ctx.fillRect(2 + x * 2.7, 2 + y * 2.7, 2.4, 2.4);
      }
    }
    for (const b of sim.buildings) {
      ctx.fillStyle = b.team === 0 ? "#d5e4f2" : "#9a3040";
      ctx.fillRect(2 + b.x * 2.7, 2 + b.y * 2.7, 4, 4);
    }
  });
  return (
    <button
      className="pointer-events-auto overflow-hidden rounded-panel border border-panel-edge"
      aria-label="Minimap"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 42;
        const y = ((e.clientY - r.top) / r.height) * 42;
        sim.cam.x = (x - y) * 29;
        sim.cam.y = (x + y) * 14.5 - 40;
      }}
    >
      <canvas ref={ref} width={120} height={120} className="h-24 w-24" />
    </button>
  );
}

function CommandBar({ sim, onChange }: { sim: Sim; onChange: () => void }) {
  const units = sim.selectedUnits();
  const blds = sim.selectedBuildings();
  const hero = units.find((u) => u.kind === "hero");
  const workers = units.length > 0 && units.every((u) => u.kind === "worker");
  const one = units.length === 1 ? units[0] : null;
  const b = blds.length === 1 ? blds[0] : null;
  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-panel-edge bg-panel/95 p-2 pb-3">
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <div className="flex items-center justify-between gap-2 text-sm">
          <p className="truncate text-moon">
            {one ? `${one.name}${one.kind === "hero" ? ` · level ${one.level}` : ""}` : b ? BUILD[b.kind].name : units.length ? `${units.length} selected` : "Tap a unit, then the ground. Drag to look around."}
          </p>
          <button
            className="h-10 rounded-panel border border-panel-edge px-3 text-sm"
            onClick={() => {
              sim.stop();
              onChange();
            }}
          >
            Stop
          </button>
        </div>
        {workers && (
          <div className="flex flex-wrap gap-2">
            {(["farm", "barracks", "altar", "lodge", "tower"] as BKind[]).map((k) => (
              <button
                key={k}
                className={`h-11 rounded-panel px-3 text-sm ${sim.place === k ? "bg-candle text-ink" : "border border-panel-edge"}`}
                onClick={() => {
                  sim.place = sim.place === k ? null : k;
                  onChange();
                }}
              >
                {BUILD[k].name}
                <span className="ml-1 text-mist">
                  {BUILD[k].gold}g {BUILD[k].wood}w
                </span>
              </button>
            ))}
          </div>
        )}
        {b && b.progress >= 1 && (
          <div className="flex flex-wrap gap-2">
            {b.kind === "hall" && (
              <>
                <TrainButton label="Thrall or worker" kind="worker" sim={sim} onChange={onChange} />
                <button
                  className="h-11 rounded-panel border border-panel-edge px-3 text-sm"
                  onClick={() => {
                    sim.raiseHall();
                    onChange();
                  }}
                >
                  Raise hall
                </button>
              </>
            )}
            {b.kind === "barracks" && <TrainButton label="Soldier" kind="melee" sim={sim} onChange={onChange} />}
            {b.kind === "lodge" && (
              <>
                <TrainButton label="Ranged" kind="ranged" sim={sim} onChange={onChange} />
                <TrainButton label="Caster" kind="caster" sim={sim} onChange={onChange} />
              </>
            )}
            {b.kind === "altar" && (
              <>
                <TrainButton label="Hire hero" kind="hero" sim={sim} onChange={onChange} />
                <button
                  className="h-11 rounded-panel border border-panel-edge px-3 text-sm"
                  onClick={() => {
                    sim.reviveHero();
                    onChange();
                  }}
                >
                  Revive hero
                </button>
              </>
            )}
            <p className="self-center text-xs text-mist">Tap the map to set where new units walk.</p>
          </div>
        )}
        {sim.shop && (
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["brew", 40],
                ["boots", 60],
                ["talons", 55],
                ["charm", 45],
                ["gloves", 110],
                ["mace", 120],
                ["shield", 130],
                ["ash", 80],
                ["heart", 100],
              ] as const
            ).map(([id, cost]) => (
              <button
                key={id}
                className="h-10 rounded-panel border border-panel-edge px-2 text-xs"
                style={{ color: TIER_COLOR[ITEM_META[id].tier] }}
                onClick={() => {
                  sim.buy(id);
                  onChange();
                }}
              >
                {ITEM_META[id].name} {cost}g
              </button>
            ))}
            <button
              className="h-10 rounded-panel border border-panel-edge px-2 text-xs"
              onClick={() => {
                sim.shop = false;
                onChange();
              }}
            >
              Close
            </button>
          </div>
        )}
        {hero && (
          <div className="flex flex-wrap gap-2">
            {SKILLS[hero.faction].map((name, i) => (
              <button
                key={name}
                className="h-11 rounded-panel border border-panel-edge px-3 text-left text-sm"
                onClick={() => {
                  if (hero.ranks[i] <= 0 || (hero.points > 0 && hero.ranks[i] < (i === 3 ? 1 : 3))) sim.learn(i);
                  else sim.cast(i);
                  onChange();
                }}
                title={SKILL_TIP[hero.faction][i]}
              >
                {name}
                <span className="ml-1 text-mist">
                  {hero.ranks[i]}/{i === 3 ? 1 : 3}
                  {hero.cds[i] > 0 ? ` ${Math.ceil(hero.cds[i])}s` : ""}
                </span>
              </button>
            ))}
            <span className="self-center text-xs text-mist">
              Points {hero.points} · mana {Math.floor(hero.mana)}
            </span>
          </div>
        )}
        {hero && (
          <div className="flex flex-wrap gap-2">
            {hero.items.map((id, i) =>
              id ? (
                <button
                  key={i}
                  className="h-10 rounded-panel border border-panel-edge px-2 text-xs"
                  style={{ color: TIER_COLOR[ITEM_META[id].tier] }}
                  onClick={() => {
                    sim.useItem(i);
                    onChange();
                  }}
                >
                  {ITEM_META[id].name}
                </button>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TrainButton({ label, kind, sim, onChange }: { label: string; kind: UnitKind; sim: Sim; onChange: () => void }) {
  const c = TRAIN[kind];
  return (
    <button
      className="h-11 rounded-panel border border-panel-edge px-3 text-sm"
      onClick={() => {
        sim.train(kind);
        onChange();
      }}
    >
      {label}
      <span className="ml-1 text-mist">
        {c.gold}g{c.wood ? ` ${c.wood}w` : ""}
      </span>
    </button>
  );
}

function PauseMenu({
  score,
  speed,
  onSpeed,
  onClose,
}: {
  score: NightScore | null;
  speed: number;
  onSpeed: (n: number) => void;
  onClose: () => void;
}) {
  const [music, setMusic] = useState(score?.musicVol ?? 0.35);
  const [sfx, setSfx] = useState(score?.sfxVol ?? 0.4);
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-night/75 p-4">
      <div className="w-full max-w-sm rounded-panel border border-panel-edge bg-panel p-5">
        <p className="font-display text-2xl text-candle">Paused</p>
        <label className="mt-4 block text-sm text-mist">
          Speed
          <input
            className="mt-1 w-full"
            type="range"
            min={0.5}
            max={2}
            step={0.5}
            value={speed}
            onChange={(e) => onSpeed(Number(e.target.value))}
          />
        </label>
        <label className="mt-3 block text-sm text-mist">
          Music
          <input
            className="mt-1 w-full"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={music}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMusic(v);
              score?.setMusic(v);
            }}
          />
        </label>
        <label className="mt-3 block text-sm text-mist">
          Sound
          <input
            className="mt-1 w-full"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={sfx}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSfx(v);
              score?.setSfx(v);
            }}
          />
        </label>
        <button className="mt-5 h-11 w-full rounded-panel bg-pumpkin font-semibold text-ink" onClick={onClose}>
          Resume
        </button>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys: (codes: string[]) => void;
      getCam: () => { x: number; y: number };
    };
  }
}
