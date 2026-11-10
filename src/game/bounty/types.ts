export type Faction = "vampire" | "ghost" | "wolf" | "mummy";
export type Mood = "passive" | "normal" | "aggressive";
export type UnitKind = "worker" | "melee" | "ranged" | "caster" | "hero";
export type BKind = "hall" | "farm" | "barracks" | "altar" | "lodge" | "tower";
export type ItemId =
  | "brew"
  | "boots"
  | "talons"
  | "charm"
  | "gloves"
  | "mace"
  | "shield"
  | "ash"
  | "heart"
  | "crown"
  | "mask"
  | "seal"
  | "bangle";

export const FACTION_LIST: Faction[] = ["vampire", "ghost", "wolf", "mummy"];

export const FACTION_META: Record<
  Faction,
  { name: string; color: string; ink: string; blurb: string }
> = {
  vampire: {
    name: "Vampires",
    color: "#9a3040",
    ink: "#f3d5da",
    blurb: "Fragile. Each hit gives a little blood back.",
  },
  ghost: {
    name: "Ghosts",
    color: "#9ec4dc",
    ink: "#10202c",
    blurb: "A little faster. They pass through their own.",
  },
  wolf: {
    name: "Werewolves",
    color: "#b08a5a",
    ink: "#1a120c",
    blurb: "Faster and harder, and they cost more.",
  },
  mummy: {
    name: "Zombies & Mummies",
    color: "#6f8f62",
    ink: "#10160e",
    blurb: "Cheaper and weaker. The coil heals them.",
  },
};

export const UNIT_NAME: Record<Faction, Record<UnitKind, string>> = {
  vampire: {
    worker: "Thrall",
    melee: "Knight",
    ranged: "Crossbow",
    caster: "Blood priest",
    hero: "Vampire Lord",
  },
  ghost: {
    worker: "Shade",
    melee: "Specter",
    ranged: "Banshee",
    caster: "Haunt",
    hero: "Ghost Lord",
  },
  wolf: {
    worker: "Packhand",
    melee: "Brute",
    ranged: "Raider",
    caster: "Moon shaman",
    hero: "Alpha",
  },
  mummy: {
    worker: "Zombie",
    melee: "Zombie soldier",
    ranged: "Mummy archer",
    caster: "Mummy priest",
    hero: "Mummy Lord",
  },
};

export const SKILLS: Record<Faction, [string, string, string, string]> = {
  vampire: ["Blood Tithe", "Mist Form", "Blood Aura", "Night Rising"],
  ghost: ["Wail", "Fade", "Grave Chill", "Procession"],
  wolf: ["Moon Prowl", "Savage Strike", "Two Shadows", "Wolfstorm"],
  mummy: ["Wrapping Coil", "Consume", "Rot Aura", "Rise Again"],
};

export const SKILL_TIP: Record<Faction, [string, string, string, string]> = {
  vampire: [
    "Heals a vampire or wounds the living.",
    "Cannot be hurt for a short time.",
    "Vampires steal a little life.",
    "Brings two nearby dead allies back.",
  ],
  ghost: [
    "Damages and slows one enemy.",
    "Attacks miss for a short time.",
    "Nearby enemies strike slower.",
    "Raises two ghosts for a short time.",
  ],
  wolf: [
    "Fog. The next hit is much harder.",
    "Claws sometimes hit twice as hard.",
    "Two pale copies fight, then fade.",
    "Spins and hits everyone close.",
  ],
  mummy: [
    "Wounds the living or heals your dead.",
    "Destroys a zombie to heal the lord.",
    "Your dead move a little faster.",
    "Raises three zombies for a short time.",
  ],
};

export const ITEM_META: Record<
  ItemId,
  { name: string; tier: "green" | "blue" | "purple"; use: boolean; tip: string }
> = {
  brew: { name: "Witch's Brew", tier: "green", use: true, tip: "Heal." },
  boots: { name: "Batwing Boots", tier: "green", use: false, tip: "Move faster." },
  talons: { name: "Raven Talons", tier: "green", use: false, tip: "A little damage." },
  charm: { name: "Bone Charm", tier: "green", use: false, tip: "A little health." },
  gloves: { name: "Specter Gloves", tier: "blue", use: false, tip: "Attack faster." },
  mace: { name: "Pumpkin Mace", tier: "blue", use: false, tip: "More damage." },
  shield: { name: "Skull Shield", tier: "blue", use: false, tip: "Sometimes turns a hit." },
  ash: { name: "Grave Ash", tier: "blue", use: true, tip: "Reveal the hidden." },
  heart: { name: "Ghoul Heart", tier: "blue", use: false, tip: "More health." },
  crown: { name: "Pumpkin Crown", tier: "purple", use: false, tip: "Health, mana, damage." },
  mask: { name: "Vampire's Mask", tier: "purple", use: false, tip: "Hits heal you." },
  seal: { name: "Horseman's Seal", tier: "purple", use: false, tip: "Cheat death once." },
  bangle: { name: "Witch Bangle", tier: "purple", use: false, tip: "Spells cost less." },
};

export const TIER_COLOR = { green: "#7dcea0", blue: "#7eb6e0", purple: "#c9a0e8" };

export type Order =
  | { t: "move"; x: number; y: number }
  | { t: "attack"; id: number }
  | { t: "gather"; x: number; y: number; res: "gold" | "wood" }
  | { t: "build"; id: number };

export interface Unit {
  id: number;
  team: 0 | 1 | 2;
  faction: Faction;
  kind: UnitKind;
  name: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  dmg: number;
  speed: number;
  range: number;
  atkWait: number;
  path: { x: number; y: number }[];
  order: Order | null;
  carry: number;
  carryKind: "gold" | "wood" | null;
  level: number;
  xp: number;
  points: number;
  ranks: [number, number, number, number];
  cds: [number, number, number, number];
  invuln: number;
  evade: number;
  stealth: number;
  nextHit: number;
  slow: number;
  storm: number;
  haste: number;
  camp: number;
  boss: "" | "king" | "horse" | "wolf" | "witch" | "vamp" | "tree";
  bossCd: number;
  temp: number;
  items: (ItemId | null)[];
  facing: number;
  anim: number;
  homeX: number;
  homeY: number;
  revealed: number;
}

export interface Building {
  id: number;
  team: 0 | 1;
  faction: Faction;
  kind: BKind;
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  progress: number;
  queue: { kind: UnitKind; t: number; need: number }[];
  rallyX: number;
  rallyY: number;
  tier: number;
  atkWait: number;
}

export interface Drop {
  id: number;
  x: number;
  y: number;
  item: ItemId;
}

export interface Fx {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  vy: number;
}

export interface Proj {
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
  dmg: number;
  team: 0 | 1 | 2;
  magic: boolean;
  life: number;
}

export interface Corpse {
  x: number;
  y: number;
  team: 0 | 1;
  faction: Faction;
  kind: UnitKind;
  life: number;
}

export type Sel = { t: "u" | "b"; id: number };

export const COLS = 42;
export const ROWS = 42;
export const TW = 58;
export const TH = 29;

export const BUILD: Record<
  BKind,
  { name: string; w: number; h: number; gold: number; wood: number; time: number; hp: number }
> = {
  hall: { name: "Town hall", w: 3, h: 3, gold: 0, wood: 0, time: 1, hp: 900 },
  farm: { name: "Pumpkin patch", w: 2, h: 2, gold: 40, wood: 70, time: 16, hp: 280 },
  barracks: { name: "Barracks", w: 2, h: 2, gold: 150, wood: 80, time: 24, hp: 520 },
  altar: { name: "Altar", w: 2, h: 2, gold: 180, wood: 70, time: 26, hp: 480 },
  lodge: { name: "Lodge", w: 2, h: 2, gold: 140, wood: 90, time: 24, hp: 460 },
  tower: { name: "Tower", w: 2, h: 2, gold: 100, wood: 50, time: 18, hp: 420 },
};

export const TRAIN: Record<UnitKind, { gold: number; wood: number; time: number; pop: number }> = {
  worker: { gold: 50, wood: 0, time: 12, pop: 1 },
  melee: { gold: 75, wood: 0, time: 15, pop: 1 },
  ranged: { gold: 80, wood: 20, time: 16, pop: 1 },
  caster: { gold: 90, wood: 25, time: 18, pop: 1 },
  hero: { gold: 240, wood: 80, time: 28, pop: 2 },
};
