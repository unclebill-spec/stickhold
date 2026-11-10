import {
  BUILD,
  COLS,
  type BKind,
  type Building,
  type Corpse,
  type Drop,
  type Faction,
  type Fx,
  type ItemId,
  ITEM_META,
  type Mood,
  type Order,
  type Proj,
  ROWS,
  type Sel,
  TRAIN,
  type Unit,
  type UnitKind,
  UNIT_NAME,
} from "./types";

const XP = [0, 50, 110, 190, 290, 420];

let seq = 1;
const nid = () => seq++;

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function dist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.hypot(dx, dy);
}
function tileKey(x: number, y: number) {
  return (y << 8) | x;
}

export class Sim {
  tiles = new Uint8Array(COLS * ROWS);
  woodLeft = new Uint8Array(COLS * ROWS);
  walk = new Uint8Array(COLS * ROWS);
  units: Unit[] = [];
  buildings: Building[] = [];
  drops: Drop[] = [];
  fx: Fx[] = [];
  projs: Proj[] = [];
  corpses: Corpse[] = [];
  gold = [320, 320];
  wood = [220, 220];
  player: Faction;
  enemy: Faction;
  mood: Mood;
  selection: Sel[] = [];
  place: BKind | null = null;
  hover = { x: 0, y: 0 };
  toast = "";
  toastT = 0;
  winner: 0 | 1 | null = null;
  time = 0;
  speed = 1;
  paused = false;
  shake = 0;
  aiT = 0;
  musicFaction: Faction;
  held = new Set<string>();
  cam = { x: 80, y: 40, z: 1 };
  reveal = 0;
  shop = false;

  constructor(player: Faction, enemy: Faction, mood: Mood) {
    this.player = player;
    this.enemy = enemy;
    this.mood = mood;
    this.musicFaction = player;
    this.generate();
    this.rebuildWalk();
    const hall = this.buildings.find((b) => b.team === 0 && b.kind === "hall");
    if (hall) {
      this.cam.x = this.camFocus(hall.x + 1, hall.y + 1).x;
      this.cam.y = this.camFocus(hall.x + 1, hall.y + 1).y;
    }
  }

  private camFocus(x: number, y: number) {
    const sx = (x - y) * 29;
    const sy = (x + y) * 14.5;
    return { x: sx, y: sy - 40 };
  }

  private at(x: number, y: number) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return 2;
    return this.tiles[y * COLS + x];
  }

  private setTile(x: number, y: number, v: number) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
    this.tiles[y * COLS + x] = v;
  }

  private generate() {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const edge = x < 1 || y < 1 || x >= COLS - 1 || y >= ROWS - 1;
        this.setTile(x, y, edge ? 2 : 0);
      }
    }
    const path = (x: number, y: number) => {
      if (this.at(x, y) !== 2) this.setTile(x, y, 1);
    };
    let x = 8;
    let y = 8;
    path(x, y);
    while (x < 32 || y < 32) {
      if (x < 32 && (y >= 32 || Math.abs(x - 20) > Math.abs(y - 20))) x++;
      else y++;
      path(x, y);
      path(x + 1, y);
    }
    this.clearBase(6, 6);
    this.clearBase(31, 31);
    this.addHall(0, 6, 6, this.player);
    this.addHall(1, 31, 31, this.enemy);
    this.goldMine(11, 5);
    this.goldMine(29, 35);
    for (let i = 0; i < 90; i++) {
      const tx = 2 + Math.floor(Math.random() * (COLS - 4));
      const ty = 2 + Math.floor(Math.random() * (ROWS - 4));
      if (this.at(tx, ty) !== 0) continue;
      if (this.nearBase(tx, ty, 6)) continue;
      const wake = Math.random() < 0.14;
      this.setTile(tx, ty, wake ? 4 : 3);
      this.woodLeft[ty * COLS + tx] = 40;
    }
    const stones = [7, 8, 9, 10];
    for (let i = 0; i < 46; i++) {
      const tx = 2 + Math.floor(Math.random() * (COLS - 4));
      const ty = 2 + Math.floor(Math.random() * (ROWS - 4));
      if (this.at(tx, ty) !== 0) continue;
      if (this.nearBase(tx, ty, 5)) continue;
      this.setTile(tx, ty, stones[i % 4]);
    }
    for (let i = 0; i < 7; i++) {
      const tx = 4 + Math.floor(Math.random() * (COLS - 8));
      const ty = 4 + Math.floor(Math.random() * (ROWS - 8));
      if (this.at(tx, ty) !== 0 || this.nearBase(tx, ty, 7)) continue;
      this.setTile(tx, ty, 6);
    }
    for (let p = 0; p < 5; p++) {
      const cx = 4 + Math.floor(Math.random() * (COLS - 8));
      const cy = 4 + Math.floor(Math.random() * (ROWS - 8));
      for (let k = 0; k < 6; k++) {
        const tx = cx + (k % 3);
        const ty = cy + Math.floor(k / 3);
        if (this.at(tx, ty) === 0) this.setTile(tx, ty, 5);
      }
    }
    this.camp(14, 16, 1, [
      ["melee", "", "Ghoul"],
      ["melee", "", "Ghoul"],
      ["melee", "", "Ghoul"],
    ]);
    this.camp(24, 12, 2, [
      ["ranged", "", "Raven"],
      ["ranged", "", "Raven"],
      ["melee", "", "Scarecrow"],
    ]);
    this.camp(12, 26, 3, [
      ["caster", "", "Grave ghost"],
      ["caster", "", "Grave ghost"],
      ["melee", "", "Skeleton soldier"],
    ]);
    this.camp(22, 24, 4, [
      ["worker", "tree", "Waking Tree"],
      ["worker", "tree", "Waking Tree"],
      ["worker", "tree", "Waking Tree"],
    ]);
    this.camp(18, 18, 5, [
      ["hero", "wolf", "Feral Werewolf"],
      ["caster", "", "Grave ghost"],
      ["caster", "", "Grave ghost"],
    ]);
    this.camp(26, 20, 6, [
      ["caster", "witch", "Witch"],
      ["melee", "vamp", "Feral Vampire"],
      ["melee", "vamp", "Feral Vampire"],
    ]);
    this.camp(20, 28, 7, [
      ["hero", "king", "Pumpkin King"],
      ["hero", "horse", "Headless Horseman"],
      ["melee", "vamp", "Feral Vampire"],
    ]);
    for (const [px, py] of [
      [10, 9],
      [9, 11],
      [12, 10],
      [28, 30],
      [30, 28],
      [27, 32],
    ] as const) {
      if (this.at(px, py) === 0) this.setTile(px, py, 5);
    }
    if (this.at(20, 17) === 0) this.setTile(20, 17, 6);
    const ped = this.spawn(2, "ghost", "worker", 20.4, 18.2);
    ped.name = "Grave Peddler";
    ped.hp = 500;
    ped.maxHp = 500;
    ped.dmg = 0;
    ped.camp = 0;
    ped.homeX = ped.x;
    ped.homeY = ped.y;
  }

  private nearBase(x: number, y: number, r: number) {
    return dist(x, y, 7, 7) < r || dist(x, y, 32, 32) < r;
  }

  private clearBase(x: number, y: number) {
    for (let yy = y - 1; yy < y + 6; yy++) {
      for (let xx = x - 1; xx < x + 6; xx++) {
        if (this.at(xx, yy) !== 2) this.setTile(xx, yy, 0);
      }
    }
  }

  private goldMine(x: number, y: number) {
    this.setTile(x, y, 11);
    this.setTile(x + 1, y, 11);
  }

  private addHall(team: 0 | 1, x: number, y: number, faction: Faction) {
    const spec = BUILD.hall;
    const b = this.makeBuilding(team, faction, "hall", x, y, spec.w, spec.h, spec.hp);
    b.progress = 1;
    for (let i = 0; i < 4; i++) {
      this.spawn(team, faction, "worker", x + 3.2, y + 0.4 + i * 0.7);
    }
  }

  private camp(
    x: number,
    y: number,
    id: number,
    members: [UnitKind, Unit["boss"], string][],
  ) {
    members.forEach((m, i) => {
      const u = this.spawn(2, "mummy", m[0], x + (i % 3) * 0.9, y + Math.floor(i / 3) * 0.9);
      u.camp = id;
      u.boss = m[1];
      u.homeX = u.x;
      u.homeY = u.y;
      u.faction = "ghost";
      u.name = m[2];
      if (m[1] === "king") this.bossStats(u, 520, 22, 1.15, m[2]);
      else if (m[1] === "horse") this.bossStats(u, 420, 18, 1.55, m[2]);
      else if (m[1] === "wolf") this.bossStats(u, 240, 16, 1.35, m[2]);
      else if (m[1] === "witch") this.bossStats(u, 200, 14, 1.4, m[2]);
      else if (m[1] === "vamp") this.bossStats(u, 110, 11, 1.25, m[2]);
      else if (m[1] === "tree") this.bossStats(u, 90, 9, 0.8, m[2]);
      else {
        u.maxHp = m[2] === "Scarecrow" ? 48 : 55;
        u.hp = u.maxHp;
        u.dmg = m[2] === "Raven" ? 5 : 6;
        if (m[2] === "Raven") u.range = 2.4;
      }
    });
  }

  private bossStats(u: Unit, hp: number, dmg: number, speed: number, name: string) {
    u.maxHp = hp;
    u.hp = hp;
    u.dmg = dmg;
    u.speed = speed;
    u.name = name;
    u.range = u.boss === "witch" || u.boss === "king" ? 3.2 : 1.15;
    if (u.boss === "king" || u.boss === "horse") u.kind = "hero";
  }

  makeBuilding(
    team: 0 | 1,
    faction: Faction,
    kind: BKind,
    x: number,
    y: number,
    w: number,
    h: number,
    hp: number,
  ): Building {
    const b: Building = {
      id: nid(),
      team,
      faction,
      kind,
      x,
      y,
      w,
      h,
      hp,
      maxHp: hp,
      progress: 0,
      queue: [],
      rallyX: x + w * 0.5,
      rallyY: y + h + 0.4,
      tier: 1,
      atkWait: 0,
    };
    this.buildings.push(b);
    return b;
  }

  spawn(team: 0 | 1 | 2, faction: Faction, kind: UnitKind, x: number, y: number): Unit {
    const baseHp = { worker: 46, melee: 100, ranged: 68, caster: 62, hero: 220 }[kind];
    const baseDmg = { worker: 5, melee: 10, ranged: 8, caster: 11, hero: 16 }[kind];
    const baseSpd = { worker: 2.15, melee: 2.35, ranged: 2.25, caster: 2.15, hero: 2.55 }[kind];
    let hp = baseHp;
    let dmg = baseDmg;
    let speed = baseSpd;
    if (faction === "wolf" && kind !== "worker") {
      hp *= 1.12;
      dmg *= 1.15;
      speed *= 1.16;
    }
    if (faction === "vampire") hp *= 0.82;
    if (faction === "ghost") speed *= 1.12;
    if (faction === "mummy" && kind !== "hero") hp *= 0.86;
    const u: Unit = {
      id: nid(),
      team,
      faction,
      kind,
      name: UNIT_NAME[faction][kind],
      x,
      y,
      hp,
      maxHp: hp,
      mana: kind === "hero" ? 80 : 0,
      maxMana: kind === "hero" ? 100 : 0,
      dmg,
      speed,
      range: kind === "ranged" || kind === "caster" ? 4.4 : kind === "hero" ? 1.15 : 0.95,
      atkWait: 0,
      path: [],
      order: null,
      carry: 0,
      carryKind: null,
      level: 1,
      xp: 0,
      points: 0,
      ranks: [0, 0, 0, 0],
      cds: [0, 0, 0, 0],
      invuln: 0,
      evade: 0,
      stealth: 0,
      nextHit: 1,
      slow: 0,
      storm: 0,
      haste: 0,
      camp: 0,
      boss: "",
      bossCd: 1.5,
      temp: 0,
      items: [null, null, null, null, null, null],
      facing: team === 1 ? -1 : 1,
      anim: Math.random() * 6,
      homeX: x,
      homeY: y,
      revealed: 0,
    };
    this.units.push(u);
    return u;
  }

  rebuildWalk() {
    this.walk.fill(1);
    for (let i = 0; i < this.tiles.length; i++) {
      const t = this.tiles[i];
      if (t === 2 || t === 3 || t === 4 || t === 6 || t === 7 || t === 8 || t === 9 || t === 10 || t === 11) {
        this.walk[i] = 0;
      }
    }
    for (const b of this.buildings) {
      if (b.hp <= 0) continue;
      for (let yy = 0; yy < b.h; yy++) {
        for (let xx = 0; xx < b.w; xx++) {
          const x = b.x + xx;
          const y = b.y + yy;
          if (x >= 0 && y >= 0 && x < COLS && y < ROWS) this.walk[y * COLS + x] = 0;
        }
      }
    }
  }

  private blocked(x: number, y: number) {
    const tx = Math.floor(x);
    const ty = Math.floor(y);
    if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return true;
    return this.walk[ty * COLS + tx] === 0;
  }

  private nearestOpen(x: number, y: number) {
    if (!this.blocked(x, y)) return { x, y };
    for (let r = 1; r <= 4; r++) {
      for (let yy = -r; yy <= r; yy++) {
        for (let xx = -r; xx <= r; xx++) {
          if (Math.abs(xx) !== r && Math.abs(yy) !== r) continue;
          const px = x + xx;
          const py = y + yy;
          if (!this.blocked(px + 0.5, py + 0.5)) return { x: px + 0.5, y: py + 0.5 };
        }
      }
    }
    return { x, y };
  }

  pathTo(sx: number, sy: number, gx: number, gy: number) {
    const x0 = clamp(Math.floor(sx), 0, COLS - 1);
    const y0 = clamp(Math.floor(sy), 0, ROWS - 1);
    const x1 = clamp(Math.floor(gx), 0, COLS - 1);
    const y1 = clamp(Math.floor(gy), 0, ROWS - 1);
    if (x0 === x1 && y0 === y1) return [{ x: gx, y: gy }];
    const start = tileKey(x0, y0);
    const goal = tileKey(x1, y1);
    const open: number[] = [start];
    const came = new Map<number, number>();
    const g = new Map<number, number>([[start, 0]]);
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    let guard = 0;
    while (open.length && guard++ < 900) {
      open.sort((a, b) => (g.get(a) ?? 99) - (g.get(b) ?? 99));
      const cur = open.shift()!;
      if (cur === goal) break;
      const cx = cur & 255;
      const cy = cur >> 8;
      for (const [dx, dy] of dirs) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
        if (this.walk[ny * COLS + nx] === 0 && tileKey(nx, ny) !== goal) continue;
        if (dx !== 0 && dy !== 0) {
          if (this.walk[cy * COLS + nx] === 0 || this.walk[ny * COLS + cx] === 0) continue;
        }
        const nk = tileKey(nx, ny);
        const ng = (g.get(cur) ?? 99) + (dx !== 0 && dy !== 0 ? 1.4 : 1);
        if (ng < (g.get(nk) ?? 1e9)) {
          g.set(nk, ng);
          came.set(nk, cur);
          if (!open.includes(nk)) open.push(nk);
        }
      }
    }
    if (!came.has(goal) && start !== goal) return [{ x: gx, y: gy }];
    const out: { x: number; y: number }[] = [];
    let c: number | undefined = goal;
    while (c !== undefined && c !== start) {
      out.push({ x: (c & 255) + 0.5, y: (c >> 8) + 0.5 });
      c = came.get(c);
    }
    out.reverse();
    if (out.length) out[out.length - 1] = { x: gx, y: gy };
    return out;
  }

  popOf(team: 0 | 1) {
    let used = 0;
    let cap = 0;
    for (const u of this.units) {
      if (u.team === team && u.hp > 0 && u.temp === 0) used += u.kind === "hero" ? 2 : 1;
    }
    for (const b of this.buildings) {
      if (b.team !== team || b.hp <= 0 || b.progress < 1) continue;
      if (b.kind === "hall") cap += 10 + (b.tier - 1) * 4;
      if (b.kind === "farm") cap += 8;
      for (const q of b.queue) used += TRAIN[q.kind].pop;
    }
    return { used, cap };
  }

  canAfford(team: 0 | 1, gold: number, wood: number) {
    return this.gold[team] >= gold && this.wood[team] >= wood;
  }

  pay(team: 0 | 1, gold: number, wood: number) {
    this.gold[team] -= gold;
    this.wood[team] -= wood;
  }

  say(msg: string) {
    this.toast = msg;
    this.toastT = 3.2;
  }

  tryPlace(kind: BKind, x: number, y: number, team: 0 | 1) {
    const spec = BUILD[kind];
    const tx = Math.floor(x);
    const ty = Math.floor(y);
    if (!this.footOk(tx, ty, spec.w, spec.h)) {
      if (team === 0) this.say("Cannot build there.");
      return false;
    }
    if (!this.canAfford(team, spec.gold, spec.wood)) {
      if (team === 0) this.say("Not enough gold or lumber.");
      return false;
    }
    this.pay(team, spec.gold, spec.wood);
    const faction = team === 0 ? this.player : this.enemy;
    this.makeBuilding(team, faction, kind, tx, ty, spec.w, spec.h, spec.hp);
    this.rebuildWalk();
    this.place = null;
    return true;
  }

  footOk(x: number, y: number, w: number, h: number) {
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const t = this.at(x + xx, y + yy);
        if (t !== 0 && t !== 1 && t !== 5) return false;
      }
    }
    for (const b of this.buildings) {
      if (b.hp <= 0) continue;
      if (x < b.x + b.w && x + w > b.x && y < b.y + b.h && y + h > b.y) return false;
    }
    return true;
  }

  command(x: number, y: number) {
    const hitU = this.unitAt(x, y, 0.7);
    const hitB = this.buildingAt(x, y);
    const tile = this.at(Math.floor(x), Math.floor(y));
    const selU = this.selectedUnits();
    if (this.place && selU.some((u) => u.kind === "worker")) {
      this.tryPlace(this.place, x, y, 0);
      return;
    }
    if (!selU.length && !this.selectedBuildings().length) {
      if (hitU && hitU.team === 0) this.selection = [{ t: "u", id: hitU.id }];
      else if (hitB && hitB.team === 0) this.selection = [{ t: "b", id: hitB.id }];
      return;
    }
    if (hitU && hitU.team === 0 && !selU.length) {
      this.selection = [{ t: "u", id: hitU.id }];
      return;
    }
    const workers = selU.filter((u) => u.kind === "worker");
    const fighters = selU.filter((u) => u.kind !== "worker" || u.team === 0);
    if (hitU && hitU.name === "Grave Peddler") {
      this.shop = true;
      this.selection = [];
      this.say("The peddler sells relics. Purple stays in the ground.");
      return;
    }
    if (hitU && hitU.team !== 0 && selU.length) {
      for (const u of selU) this.orderAttack(u, hitU);
      return;
    }
    if (hitB && hitB.team !== 0 && selU.length) {
      for (const u of selU) this.orderAttackBuilding(u, hitB);
      return;
    }
    if (hitU && hitU.team === 0) {
      this.selection = [{ t: "u", id: hitU.id }];
      return;
    }
    if (hitB && hitB.team === 0 && hitB.progress < 1 && workers.length) {
      for (const u of workers) {
        u.order = { t: "build", id: hitB.id };
        u.path = this.pathTo(u.x, u.y, hitB.x + hitB.w * 0.5, hitB.y + hitB.h + 0.2);
      }
      return;
    }
    if ((tile === 3 || tile === 4) && workers.length) {
      for (const u of workers) {
        u.order = { t: "gather", x: Math.floor(x), y: Math.floor(y), res: "wood" };
        u.carry = 0;
        u.carryKind = null;
        const spot = this.nearestOpen(Math.floor(x) + 0.2, Math.floor(y) + 1.1);
        u.path = this.pathTo(u.x, u.y, spot.x, spot.y);
      }
      return;
    }
    if (tile === 11 && workers.length) {
      for (const u of workers) {
        u.order = { t: "gather", x: Math.floor(x), y: Math.floor(y), res: "gold" };
        u.carry = 0;
        u.carryKind = null;
        const spot = this.nearestOpen(Math.floor(x) + 0.2, Math.floor(y) + 1.2);
        u.path = this.pathTo(u.x, u.y, spot.x, spot.y);
      }
      return;
    }
    if (hitB && hitB.team === 0 && this.selectedBuildings().length && !selU.length) {
      for (const b of this.selectedBuildings()) {
        b.rallyX = x;
        b.rallyY = y;
      }
      this.say("Rally set.");
      return;
    }
    if (selU.length) {
      const open = this.nearestOpen(x, y);
      selU.forEach((u, i) => {
        const ox = open.x + (i % 3) * 0.35 - 0.35;
        const oy = open.y + Math.floor(i / 3) * 0.35;
        u.order = { t: "move", x: ox, y: oy };
        u.path = this.pathTo(u.x, u.y, ox, oy);
        u.carry = u.carry;
      });
      void fighters;
    }
  }

  selectAt(x: number, y: number, add: boolean) {
    const u = this.unitAt(x, y, 0.75);
    const b = !u ? this.buildingAt(x, y) : null;
    if (!add) this.selection = [];
    if (u && (u.team === 0 || u.revealed > 0 || u.team === 2 || dist(u.x, u.y, x, y) < 2)) {
      if (u.team === 0 || u.team === 2 || u.team === 1) this.selection = [{ t: "u", id: u.id }];
    } else if (b && b.team === 0) this.selection = [{ t: "b", id: b.id }];
    else if (!add) this.selection = [];
  }

  selectBox(x0: number, y0: number, x1: number, y1: number) {
    const minx = Math.min(x0, x1);
    const maxx = Math.max(x0, x1);
    const miny = Math.min(y0, y1);
    const maxy = Math.max(y0, y1);
    this.selection = this.units
      .filter(
        (u) =>
          u.team === 0 &&
          u.hp > 0 &&
          u.x >= minx &&
          u.x <= maxx &&
          u.y >= miny &&
          u.y <= maxy,
      )
      .map((u) => ({ t: "u" as const, id: u.id }));
  }

  selectType(kind: UnitKind) {
    this.selection = this.units
      .filter((u) => u.team === 0 && u.hp > 0 && u.kind === kind)
      .map((u) => ({ t: "u", id: u.id }));
  }

  selectedUnits() {
    const ids = new Set(this.selection.filter((s) => s.t === "u").map((s) => s.id));
    return this.units.filter((u) => ids.has(u.id) && u.hp > 0);
  }

  selectedBuildings() {
    const ids = new Set(this.selection.filter((s) => s.t === "b").map((s) => s.id));
    return this.buildings.filter((b) => ids.has(b.id) && b.hp > 0);
  }

  unitAt(x: number, y: number, r: number) {
    let best: Unit | null = null;
    let bd = r;
    for (const u of this.units) {
      if (u.hp <= 0) continue;
      if (u.stealth > 0 && u.team !== 0 && u.revealed <= 0) continue;
      const d = dist(u.x, u.y, x, y);
      if (d < bd) {
        bd = d;
        best = u;
      }
    }
    return best;
  }

  buildingAt(x: number, y: number) {
    const tx = Math.floor(x);
    const ty = Math.floor(y);
    return (
      this.buildings.find(
        (b) => b.hp > 0 && tx >= b.x && tx < b.x + b.w && ty >= b.y && ty < b.y + b.h,
      ) ?? null
    );
  }

  private orderAttack(u: Unit, target: Unit) {
    if (target.name === "Grave Peddler") return;
    u.order = { t: "attack", id: target.id };
    u.path = this.pathTo(u.x, u.y, target.x, target.y);
  }

  private orderAttackBuilding(u: Unit, b: Building) {
    u.order = { t: "attack", id: -b.id };
    u.path = this.pathTo(u.x, u.y, b.x + b.w * 0.5, b.y + b.h * 0.5);
  }

  stop() {
    for (const u of this.selectedUnits()) {
      u.order = null;
      u.path = [];
    }
    for (const b of this.selectedBuildings()) b.queue.pop();
    this.place = null;
  }

  train(kind: UnitKind) {
    const b = this.selectedBuildings()[0];
    if (!b || b.progress < 1 || b.team !== 0) return;
    const ok =
      (kind === "worker" && b.kind === "hall") ||
      (kind === "melee" && b.kind === "barracks") ||
      ((kind === "ranged" || kind === "caster") && b.kind === "lodge") ||
      (kind === "hero" && b.kind === "altar");
    if (!ok) return;
    if (kind === "hero" && this.units.some((u) => u.team === 0 && u.kind === "hero" && u.hp > 0)) {
      this.say("You already have a hero. The altar can revive them.");
      return;
    }
    const cost = TRAIN[kind];
    const pop = this.popOf(0);
    if (pop.used + cost.pop > pop.cap) {
      this.say("Build another pumpkin patch. You are at the unit cap.");
      return;
    }
    let gold = cost.gold;
    let wood = cost.wood;
    if (this.player === "wolf" && kind !== "worker") gold = Math.round(gold * 1.2);
    if (this.player === "mummy" && kind !== "hero") gold = Math.round(gold * 0.8);
    if (!this.canAfford(0, gold, wood)) {
      this.say("Not enough gold or lumber.");
      return;
    }
    this.pay(0, gold, wood);
    b.queue.push({ kind, t: 0, need: cost.time });
  }

  reviveHero() {
    const b = this.selectedBuildings().find((x) => x.kind === "altar");
    if (!b || b.progress < 1) return;
    const dead = this.units.find((u) => u.team === 0 && u.kind === "hero" && u.hp <= 0);
    if (!dead) {
      this.say("Your hero is still standing.");
      return;
    }
    if (b.queue.some((q) => q.kind === "hero")) return;
    if (!this.canAfford(0, 160, 40)) {
      this.say("Revival needs 160 gold and 40 lumber.");
      return;
    }
    this.pay(0, 160, 40);
    b.queue.push({ kind: "hero", t: 0, need: 20 });
  }

  raiseHall() {
    const b = this.selectedBuildings().find((x) => x.kind === "hall" && x.progress >= 1);
    if (!b || b.tier >= 2) return;
    if (!this.canAfford(0, 200, 150)) {
      this.say("Raising the hall costs 200 gold and 150 lumber.");
      return;
    }
    this.pay(0, 200, 150);
    b.tier = 2;
    b.maxHp += 200;
    b.hp += 200;
    this.say("The hall grows a second story.");
  }

  learn(skill: number) {
    const h = this.selectedUnits().find((u) => u.kind === "hero");
    if (!h || h.points <= 0) return;
    if (skill === 3 && h.level < 6) {
      this.say("The ultimate opens at level 6.");
      return;
    }
    if (h.ranks[skill] >= (skill === 3 ? 1 : 3)) return;
    h.ranks[skill] += 1;
    h.points -= 1;
  }

  cast(skill: number) {
    const h = this.selectedUnits().find((u) => u.kind === "hero" && u.team === 0);
    if (!h) return;
    this.useSkill(h, skill);
  }

  buy(id: ItemId) {
    const price: Partial<Record<ItemId, number>> = {
      brew: 40,
      boots: 60,
      talons: 55,
      charm: 45,
      gloves: 110,
      mace: 120,
      shield: 130,
      ash: 80,
      heart: 100,
    };
    const cost = price[id];
    const hero = this.units.find((u) => u.team === 0 && u.kind === "hero" && u.hp > 0);
    if (!hero) {
      this.say("Bring your hero to the peddler.");
      return;
    }
    const ped = this.units.find((u) => u.name === "Grave Peddler" && u.hp > 0);
    if (!ped || dist(hero.x, hero.y, ped.x, ped.y) > 3.2) {
      this.say("Bring your hero to the peddler.");
      return;
    }
    if (!cost || !this.canAfford(0, cost, 0)) {
      this.say("Not enough gold or lumber.");
      return;
    }
    const slot = hero.items.findIndex((s) => !s);
    if (slot < 0) {
      this.say("The pack is full.");
      return;
    }
    this.pay(0, cost, 0);
    hero.items[slot] = id;
    if (id === "talons") hero.dmg += 2;
    if (id === "mace") hero.dmg += 4;
    if (id === "charm") {
      hero.maxHp += 18;
      hero.hp += 18;
    }
    if (id === "heart") {
      hero.maxHp += 36;
      hero.hp += 36;
    }
    if (id === "crown") {
      hero.maxHp += 40;
      hero.maxMana += 20;
      hero.dmg += 4;
    }
    this.say(ITEM_META[id].name);
  }

  useItem(slot: number) {
    const h = this.selectedUnits().find((u) => u.kind === "hero");
    if (!h) return;
    const id = h.items[slot];
    if (!id) return;
    if (id === "brew") {
      h.hp = Math.min(h.maxHp, h.hp + 70);
      h.items[slot] = null;
      this.float(h.x, h.y, "+70", "#7dcea0");
    } else if (id === "ash") {
      this.reveal = 6;
      h.items[slot] = null;
      this.say("Hidden things are shown.");
    }
  }

  private useSkill(h: Unit, skill: number) {
    if (h.ranks[skill] <= 0) {
      this.learn(skill);
      return;
    }
    if (h.cds[skill] > 0) return;
    const manaCost = [30, 40, 0, 70][skill] * (h.items.includes("bangle") ? 0.75 : 1);
    if (skill !== 2 && h.mana < manaCost) {
      this.say("Not enough mana.");
      return;
    }
    const rank = h.ranks[skill];
    const foe = this.nearestFoe(h, h.range + 3.5);
    if (h.faction === "vampire") {
      if (skill === 0) {
        const ally = this.nearestAllyHurt(h, "vampire");
        if (ally && ally.hp < ally.maxHp * 0.85) {
          ally.hp = Math.min(ally.maxHp, ally.hp + 28 * rank);
          this.float(ally.x, ally.y, "tithe", "#e07a7a");
        } else if (foe) {
          this.hurt(foe, 22 * rank, h, true);
        } else return;
      } else if (skill === 1) {
        h.invuln = 2.4 + rank * 0.3;
        this.float(h.x, h.y, "mist", "#e07a7a");
      } else if (skill === 3) {
        const dead = this.corpses.filter((c) => c.team === 0 && dist(c.x, c.y, h.x, h.y) < 5).slice(0, 2);
        if (!dead.length) {
          this.say("No fresh corpses nearby.");
          return;
        }
        for (const c of dead) {
          const u = this.spawn(0, c.faction, c.kind === "hero" ? "melee" : c.kind, c.x, c.y);
          u.hp = u.maxHp * 0.55;
          this.corpses = this.corpses.filter((x) => x !== c);
        }
      }
    } else if (h.faction === "ghost") {
      if (skill === 0) {
        if (!foe) return;
        this.hurt(foe, 18 * rank, h, true);
        foe.slow = 2.5;
      } else if (skill === 1) {
        h.evade = 2.2 + rank * 0.4;
        this.float(h.x, h.y, "fade", "#b7d4e8");
      } else if (skill === 3) {
        for (let i = 0; i < 2; i++) {
          const u = this.spawn(0, "ghost", "melee", h.x + i * 0.4, h.y + 0.4);
          u.temp = 12;
          u.hp = 50;
          u.maxHp = 50;
        }
      }
    } else if (h.faction === "wolf") {
      if (skill === 0) {
        h.stealth = 8;
        h.nextHit = 2.2 + rank * 0.4;
        this.float(h.x, h.y, "prowl", "#d7c4a3");
      } else if (skill === 2) {
        for (let i = 0; i < 2; i++) {
          const u = this.spawn(0, "wolf", "melee", h.x + 0.4, h.y + i * 0.4);
          u.temp = 8;
          u.dmg *= 0.45;
          u.name = "Shadow";
          u.hp = 40;
          u.maxHp = 40;
        }
      } else if (skill === 3) {
        h.storm = 3;
      } else if (skill === 1) {
        this.say("Savage Strike is always on.");
        return;
      }
    } else if (h.faction === "mummy") {
      if (skill === 0) {
        const ally = this.nearestAllyHurt(h, "mummy");
        if (ally) {
          ally.hp = Math.min(ally.maxHp, ally.hp + 26 * rank);
          this.float(ally.x, ally.y, "wrap", "#c4a35a");
        } else if (foe) this.hurt(foe, 20 * rank, h, true);
        else return;
      } else if (skill === 1) {
        const z = this.units.find(
          (u) => u.team === 0 && u.hp > 0 && u.kind === "worker" && u.faction === "mummy" && dist(u.x, u.y, h.x, h.y) < 4,
        );
        if (!z) {
          this.say("No zombie close enough to consume.");
          return;
        }
        z.hp = 0;
        h.hp = Math.min(h.maxHp, h.hp + 90);
        this.float(h.x, h.y, "consume", "#9dba86");
      } else if (skill === 3) {
        for (let i = 0; i < 3; i++) {
          const u = this.spawn(0, "mummy", "melee", h.x + (i - 1) * 0.45, h.y + 0.5);
          u.temp = 14;
          u.hp = 48;
          u.maxHp = 48;
          u.name = "Risen";
        }
      }
    }
    if (skill !== 2 && !(h.faction === "wolf" && skill === 1)) {
      h.mana -= manaCost;
      h.cds[skill] = skill === 3 ? 28 : 9;
    }
    h.stealth = skill === 0 && h.faction === "wolf" ? h.stealth : 0;
  }

  private nearestFoe(h: Unit, r: number) {
    let best: Unit | null = null;
    let bd = r;
    for (const u of this.units) {
      if (u.hp <= 0 || u.team === h.team) continue;
      if (u.stealth > 0 && u.revealed <= 0 && this.reveal <= 0 && dist(u.x, u.y, h.x, h.y) > 1.4) continue;
      const d = dist(u.x, u.y, h.x, h.y);
      if (d < bd) {
        bd = d;
        best = u;
      }
    }
    return best;
  }

  private nearestAllyHurt(h: Unit, faction: Faction) {
    let best: Unit | null = null;
    let bd = 4.5;
    for (const u of this.units) {
      if (u.hp <= 0 || u.team !== h.team || u.faction !== faction) continue;
      const d = dist(u.x, u.y, h.x, h.y);
      if (d < bd) {
        bd = d;
        best = u;
      }
    }
    return best;
  }

  private float(x: number, y: number, text: string, color: string) {
    this.fx.push({ x, y, text, color, life: 0.9, vy: -0.6 });
  }

  private hurt(target: Unit | null, amount: number, src: Unit | null, magic = false) {
    if (!target || target.hp <= 0) return;
    if (target.name === "Grave Peddler") return;
    if (target.invuln > 0) {
      this.float(target.x, target.y, "mist", "#d5e4f2");
      return;
    }
    if (target.evade > 0 && Math.random() < 0.72) {
      this.float(target.x, target.y, "miss", "#d5e4f2");
      return;
    }
    let dmg = amount;
    if (target.items.includes("shield") && Math.random() < 0.15) {
      this.float(target.x, target.y, "turned", "#d7c4a8");
      return;
    }
    if (magic && (target.boss === "king" || target.boss === "horse")) dmg *= 0.65;
    if (src?.kind === "hero" && src.faction === "wolf" && src.ranks[1] > 0 && Math.random() < 0.22 + src.ranks[1] * 0.08) {
      dmg *= 2;
      this.float(target.x, target.y, "savage", "#f2c14d");
    }
    if (src && src.nextHit > 1) {
      dmg *= src.nextHit;
      src.nextHit = 1;
      src.stealth = 0;
    }
    if (target.hp - dmg <= 0 && target.items.includes("seal")) {
      const i = target.items.indexOf("seal");
      target.items[i] = null;
      target.hp = target.maxHp * 0.35;
      this.float(target.x, target.y, "seal", "#c9a0e8");
      return;
    }
    target.hp -= dmg;
    this.float(target.x, target.y, String(Math.round(dmg)), magic ? "#c9a0e8" : "#f2c14d");
    if (src && src.faction === "vampire" && src.team !== 2) src.hp = Math.min(src.maxHp, src.hp + 3 + (src.kind === "hero" ? src.ranks[2] * 2 : 0));
    if (src?.items.includes("mask")) src.hp = Math.min(src.maxHp, src.hp + dmg * 0.25);
    if (target.camp) {
      for (const u of this.units) {
        if (u.camp === target.camp && u.hp > 0 && src) u.order = { t: "attack", id: src.id };
      }
    }
    if (target.team !== 2 && src) target.order = target.order ?? { t: "attack", id: src.id };
    if (target.hp <= 0) this.kill(target, src);
  }

  private hurtBuilding(b: Building, amount: number) {
    b.hp -= amount;
    this.float(b.x + b.w / 2, b.y + b.h / 2, String(Math.round(amount)), "#f2c14d");
    if (b.hp <= 0) {
      b.hp = 0;
      const spec = BUILD[b.kind];
      if (b.team === 0 || b.team === 1) {
        this.gold[b.team] += 0;
        void spec;
      }
      this.rebuildWalk();
      if (b.kind === "hall") {
        const alive = this.buildings.some((x) => x.team === b.team && x.kind === "hall" && x.hp > 0);
        if (!alive) this.winner = b.team === 0 ? 1 : 0;
      }
    }
  }

  private kill(u: Unit, src: Unit | null) {
    u.hp = 0;
    u.order = null;
    u.path = [];
    if (u.kind !== "hero" && u.team !== 2 && u.temp === 0) {
      this.corpses.push({ x: u.x, y: u.y, team: u.team as 0 | 1, faction: u.faction, kind: u.kind, life: 18 });
    }
    if (u.team === 2 && u.camp && src && src.team !== 2) {
      const mates = this.units.filter((m) => m.camp === u.camp);
      const strongest = mates.reduce((a, b) => (a.maxHp >= b.maxHp ? a : b));
      if (strongest.id === u.id) this.dropFor(u);
      if (src.kind === "hero" && src.level < 5) this.grantXp(src, 18 + u.maxHp * 0.05);
      else if (src.kind === "hero") {
        /* creeps stop giving experience at level 5 */
      }
    } else if (src?.kind === "hero" && u.team !== src.team && u.team !== 2) {
      this.grantXp(src, u.kind === "hero" ? 80 : 28);
    }
    for (const it of u.items) {
      if (it) this.drops.push({ id: nid(), x: u.x + Math.random() * 0.4, y: u.y, item: it });
    }
    u.items = [null, null, null, null, null, null];
  }

  private grantXp(h: Unit, n: number) {
    if (h.level >= 6) return;
    h.xp += n;
    while (h.level < 6 && h.xp >= XP[h.level]) {
      h.xp -= XP[h.level];
      h.level += 1;
      h.points += 1;
      h.maxHp += 18;
      h.hp += 18;
      this.float(h.x, h.y, `level ${h.level}`, "#f2c14d");
    }
  }

  private dropFor(u: Unit) {
    const green: ItemId[] = ["brew", "boots", "talons", "charm"];
    const blue: ItemId[] = ["gloves", "mace", "ash", "heart", "shield"];
    const purple: ItemId[] = ["crown", "mask", "seal", "bangle"];
    const pool = u.boss === "king" ? purple : u.boss === "wolf" || u.boss === "witch" ? blue : green;
    const item = pool[Math.floor(Math.random() * pool.length)];
    this.drops.push({ id: nid(), x: u.x, y: u.y, item });
    if (u.team === 2) {
      this.gold[0] += 0;
    }
  }

  private giveGold(team: 0 | 1, n: number) {
    this.gold[team] += n;
  }

  step(dt: number) {
    if (this.paused || this.winner !== null) {
      this.pan(dt);
      return;
    }
    dt = Math.min(dt, 0.05) * this.speed;
    this.time += dt;
    this.toastT = Math.max(0, this.toastT - dt);
    this.shake = Math.max(0, this.shake - dt);
    this.reveal = Math.max(0, this.reveal - dt);
    this.pan(dt);
    this.stepUnits(dt);
    this.stepBuildings(dt);
    this.stepProjs(dt);
    this.bosses(dt);
    this.wakeTrees();
    this.ai(dt);
    this.fx = this.fx.filter((f) => {
      f.life -= dt;
      f.y += f.vy * dt;
      return f.life > 0;
    });
    this.corpses = this.corpses.filter((c) => {
      c.life -= dt;
      return c.life > 0;
    });
    this.units = this.units.filter((u) => u.hp > 0 || u.kind === "hero");
    this.buildings = this.buildings.filter((b) => b.hp > 0);
  }

  private pan(dt: number) {
    const s = 520 * dt;
    if (this.held.has("KeyA") || this.held.has("ArrowLeft")) this.cam.x -= s;
    if (this.held.has("KeyD") || this.held.has("ArrowRight")) this.cam.x += s;
    if (this.held.has("KeyW") || this.held.has("ArrowUp")) this.cam.y -= s;
    if (this.held.has("KeyS") || this.held.has("ArrowDown")) this.cam.y += s;
    const z = this.cam.z;
    if (this.held.has("KeyQ")) this.cam.z = clamp(z + dt, 0.7, 1.45);
    if (this.held.has("KeyE")) this.cam.z = clamp(z - dt, 0.7, 1.45);
  }

  private stepUnits(dt: number) {
    for (const u of this.units) {
      if (u.hp <= 0) continue;
      u.anim += dt * (u.path.length ? 8 : 2);
      u.atkWait = Math.max(0, u.atkWait - dt);
      u.invuln = Math.max(0, u.invuln - dt);
      u.evade = Math.max(0, u.evade - dt);
      u.slow = Math.max(0, u.slow - dt);
      u.haste = Math.max(0, u.haste - dt);
      u.revealed = Math.max(0, u.revealed - dt);
      if (this.reveal > 0 && u.stealth > 0) u.revealed = 0.3;
      for (let i = 0; i < 4; i++) u.cds[i] = Math.max(0, u.cds[i] - dt);
      if (u.kind === "hero") u.mana = Math.min(u.maxMana, u.mana + dt * 3.2);
      if (u.temp > 0) {
        u.temp -= dt;
        if (u.temp <= 0) {
          u.hp = 0;
          continue;
        }
      }
      if (u.items.includes("heart")) {
        /* max hp bonus applied lightly as regen */
        u.hp = Math.min(u.maxHp + 40, u.hp + dt * 1.5);
      }
      if (u.storm > 0) {
        u.storm -= dt;
        u.order = null;
        u.path = [];
        if (Math.random() < dt * 4) {
          for (const o of this.units) {
            if (o.hp > 0 && o.team !== u.team && dist(o.x, o.y, u.x, u.y) < 2.1) this.hurt(o, u.dmg * 0.45, u);
          }
        }
      }
      this.seekFight(u);
      this.followOrder(u, dt);
      this.pickup(u);
    }
  }

  private seekFight(u: Unit) {
    if (u.team === 0 && u.order) return;
    if (u.kind === "worker" && u.team !== 2) return;
    if (u.team === 2 && !u.order) return;
    if (u.order && u.order.t !== "move") return;
    const see = u.boss === "king" || u.boss === "horse" ? 6 : 4.2;
    const foe = this.nearestFoe(u, u.kind === "hero" ? see : 3.4);
    if (foe && (u.team === 1 || u.team === 2)) this.orderAttack(u, foe);
  }

  private followOrder(u: Unit, dt: number) {
    const o = u.order;
    if (!o) {
      if (u.team === 2 && dist(u.x, u.y, u.homeX, u.homeY) > 0.4 && u.bossCd < 8) {
        u.path = this.pathTo(u.x, u.y, u.homeX, u.homeY);
        this.moveAlong(u, dt);
        if (!u.path.length && dist(u.x, u.y, u.homeX, u.homeY) < 1.2) {
          u.hp = Math.min(u.maxHp, u.hp + dt * 8);
        }
      }
      return;
    }
    if (o.t === "move") {
      this.moveAlong(u, dt);
      if (!u.path.length && dist(u.x, u.y, o.x, o.y) < 0.25) u.order = null;
    } else if (o.t === "attack") {
      if (o.id < 0) {
        const b = this.buildings.find((x) => x.id === -o.id && x.hp > 0);
        if (!b) {
          u.order = null;
          return;
        }
        const d = dist(u.x, u.y, b.x + b.w / 2, b.y + b.h / 2);
        if (d > u.range + 0.8) {
          u.path = u.path.length ? u.path : this.pathTo(u.x, u.y, b.x + b.w / 2, b.y + b.h / 2);
          this.moveAlong(u, dt);
        } else if (u.atkWait <= 0) {
          u.atkWait = this.swing(u);
          this.hurtBuilding(b, u.dmg);
          u.facing = Math.sign(b.x - u.x) || 1;
        }
      } else {
        const target = this.units.find((x) => x.id === o.id && x.hp > 0);
        if (!target) {
          u.order = null;
          return;
        }
        const d = dist(u.x, u.y, target.x, target.y);
        if (d > u.range) {
          u.path = this.pathTo(u.x, u.y, target.x, target.y);
          this.moveAlong(u, dt);
        } else if (u.atkWait <= 0) {
          u.atkWait = this.swing(u);
          u.facing = Math.sign(target.x - u.x) || 1;
          u.stealth = 0;
          if (u.range > 2) {
            this.projs.push({
              x: u.x,
              y: u.y,
              tx: target.x,
              ty: target.y,
              color: u.team === 0 ? "#f2c14d" : "#e07a2f",
              dmg: u.dmg,
              team: u.team,
              magic: u.kind === "caster",
              life: 0.45,
            });
          } else this.hurt(target, u.dmg, u);
        }
      }
    } else if (o.t === "gather") this.gather(u, o, dt);
    else if (o.t === "build") this.construct(u, o, dt);
  }

  private swing(u: Unit) {
    let cd = u.kind === "ranged" ? 1.25 : 0.95;
    if (u.items.includes("gloves")) cd *= 0.8;
    if (u.slow > 0) cd *= 1.35;
    const chilled = this.units.some(
      (h) =>
        h.team !== u.team &&
        h.team !== 2 &&
        h.kind === "hero" &&
        h.faction === "ghost" &&
        h.ranks[2] > 0 &&
        h.hp > 0 &&
        dist(h.x, h.y, u.x, u.y) < 4.5,
    );
    if (chilled) cd *= 1.25;
    return cd;
  }

  private moveAlong(u: Unit, dt: number) {
    const n = u.path[0];
    if (!n) return;
    const d = dist(u.x, u.y, n.x, n.y);
    let speed = u.speed * (u.items.includes("boots") ? 1.18 : 1) * (u.slow > 0 ? 0.62 : 1) * (u.haste > 0 ? 1.2 : 1);
    if (u.faction === "mummy" && u.team !== 2) {
      const aura = this.units.some(
        (h) =>
          h.team === u.team &&
          h.kind === "hero" &&
          h.faction === "mummy" &&
          h.ranks[2] > 0 &&
          h.hp > 0 &&
          dist(h.x, h.y, u.x, u.y) < 4.5,
      );
      if (aura) speed *= 1.15;
    }
    if (u.stealth > 0 && u.faction === "wolf") speed *= 0.85;
    if (d < 0.12) {
      u.path.shift();
      return;
    }
    const step = Math.min(d, speed * dt);
    const nx = u.x + ((n.x - u.x) / d) * step;
    const ny = u.y + ((n.y - u.y) / d) * step;
    if (!this.blocked(nx, ny)) {
      u.x = nx;
      u.y = ny;
    } else if (!this.blocked(nx, u.y)) u.x = nx;
    else if (!this.blocked(u.x, ny)) u.y = ny;
    else u.path = this.pathTo(u.x, u.y, n.x, n.y);
    u.facing = Math.sign(n.x - u.x) || u.facing;
  }

  private gather(u: Unit, o: Extract<Order, { t: "gather" }>, dt: number) {
    if (u.carry >= 12) {
      const hall = this.buildings.find((b) => b.team === u.team && b.kind === "hall" && b.hp > 0 && b.progress >= 1);
      if (!hall) return;
      const spot = this.nearestOpen(hall.x + hall.w * 0.5, hall.y + hall.h + 0.3);
      if (dist(u.x, u.y, spot.x, spot.y) > 0.8) {
        u.path = u.path.length ? u.path : this.pathTo(u.x, u.y, spot.x, spot.y);
        this.moveAlong(u, dt);
        return;
      }
      if (u.carryKind === "gold") this.giveGold(u.team as 0 | 1, u.carry);
      else this.wood[u.team as 0 | 1] += u.carry;
      this.float(u.x, u.y, u.carryKind === "gold" ? `+${u.carry} gold` : `+${u.carry} wood`, "#f2c14d");
      u.carry = 0;
      u.carryKind = null;
      u.path = this.pathTo(u.x, u.y, o.x + 0.2, o.y + 1.1);
      return;
    }
    const tile = this.at(o.x, o.y);
    if (o.res === "wood" && tile !== 3 && tile !== 4) {
      const next = this.findTree(u.x, u.y);
      if (!next) {
        u.order = null;
        return;
      }
      o.x = next.x;
      o.y = next.y;
    }
    const spot = this.nearestOpen(o.x + 0.2, o.y + 1.15);
    if (dist(u.x, u.y, o.x + 0.5, o.y + 0.5) > 1.45) {
      u.path = u.path.length ? u.path : this.pathTo(u.x, u.y, spot.x, spot.y);
      this.moveAlong(u, dt);
      return;
    }
    u.atkWait -= 0;
    u.anim += dt * 6;
    if (u.atkWait > 0) return;
    u.atkWait = 1.1;
    u.facing = Math.sign(o.x - u.x) || 1;
    if (o.res === "gold") {
      u.carry += 8;
      u.carryKind = "gold";
    } else {
      const i = o.y * COLS + o.x;
      this.woodLeft[i] -= 10;
      u.carry += 10;
      u.carryKind = "wood";
      if (this.woodLeft[i] <= 0) {
        this.setTile(o.x, o.y, 0);
        this.rebuildWalk();
      }
    }
  }

  private findTree(x: number, y: number) {
    let best: { x: number; y: number } | null = null;
    let bd = 8;
    for (let ty = 1; ty < ROWS - 1; ty++) {
      for (let tx = 1; tx < COLS - 1; tx++) {
        const t = this.at(tx, ty);
        if (t !== 3 && t !== 4) continue;
        const d = dist(x, y, tx, ty);
        if (d < bd) {
          bd = d;
          best = { x: tx, y: ty };
        }
      }
    }
    return best;
  }

  private construct(u: Unit, o: Extract<Order, { t: "build" }>, dt: number) {
    const b = this.buildings.find((x) => x.id === o.id && x.hp > 0);
    if (!b || b.progress >= 1) {
      u.order = null;
      return;
    }
    const spot = this.nearestOpen(b.x + b.w * 0.2, b.y + b.h + 0.15);
    if (dist(u.x, u.y, b.x + b.w / 2, b.y + b.h / 2) > 2.2) {
      u.path = u.path.length ? u.path : this.pathTo(u.x, u.y, spot.x, spot.y);
      this.moveAlong(u, dt);
      return;
    }
    const spec = BUILD[b.kind];
    b.progress = Math.min(1, b.progress + dt / spec.time);
    u.facing = Math.sign(b.x - u.x) || 1;
    if (b.progress >= 1) {
      u.order = null;
      this.float(b.x + 1, b.y, "done", "#f2c14d");
      this.rebuildWalk();
    }
  }

  private pickup(u: Unit) {
    if (u.kind !== "hero" || u.team === 2) return;
    for (const d of this.drops) {
      if (dist(u.x, u.y, d.x, d.y) < 0.7) {
        const slot = u.items.findIndex((s) => !s);
        if (slot < 0) {
          this.say("The pack is full.");
          return;
        }
        u.items[slot] = d.item;
        if (d.item === "crown") {
          u.maxHp += 40;
          u.maxMana += 20;
          u.dmg += 4;
        }
        if (d.item === "talons") u.dmg += 2;
        if (d.item === "mace") u.dmg += 4;
        if (d.item === "charm") {
          u.maxHp += 18;
          u.hp += 18;
        }
        if (d.item === "heart") {
          u.maxHp += 36;
          u.hp += 36;
        }
        this.drops = this.drops.filter((x) => x !== d);
        this.say(ITEM_META[d.item].name);
        return;
      }
    }
  }

  private stepBuildings(dt: number) {
    for (const b of this.buildings) {
      if (b.hp <= 0 || b.progress < 1) continue;
      b.atkWait = Math.max(0, b.atkWait - dt);
      const q = b.queue[0];
      if (q) {
        q.t += dt;
        if (q.t >= q.need) {
          b.queue.shift();
          if (q.kind === "hero") {
            const dead = this.units.find((u) => u.team === b.team && u.kind === "hero" && u.hp <= 0);
            if (dead) {
              dead.hp = dead.maxHp;
              dead.x = b.rallyX;
              dead.y = b.rallyY;
              dead.mana = dead.maxMana;
              this.float(dead.x, dead.y, "risen", "#f2c14d");
            } else if (!this.units.some((u) => u.team === b.team && u.kind === "hero" && u.hp > 0)) {
              this.spawn(b.team, b.faction, "hero", b.rallyX, b.rallyY);
            }
          } else {
            const u = this.spawn(b.team, b.faction, q.kind, b.rallyX, b.rallyY);
            const rallyTile = this.at(Math.floor(b.rallyX), Math.floor(b.rallyY));
            if (q.kind === "worker" && (rallyTile === 3 || rallyTile === 4 || rallyTile === 11)) {
              u.order = {
                t: "gather",
                x: Math.floor(b.rallyX),
                y: Math.floor(b.rallyY),
                res: rallyTile === 11 ? "gold" : "wood",
              };
            } else {
              u.order = { t: "move", x: b.rallyX, y: b.rallyY };
              u.path = this.pathTo(u.x, u.y, b.rallyX, b.rallyY);
            }
          }
        }
      }
      if (b.kind === "tower" && b.atkWait <= 0) {
        const real = this.units
          .filter((u) => u.hp > 0 && u.team !== b.team)
          .filter((u) => dist(u.x, u.y, b.x + 1, b.y + 1) < 6.2)
          .filter((u) => u.stealth <= 0 || u.revealed > 0 || this.reveal > 0)
          .sort((a, c) => dist(a.x, a.y, b.x, b.y) - dist(c.x, c.y, b.x, b.y))[0];
        if (real) {
          b.atkWait = 1.35;
          this.projs.push({
            x: b.x + 1,
            y: b.y + 0.2,
            tx: real.x,
            ty: real.y,
            color:
              b.faction === "vampire"
                ? "#9a3040"
                : b.faction === "ghost"
                  ? "#9ec4dc"
                  : b.faction === "wolf"
                    ? "#f2c14d"
                    : "#6f8f62",
            dmg: 14,
            team: b.team,
            magic: true,
            life: 0.4,
          });
        }
      }
    }
  }

  private stepProjs(dt: number) {
    for (const p of this.projs) {
      p.life -= dt;
      p.x += (p.tx - p.x) * Math.min(1, dt * 7);
      p.y += (p.ty - p.y) * Math.min(1, dt * 7);
      if (dist(p.x, p.y, p.tx, p.ty) < 0.25 || p.life <= 0) {
        const u = this.unitAt(p.tx, p.ty, 0.8);
        if (u && u.team !== p.team) this.hurt(u, p.dmg, null, p.magic);
        p.life = -1;
      }
    }
    this.projs = this.projs.filter((p) => p.life > 0);
  }

  private bosses(dt: number) {
    for (const u of this.units) {
      if (u.hp <= 0 || !u.boss) continue;
      u.bossCd -= dt;
      const foe = this.nearestFoe(u, 5.5);
      if (!foe) continue;
      if (u.order?.t !== "attack") this.orderAttack(u, foe);
      if (u.bossCd > 0) continue;
      if (u.boss === "king") {
        u.bossCd = 4.2;
        const bite = this.units.find(
          (o) => o.hp > 0 && o.team !== 2 && o.kind !== "hero" && dist(o.x, o.y, u.x, u.y) < 1.25,
        );
        if (bite && Math.random() < 0.45) {
          this.float(bite.x, bite.y, "devour", "#e07a2f");
          bite.hp = 0;
          this.kill(bite, u);
          u.hp = Math.min(u.maxHp, u.hp + 40);
        } else if (dist(foe.x, foe.y, u.x, u.y) > 2.4) {
          this.projs.push({
            x: u.x,
            y: u.y,
            tx: foe.x,
            ty: foe.y,
            color: "#e07a2f",
            dmg: 16,
            team: 2,
            magic: true,
            life: 0.55,
          });
          this.float(u.x, u.y, "hurl", "#f2c14d");
        } else {
          for (const o of this.units) {
            if (o.hp > 0 && o.team !== 2 && dist(o.x, o.y, u.x, u.y) < 2.2) {
              this.hurt(o, 18, u, true);
              o.slow = 0.8;
            }
          }
          this.shake = 0.25;
          if (u.hp < u.maxHp * 0.5) {
            for (const o of this.units) {
              if (o.team !== 2 && o.hp > 0 && dist(o.x, o.y, u.x, u.y) < 4) {
                o.x += (u.x - o.x) * 0.25;
                o.y += (u.y - o.y) * 0.25;
              }
            }
          }
        }
      } else if (u.boss === "horse") {
        u.bossCd = 5;
        const dx = foe.x - u.x;
        const dy = foe.y - u.y;
        const len = Math.hypot(dx, dy) || 1;
        u.x = clamp(u.x + (dx / len) * 2.4, 1, COLS - 2);
        u.y = clamp(u.y + (dy / len) * 2.4, 1, ROWS - 2);
        for (const o of this.units) {
          if (o.hp > 0 && o.team !== 2 && dist(o.x, o.y, u.x, u.y) < 1.3) this.hurt(o, 16, u);
        }
        if (u.hp < u.maxHp * 0.5) u.speed = 1.9;
      } else if (u.boss === "wolf") {
        u.bossCd = 4;
        if (Math.random() < 0.4) {
          this.float(u.x, u.y, "howl", "#d7c4a8");
          for (const o of this.units) {
            if (o.camp === u.camp && o.hp > 0) o.haste = 3;
          }
        } else {
          u.x = foe.x + 0.2;
          u.y = foe.y;
          this.hurt(foe, 14, u);
          foe.slow = 1.2;
        }
      } else if (u.boss === "witch") {
        u.bossCd = 5;
        if (foe.kind !== "hero") {
          this.float(foe.x, foe.y, "hex", "#c9a0e8");
          foe.slow = foe.boss === "king" || foe.boss === "horse" ? 1.2 : 2.4;
          this.hurt(foe, 10, u, true);
        } else this.hurt(foe, 16, u, true);
      } else if (u.boss === "vamp") {
        u.bossCd = 3;
        this.hurt(foe, 10, u);
        u.hp = Math.min(u.maxHp, u.hp + 8);
      } else if (u.boss === "tree") {
        u.bossCd = 3.5;
        for (const o of this.units) {
          if (o.hp > 0 && o.team !== 2 && dist(o.x, o.y, u.x, u.y) < 1.6) {
            this.hurt(o, 8, u);
            o.slow = 1;
          }
        }
      }
    }
  }

  private wakeTrees() {
    for (let y = 1; y < ROWS - 1; y++) {
      for (let x = 1; x < COLS - 1; x++) {
        if (this.at(x, y) !== 4) continue;
        const near = this.units.some((u) => u.team !== 2 && u.hp > 0 && dist(u.x, u.y, x + 0.5, y + 0.5) < 1.35);
        if (!near) continue;
        this.setTile(x, y, 0);
        this.woodLeft[y * COLS + x] = 0;
        const u = this.spawn(2, "mummy", "melee", x + 0.5, y + 0.5);
        u.boss = "tree";
        u.camp = 1000 + x + y * COLS;
        u.homeX = u.x;
        u.homeY = u.y;
        this.bossStats(u, 80, 8, 0.7, "Waking Tree");
        this.rebuildWalk();
      }
    }
  }

  private ai(dt: number) {
    this.aiT -= dt;
    if (this.aiT > 0) return;
    this.aiT = 1.1;
    const team = 1 as const;
    const halls = this.buildings.filter((b) => b.team === team && b.kind === "hall" && b.hp > 0);
    if (!halls.length) return;
    const hall = halls[0];
    const workers = this.units.filter((u) => u.team === team && u.kind === "worker" && u.hp > 0);
    for (const w of workers) {
      if (w.order) continue;
      const mine = this.findRes(w.x, w.y, 11) ?? this.findRes(w.x, w.y, 3);
      if (!mine) continue;
      w.order = { t: "gather", x: mine.x, y: mine.y, res: this.at(mine.x, mine.y) === 11 ? "gold" : "wood" };
    }
    const has = (k: BKind) => this.buildings.some((b) => b.team === team && b.kind === k && b.hp > 0);
    const site = (k: BKind) => {
      const spec = BUILD[k];
      for (let r = 2; r < 8; r++) {
        for (let yy = -r; yy <= r; yy++) {
          for (let xx = -r; xx <= r; xx++) {
            if (this.footOk(hall.x + xx, hall.y + yy, spec.w, spec.h)) return { x: hall.x + xx, y: hall.y + yy };
          }
        }
      }
      return null;
    };
    if (!has("barracks")) {
      const s = site("barracks");
      if (s) this.tryPlace("barracks", s.x, s.y, team);
    } else if (!has("altar") && this.gold[team] > 200) {
      const s = site("altar");
      if (s) this.tryPlace("altar", s.x, s.y, team);
    } else if (!has("farm") && this.popOf(team).used + 2 > this.popOf(team).cap) {
      const s = site("farm");
      if (s) this.tryPlace("farm", s.x, s.y, team);
    } else if (!has("lodge") && this.gold[team] > 180) {
      const s = site("lodge");
      if (s) this.tryPlace("lodge", s.x, s.y, team);
    } else if (!has("tower") && this.mood === "aggressive" && this.gold[team] > 160) {
      const s = site("tower");
      if (s) this.tryPlace("tower", s.x, s.y, team);
    }
    const idleBuilders = workers.filter((w) => !w.order);
    const unfinished = this.buildings.find((b) => b.team === team && b.progress < 1 && b.hp > 0);
    if (unfinished) {
      for (const w of idleBuilders) w.order = { t: "build", id: unfinished.id };
    }
    for (const b of this.buildings) {
      if (b.team !== team || b.progress < 1 || b.queue.length) continue;
      const pop = this.popOf(team);
      const want =
        b.kind === "hall"
          ? "worker"
          : b.kind === "barracks"
            ? "melee"
            : b.kind === "lodge"
              ? "ranged"
              : b.kind === "altar"
                ? "hero"
                : null;
      if (!want) continue;
      if (want === "hero" && this.units.some((u) => u.team === team && u.kind === "hero" && u.hp > 0)) continue;
      if (want === "worker" && workers.length >= 5) continue;
      const cost = TRAIN[want];
      if (pop.used + cost.pop > pop.cap) continue;
      if (!this.canAfford(team, cost.gold, cost.wood)) continue;
      this.pay(team, cost.gold, cost.wood);
      b.queue.push({ kind: want, t: 0, need: cost.time });
    }
    const army = this.units.filter((u) => u.team === team && u.hp > 0 && u.kind !== "worker");
    const playerHall = this.buildings.find((b) => b.team === 0 && b.kind === "hall" && b.hp > 0);
    if (!playerHall) return;
    const hero = army.find((u) => u.kind === "hero");
    if (this.mood === "passive") return;
    const seen = this.units.some(
      (u) => u.team === 0 && u.hp > 0 && dist(u.x, u.y, hall.x, hall.y) < (this.mood === "aggressive" ? 16 : 9),
    );
    const ready = army.length >= (this.mood === "aggressive" ? 3 : 5) && (!hero || hero.level >= 1);
    if (this.mood === "aggressive" && ready) {
      for (const u of army) {
        if (!u.order || u.order.t === "move") this.orderAttackBuilding(u, playerHall);
      }
    } else if (this.mood === "normal" && seen) {
      for (const u of army) {
        if (!u.order) {
          const foe = this.nearestFoe(u, 8);
          if (foe) this.orderAttack(u, foe);
        }
      }
    }
    if (hero && hero.level >= 3) {
      const camp = this.units.find((u) => u.team === 2 && u.hp > 0 && u.boss === "" && dist(u.x, u.y, hero.x, hero.y) < 8);
      if (camp && !hero.order) this.orderAttack(hero, camp);
    }
  }

  private findRes(x: number, y: number, tile: number) {
    let best: { x: number; y: number } | null = null;
    let bd = 30;
    for (let ty = 1; ty < ROWS - 1; ty++) {
      for (let tx = 1; tx < COLS - 1; tx++) {
        if (this.at(tx, ty) !== tile) continue;
        const d = dist(x, y, tx, ty);
        if (d < bd) {
          bd = d;
          best = { x: tx, y: ty };
        }
      }
    }
    return best;
  }

  dmgBonus(u: Unit) {
    return u.dmg;
  }
}
