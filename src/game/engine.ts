// @ts-nocheck
import { loadPrefs, savePrefs, Score } from "./audio";
export let MAP_W = 108;
export let MAP_H = 108;
export const TW = 64;
export const TH = 32;
export const UNITS = {
	villager: {
		name: "Villager",
		hp: 40,
		speed: 2.15,
		dmg: 3,
		range: .55,
		cd: 1.1,
		cost: { food: 50 },
		time: 12,
		ranged: false,
		age: 0
	},
	club: {
		name: "Clubman",
		hp: 75,
		speed: 2.05,
		dmg: 8,
		range: .62,
		cd: .95,
		cost: {
			food: 60,
			gold: 20
		},
		time: 12,
		ranged: false,
		age: 0
	},
	warrior: {
		name: "Warrior",
		hp: 80,
		speed: 2.1,
		dmg: 9,
		range: .7,
		cd: 1,
		cost: {
			food: 50,
			gold: 20
		},
		time: 14,
		ranged: false,
		age: 1
	},
	sword: {
		name: "Swordsman",
		hp: 90,
		speed: 2.1,
		dmg: 12,
		range: .72,
		cd: 1,
		cost: {
			food: 60,
			gold: 30
		},
		time: 15,
		ranged: false,
		age: 2
	},
	cavalry: {
		name: "Cavalry",
		hp: 95,
		speed: 3.36,
		dmg: 11,
		range: .75,
		cd: .9,
		cost: {
			food: 80,
			gold: 30
		},
		time: 16,
		ranged: false,
		age: 2
	},
	knight: {
		name: "Knight",
		hp: 140,
		speed: 2.9,
		dmg: 18,
		range: .85,
		cd: 1,
		cost: {
			food: 100,
			gold: 60
		},
		time: 18,
		ranged: false,
		age: 4
	},
	archer: {
		name: "Archer",
		hp: 50,
		speed: 2.15,
		dmg: 7,
		range: 4.3,
		cd: 1.35,
		cost: {
			food: 40,
			gold: 45
		},
		time: 15,
		ranged: true,
		age: 1
	},
	crossbow: {
		name: "Crossbow",
		hp: 62,
		speed: 1.95,
		dmg: 13,
		range: 5.2,
		cd: 1.65,
		cost: {
			food: 55,
			gold: 65
		},
		time: 16,
		ranged: true,
		age: 3
	},
	scout: {
		name: "Scout",
		hp: 40,
		speed: 4.8375,
		dmg: 3,
		range: .55,
		cd: 1.1,
		cost: { food: 60 },
		time: 12,
		ranged: false,
		age: 0
	},
	skeleton: {
		name: "Skeleton",
		hp: 34,
		speed: 2.25,
		dmg: 6,
		range: .6,
		cd: .85,
		cost: {},
		time: 0,
		ranged: false,
		age: 9
	},
	zombie: {
		name: "Zombie",
		hp: 78,
		speed: 1.25,
		dmg: 9,
		range: .62,
		cd: 1.25,
		cost: {},
		time: 0,
		ranged: false,
		age: 9
	},
	tamer: {
		name: "Tamer",
		hp: 58,
		speed: 2.25,
		dmg: 6,
		range: .7,
		cd: 1.15,
		cost: {
			food: 50,
			gold: 40
		},
		time: 14,
		ranged: false,
		age: 2
	},
	halberd: {
		name: "Halberd",
		hp: 64,
		speed: 2.05,
		dmg: 12,
		range: 1.15,
		cd: 1.15,
		cost: {
			food: 50,
			gold: 20
		},
		time: 14,
		ranged: false,
		age: 2
	},
	mage: {
		name: "Mage",
		hp: 48,
		speed: 2.05,
		dmg: 8,
		range: 4.6,
		cd: 2,
		cost: {
			food: 60,
			gold: 60
		},
		time: 16,
		ranged: true,
		age: 3
	},
	frost: {
		name: "Frost",
		hp: 44,
		speed: 2,
		dmg: 7,
		range: 5,
		cd: 1.7,
		cost: {
			food: 50,
			gold: 75
		},
		time: 16,
		ranged: true,
		age: 3
	},
	priest: {
		name: "Priest",
		hp: 54,
		speed: 1.9,
		dmg: 5,
		range: 4.2,
		cd: 1.6,
		cost: {
			food: 55,
			gold: 70
		},
		time: 16,
		ranged: true,
		age: 4
	},
	warlock: {
		name: "Warlock",
		hp: 50,
		speed: 1.9,
		dmg: 16,
		range: 4,
		cd: 2.1,
		cost: {
			food: 70,
			gold: 90
		},
		time: 18,
		ranged: true,
		age: 4
	},
	guard: {
		name: "Guard",
		hp: 120,
		speed: 2,
		dmg: 16,
		range: .8,
		cd: 1.05,
		cost: {
			food: 80,
			gold: 45
		},
		time: 16,
		ranged: false,
		age: 4
	},
	spear: {
		name: "Spearman",
		hp: 28,
		speed: 2.2,
		dmg: 16,
		range: 1.05,
		cd: 1.05,
		cost: { food: 0 },
		time: 0,
		ranged: false,
		age: 0
	},
	hero: {
		name: "Champion",
		hp: 170,
		speed: 2.45,
		dmg: 16,
		range: .78,
		cd: .85,
		cost: {
			food: 80,
			gold: 90
		},
		time: 18,
		ranged: false,
		age: 0
	},
	demigod: {
		name: "Demigod",
		hp: 74,
		speed: 2,
		dmg: 7,
		range: 4.2,
		cd: 1.7,
		cost: { food: 80, gold: 70 },
		time: 16,
		ranged: true,
		age: 1
	},
	avatar: {
		name: "Avatar",
		hp: 160,
		speed: 1.9,
		dmg: 14,
		range: 4.8,
		cd: 1.5,
		cost: { food: 160, gold: 180 },
		time: 24,
		ranged: true,
		age: 3
	},
	god: {
		name: "God",
		hp: 420,
		speed: 1.7,
		dmg: 30,
		range: 5.6,
		cd: 1.4,
		cost: { food: 400, gold: 500 },
		time: 40,
		ranged: true,
		age: 4
	},
	ram: {
		name: "Ram",
		hp: 160,
		speed: 1.15,
		dmg: 14,
		range: .75,
		cd: 1.45,
		cost: { wood: 90, gold: 30 },
		time: 18,
		ranged: false,
		age: 2
	},
	catapult: {
		name: "Catapult",
		hp: 100,
		speed: 1.05,
		dmg: 22,
		range: 6.2,
		cd: 2.5,
		cost: { wood: 110, gold: 80 },
		time: 22,
		ranged: true,
		age: 2
	},
	ballista: {
		name: "Ballista",
		hp: 78,
		speed: 1.2,
		dmg: 16,
		range: 7.2,
		cd: 1.85,
		cost: { wood: 80, gold: 70 },
		time: 18,
		ranged: true,
		age: 3
	}
};
export const BLDS = {
	townhall: {
		name: "Town Hall",
		w: 3,
		h: 3,
		hp: 900,
		time: 40,
		pop: 10,
		cost: { wood: 200 },
		age: 0
	},
	house: {
		name: "House",
		w: 2,
		h: 2,
		hp: 220,
		time: 8,
		pop: 5,
		cost: { wood: 30 },
		age: 0
	},
	dump: {
		name: "Resource Dump",
		w: 2,
		h: 2,
		hp: 260,
		time: 12,
		pop: 0,
		cost: { wood: 100 },
		age: 0
	},
	farm: {
		name: "Farm",
		w: 2,
		h: 2,
		hp: 140,
		time: 9,
		pop: 0,
		cost: { wood: 60 },
		age: 0
	},
	barracks: {
		name: "Barracks",
		w: 3,
		h: 2,
		hp: 480,
		time: 18,
		pop: 0,
		cost: { wood: 175 },
		age: 0
	},
	range: {
		name: "Archery Range",
		w: 3,
		h: 2,
		hp: 450,
		time: 18,
		pop: 0,
		cost: {
			wood: 150,
			gold: 50
		},
		age: 1
	},
	stable: {
		name: "Stable",
		w: 3,
		h: 2,
		hp: 480,
		time: 18,
		pop: 0,
		cost: {
			wood: 150,
			gold: 40
		},
		age: 2
	},
	school: {
		name: "Mage School",
		w: 3,
		h: 2,
		hp: 460,
		time: 22,
		pop: 0,
		cost: {
			wood: 200,
			gold: 80
		},
		age: 3
	},
	keep: {
		name: "Keep",
		w: 3,
		h: 2,
		hp: 560,
		time: 24,
		pop: 0,
		cost: {
			wood: 220,
			gold: 120
		},
		age: 4
	},
	smith: {
		name: "Blacksmith",
		w: 3,
		h: 2,
		hp: 480,
		time: 18,
		pop: 0,
		cost: {
			wood: 150,
			gold: 60
		},
		age: 1
	},
	husbandry: {
		name: "Husbandry",
		w: 3,
		h: 2,
		hp: 420,
		time: 18,
		pop: 0,
		cost: {
			wood: 140,
			gold: 40
		},
		age: 2
	},
	tower: {
		name: "Watchtower",
		w: 1,
		h: 1,
		hp: 380,
		time: 16,
		pop: 0,
		cost: {
			wood: 50,
			stone: 100
		},
		age: 0
	},
	wall: {
		name: "Wall",
		w: 1,
		h: 1,
		hp: 160,
		time: 4,
		pop: 0,
		cost: { wood: 8 },
		age: 0
	},
	crypt: {
		name: "Necromancer",
		w: 1,
		h: 1,
		hp: 260,
		time: 0,
		pop: 0,
		cost: {},
		age: 0
	},
	altar: {
		name: "Altar",
		w: 2,
		h: 2,
		hp: 420,
		time: 16,
		pop: 0,
		cost: {
			wood: 140,
			gold: 40
		},
		age: 0
	},
	shop: {
		name: "Shop",
		w: 2,
		h: 2,
		hp: 320,
		time: 14,
		pop: 0,
		cost: { wood: 120 },
		age: 0
	},
	temple: {
		name: "Temple",
		w: 3,
		h: 3,
		hp: 560,
		time: 22,
		pop: 0,
		cost: { wood: 180, gold: 80 },
		age: 1
	},
	yard: {
		name: "Siege Yard",
		w: 3,
		h: 3,
		hp: 480,
		time: 20,
		pop: 0,
		cost: { wood: 180, gold: 50 },
		age: 2
	}
};
const BUILD_BTN = [
	{ id: "wall", label: "Wall", use: "Blocks paths" },
	{ id: "house", label: "House", use: "Room for more people" },
	{ id: "farm", label: "Farm", use: "A field of food" },
	{ id: "dump", label: "Store", use: "Holds what you gather" },
	{ id: "barracks", label: "Barracks", use: "Trains soldiers" },
	{ id: "altar", label: "Altar", use: "Hires your hero" },
	{ id: "temple", label: "Temple", use: "Priests and your god" },
	{ id: "shop", label: "Shop", use: "Spend gold on gear" },
	{ id: "tower", label: "Tower", use: "Shoots nearby foes" },
	{ id: "range", label: "Archery", use: "Trains archers" },
	{ id: "stable", label: "Stable", use: "Trains riders" },
	{ id: "yard", label: "Siege", use: "Rams and catapults" },
	{ id: "smith", label: "Smith", use: "Stronger arms and walls" },
	{ id: "husbandry", label: "Herds", use: "Tougher people, more goods" },
	{ id: "school", label: "School", use: "Trains mages" },
	{ id: "keep", label: "Keep", use: "Trains the guard" }
];
export const AGE_COST = {
	food: 300,
	gold: 200
};
export const AGE_TIME = 28;
export const AGE3_COST = {
	food: 500,
	gold: 400
};
export const AGE3_TIME = 40;
export const AGE4_COST = {
	food: 800,
	gold: 600
};
export const AGE4_TIME = 48;
export const AGE5_COST = {
	food: 1200,
	gold: 900
};
export const AGE5_TIME = 58;
export const CARRY = 12;
const XP_NEED = [0, 16, 40, 76, 124, 190, 270, 360, 460, 570, 690, 820, 960, 1110, 1270, 1440, 1620, 1810, 2010, 2220];
export const POP_CAP = 40;
const GATHER = {
	tree: {
		res: "wood",
		rate: .9
	},
	berry: {
		res: "food",
		rate: .75
	},
	gold: {
		res: "gold",
		rate: .55
	},
	stone: {
		res: "stone",
		rate: .55
	},
	sheep: {
		res: "food",
		rate: 1.15
	},
	lion: {
		res: "food",
		rate: 1.15
	},
	farm: {
		res: "food",
		rate: .55
	},
	fish: {
		res: "food",
		rate: .7
	},
	wolf: { res: "food", rate: 1.05 },
	boar: { res: "food", rate: 1.05 },
	spider: { res: "food", rate: 1.05 },
	troll: { res: "food", rate: 1.05 },
	alpha: { res: "food", rate: 1.05 },
	brood: { res: "food", rate: 1.05 },
	gore: { res: "food", rate: 1.05 },
	chief: { res: "food", rate: 1.05 }
};
export const MONSTERS = {
	wolf: { name: "Wolf", hp: 28, dmg: 7, range: 4.2, bite: .85, pace: .28, food: 70 },
	boar: { name: "Boar", hp: 55, dmg: 12, range: 3.2, bite: 1.2, pace: .5, food: 140 },
	spider: { name: "Spider", hp: 18, dmg: 5, range: 3.4, bite: .7, pace: .22, food: 40 },
	troll: { name: "Troll", hp: 110, dmg: 16, range: 3.6, bite: 1.45, pace: .62, food: 220 },
	harpy: { name: "Harpy", hp: 34, dmg: 8, range: 5.4, bite: .7, pace: .18, food: 80 },
	minotaur: { name: "Minotaur", hp: 150, dmg: 18, range: 3.4, bite: 1.25, pace: .48, food: 200 },
	cyclops: { name: "Cyclops", hp: 210, dmg: 24, range: 3.2, bite: 1.55, pace: .7, food: 260 },
	gorgon: { name: "Gorgon", hp: 72, dmg: 11, range: 4.6, bite: 1.05, pace: .36, food: 130 }
};
export function beastOf(kind) {
	if (kind === "lion") return { name: "Lion", hp: 36, dmg: 9, range: 3.6, bite: 1.15, pace: .42, food: 130 };
	return MONSTERS[kind] || BOSSES[kind] || null;
}
export const BOSSES = {
	alpha: { name: "Alpha", hp: 220, dmg: 18, range: 5.4, bite: 1.05, pace: .32, food: 180 },
	brood: { name: "Brood", hp: 170, dmg: 14, range: 4.8, bite: .9, pace: .24, food: 140 },
	gore: { name: "Goreboar", hp: 280, dmg: 24, range: 4.4, bite: 1.25, pace: .46, food: 220 },
	chief: { name: "Troll Chief", hp: 360, dmg: 28, range: 4.6, bite: 1.4, pace: .55, food: 280 }
};
export const ITEMS = {
	boots: { name: "Boots", hint: "+15% speed", speed: 1.15, color: "#6b4630" },
	gloves: { name: "Gloves", hint: "+20% gathering", work: 1.2, color: "#c4a15a" },
	cloak: { name: "Cloak", hint: "+10% speed, +10% gathering", speed: 1.1, work: 1.1, color: "#3d6b4f" },
	blade: { name: "Blade", hint: "+4 damage", dmg: 4, color: "#d5dde6" },
	shield: { name: "Shield", hint: "+20 health", hp: 20, color: "#8a9a7a" },
	axe: { name: "Axe", hint: "+6 damage", dmg: 6, color: "#a34b32" },
	mail: { name: "Mail", hint: "+30 health", hp: 30, color: "#5c8fbf" },
	charm: { name: "Charm", hint: "+3 damage, +15 health", dmg: 3, hp: 15, color: "#7b4bb8" },
	crown: { name: "Crown", hint: "+8 damage, +40 health", dmg: 8, hp: 40, color: "#e2b340" }
};
const SHOP_PRICE = { boots: 40, gloves: 45, cloak: 70, blade: 80, shield: 60, axe: 110, mail: 90, charm: 120, crown: 160 };
const SHOPPER = { club: 1, warrior: 1, sword: 1, guard: 1, cavalry: 1, knight: 1, archer: 1, crossbow: 1, scout: 1, mage: 1, frost: 1, priest: 1, warlock: 1, tamer: 1, halberd: 1, spear: 1, hero: 1, demigod: 1, avatar: 1, god: 1 };
const SIDE_NAMES = {
	blue: { villager: "Villager", club: "Clubman", warrior: "Warrior", sword: "Swordsman", archer: "Archer", crossbow: "Crossbow", scout: "Scout", cavalry: "Rider", knight: "Knight", tamer: "Tamer", mage: "Mage", frost: "Frost", priest: "Priest", warlock: "Warlock", guard: "Guard", spear: "Spearman", halberd: "Halberd", hero: "Champion", demigod: "Priest", avatar: "Bishop", god: "The Warden", ram: "Ram", catapult: "Mangonel", ballista: "Scorpion" },
	red: { villager: "Hand", club: "Brute", warrior: "Raider", sword: "Cleaver", archer: "Hunter", crossbow: "Shooter", scout: "Runner", cavalry: "Outrider", knight: "Ravager", tamer: "Handler", mage: "Hexer", frost: "Warder", priest: "Mender", warlock: "Binder", guard: "Bulwark", spear: "Spearman", halberd: "Halberd", hero: "Chieftain", demigod: "Prophet", avatar: "Doomcaller", god: "The Skinner", ram: "Gore Ram", catapult: "Rock Sling", ballista: "Spitter" },
	dynasty: { villager: "Peasant", club: "Levy", warrior: "Saber", sword: "Jian", archer: "Bowman", crossbow: "Crossbowman", scout: "Lookout", cavalry: "Rider", knight: "Lancer", tamer: "Keeper", mage: "Scholar", frost: "Icecaller", priest: "Monk", warlock: "Sorcerer", guard: "Palace Guard", spear: "Spearman", halberd: "Ji", hero: "General", demigod: "Sage", avatar: "Envoy", god: "Jade Lord", ram: "Mantlet", catapult: "Traction", ballista: "Repeater" },
	coven: { villager: "Acolyte", club: "Spark", warrior: "Hexblade", sword: "Spellblade", archer: "Seer", crossbow: "Lancer", scout: "Wisp", cavalry: "Courser", knight: "Archon", tamer: "Caller", mage: "Adept", frost: "Rime", priest: "Cantor", warlock: "Shade", guard: "Ward", spear: "Thorn", halberd: "Halberd", hero: "Archmage", demigod: "Oracle", avatar: "Starcaller", god: "Violet God", ram: "Warded Ram", catapult: "Starling", ballista: "Arc Lance" },
	egypt: { villager: "Laborer", club: "Mace", warrior: "Khopesh", sword: "Khopesh Guard", archer: "Bowman", crossbow: "Composite", scout: "Scout", cavalry: "Chariot", knight: "Heavy Chariot", tamer: "Beast Keeper", mage: "Magician", frost: "Nile Caller", priest: "Lector", warlock: "Hexer", guard: "Medjay", spear: "Spearman", halberd: "Halberd", hero: "Pharaoh", demigod: "Sun Priest", avatar: "High Priest", god: "The Sun", ram: "Siege Ram", catapult: "Stone Thrower", ballista: "Bolt Thrower" }
};
const LOOT = {
	spider: ["boots", "gloves", "cloak"],
	wolf: ["boots", "blade", "shield"],
	lion: ["blade", "mail", "axe"],
	boar: ["blade", "shield", "axe"],
	troll: ["crown", "mail", "charm"],
	harpy: ["cloak", "boots", "gloves"],
	minotaur: ["axe", "mail", "blade"],
	cyclops: ["crown", "axe", "mail"],
	gorgon: ["charm", "cloak", "blade"],
	alpha: ["crown", "axe", "charm"],
	brood: ["cloak", "charm", "blade"],
	gore: ["mail", "axe", "crown"],
	chief: ["crown", "charm", "axe"]
};
const DIRS = [
	[
		1,
		0,
		1
	],
	[
		-1,
		0,
		1
	],
	[
		0,
		1,
		1
	],
	[
		0,
		-1,
		1
	],
	[
		1,
		1,
		1.414
	],
	[
		1,
		-1,
		1.414
	],
	[
		-1,
		1,
		1.414
	],
	[
		-1,
		-1,
		1.414
	]
];
export const realmApi: { hold: any } = { hold: null };
function iso(x, y) {
	return {
		sx: (x - y) * (TW / 2),
		sy: (x + y) * (TH / 2)
	};
}
function fromIso(sx, sy) {
	return {
		x: (sx / (TW / 2) + sy / (TH / 2)) / 2,
		y: (sy / (TH / 2) - sx / (TW / 2)) / 2
	};
}
function dist(ax, ay, bx, by) {
	return Math.hypot(ax - bx, ay - by);
}
function distRect(px, py, x, y, w, h) {
	const cx = Math.max(x, Math.min(px, x + w));
	const cy = Math.max(y, Math.min(py, y + h));
	return Math.hypot(px - cx, py - cy);
}
function costText(cost) {
	const parts = [];
	for (const k of [
		"food",
		"wood",
		"gold",
		"stone"
	]) {
		const n = cost[k];
		if (n) parts.push(`${n} ${k}`);
	}
	return parts.join(", ");
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
class Heap {
	a = [];
	get size() {
		return this.a.length;
	}
	push(i, f, g) {
		this.a.push({
			i,
			f,
			g
		});
		let n = this.a.length - 1;
		while (n > 0) {
			const p = n - 1 >> 1;
			if (this.a[p].f <= this.a[n].f) break;
			[this.a[p], this.a[n]] = [this.a[n], this.a[p]];
			n = p;
		}
	}
	pop() {
		const top = this.a[0];
		const last = this.a.pop();
		if (!top || !last) return undefined;
		if (this.a.length) {
			this.a[0] = last;
			let n = 0;
			for (;;) {
				const l = n * 2 + 1;
				const r = l + 1;
				let s = n;
				if (l < this.a.length && this.a[l].f < this.a[s].f) s = l;
				if (r < this.a.length && this.a[r].f < this.a[s].f) s = r;
				if (s === n) break;
				[this.a[s], this.a[n]] = [this.a[n], this.a[s]];
				n = s;
			}
		}
		return top;
	}
}
export type Controls = {
	panUp: string;
	panDown: string;
	panLeft: string;
	panRight: string;
	pause: string;
	pauseAlt: string;
	idle: string;
	cycle: string;
	group: string[];
	groupMod: "ctrl" | "alt" | "shift";
	selectButton: 0 | 2;
	commandButton: 0 | 2;
	wheelDir: 1 | -1;
	doubleClick: "screen" | "all" | "fight";
	touchDrag: "select" | "pan";
	pinchDir: 1 | -1;
	doubleTap: "screen" | "all" | "fight";
	flag: "fight" | "idle";
};

function defaultControls(): Controls {
	return {
		panUp: "KeyW",
		panDown: "KeyS",
		panLeft: "KeyA",
		panRight: "KeyD",
		pause: "Escape",
		pauseAlt: "KeyP",
		idle: "Space",
		cycle: "Tab",
		group: ["Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9"],
		groupMod: "ctrl",
		selectButton: 0,
		commandButton: 2,
		wheelDir: 1,
		doubleClick: "screen",
		touchDrag: "select",
		pinchDir: 1,
		doubleTap: "all",
		flag: "fight"
	};
}

function loadControls(): Controls {
	const d = defaultControls();
	try {
		if (typeof localStorage === "undefined") return d;
		const raw = localStorage.getItem("stickhold-controls");
		if (!raw) return d;
		const p = JSON.parse(raw);
		const mode = (v, fallback) => v === "screen" || v === "all" || v === "fight" ? v : fallback;
		const group = normalizeGroupKeys(p.group, d.group);
		const selectButton = p.selectButton === 2 ? 2 : 0;
		let commandButton = p.commandButton === 0 ? 0 : 2;
		if (commandButton === selectButton) commandButton = selectButton === 0 ? 2 : 0;
		return {
			panUp: typeof p.panUp === "string" && p.panUp ? p.panUp : d.panUp,
			panDown: typeof p.panDown === "string" && p.panDown ? p.panDown : d.panDown,
			panLeft: typeof p.panLeft === "string" && p.panLeft ? p.panLeft : d.panLeft,
			panRight: typeof p.panRight === "string" && p.panRight ? p.panRight : d.panRight,
			pause: typeof p.pause === "string" && p.pause ? p.pause : d.pause,
			pauseAlt: typeof p.pauseAlt === "string" && p.pauseAlt ? p.pauseAlt : d.pauseAlt,
			idle: typeof p.idle === "string" && p.idle ? p.idle : d.idle,
			cycle: typeof p.cycle === "string" && p.cycle ? p.cycle : d.cycle,
			group,
			groupMod: p.groupMod === "alt" || p.groupMod === "shift" ? p.groupMod : "ctrl",
			selectButton,
			commandButton,
			wheelDir: p.wheelDir === -1 ? -1 : 1,
			doubleClick: mode(p.doubleClick, "screen"),
			touchDrag: p.touchDrag === "pan" ? "pan" : "select",
			pinchDir: p.pinchDir === -1 ? -1 : 1,
			doubleTap: mode(p.doubleTap, "all"),
			flag: p.flag === "idle" ? "idle" : "fight"
		};
	} catch {
		return d;
	}
}

function emptyGroups() {
	return [[], [], [], [], [], [], [], [], [], []];
}
function packMask(bytes) {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	let out = "";
	for (let i = 0; i < bytes.length; i += 3) {
		const a = bytes[i];
		const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
		const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
		const n = (a << 16) | (b << 8) | c;
		out += chars[(n >> 18) & 63];
		out += chars[(n >> 12) & 63];
		out += i + 1 < bytes.length ? chars[(n >> 6) & 63] : "=";
		out += i + 2 < bytes.length ? chars[n & 63] : "=";
	}
	return out;
}
function unpackMask(text, cells) {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	const out = new Uint8Array(cells);
	if (typeof text !== "string" || !text) return out;
	let n = 0;
	let val = 0;
	let at = 0;
	for (let i = 0; i < text.length && at < cells; i++) {
		const c = text.charCodeAt(i);
		if (c === 61) break;
		const v = chars.indexOf(text[i]);
		if (v < 0) continue;
		val = (val << 6) | v;
		n += 6;
		if (n >= 8) {
			n -= 8;
			out[at++] = (val >> n) & 255;
		}
	}
	return out;
}
const TERRAIN_CODE = { grass: "g", dirt: "d", sand: "s", water: "w", rock: "r", snow: "n", marsh: "m", grave: "v" };
const CODE_TERRAIN = { g: "grass", d: "dirt", s: "sand", w: "water", r: "rock", n: "snow", m: "marsh", v: "grave" };

function keyNumber(code) {
	if (typeof code !== "string") return -1;
	if (/^Digit[0-9]$/.test(code)) return Number(code.slice(5));
	if (/^Numpad[0-9]$/.test(code)) return Number(code.slice(6));
	return -1;
}

function normalizeGroupKeys(saved, fallback) {
	if (Array.isArray(saved) && saved.length === 10 && saved.every((s) => typeof s === "string" && s)) return saved;
	const next = fallback.slice();
	if (Array.isArray(saved) && saved.length === 4 && saved.every((s) => typeof s === "string" && s)) {
		for (let i = 0; i < 4; i++) next[i + 1] = saved[i];
	}
	return next;
}

function groupNumber(code, keys) {
	const at = keys.indexOf(code);
	if (at >= 0) return at;
	const n = keyNumber(code);
	if (n < 0) return -1;
	return keyNumber(keys[n]) === n ? n : -1;
}

export class Realm {
	seed;
	tiles: any[] = [];
	nodes: Node[] = [];
	units: Unit[] = [];
	buildings: Building[] = [];
	shots: any[] = [];
	floaters: any[] = [];
	stock = {
		0: {
			food: 0,
			wood: 0,
			gold: 0,
			stone: 0
		},
		1: {
			food: 0,
			wood: 0,
			gold: 0,
			stone: 0
		}
	};
	age = [0, 0];
	tech = [
		{ structure: 0, weaponry: 0, siege: 0, fortitude: 0, efficiency: 0, economy: 0, ward: 0 },
		{ structure: 0, weaponry: 0, siege: 0, fortitude: 0, efficiency: 0, economy: 0, ward: 0 }
	];
	phase = "menu";
	time = 0;
	fx = 67.5;
	fy = 67.5;
	zoom = 1;
	shake = 0;
	speed = 1;
	placing: BldKind | null = null;
	hover: any = null;
	mouse: { x: number; y: number } | null = null;
	hintFromTouch = false;
	hintT = 0;
	armDemolish = 0;
	marks: { x: number; y: number; life: number }[] = [];
	shiftSelect = false;
	selectedUnits: number[] = [];
	selectedBuilding: number | null = null;
	groups: number[][] = emptyGroups();
	fightAt = 0;
	controls: Controls = loadControls();
	capture = "";
	tapAt = 0;
	tapId = -1;
	toast = "";
	toastT = 0;
	dare = null;
	kills = 0;
	streak = 0;
	streakT = 0;
	fury = 0;
	monsterT = 48;
	nestT = 55;
	bossT = 70;
	cartT = 22;
	heroFallen = [null, null];
	drops = [];
	patrons = [];
	need = "";
	needT = 0;
	alertT = 0;
	aiT = .4;
	aiAttack = false;
	heardBuild = false;
	playerTeam = 0;
	faction = "stick";
	mood = "normal";
	rpg = false;
	difficulty = 1;
	militiaLeft = 0;
	militiaCd = 0;
	provoked = false;
	rich = 1;
	mapRich = 1;
	mapSpan = 108;
	baseStock: { food: number; wood: number; gold: number; stone: number }[] | null = null;
	nextId = 1;
	keys = new Set();
	raf = 0;
	acc = 0;
	last = 0;
	snapT = 0;
	listeners = new Set();
	canvas = null;
	ctx = null;
	pointer = null;
	holdTimer = 0;
	pointers = new Map();
	pinching = false;
	pinchDist = 1;
	pinchZoom = 1;
	explored = new Uint8Array(MAP_W * MAP_H);
	visible = new Uint8Array(MAP_W * MAP_H);
	box: any = null;
	ac = null;
	score = new Score();
	previewAt = 0;
	drawFn = null;
	edge = {
		x: 0,
		y: 0
	};
	removed = false;
	constructor(seed = 7) {
		this.seed = seed;
		this.generate(seed);
		const prefs = loadPrefs();
		this.speed = prefs.speed;
		this.score.setSfx(prefs.sfx);
		this.score.setMusic(prefs.music);
	}
	subscribe(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	}
	emit() {
		for (const fn of this.listeners) fn();
	}
	mount(canvas, draw) {
		this.canvas = canvas;
		this.drawFn = draw;
		this.ctx = canvas.getContext("2d");
		this.resize();
		const ro = new ResizeObserver(() => this.resize());
		ro.observe(canvas);
		const down = (e) => this.onDown(e);
		const move = (e) => this.onMove(e);
		const up = (e) => this.onUp(e);
		const keydown = (e) => this.onKey(e, true);
		const keyup = (e) => this.onKey(e, false);
		const wheel = (e) => {
			if (this.phase !== "play" || !this.canvas) return;
			const rect = this.canvas.getBoundingClientRect();
			if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
			e.preventDefault();
			let delta = e.deltaY;
			if (e.deltaMode === 1) delta *= 16;
			else if (e.deltaMode === 2) delta *= rect.height;
			if (!delta) return;
			const out = this.controls.wheelDir > 0 ? delta > 0 : delta < 0;
			const steps = Math.min(2.4, Math.abs(delta) / 80);
			const factor = Math.pow(out ? .86 : 1.16, Math.max(.4, steps));
			const beforeZoom = this.zoom;
			const next = Math.min(2.15, Math.max(.28, beforeZoom * factor));
			if (next === beforeZoom) return;
			const sx = e.clientX - rect.left;
			const sy = e.clientY - rect.top;
			const before = this.screenToWorld(sx, sy);
			this.zoom = next;
			const after = this.screenToWorld(sx, sy);
			this.fx = Math.min(MAP_W - 1, Math.max(0, this.fx + before.x - after.x));
			this.fy = Math.min(MAP_H - 1, Math.max(0, this.fy + before.y - after.y));
		};
		const context = (e) => e.preventDefault();
		const blur = () => this.keys.clear();
		canvas.addEventListener("pointerdown", down);
		canvas.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		window.addEventListener("pointermove", move);
		window.addEventListener("keydown", keydown);
		window.addEventListener("keyup", keyup);
		window.addEventListener("wheel", wheel, { passive: false });
		canvas.addEventListener("contextmenu", context);
		window.addEventListener("blur", blur);
		this.last = performance.now();
		const loop = (now) => {
			if (this.removed) return;
			const dt = Math.min(.05, (now - this.last) / 1e3);
			this.last = now;
			const scale = this.phase === "play" ? this.speed : this.phase === "menu" ? 1 : 0;
			if (scale > 0) {
				this.acc += dt * scale;
				if (this.acc > .35) this.acc = .35;
				let guard = 0;
				const limit = this.phase === "play" ? Math.min(8, Math.ceil(this.speed * 3)) : 2;
				while (this.acc >= 1 / 30 && guard++ < limit) {
					this.step(1 / 30);
					this.acc -= 1 / 30;
				}
			}
			this.score.tick();
			this.paint();
			this.raf = requestAnimationFrame(loop);
		};
		this.raf = requestAnimationFrame(loop);
		this.emit();
		const hook = window;
		hook.__stickhold = this;
		return () => {
			this.removed = true;
			this.score.stop();
			cancelAnimationFrame(this.raf);
			clearTimeout(this.holdTimer);
			ro.disconnect();
			canvas.removeEventListener("pointerdown", down);
			canvas.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
			window.removeEventListener("pointermove", move);
			window.removeEventListener("keydown", keydown);
			window.removeEventListener("keyup", keyup);
			window.removeEventListener("wheel", wheel);
			canvas.removeEventListener("contextmenu", context);
			window.removeEventListener("blur", blur);
		};
	}
	resize() {
		const canvas = this.canvas;
		const ctx = this.ctx;
		if (!canvas || !ctx) return;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		canvas.width = Math.max(1, Math.floor(w * dpr));
		canvas.height = Math.max(1, Math.floor(h * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	viewSize() {
		const c = this.canvas;
		return {
			w: c?.clientWidth ?? 800,
			h: c?.clientHeight ?? 600
		};
	}
	worldToScreen(x, y) {
		const { w, h } = this.viewSize();
		const c = iso(this.fx, this.fy);
		const o = iso(x, y);
		const sh = this.shake > 0 ? Math.sin(this.time * 48) * 5 * this.shake : 0;
		return {
			sx: (o.sx - c.sx) * this.zoom + w / 2 + sh,
			sy: (o.sy - c.sy) * this.zoom + h / 2
		};
	}
	onScreen(x, y) {
		if (!this.canvas) return false;
		const p = this.worldToScreen(x, y);
		const { w, h } = this.viewSize();
		const m = 36;
		return p.sx >= -m && p.sy >= -m && p.sx <= w + m && p.sy <= h + m;
	}
	screenToWorld(sx, sy) {
		const { w, h } = this.viewSize();
		const c = iso(this.fx, this.fy);
		const wx = (sx - w / 2) / this.zoom + c.sx;
		const wy = (sy - h / 2) / this.zoom + c.sy;
		return fromIso(wx, wy);
	}
	panScreen(dsx, dsy) {
		const dfxmy = dsx / this.zoom / (TW / 2);
		const dfp = dsy / this.zoom / (TH / 2);
		this.fx = Math.min(MAP_W - 1, Math.max(0, this.fx + (dfxmy + dfp) / 2));
		this.fy = Math.min(MAP_H - 1, Math.max(0, this.fy + (dfp - dfxmy) / 2));
	}
	clock() {
		const t = this.time % 180;
		if (t < 75) return { name: "Day", light: 1, sun: 1 };
		if (t < 100) {
			const k = (t - 75) / 25;
			return { name: "Dusk", light: 1 - k * 0.85, sun: 1 - k * 2 };
		}
		if (t < 150) return { name: "Night", light: 0.15, sun: -1 };
		const k = (t - 150) / 30;
		return { name: "Dawn", light: 0.15 + k * 0.85, sun: -1 + k * 2 };
	}
	sun() {
		if (this.phase === "menu") return 1;
		return this.clock().sun;
	}
	daylight() {
		if (this.phase === "menu") return 1;
		return this.clock().light;
	}
	watch() {
		if (this.phase === "menu") return "Day";
		return this.clock().name;
	}
	weather() {
		if (this.phase === "menu") return { name: "Clear", slow: 1, see: 1, rain: 0, fog: 0, storm: 0, snow: 0 };
		const t = this.time % 300;
		if (t < 90) return { name: "Clear", slow: 1, see: 1, rain: 0, fog: 0, storm: 0, snow: 0 };
		if (t < 140) return { name: "Rain", slow: 0.92, see: 0.92, rain: 1, fog: 0, storm: 0, snow: 0 };
		if (t < 180) return { name: "Fog", slow: 1, see: 0.72, rain: 0, fog: 1, storm: 0, snow: 0 };
		if (t < 220) return { name: "Storm", slow: 0.88, see: 0.82, rain: 1, fog: 0.2, storm: 1, snow: 0 };
		return { name: "Snow", slow: 0.9, see: 0.86, rain: 0, fog: 0, storm: 0, snow: 1 };
	}
	focusTile(x, y) {
		this.fx = x;
		this.fy = y;
	}
	foeTeam() {
		return this.playerTeam === 0 ? 1 : 0;
	}
	isDynasty(team) {
		return this.faction === "dynasty" && team === this.playerTeam;
	}
	isCoven(team) {
		return this.faction === "coven" && team === this.playerTeam;
	}
	isEgypt(team) {
		return this.faction === "egypt" && team === this.playerTeam;
	}
	sideKey(team) {
		if (this.isDynasty(team)) return "dynasty";
		if (this.isCoven(team)) return "coven";
		if (this.isEgypt(team)) return "egypt";
		if (team === 0) return "blue";
		if (team === 1) return "red";
		return "";
	}
	unitName(team, kind) {
		const book = SIDE_NAMES[this.sideKey(team)];
		return book?.[kind] || UNITS[kind]?.name || kind;
	}
	tilt(team, kind) {
		const side = this.sideKey(team);
		if (kind === "ram" || kind === "catapult" || kind === "ballista") {
			if (side === "red") return kind === "ram" ? { hp: 1.18, dmg: 1.14, speed: 0.88, range: 0.92 } : kind === "catapult" ? { hp: 1.1, dmg: 1.16, speed: 0.9, range: 0.86 } : { hp: 1.08, dmg: 1.12, speed: 0.94, range: 0.9 };
			if (side === "dynasty") return kind === "ram" ? { hp: 0.9, dmg: 0.94, speed: 1.16, range: 1 } : kind === "catapult" ? { hp: 0.88, dmg: 0.9, speed: 1.04, range: 1.18 } : { hp: 0.86, dmg: 0.88, speed: 1.1, range: 1.14 };
			if (side === "coven") return kind === "ram" ? { hp: 0.84, dmg: 1.06, speed: 1.04, range: 1 } : kind === "catapult" ? { hp: 0.8, dmg: 1.08, speed: 1, range: 1.12 } : { hp: 0.78, dmg: 1.14, speed: 1.02, range: 1.16 };
			if (side === "egypt") return kind === "ram" ? { hp: 1.12, dmg: 1.04, speed: 0.92, range: 1 } : kind === "catapult" ? { hp: 1.04, dmg: 1.02, speed: 0.94, range: 1.1 } : { hp: 1, dmg: 1, speed: 0.96, range: 1.08 };
			return { hp: 1, dmg: 1, speed: 1.02, range: 1.04 };
		}
		const hero = kind === "hero";
		if (side === "red") return hero ? { hp: 1.12, dmg: 1.12, speed: 0.92, range: 0.88 } : { hp: 1.06, dmg: 1.08, speed: 0.96, range: 0.94 };
		if (side === "dynasty") return hero ? { hp: 0.92, dmg: 1.05, speed: 1.04, range: 1.3 } : { hp: 0.97, dmg: 1.02, speed: 1.03, range: 1.06 };
		if (side === "coven") return hero ? { hp: 0.78, dmg: 1.2, speed: 1.02, range: 1.35 } : kind === "god" ? { hp: 0.9, dmg: 1.15, speed: 1, range: 1.2 } : { hp: 0.86, dmg: 1.05, speed: 1, range: 1.1 };
		if (side === "egypt") {
			const chariot = kind === "cavalry" || kind === "knight";
			const bow = kind === "archer" || kind === "crossbow";
			return { hp: hero ? 1.08 : 1.06, dmg: hero ? 1.06 : chariot ? 1.04 : 1, speed: chariot ? 1.12 : 0.96, range: bow ? 1.12 : hero ? 1.05 : 1 };
		}
		if (side === "blue") return hero ? { hp: 1, dmg: 1, speed: 1.04, range: 1 } : { hp: 1, dmg: 0.98, speed: 1.04, range: 1.05 };
		return { hp: 1, dmg: 1, speed: 1, range: 1 };
	}
	deityRole(team) {
		const side = this.sideKey(team);
		if (side === "blue") return "heal";
		if (side === "dynasty") return "bless";
		if (side === "egypt") return "bless";
		if (side === "coven") return "omen";
		return "curse";
	}
	godBusy(team) {
		if (this.units.some((u) => u.team === team && u.kind === "god" && u.hp > 0)) return true;
		return this.buildings.some((b) => b.team === team && b.hp > 0 && b.queue?.includes("god"));
	}
	focusPlayer() {
		const hall = this.buildings.find((b) => b.team === this.playerTeam && b.kind === "townhall" && b.hp > 0);
		if (!hall) return;
		this.fx = hall.x + 1.5;
		this.fy = hall.y + 1.5;
	}
	seen(x, y) {
		if (this.phase === "menu") return true;
		const tx = Math.floor(x);
		const ty = Math.floor(y);
		if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return false;
		return this.explored[ty * MAP_W + tx] === 1;
	}
	footSeen(b) {
		if (this.phase === "menu") return true;
		const d = BLDS[b.kind];
		for (let y = b.y; y < b.y + d.h; y++) {
			for (let x = b.x; x < b.x + d.w; x++) if (this.seen(x, y)) return true;
		}
		return false;
	}
	inSight(x, y) {
		if (this.phase === "menu") return true;
		const tx = Math.floor(x);
		const ty = Math.floor(y);
		if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return false;
		return this.visible[ty * MAP_W + tx] === 1;
	}
	reveal() {
		if (this.phase === "menu") return;
		this.visible.fill(0);
		const stamp = (x, y, r) => {
			const r2 = r * r;
			const x0 = Math.max(0, Math.floor(x - r));
			const y0 = Math.max(0, Math.floor(y - r));
			const x1 = Math.min(MAP_W - 1, Math.ceil(x + r));
			const y1 = Math.min(MAP_H - 1, Math.ceil(y + r));
			for (let ty = y0; ty <= y1; ty++) {
				for (let tx = x0; tx <= x1; tx++) {
					const dx = tx + 0.5 - x;
					const dy = ty + 0.5 - y;
					if (dx * dx + dy * dy > r2) continue;
					const i = ty * MAP_W + tx;
					this.visible[i] = 1;
					this.explored[i] = 1;
				}
			}
		};
		const sight = this.mapScale() * (0.68 + 0.32 * this.daylight()) * this.weather().see;
		for (const u of this.units) {
			if (u.team !== this.playerTeam || u.hp <= 0) continue;
			stamp(u.x, u.y, (u.kind === "archer" ? 7 : 5) * sight);
		}
		for (const b of this.buildings) {
			if (b.team !== this.playerTeam || b.hp <= 0) continue;
			const d = BLDS[b.kind];
			const r = b.kind === "townhall" || b.kind === "tower" ? this.bSight(b) : (b.kind === "wall" ? 2 : 4) * sight;
			stamp(b.x + d.w / 2, b.y + d.h / 2, r);
		}
	}
	beginPinch() {
		const pts = [...this.pointers.values()];
		if (pts.length < 2) return;
		this.pinching = true;
		this.pinchDist = Math.max(12, Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y));
		this.pinchZoom = this.zoom;
		this.clearHold();
		this.pointer = null;
		this.box = null;
	}
	applyPinch() {
		const pts = [...this.pointers.values()];
		if (pts.length < 2) return;
		const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
		const mid = {
			x: (pts[0].x + pts[1].x) / 2,
			y: (pts[0].y + pts[1].y) / 2
		};
		const before = this.screenToWorld(mid.x, mid.y);
		const ratio = d / this.pinchDist;
		const signed = this.controls.pinchDir < 0 ? 1 / ratio : ratio;
		this.zoom = Math.min(1.65, Math.max(0.62, this.pinchZoom * signed));
		const after = this.screenToWorld(mid.x, mid.y);
		this.fx = Math.min(MAP_W - 1, Math.max(0, this.fx + before.x - after.x));
		this.fy = Math.min(MAP_H - 1, Math.max(0, this.fy + before.y - after.y));
	}
	boxRect() {
		return this.box;
	}
	start() {
		this.applyMapSize();
		if (this.rpg) this.generate(this.seed);
		this.phase = "play";
		this.provoked = false;
		this.toast = this.rpg ? "Your people are caged in the scattered towns. Free them, lead them home, and win the wild. A beaten beast may join you." : this.faction === "egypt" ? "The river people take the field. Chariots are quicker, bows reach farther, and gold comes easier." : this.faction === "coven" ? "The circle takes the field. Every soldier casts. The Archmage leads them." : this.faction === "dynasty" ? "The dynasty takes the field. Longer bows, quicker hands, and the halberd." : "Gather wood and food. A dare is waiting under the resources.";
		this.toastT = 7;
		this.rollDare(true);
		this.kills = 0;
		this.streak = 0;
		this.streakT = 0;
		this.heroFallen = [null, null];
		this.drops = [];
		this.clearedHomes = [];
		this.ensureAudio();
		this.score.start();
		this.applyRich();
		if (!this.rpg) this.applyDifficulty();
		for (const u of this.units) if (u.hp > 0 && (u.level || 1) <= 1 && !(u.gear || []).length) u.hp = this.unitMax(u.kind, u.team);
		if (this.rpg) {
			const hero = this.units.find((u) => u.team === this.playerTeam && u.kind === "hero" && u.hp > 0);
			this.selectedUnits = hero ? [hero.id] : [];
			this.selectedBuilding = null;
		}
		this.blip(520, .06, .05);
		this.focusPlayer();
		this.emit();
	}
	toMenu() {
		this.phase = "menu";
		this.placing = null;
		this.score.stop();
		this.emit();
	}
	restart() {
		const next = new Realm(Math.random() * 99999 | 0);
		next.rpg = this.rpg;
		next.playerTeam = this.playerTeam;
		if (this.rpg) next.generate(next.seed);
		this.seed = next.seed;
		this.tiles = next.tiles;
		this.nodes = next.nodes;
		this.units = next.units;
		this.buildings = next.buildings;
		this.shots = [];
		this.floaters = [];
		this.stock = next.stock;
		this.baseStock = next.baseStock;
		this.age = [0, 0];
		this.time = 0;
		this.fx = 67.5;
		this.fy = 67.5;
		this.zoom = 1;
		this.placing = null;
		this.selectedUnits = [];
		this.selectedBuilding = null;
		this.groups = emptyGroups();
		this.fightAt = 0;
		this.aiAttack = false;
		this.provoked = false;
		this.aiT = 1;
		this.phase = "play";
		this.toast = this.rpg ? "A new tale. Free your people and lead them home." : this.faction === "egypt" ? "The river people take the field. Chariots are quicker, bows reach farther, and gold comes easier." : this.faction === "coven" ? "The circle takes the field. Every soldier casts. The Archmage leads them." : this.faction === "dynasty" ? "The dynasty takes the field. Longer bows, quicker hands, and the halberd." : "A new realm. Take their town hall. The dare pays you along the way.";
		this.toastT = 5;
		this.rollDare(true);
		this.kills = 0;
		this.streak = 0;
		this.streakT = 0;
		this.heroFallen = [null, null];
		this.drops = [];
		this.clearedHomes = [];
		this.explored = new Uint8Array(MAP_W * MAP_H);
		this.visible = new Uint8Array(MAP_W * MAP_H);
		this.applyRich();
		this.applyDifficulty();
		this.ensureAudio();
		this.score.start();
		this.focusPlayer();
		if (this.rpg) {
			const hero = this.units.find((u) => u.team === this.playerTeam && u.kind === "hero" && u.hp > 0);
			if (hero) this.selectedUnits = [hero.id];
		}
		this.emit();
	}
	saveKey(slot = 1) {
		const n = slot === 2 || slot === 3 ? slot : 1;
		return n === 1 ? "stickhold-save" : `stickhold-save-${n}`;
	}
	saveGame(slot = 1) {
		if (this.phase === "menu") return false;
		let terrain = "";
		const tileNodes = [];
		let deco = "";
		for (const t of this.tiles) {
			terrain += TERRAIN_CODE[t.terrain] || "g";
			tileNodes.push(t.node ?? -1);
			deco += String(t.deco | 0);
		}
		const data = {
			v: 2,
			seed: this.seed,
			terrain,
			tileNodes,
			deco,
			nodes: this.nodes,
			units: this.units,
			buildings: this.buildings,
			stock: this.stock,
			baseStock: this.baseStock,
			age: this.age,
			tech: this.tech,
			time: this.time,
			fx: this.fx,
			fy: this.fy,
			zoom: this.zoom,
			speed: this.speed,
			playerTeam: this.playerTeam,
			faction: this.faction,
			mood: this.mood,
			rpg: !!this.rpg,
			difficulty: this.difficulty,
			militiaLeft: this.militiaLeft,
			militiaCd: this.militiaCd,
			provoked: this.provoked,
			rich: this.rich,
			mapRich: this.mapRich,
			mapSpan: this.mapSpan,
			mw: MAP_W,
			mh: MAP_H,
			nextId: this.nextId,
			aiAttack: this.aiAttack,
			aiT: this.aiT,
			groups: this.groups,
			dare: this.dare,
			kills: this.kills,
			streak: this.streak,
			tale: this.tale,
			heroFallen: this.heroFallen,
			drops: this.drops,
			explored: packMask(this.explored),
			visible: packMask(this.visible)
		};
		try {
			localStorage.setItem(this.saveKey(slot), JSON.stringify(data));
			this.say(slot === 1 ? "Saved in slot 1." : `Saved in slot ${slot}.`);
			return true;
		} catch {
			this.say("Could not save.");
			return false;
		}
	}
	loadGame(slot = 1) {
		try {
			let raw = null;
			try {
				raw = localStorage.getItem(this.saveKey(slot));
			} catch {
				raw = null;
			}
			if (!raw) {
				this.say(`No save in slot ${slot === 2 || slot === 3 ? slot : 1}.`);
				return false;
			}
			const data = JSON.parse(raw);
			const tiles = Array.isArray(data?.tiles) ? data.tiles : null;
			const packed = typeof data?.terrain === "string" ? data.terrain : null;
			if ((!tiles && !packed) || !data.units || !data.buildings || !data.nodes) {
				this.say("Could not load.");
				return false;
			}
			this.seed = data.seed;
			if (tiles) this.tiles = tiles;
			else {
				this.tiles = [];
				const nodes = data.tileNodes || [];
				const deco = data.deco || "";
				for (let i = 0; i < packed.length; i++) {
					this.tiles.push({
						terrain: CODE_TERRAIN[packed[i]] || "grass",
						node: nodes[i] ?? -1,
						deco: Number(deco[i] || 0)
					});
				}
			}
			this.nodes = data.nodes;
			this.units = data.units;
			this.buildings = data.buildings;
			for (const u of this.units) {
				u.path = Array.isArray(u.path) ? u.path : [];
				u.pathI = u.pathI | 0;
				u.order = u.order && u.order.type ? u.order : { type: "idle" };
				u.carry = u.carry || 0;
				u.carryKind = u.carryKind ?? null;
				u.toolNode = u.toolNode ?? -1;
				u.attackCd = u.attackCd || 0;
				u.hit = u.hit || 0;
				u.down = u.down || 0;
				u.stealth = !!u.stealth;
				u.ambush = !!u.ambush;
				u.spell = u.spell || 0;
				u.repath = 0;
				u.level = Math.max(1, Math.min(data.rpg && u.kind === "hero" ? 20 : 6, u.level || 1));
				u.xp = u.xp || 0;
				u.cleaveCd = u.cleaveCd || 0;
				u.cryCd = u.cryCd || 0;
				u.waveCd = u.waveCd || 0;
				u.cry = u.cry || 0;
				u.chargeCd = u.chargeCd || 0;
				u.mendCd = u.mendCd || 0;
				u.slow = u.slow || 0;
				u.bless = u.bless || 0;
				u.blessCd = u.blessCd || 0;
				u.gear = Array.isArray(u.gear) ? u.gear.filter((id) => ITEMS[id]).slice(0, u.kind === "hero" ? 6 : 1) : [];
			}
			for (const b of this.buildings) {
				b.queue = Array.isArray(b.queue) ? b.queue : [];
				b.trainT = b.trainT || 0;
				b.ageT = b.ageT || 0;
				b.attackCd = b.attackCd || 0;
				b.hit = b.hit || 0;
				b.rally = b.rally ?? null;
				b.lore = !!b.lore;
				b.detect = !!b.detect;
				b.focus = !!b.focus;
				b.rampart = !!b.rampart;
				b.progress = b.progress ?? 1;
				b.reviveT = b.reviveT || 0;
			}
			this.shots = [];
			this.floaters = [];
			this.stock = data.stock;
			this.baseStock = data.baseStock;
			this.age = data.age;
			this.tech = data.tech ?? [
				{ structure: 0, weaponry: 0, siege: 0, fortitude: 0, efficiency: 0, economy: 0, ward: 0 },
				{ structure: 0, weaponry: 0, siege: 0, fortitude: 0, efficiency: 0, economy: 0, ward: 0 }
			];
			for (const side of [0, 1]) {
				if (!this.tech[side]) continue;
				if (this.tech[side].ward == null) this.tech[side].ward = 0;
				if (this.buildings.some((b) => b.team === side && b.rampart)) this.tech[side].rampart = 1;
				if (this.buildings.some((b) => b.team === side && b.hp > 0 && b.progress >= 1 && (b.kind === "barracks" || b.kind === "range" || b.kind === "stable"))) this.grantWard(side);
			}
			this.time = data.time ?? 0;
			this.fx = data.fx;
			this.fy = data.fy;
			this.zoom = data.zoom ?? 1;
			this.speed = data.speed ?? this.speed;
			this.playerTeam = data.playerTeam ?? 0;
			this.faction = data.faction === "dynasty" || data.faction === "coven" || data.faction === "egypt" ? data.faction : "stick";
			this.mood = data.mood ?? "normal";
			this.rpg = !!data.rpg;
			this.difficulty = data.difficulty ?? 1;
			this.militiaLeft = data.militiaLeft ?? 0;
			this.militiaCd = data.militiaCd ?? 0;
			this.provoked = !!data.provoked;
			this.rich = data.rich ?? 1;
			this.mapRich = data.mapRich ?? 1;
			this.mapSpan = data.mapSpan ?? data.mw ?? MAP_W;
			if (data.mw && data.mh) {
				MAP_W = data.mw;
				MAP_H = data.mh;
			} else if (Array.isArray(this.tiles)) {
				const n = Math.round(Math.sqrt(this.tiles.length));
				if (n * n === this.tiles.length) {
					MAP_W = n;
					MAP_H = n;
				}
			}
			this.nextId = data.nextId ?? 1;
			this.aiAttack = !!data.aiAttack;
			this.aiT = data.aiT ?? 1;
			this.groups = Array.isArray(data.groups) && data.groups.length >= 10 ? data.groups : emptyGroups();
			this.dare = data.dare && data.dare.kind ? data.dare : null;
			if (!this.dare) this.rollDare(true);
			this.kills = data.kills | 0;
			this.streak = data.streak | 0;
			this.streakT = 0;
			this.tale = data.tale && data.tale.need ? data.tale : null;
			this.heroFallen = Array.isArray(data.heroFallen) ? [data.heroFallen[0] || null, data.heroFallen[1] || null] : [null, null];
			this.drops = Array.isArray(data.drops) ? data.drops.filter((d) => d && ITEMS[d.item]) : [];
			this.placing = null;
			this.selectedUnits = [];
			this.selectedBuilding = null;
			this.box = null;
			const cells = MAP_W * MAP_H;
			if (Array.isArray(data.explored)) this.explored = Uint8Array.from(data.explored);
			else this.explored = unpackMask(data.explored, cells);
			if (Array.isArray(data.visible)) this.visible = Uint8Array.from(data.visible);
			else this.visible = unpackMask(data.visible, cells);
			if (this.explored.length !== cells) this.explored = new Uint8Array(cells);
			if (this.visible.length !== cells) this.visible = new Uint8Array(cells);
			for (const u of this.units) if (u.hp > 0) this.unstick(u);
			this.phase = "play";
			this.toast = "Saved realm restored.";
			this.toastT = 4;
			this.ensureAudio();
			this.score.start();
			this.emit();
			return true;
		} catch {
			this.say("Could not load.");
			return false;
		}
	}
	togglePause() {
		if (this.phase === "play") this.phase = "paused";
		else if (this.phase === "paused") this.phase = "play";
		else return;
		this.capture = "";
		this.ensureAudio();
		this.score.start();
		this.emit();
	}
	setSpeed(v) {
		this.speed = Math.min(3, Math.max(.5, Math.round(v * 2) / 2));
		this.saveAudio();
		this.emit();
	}
	setSfx(v) {
		this.score.setSfx(v);
		this.saveAudio();
		this.emit();
	}
	setMusic(v) {
		this.score.setMusic(v);
		this.ensureAudio();
		this.score.start();
		this.saveAudio();
		this.emit();
	}
	saveAudio() {
		savePrefs({
			speed: this.speed,
			sfx: this.score.sfxVol,
			music: this.score.musicVol
		});
	}
	ensureAudio() {
		if (this.ac || typeof window === "undefined") {
			if (this.ac) {
				void this.ac.resume();
				this.score.attach(this.ac);
			}
			return;
		}
		const AC = window.AudioContext;
		if (!AC) return;
		this.ac = new AC();
		void this.ac.resume();
		this.score.attach(this.ac);
	}
	blip(_freq, _dur, _gain, _type = "triangle") {}
	tileAt(x, y) {
		if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return null;
		return this.tiles[y * MAP_W + x];
	}
	buildingOn(tx, ty) {
		for (const b of this.buildings) {
			if (b.hp <= 0) continue;
			const d = BLDS[b.kind];
			if (tx >= b.x && ty >= b.y && tx < b.x + d.w && ty < b.y + d.h) return b;
		}
		return null;
	}
	walkable(tx, ty) {
		return this.canStand(tx + .5, ty + .5);
	}
	canStand(px, py) {
		const tx = Math.floor(px);
		const ty = Math.floor(py);
		const t = this.tileAt(tx, ty);
		if (!t) return false;
		if (t.terrain === "water" || t.terrain === "rock") return false;
		if (t.node >= 0) {
			const n = this.nodes[t.node];
			if (n && n.amount > 0 && (n.kind === "tree" || n.kind === "gold" || n.kind === "stone")) return false;
		}
		return !this.hitsBuilding(px, py);
	}
	hitsBuilding(px, py) {
		for (const b of this.buildings) {
			if (b.hp <= 0) continue;
			const d = BLDS[b.kind];
			if (px >= b.x && py >= b.y && px < b.x + d.w && py < b.y + d.h) return true;
		}
		return false;
	}
	applyMapSize() {
		const span = this.mapSpan || 108;
		if (span === MAP_W && this.tiles.length === span * span) return;
		MAP_W = span;
		MAP_H = span;
		this.explored = new Uint8Array(span * span);
		this.visible = new Uint8Array(span * span);
		this.generate(this.seed);
	}
	scaleN(n) {
		return Math.round(n * MAP_W / 108);
	}
	mapScale() {
		return MAP_W / 108;
	}
	generate(seed) {
		const rnd = mulberry32(seed);
		this.tiles = [];
		this.nodes = [];
		this.units = [];
		this.buildings = [];
		this.shots = [];
		this.floaters = [];
		this.nextId = 1;
		const riverLo = this.scaleN(84);
		const riverHi = this.scaleN(99);
		const mid = this.scaleN(45);
		const gap = Math.max(2, this.scaleN(6));
		for (let y = 0; y < MAP_H; y++) {
			for (let x = 0; x < MAP_W; x++) {
				const s = x + y;
				let terrain = "grass";
				if (s >= riverLo && s <= riverHi && Math.abs(x - mid) > gap) terrain = "water";
				else if (rnd() < .06) terrain = "dirt";
				this.tiles.push({
					terrain,
					node: -1,
					deco: 0
				});
			}
		}
		for (let y = 0; y < MAP_H; y++) {
			for (let x = 0; x < MAP_W; x++) {
				const t = this.tileAt(x, y);
				if (!t || t.terrain === "water") continue;
				const wet = this.tileAt(x + 1, y)?.terrain === "water" || this.tileAt(x - 1, y)?.terrain === "water" || this.tileAt(x, y + 1)?.terrain === "water" || this.tileAt(x, y - 1)?.terrain === "water";
				if (wet) t.terrain = "sand";
			}
		}
		for (let y = 1; y < MAP_H - 1; y++) {
			for (let x = 1; x < MAP_W - 1; x++) {
				const t = this.tileAt(x, y);
				if (!t || t.terrain !== "grass") continue;
				if (Math.abs(x - mid) <= gap && x + y >= this.scaleN(78) && x + y <= this.scaleN(105)) continue;
				if (rnd() < .07) this.addNode("tree", x, y, 120 + Math.floor(rnd() * 80));
			}
		}
		this.minePatch(this.scaleN(87), this.scaleN(78), "gold", 800, rnd);
		this.minePatch(this.scaleN(6), this.scaleN(36), "gold", 800, rnd);
		this.minePatch(this.scaleN(51), this.scaleN(78), "stone", 550, rnd);
		this.minePatch(this.scaleN(36), this.scaleN(9), "stone", 550, rnd);
		this.addNode("sheep", this.scaleN(60), this.scaleN(78), 100);
		this.addNode("sheep", this.scaleN(78), this.scaleN(81), 100);
		this.addNode("sheep", this.scaleN(57), this.scaleN(69), 90);
		this.addNode("sheep", this.scaleN(30), this.scaleN(12), 100);
		this.addNode("sheep", this.scaleN(33), this.scaleN(21), 90);
		this.placeLion(this.scaleN(48), this.scaleN(36), 130);
		this.placeLion(this.scaleN(54), this.scaleN(22), 130);
		this.placeLion(this.scaleN(36), this.scaleN(50), 120);
		this.placeLion(this.scaleN(72), this.scaleN(34), 130);
		this.placeLion(this.scaleN(28), this.scaleN(58), 120);
		this.seedMonsters(rnd);
		this.placeNest(rnd);
		if (this.mapScale() >= 1.5) this.placeNest(rnd);
		if (!this.rpg) this.placeBoss(rnd);
		const ax = this.scaleN(66);
		const ay = this.scaleN(66);
		const bx = this.scaleN(18);
		const by = this.scaleN(18);
		this.clearPad(ax, ay);
		this.clearPad(bx, by);
		this.laySnow();
		this.layMarsh();
		this.placeCrypts();
		this.homeMine(ax, ay, "gold", 320);
		this.homeMine(ax, ay, "stone", 220);
		this.homeMine(bx, by, "gold", 320);
		this.homeMine(bx, by, "stone", 220);
		this.berryNear(ax, ay, rnd);
		this.berryNear(bx, by, rnd);
		this.openFord();
		this.stockFish();
		if (this.rpg) this.seedRpg(rnd);
		this.stock[0] = {
			food: 200,
			wood: 200,
			gold: 80,
			stone: 50
		};
		this.stock[1] = {
			food: 200,
			wood: 220,
			gold: 80,
			stone: 50
		};
		const home = this.playerTeam === 1 ? { x: bx, y: by } : { x: ax, y: ay };
		const away = this.playerTeam === 1 ? { x: ax, y: ay } : { x: bx, y: by };
		this.addBuilding("townhall", this.playerTeam, home.x, home.y, true);
		if (this.rpg) {
			this.stock[this.playerTeam].gold += 120;
			const altar = this.findSpot("altar", home.x, home.y);
			if (altar) this.addBuilding("altar", this.playerTeam, altar.x, altar.y, true);
			const shop = this.findSpot("shop", home.x, home.y);
			if (shop) this.addBuilding("shop", this.playerTeam, shop.x, shop.y, true);
			this.spawnNear(this.playerTeam, "hero", home.x + 2.2, home.y + 4.2);
			this.tale = { need: 0, freed: 0, home: 0, joined: 0 };
			this.placeVillages(rnd);
			this.placeCages(rnd);
		} else {
			this.addBuilding("townhall", this.foeTeam(), away.x, away.y, true);
			this.spawnNear(0, "villager", ax + 10.2, ay + 4.2);
			this.spawnNear(0, "villager", ax + 6.6, ay + 9.6);
			this.spawnNear(0, "villager", ax + 13.2, ay + 6.6);
			this.spawnNear(1, "villager", bx + 4.8, by + 3.6);
			this.spawnNear(1, "villager", bx - 1.8, by + 7.2);
			this.spawnNear(1, "villager", bx + 6.6, by - 1.2);
		}
		this.dropStumps();
		this.baseStock = [{ ...this.stock[0] }, { ...this.stock[1] }];
		for (const n of this.nodes) n.base = n.amount;
		this.applyRich();
	}
	applyRich() {
		const m = this.rich;
		const mm = this.mapRich;
		const scale = (s: { food: number; wood: number; gold: number; stone: number }) => ({
			food: Math.round(s.food * m),
			wood: Math.round(s.wood * m),
			gold: Math.round(s.gold * m),
			stone: Math.round(s.stone * m)
		});
		if (this.baseStock) {
			this.stock[0] = scale(this.baseStock[0]);
			this.stock[1] = scale(this.baseStock[1]);
		}
		for (const n of this.nodes) {
			if (n.base == null) continue;
			const amt = Math.max(0, Math.round(n.base * mm));
			n.amount = amt;
			n.max = amt;
		}
	}
	applyDifficulty() {
		const foe = this.foeTeam();
		const bonus = this.difficulty >= 3 ? 1000 : this.difficulty === 2 ? 200 : 0;
		const bag = this.stock[foe];
		if (bag && bonus) {
			bag.food += bonus;
			bag.wood += bonus;
			bag.gold += bonus;
			bag.stone += bonus;
		}
		if (this.difficulty >= 3) this.age[foe] = Math.max(1, this.age[foe] || 0);
		this.militiaLeft = 0;
		this.militiaCd = 0;
	}
	homeMine(cx, cy, kind, amount) {
		const tries = [
			[4, 0],
			[0, 4],
			[5, 1],
			[1, 5],
			[4, -2],
			[-2, 4]
		];
		for (const [dx, dy] of tries) {
			if (this.mine(cx + dx, cy + dy, kind, amount)) return;
		}
	}
	berryNear(cx, cy, rnd) {
		const patches = 4;
		for (let p = 0; p < patches; p++) {
			const ang = rnd() * Math.PI * 2;
			const rad = (7 + rnd() * 5) * this.mapScale();
			const x = Math.round(cx + Math.cos(ang) * rad);
			const y = Math.round(cy + Math.sin(ang) * rad);
			const count = 1 + Math.floor(rnd() * 5);
			let placed = 0;
			for (let i = 0; i < 48 && placed < count; i++) {
				const dx = Math.floor(rnd() * 5) - 2;
				const dy = Math.floor(rnd() * 5) - 2;
				if (this.addNode("berry", x + dx, y + dy, 140 + Math.floor(rnd() * 50)) >= 0) placed++;
			}
		}
	}
	minePatch(cx, cy, kind, amount, rnd) {
		const count = 4 + Math.floor(rnd() * 5);
		let placed = 0;
		for (let r = 0; r <= 12 && placed < count; r += 2) {
			for (let dy = -r; dy <= r && placed < count; dy += 2) {
				for (let dx = -r; dx <= r && placed < count; dx += 2) {
					if (r !== 0 && Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
					if (this.mine(cx + dx, cy + dy, kind, amount)) placed++;
				}
			}
		}
	}
	dropStumps() {
		const drop = new Set();
		for (const n of this.nodes) if (n.kind === "tree" && n.amount <= 0) drop.add(n.id);
		if (!drop.size) return;
		for (const t of this.tiles) if (drop.has(t.node)) t.node = -1;
		this.nodes = this.nodes.filter((n) => !drop.has(n.id));
		const remap = new Map();
		this.nodes.forEach((n, i) => {
			remap.set(n.id, i);
			n.id = i;
		});
		for (const t of this.tiles) if (t.node >= 0) t.node = remap.get(t.node) ?? -1;
	}
	stockFish() {
		const shores = [];
		for (let y = 1; y < MAP_H - 1; y++) {
			for (let x = 1; x < MAP_W - 1; x++) {
				const t = this.tileAt(x, y);
				if (!t || t.terrain !== "water" || t.node >= 0) continue;
				if (!this.walkable(x, y + 1) && !this.walkable(x + 1, y)) continue;
				shores.push({
					x,
					y,
					side: x >= this.scaleN(45) ? 1 : 0
				});
			}
		}
		for (const side of [0, 1]) {
			const spots = shores.filter((s) => s.side === side);
			const want = Math.max(2, Math.round(4 * this.mapScale()));
			const step = Math.max(1, Math.floor(spots.length / want));
			let placed = 0;
			for (let i = 0; i < spots.length && placed < want; i += step) {
				if (this.addNode("fish", spots[i].x, spots[i].y, 120) >= 0) placed++;
			}
		}
	}
	plantNear(x, y, kind, amount) {
		for (let r = 1; r <= 4; r++) {
			for (let dy = -r; dy <= r; dy++) {
				for (let dx = -r; dx <= r; dx++) {
					if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
					const t = this.tileAt(x + dx, y + dy);
					if (!t || t.terrain !== "grass" || t.node >= 0) continue;
					if (this.addNode(kind, x + dx, y + dy, amount) >= 0) return;
				}
			}
		}
	}
	openFord() {
		for (let y = 0; y < MAP_H; y++) {
			for (let x = this.scaleN(39); x <= this.scaleN(51); x++) {
				const s = x + y;
				if (s < this.scaleN(78) || s > this.scaleN(105)) continue;
				const t = this.tileAt(x, y);
				if (!t) continue;
				if (t.terrain === "water") t.terrain = "dirt";
				t.deco = 0;
				if (t.node >= 0) {
					this.nodes[t.node].amount = 0;
					this.nodes[t.node].alive = false;
					t.node = -1;
				}
				if (t.terrain !== "dirt" && t.terrain !== "sand") t.terrain = "dirt";
			}
		}
	}
	laySnow() {
		const fields = [
			{ x: this.scaleN(82), y: this.scaleN(18), r: this.scaleN(15) },
			{ x: this.scaleN(14), y: this.scaleN(80), r: this.scaleN(13) }
		];
		for (const f of fields) {
			for (let y = f.y - f.r - 2; y <= f.y + f.r + 2; y++) {
				for (let x = f.x - f.r - 2; x <= f.x + f.r + 2; x++) {
					const t = this.tileAt(x, y);
					if (!t || t.terrain === "water" || t.terrain === "sand" || t.terrain === "rock") continue;
					const d = Math.hypot(x - f.x, y - f.y);
					if (d > f.r + 2) continue;
					if (d > f.r && ((x * 13 + y * 7) % 5) > 1) continue;
					t.terrain = "snow";
				}
			}
		}
	}
	layMarsh() {
		for (let y = 1; y < MAP_H - 1; y++) {
			for (let x = 1; x < MAP_W - 1; x++) {
				const t = this.tileAt(x, y);
				if (!t || t.terrain !== "grass") continue;
				let wet = false;
				for (let dy = -3; dy <= 3 && !wet; dy++) {
					for (let dx = -3; dx <= 3; dx++) {
						if (Math.hypot(dx, dy) > 3.1) continue;
						if (this.tileAt(x + dx, y + dy)?.terrain === "water") wet = true;
					}
				}
				if (wet && ((x * 3 + y) % 4) !== 0) t.terrain = "marsh";
			}
		}
	}
	placeCrypts() {
		const spots = [
			[this.scaleN(54), this.scaleN(24)],
			[this.scaleN(86), this.scaleN(42)],
			[this.scaleN(26), this.scaleN(70)]
		];
		for (const [cx, cy] of spots) {
			let placed = false;
			for (let r = 0; r <= 8 && !placed; r++) {
				for (let dy = -r; dy <= r && !placed; dy++) {
					for (let dx = -r; dx <= r && !placed; dx++) {
						if (r && Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
						const x = cx + dx;
						const y = cy + dy;
						if (!this.canPlace("crypt", x, y)) continue;
						this.paintGrave(x, y, 4);
						const id = this.addBuilding("crypt", 3, x, y, true);
						const b = this.building(id);
						if (b) b.spawnT = 4 + (x % 5);
						placed = true;
					}
				}
			}
		}
	}
	paintGrave(cx, cy, r) {
		for (let y = cy - r; y <= cy + r; y++) {
			for (let x = cx - r; x <= cx + r; x++) {
				const t = this.tileAt(x, y);
				if (!t || t.terrain === "water" || t.terrain === "rock" || t.terrain === "sand") continue;
				if (Math.hypot(x - cx, y - cy) > r + 0.2) continue;
				t.terrain = "grave";
			}
		}
	}
	crypts(dt) {
		for (const b of this.buildings) {
			if (b.kind !== "crypt" || b.hp <= 0 || b.progress < 1) continue;
			b.spawnT = (b.spawnT ?? 4) - dt;
			const brood = this.units.filter((u) => u.hp > 0 && u.crypt === b.id);
			if (b.spawnT <= 0) {
				b.spawnT = 16;
				if (brood.length < 5) {
					const kind = b.pulse ? "zombie" : "skeleton";
					b.pulse = b.pulse ? 0 : 1;
					const born = this.spawnNear(3, kind, b.x + .5, b.y + 1.6);
					if (born) {
						born.crypt = b.id;
						born.village = true;
						brood.push(born);
						const near = this.units.some((u) => u.team === this.playerTeam && u.hp > 0 && dist(u.x, u.y, b.x, b.y) < 14);
						if (near && this.toastT <= 0) this.say(kind === "zombie" ? "A zombie climbs from the tower." : "A skeleton climbs from the tower.");
					}
				}
			}
			for (const u of brood) {
				if (u.order.type !== "idle") continue;
				const foe = this.bestFoe(u, 12);
				if (foe) this.setOrder(u, { type: "attack", id: foe.id, building: false, auto: true });
				else if (dist(u.x, u.y, b.x + .5, b.y + 1.4) > 5) this.setOrder(u, { type: "move", x: b.x + .5, y: b.y + 1.8, attackMove: true });
			}
		}
	}
	clearPad(ax, ay) {
		for (let y = ay - 1; y <= ay + 3; y++) {
			for (let x = ax - 1; x <= ax + 3; x++) {
				const t = this.tileAt(x, y);
				if (!t || t.terrain === "water") continue;
				t.terrain = "grass";
				t.deco = 0;
				if (t.node >= 0) {
					this.nodes[t.node].amount = 0;
					this.nodes[t.node].alive = false;
					t.node = -1;
				}
			}
		}
	}
	mine(x, y, kind, amount) {
		const spots = [
			[0, 0],
			[1, 0],
			[0, 1],
			[1, 1]
		];
		for (const [dx, dy] of spots) {
			const t = this.tileAt(x + dx, y + dy);
			if (!t || t.terrain === "water" || t.terrain === "rock") return false;
		}
		for (const [dx, dy] of spots) {
			const t = this.tileAt(x + dx, y + dy);
			if (t.node >= 0) {
				this.nodes[t.node].amount = 0;
				this.nodes[t.node].alive = false;
			}
			t.terrain = "rock";
			t.deco = kind === "gold" ? 1 : 2;
			t.node = -1;
		}
		const id = this.addNode(kind, x, y, amount);
		if (id < 0) return false;
		for (const [dx, dy] of spots) this.tileAt(x + dx, y + dy).node = id;
		return true;
	}
	addNode(kind, x, y, amount) {
		const t = this.tileAt(x, y);
		if (!t || t.node >= 0) return -1;
		if (t.terrain === "water") {
			if (kind !== "fish") return -1;
		} else if (kind === "fish") return -1;
		if ((kind === "tree" || kind === "berry" || kind === "sheep" || kind === "nest" || kind === "cart" || beastOf(kind)) && t.terrain === "rock") return -1;
		const animal = kind === "sheep" || !!beastOf(kind);
		const nest = kind === "nest";
		const cart = kind === "cart";
		const id = this.nodes.length;
		this.nodes.push({
			id,
			kind,
			x,
			y,
			amount,
			max: amount,
			buildingId: -1,
			hp: cart ? 28 : nest ? 90 : beastOf(kind)?.hp ?? (animal ? 15 : 0),
			alive: animal || nest || cart,
			bite: nest ? 12 + Math.random() * 8 : 0,
			rare: false
		});
		if (MONSTERS[kind] && Math.random() < .16) {
			const node = this.nodes[id];
			node.rare = true;
			node.hp = Math.round(node.hp * 1.55);
		}
		t.node = id;
		return id;
	}
	addBuilding(kind, team, x, y, done) {
		const id = this.nextId++;
		const def = BLDS[kind];
		const max = def.hp * this.bldHpMul(team);
		const b = {
			id,
			kind,
			team,
			x,
			y,
			hp: done ? max : Math.max(40, Math.ceil(max * .35)),
			progress: done ? 1 : .04,
			queue: [],
			trainT: 0,
			ageT: 0,
			attackCd: .4,
			hit: 0,
			rally: null,
			lore: false,
			detect: false,
			reviveT: 0
		};
		this.buildings.push(b);
		return id;
	}
	spawnNear(team, kind, x, y) {
		let sx = x;
		let sy = y;
		if (!this.walkable(Math.floor(sx), Math.floor(sy))) {
			let found = false;
			for (let r = 1; r <= 4 && !found; r++) {
				for (let dy = -r; dy <= r && !found; dy++) {
					for (let dx = -r; dx <= r && !found; dx++) {
						if (this.walkable(Math.floor(x) + dx, Math.floor(y) + dy)) {
							sx = Math.floor(x) + dx + .5;
							sy = Math.floor(y) + dy + .5;
							found = true;
						}
					}
				}
			}
		}
		const u = {
			id: this.nextId++,
			kind,
			team,
			x: sx,
			y: sy,
			hp: UNITS[kind].hp * this.unitHpMul(team) * this.tilt(team, kind).hp,
			right: team === 0,
			anim: Math.random() * 4,
			order: { type: "idle" },
			path: [],
			pathI: 0,
			repath: 0,
			carry: 0,
			carryKind: null,
			toolNode: -1,
			attackCd: .2,
			hit: 0,
			down: 0,
			stealth: false,
			ambush: false,
			spell: 0,
			held: 0,
			holdT: 0,
			safe: 0,
			job: null,
			stashHp: 0,
			vanished: false,
			vanishCd: 0,
			level: 1,
			xp: 0,
			cleaveCd: 0,
			cryCd: 0,
			waveCd: 0,
			cry: 0,
			chargeCd: 0,
			mendCd: 0,
			bless: 0,
			blessCd: 0,
			gear: []
		};
		this.units.push(u);
		return u;
	}
	canPlace(kind, x, y) {
		const d = BLDS[kind];
		if (x < 0 || y < 0 || x + d.w > MAP_W || y + d.h > MAP_H) return false;
		for (let dy = 0; dy < d.h; dy++) {
			for (let dx = 0; dx < d.w; dx++) {
				const t = this.tileAt(x + dx, y + dy);
				if (!t || t.terrain === "water" || t.terrain === "rock" || t.terrain === "sand" || t.terrain === "marsh") return false;
				if (this.buildingOn(x + dx, y + dy)) return false;
				if (t.node >= 0 && this.nodes[t.node]?.amount > 0) return false;
				if (t.node >= 0 && this.nodes[t.node]?.kind === "tree") return false;
			}
		}
		if (kind !== "wall") {
			for (let dy = -1; dy <= d.h; dy++) {
				for (let dx = -1; dx <= d.w; dx++) {
					if (dx >= 0 && dy >= 0 && dx < d.w && dy < d.h) continue;
					const t = this.tileAt(x + dx, y + dy);
					if (!t || t.node < 0) continue;
					const n = this.nodes[t.node];
					if (n && n.kind === "tree" && n.amount > 0) return false;
				}
			}
		}
		return true;
	}
	say(text) {
		this.toast = text;
		this.toastT = 3.2;
		this.emit();
	}
	rollDare(quiet) {
		const pool = [
			{ kind: "tree", need: 4, label: "Fell 4 trees", pay: { wood: 80, gold: 15 } },
			{ kind: "hunt", need: 2, label: "Hunt 2 creatures", pay: { food: 90, gold: 25 } },
			{ kind: "kill", need: 3, label: "Defeat 3 enemies", pay: { gold: 80 } },
			{ kind: "nest", need: 1, label: "Destroy a monster nest", pay: { gold: 90, food: 40 } },
			{ kind: "build", need: 1, label: "Finish a building", pay: { food: 50, wood: 40 } }
		];
		if (this.rpg) {
			pool.push({ kind: "myth", need: 1, label: "Slay a mythic beast", pay: { gold: 70, food: 40 } });
			pool.push({ kind: "boss", need: 1, label: "Slay a boss", pay: { gold: 120 } });
		}
		const next = pool.filter((d) => d.kind !== this.dare?.kind);
		const pick = next[Math.floor(Math.random() * next.length)] || pool[0];
		this.dare = { kind: pick.kind, need: pick.need, have: 0, label: pick.label, pay: pick.pay };
		if (!quiet) this.say(`Next dare: ${pick.label}.`);
	}
	noteDare(kind) {
		if (this.phase !== "play" || !this.dare || this.dare.kind !== kind) return;
		this.dare.have += 1;
		if (this.dare.have < this.dare.need) return;
		const pay = this.dare.pay;
		const bits = [];
		for (const key of ["food", "wood", "gold", "stone"]) {
			if (!pay[key]) continue;
			this.stock[this.playerTeam][key] += pay[key];
			bits.push(`+${pay[key]} ${key}`);
		}
		const done = this.dare.label;
		this.rollDare(true);
		this.say(`${done}. ${bits.join(", ")}. Next: ${this.dare.label}.`);
		this.blip(660, .1, .05);
		this.blip(880, .14, .04);
		this.shake = Math.min(1, this.shake + .3);
		this.fury = Math.max(this.fury, 8);
	}
	bountyFor(u) {
		const gold = u.kind === "hero" ? 70 : u.kind === "villager" ? 8 : u.kind === "scout" ? 14 : 22;
		this.stock[this.playerTeam].gold += gold;
		this.floaters.push({
			x: u.x,
			y: u.y,
			text: `+${gold} gold`,
			life: 1.1,
			max: 1.1,
			gold: true
		});
		this.kills += 1;
		this.streak += 1;
		this.streakT = 12;
		if (u.village && u.home) this.villageCleared(u.home);
		const finishing = this.dare?.kind === "kill" && this.dare.have + 1 >= this.dare.need;
		this.noteDare("kill");
		this.shake = Math.min(1, this.shake + .18);
		this.blip(180 + Math.min(8, this.streak) * 40, .07, .05, "square");
		if (this.streak === 3 || this.streak === 5 || this.streak === 8) {
			const bonus = this.streak === 8 ? 100 : this.streak === 5 ? 60 : 30;
			this.stock[this.playerTeam].gold += bonus;
			this.fury = Math.max(this.fury, this.streak === 3 ? 8 : 14);
			this.floaters.push({ x: u.x, y: u.y - .4, text: `${this.streak} in a row +${bonus}`, life: 1.3, max: 1.3, gold: true });
			if (!finishing) this.say(`${this.streak} in a row. Fury. +${bonus} gold.`);
			if (this.streak === 8) this.dropItem(u.x, u.y, "crown");
		}
	}
	villageCleared(home) {
		const left = this.units.some((o) => o.village && o.hp > 0 && o.home && dist(o.home.x, o.home.y, home.x, home.y) < 1.2);
		if (left) return;
		this.clearedHomes = this.clearedHomes || [];
		if (this.clearedHomes.some((h) => dist(h.x, h.y, home.x, home.y) < 1.2)) return;
		this.clearedHomes.push({ x: home.x, y: home.y });
		this.stock[this.playerTeam].gold += 90;
		this.fury = Math.max(this.fury, 12);
		this.floaters.push({ x: home.x, y: home.y, text: "Village +90", life: 1.3, max: 1.3, gold: true });
		this.say("Enemy village broken. +90 gold.");
	}
	welcomeVillages() {
		if (!this.rpg || this.phase !== "play") return;
		const hero = this.units.find((u) => u.team === this.playerTeam && u.kind === "hero" && u.hp > 0);
		if (!hero) return;
		for (const b of this.buildings) {
			if (b.team !== 2 || b.hp <= 0 || b.gifted) continue;
			if (dist(hero.x, hero.y, b.x + 1, b.y + 1) > 3.2) continue;
			for (const o of this.buildings) if (o.team === 2 && dist(o.x, o.y, b.x, b.y) < 6) o.gifted = true;
			this.stock[this.playerTeam].gold += 45;
			this.dropItem(hero.x, hero.y + .3, ["boots", "gloves", "cloak", "shield"][Math.random() * 4 | 0]);
			this.floaters.push({ x: hero.x, y: hero.y, text: "+45 gold", life: 1.2, max: 1.2, gold: true });
			this.say("The village shares a gift. +45 gold.");
			return;
		}
	}
	payHunt(node, u) {
		if (!u || u.team !== this.playerTeam) return;
		const gold = (node.kind === "nest" ? 50 : node.kind === "chief" ? 140 : node.kind === "gore" ? 100 : node.kind === "alpha" ? 80 : node.kind === "brood" ? 70 : node.kind === "cyclops" ? 70 : node.kind === "minotaur" ? 55 : node.kind === "gorgon" ? 36 : node.kind === "harpy" ? 28 : node.kind === "troll" ? 32 : node.kind === "boar" || node.kind === "lion" ? 16 : node.kind === "wolf" ? 10 : node.kind === "spider" ? 6 : node.kind === "sheep" ? 4 : 0) + (node.rare ? 20 : 0);
		if (!gold) return;
		this.stock[this.playerTeam].gold += gold;
		this.floaters.push({
			x: node.x + .5,
			y: node.y,
			text: `+${gold} gold`,
			life: 1.1,
			max: 1.1,
			gold: true
		});
		if (BOSSES[node.kind]) {
			this.fury = Math.max(this.fury, 14);
			const finishing = this.dare?.kind === "boss" && this.dare.have + 1 >= this.dare.need;
			this.noteDare("boss");
			if (!finishing) this.say(`${BOSSES[node.kind].name} is slain.`);
			return;
		}
		if (node.kind === "harpy" || node.kind === "minotaur" || node.kind === "cyclops" || node.kind === "gorgon") {
			this.fury = Math.max(this.fury, 8);
			const finishing = this.dare?.kind === "myth" && this.dare.have + 1 >= this.dare.need;
			this.noteDare("myth");
			if (!finishing) this.say(`${MONSTERS[node.kind].name} falls. Fury.`);
		}
		if (node.kind !== "nest") return;
		const finishing = this.dare?.kind === "nest" && this.dare.have + 1 >= this.dare.need;
		this.noteDare("nest");
		this.fury = Math.max(this.fury, 12);
		for (const ally of this.units) {
			if (ally.team !== this.playerTeam || ally.hp <= 0) continue;
			if (dist(ally.x, ally.y, node.x + .5, node.y + .5) > 4.5) continue;
			const max = this.unitMax(ally.kind, ally.team, ally.level, this.gearOf(ally).hp);
			ally.hp = Math.min(max, ally.hp + 20);
		}
		if (!finishing) this.say("Nest destroyed. Your fighters are fired up.");
	}
	showNeed(text) {
		this.need = text;
		this.needT = 8;
		this.emit();
	}
	unit(id) {
		return this.units.find((u) => u.id === id && u.hp > 0);
	}
	building(id) {
		return this.buildings.find((b) => b.id === id && b.hp > 0);
	}
	idleWork(u) {
		if (u.hold) return false;
		if (u.carry > .4 && u.carryKind) {
			this.setOrder(u, { type: "drop", resume: -1 });
			return true;
		}
		let best = null;
		let bestD = 1e9;
		for (const b of this.buildings) {
			if (b.team !== u.team || b.hp <= 0) continue;
			const open = b.progress < 1;
			const hurt = b.hp < this.bldMax(b.kind, b.team) - .5;
			if (!open && !hurt) continue;
			const def = BLDS[b.kind];
			const d = dist(u.x, u.y, b.x + def.w / 2, b.y + def.h / 2);
			if (d < bestD) {
				bestD = d;
				best = b;
			}
		}
		if (best) {
			this.setOrder(u, { type: best.progress < 1 ? "build" : "repair", buildingId: best.id });
			return true;
		}
		let node = null;
		let nodeD = 1e9;
		for (const n of this.nodes) {
			if (n.amount <= 0 || n.ally) continue;
			if (n.kind !== "tree" && n.kind !== "gold" && n.kind !== "stone" && n.kind !== "berry" && n.kind !== "fish" && n.kind !== "farm" && n.kind !== "sheep") continue;
			const d = dist(u.x, u.y, n.x + .5, n.y + .5);
			if (d < nodeD) {
				nodeD = d;
				node = n;
			}
		}
		if (!node) return false;
		this.setOrder(u, { type: "gather", nodeId: node.id });
		return true;
	}
	setOrder(u, order) {
		if (this.ordering) {
			u.hold = false;
			if (this.shiftSelect && u.order && u.order.type !== "idle") {
				if (!u.next) u.next = [];
				if (u.next.length < 8) u.next.push(order);
				return;
			}
			u.next = [];
		}
		if (u.kind === "scout" && (order.type === "gather" || order.type === "build" || order.type === "repair" || order.type === "drop")) {
			order = { type: "idle" };
		}
		if (u.kind === "spear" && (order.type === "gather" || order.type === "drop")) {
			order = { type: "idle" };
		}
		if (order.type === "idle" && !u.hold && u.next?.length) return this.setOrder(u, u.next.shift());
		if (u.kind === "scout" && u.stealth && order.type === "attack") u.ambush = true;
		if (order.type === "build" && order.resume == null) {
			const prev = u.order;
			let resume = -1;
			if (prev?.type === "gather") resume = prev.nodeId;
			else if (prev?.type === "drop") resume = prev.resume;
			else if (prev?.type === "build") resume = prev.resume ?? -1;
			order = { type: "build", buildingId: order.buildingId, resume };
		}
		u.order = order;
		if (order.type !== "shop") u.want = null;
		if (order.type !== "gather" || order.nodeId !== u.toolNode) u.toolNode = -1;
		u.path = [];
		u.pathI = 0;
		u.repath = 0;
	}
	command(id, times = 1) {
		if (this.phase !== "play" && this.phase !== "paused") return;
		this.ensureAudio();
		if (id === "idle") {
			this.selectIdle();
			return;
		}
		if (id === "army") {
			this.selectArmy();
			return;
		}
		if (id === "stop") {
			this.stopSelection();
			return;
		}
		if (id === "hide") {
			this.hideScouts();
			return;
		}
		if (id === "age") {
			this.beginAge();
			return;
		}
		if (id === "lore") {
			this.upgradeSchool();
			return;
		}
		if (id === "detect") {
			this.upgradeDetect();
			return;
		}
		if (id === "focus") {
			this.upgradeFocus();
			return;
		}
		if (id === "rampart") {
			this.upgradeRampart();
			return;
		}
		if (id === "vanish") {
			this.vanishScouts();
			return;
		}
		if (id === "structure" || id === "weaponry" || id === "siege" || id === "fortitude" || id === "efficiency" || id === "economy") {
			this.raiseTech(id);
			return;
		}
		if (id === "ward") {
			this.raiseWard();
			return;
		}
		if (id === "demolish") {
			this.demolishSelected();
			return;
		}
		if (id === "cancel") {
			this.cancelSelected();
			return;
		}
		if (id === "unqueue") {
			this.unqueueOne();
			return;
		}
		if (id === "bell") {
			this.ringBell();
			return;
		}
		if (id === "cleave" || id === "cry" || id === "wave" || id === "charge" || id === "mend") {
			this.castSelected(id);
			return;
		}
		if (id === "revive") {
			this.reviveHero();
			return;
		}
		if (typeof id === "string" && id.startsWith("gear:")) {
			this.dropGear(Number(id.slice(5)));
			return;
		}
		if (typeof id === "string" && id.startsWith("buy:")) {
			this.buyGear(id.slice(4));
			return;
		}
		if (id === "villager" || id === "club" || id === "warrior" || id === "sword" || id === "cavalry" || id === "knight" || id === "archer" || id === "crossbow" || id === "scout" || id === "mage" || id === "frost" || id === "priest" || id === "warlock" || id === "tamer" || id === "halberd" || id === "guard" || id === "hero" || id === "demigod" || id === "avatar" || id === "god" || id === "ram" || id === "catapult" || id === "ballista") {
			const n = times > 1 ? 5 : 1;
			for (let i = 0; i < n; i++) if (!this.queueUnit(id)) break;
			return;
		}
		const kind = id;
		if (!BLDS[kind]) return;
		if (this.age[this.playerTeam] < BLDS[kind].age) {
			this.say(BLDS[kind].age >= 4 ? "Age 5 required." : BLDS[kind].age >= 3 ? "Age 4 required." : BLDS[kind].age >= 2 ? "Age 3 required." : "Village Age required.");
			this.emit();
			return;
		}
		this.placing = this.placing === kind ? null : kind;
		this.blip(640, .05, .04);
		this.emit();
	}
	selectIdle() {
		const all = this.units.filter((u) => u.team === this.playerTeam && u.kind === "villager" && u.hp > 0 && !u.held);
		const idle = all.filter((u) => u.order.type === "idle" && u.carry <= .4);
		const pick = idle.length ? idle : all;
		if (!pick.length) {
			this.say("No villagers.");
			return;
		}
		this.selectedUnits = pick.map((u) => u.id);
		this.selectedBuilding = null;
		const x = pick.reduce((s, u) => s + u.x, 0) / pick.length;
		const y = pick.reduce((s, u) => s + u.y, 0) / pick.length;
		this.focusTile(x, y);
		this.say(idle.length ? `${idle.length} idle.` : `${pick.length} villagers.`);
		this.blip(680, .04, .035);
		this.emit();
	}
	selectArmy() {
		const pick = this.units.filter((u) => u.team === this.playerTeam && u.hp > 0 && !u.held && !u.captive && u.kind !== "villager");
		if (!pick.length) {
			this.say("No soldiers.");
			return;
		}
		this.selectedUnits = pick.map((u) => u.id);
		this.selectedBuilding = null;
		this.focusTile(pick.reduce((s, u) => s + u.x, 0) / pick.length, pick.reduce((s, u) => s + u.y, 0) / pick.length);
		this.say(pick.length === 1 ? "1 soldier." : `${pick.length} soldiers.`);
		this.blip(680, .04, .035);
		this.emit();
	}
	focusSelection() {
		const units = this.selectedUnits.map((id) => this.unit(id)).filter((u) => !!u);
		if (units.length) {
			this.focusTile(units.reduce((s, u) => s + u.x, 0) / units.length, units.reduce((s, u) => s + u.y, 0) / units.length);
			return;
		}
		const b = this.selectedBuilding != null ? this.building(this.selectedBuilding) : null;
		if (b) this.focusTile(b.x + BLDS[b.kind].w / 2, b.y + BLDS[b.kind].h / 2);
	}
	ping(x, y) {
		this.marks.push({ x, y, life: .55 });
		if (this.marks.length > 6) this.marks.shift();
	}
	stopSelection() {
		this.placing = null;
		for (const id of this.selectedUnits) {
			const u = this.unit(id);
			if (!u || u.team !== this.playerTeam) continue;
			u.hold = true;
			u.next = [];
			if (u.carry > .4 && u.carryKind) this.setOrder(u, {
				type: "drop",
				resume: -1
			});
			else this.setOrder(u, { type: "idle" });
		}
		this.blip(180, .07, .06, "square");
		this.emit();
	}
	hideScouts() {
		const scouts = this.selectedUnits.map((id) => this.unit(id)).filter((u) => u && u.kind === "scout" && u.team === this.playerTeam);
		if (!scouts.length) return;
		const hiding = scouts.every((u) => u.stealth);
		for (const u of scouts) {
			if (hiding) {
				u.stealth = false;
				u.ambush = false;
				u.vanished = false;
			} else {
				u.stealth = true;
				u.ambush = false;
				u.vanished = false;
				this.setOrder(u, { type: "idle" });
			}
		}
		this.say(hiding ? "Scouts are visible." : "Scouts are hidden. They move slowly.");
		this.blip(hiding ? 520 : 220, .06, .04);
		this.emit();
	}
	vanishScouts() {
		const scouts = this.selectedUnits.map((id) => this.unit(id)).filter((u) => u && u.kind === "scout" && u.team === this.playerTeam);
		const ready = scouts.filter((u) => (u.vanishCd || 0) <= 0);
		if (!ready.length) {
			const wait = Math.max(0, ...scouts.map((u) => u.vanishCd || 0));
			this.say(wait > 0 ? `Vanish is ready in ${Math.ceil(wait)}s.` : "Select a scout.");
			return;
		}
		for (const u of ready) {
			u.stealth = true;
			u.vanished = true;
			u.ambush = false;
			u.vanishCd = 180;
			this.setOrder(u, { type: "idle" });
			for (const o of this.units) {
				if (o.order?.type === "attack" && !o.order.building && o.order.id === u.id) this.setOrder(o, { type: "idle" });
			}
			this.shots = this.shots.filter((s) => s.hitBuilding || s.hitId !== u.id);
		}
		this.say("The scout vanishes.");
		this.blip(196, .12, .04);
		this.emit();
	}
	heroBusy(team) {
		if (this.heroFallen[team]) return true;
		if (this.units.some((u) => u.team === team && u.kind === "hero" && (u.hp > 0 || u.down > 0))) return true;
		return this.buildings.some((b) => b.team === team && b.hp > 0 && (b.queue.includes("hero") || (b.reviveT || 0) > 0));
	}
	selectedHero() {
		return this.selectedUnits.map((id) => this.unit(id)).find((u) => u && u.kind === "hero" && u.team === this.playerTeam && u.hp > 0) || null;
	}
	castSelected(which) {
		const u = this.selectedHero();
		if (!u) {
			this.say("Select your hero.");
			return;
		}
		const lv = this.levelOf(u);
		if (which === "cry" && lv < 2) {
			this.say("War Cry unlocks at level 2.");
			return;
		}
		if (which === "mend" && lv < 3) {
			this.say("Mend unlocks at level 3.");
			return;
		}
		if (which === "wave" && lv < 4) {
			this.say("Shockwave unlocks at level 4.");
			return;
		}
		const cd = which === "cleave" ? u.cleaveCd || 0 : which === "cry" ? u.cryCd || 0 : which === "wave" ? u.waveCd || 0 : which === "charge" ? u.chargeCd || 0 : u.mendCd || 0;
		if (cd > 0) {
			this.say(`Ready in ${Math.ceil(cd)}s.`);
			return;
		}
		if (which === "cleave") this.castCleave(u);
		else if (which === "cry") this.castCry(u);
		else if (which === "wave") this.castWave(u);
		else if (which === "charge") this.castCharge(u);
		else this.castMend(u);
		this.emit();
	}
	castCharge(u) {
		u.chargeCd = 12;
		const dx = u.right ? 1 : -1;
		let x = u.x;
		const y = u.y;
		for (let i = 1; i <= 8; i++) {
			const nx = u.x + dx * i * .4;
			if (!this.canStand(nx, y)) break;
			x = nx;
		}
		u.x = x;
		u.y = y;
		u.path = [];
		const raw = this.weapon(u) * 1.15;
		let hits = 0;
		for (const o of this.units) {
			if (o.hp <= 0 || o.held || o.team === u.team) continue;
			if (dist(o.x, o.y, u.x, u.y) > 1.35) continue;
			o.slow = 2.4;
			this.strike(u, o.id, false, raw);
			hits++;
		}
		this.floaters.push({ x: u.x, y: u.y, text: "Charge", life: .8, max: .8, gold: true });
		if (u.team === this.playerTeam) this.say(hits ? "Charge." : "Charge found no one.");
		this.blip(220, .08, .05);
	}
	castMend(u) {
		u.mendCd = 18;
		const amt = 24 + 8 * (this.levelOf(u) - 1);
		let n = 0;
		for (const o of this.units) {
			if (o.hp <= 0 || o.held || o.team !== u.team) continue;
			if (dist(o.x, o.y, u.x, u.y) > 3.3) continue;
			const max = this.unitMax(o.kind, o.team, o.level, this.gearOf(o).hp);
			if (o.hp >= max) continue;
			o.hp = Math.min(max, o.hp + amt);
			this.floaters.push({ x: o.x, y: o.y, text: `+${amt}`, life: .8, max: .8, gold: true });
			n++;
		}
		if (u.team === this.playerTeam) this.say(n ? "Mend." : "No one nearby needed healing.");
		this.blip(520, .1, .04);
	}
	castCleave(u) {
		u.cleaveCd = 8;
		const raw = (UNITS.hero.dmg * this.levelDmg(u) + this.gearOf(u).dmg) * .9;
		let hits = 0;
		for (const o of this.units) {
			if (o.hp <= 0 || o.held || o.team === u.team) continue;
			if (dist(o.x, o.y, u.x, u.y) > 1.75) continue;
			this.strike(u, o.id, false, raw);
			hits++;
		}
		this.floaters.push({ x: u.x, y: u.y, text: "Cleave", life: .8, max: .8, gold: true });
		this.shake = Math.min(1, this.shake + .2);
		if (u.team === this.playerTeam) this.say(hits ? "Cleave." : "Cleave hit nothing.");
		this.blip(140, .08, .05, "square");
	}
	castCry(u) {
		u.cry = 7;
		u.cryCd = 16;
		this.floaters.push({ x: u.x, y: u.y, text: "War Cry", life: 1, max: 1, gold: true });
		if (u.team === this.playerTeam) this.say("War Cry. Nearby allies hit harder.");
		this.blip(392, .1, .05);
	}
	castWave(u) {
		u.waveCd = 22;
		const raw = 18 + 8 * (this.levelOf(u) - 1) + this.gearOf(u).dmg;
		const dx = u.right ? 1 : -1;
		const hit = new Set();
		for (let i = 1; i <= 4; i++) {
			const x = u.x + dx * i * .95;
			const y = u.y;
			this.floaters.push({ x, y, text: "·", life: .45, max: .45, gold: true });
			for (const o of this.units) {
				if (hit.has(o.id) || o.hp <= 0 || o.held || o.team === u.team) continue;
				if (dist(o.x, o.y, x, y) > .85) continue;
				hit.add(o.id);
				this.strike(u, o.id, false, raw);
			}
			for (const b of this.buildings) {
				if (hit.has("b" + b.id) || b.hp <= 0 || b.team === u.team) continue;
				const d = BLDS[b.kind];
				if (distRect(x, y, b.x, b.y, d.w, d.h) > .4) continue;
				hit.add("b" + b.id);
				this.strike(u, b.id, true, raw);
			}
		}
		if (u.team === this.playerTeam) this.say("Shockwave.");
		this.blip(98, .12, .05, "sawtooth");
	}
	strike(u, id, building, raw) {
		let hit = raw;
		if (!building && u.kind === "hero" && this.levelOf(u) >= 5) {
			const prey = this.unit(id);
			if (prey) {
				const max = this.unitMax(prey.kind, prey.team, prey.level, this.gearOf(prey).hp);
				if (prey.hp <= max * .35) hit *= 1.7;
			}
		}
		const prey = building ? this.building(id) : this.unit(id);
		const was = prey?.hp ?? 0;
		this.hurt(id, building, hit, u.team, false, u.kind);
		if (prey) this.grantXp(u, was > 0 && prey.hp <= 0 ? 10 : 2);
	}
	reviveHero() {
		const b = this.selectedBuilding != null ? this.building(this.selectedBuilding) : null;
		if (!b || b.kind !== "altar" || b.team !== this.playerTeam || b.progress < 1) return;
		this.beginRevive(b);
		this.emit();
	}
	beginRevive(b) {
		const fall = this.heroFallen[b.team];
		if (!fall) return;
		if ((b.reviveT || 0) > 0) return;
		const cost = { gold: 40 + 20 * fall.level };
		if (!this.spend(b.team, cost)) {
			if (b.team === this.playerTeam) this.say(`Need ${cost.gold} gold to revive.`);
			return;
		}
		b.reviveT = 12;
		if (b.team === this.playerTeam) this.say("The hero is reviving.");
		this.blip(330, .08, .04);
	}
	autoHero(u) {
		if (u.team === this.playerTeam || u.kind !== "hero") return;
		const foe = this.nearestFoe(u.x, u.y, u.team, 3.6);
		if (!foe) {
			if ((u.mendCd || 0) <= 0 && this.levelOf(u) >= 3 && u.hp < this.unitMax(u.kind, u.team, u.level, this.gearOf(u).hp) * .55) this.castMend(u);
			return;
		}
		const d = dist(u.x, u.y, foe.x, foe.y);
		if ((u.mendCd || 0) <= 0 && this.levelOf(u) >= 3 && u.hp < this.unitMax(u.kind, u.team, u.level, this.gearOf(u).hp) * .5) this.castMend(u);
		else if ((u.chargeCd || 0) <= 0 && d > 1.5 && d <= 3.5) this.castCharge(u);
		else if ((u.waveCd || 0) <= 0 && this.levelOf(u) >= 4) this.castWave(u);
		else if ((u.cleaveCd || 0) <= 0 && d <= 1.7) this.castCleave(u);
		else if ((u.cryCd || 0) <= 0 && this.levelOf(u) >= 2) this.castCry(u);
	}
	fellHero(u) {
		this.heroFallen[u.team] = { level: this.levelOf(u), xp: u.xp || 0 };
		if (u.team === this.playerTeam) this.say("Your hero has fallen. Revive them at the altar.");
	}
	markDown(u) {
		if (!u || u.hp > 0) return;
		u.hp = 0;
		if (!(u.down > 0)) u.down = .55;
		if (u.kind === "hero" && !this.heroFallen[u.team]) this.fellHero(u);
	}
	gearSlots(u) {
		return u?.kind === "hero" ? 6 : 1;
	}
	gearOf(u) {
		let dmg = 0;
		let hp = 0;
		let speed = 1;
		let work = 1;
		for (const id of u?.gear || []) {
			const it = ITEMS[id];
			if (!it) continue;
			dmg += it.dmg || 0;
			hp += it.hp || 0;
			if (it.speed) speed *= it.speed;
			if (it.work) work *= it.work;
		}
		return { dmg, hp, speed, work };
	}
	weapon(u) {
		let dmg = UNITS[u.kind].dmg * this.levelDmg(u) * this.tilt(u.team, u.kind).dmg + this.gearOf(u).dmg;
		if ((u.bless || 0) > 0) dmg *= 1.18;
		if ((u.dread || 0) > 0) dmg *= .78;
		return dmg;
	}
	matchup(atk, def) {
		const pike = atk === "club" || atk === "spear" || atk === "halberd";
		const foot = atk === "warrior" || atk === "sword" || atk === "guard" || atk === "villager";
		const horse = atk === "cavalry" || atk === "knight";
		const bow = atk === "archer" || atk === "crossbow";
		const caster = atk === "mage" || atk === "frost" || atk === "priest" || atk === "warlock" || atk === "demigod" || atk === "avatar" || atk === "god";
		const vsHorse = def === "cavalry" || def === "knight";
		const vsFoot = def === "warrior" || def === "sword" || def === "guard" || def === "villager";
		const vsPike = def === "club" || def === "spear" || def === "halberd";
		const vsSoft = def === "archer" || def === "crossbow" || def === "mage" || def === "frost" || def === "priest" || def === "warlock" || def === "demigod" || def === "avatar" || def === "god";
		if (pike && vsHorse) return 1.75;
		if (horse && vsPike) return 0.65;
		if (bow && (vsFoot || vsPike)) return 1.45;
		if (horse && vsSoft) return 1.6;
		if ((bow || caster) && vsHorse) return 0.72;
		if (foot && vsPike) return 1.3;
		if (pike && vsFoot) return 0.82;
		if (caster && (vsFoot || vsPike)) return 1.35;
		return 1;
	}
	beastMight(n) {
		let m = 1;
		if (n.kind === "gore" || this.nodes.some((o) => o.alive && o.kind === "gore" && dist(o.x, o.y, n.x, n.y) < 3.4)) m *= 1.28;
		if (n.rare || this.nodes.some((o) => o.alive && o.rare && dist(o.x + .5, o.y + .5, n.x + .5, n.y + .5) < 2.6)) m *= 1.2;
		return m;
	}
	auras(dt) {
		for (const u of this.units) {
			u.banner = 0;
			u.dread = 0;
		}
		for (const h of this.units) {
			if (h.kind !== "hero" || h.hp <= 0) continue;
			for (const u of this.units) {
				if (u.hp <= 0 || u.team !== h.team) continue;
				if (dist(u.x, u.y, h.x, h.y) <= 3.6) u.banner = 1;
			}
		}
		for (const n of this.nodes) {
			if (!n.alive) continue;
			const x = n.x + .5;
			const y = n.y + .5;
			if (n.kind === "alpha") {
				for (const u of this.units) {
					if (u.hp <= 0 || u.held) continue;
					if (dist(u.x, u.y, x, y) <= 3.2) u.slow = Math.max(u.slow || 0, .4);
				}
			} else if (n.kind === "brood") {
				n.aura = (n.aura || 0) + dt;
				if (n.aura >= .7) {
					n.aura = 0;
					for (const u of this.units) {
						if (u.hp <= 0 || u.held) continue;
						if (dist(u.x, u.y, x, y) > 2.8) continue;
						u.hp -= 4;
						u.hit = .12;
						this.floaters.push({ x: u.x, y: u.y, text: "4", life: .45, max: .45, dmg: true });
						if (u.hp <= 0) this.markDown(u);
					}
				}
			} else if (n.kind === "chief") {
				for (const u of this.units) {
					if (u.hp <= 0 || u.held) continue;
					if (dist(u.x, u.y, x, y) <= 3.6) u.dread = 1;
				}
			} else if (n.rare && MONSTERS[n.kind]) {
				n.hp = Math.min(Math.round(MONSTERS[n.kind].hp * 1.55), n.hp + 3 * dt);
			}
		}
	}
	giveGear(u, item) {
		if (!ITEMS[item]) return false;
		u.gear = u.gear || [];
		if (u.gear.length >= this.gearSlots(u)) return false;
		u.gear.push(item);
		const bonus = ITEMS[item].hp || 0;
		if (bonus) u.hp = Math.min(this.unitMax(u.kind, u.team, u.level, this.gearOf(u).hp), u.hp + bonus);
		return true;
	}
	dropItem(x, y, item) {
		this.drops.push({ id: this.nextId++, x, y, item });
	}
	lootOf(kind) {
		const list = LOOT[kind];
		if (!list) return null;
		return list[Math.random() * list.length | 0];
	}
	spillLoot(kind, x, y, killer) {
		const item = this.lootOf(kind);
		if (!item) return;
		if (killer && killer.hp > 0 && this.giveGear(killer, item)) {
			if (killer.team === this.playerTeam) this.say(`${this.unitName(killer.team, killer.kind)} took ${ITEMS[item].name}.`);
			this.floaters.push({ x: killer.x, y: killer.y, text: ITEMS[item].name, life: 1.1, max: 1.1, gold: true });
			return;
		}
		this.dropItem(x, y, item);
		if (killer?.team === this.playerTeam) this.say(`${ITEMS[item].name} was left on the ground.`);
	}
	nearestGear(x, y, reach) {
		let best = null;
		let bestD = reach;
		for (const d of this.drops) {
			const distD = dist(x, y, d.x, d.y);
			if (distD < bestD) {
				bestD = distD;
				best = d;
			}
		}
		return best;
	}
	takeDrop(u, drop) {
		if (!drop || !this.drops.some((d) => d.id === drop.id)) return false;
		if (!this.giveGear(u, drop.item)) {
			if (u.team === this.playerTeam) this.say(u.kind === "hero" ? "The hero's six slots are full." : "This unit has no open gear slot.");
			return false;
		}
		this.drops = this.drops.filter((d) => d.id !== drop.id);
		if (u.team === this.playerTeam) this.say(`Picked up ${ITEMS[drop.item].name}.`);
		this.floaters.push({ x: u.x, y: u.y, text: ITEMS[drop.item].name, life: 1, max: 1, gold: true });
		return true;
	}
	isShopper(u) {
		return !!(u && SHOPPER[u.kind] && u.hp > 0);
	}
	shoppers() {
		return (this.patrons || []).map((id) => this.unit(id)).filter((u) => this.isShopper(u) && u.team === this.playerTeam);
	}
	buyGear(item) {
		const price = SHOP_PRICE[item];
		if (!price || !ITEMS[item]) return;
		const shop = this.selectedBuilding != null ? this.building(this.selectedBuilding) : null;
		if (!shop || shop.kind !== "shop" || shop.team !== this.playerTeam || shop.progress < 1) {
			this.say("Select your shop.");
			return;
		}
		const buyers = this.shoppers();
		if (!buyers.length) {
			this.say("Select warriors or the hero, then tap the shop.");
			return;
		}
		const buyer = buyers.find((u) => (u.gear || []).length < this.gearSlots(u));
		if (!buyer) {
			this.say("No open gear slot.");
			return;
		}
		if (!this.canAfford(this.playerTeam, { gold: price })) {
			this.say(`Need ${price} gold.`);
			return;
		}
		const def = BLDS.shop;
		if (distRect(buyer.x, buyer.y, shop.x, shop.y, def.w, def.h) > .9) {
			this.setOrder(buyer, { type: "shop", buildingId: shop.id });
			buyer.want = item;
			this.say(`${this.unitName(buyer.team, buyer.kind)} is heading to the shop.`);
			this.emit();
			return;
		}
		this.finishBuy(buyer, item);
		this.emit();
	}
	finishBuy(u, item) {
		const price = SHOP_PRICE[item];
		if (!price) return;
		if ((u.gear || []).length >= this.gearSlots(u)) {
			u.want = null;
			if (u.team === this.playerTeam) this.say("No open gear slot.");
			return;
		}
		if (!this.spend(u.team, { gold: price })) {
			u.want = null;
			if (u.team === this.playerTeam) this.say(`Need ${price} gold.`);
			return;
		}
		this.giveGear(u, item);
		u.want = null;
		if (u.team === this.playerTeam) this.say(`${this.unitName(u.team, u.kind)} bought ${ITEMS[item].name}.`);
		this.floaters.push({ x: u.x, y: u.y, text: ITEMS[item].name, life: 1, max: 1, gold: true });
		this.blip(640, .06, .04);
	}
	dropGear(index) {
		const u = this.selectedUnits.map((id) => this.unit(id)).find((n) => n && n.team === this.playerTeam && n.hp > 0 && n.gear?.[index]);
		if (!u) return;
		const item = u.gear[index];
		u.gear.splice(index, 1);
		if (ITEMS[item]?.hp) u.hp = Math.max(1, u.hp - ITEMS[item].hp);
		this.dropItem(u.x, u.y + .2, item);
		this.say(`Dropped ${ITEMS[item].name}.`);
		this.emit();
	}
	scoutLimit(team) {
		return 2 * (this.age[team] + 1);
	}
	scoutCount(team) {
		let n = this.units.filter((u) => u.team === team && u.kind === "scout" && u.hp > 0).length;
		for (const b of this.buildings) {
			if (b.team !== team || b.hp <= 0) continue;
			n += b.queue.filter((k) => k === "scout").length;
		}
		return n;
	}
	scoutSeen(u) {
		if (u.kind !== "scout" || !u.stealth || u.order.type === "attack") return true;
		if (this.units.some((o) => o.hp > 0 && o.team !== u.team && o.order.type === "attack" && !o.order.building && o.order.id === u.id)) return true;
		for (const b of this.buildings) {
			if (b.hp <= 0 || b.progress < 1 || b.team === u.team) continue;
			if (b.kind !== "tower" && b.kind !== "townhall") continue;
			const d = BLDS[b.kind];
			if (dist(u.x, u.y, b.x + d.w / 2, b.y + d.h / 2) <= this.bSight(b)) return true;
		}
		if (!this.schoolDetect(u.team === 0 ? 1 : 0)) return false;
		const half = this.mageHalf();
		for (const m of this.units) {
			if (m.hp <= 0 || m.held || m.kind !== "mage" || m.team === u.team) continue;
			if (!this.schoolDetect(m.team)) continue;
			if (dist(m.x, m.y, u.x, u.y) <= half) return true;
		}
		return false;
	}
	bUpgrades(b) {
		if (b.kind === "tower") return this.hasSchool(b.team) ? 1 : 0;
		if (b.kind === "townhall") return Math.min(2, this.age[b.team] || 0) + ((this.age[b.team] || 0) >= 4 ? 1 : 0);
		return 0;
	}
	bSight(b) {
		const base = b.kind === "townhall" ? 8 : b.kind === "tower" ? 7 : 0;
		if (!base) return 0;
		return base * this.mapScale() * (this.bUpgrades(b) > 0 ? 1.5 : 1);
	}
	bRange(b) {
		const base = b.kind === "tower" ? 5.2 : 3.6;
		return base * Math.pow(1.25, this.bUpgrades(b));
	}
	beginAge() {
		const b = this.buildings.find((n) => n.team === this.playerTeam && n.kind === "townhall" && n.hp > 0 && n.progress >= 1);
		if (!b) return;
		const next = this.age[this.playerTeam] + 1;
		if (next > 4) {
			this.say("Already in Age 5.");
			return;
		}
		if (b.ageT > 0) {
			this.say("Town hall is busy advancing.");
			return;
		}
		if (next === 1 && !this.built(this.playerTeam, "barracks")) {
			this.showNeed("Build a Barracks to advance to the Village Age.");
			return;
		}
		if (next === 2 && !this.built(this.playerTeam, "range")) {
			this.showNeed("Build an Archery Range to advance to Age 3.");
			return;
		}
		if (next === 3 && !this.built(this.playerTeam, "stable")) {
			this.showNeed("Build a Stable to advance to Age 4.");
			return;
		}
		if (next === 4 && !this.built(this.playerTeam, "school")) {
			this.showNeed("Build a Mage School to advance to Age 5.");
			return;
		}
		const cost = next === 1 ? AGE_COST : next === 2 ? AGE3_COST : next === 3 ? AGE4_COST : AGE5_COST;
		if (!this.spend(this.playerTeam, cost)) {
			this.say(`Need ${costText(cost)}.`);
			return;
		}
		b.ageT = next === 1 ? AGE_TIME : next === 2 ? AGE3_TIME : next === 3 ? AGE4_TIME : AGE5_TIME;
		this.say(next === 1 ? "Advancing to the Village Age." : next === 2 ? "Advancing to Age 3." : next === 3 ? "Advancing to Age 4." : "Advancing to Age 5.");
		this.blip(300, .08, .05);
		this.emit();
	}
	built(team, kind) {
		return this.buildings.some((n) => n.team === team && n.kind === kind && n.hp > 0 && n.progress >= 1);
	}
	queueUnit(kind) {
		const home = kind === "villager" || kind === "scout" ? "townhall" : kind === "archer" || kind === "crossbow" ? "range" : kind === "cavalry" || kind === "knight" || kind === "tamer" ? "stable" : kind === "mage" || kind === "frost" || kind === "priest" || kind === "warlock" ? "school" : kind === "guard" ? "keep" : kind === "hero" ? "altar" : kind === "demigod" || kind === "avatar" || kind === "god" ? "temple" : kind === "ram" || kind === "catapult" || kind === "ballista" ? "yard" : "barracks";
		const b = this.buildings.find((n) => n.team === this.playerTeam && n.kind === home && n.hp > 0 && n.progress >= 1);
		if (!b) {
			this.say(`Need a ${BLDS[home].name}.`);
			return;
		}
		if (kind === "halberd" && this.faction !== "dynasty") {
			this.say("Only the dynasty trains the halberd.");
			return;
		}
		if (kind === "god" && this.godBusy(this.playerTeam)) {
			this.say("Only one god can walk the field.");
			return;
		}
		if (kind === "hero" && this.heroBusy(this.playerTeam)) {
			this.say(this.heroFallen[this.playerTeam] ? "Your hero has fallen. Revive them at the altar." : "You already have a hero.");
			return;
		}
		if (this.age[this.playerTeam] < UNITS[kind].age) {
			this.say(UNITS[kind].age >= 4 ? "Age 5 required." : UNITS[kind].age >= 3 ? "Age 4 required." : UNITS[kind].age >= 2 ? "Age 3 required." : "Village Age required.");
			return;
		}
		if (b.ageT > 0) {
			this.say("Town hall is busy advancing.");
			return;
		}
		if (this.reservedPop(this.playerTeam) >= this.capOf(this.playerTeam)) {
			this.say("Build houses. Population is full.");
			return;
		}
		if (kind === "scout" && this.scoutCount(this.playerTeam) >= this.scoutLimit(this.playerTeam)) {
			this.say("Only two scouts per town level.");
			return;
		}
		if (b.queue.length >= 5) return;
		if (!this.spend(this.playerTeam, UNITS[kind].cost)) {
			this.say(`Need ${costText(UNITS[kind].cost)}.`);
			return;
		}
		if (!b.queue.length) b.trainT = UNITS[kind].time;
		b.queue.push(kind);
		this.blip(440, .05, .04);
		this.emit();
		return true;
	}
	canAfford(team, cost) {
		for (const k of [
			"food",
			"wood",
			"gold",
			"stone"
		]) {
			if ((cost[k] ?? 0) > this.stock[team][k]) return false;
		}
		return true;
	}
	spend(team, cost) {
		if (!this.canAfford(team, cost)) return false;
		for (const k of [
			"food",
			"wood",
			"gold",
			"stone"
		]) this.stock[team][k] -= cost[k] ?? 0;
		return true;
	}
	give(team, cost) {
		for (const k of [
			"food",
			"wood",
			"gold",
			"stone"
		]) this.stock[team][k] += cost[k] ?? 0;
	}
	refundText(cost, frac) {
		const part = {};
		for (const k of [
			"food",
			"wood",
			"gold",
			"stone"
		]) {
			const n = Math.round((cost[k] ?? 0) * frac);
			if (n) part[k] = n;
		}
		return costText(part);
	}
	refund(team, cost, frac) {
		const part = {};
		for (const k of [
			"food",
			"wood",
			"gold",
			"stone"
		]) {
			const n = Math.round((cost[k] ?? 0) * frac);
			if (n) part[k] = n;
		}
		this.give(team, part);
		return part;
	}
	demolishSelected() {
		const b = this.selectedBuilding != null ? this.building(this.selectedBuilding) : null;
		if (!b || b.team !== this.playerTeam || b.kind === "townhall" || b.progress < 1) return;
		if (this.armDemolish !== b.id) {
			this.armDemolish = b.id;
			this.say("Tap Demolish again to tear it down.");
			this.emit();
			return;
		}
		this.armDemolish = 0;
		this.refund(b.team, BLDS[b.kind].cost, 0.75);
		b.hp = 0;
		this.say("Recovered 75% of the materials.");
		this.reap();
		this.emit();
	}
	cancelSelected() {
		const b = this.selectedBuilding != null ? this.building(this.selectedBuilding) : null;
		if (!b || b.team !== this.playerTeam || b.progress >= 1) return;
		this.refund(b.team, BLDS[b.kind].cost, 1);
		b.hp = 0;
		this.say("All materials returned.");
		this.reap();
		this.emit();
	}
	unqueueOne() {
		const b = this.selectedBuilding != null ? this.building(this.selectedBuilding) : null;
		if (!b || b.team !== this.playerTeam || !b.queue.length) return;
		const kind = b.queue.pop();
		this.refund(b.team, UNITS[kind].cost, 1);
		if (!b.queue.length) b.trainT = 0;
		this.emit();
	}
	unstick(u) {
		if (this.canStand(u.x, u.y)) return false;
		const tx = Math.floor(u.x);
		const ty = Math.floor(u.y);
		let best = null;
		let bestD = 1e9;
		for (let r = 1; r <= 4; r++) {
			for (let dy = -r; dy <= r; dy++) {
				for (let dx = -r; dx <= r; dx++) {
					if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
					if (!this.walkable(tx + dx, ty + dy)) continue;
					const d = dx * dx + dy * dy;
					if (d < bestD) {
						bestD = d;
						best = { x: tx + dx + .5, y: ty + dy + .5 };
					}
				}
			}
		}
		if (!best) return false;
		u.x = best.x;
		u.y = best.y;
		u.path = [];
		u.repath = 0;
		return true;
	}
	findPath(x0, y0, gx, gy, nearBuilding, node) {
		const sx = Math.floor(x0);
		const sy = Math.floor(y0);
		const isGoal = (tx, ty) => {
			if (!this.walkable(tx, ty)) return false;
			if (nearBuilding) {
				const d = BLDS[nearBuilding.kind];
				const dd = distRect(tx + .5, ty + .5, nearBuilding.x, nearBuilding.y, d.w, d.h);
				return dd > 0 && dd <= 1.05;
			}
			if (node) {
				const blocks = node.kind === "tree" || node.kind === "gold" || node.kind === "stone";
				if (!blocks && tx === node.x && ty === node.y) return true;
				return Math.max(Math.abs(tx - node.x), Math.abs(ty - node.y)) <= 1 && !(tx === node.x && ty === node.y);
			}
			return tx === Math.floor(gx) && ty === Math.floor(gy);
		};
		if (!this.walkable(sx, sy)) return [];
		if (isGoal(sx, sy)) return [];
		const ht = nearBuilding ? {
			x: nearBuilding.x + BLDS[nearBuilding.kind].w / 2,
			y: nearBuilding.y + BLDS[nearBuilding.kind].h / 2
		} : node ? {
			x: node.x,
			y: node.y
		} : {
			x: gx,
			y: gy
		};
		const heur = (tx, ty) => {
			const dx = Math.abs(tx - ht.x);
			const dy = Math.abs(ty - ht.y);
			const m = Math.min(dx, dy);
			return m * 1.414 + (Math.max(dx, dy) - m);
		};
		const open = new Heap();
		const gScore = new Float64Array(MAP_W * MAP_H);
		gScore.fill(Number.POSITIVE_INFINITY);
		const prev = new Int32Array(MAP_W * MAP_H);
		prev.fill(-1);
		const start = sy * MAP_W + sx;
		gScore[start] = 0;
		open.push(start, heur(sx, sy), 0);
		const closed = new Uint8Array(MAP_W * MAP_H);
		let found = -1;
		let expands = 0;
		const budget = Math.max(8000, Math.min(48000, (MAP_W * MAP_H) / 8 | 0));
		while (open.size && expands < budget) {
			const item = open.pop();
			if (!item || item.g !== gScore[item.i]) continue;
			if (closed[item.i]) continue;
			closed[item.i] = 1;
			expands++;
			const cx = item.i % MAP_W;
			const cy = item.i / MAP_W | 0;
			if (item.i !== start && isGoal(cx, cy)) {
				found = item.i;
				break;
			}
			for (const [dx, dy, cost] of DIRS) {
				const nx = cx + dx;
				const ny = cy + dy;
				if (!this.walkable(nx, ny)) continue;
				if (dx !== 0 && dy !== 0 && (!this.walkable(cx + dx, cy) || !this.walkable(cx, cy + dy) || this.hitsBuilding(cx + .5 + dx * .5, cy + .5 + dy * .5))) continue;
				const ni = ny * MAP_W + nx;
				const ng = gScore[item.i] + cost;
				if (ng >= gScore[ni]) continue;
				gScore[ni] = ng;
				prev[ni] = item.i;
				open.push(ni, ng + heur(nx, ny), ng);
			}
		}
		if (found < 0) return [];
		const path = [];
		let c = found;
		while (c >= 0 && c !== start) {
			path.push({
				x: c % MAP_W + .5,
				y: (c / MAP_W | 0) + .5
			});
			c = prev[c];
		}
		path.reverse();
		return path;
	}
	seek(u, tx, ty, dt) {
		const dx = tx - u.x;
		const dy = ty - u.y;
		const d = Math.hypot(dx, dy);
		if (d < .001) return d;
		const speed = (u.kind === "scout" && u.stealth ? UNITS.scout.speed * .2 : UNITS[u.kind].speed) * this.tilt(u.team, u.kind).speed * (this.age[u.team] >= 1 && u.kind === "villager" ? 1.08 : 1) * this.gearOf(u).speed * ((u.slow || 0) > 0 ? .55 : 1) * (u.banner ? 1.12 : 1) * ((u.bless || 0) > 0 ? 1.1 : 1) * this.weather().slow * (this.tileAt(Math.floor(u.x), Math.floor(u.y))?.terrain === "marsh" ? .72 : 1);
		const slow = d < .1 ? Math.max(.7, d / .1) : 1;
		const step = Math.min(speed * slow * dt, d);
		const nx = u.x + dx / d * step;
		const ny = u.y + dy / d * step;
		if (this.canStand(nx, ny)) {
			u.x = nx;
			u.y = ny;
		} else if (this.canStand(nx, u.y)) {
			u.x = nx;
		} else if (this.canStand(u.x, ny)) {
			u.y = ny;
		} else {
			let slide = null;
			let slideD = d;
			const gx = Math.floor(tx);
			const gy = Math.floor(ty);
			for (const [ox, oy] of DIRS) {
				const nx = Math.floor(u.x) + ox;
				const ny = Math.floor(u.y) + oy;
				if (!this.walkable(nx, ny)) continue;
				const nd = Math.hypot(nx + .5 - gx, ny + .5 - gy);
				if (nd < slideD - .15) {
					slideD = nd;
					slide = { x: nx + .5, y: ny + .5 };
				}
			}
			if (slide) {
				u.x = slide.x;
				u.y = slide.y;
			}
			u.path = [];
			u.repath = .12;
		}
		const a = iso(0, 0);
		const b = iso(dx, dy);
		if (Math.abs(b.sx - a.sx) > .5) u.right = b.sx > a.sx;
		return d;
	}
	moveTo(u, gx, gy, dt, near, bld, node) {
		this.unstick(u);
		const end = u.path.length ? u.path[u.path.length - 1] : null;
		let allow = 1.5;
		if (bld) allow = Math.max(1.6, (BLDS[bld.kind].w + BLDS[bld.kind].h) * .55);
		else if (node) {
			const box = this.nodeBox(node);
			allow = Math.max(1.6, (box.w + box.h) * .55);
		}
		if (end && dist(end.x, end.y, gx, gy) > allow) u.repath = 0;
		if (u.repath <= 0) {
			const tx = Math.floor(gx);
			const ty = Math.floor(gy);
			const pointBlocked = !this.walkable(tx, ty);
			let nearB = bld || null;
			let nearN = node || null;
			if (pointBlocked && !nearB && !nearN) {
				nearB = this.buildingOn(tx, ty);
				if (!nearB) {
					const t = this.tileAt(tx, ty);
					const n = t && t.node >= 0 ? this.nodes[t.node] : null;
					if (n && (n.amount > 0 || n.alive)) nearN = n;
				}
			}
			u.path = this.findPath(u.x, u.y, gx, gy, pointBlocked ? nearB : null, pointBlocked ? nearN : null);
			if (!u.path.length && pointBlocked) u.path = this.findPathAdj(u.x, u.y, tx, ty);
			u.pathI = 0;
			u.repath = .28;
		} else u.repath -= dt;
		if (u.pathI < u.path.length) {
			const wp = u.path[u.pathI];
			const d = this.seek(u, wp.x, wp.y, dt);
			if (d < .18) u.pathI++;
		} else if (this.canStand(gx, gy)) {
			this.seek(u, gx, gy, dt);
		}
		return dist(u.x, u.y, gx, gy) <= near;
	}
	graze(dt) {
		for (const n of this.nodes) {
			if (n.kind !== "sheep" || !n.alive) continue;
			const hunted = this.units.some((u) => u.hp > 0 && u.order.type === "gather" && u.order.nodeId === n.id && dist(u.x, u.y, n.x + .5, n.y + .5) < 7);
			if (hunted) continue;
			if (Math.random() > dt * .35) continue;
			const dirs = [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1]
			];
			const [dx, dy] = dirs[Math.random() * dirs.length | 0];
			this.shiftAnimal(n, n.x + dx, n.y + dy);
		}
	}
	spook(n, from) {
		let best = null;
		let bestD = dist(n.x + .5, n.y + .5, from.x, from.y);
		for (const [dx, dy] of [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
			[1, 1],
			[-1, 1],
			[1, -1],
			[-1, -1]
		]) {
			const x = n.x + dx;
			const y = n.y + dy;
			if (!this.canHostAnimal(x, y)) continue;
			const d = dist(x + .5, y + .5, from.x, from.y);
			if (d > bestD) {
				bestD = d;
				best = {
					x,
					y
				};
			}
		}
		if (best) this.shiftAnimal(n, best.x, best.y);
	}
	placeLion(x, y, amount) {
		for (let r = 0; r <= 8; r++) {
			for (let dy = -r; dy <= r; dy++) {
				for (let dx = -r; dx <= r; dx++) {
					if (r && Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
					const nx = x + dx;
					const ny = y + dy;
					if (dist(nx, ny, this.scaleN(66), this.scaleN(66)) < 14 * this.mapScale() || dist(nx, ny, this.scaleN(18), this.scaleN(18)) < 14 * this.mapScale()) continue;
					if (this.addNode("lion", nx, ny, amount) >= 0) return;
				}
			}
		}
	}
	lions(dt) {
		for (const n of this.nodes) {
			const stat = beastOf(n.kind);
			if (!stat || n.kind === "sheep" || !n.alive) continue;
			if (n.yield && !n.ally) {
				this.tameBeast(n, dt);
				continue;
			}
			n.bite = Math.max(0, (n.bite ?? 0) - dt);
			let prey = null;
			let best = stat.range;
			for (const u of this.units) {
				if (u.hp <= 0 || u.held || u.captive) continue;
				if (n.ally) {
					if (u.team === this.playerTeam || u.team === 2) continue;
				} else if (this.rpg && u.team !== this.playerTeam) continue;
				const d = dist(u.x, u.y, n.x + .5, n.y + .5);
				if (d < best) {
					best = d;
					prey = u;
				}
			}
			if (!prey) {
				if (n.ally) {
					const keeper = n.keeper != null ? this.unit(n.keeper) : null;
					const lead = keeper && keeper.hp > 0 ? keeper : this.units.find((u) => u.kind === "hero" && u.team === this.playerTeam && u.hp > 0);
					if (lead && dist(lead.x, lead.y, n.x + .5, n.y + .5) > 2.4 && (n.pace ?? 0) <= 0) {
						n.pace = stat.pace;
						this.shiftAnimal(n, n.x + Math.sign(lead.x - n.x), n.y + Math.sign(lead.y - n.y));
					} else n.pace = Math.max(0, (n.pace ?? 0) - dt);
				} else if (Math.random() < dt * .28) {
					const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
					const [dx, dy] = dirs[Math.random() * dirs.length | 0];
					this.shiftAnimal(n, n.x + dx, n.y + dy);
				}
				continue;
			}
			if (best <= (BOSSES[n.kind] ? 1.6 : n.kind === "troll" ? 1.35 : 1.15)) {
				if (n.bite <= 0) {
					n.bite = stat.bite;
					const bite = Math.max(1, Math.round(stat.dmg * this.beastMight(n)));
					if (BOSSES[n.kind]) this.bossStrike(n, stat);
					else {
					prey.hp -= bite;
					prey.hit = .18;
					this.floaters.push({
						x: prey.x,
						y: prey.y,
						text: String(bite),
						life: .7,
						max: .7,
						dmg: true
					});
					if (prey.team === this.playerTeam && this.alertT <= 0) {
						this.say(`A ${stat.name.toLowerCase()} is attacking.`);
						this.alertT = 8;
					}
					if (prey.hp <= 0) this.markDown(prey);
					else if (n.kind === "gorgon" && !n.ally) prey.slow = Math.max(prey.slow || 0, 2.4);
					if (n.ally && prey.hp > 0) {
						n.hp -= Math.max(1, Math.round((UNITS[prey.kind]?.dmg || 4) * 0.45));
						if (n.hp <= 0) {
							n.alive = false;
							n.hp = 0;
							this.say(`Your ${stat.name.toLowerCase()} has fallen.`);
						}
					}
					}
				}
				continue;
			}
			if ((n.pace ?? 0) > 0) {
				n.pace -= dt;
				continue;
			}
			n.pace = stat.pace;
			const sx = Math.sign(prey.x - (n.x + .5));
			const sy = Math.sign(prey.y - (n.y + .5));
			if (!this.shiftAnimal(n, n.x + sx, n.y + sy)) this.shiftAnimal(n, n.x + sx, n.y) || this.shiftAnimal(n, n.x, n.y + sy);
		}
	}
	seedMonsters(rnd) {
		const n = Math.max(4, Math.round(8 * this.mapScale()));
		const kinds = ["spider", "spider", "wolf", "wolf", "wolf", "boar", "boar", "troll"];
		for (let i = 0; i < n; i++) this.placeMonster(kinds[Math.floor(rnd() * kinds.length)], rnd);
	}
	seedRpg(rnd) {
		this.seedMonsters(rnd);
		for (let i = 0; i < 3; i++) this.placeNest(rnd);
		const kinds = ["alpha", "brood", "gore", "chief"];
		const spots = [
			[this.scaleN(22), this.scaleN(78)],
			[this.scaleN(78), this.scaleN(22)],
			[this.scaleN(42), this.scaleN(42)],
			[this.scaleN(28), this.scaleN(28)]
		];
		const home = this.playerTeam === 1 ? [this.scaleN(18), this.scaleN(18)] : [this.scaleN(66), this.scaleN(66)];
		kinds.forEach((kind, i) => {
			for (let t = 0; t < 24; t++) {
				const x = spots[i][0] + Math.floor(rnd() * 12) - 4;
				const y = spots[i][1] + Math.floor(rnd() * 12) - 4;
				if (dist(x, y, home[0], home[1]) < 16) continue;
				if (this.addNode(kind, x, y, BOSSES[kind].food) >= 0) {
					this.stampDen(x, y, kind);
					break;
				}
			}
		});
		for (const kind of ["harpy", "minotaur", "cyclops", "gorgon"]) this.placeMonster(kind, rnd);
	}
	placeVillages(rnd) {
		const home = this.playerTeam === 1 ? [this.scaleN(18), this.scaleN(18)] : [this.scaleN(66), this.scaleN(66)];
		const plans = [
			[this.scaleN(52), this.scaleN(74), 2],
			[this.scaleN(36), this.scaleN(52), 2],
			[this.scaleN(78), this.scaleN(38), 1],
			[this.scaleN(24), this.scaleN(64), 1]
		];
		const myths = ["minotaur", "cyclops", "harpy", "gorgon"];
		plans.forEach((plan, i) => {
			const team = plan[2] === 2 ? 2 : this.foeTeam();
			let x = plan[0];
			let y = plan[1];
			for (let t = 0; t < 24; t++) {
				const px = plan[0] + Math.floor(rnd() * 16) - 7;
				const py = plan[1] + Math.floor(rnd() * 16) - 7;
				if (dist(px, py, home[0], home[1]) < 16) continue;
				if (!this.canPlace("house", px, py)) continue;
				x = px;
				y = py;
				break;
			}
			if (!this.canPlace("house", x, y)) return;
			this.addBuilding("house", team, x, y, true);
			if (this.canPlace("house", x + 3, y)) this.addBuilding("house", team, x + 3, y, true);
			if (team === 2) {
				for (const spot of [[1.4, 2.2], [3.2, 1.2]]) {
					const u = this.spawnNear(2, "villager", x + spot[0], y + spot[1]);
					if (u) u.home = { x: x + 1.6, y: y + 1.6 };
				}
				return;
			}
			if (this.canPlace("tower", x + 1, y + 3)) this.addBuilding("tower", team, x + 1, y + 3, true);
			else if (this.canPlace("tower", x - 2, y)) this.addBuilding("tower", team, x - 2, y, true);
			for (const kind of [myths[i % 4], i % 2 ? "gorgon" : "harpy"]) {
				for (let k = 0; k < 8; k++) {
					const mx = x + Math.floor(rnd() * 5);
					const my = y + 2 + Math.floor(rnd() * 4);
					if (this.addNode(kind, mx, my, MONSTERS[kind].food) >= 0) break;
				}
			}
			for (const spot of [[1.2, 1.8], [2.8, 2.4]]) {
				const u = this.spawnNear(team, spot[0] < 2 ? "warrior" : "archer", x + spot[0], y + spot[1]);
				if (u) {
					u.village = true;
					u.home = { x: x + 1.6, y: y + 1.6 };
				}
			}
			this.cageAt(x + 0.8, y + 0.8);
			this.cageAt(x + 2.4, y + 0.8);
		});
	}
	cageAt(x, y) {
		const u = this.spawnNear(this.foeTeam(), "villager", x, y);
		if (!u) return null;
		u.captive = true;
		u.camp = { x: u.x, y: u.y };
		u.hp = Math.min(u.hp, 28);
		if (!this.tale) this.tale = { need: 0, freed: 0, home: 0, joined: 0 };
		this.tale.need += 1;
		return u;
	}
	placeCages(rnd) {
		const home = this.playerTeam === 1 ? [this.scaleN(18), this.scaleN(18)] : [this.scaleN(66), this.scaleN(66)];
		const spots = [
			[this.scaleN(60), this.scaleN(18)],
			[this.scaleN(14), this.scaleN(46)]
		];
		for (const spot of spots) {
			let x = spot[0];
			let y = spot[1];
			for (let t = 0; t < 16; t++) {
				const px = spot[0] + Math.floor(rnd() * 10) - 4;
				const py = spot[1] + Math.floor(rnd() * 10) - 4;
				if (dist(px, py, home[0], home[1]) < 14) continue;
				if (!this.walkable(px, py)) continue;
				x = px;
				y = py;
				break;
			}
			if (!this.walkable(x, y)) continue;
			this.cageAt(x, y);
			const g = this.spawnNear(this.foeTeam(), "warrior", x + 1.4, y + 1.2);
			if (g) {
				g.village = true;
				g.home = { x, y };
			}
		}
	}
	campClear(u) {
		const c = u.camp || { x: u.x, y: u.y };
		const guard = this.units.some((o) => o.hp > 0 && !o.captive && o.team !== this.playerTeam && o.team !== 2 && dist(o.x, o.y, c.x, c.y) < 5.5);
		const tower = this.buildings.some((b) => b.hp > 0 && b.kind === "tower" && b.team !== this.playerTeam && b.team !== 2 && dist(b.x + 1, b.y + 1, c.x, c.y) < 6.5);
		return !guard && !tower;
	}
	freeCaptive(u) {
		if (!u?.captive || u.hp <= 0) return;
		u.captive = false;
		u.rescued = true;
		u.settled = false;
		u.team = this.playerTeam;
		u.order = { type: "idle" };
		if (!this.tale) this.tale = { need: 0, freed: 0, home: 0, joined: 0 };
		this.tale.freed += 1;
		this.say(`Freed. ${this.tale.freed}/${this.tale.need} of your people. Lead them home.`);
		this.floaters.push({ x: u.x, y: u.y, text: "Freed", life: 1.2, max: 1.2, gold: true });
	}
	rescuePass() {
		if (!this.rpg || this.phase !== "play" || !this.tale) return;
		const hero = this.units.find((u) => u.team === this.playerTeam && u.kind === "hero" && u.hp > 0);
		if (!hero) return;
		for (const u of this.units) {
			if (!u.captive || u.hp <= 0) continue;
			if (dist(hero.x, hero.y, u.x, u.y) > 2.5) continue;
			if (!this.campClear(u)) continue;
			this.freeCaptive(u);
		}
	}
	leadPeople(u, dt) {
		if (!u.rescued || u.settled || u.hp <= 0) return false;
		const hall = this.buildings.find((b) => b.team === this.playerTeam && b.kind === "townhall" && b.hp > 0);
		if (hall && dist(u.x, u.y, hall.x + 1.5, hall.y + 1.5) < 3.2) {
			u.settled = true;
			u.order = { type: "idle" };
			if (this.tale) this.tale.home += 1;
			this.say(`${this.tale?.home || 1}/${this.tale?.need || 1} of your people are home.`);
			return true;
		}
		const hero = this.units.find((h) => h.team === u.team && h.kind === "hero" && h.hp > 0);
		if (!hero) return false;
		const ox = ((u.id % 5) - 2) * 0.65;
		this.moveTo(u, hero.x + ox, hero.y + 1.15, dt, 0.95, null, null);
		return true;
	}
	offerYield(node, by) {
		const tamer = by && by.kind === "tamer" && by.team === this.playerTeam && by.hp > 0;
		if ((!this.rpg && !tamer) || !node || node.ally || node.yield) return false;
		if (!beastOf(node.kind) || BOSSES[node.kind] || node.kind === "sheep") return false;
		node.hp = 1;
		node.alive = true;
		node.yield = true;
		node.tame = 0;
		node.calm = 0;
		for (const u of this.units) if (u.order?.type === "gather" && u.order.nodeId === node.id) this.setOrder(u, { type: "idle" });
		if (tamer) {
			node.keeper = by.id;
			by.leash = node.id;
			this.say(`${beastOf(node.kind).name} yields. Your tamer is calming it.`);
		} else this.say(`${beastOf(node.kind).name} yields. Stand with it to bring it to your side, or strike again to finish it.`);
		return true;
	}
	recruitBeast(n) {
		if (!n || n.ally || !n.alive) return;
		n.ally = true;
		n.yield = false;
		const stat = beastOf(n.kind);
		n.hp = Math.max(n.hp, Math.round((stat?.hp || 20) * 0.65));
		if (!this.tale) this.tale = { need: 0, freed: 0, home: 0, joined: 0 };
		this.tale.joined += 1;
		this.say(`${stat?.name || "A beast"} joins your side.`);
		this.floaters.push({ x: n.x + .5, y: n.y, text: "Joined", life: 1.2, max: 1.2, gold: true });
	}
	tameBeast(n, dt) {
		const close = (u) => !!u && u.hp > 0 && u.team === this.playerTeam && dist(u.x, u.y, n.x + .5, n.y + .5) <= 1.8 && !(u.order?.type === "gather" && u.order.nodeId === n.id);
		const named = n.keeper != null ? this.unit(n.keeper) : null;
		const tamer = named && named.kind === "tamer" && close(named) ? named : this.units.find((u) => u.kind === "tamer" && close(u));
		const hero = this.units.find((u) => u.kind === "hero" && close(u));
		const who = tamer || (this.rpg ? hero : null);
		const coming = this.units.some((u) => u.kind === "tamer" && u.hp > 0 && u.leash === n.id);
		if (!who) {
			n.tame = 0;
			if (!coming && !this.rpg) {
				n.calm = (n.calm || 0) + dt;
				if (n.calm > 6) {
					n.yield = false;
					n.hp = Math.max(8, n.hp);
					n.calm = 0;
				}
			}
			return;
		}
		n.calm = 0;
		n.tame = (n.tame || 0) + dt * (who.kind === "tamer" ? 1.5 : 1);
		if (n.tame >= 1.6) {
			n.keeper = who.id;
			if (who.leash === n.id) who.leash = null;
			this.recruitBeast(n);
		}
	}
	placeMonster(kind, rnd) {
		const roll = rnd || Math.random;
		const food = MONSTERS[kind]?.food ?? 80;
		const pad = 16 * this.mapScale();
		for (let tries = 0; tries < 48; tries++) {
			const x = 2 + Math.floor(roll() * (MAP_W - 4));
			const y = 2 + Math.floor(roll() * (MAP_H - 4));
			if (dist(x, y, this.scaleN(66), this.scaleN(66)) < pad) continue;
			if (dist(x, y, this.scaleN(18), this.scaleN(18)) < pad) continue;
			if (this.addNode(kind, x, y, food) >= 0) return { x, y };
		}
		return null;
	}
	wanderMonsters(dt) {
		this.monsterT -= dt;
		if (this.monsterT > 0) return;
		this.monsterT = 42 + Math.random() * 36;
		const alive = this.nodes.filter((n) => MONSTERS[n.kind] && n.alive).length;
		if (alive >= Math.max(6, Math.round(12 * this.mapScale()))) return;
		const kinds = ["spider", "wolf", "wolf", "boar", "troll"];
		const kind = kinds[Math.random() * kinds.length | 0];
		const spot = this.placeMonster(kind);
		if (!spot) return;
		const hall = this.buildings.find((b) => b.team === this.playerTeam && b.kind === "townhall" && b.hp > 0);
		if (hall && dist(spot.x, spot.y, hall.x, hall.y) < 22 * this.mapScale()) this.say(`A ${MONSTERS[kind].name.toLowerCase()} is near your camp.`);
	}
	placeNest(rnd) {
		const roll = typeof rnd === "function" ? rnd : Math.random;
		const pad = 18 * this.mapScale();
		for (let tries = 0; tries < 48; tries++) {
			const x = 3 + Math.floor(roll() * (MAP_W - 6));
			const y = 3 + Math.floor(roll() * (MAP_H - 6));
			if (dist(x, y, this.scaleN(66), this.scaleN(66)) < pad) continue;
			if (dist(x, y, this.scaleN(18), this.scaleN(18)) < pad) continue;
			const t = this.tileAt(x, y);
			if (!t || t.terrain !== "grass" || t.node >= 0) continue;
			if (this.addNode("nest", x, y, 1) >= 0) return { x, y };
		}
		return null;
	}
	bossStrike(n, stat) {
		let hitPlayer = false;
		const blow = Math.max(1, Math.round(stat.dmg * this.beastMight(n)));
		for (const u of this.units) {
			if (u.hp <= 0 || u.held) continue;
			if (dist(u.x, u.y, n.x + .5, n.y + .5) > 1.85) continue;
			u.hp -= blow;
			u.hit = .2;
			this.floaters.push({ x: u.x, y: u.y, text: String(blow), life: .7, max: .7, dmg: true });
			if (u.team === this.playerTeam) hitPlayer = true;
			if (u.hp <= 0) this.markDown(u);
		}
		for (const b of this.buildings) {
			if (b.hp <= 0) continue;
			const d = BLDS[b.kind];
			if (distRect(n.x + .5, n.y + .5, b.x, b.y, d.w, d.h) > .35) continue;
			b.hp = Math.max(0, b.hp - Math.round(stat.dmg * .4));
			b.hit = .25;
		}
		this.floaters.push({ x: n.x + .5, y: n.y, text: "Slam", life: .8, max: .8, dmg: true });
		if (hitPlayer) {
			this.shake = Math.min(1, this.shake + .45);
			if (this.alertT <= 0) {
				this.say(`${stat.name} slams the ground.`);
				this.alertT = 8;
			}
		}
	}
	placeBoss(rnd) {
		const roll = typeof rnd === "function" ? rnd : Math.random;
		const kinds = ["alpha", "brood", "gore", "chief"];
		const kind = kinds[Math.floor(roll() * kinds.length)];
		const pad = 22 * this.mapScale();
		for (let tries = 0; tries < 48; tries++) {
			const x = 4 + Math.floor(roll() * (MAP_W - 8));
			const y = 4 + Math.floor(roll() * (MAP_H - 8));
			if (dist(x, y, this.scaleN(66), this.scaleN(66)) < pad) continue;
			if (dist(x, y, this.scaleN(18), this.scaleN(18)) < pad) continue;
			if (this.nodes.some((n) => BOSSES[n.kind] && n.alive && dist(n.x, n.y, x, y) < 16)) continue;
			if (this.addNode(kind, x, y, BOSSES[kind].food) >= 0) {
				this.stampDen(x, y, kind);
				return { x, y, kind };
			}
		}
		return null;
	}
	stampDen(x, y, kind) {
		const dirs = [[0, -1], [1, 0], [-1, 0], [0, 1], [1, -1], [-1, -1], [1, 1], [-1, 1]];
		for (const [dx, dy] of dirs) {
			const id = this.addNode("den", x + dx, y + dy, 1);
			if (id < 0) continue;
			const den = this.nodes[id];
			den.lair = kind;
			den.alive = false;
			den.hp = 0;
			return;
		}
	}
	bosses(dt) {
		if (this.rpg) return;
		this.bossT -= dt;
		if (this.bossT > 0) return;
		this.bossT = 85 + Math.random() * 50;
		const alive = this.nodes.filter((n) => BOSSES[n.kind] && n.alive).length;
		const cap = Math.max(1, Math.round(this.mapScale()));
		if (alive >= cap) return;
		const spot = this.placeBoss();
		if (!spot) return;
		this.say(`${BOSSES[spot.kind].name} is loose in the wild.`);
	}
	placeCart() {
		const pad = 14 * this.mapScale();
		for (let tries = 0; tries < 40; tries++) {
			const x = 3 + Math.floor(Math.random() * (MAP_W - 6));
			const y = 3 + Math.floor(Math.random() * (MAP_H - 6));
			if (dist(x, y, this.scaleN(66), this.scaleN(66)) < pad) continue;
			if (dist(x, y, this.scaleN(18), this.scaleN(18)) < pad) continue;
			if (this.addNode("cart", x, y, 1) >= 0) return { x, y };
		}
		return null;
	}
	carts(dt) {
		this.cartT -= dt;
		if (this.cartT <= 0) {
			this.cartT = 48 + Math.random() * 30;
			const have = this.nodes.some((n) => n.kind === "cart" && n.alive);
			if (!have && this.placeCart()) this.say("A treasure cart is loose. Catch it.");
		}
		for (const n of this.nodes) {
			if (n.kind !== "cart" || !n.alive) continue;
			n.pace = (n.pace ?? 0) - dt;
			if (n.pace > 0) continue;
			n.pace = .42;
			let foe = null;
			let best = 9;
			for (const u of this.units) {
				if (u.hp <= 0 || u.held) continue;
				const d = dist(u.x, u.y, n.x + .5, n.y + .5);
				if (d < best) {
					best = d;
					foe = u;
				}
			}
			let dx = 0;
			let dy = 0;
			if (foe) {
				dx = Math.sign(n.x + .5 - foe.x);
				dy = Math.sign(n.y + .5 - foe.y);
			} else {
				const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
				[dx, dy] = dirs[Math.random() * dirs.length | 0];
			}
			if (!this.shiftAnimal(n, n.x + dx, n.y + dy)) this.shiftAnimal(n, n.x + dx, n.y) || this.shiftAnimal(n, n.x, n.y + dy);
		}
	}
	plunder(b) {
		const gold = b.kind === "wall" ? 8 : b.kind === "house" || b.kind === "farm" ? 18 : 40;
		this.stock[this.playerTeam].gold += gold;
		this.fury = Math.max(this.fury, 6);
		this.floaters.push({
			x: b.x + BLDS[b.kind].w / 2,
			y: b.y,
			text: `+${gold} gold`,
			life: 1.2,
			max: 1.2,
			gold: true
		});
		if (this.toastT <= 0) this.say("Plunder.");
		this.shake = Math.min(1, this.shake + .25);
	}
	hatchAt(n) {
		const kinds = ["spider", "spider", "wolf", "wolf", "boar", "troll"];
		const kind = kinds[Math.random() * kinds.length | 0];
		const food = MONSTERS[kind].food;
		for (let r = 1; r <= 3; r++) {
			for (let dy = -r; dy <= r; dy++) {
				for (let dx = -r; dx <= r; dx++) {
					if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
					if (this.addNode(kind, n.x + dx, n.y + dy, food) >= 0) return kind;
				}
			}
		}
		return null;
	}
	nests(dt) {
		this.nestT -= dt;
		if (this.nestT <= 0) {
			this.nestT = 64 + Math.random() * 36;
			const have = this.nodes.filter((n) => n.kind === "nest" && n.alive).length;
			const cap = Math.max(2, Math.round(3 * this.mapScale()));
			if (have < cap) {
				const spot = this.placeNest();
				if (spot) {
					const hall = this.buildings.find((b) => b.team === this.playerTeam && b.kind === "townhall" && b.hp > 0);
					if (this.onScreen(spot.x + .5, spot.y + .5)) this.say("A monster nest has appeared.");
					else if (hall && dist(spot.x, spot.y, hall.x, hall.y) < 26 * this.mapScale() && this.toastT <= 0) this.say("You hear a nest nearby.");
				}
			}
		}
		let monsters = this.nodes.filter((n) => MONSTERS[n.kind] && n.alive).length;
		const cap = Math.max(8, Math.round(14 * this.mapScale()));
		for (const n of this.nodes) {
			if (n.kind !== "nest" || !n.alive) continue;
			n.bite = (n.bite ?? 16) - dt;
			if (n.bite > 0 || monsters >= cap) continue;
			const around = this.nodes.filter((m) => MONSTERS[m.kind] && m.alive && dist(m.x, m.y, n.x, n.y) < 6).length;
			if (around >= 3) {
				n.bite = 8;
				continue;
			}
			const kind = this.hatchAt(n);
			n.bite = 18 + Math.random() * 10;
			if (!kind) continue;
			monsters++;
			if (this.onScreen(n.x + .5, n.y + .5) && this.toastT <= 0) this.say(`A ${MONSTERS[kind].name.toLowerCase()} crawled out of a nest.`);
		}
	}
	canHostAnimal(x, y) {
		const t = this.tileAt(x, y);
		if (!t || t.node >= 0 || t.terrain !== "grass") return false;
		return this.walkable(x, y);
	}
	shiftAnimal(n, x, y) {
		if (!this.canHostAnimal(x, y)) return false;
		const from = this.tileAt(n.x, n.y);
		const to = this.tileAt(x, y);
		if (!to) return false;
		if (from && from.node === n.id) from.node = -1;
		to.node = n.id;
		n.x = x;
		n.y = y;
		return true;
	}
	findPathAdj(x0, y0, tx, ty) {
		let best = null;
		const sx = Math.floor(x0);
		const sy = Math.floor(y0);
		for (let r = 1; r <= 4; r++) {
			let found = false;
			for (let dy = -r; dy <= r; dy++) {
				for (let dx = -r; dx <= r; dx++) {
					if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
					const nx = tx + dx;
					const ny = ty + dy;
					if (!this.walkable(nx, ny)) continue;
					if (sx === nx && sy === ny) return [{ x: nx + .5, y: ny + .5 }];
					const path = this.findPath(x0, y0, nx + .5, ny + .5, null, null);
					if (!path.length) continue;
					found = true;
					if (!best || path.length < best.length) best = path;
				}
			}
			if (found) return best ?? [];
		}
		return best ?? [];
	}
	step(dt) {
		if (this.phase === "menu") {
			this.fx = 68 + Math.sin(performance.now() / 4e3) * .4;
			this.fy = 68 + Math.cos(performance.now() / 5e3) * .25;
			return;
		}
		if (this.phase === "paused" || this.phase === "win" || this.phase === "lose") return;
		this.time += dt;
		this.toastT -= dt;
		const watch = this.watch();
		if (!this.lastWatch) this.lastWatch = watch;
		else if (watch !== this.lastWatch) {
			this.lastWatch = watch;
			this.say(watch === "Night" ? "Night falls. Sight is shorter." : watch === "Dawn" ? "Dawn." : watch === "Day" ? "Full day." : "Dusk.");
		}
		const sky = this.weather().name;
		if (!this.lastSky) this.lastSky = sky;
		else if (sky !== this.lastSky) {
			this.lastSky = sky;
			this.say(sky === "Rain" ? "Rain. The ground is slower." : sky === "Fog" ? "Fog rolls in. Sight is short." : sky === "Storm" ? "A storm." : sky === "Snow" ? "Snow. The ground is slower." : "The sky clears.");
		}
		for (let i = this.marks.length - 1; i >= 0; i--) {
			this.marks[i].life -= dt;
			if (this.marks[i].life <= 0) this.marks.splice(i, 1);
		}
		if (this.hintFromTouch) {
			this.hintT -= dt;
			if (this.hintT <= 0) {
				this.hintFromTouch = false;
				this.mouse = null;
			}
		}
		this.needT -= dt;
		this.alertT -= dt;
		this.streakT -= dt;
		if (this.streakT <= 0) this.streak = 0;
		this.fury = Math.max(0, this.fury - dt);
		this.shake = Math.max(0, this.shake - dt * 1.6);
		this.graze(dt);
		this.lions(dt);
		this.wanderMonsters(dt);
		this.nests(dt);
		this.crypts(dt);
		this.bosses(dt);
		this.auras(dt);
		this.carts(dt);
		if (this.keys.has(this.controls.panLeft) || this.keys.has("ArrowLeft")) this.panScreen(-280 * dt, 0);
		if (this.keys.has(this.controls.panRight) || this.keys.has("ArrowRight")) this.panScreen(280 * dt, 0);
		if (this.keys.has(this.controls.panUp) || this.keys.has("ArrowUp")) this.panScreen(0, -280 * dt);
		if (this.keys.has(this.controls.panDown) || this.keys.has("ArrowDown")) this.panScreen(0, 280 * dt);
		if (this.edge.x || this.edge.y) this.panScreen(this.edge.x * 320 * dt, this.edge.y * 320 * dt);
		for (const b of this.buildings) {
			if (b.hp <= 0) continue;
			b.hit = Math.max(0, b.hit - dt);
			if (b.progress < 1) continue;
			if (b.ageT > 0) {
				b.ageT -= dt;
				if (b.ageT <= 0) {
					b.ageT = 0;
					this.age[b.team] += 1;
					if (b.team === this.playerTeam) {
						const age = this.age[b.team];
						this.stock[b.team].food += 80;
						this.stock[b.team].gold += 40;
						this.say(age >= 4 ? "Age 5. Knights, guards, and the Keep. +80 food, +40 gold." : age >= 3 ? "Age 4. Mages and crossbows. +80 food, +40 gold." : age >= 2 ? "Age 3. Swords and cavalry. Horses beat bows. +80 food, +40 gold." : "Village Age. Spears beat horses, bows beat footmen, horses beat bows. +80 food, +40 gold.");
						this.blip(523, .12, .06);
						this.blip(659, .16, .05);
						this.shake = Math.min(1, this.shake + .35);
					}
				}
			}
			if (b.queue.length && b.ageT <= 0) {
				b.trainT -= dt;
				if (b.trainT <= 0) {
					const kind = b.queue.shift();
					const def = BLDS[b.kind];
					const born = this.spawnNear(b.team, kind, b.x + def.w / 2, b.y + def.h + .4);
					if (b.rally) this.setOrder(born, { type: "rally", x: b.rally.x, y: b.rally.y });
					if (b.team === this.playerTeam) this.blip(700, .07, .05);
					if (kind === "hero" && b.team === this.playerTeam) this.say(`${this.unitName(b.team, "hero")} ready. Charge, Blood on a kill, and allies nearby take less damage.`);
					b.trainT = b.queue.length ? UNITS[b.queue[0]].time : 0;
				}
			}
			if (b.kind === "altar" && (b.reviveT || 0) > 0) {
				b.reviveT -= dt;
				if (b.reviveT <= 0) {
					b.reviveT = 0;
					const fall = this.heroFallen[b.team];
					const def = BLDS.altar;
					const born = this.spawnNear(b.team, "hero", b.x + def.w / 2, b.y + def.h + .4);
					if (fall) {
						born.level = fall.level;
						born.xp = fall.xp;
						born.hp = this.unitMax("hero", b.team, fall.level);
					}
					this.heroFallen[b.team] = null;
					if (b.rally) this.setOrder(born, { type: "rally", x: b.rally.x, y: b.rally.y });
					if (b.team === this.playerTeam) {
						this.say("Your hero has returned.");
						this.blip(660, .1, .05);
					}
				}
			}
			if ((b.kind === "tower" || b.kind === "townhall") && b.progress >= 1) {
				if (!(b.team === this.foeTeam() && this.mood === "passive" && !this.provoked)) {
				b.attackCd -= dt;
				const mageTower = b.kind === "tower" && this.hasSchool(b.team);
				const range = this.bRange(b);
				const dmg = b.kind === "tower" ? 9 : 5;
				if (b.attackCd <= 0) {
					const foe = this.nearestFoe(b.x + BLDS[b.kind].w / 2, b.y + BLDS[b.kind].h / 2, b.team, range, true);
					const hold = foe && foe.vanished && b.team === this.foeTeam() && this.mood === "passive";
					if (foe && !hold) {
						this.shoot(b.x + BLDS[b.kind].w / 2, b.y + BLDS[b.kind].h / 2, foe.x, foe.y, dmg, b.team, foe.id, false, !mageTower && b.kind === "tower" && !this.isCoven(b.team), mageTower ? "fire" : this.isCoven(b.team) ? "arcane" : "");
						b.attackCd = b.kind === "tower" ? 1.05 : 1.25;
					}
				}
				}
			}
			if (b.kind === "school" && b.progress >= 1 && !(b.team === this.foeTeam() && this.mood === "passive" && !this.provoked)) {
				b.attackCd -= dt;
				if (b.attackCd <= 0) {
					const hall = this.buildings.find((h) => h.team === b.team && h.kind === "townhall" && h.hp > 0 && h.progress >= 1);
					if (hall) {
						const hx = hall.x + BLDS.townhall.w / 2;
						const hy = hall.y + BLDS.townhall.h / 2;
						const foe = this.nearestFoe(hx, hy, b.team, this.bRange(hall), true);
						const hold = foe && foe.vanished && b.team === this.foeTeam() && this.mood === "passive";
						if (foe && !hold) {
							const shot = this.shoot(b.x + BLDS.school.w / 2, b.y + BLDS.school.h / 2, foe.x, foe.y, 14, b.team, foe.id, false, false, "lightning");
							shot.high = true;
							if (this.onScreen(hx, hy) || this.onScreen(foe.x, foe.y)) this.score.lightning();
							b.attackCd = 1.2;
						}
					}
				}
			}
		}
		this.heardBuild = false;
		for (const u of this.units) {
			if (u.hp <= 0) {
				u.down -= dt;
				u.anim += dt;
				continue;
			}
			u.anim += dt;
			u.attackCd -= dt;
			if (u.cleaveCd > 0) u.cleaveCd = Math.max(0, u.cleaveCd - dt);
			if (u.cryCd > 0) u.cryCd = Math.max(0, u.cryCd - dt);
			if (u.waveCd > 0) u.waveCd = Math.max(0, u.waveCd - dt);
			if (u.chargeCd > 0) u.chargeCd = Math.max(0, u.chargeCd - dt);
			if (u.mendCd > 0) u.mendCd = Math.max(0, u.mendCd - dt);
			if (u.slow > 0) u.slow = Math.max(0, u.slow - dt);
			if (u.cry > 0) u.cry = Math.max(0, u.cry - dt);
			if ((u.bless || 0) > 0) u.bless = Math.max(0, u.bless - dt);
			if ((u.blessCd || 0) > 0) u.blessCd = Math.max(0, u.blessCd - dt);
			if (u.vanishCd > 0) u.vanishCd = Math.max(0, u.vanishCd - dt);
			if ((u.fallBack || 0) > 0) u.fallBack = Math.max(0, u.fallBack - dt);
			if ((u.aim || 0) > 0) u.aim = Math.max(0, u.aim - dt);
			u.hit = Math.max(0, u.hit - dt);
			if (u.order.type === "idle" && u.kind !== "villager") {
				const hall = this.buildings.find((b) => b.team === u.team && b.kind === "townhall" && b.hp > 0);
				if (hall && dist(u.x, u.y, hall.x + 1.5, hall.y + 1.5) < 7) {
					const max = this.unitMax(u.kind, u.team, u.level, this.gearOf(u).hp);
					if (u.hp < max) u.hp = Math.min(max, u.hp + 5 * dt);
				}
				if (this.rpg && u.kind === "hero" && this.buildings.some((b) => b.team === 2 && b.hp > 0 && dist(u.x, u.y, b.x + 1, b.y + 1) < 4.5)) {
					const max = this.unitMax(u.kind, u.team, u.level, this.gearOf(u).hp);
					if (u.hp < max) u.hp = Math.min(max, u.hp + 8 * dt);
				}
			}
			this.think(u, dt);
		}
		this.score.setBuilding(this.heardBuild);
		for (const s of this.shots) {
			s.t += dt;
			if (!s.done && s.t >= s.dur) {
				s.done = true;
				this.resolveShot(s);
			}
		}
		this.shots = this.shots.filter((s) => !s.done);
		for (const f of this.floaters) f.life -= dt;
		this.floaters = this.floaters.filter((f) => f.life > 0);
		this.separate();
		this.reap();
		this.welcomeVillages();
		this.rescuePass();
		this.aiT -= dt;
		if (this.aiT <= 0) {
			const pace = [1.3, .7, .45, .28][this.difficulty] ?? .7;
			this.aiT = pace;
			this.ai();
		}
		if (this.militiaCd > 0) this.militiaCd = Math.max(0, this.militiaCd - dt);
		if (this.militiaLeft > 0) {
			this.militiaLeft -= dt;
			if (this.militiaLeft <= 0) {
				this.militiaLeft = 0;
				this.recallMilitia();
				this.say("The militia returns to the hall.");
			}
		}
		this.snapT -= dt;
		if (this.snapT <= 0) {
			this.snapT = .15;
			this.emit();
		}
	}
	think(u, dt) {
		if (u.held) {
			this.thinkHeld(u, dt);
			return;
		}
		if (u.hp > 0) this.unstick(u);
		if (u.hp > 0 && this.maybeFall(u)) return;
		if (this.leadPeople(u, dt)) return;
		if (u.kind === "tamer" && u.leash != null) {
			const beast = this.nodes[u.leash];
			if (!beast || !beast.alive || beast.ally || !beast.yield) u.leash = null;
			else {
				const d = dist(u.x, u.y, beast.x + .5, beast.y + .5);
				if (d > 1.45) this.moveTo(u, beast.x + .5, beast.y + .5, dt, 1.2, null, beast);
				else {
					u.path = [];
					if (beast.x + .5 !== u.x) u.right = beast.x + .5 > u.x;
				}
				return;
			}
		}
		if (u.kind === "hero") this.autoHero(u);
		const order = u.order;
		if (order.type === "pickup") {
			const drop = this.drops.find((d) => d.id === order.dropId);
			if (!drop) {
				this.setOrder(u, { type: "idle" });
				return;
			}
			if (dist(u.x, u.y, drop.x, drop.y) > .55) {
				this.moveTo(u, drop.x, drop.y, dt, .4, null, null);
				return;
			}
			this.takeDrop(u, drop);
			this.setOrder(u, { type: "idle" });
			return;
		}
		if (order.type === "shop") {
			const b = this.building(order.buildingId);
			if (!b || b.kind !== "shop" || b.hp <= 0 || b.progress < 1) {
				u.want = null;
				this.setOrder(u, { type: "idle" });
				return;
			}
			const def = BLDS.shop;
			if (distRect(u.x, u.y, b.x, b.y, def.w, def.h) > .9) {
				this.moveTo(u, b.x + def.w / 2, b.y + def.h + .7, dt, .4, b, null);
				return;
			}
			if (u.want && SHOP_PRICE[u.want]) this.finishBuy(u, u.want);
			else this.setOrder(u, { type: "idle" });
			return;
		}
		if (this.rpg && u.team === 2 && u.kind === "villager" && order.type === "idle" && u.home) {
			u.pace = Math.max(0, (u.pace || 0) - dt);
			if (dist(u.x, u.y, u.home.x, u.home.y) > 3.4) this.setOrder(u, { type: "move", x: u.home.x, y: u.home.y });
			else if (u.pace <= 0 && Math.random() < dt * .35) {
				this.setOrder(u, { type: "move", x: u.home.x + Math.random() * 3 - 1.5, y: u.home.y + Math.random() * 3 - 1.5 });
				u.pace = 2.4;
			}
		}
		if (order.type === "idle" && !u.hold && (u.gear || []).length < this.gearSlots(u)) {
			const foe = u.kind !== "villager" ? this.nearestFoe(u.x, u.y, u.team, 3.3) : null;
			const near = foe ? null : this.nearestGear(u.x, u.y, u.kind === "hero" ? 4 : 2.4);
			if (near) {
				this.setOrder(u, { type: "pickup", dropId: near.id });
				return;
			}
		}
		if (u.kind === "villager" && u.team === this.playerTeam && order.type === "idle" && !u.held) {
			if (this.idleWork(u)) return;
		}
		if (order.type === "enter") {
			this.thinkEnter(u, dt);
			return;
		}
		if ((u.kind === "priest" || this.isDivine(u) && this.deityRole(u.team) === "heal") && u.hp > 0 && order.type === "idle") {
			const hurt = this.nearestWounded(u, (UNITS[u.kind].range || 4) + 2.5);
			if (hurt) {
				const reach = UNITS[u.kind].range;
				if (dist(u.x, u.y, hurt.x, hurt.y) <= reach) {
					if (u.attackCd <= 0) this.castHeal(u, hurt);
				} else this.moveTo(u, hurt.x, hurt.y, dt, reach, null, null);
				return;
			}
		}
		if (u.kind !== "villager" && order.type === "idle" && !(u.kind === "scout" && u.stealth) && (u.fallBack || 0) <= 0) {
			if (!(u.team === this.foeTeam() && this.mood === "passive" && !this.provoked)) {
			const look = u.hold ? 1.8 : UNITS[u.kind].ranged ? UNITS[u.kind].range + .6 : u.village ? 7 : 3.6;
			const foe = this.bestFoe(u, look);
			if (foe) {
				this.setOrder(u, {
					type: "attack",
					id: foe.id,
					building: false,
					auto: true
				});
				u.aim = .8;
				return;
			}
			}
		}
		if ((u.kind === "mage" || u.kind === "frost" || u.kind === "priest" || u.kind === "warlock") && order.type === "idle" && this.schoolDetect(u.team)) {
			const hidden = this.nearestHidden(u);
			if (hidden) {
				const d = dist(u.x, u.y, hidden.x, hidden.y);
				const enemy = u.team === this.foeTeam();
				const go = !enemy ? d <= UNITS[u.kind].range : this.mood === "aggressive" ? true : this.mood === "normal" && d <= UNITS[u.kind].range;
				if (go) {
					this.setOrder(u, { type: "attack", id: hidden.id, building: false });
					return;
				}
			}
		}
		if (order.type === "attack") {
			if (this.maybeFall(u)) return;
			const pos = this.targetPos(order.id, order.building);
			if (!pos) {
				if (order.thenBuilding && order.thenId != null) {
					const back = this.building(order.thenId);
					if (back && back.hp > 0) {
						this.setOrder(u, { type: "attack", id: back.id, building: true });
						return;
					}
				}
				if (order.thenX != null) {
					this.setOrder(u, { type: "move", x: order.thenX, y: order.thenY, attackMove: true });
					return;
				}
				if (u.kind !== "villager" && !(u.kind === "scout" && u.stealth)) {
					const next = this.bestFoe(u, UNITS[u.kind].ranged ? UNITS[u.kind].range + .8 : 5.5);
					if (next) {
						this.setOrder(u, { type: "attack", id: next.id, building: false, auto: true });
						return;
					}
				}
				this.setOrder(u, { type: "idle" });
				return;
			}
			let range = UNITS[u.kind].range * this.tilt(u.team, u.kind).range + (order.building ? .35 : 0);
			if (u.kind === "ram" && order.building) range += .4;
			if (this.isDynasty(u.team) && (u.kind === "archer" || u.kind === "crossbow")) range *= 1.15;
			const caster = u.kind === "mage" || u.kind === "frost" || u.kind === "priest" || u.kind === "warlock";
			const divine = this.isDivine(u);
			const siege = u.kind === "ram" || u.kind === "catapult" || u.kind === "ballista";
			const covenBolt = this.isCoven(u.team) && u.kind !== "villager" && !caster && !divine && !siege;
			if (covenBolt) range = Math.max(range, u.kind === "hero" || UNITS[u.kind].ranged ? 4.4 : 3.2);
			if (order.building && u.kind !== "ram" && u.kind !== "catapult") {
				const reachNow = distRect(u.x, u.y, pos.x, pos.y, pos.w, pos.h);
				const peel = this.bestFoe(u, UNITS[u.kind].ranged ? Math.max(range, 3) : 3.2);
				if (peel && (reachNow > range || dist(u.x, u.y, peel.x, peel.y) < 1.6)) {
					this.setOrder(u, { type: "attack", id: peel.id, building: false, thenX: pos.cx, thenY: pos.cy, thenId: order.id, thenBuilding: true, auto: true });
					u.aim = .7;
					return;
				}
			}
			if (!order.building && (order.auto || order.thenX != null) && (u.aim || 0) <= 0 && u.kind !== "ram") {
				const alt = this.bestFoe(u, UNITS[u.kind].ranged ? range + .4 : 3.4);
				const now = this.unit(order.id);
				if (alt && now && alt.id !== now.id) {
					const better = this.matchup(u.kind, alt.kind) > this.matchup(u.kind, now.kind) + .4;
					const closer = dist(u.x, u.y, alt.x, alt.y) + 1.2 < dist(u.x, u.y, pos.cx, pos.cy) && this.matchup(u.kind, alt.kind) >= 1;
					if (better || closer) {
						this.setOrder(u, { type: "attack", id: alt.id, building: false, thenX: order.thenX, thenY: order.thenY, thenId: order.thenId, thenBuilding: order.thenBuilding, auto: true });
						u.aim = 1;
						return;
					}
				}
				u.aim = .5;
			}
			const reach = order.building ? distRect(u.x, u.y, pos.x, pos.y, pos.w, pos.h) : dist(u.x, u.y, pos.cx, pos.cy);
			const meleeBuilding = order.building && !UNITS[u.kind].ranged;
			if (meleeBuilding) {
				const front = u.x + u.y >= pos.x + pos.y + (pos.w + pos.h) * .5;
				if (!front && this.frontOpen(pos.x, pos.y, pos.w, pos.h)) {
					const spot = this.workSpot(u, pos.x, pos.y, pos.w, pos.h);
					const spotNear = distRect(spot.x, spot.y, pos.x, pos.y, pos.w, pos.h) <= range + .25;
					if (spotNear && spot.x + spot.y >= pos.x + pos.y + (pos.w + pos.h) * .5 && dist(u.x, u.y, spot.x, spot.y) > .4) {
						this.moveTo(u, spot.x, spot.y, dt, .35, null, null);
						const stuck = !u.path.length && dist(u.x, u.y, spot.x, spot.y) > .8;
						if (!stuck) return;
					}
				}
			}
			if (reach <= range) {
				let step = null;
				if (this.wantsKite(u)) {
					const threat = this.nearestFoe(u.x, u.y, u.team, 1.65);
					if (threat && !UNITS[threat.kind].ranged && threat.kind !== "ram" && threat.kind !== "catapult" && threat.kind !== "ballista") {
						const dx = u.x - threat.x;
						const dy = u.y - threat.y;
						const len = Math.hypot(dx, dy) || 1;
						step = { x: u.x + dx / len * 1.6, y: u.y + dy / len * 1.6 };
					}
				}
				if (!step) u.path = [];
				if (pos.cx !== u.x) u.right = pos.cx > u.x;
				if (u.attackCd <= 0) {
					u.attackCd = UNITS[u.kind].cd;
					let dmg = this.weapon(u);
					if (u.kind === "scout") {
						const fromStealth = !!(u.ambush || u.stealth);
						dmg = this.weapon(u) * (fromStealth ? 5 : 1);
						if (fromStealth) {
							u.ambush = false;
							u.stealth = false;
							u.vanished = false;
						}
					}
					const prey = order.building ? this.building(order.id) : this.unit(order.id);
					const was = prey?.hp ?? 0;
					if (caster) {
						this.castSpell(u, pos, order);
					} else if (divine) {
						this.castDivine(u, pos, order);
					} else if (siege) {
						if (order.building) dmg *= u.kind === "ballista" ? 1.35 : 2.6;
						else if (u.kind === "ram") dmg *= 0.4;
						else if (u.kind === "catapult") dmg *= 0.65;
						if (UNITS[u.kind].ranged) {
							const bolt = this.isCoven(u.team) ? "arcane" : u.kind === "catapult" ? "rock" : "";
							this.shoot(u.x, u.y, pos.cx, pos.cy, dmg, u.team, order.id, order.building, false, bolt, u.id);
						} else {
							this.hurt(order.id, order.building, dmg, u.team, this.isCoven(u.team), u.kind);
							u.hit = .15;
							this.grantXp(u, was > 0 && prey && prey.hp <= 0 ? 10 : 2);
						}
					} else if (covenBolt) {
						const bolt = u.kind === "hero" ? "lightning" : u.kind === "scout" ? "frost" : "arcane";
						this.shoot(u.x, u.y, pos.cx, pos.cy, dmg, u.team, order.id, order.building, false, bolt, u.id);
					} else if (UNITS[u.kind].ranged) {
						this.shoot(u.x, u.y, pos.cx, pos.cy, dmg, u.team, order.id, order.building, false, "", u.id);
					} else {
						if (u.kind === "hero" && !order.building && this.levelOf(u) >= 5 && prey && prey.hp <= this.unitMax(prey.kind, prey.team, prey.level, this.gearOf(prey).hp) * .35) dmg *= 1.7;
						this.hurt(order.id, order.building, dmg, u.team, false, u.kind);
						u.hit = .15;
						if ((u.kind === "club" || u.kind === "warrior" || u.kind === "sword" || u.kind === "guard" || u.kind === "cavalry" || u.kind === "knight" || u.kind === "halberd") && this.onScreen(u.x, u.y)) this.score.clank();
						this.grantXp(u, was > 0 && prey && prey.hp <= 0 ? 10 : 2);
					}
				}
				if (step) this.moveTo(u, step.x, step.y, dt, .15, null, null);
				return;
			}
			this.moveTo(u, pos.cx, pos.cy, dt, range, order.building ? this.building(order.id) ?? null : null, null);
			return;
		}
		if (order.type === "gather") {
			const node = this.nodes[order.nodeId];
			if (!node || node.amount <= 0) {
				if (u.carry > .4) {
					this.setOrder(u, { type: "drop", resume: -1 });
					return;
				}
				const kind = node?.kind;
				if (kind) {
					const near = this.nearestSame(kind, u.x, u.y, 7);
					if (near) {
						this.setOrder(u, { type: "gather", nodeId: near.id });
						return;
					}
				}
				this.setOrder(u, { type: "idle" });
				return;
			}
			if (u.carry >= CARRY) {
				this.setOrder(u, { type: "drop", resume: node.id });
				return;
			}
			if (node.ally) {
				this.setOrder(u, { type: "idle" });
				return;
			}
			const spot = this.spotForNode(u, node);
			const box = this.nodeBox(node);
			const close = distRect(u.x, u.y, box.x, box.y, box.w, box.h) <= 1.15;
			if (!this.workingFront(u, box.x, box.y, box.w, box.h)) {
				const boxed = close && !this.frontOpen(box.x, box.y, box.w, box.h);
				if (!boxed) {
					this.moveTo(u, spot.x, spot.y, dt, .35, null, node);
					const stuck = close && !u.path.length && dist(u.x, u.y, spot.x, spot.y) > .55;
					if (!stuck) return;
				}
			}
			u.path = [];
			const face = node.kind === "gold" || node.kind === "stone" ? node.x + 1 : node.x + .5;
			if (face !== u.x) u.right = face > u.x;
			if ((node.kind === "sheep" || node.kind === "nest" || node.kind === "cart" || beastOf(node.kind)) && node.alive) {
				if (u.attackCd <= 0) {
					const hit = (UNITS[u.kind].dmg * this.levelDmg(u) * this.tilt(u.team, u.kind).dmg + this.gearOf(u).dmg) * this.dmgMul(u.team);
					node.hp -= hit;
					this.floaters.push({
						x: node.x + .5,
						y: node.y + .4,
						text: String(Math.max(1, Math.round(hit))),
						life: .7,
						max: .7,
						dmg: true
					});
					u.attackCd = UNITS[u.kind].cd;
					if (node.kind === "sheep") this.spook(node, u);
					u.repath = 0;
					if (node.hp <= 0) {
						if (this.offerYield(node, u)) return;
						node.alive = false;
						node.hp = 0;
						if (u.team === this.playerTeam) this.noteDare("hunt");
						this.grantXp(u, node.kind === "nest" ? 14 : node.kind === "cart" ? 8 : BOSSES[node.kind] ? 30 : beastOf(node.kind) ? 12 : 6);
						this.payHunt(node, u);
						if (node.kind === "nest" || node.kind === "cart") {
							node.amount = 0;
							if (node.kind === "nest") this.dropItem(node.x + .5, node.y + .5, Math.random() < .35 ? "shield" : "blade");
							if (node.kind === "cart") {
								const gold = 70 + Math.floor(Math.random() * 50);
								this.stock[u.team].gold += gold;
								this.floaters.push({ x: node.x + .5, y: node.y, text: `+${gold} gold`, life: 1.3, max: 1.3, gold: true });
								if (u.team === this.playerTeam) {
									this.fury = Math.max(this.fury, 8);
									if (Math.random() < .45) this.dropItem(node.x + .5, node.y + .4, ["boots", "cloak", "blade"][Math.random() * 3 | 0]);
									this.say("The treasure is yours.");
								} else if (this.toastT <= 0) this.say("They caught the treasure cart.");
							}
						} else if (LOOT[node.kind]) this.spillLoot(node.kind, node.x + .5, node.y + .5, u);
					} else this.grantXp(u, 1);
				}
				return;
			}
			if (!node.alive && (node.kind === "sheep" || beastOf(node.kind)) && u.kind !== "villager") {
				this.setOrder(u, { type: "idle" });
				return;
			}
			const g = GATHER[node.kind];
			const rate = g.rate * (this.age[u.team] >= 1 ? 1.15 : 1) * this.gatherMul(u.team, node.kind) * this.levelWork(u) * this.gearOf(u).work * (this.isDynasty(u.team) && u.kind === "villager" ? 1.1 : 1) * (this.isEgypt(u.team) && u.kind === "villager" && node.kind === "gold" ? 1.18 : 1);
			const take = Math.min(rate * dt, node.amount, CARRY - u.carry);
			const before = node.amount;
			node.amount -= take;
			u.carry += take;
			u.carryKind = g.res;
			if (u.team === this.playerTeam && node.kind === "tree" && before > 0 && node.amount <= 0) {
				this.noteDare("tree");
				if (Math.random() < .2) {
					this.stock[u.team].gold += 12;
					this.floaters.push({ x: u.x, y: u.y, text: "+12 gold", life: 1, max: 1, gold: true });
				}
			}
			if (node.kind === "tree" || node.kind === "gold" || node.kind === "stone") {
				const pick = node.kind !== "tree";
				const fighter = u.kind === "club" || u.kind === "warrior" || u.kind === "sword" || u.kind === "guard" || u.kind === "cavalry" || u.kind === "knight";
				const here = this.onScreen(u.x, u.y) || this.onScreen(node.x + 0.5, node.y + 0.5);
				if (u.toolNode !== node.id) {
					u.toolNode = node.id;
					if (here) {
						if (fighter && !pick) this.score.clank();
						else if (pick) this.score.pickStart();
						else this.score.axeStart();
					}
				} else if (here) {
					if (fighter && !pick) this.score.clank();
					else if (pick) this.score.pickTick();
					else this.score.axeTick();
				}
			} else if (node.kind === "fish" && this.onScreen(u.x, u.y)) this.score.splash();
			if (node.amount <= 0 && u.carry > 0) this.setOrder(u, { type: "drop", resume: -1 });
			return;
		}
				if (order.type === "drop") {
			if (u.carry <= 0 || !u.carryKind) {
				this.setOrder(u, { type: "idle" });
				return;
			}
			const drop = this.nearestDrop(u.team, u.carryKind, u.x, u.y);
			if (!drop) return;
			const def = BLDS[drop.kind];
			const spot = this.workSpot(u, drop.x, drop.y, def.w, def.h);
			const closeDrop = distRect(u.x, u.y, drop.x, drop.y, def.w, def.h) <= 1.2;
			const atSpot = dist(u.x, u.y, spot.x, spot.y) <= .48;
			if (!atSpot) {
				this.moveTo(u, spot.x, spot.y, dt, .2, null, null);
				if (!(closeDrop && !u.path.length && dist(u.x, u.y, spot.x, spot.y) > .7)) return;
			}
				const gained = Math.floor(u.carry + 1e-6);
				this.stock[u.team][u.carryKind] += u.carry;
				if (u.team === this.playerTeam && gained > 0) {
					this.floaters.push({
						x: u.x,
						y: u.y,
						text: `+${gained}`,
						life: .9,
						max: .9
					});
					this.blip(520, .04, .03, "sine");
				}
				this.grantXp(u, 3);
				const resume = order.resume;
				u.carry = 0;
				u.carryKind = null;
				const node = resume >= 0 ? this.nodes[resume] : undefined;
				if (node && node.amount > 0) this.setOrder(u, {
					type: "gather",
					nodeId: node.id
				});
				else this.setOrder(u, { type: "idle" });
				return;
		}
		if (order.type === "build") {
			const b = this.building(order.buildingId);
			if (!b || b.progress >= 1) {
				this.afterBuild(u);
				return;
			}
			const def = BLDS[b.kind];
			const spot = this.workSpot(u, b.x, b.y, def.w, def.h);
			if (dist(u.x, u.y, spot.x, spot.y) > .48) {
				this.moveTo(u, spot.x, spot.y, dt, .2, null, null);
				const close = distRect(u.x, u.y, b.x, b.y, def.w, def.h) <= 1.2;
				if (!(close && !u.path.length && dist(u.x, u.y, spot.x, spot.y) > .7)) return;
			}
			u.path = [];
			if (b.x + def.w / 2 !== u.x) u.right = b.x + def.w / 2 > u.x;
			b.progress = Math.min(1, b.progress + dt / def.time);
			if (b.progress >= 1) {
				b.hp = this.bldMax(b.kind, b.team);
				this.onBuilt(b);
				this.grantXp(u, 8);
				this.afterBuild(u);
			} else if (this.onScreen(b.x + def.w / 2, b.y + def.h / 2)) this.heardBuild = true;
			return;
		}
		if (order.type === "repair") {
			const b = this.building(order.buildingId);
			if (!b || b.team !== u.team || b.progress < 1) {
				this.setOrder(u, { type: "idle" });
				return;
			}
			const def = BLDS[b.kind];
			const max = this.bldMax(b.kind, b.team);
			if (b.hp >= max - .05) {
				b.hp = max;
				this.setOrder(u, { type: "idle" });
				return;
			}
			const spot = this.workSpot(u, b.x, b.y, def.w, def.h);
			if (dist(u.x, u.y, spot.x, spot.y) > .48) {
				this.moveTo(u, spot.x, spot.y, dt, .2, null, null);
				const close = distRect(u.x, u.y, b.x, b.y, def.w, def.h) <= 1.2;
				if (!(close && !u.path.length && dist(u.x, u.y, spot.x, spot.y) > .7)) return;
			}
			u.path = [];
			if (b.x + def.w / 2 !== u.x) u.right = b.x + def.w / 2 > u.x;
			const heal = Math.min(max / def.time * dt, max - b.hp);
			const cost = this.scaledCost(def.cost, heal / def.hp * .22);
			if (!this.canAfford(u.team, cost)) {
				if (u.team === this.playerTeam && this.toastT <= 0) this.say("Need supplies to repair.");
				return;
			}
			this.spend(u.team, cost);
			b.hp += heal;
			return;
		}
		if (order.type === "rally") {
			if (dist(u.x, u.y, order.x, order.y) > .55) {
				this.moveTo(u, order.x, order.y, dt, .3, null, null);
				return;
			}
			u.path = [];
			this.finishRally(u, order.x, order.y);
			return;
		}
		if (order.type === "move") {
			if (this.maybeFall(u)) return;
			if (order.attackMove && u.kind !== "villager" && u.kind !== "ram" && !(u.kind === "scout" && u.stealth)) {
				const look = u.hold ? 1.8 : UNITS[u.kind].ranged ? UNITS[u.kind].range + .5 : 4.2;
				const foe = this.bestFoe(u, look);
				if (foe) {
					this.setOrder(u, {
						type: "attack",
						id: foe.id,
						building: false,
						thenX: order.x,
						thenY: order.y,
						auto: true
					});
					u.aim = .8;
					return;
				}
			}
			let arrived = dist(u.x, u.y, order.x, order.y) < .55;
			if (!arrived) {
				this.moveTo(u, order.x, order.y, dt, .2, null, null);
				const left = dist(u.x, u.y, order.x, order.y);
				arrived = !this.canStand(order.x, order.y) && left < 3.2 && u.repath > 0 && u.pathI >= u.path.length;
			}
			if (arrived) {
				if (u.team === this.foeTeam() && u.kind !== "villager") {
					const eb = this.nearestEnemyBuilding(u.x, u.y, u.team, 3.6);
					if (eb) {
						this.setOrder(u, { type: "attack", id: eb.id, building: true });
						return;
					}
				}
				this.setOrder(u, { type: "idle" });
			}
		}
	}

	scaledCost(base, scale) {
		const cost = {};
		for (const k of ["food", "wood", "gold", "stone"]) {
			const v = (base[k] ?? 0) * scale;
			if (v > .0001) cost[k] = v;
		}
		return cost;
	}
	nearestSame(kind, x, y, r) {
		let best = null;
		let bestD = r;
		for (const n of this.nodes) {
			if (n.kind !== kind || n.amount <= 0) continue;
			const d = dist(x, y, n.x + .5, n.y + .5);
			if (d < bestD) {
				bestD = d;
				best = n;
			}
		}
		return best;
	}
	nodeBox(node) {
		if (node.buildingId >= 0) {
			const b = this.building(node.buildingId);
			if (b) {
				const d = BLDS[b.kind];
				return { x: b.x, y: b.y, w: d.w, h: d.h };
			}
		}
		const wide = node.kind === "gold" || node.kind === "stone" ? 2 : 1;
		return { x: node.x, y: node.y, w: wide, h: wide };
	}
	workingFront(u, x, y, w, h) {
		if (u.x + u.y < x + y + (w + h) * .5) return false;
		return distRect(u.x, u.y, x, y, w, h) <= 2.3;
	}
	frontOpen(x, y, w, h) {
		const need = x + y + (w + h) * .5 - .2;
		for (let ty = y - 1; ty <= y + h; ty++) {
			for (let tx = x - 1; tx <= x + w; tx++) {
				if (tx >= x && tx < x + w && ty >= y && ty < y + h) continue;
				if (!this.walkable(tx, ty)) continue;
				if (tx + .5 + ty + .5 >= need) return true;
			}
		}
		return false;
	}
	spotForNode(u, node) {
		if (node.buildingId >= 0) {
			const b = this.building(node.buildingId);
			if (b) {
				const d = BLDS[b.kind];
				return this.workSpot(u, b.x, b.y, d.w, d.h);
			}
		}
		const wide = node.kind === "gold" || node.kind === "stone" ? 2 : 1;
		return this.workSpot(u, node.x, node.y, wide, wide);
	}
	workSpot(u, x, y, w, h) {
		const east = u.id % 2 === 1;
		const slide = (u.id % 3 - 1) * .16;
		const south = { x: x + w - .42 + slide, y: y + h + .58 };
		const side = { x: x + w + .58, y: y + h - .42 + slide };
		const list = east ? [side, south] : [south, side];
		for (let i = 0; i < w + h; i++) {
			list.push({ x: x + w - .15 - i * .7, y: y + h + .58 });
			list.push({ x: x + w + .58, y: y + h - .15 - i * .7 });
		}
		for (const c of list) if (this.standOk(c, x, y, w, h)) return c;
		let best = null;
		let bestS = -1;
		for (let ty = y - 1; ty <= y + h; ty++) {
			for (let tx = x - 1; tx <= x + w; tx++) {
				if (tx >= x && tx < x + w && ty >= y && ty < y + h) continue;
				if (!this.walkable(tx, ty)) continue;
				const s = tx + ty;
				if (s <= bestS) continue;
				bestS = s;
				best = { x: tx + .5, y: ty + .5 };
			}
		}
		return best ?? (east ? side : south);
	}
	standOk(c, x, y, w, h) {
		const tx = Math.floor(c.x);
		const ty = Math.floor(c.y);
		if (!this.walkable(tx, ty)) return false;
		if (tx >= x && tx < x + w && ty >= y && ty < y + h) return false;
		return c.x + c.y >= x + y + w + h - .2;
	}
	nodeNear(x, y) {
		let best = null;
		let bestD = 1.2;
		for (const n of this.nodes) {
			if (n.amount <= 0 || n.kind === "den") continue;
			const box = this.nodeBox(n);
			const d = distRect(x, y, box.x, box.y, box.w, box.h);
			if (d < bestD) {
				bestD = d;
				best = n;
			}
		}
		return best;
	}
	nearestEnemyBuilding(x, y, team, range) {
		let best = null;
		let bestD = range;
		for (const b of this.buildings) {
			if (b.team === team || b.team === 2 || b.hp <= 0) continue;
			const d = BLDS[b.kind];
			const distB = distRect(x, y, b.x, b.y, d.w, d.h);
			if (distB < bestD) {
				bestD = distB;
				best = b;
			}
		}
		return best;
	}
	finishRally(u, x, y) {
		if (u.kind === "villager") {
			const node = this.nodeNear(x, y);
			if (node && node.kind !== "farm") {
				this.setOrder(u, { type: "gather", nodeId: node.id });
				return;
			}
			let site = null;
			let siteD = 0.85;
			for (const b of this.buildings) {
				if (b.hp <= 0 || b.team !== u.team) continue;
				const d = BLDS[b.kind];
				const near = distRect(x, y, b.x, b.y, d.w, d.h);
				if (near < siteD) {
					siteD = near;
					site = b;
				}
			}
			if (site) {
				if (site.progress < 1) {
					this.setOrder(u, { type: "build", buildingId: site.id });
					return;
				}
				if (site.hp < this.bldMax(site.kind, site.team) - .5) {
					this.setOrder(u, { type: "repair", buildingId: site.id });
					return;
				}
				if (site.kind === "farm" || node?.kind === "farm") {
					const crop = this.nodes.find((n) => n.buildingId === site.id && n.amount > 0) ?? (node?.kind === "farm" ? node : null);
					if (crop) {
						this.setOrder(u, { type: "gather", nodeId: crop.id });
						return;
					}
				}
			}
			if (node) {
				this.setOrder(u, { type: "gather", nodeId: node.id });
				return;
			}
			this.setOrder(u, { type: "idle" });
			return;
		}
		const foe = this.nearestFoe(x, y, u.team, 3.4);
		if (foe) {
			this.setOrder(u, { type: "attack", id: foe.id, building: false });
			return;
		}
		const eb = this.nearestEnemyBuilding(x, y, u.team, 3.4);
		if (eb) {
			this.setOrder(u, { type: "attack", id: eb.id, building: true });
			return;
		}
		this.setOrder(u, { type: "idle" });
	}
	jobLabel(u) {
		if (u.order.type !== "gather") return "Gathering";
		const n = this.nodes[u.order.nodeId];
		if (!n) return "Gathering";
		if ((n.kind === "sheep" || n.kind === "nest" || n.kind === "cart" || beastOf(n.kind)) && n.alive) return n.kind === "nest" ? "Clearing a nest" : n.kind === "cart" ? "Chasing the cart" : BOSSES[n.kind] ? `Fighting ${BOSSES[n.kind].name}` : n.rare ? `Hunting a rare ${MONSTERS[n.kind]?.name || "beast"}` : "Hunting";
		if (n.kind === "sheep" || beastOf(n.kind)) return "Harvesting";
		if (n.kind === "fish") return "Fishing";
		if (n.kind === "berry") return "Picking berries";
		if (n.kind === "tree") return "Chopping";
		if (n.kind === "farm") return "Farming";
		if (n.kind === "gold" || n.kind === "stone") return "Mining";
		return "Gathering";
	}
	inGatherRange(u, node) {
		if (node.buildingId >= 0) {
			const b = this.building(node.buildingId);
			if (!b) return false;
			const d = BLDS[b.kind];
			return distRect(u.x, u.y, b.x, b.y, d.w, d.h) <= 1.2;
		}
		return dist(u.x, u.y, node.x + .5, node.y + .5) <= 1.35;
	}
	afterBuild(u) {
		const resume = u.order.type === "build" ? u.order.resume ?? -1 : -1;
		let next = null;
		let bestD = 1e9;
		for (const b of this.buildings) {
			if (b.team !== u.team || b.hp <= 0 || b.progress >= 1) continue;
			const d = dist(u.x, u.y, b.x + BLDS[b.kind].w / 2, b.y + BLDS[b.kind].h / 2);
			if (d < bestD) {
				bestD = d;
				next = b;
			}
		}
		if (next) {
			this.setOrder(u, { type: "build", buildingId: next.id, resume });
			return;
		}
		const node = resume >= 0 ? this.nodes[resume] : undefined;
		if (node && node.amount > 0) this.setOrder(u, { type: "gather", nodeId: node.id });
		else this.setOrder(u, { type: "idle" });
	}
	onBuilt(b) {
		if (b.kind === "smith") this.grantSmith(b.team);
		if (b.kind === "husbandry") this.grantHusbandry(b.team);
		if (b.kind === "barracks" || b.kind === "range" || b.kind === "stable") this.grantWard(b.team);
		if (b.kind === "farm") {
			const id = this.nodes.length;
			const food = Math.max(1, Math.round(240 * this.rich));
			this.nodes.push({
				id,
				kind: "farm",
				x: b.x,
				y: b.y,
				amount: food,
				max: food,
				buildingId: b.id,
				hp: 0,
				alive: false
			});
		}
		if (b.team === this.playerTeam) {
			this.say(`${BLDS[b.kind].name} complete.`);
			this.noteDare("build");
			this.blip(480, .08, .05);
			this.blip(720, .1, .04);
		}
	}
	nearestDrop(team, kind, x, y) {
		let best = null;
		let bestD = 1e9;
		for (const b of this.buildings) {
			if (b.team !== team || b.hp <= 0 || b.progress < 1) continue;
			const ok = b.kind === "townhall" || b.kind === "dump";
			if (!ok) continue;
			const d = dist(x, y, b.x + BLDS[b.kind].w / 2, b.y + BLDS[b.kind].h / 2);
			if (d < bestD) {
				bestD = d;
				best = b;
			}
		}
		return best;
	}
	bestFoe(u, range) {
		if (!u || u.kind === "ram" || u.kind === "catapult") return null;
		let best = null;
		let bestS = -1e9;
		for (const foe of this.units) {
			if (foe.team === u.team || foe.team === 2 || foe.captive || foe.hp <= 0 || foe.held) continue;
			if (foe.kind === "scout" && foe.stealth && foe.order.type !== "attack") continue;
			const d = dist(u.x, u.y, foe.x, foe.y);
			if (d > range) continue;
			const max = this.unitMax(foe.kind, foe.team, foe.level, this.gearOf(foe).hp) || 1;
			let score = this.matchup(u.kind, foe.kind) * 8 - d + (1 - foe.hp / max) * 3;
			if (this.units.some((a) => a !== u && a.team === u.team && a.hp > 0 && a.order?.type === "attack" && !a.order.building && a.order.id === foe.id)) score += 2.5;
			if (score > bestS) {
				bestS = score;
				best = foe;
			}
		}
		return best;
	}
	wantsKite(u) {
		return u.kind === "archer" || u.kind === "crossbow" || u.kind === "mage" || u.kind === "frost" || u.kind === "priest" || u.kind === "warlock";
	}
	maybeFall(u) {
		if (u.team !== this.foeTeam() || u.kind === "villager" || u.kind === "ram" || u.kind === "hero" || u.kind === "god") return false;
		if ((u.fallBack || 0) > 0) return false;
		const max = this.unitMax(u.kind, u.team, u.level, this.gearOf(u).hp);
		if (!(max > 0) || u.hp > max * .28) return false;
		if (!this.nearestFoe(u.x, u.y, u.team, 4.5)) return false;
		const hall = this.buildings.find((b) => b.team === u.team && b.kind === "townhall" && b.hp > 0);
		if (!hall) return false;
		u.fallBack = 6;
		this.setOrder(u, { type: "move", x: hall.x + BLDS.townhall.w / 2, y: hall.y + BLDS.townhall.h / 2, attackMove: false });
		return true;
	}
	nearestFoe(x, y, team, range, seeScout = false) {
		let best = null;
		let bestD = range;
		for (const u of this.units) {
			if (u.team === team || u.team === 2 || u.captive || u.hp <= 0 || u.held) continue;
			if (u.kind === "scout" && u.stealth && u.order.type !== "attack") {
				if (!seeScout) continue;
				if (u.vanished && team === this.foeTeam() && this.mood === "passive") continue;
			}
			const d = dist(x, y, u.x, u.y);
			if (d < bestD) {
				bestD = d;
				best = u;
			}
		}
		return best;
	}
	targetPos(id, building) {
		if (building) {
			const b = this.building(id);
			if (!b) return null;
			const d = BLDS[b.kind];
			return {
				x: b.x,
				y: b.y,
				w: d.w,
				h: d.h,
				cx: b.x + d.w / 2,
				cy: b.y + d.h / 2
			};
		}
		const u = this.unit(id);
		if (!u) return null;
		return {
			x: u.x,
			y: u.y,
			w: 0,
			h: 0,
			cx: u.x,
			cy: u.y
		};
	}
	castSpell(u, pos, order) {
		if (u.kind === "priest") {
			const hurt = this.nearestWounded(u, UNITS.priest.range);
			if (hurt) {
				this.castHeal(u, hurt);
				return;
			}
		}
		const focus = this.schoolFocus(u.team) ? 1.4 : 1;
		const dread = (u.dread || 0) > 0 ? .78 : 1;
		const power = (n) => (n * this.levelDmg(u) * this.tilt(u.team, u.kind).dmg + this.gearOf(u).dmg) * focus * dread;
		if (u.kind === "frost") {
			this.shoot(u.x, u.y, pos.cx, pos.cy, power(7), u.team, order.id, order.building, false, "frost", u.id);
			return;
		}
		if (u.kind === "warlock") {
			this.shoot(u.x, u.y, pos.cx, pos.cy, power(16), u.team, order.id, order.building, false, "shadow", u.id);
			return;
		}
		if (u.kind === "priest") {
			this.shoot(u.x, u.y, pos.cx, pos.cy, power(6), u.team, order.id, order.building, false, "holy", u.id);
			return;
		}
		const lore = this.schoolLore(u.team);
		const fire = !lore || !u.spell;
		u.spell = lore && fire ? 1 : 0;
		u.attackCd = lore ? 1 : 2;
		this.shoot(u.x, u.y, pos.cx, pos.cy, power(fire ? 8 : 14), u.team, order.id, order.building, false, fire ? "fire" : "lightning", u.id);
		if (!fire && this.onScreen(u.x, u.y)) this.score.lightning();
	}
	isDivine(u) {
		return u?.kind === "demigod" || u?.kind === "avatar" || u?.kind === "god";
	}
	castDivine(u, pos, order) {
		const role = this.deityRole(u.team);
		const tier = u.kind === "god" ? 3 : u.kind === "avatar" ? 2 : 1;
		if (role === "heal") {
			const hurt = this.nearestWounded(u, UNITS[u.kind].range);
			if (hurt) {
				this.castHeal(u, hurt);
				return;
			}
			this.shoot(u.x, u.y, pos.cx, pos.cy, this.weapon(u) * (0.7 + tier * 0.2), u.team, order.id, order.building, false, "holy", u.id);
			return;
		}
		if (role === "bless") {
			this.blessNear(u, tier);
			this.shoot(u.x, u.y, pos.cx, pos.cy, this.weapon(u) * 0.65, u.team, order.id, order.building, false, "holy", u.id);
			return;
		}
		if (role === "omen") {
			this.shoot(u.x, u.y, pos.cx, pos.cy, this.weapon(u) * (0.9 + tier * 0.25), u.team, order.id, order.building, false, "arcane", u.id);
			return;
		}
		this.shoot(u.x, u.y, pos.cx, pos.cy, this.weapon(u) * (0.85 + tier * 0.2), u.team, order.id, order.building, false, "curse", u.id);
	}
	blessNear(u, tier) {
		if ((u.blessCd || 0) > 0) return;
		u.blessCd = u.kind === "god" ? 5 : 7;
		const rad = 2.4 + tier * 0.7;
		for (const o of this.units) {
			if (o.team !== u.team || o.hp <= 0) continue;
			if (dist(o.x, o.y, u.x, u.y) > rad) continue;
			o.bless = Math.max(o.bless || 0, 2.5 + tier);
		}
	}
	castHeal(u, ally) {
		const tier = u.kind === "god" ? 2.6 : u.kind === "avatar" ? 1.7 : u.kind === "demigod" ? 1.15 : 1;
		const heal = Math.max(6, Math.round((12 + this.gearOf(u).dmg) * this.levelDmg(u) * tier));
		const max = this.unitMax(ally.kind, ally.team, ally.level, this.gearOf(ally).hp);
		ally.hp = Math.min(max, ally.hp + heal);
		u.attackCd = UNITS.priest.cd;
		this.shoot(u.x, u.y, ally.x, ally.y, 0, u.team, ally.id, false, false, "heal", u.id);
		this.floaters.push({ x: ally.x, y: ally.y, text: `+${heal}`, life: .8, max: .8, gold: true });
	}
	nearestWounded(u, range) {
		let best = null;
		let bestD = range;
		for (const o of this.units) {
			if (o.team !== u.team || o.id === u.id || o.hp <= 0 || o.held) continue;
			const max = this.unitMax(o.kind, o.team, o.level, this.gearOf(o).hp);
			if (o.hp >= max - .5) continue;
			const d = dist(o.x, o.y, u.x, u.y);
			if (d < bestD) {
				bestD = d;
				best = o;
			}
		}
		return best;
	}
	shoot(x, y, tx, ty, dmg, team, hitId, hitBuilding, arrow = false, bolt = "", owner = 0) {
		const dur = Math.max(.12, dist(x, y, tx, ty) / (bolt === "lightning" ? 14 : 9));
		this.shots.push({
			x,
			y,
			tx,
			ty,
			t: 0,
			dur,
			dmg,
			team,
			hitId,
			hitBuilding,
			done: false,
			arrow: arrow && !bolt,
			bolt,
			high: false,
			owner
		});
		return this.shots[this.shots.length - 1];
	}
	hasSchool(team) {
		return this.buildings.some((b) => b.team === team && b.kind === "school" && b.hp > 0 && b.progress >= 1);
	}
	schoolLore(team) {
		return this.buildings.some((b) => b.team === team && b.kind === "school" && b.hp > 0 && b.progress >= 1 && b.lore);
	}
	schoolDetect(team) {
		return this.buildings.some((b) => b.team === team && b.kind === "school" && b.hp > 0 && b.progress >= 1 && b.detect);
	}
	schoolFocus(team) {
		return this.buildings.some((b) => b.team === team && b.kind === "school" && b.hp > 0 && b.progress >= 1 && b.focus);
	}
	hasRampart(team) {
		return this.techRank(team, "rampart") > 0;
	}
	mageHalf() {
		return 2.5 * this.mapScale();
	}
	nearestHidden(mage) {
		const r = this.mageHalf();
		let best = null;
		let bestD = r;
		for (const u of this.units) {
			if (u.team === mage.team || u.hp <= 0 || u.held) continue;
			if (u.kind !== "scout" || !u.stealth || u.order.type === "attack") continue;
			const d = dist(mage.x, mage.y, u.x, u.y);
			if (d <= bestD) {
				bestD = d;
				best = u;
			}
		}
		return best;
	}
	techRank(team, key) {
		return this.tech[team]?.[key] ?? 0;
	}
	techCap(team, home) {
		if (!this.built(team, home)) return 0;
		const need = home === "smith" ? 1 : 2;
		return 1 + Math.max(0, this.age[team] - need);
	}
	bldHpMul(team) {
		return 1 + .2 * this.techRank(team, "structure");
	}
	unitHpMul(team) {
		return 1 + .2 * this.techRank(team, "fortitude");
	}
	bldMax(kind, team) {
		const hold = (kind === "townhall" || kind === "tower" || kind === "keep") && this.hasRampart(team) ? 1.2 : 1;
		return BLDS[kind].hp * this.bldHpMul(team) * hold;
	}
	unitMax(kind, team, level = 1, bonusHp = 0) {
		const per = kind === "hero" ? .16 : .12;
		return UNITS[kind].hp * this.unitHpMul(team) * this.tilt(team, kind).hp * (1 + per * (this.levelOf({ kind, level }) - 1)) + bonusHp;
	}
	levelCap(u) {
		return this.rpg && u?.kind === "hero" ? 20 : 6;
	}
	levelOf(u) {
		return Math.max(1, Math.min(this.levelCap(u), u?.level || 1));
	}
	levelDmg(u) {
		let m = 1 + (u?.kind === "hero" ? .18 : .15) * (this.levelOf(u) - 1);
		if (this.nearCry(u)) m *= 1.25;
		if (u?.team === this.playerTeam && this.fury > 0) m *= 1.3;
		return m;
	}
	nearCry(u) {
		if (!u) return false;
		return this.units.some((h) => h.kind === "hero" && h.team === u.team && h.hp > 0 && (h.cry || 0) > 0 && dist(h.x, h.y, u.x, u.y) < 4.2);
	}
	levelWork(u) {
		return 1 + .1 * (this.levelOf(u) - 1);
	}
	xpNext(u) {
		const lv = this.levelOf(u);
		if (lv >= this.levelCap(u)) return 0;
		return XP_NEED[lv] || 0;
	}
	grantXp(u, n) {
		if (!u || u.hp <= 0 || n <= 0 || this.levelOf(u) >= this.levelCap(u)) return;
		u.xp = (u.xp || 0) + (u.kind === "hero" ? Math.ceil(n * (this.rpg ? 2.4 : 1.6)) : n);
		u.level = this.levelOf(u);
		while (u.level < this.levelCap(u) && u.xp >= XP_NEED[u.level]) {
			u.level += 1;
			const prev = this.unitMax(u.kind, u.team, u.level - 1, this.gearOf(u).hp);
			const max = this.unitMax(u.kind, u.team, u.level, this.gearOf(u).hp);
			u.hp = Math.min(max, u.hp + Math.max(0, max - prev));
			this.floaters.push({
				x: u.x,
				y: u.y,
				text: `Level ${u.level}`,
				life: 1.3,
				max: 1.3,
				gold: true
			});
			if (u.kind === "hero" && u.team === this.playerTeam && (u.level === 5 || u.level === 10 || u.level === 15 || u.level === 20)) {
				u.hp = max;
				const gold = 20 * u.level;
				this.stock[this.playerTeam].gold += gold;
				if (u.level === 10 || u.level === 20) this.dropItem(u.x, u.y, u.level === 20 ? "crown" : "mail");
				this.say(`Level ${u.level}. Fully healed. +${gold} gold.${u.level === 5 ? " Execute is ready." : ""}`);
			} else if (u.team === this.playerTeam && this.toastT <= 0) {
				const extra = u.kind === "hero" && u.level === 3 ? " Mend is ready." : u.kind === "hero" && u.level === 5 ? " Execute is ready." : "";
				this.say(`${this.unitName(u.team, u.kind)} reached level ${u.level}.${extra}`);
			}
			this.blip(740, .07, .04);
		}
	}
	dmgMul(team) {
		return 1 + .2 * this.techRank(team, "weaponry");
	}
	siegeMul(team) {
		return 1 + .15 * this.techRank(team, "siege");
	}
	gatherMul(team, kind) {
		if (kind === "gold" || kind === "stone") return 1 + .2 * this.techRank(team, "economy");
		return 1 + .2 * this.techRank(team, "efficiency");
	}
	scaleBuildings(team, from, to) {
		const k = (1 + .2 * to) / (1 + .2 * from);
		for (const b of this.buildings) if (b.team === team && b.hp > 0) b.hp *= k;
	}
	scaleUnits(team, from, to) {
		const k = (1 + .2 * to) / (1 + .2 * from);
		for (const u of this.units) if (u.team === team && u.hp > 0) u.hp *= k;
	}
	grantSmith(team) {
		const was = this.techRank(team, "structure");
		for (const key of ["structure", "weaponry", "siege"]) if (this.tech[team][key] < 1) this.tech[team][key] = 1;
		if (was < 1) this.scaleBuildings(team, 0, 1);
	}
	grantHusbandry(team) {
		const was = this.techRank(team, "fortitude");
		for (const key of ["fortitude", "efficiency", "economy"]) if (this.tech[team][key] < 1) this.tech[team][key] = 1;
		if (was < 1) this.scaleUnits(team, 0, 1);
	}
	grantWard(team) {
		if (this.techRank(team, "ward") < 1) this.tech[team].ward = 1;
	}
	wardCap(team) {
		const armed = this.built(team, "barracks") || this.built(team, "range") || this.built(team, "stable");
		return armed ? 1 + (this.age[team] || 0) : 0;
	}
	raiseWard() {
		const team = this.playerTeam;
		const cap = this.wardCap(team);
		const now = this.techRank(team, "ward");
		if (!cap) return;
		if (now >= cap) {
			this.say(this.age[team] >= 4 ? "Magic shield is as high as it goes." : "Advance the age for the next rank.");
			return;
		}
		this.tech[team].ward = now + 1;
		this.say(`Magic shield is rank ${now + 1}.`);
		this.blip(480, .06, .04);
		this.emit();
	}
	raiseTech(key) {
		const home = key === "structure" || key === "weaponry" || key === "siege" ? "smith" : "husbandry";
		const team = this.playerTeam;
		if (!this.built(team, home)) return;
		const cap = this.techCap(team, home);
		const now = this.techRank(team, key);
		if (now >= cap) {
			this.say(this.age[team] >= 4 ? "That rank is as high as it goes." : "Advance the age for the next rank.");
			return;
		}
		this.tech[team][key] = now + 1;
		if (key === "structure") this.scaleBuildings(team, now, now + 1);
		if (key === "fortitude") this.scaleUnits(team, now, now + 1);
		this.say(`${key[0].toUpperCase()}${key.slice(1)} is rank ${now + 1}.`);
		this.blip(480, .06, .04);
		this.emit();
	}
	upgradeSchool() {
		const b = this.selectedBuilding != null ? this.building(this.selectedBuilding) : null;
		if (!b || b.kind !== "school" || b.team !== this.playerTeam || b.progress < 1) return;
		if (b.lore) {
			this.say("Lightning bolt is already known.");
			return;
		}
		if (!this.spend(this.playerTeam, { gold: 200 })) {
			this.say("Need 200 gold.");
			return;
		}
		b.lore = true;
		this.say("Lightning bolt learned.");
		this.blip(220, .1, .05);
		this.emit();
	}
	upgradeDetect() {
		const b = this.selectedBuilding != null ? this.building(this.selectedBuilding) : null;
		if (!b || b.kind !== "school" || b.team !== this.playerTeam || b.progress < 1) return;
		if (b.detect) {
			this.say("Detection is already known.");
			return;
		}
		if (!this.spend(this.playerTeam, { gold: 200 })) {
			this.say("Need 200 gold.");
			return;
		}
		b.detect = true;
		this.say("Detection learned. Mages can sense hidden foes.");
		this.blip(180, .1, .04);
		this.emit();
	}
	upgradeFocus() {
		const b = this.selectedBuilding != null ? this.building(this.selectedBuilding) : null;
		if (!b || b.kind !== "school" || b.team !== this.playerTeam || b.progress < 1) return;
		if (b.focus) {
			this.say("Focus is already known.");
			return;
		}
		if (!this.spend(this.playerTeam, { gold: 250 })) {
			this.say("Need 250 gold.");
			return;
		}
		b.focus = true;
		this.say("Focus learned. Mage bolts hit harder.");
		this.blip(240, .1, .05);
		this.emit();
	}
	upgradeRampart() {
		const b = this.selectedBuilding != null ? this.building(this.selectedBuilding) : null;
		if (!b || b.kind !== "keep" || b.team !== this.playerTeam || b.progress < 1) return;
		if (this.hasRampart(b.team)) {
			this.say("Rampart is already raised.");
			return;
		}
		if (!this.spend(this.playerTeam, { gold: 200, stone: 80 })) {
			this.say("Need 200 gold and 80 stone.");
			return;
		}
		this.tech[b.team].rampart = 1;
		b.rampart = true;
		for (const hold of this.buildings) {
			if (hold.team !== b.team || hold.hp <= 0) continue;
			if (hold.kind === "townhall" || hold.kind === "tower" || hold.kind === "keep") hold.hp *= 1.2;
		}
		this.say("Rampart raised. The hall, towers, and keep are tougher.");
		this.blip(160, .1, .05);
		this.emit();
	}
	resolveShot(s) {
		if (s.bolt === "heal") return;
		const owner = s.owner ? this.unit(s.owner) : null;
		const prey = s.hitBuilding ? this.building(s.hitId) : this.unit(s.hitId);
		const was = prey?.hp ?? 0;
		const magic = s.bolt === "fire" || s.bolt === "lightning" || s.bolt === "frost" || s.bolt === "shadow" || s.bolt === "holy" || s.bolt === "arcane" || s.bolt === "curse";
		this.hurt(s.hitId, s.hitBuilding, s.dmg, s.team, magic, owner?.kind || "");
		if (owner) this.grantXp(owner, was > 0 && prey && prey.hp <= 0 ? 10 : 2);
		if ((s.bolt === "frost" || s.bolt === "curse") && !s.hitBuilding) {
			const foe = this.unit(s.hitId);
			if (foe && foe.hp > 0) foe.slow = Math.max(foe.slow || 0, 2.4);
		}
		if (s.bolt === "shadow" && owner && owner.hp > 0) {
			const bite = Math.max(2, Math.round((s.dmg || 0) * .2));
			const max = this.unitMax(owner.kind, owner.team, owner.level, this.gearOf(owner).hp);
			owner.hp = Math.min(max, owner.hp + bite);
		}
	}
	hurt(id, building, dmg, from, magic = false, atkKind = "") {
		let hit = dmg * this.dmgMul(from) * (building ? this.siegeMul(from) : 1);
		let lucky = false;
		if (!building && from === this.playerTeam && Math.random() < .16) {
			hit *= 2;
			lucky = true;
		}
		if (magic && !building) {
			const u = this.unit(id);
			if (u) hit *= Math.max(0, 1 - .05 * this.techRank(u.team, "ward"));
		}
		const shown = Math.max(1, Math.round(hit));
		if (building) {
			const b = this.building(id);
			if (!b || b.team === from) return;
			const was = b.hp;
			b.hp -= hit;
			b.hit = .2;
			if (was > 0 && b.hp <= 0 && from === this.playerTeam && b.kind !== "townhall") this.plunder(b);
			if (was > 0 && b.hp <= 0 && from === this.playerTeam && b.kind === "crypt") this.say("The necromancer tower falls.");
			this.floaters.push({
				x: b.x + BLDS[b.kind].w / 2,
				y: b.y + BLDS[b.kind].h * .35,
				text: String(shown),
				life: .7,
				max: .7,
				dmg: true
			});
			if (b.team === this.playerTeam) {
				this.shake = Math.min(1, this.shake + (b.kind === "townhall" ? .45 : .2));
				if (this.alertT <= 0) {
					this.say("Your holdings are under attack.");
					this.alertT = 8;
				}
			} else if (from === this.playerTeam) {
				this.provoked = true;
				if (b.team === 2) this.angerVillage(b.x, b.y);
			}
		} else {
			const u = this.unit(id);
			if (!u || u.team === from || u.held) return;
			let edge = 1;
			if (atkKind) {
				edge = this.matchup(atkKind, u.kind);
				hit *= edge;
			}
			const alive = u.hp > 0;
			const guard = u.kind === "hero" || this.units.some((h) => h.kind === "hero" && h.team === u.team && h.hp > 0 && h.id !== u.id && dist(h.x, h.y, u.x, u.y) < 3.6);
			if (u.kind === "hero") hit *= .88;
			else if (guard) hit *= .82;
			const dealt = Math.max(1, Math.round(hit));
			u.hp -= hit;
			u.hit = .18;
			if (u.hp <= 0) u.down = .55;
			this.floaters.push({
				x: u.x,
				y: u.y,
				text: lucky ? `Lucky ${dealt}` : String(dealt),
				life: lucky ? 1 : .7,
				max: lucky ? 1 : .7,
				dmg: !lucky,
				gold: lucky,
				edge: !lucky && edge >= 1.25
			});
			if (alive && u.hp <= 0 && u.kind === "hero") this.fellHero(u);
			if (alive && u.hp <= 0) {
				const killer = this.units.find((h) => h.kind === "hero" && h.team === from && h.hp > 0 && dist(h.x, h.y, u.x, u.y) < 2.6);
				if (killer) {
					const max = this.unitMax(killer.kind, killer.team, killer.level, this.gearOf(killer).hp);
					const heal = Math.max(8, Math.round(max * .12));
					killer.hp = Math.min(max, killer.hp + heal);
					this.floaters.push({ x: killer.x, y: killer.y, text: `+${heal}`, life: .8, max: .8, gold: true });
				}
			}
			if (alive && u.hp <= 0 && from === this.playerTeam && u.team === this.foeTeam()) this.bountyFor(u);
			if (u.team === this.playerTeam && this.alertT <= 0 && u.kind !== "villager") {
				this.say("Your soldiers are fighting.");
				this.alertT = 8;
			} else if (from === this.playerTeam && u.team === this.foeTeam()) this.provoked = true;
			else if (from === this.playerTeam && u.team === 2) this.angerVillage(u.x, u.y);
			if (u.kind === "villager" && u.hp > 0 && u.team === this.foeTeam() && u.order.type !== "enter" && u.order.type !== "held") {
				const shelter = this.nearestShelter(u.team, u.x, u.y);
				if (shelter) {
					this.stashJob(u);
					this.setOrder(u, { type: "enter", buildingId: shelter.id, as: "stay" });
				}
			} else if (u.kind === "villager" && u.order.type !== "attack" && u.hp > 0) {
				const foe = this.nearestFoe(u.x, u.y, u.team, 4);
				if (foe && u.order.type === "idle") this.setOrder(u, {
					type: "attack",
					id: foe.id,
					building: false
				});
			}
		}
	}
	angerVillage(x, y) {
		let turned = false;
		for (const u of this.units) {
			if (u.team !== 2 || u.hp <= 0) continue;
			if (dist(u.x, u.y, x, y) > 8) continue;
			u.team = this.foeTeam();
			u.village = true;
			turned = true;
		}
		for (const b of this.buildings) {
			if (b.team !== 2 || b.hp <= 0) continue;
			if (dist(b.x + 1, b.y + 1, x, y) > 8) continue;
			b.team = this.foeTeam();
			turned = true;
		}
		if (turned) this.say("The village turns against you.");
	}
	separate() {
		const list = this.units.filter((u) => u.hp > 0);
		for (let i = 0; i < list.length; i++) {
			for (let j = i + 1; j < list.length; j++) {
				const a = list[i];
				const b = list[j];
				if (a.held || b.held) continue;
				const dx = b.x - a.x;
				const dy = b.y - a.y;
				const d = Math.hypot(dx, dy);
				if (d > .42 || d < .001) continue;
				const push = (.42 - d) * .18;
				const nx = dx / d;
				const ny = dy / d;
				if (this.walkable(Math.floor(a.x - nx * push), Math.floor(a.y - ny * push))) {
					a.x -= nx * push;
					a.y -= ny * push;
				}
				if (this.walkable(Math.floor(b.x + nx * push), Math.floor(b.y + ny * push))) {
					b.x += nx * push;
					b.y += ny * push;
				}
			}
		}
	}
	reap() {
		let hallDown = false;
		for (const b of this.buildings) {
			if (b.hp > 0 || b.kind !== "townhall") continue;
			if (this.phase === "play") {
				hallDown = true;
				this.phase = b.team === this.foeTeam() ? "win" : "lose";
				this.toast = b.team === this.foeTeam() ? "Their hall has fallen." : "Your town hall is lost.";
				this.toastT = 99;
				if (this.phase === "win") {
					this.blip(523, .14, .06);
					this.blip(659, .18, .06);
					this.blip(784, .24, .05);
				} else {
					this.blip(196, .25, .06, "sawtooth");
				}
			}
		}
		if (hallDown || this.buildings.some((b) => b.hp <= 0)) {
			for (const b of this.buildings) {
				if (b.hp <= 0) {
					this.releaseHeld(b);
					for (const n of this.nodes) if (n.buildingId === b.id) n.amount = 0;
				}
			}
			this.buildings = this.buildings.filter((b) => b.hp > 0);
			this.selectedBuilding = this.selectedBuilding != null && this.buildings.some((b) => b.id === this.selectedBuilding) ? this.selectedBuilding : null;
		}
		if (this.units.some((u) => u.hp <= 0)) {
			const alive = new Set(this.units.filter((u) => u.hp > 0).map((u) => u.id));
			this.units = this.units.filter((u) => u.hp > 0 || u.down > 0);
			this.selectedUnits = this.selectedUnits.filter((id) => alive.has(id));
		}
		if (this.rpg && this.phase === "play") this.rpgFate();
	}
	rpgFate() {
		const bosses = this.bossNodes();
		const bossesDown = bosses.length > 0 && bosses.every((n) => !n.alive);
		const tale = this.tale;
		const waiting = this.units.some((u) => u.hp > 0 && (u.captive || u.rescued && !u.settled));
		const home = !tale || !tale.need || !waiting;
		if (bossesDown && home) {
			this.phase = "win";
			this.toast = tale?.need ? "Your people are home. The wild is yours." : "The wild is clear. The champion stands.";
			this.toastT = 99;
			this.blip(523, .14, .06);
			this.blip(659, .18, .06);
			this.blip(784, .24, .05);
			return;
		}
		const hero = this.units.some((u) => u.team === this.playerTeam && u.kind === "hero" && (u.hp > 0 || u.down > 0));
		const altar = this.buildings.some((b) => b.team === this.playerTeam && b.kind === "altar" && b.hp > 0);
		if (!hero && this.heroFallen[this.playerTeam] && !altar) {
			this.phase = "lose";
			this.toast = "The champion is gone, and the altar with them.";
			this.toastT = 99;
			this.blip(196, .25, .06, "sawtooth");
		}
	}
	bossNodes() {
		return this.nodes.filter((n) => BOSSES[n.kind] && (n.alive || n.amount > 0));
	}
	bossLine() {
		const bosses = this.bossNodes();
		const down = bosses.filter((n) => !n.alive).length;
		return `${down}/${bosses.length || 4} bosses`;
	}
	taleLine() {
		const t = this.tale;
		const beasts = t?.joined ? ` · ${t.joined} with you` : "";
		if (!t || !t.need) return `${this.bossLine()}${beasts}`;
		const caged = this.units.filter((u) => u.captive && u.hp > 0).length;
		const leading = this.units.filter((u) => u.rescued && !u.settled && u.hp > 0).length;
		if (caged) return `Free your people ${t.freed}/${t.freed + caged}${beasts}`;
		if (leading) return `Lead them home ${t.home}/${t.home + leading}${beasts}`;
		return `Clear the wild · ${this.bossLine()}${beasts}`;
	}
	ai() {
		if (this.rpg) return;
		const scale = this.mapScale();
		const diff = this.difficulty ?? 1;
		const smart = [0.7, 1, 1.35, 1.75][diff] ?? 1;
		const gate = [1.35, 1, 0.8, 0.55][diff] ?? 1;
		const villsWant = Math.max(3, Math.round(5 * scale * smart));
		const army = Math.max(2, Math.round(6 * scale * smart));
		const riders = Math.max(2, Math.round(8 * scale * smart));
		const mages = Math.max(2, Math.round(10 * scale * smart));
		const team = this.foeTeam();
		const vills = this.units.filter((u) => u.team === team && u.kind === "villager" && u.hp > 0);
		const military = this.units.filter((u) => u.team === team && u.kind !== "villager" && u.hp > 0);
		const tc = this.buildings.find((b) => b.team === team && b.kind === "townhall" && b.hp > 0 && b.progress >= 1);
		const barracks = this.buildings.find((b) => b.team === team && b.kind === "barracks" && b.hp > 0 && b.progress >= 1);
		for (const v of vills) {
			if (v.held || v.order.type === "build" || v.order.type === "drop" || v.order.type === "enter" || v.order.type === "held") continue;
			const node = v.order.type === "gather" ? this.nodes[v.order.nodeId] : undefined;
			if (node?.kind === "sheep" && node.alive) continue;
			const next = this.bestNode(team, v.x, v.y);
			const stale = v.order.type === "idle" || !!next && node?.kind !== next.kind && v.carry < 1;
			if (stale && next && next.id !== node?.id) this.setOrder(v, {
				type: "gather",
				nodeId: next.id
			});
		}
		const site = this.buildings.find((b) => b.team === team && b.hp > 0 && b.progress < 1);
		if (site && !vills.some((v) => v.order.type === "build")) {
			const builder = vills.find((v) => v.order.type === "gather" || v.order.type === "idle");
			if (builder) this.setOrder(builder, {
				type: "build",
				buildingId: site.id
			});
		}
		if (tc && this.reservedPop(team) + 1 >= this.capOf(team)) this.aiPlace("house");
		if (!this.buildings.some((b) => b.team === team && b.kind === "dump" && b.hp > 0) && this.stock[team].wood >= 100) this.aiPlace("dump");
		if (!this.buildings.some((b) => b.team === team && b.kind === "barracks" && b.hp > 0) && vills.length >= Math.max(3, Math.round(4 * scale)) && this.stock[team].wood >= 175 * gate) this.aiPlace("barracks");
		if (diff >= 2 && !this.buildings.some((b) => b.team === team && b.kind === "tower" && b.hp > 0) && this.stock[team].wood >= 50 && this.stock[team].stone >= 100) this.aiPlace("tower");
		if (this.age[team] >= 1 && !this.buildings.some((b) => b.team === team && b.kind === "range" && b.hp > 0) && this.stock[team].wood >= 150 && this.stock[team].gold >= 50) this.aiPlace("range");
		if (this.age[team] >= 1 && !this.buildings.some((b) => b.team === team && b.kind === "temple" && b.hp > 0) && this.stock[team].wood >= 220 && this.stock[team].gold >= 160) this.aiPlace("temple");
		if (this.age[team] >= 2 && !this.buildings.some((b) => b.team === team && b.kind === "stable" && b.hp > 0) && this.stock[team].wood >= 150 && this.stock[team].gold >= 40) this.aiPlace("stable");
		if (this.age[team] >= 2 && !this.buildings.some((b) => b.team === team && b.kind === "yard" && b.hp > 0) && this.stock[team].wood >= 240 && this.stock[team].gold >= 80) this.aiPlace("yard");
		if (this.age[team] >= 3 && !this.buildings.some((b) => b.team === team && b.kind === "school" && b.hp > 0) && this.stock[team].wood >= 200 && this.stock[team].gold >= 80) this.aiPlace("school");
		if (this.age[team] >= 4 && !this.buildings.some((b) => b.team === team && b.kind === "keep" && b.hp > 0) && this.stock[team].wood >= 220 && this.stock[team].gold >= 120) this.aiPlace("keep");
		if (tc) {
			const queuedV = tc.queue.filter((k) => k === "villager").length;
			if (vills.length + queuedV < villsWant && this.stock[team].food >= 120 && tc.ageT <= 0) this.aiTrain(tc, "villager");
			if (this.age[team] === 0 && tc.ageT <= 0 && this.built(team, "barracks") && this.stock[team].food >= 380 * gate && this.stock[team].gold >= 240 * gate) {
				if (this.spend(team, AGE_COST)) tc.ageT = AGE_TIME;
			}
			if (this.age[team] === 1 && tc.ageT <= 0 && this.built(team, "range") && this.stock[team].food >= 640 * gate && this.stock[team].gold >= 500 * gate) {
				if (this.spend(team, AGE3_COST)) tc.ageT = AGE3_TIME;
			}
			if (this.age[team] === 2 && tc.ageT <= 0 && this.built(team, "stable") && this.stock[team].food >= 980 * gate && this.stock[team].gold >= 700 * gate) {
				if (this.spend(team, AGE4_COST)) tc.ageT = AGE4_TIME;
			}
			if (this.age[team] === 3 && tc.ageT <= 0 && this.built(team, "school") && this.stock[team].food >= 1400 * gate && this.stock[team].gold >= 1000 * gate) {
				if (this.spend(team, AGE5_COST)) tc.ageT = AGE5_TIME;
			}
		}
		if (barracks && military.length < army && this.stock[team].food >= 50 && this.stock[team].gold >= 10) {
			const horses = this.units.filter((u) => u.team === this.playerTeam && u.hp > 0 && (u.kind === "cavalry" || u.kind === "knight")).length;
			const bows = this.units.filter((u) => u.team === this.playerTeam && u.hp > 0 && (u.kind === "archer" || u.kind === "crossbow" || u.kind === "mage" || u.kind === "frost")).length;
			let troop = this.age[team] >= 2 ? "sword" : this.age[team] >= 1 ? "warrior" : "club";
			if (horses >= 2 && horses >= bows) troop = this.sideKey(team) === "dynasty" && this.age[team] >= 2 ? "halberd" : "club";
			this.aiTrain(barracks, troop);
		}
		const altar = this.buildings.find((b) => b.team === team && b.kind === "altar" && b.hp > 0 && b.progress >= 1);
		if (!this.buildings.some((b) => b.team === team && b.kind === "altar" && b.hp > 0) && this.stock[team].wood >= 140 && this.stock[team].gold >= 40) this.aiPlace("altar");
		if (altar && this.heroFallen[team]) this.beginRevive(altar);
		else if (altar && !this.heroBusy(team) && this.stock[team].food >= 80 && this.stock[team].gold >= 90) this.aiTrain(altar, "hero");
		const temple = this.buildings.find((b) => b.team === team && b.kind === "temple" && b.hp > 0 && b.progress >= 1);
		if (temple && this.age[team] >= 1) {
			const called = (kind) => this.units.some((u) => u.team === team && u.hp > 0 && u.kind === kind) || temple.queue.includes(kind);
			if (!called("demigod") && this.canAfford(team, UNITS.demigod.cost)) this.aiTrain(temple, "demigod");
			else if (this.age[team] >= 3 && !called("avatar") && this.stock[team].gold >= 280) this.aiTrain(temple, "avatar");
			else if (this.age[team] >= 4 && !this.godBusy(team) && this.stock[team].food >= 600 && this.stock[team].gold >= 800) this.aiTrain(temple, "god");
		}
		const yard = this.buildings.find((b) => b.team === team && b.kind === "yard" && b.hp > 0 && b.progress >= 1);
		if (yard && this.age[team] >= 2) {
			const have = (kind) => this.units.some((u) => u.team === team && u.hp > 0 && u.kind === kind) || yard.queue.includes(kind);
			if (!have("ram") && this.canAfford(team, UNITS.ram.cost)) this.aiTrain(yard, "ram");
			else if (!have("catapult") && this.stock[team].wood >= 160 && this.canAfford(team, UNITS.catapult.cost)) this.aiTrain(yard, "catapult");
			else if (this.age[team] >= 3 && !have("ballista") && this.stock[team].gold >= 120 && this.canAfford(team, UNITS.ballista.cost)) this.aiTrain(yard, "ballista");
		}
		const stable = this.buildings.find((b) => b.team === team && b.kind === "stable" && b.hp > 0 && b.progress >= 1);
		const foeBows = this.units.filter((u) => u.team === this.playerTeam && u.hp > 0 && (u.kind === "archer" || u.kind === "crossbow" || u.kind === "mage" || u.kind === "frost")).length;
		const ridersNow = this.units.filter((u) => u.team === team && u.hp > 0 && (u.kind === "cavalry" || u.kind === "knight")).length;
		if (stable && this.age[team] >= 2 && (military.length < riders || foeBows >= 3 && ridersNow < Math.max(2, Math.round(3 * scale))) && this.stock[team].food >= 80 && this.stock[team].gold >= 30) this.aiTrain(stable, "cavalry");
		const tamers = this.units.filter((u) => u.team === team && u.kind === "tamer" && u.hp > 0).length + (stable?.queue.filter((k) => k === "tamer").length || 0);
		if (stable && this.age[team] >= 2 && tamers < Math.max(1, Math.round(scale)) && this.canAfford(team, UNITS.tamer.cost)) this.aiTrain(stable, "tamer");
		const school = this.buildings.find((b) => b.team === team && b.kind === "school" && b.hp > 0 && b.progress >= 1);
		if (school && !school.lore && this.stock[team].gold >= 200) {
			this.stock[team].gold -= 200;
			school.lore = true;
		}
		if (school && !school.detect && this.stock[team].gold >= 200) {
			this.stock[team].gold -= 200;
			school.detect = true;
		}
		if (school && !school.focus && this.spend(team, { gold: 250 })) school.focus = true;
		if (school && military.length < mages && this.stock[team].food >= 50 && this.stock[team].gold >= 60) {
			const book = this.age[team] >= 4 ? ["mage", "frost", "priest", "warlock"] : ["mage", "frost"];
			const pick = book[military.length % book.length];
			if (this.canAfford(team, UNITS[pick].cost)) this.aiTrain(school, pick);
		}
		const range = this.buildings.find((b) => b.team === team && b.kind === "range" && b.hp > 0 && b.progress >= 1);
		const bows = this.units.filter((u) => u.team === team && u.kind === "crossbow" && u.hp > 0).length + (range?.queue.filter((k) => k === "crossbow").length || 0);
		if (range && this.age[team] >= 3 && bows < Math.max(2, Math.round(3 * scale)) && military.length < army && this.stock[team].food >= 55 && this.stock[team].gold >= 65) this.aiTrain(range, "crossbow");
		const keep = this.buildings.find((b) => b.team === team && b.kind === "keep" && b.hp > 0 && b.progress >= 1);
		if (keep && !this.hasRampart(team) && this.spend(team, { gold: 200, stone: 80 })) {
			this.tech[team].rampart = 1;
			keep.rampart = true;
			for (const hold of this.buildings) {
				if (hold.team !== team || hold.hp <= 0) continue;
				if (hold.kind === "townhall" || hold.kind === "tower" || hold.kind === "keep") hold.hp *= 1.2;
			}
		}
		if (keep && this.age[team] >= 4 && military.length < army && this.stock[team].food >= 80 && this.stock[team].gold >= 45) this.aiTrain(keep, "guard");
		const knightsNow = this.units.filter((u) => u.team === team && u.kind === "knight" && u.hp > 0).length;
		if (stable && this.age[team] >= 4 && knightsNow < Math.max(1, Math.round(2 * scale)) && military.length < riders && this.stock[team].food >= 100 && this.stock[team].gold >= 60) this.aiTrain(stable, "knight");
		const attackWait = [1.8, 1, 0.65, 0.35][diff] ?? 1;
		if (this.provoked && diff >= 2) this.aiAttack = true;
		if (this.mood === "aggressive" && !this.aiAttack && (this.time > 70 * scale * attackWait && military.length >= Math.max(2, Math.round(5 * scale)) || this.time > 160 * scale * attackWait && military.length >= Math.max(2, Math.round(3 * scale)))) {
			this.aiAttack = true;
		}
		if (this.mood === "normal" && diff >= 2 && !this.aiAttack && this.time > (diff >= 3 ? 45 : 110) * scale && military.length >= Math.max(2, Math.round(4 * scale))) {
			this.aiAttack = true;
		}
		if (this.aiAttack && (this.mood !== "passive" || this.provoked)) {
			const hall = this.buildings.find((b) => b.team === this.playerTeam && b.kind === "townhall" && b.hp > 0);
			const ready = military.filter((u) => {
				if ((u.fallBack || 0) > 0) return false;
				if (u.kind !== "ram" && u.kind !== "hero" && u.kind !== "god") {
					const max = this.unitMax(u.kind, u.team, u.level, this.gearOf(u).hp);
					if (max > 0 && u.hp < max * .55) return false;
				}
				return u.order.type === "idle" || u.order.type === "move" && !u.order.attackMove;
			});
			if (hall) for (const u of ready) this.setOrder(u, {
				type: "move",
				x: hall.x + BLDS.townhall.w / 2,
				y: hall.y + BLDS.townhall.h / 2,
				attackMove: u.kind !== "ram"
			});
		}
	}
	aiTrain(b, kind) {
		if (this.age[b.team] < UNITS[kind].age) return;
		if (this.reservedPop(b.team) >= this.capOf(b.team)) return;
		if (b.queue.length >= ([2, 3, 4, 5][this.difficulty] ?? 3) || b.ageT > 0) return;
		if (!this.spend(b.team, UNITS[kind].cost)) return;
		if (!b.queue.length) b.trainT = UNITS[kind].time;
		b.queue.push(kind);
	}
	aiPlace(kind) {
		if (this.buildings.some((b) => b.team === this.foeTeam() && b.kind === kind && b.hp > 0)) return;
		const tc = this.buildings.find((b) => b.team === this.foeTeam() && b.kind === "townhall" && b.hp > 0);
		if (!tc || !this.canAfford(this.foeTeam(), BLDS[kind].cost)) return;
		const spot = this.findSpot(kind, tc.x, tc.y);
		if (!spot || !this.spend(this.foeTeam(), BLDS[kind].cost)) return;
		const id = this.addBuilding(kind, this.foeTeam(), spot.x, spot.y, false);
		const vills = this.units.filter((u) => u.team === this.foeTeam() && u.kind === "villager" && u.hp > 0);
		const builder = vills.find((v) => v.order.type !== "build");
		if (builder) this.setOrder(builder, {
			type: "build",
			buildingId: id
		});
	}
	popOf(team) {
		return this.units.filter((u) => u.team === team && u.hp > 0).length;
	}
	capOf(team) {
		let n = 0;
		for (const b of this.buildings) if (b.team === team && b.hp > 0 && b.progress >= 1) n += BLDS[b.kind].pop;
		return Math.min(Math.round(POP_CAP * this.mapScale()), n);
	}
	reservedPop(team) {
		let n = this.popOf(team);
		for (const b of this.buildings) {
			if (b.team !== team || b.hp <= 0) continue;
			n += b.queue.length;
		}
		return n;
	}
	heldCount(id) {
		let n = 0;
		for (const u of this.units) if (u.hp > 0 && u.held === id) n++;
		return n;
	}
	nearestShelter(team, x, y) {
		let best = null;
		let bestD = 1e9;
		let open = null;
		let openD = 1e9;
		for (const b of this.buildings) {
			if (b.team !== team || b.hp <= 0 || b.progress < 1) continue;
			if (b.kind !== "townhall" && b.kind !== "tower") continue;
			const def = BLDS[b.kind];
			const d = dist(x, y, b.x + def.w / 2, b.y + def.h / 2);
			if (d < bestD) {
				bestD = d;
				best = b;
			}
			if (this.heldCount(b.id) < 10 && d < openD) {
				openD = d;
				open = b;
			}
		}
		return open || best;
	}
	stashJob(u) {
		if (u.job) return;
		const o = u.order;
		if (o?.type === "gather") u.job = { type: "gather", nodeId: o.nodeId };
		else if (o?.type === "build") u.job = { type: "build", buildingId: o.buildingId };
		else if (o?.type === "repair") u.job = { type: "repair", buildingId: o.buildingId };
		else if (o?.type === "drop") u.job = { type: "drop", resume: o.resume };
		else u.job = { type: "idle" };
	}
	restoreJob(u) {
		const job = u.job || { type: "idle" };
		u.job = null;
		if (u.kind !== "villager") this.becomeVillager(u);
		this.setOrder(u, job);
	}
	becomeSpear(u) {
		if (u.kind === "spear") return;
		u.stashHp = u.hp;
		u.kind = "spear";
		u.hp = UNITS.spear.hp * this.unitHpMul(u.team);
		u.carry = 0;
		u.carryKind = null;
	}
	becomeVillager(u) {
		if (u.kind === "villager") return;
		const max = UNITS.villager.hp * this.unitHpMul(u.team);
		u.kind = "villager";
		u.hp = Math.max(1, Math.min(max, u.stashHp || max));
	}
	thinkEnter(u, dt) {
		const order = u.order;
		const b = this.building(order.buildingId);
		if (!b || b.hp <= 0 || (b.kind !== "townhall" && b.kind !== "tower")) {
			if (u.kind === "spear") this.setOrder(u, { type: "idle" });
			else this.restoreJob(u);
			return;
		}
		const def = BLDS[b.kind];
		const spot = this.workSpot(u, b.x, b.y, def.w, def.h);
		if (dist(u.x, u.y, spot.x, spot.y) > .55) {
			this.moveTo(u, spot.x, spot.y, dt, .2, null, null);
			return;
		}
		u.path = [];
		if (this.heldCount(b.id) >= 10) return;
		u.held = b.id;
		u.holdT = order.as === "stay" ? 0 : .8;
		u.safe = 0;
		u.x = b.x + def.w / 2;
		u.y = b.y + def.h / 2;
		u.order = { type: "held", buildingId: b.id, as: order.as || "stay" };
	}
	thinkHeld(u, dt) {
		const b = this.building(u.held);
		if (!b) {
			u.held = 0;
			if (u.kind === "spear") this.becomeVillager(u);
			this.restoreJob(u);
			return;
		}
		const def = BLDS[b.kind];
		u.x = b.x + def.w / 2;
		u.y = b.y + def.h / 2;
		const order = u.order;
		if (order.type !== "held") return;
		if (order.as === "stay") {
			const foe = this.nearestFoe(u.x, u.y, u.team, 8);
			u.safe = foe ? 0 : (u.safe || 0) + dt;
			if (u.safe > 2) this.leaveShelter(u, b);
			return;
		}
		u.holdT -= dt;
		if (u.holdT > 0) return;
		if (order.as === "spear") this.becomeSpear(u);
		else if (order.as === "villager") this.becomeVillager(u);
		this.leaveShelter(u, b);
	}
	leaveShelter(u, b) {
		u.held = 0;
		u.safe = 0;
		const def = BLDS[b.kind];
		const spot = this.workSpot(u, b.x, b.y, def.w, def.h);
		u.x = spot.x;
		u.y = spot.y;
		if (u.kind === "villager" && u.job) this.restoreJob(u);
		else this.setOrder(u, { type: "idle" });
	}
	releaseHeld(b) {
		for (const u of this.units) {
			if (u.held !== b.id || u.hp <= 0) continue;
			u.held = 0;
			const def = BLDS[b.kind];
			const spot = this.workSpot(u, b.x, b.y, def.w, def.h);
			u.x = spot.x;
			u.y = spot.y;
			if (u.kind === "spear") this.setOrder(u, { type: "idle" });
			else this.restoreJob(u);
		}
	}
	ringBell() {
		if (this.phase !== "play") return;
		const tc = this.buildings.find((b) => b.team === this.playerTeam && b.kind === "townhall" && b.hp > 0 && b.progress >= 1);
		if (!tc) return;
		if (this.militiaLeft > 0) {
			this.militiaLeft = 0;
			this.recallMilitia();
			this.say("Militia returning.");
			this.emit();
			return;
		}
		if (this.militiaCd > 0) {
			this.say(`Militia bell in ${Math.ceil(this.militiaCd)}s.`);
			return;
		}
		const cx = tc.x + BLDS.townhall.w / 2;
		const cy = tc.y + BLDS.townhall.h / 2;
		const near = this.units.filter((u) => u.team === this.playerTeam && u.kind === "villager" && u.hp > 0 && !u.held && dist(u.x, u.y, cx, cy) <= 16);
		if (!near.length) {
			this.say("No villagers near the hall.");
			return;
		}
		this.militiaCd = 300;
		this.militiaLeft = 45 + 15 * (this.age[this.playerTeam] || 0);
		for (const u of near) {
			this.stashJob(u);
			this.setOrder(u, { type: "enter", buildingId: tc.id, as: "spear" });
		}
		this.score.bell();
		this.say("Militia bell. Villagers to the hall.");
		this.emit();
	}
	recallMilitia() {
		const tc = this.buildings.find((b) => b.team === this.playerTeam && b.kind === "townhall" && b.hp > 0 && b.progress >= 1);
		for (const u of this.units) {
			if (u.team !== this.playerTeam || u.hp <= 0) continue;
			const called = u.kind === "spear" || u.order?.type === "enter" && u.order.as === "spear" || u.order?.type === "held" && u.order.as === "spear";
			if (!called) continue;
			if (u.kind === "villager") {
				u.held = 0;
				this.restoreJob(u);
				continue;
			}
			if (!tc) {
				u.held = 0;
				this.becomeVillager(u);
				this.restoreJob(u);
				continue;
			}
			if (u.held === tc.id) {
				u.order = { type: "held", buildingId: tc.id, as: "villager" };
				u.holdT = Math.min(u.holdT ?? .8, .45);
				continue;
			}
			u.held = 0;
			this.setOrder(u, { type: "enter", buildingId: tc.id, as: "villager" });
		}
	}
	bestNode(team, x, y) {
		const s = this.stock[team];
		const want = s.food < 180 ? [
			"berry",
			"sheep",
			"lion",
			"fish",
			"farm",
			"tree",
			"gold"
		] : s.wood < 100 ? [
			"tree",
			"berry",
			"gold",
			"stone"
		] : s.gold < 220 ? [
			"gold",
			"tree",
			"stone",
			"berry"
		] : [
			"tree",
			"stone",
			"gold",
			"berry"
		];
		let best = null;
		let bestScore = 1e9;
		for (const n of this.nodes) {
			if (n.amount <= 0) continue;
			if ((n.kind === "lion" || n.kind === "cart" || MONSTERS[n.kind] || BOSSES[n.kind]) && n.alive) continue;
			const rank = want.indexOf(n.kind);
			if (rank < 0) continue;
			const score = dist(x, y, n.x, n.y) + rank * 12 * this.mapScale();
			if (score < bestScore) {
				bestScore = score;
				best = n;
			}
		}
		return best;
	}
	findSpot(kind, ox, oy) {
		const far = Math.max(10, Math.round(10 * this.mapScale()));
		for (let r = 3; r < far; r++) {
			for (let dy = -r; dy <= r; dy++) {
				for (let dx = -r; dx <= r; dx++) {
					if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
					const x = ox + dx;
					const y = oy + dy;
					if (this.canPlace(kind, x, y)) return {
						x,
						y
					};
				}
			}
		}
		return null;
	}
	snapshot() {
		const s = this.stock[this.playerTeam];
		return {
			phase: this.phase,
			food: Math.floor(s.food),
			wood: Math.floor(s.wood),
			gold: Math.floor(s.gold),
			stone: Math.floor(s.stone),
			pop: this.popOf(this.playerTeam),
			cap: this.capOf(this.playerTeam),
			age: this.age[this.playerTeam],
			ageT: this.playerAgeT(),
			time: this.time,
			toast: this.toastT > 0 ? this.toast : "",
			dare: this.dare ? `${this.dare.label} · ${this.dare.have}/${this.dare.need}` : "",
			fury: Math.ceil(this.fury),
			rpg: !!this.rpg,
			bosses: this.rpg ? this.taleLine() : "",
			need: this.needT > 0 ? this.need : "",
			alarm: this.underAttack(),
			placing: this.placing,
			speed: this.speed,
			sfx: this.score.sfxVol,
			music: this.score.musicVol,
			selection: this.selectionSnap(),
			controls: this.controls,
			capture: this.capture
		};
	}
	playerAgeT() {
		const tc = this.buildings.find((b) => b.team === this.playerTeam && b.kind === "townhall" && b.hp > 0);
		return tc?.ageT ?? 0;
	}
	selectionSnap() {
		if (this.selectedBuilding != null && !this.selectedUnits.length) {
			const b = this.building(this.selectedBuilding);
			if (!b) return null;
			const def = BLDS[b.kind];
			const cmds = [];
			if (b.team === this.playerTeam && b.progress < 1) {
				cmds.push({
					id: "cancel",
					label: "Cancel",
					cost: costText(def.cost),
					disabled: false,
					hint: "Return all materials"
				});
			}
			if (b.team === this.playerTeam && b.progress >= 1) {
				if (b.kind === "townhall") {
					cmds.push(this.trainCmd("villager"));
					cmds.push(this.trainCmd("scout"));
					if (this.age[this.playerTeam] < 4) {
						const next = this.age[this.playerTeam] + 1;
						const cost = next === 1 ? AGE_COST : next === 2 ? AGE3_COST : next === 3 ? AGE4_COST : AGE5_COST;
						const ready = next === 1 ? this.built(this.playerTeam, "barracks") : next === 2 ? this.built(this.playerTeam, "range") : next === 3 ? this.built(this.playerTeam, "stable") : this.built(this.playerTeam, "school");
						const broke = ready && !this.canAfford(this.playerTeam, cost);
						const need = next === 1 ? "Build a barracks first" : next === 2 ? "Build an archery range first" : next === 3 ? "Build a stable first" : "Build a mage school first";
						cmds.push({
							id: "age",
							label: next === 1 ? "Village Age" : next === 2 ? "Age 3" : next === 3 ? "Age 4" : "Age 5",
							cost: costText(cost),
							disabled: b.ageT > 0 || !ready || broke,
							hint: b.ageT > 0 ? "Already advancing" : !ready ? need : broke ? "Not enough" : "Advance to the next age"
						});
					}
					const out = this.militiaLeft > 0;
					cmds.push({
						id: "bell",
						label: out ? "Recall" : "Militia",
						cost: out ? `${Math.ceil(this.militiaLeft)}s` : this.militiaCd > 0 ? `${Math.ceil(this.militiaCd)}s` : "",
						disabled: !out && this.militiaCd > 0,
						hint: out ? "Send spearmen back early" : "Nearby villagers become spearmen",
						pie: this.militiaCd > 0 ? 1 - this.militiaCd / 300 : 1
					});
				} else if (b.kind === "barracks") {
					cmds.push(this.trainCmd("club"));
					cmds.push(this.trainCmd("warrior"));
					cmds.push(this.trainCmd("sword"));
					if (this.faction === "dynasty") cmds.push(this.trainCmd("halberd"));
					cmds.push(this.wardCmd(b.team));
				} else if (b.kind === "range") {
					cmds.push(this.trainCmd("archer"));
					cmds.push(this.trainCmd("crossbow"));
					cmds.push(this.wardCmd(b.team));
				} else if (b.kind === "stable") {
					cmds.push(this.trainCmd("cavalry"));
					cmds.push(this.trainCmd("knight"));
					cmds.push(this.trainCmd("tamer"));
					cmds.push(this.wardCmd(b.team));
				} else if (b.kind === "school") {
					cmds.push(this.trainCmd("mage"));
					cmds.push(this.trainCmd("frost"));
					cmds.push(this.trainCmd("priest"));
					cmds.push(this.trainCmd("warlock"));
					cmds.push({
						id: "lore",
						label: "Lightning",
						cost: b.lore ? "Known" : "200 gold",
						disabled: !!b.lore || !this.canAfford(this.playerTeam, { gold: 200 }),
						hint: b.lore ? "Already known" : !this.canAfford(this.playerTeam, { gold: 200 }) ? "Not enough" : "Mages also cast lightning"
					});
					cmds.push({
						id: "detect",
						label: "Sense",
						cost: b.detect ? "Known" : "200 gold",
						disabled: !!b.detect || !this.canAfford(this.playerTeam, { gold: 200 }),
						hint: b.detect ? "Already known" : !this.canAfford(this.playerTeam, { gold: 200 }) ? "Not enough" : "Mages see hidden foes"
					});
					cmds.push({
						id: "focus",
						label: "Focus",
						cost: b.focus ? "Known" : "250 gold",
						disabled: !!b.focus || !this.canAfford(this.playerTeam, { gold: 250 }),
						hint: b.focus ? "Already known" : !this.canAfford(this.playerTeam, { gold: 250 }) ? "Not enough" : "Mage bolts hit harder"
					});
				} else if (b.kind === "keep") {
					cmds.push(this.trainCmd("guard"));
					const raised = this.hasRampart(b.team);
					cmds.push({
						id: "rampart",
						label: "Rampart",
						cost: raised ? "Done" : "200 gold, 80 stone",
						disabled: raised || !this.canAfford(this.playerTeam, { gold: 200, stone: 80 }),
						hint: raised ? "Already raised" : !this.canAfford(this.playerTeam, { gold: 200, stone: 80 }) ? "Not enough" : "Hall, towers, and keep get tougher"
					});
				} else if (b.kind === "altar") {
					if (this.heroFallen[b.team]) {
						const fall = this.heroFallen[b.team];
						const gold = 40 + 20 * fall.level;
						const rev = b.reviveT || 0;
						cmds.push({
							id: "revive",
							label: "Revive",
							cost: rev > 0 ? `${Math.ceil(rev)}s` : `${gold} gold`,
							disabled: rev > 0 || !this.canAfford(b.team, { gold }),
							hint: `Level ${fall.level} hero`,
							pie: rev > 0 ? 1 - rev / 12 : 1
						});
					} else cmds.push(this.trainCmd("hero"));
				} else if (b.kind === "yard") {
					cmds.push(this.trainCmd("ram"));
					cmds.push(this.trainCmd("catapult"));
					cmds.push(this.trainCmd("ballista"));
				} else if (b.kind === "temple") {
					cmds.push(this.trainCmd("demigod"));
					cmds.push(this.trainCmd("avatar"));
					cmds.push(this.trainCmd("god"));
				} else if (b.kind === "shop") {
					for (const item of Object.keys(SHOP_PRICE)) {
						const price = SHOP_PRICE[item];
						cmds.push({
							id: `buy:${item}`,
							label: ITEMS[item].name,
							cost: `${price} gold`,
							disabled: !this.canAfford(this.playerTeam, { gold: price }),
							hint: ITEMS[item].hint
						});
					}
				} else if (b.kind === "smith" || b.kind === "husbandry") {
					const words = {
						structure: ["Walls", "Buildings take more hits"],
						weaponry: ["Arms", "Your units hit harder"],
						siege: ["Siege", "More damage to buildings"],
						fortitude: ["Health", "Your units last longer"],
						efficiency: ["Gather", "Farms and gathering yield more"],
						economy: ["Mines", "Gold and stone come faster"]
					};
					const keys = b.kind === "smith" ? ["structure", "weaponry", "siege"] : ["fortitude", "efficiency", "economy"];
					const cap = this.techCap(b.team, b.kind);
					for (const key of keys) {
						const rank = this.techRank(b.team, key);
						const word = words[key];
						cmds.push({
							id: key,
							label: word[0],
							cost: `Rank ${rank}`,
							disabled: rank >= cap,
							hint: rank >= cap ? this.age[b.team] >= 4 ? "Highest rank" : "Needs the next age" : word[1]
						});
					}
				}
				if (b.kind !== "townhall") {
					cmds.push({
						id: "demolish",
						label: this.armDemolish === b.id ? "Sure?" : "Demolish",
						cost: this.refundText(def.cost, 0.75),
						disabled: false,
						hint: "Recover 75% of the cost"
					});
				}
				if (b.kind === "townhall" || b.kind === "barracks" || b.kind === "range" || b.kind === "stable" || b.kind === "school" || b.kind === "altar" || b.kind === "keep" || b.kind === "temple" || b.kind === "yard") {
					cmds.push({
						id: "unqueue",
						label: "Unqueue",
						cost: "",
						disabled: b.queue.length === 0,
						hint: "Take the next unit off the line"
					});
				}
			}
			const waiting = b.kind === "shop" && b.progress >= 1 ? this.shoppers().length : 0;
			const subtitle = b.progress < 1 ? `Building ${Math.floor(b.progress * 100)}%` : b.ageT > 0 ? "Advancing the age" : b.queue.length ? `Training ${this.unitName(b.team, b.queue[0])}` : b.kind === "shop" && b.team === this.playerTeam ? waiting ? `${waiting} at the counter` : "Send warriors or the hero" : b.team === this.playerTeam ? "Your building" : "Enemy building";
			return {
				title: def.name,
				subtitle,
				hp: Math.max(0, Math.ceil(b.hp)),
				maxHp: Math.ceil(this.bldMax(b.kind, b.team)),
				team: b.team,
				commands: cmds,
				queue: b.queue.slice()
			};
		}
		const sel = this.selectedUnits.map((id) => this.unit(id)).filter((u) => !!u);
		if (!sel.length) return null;
		const kinds = new Set(sel.map((u) => u.kind));
		const named = this.unitName(sel[0].team, sel[0].kind);
		const label = named.endsWith("s") ? named : `${named}s`;
		const title = sel.length === 1 ? named : kinds.size === 1 ? `${sel.length} ${label}` : `${sel.length} units`;
		const one = sel.length === 1 ? sel[0] : null;
		const job = one ? one.stealth ? "Hidden" : one.carry > 0 && one.carryKind ? `Carrying ${Math.floor(one.carry)} ${one.carryKind}` : one.order.type === "gather" ? this.jobLabel(one) : one.order.type === "build" ? "Building" : one.order.type === "repair" ? "Repairing" : one.order.type === "attack" ? "Fighting" : one.order.type === "pickup" ? "Picking up gear" : one.order.type === "shop" ? "Shopping" : one.order.type === "move" || one.order.type === "rally" ? "Moving" : one.order.type === "drop" ? "Dropping off" : "Idle" : "";
		const lv = one ? this.levelOf(one) : 1;
		const next = one ? this.xpNext(one) : 0;
		const gearNote = one ? ` · ${(one.gear || []).length}/${this.gearSlots(one)} gear` : "";
		const auraNote = one?.kind === "hero" ? " · Banner" : "";
		const subtitle = one ? next ? `Level ${lv} · ${Math.floor(one.xp)}/${next} xp · ${job}${gearNote}${auraNote}` : `Level ${lv} · ${job}${gearNote}${auraNote}` : "";
		const cmds = [];
		if (sel.every((u) => u.kind === "villager" && u.team === this.playerTeam)) {
			for (const btn of BUILD_BTN) {
				const def = BLDS[btn.id];
				const locked = this.age[this.playerTeam] < def.age;
				const broke = !locked && !this.canAfford(this.playerTeam, def.cost);
				const mageTowers = btn.id === "tower" && this.hasSchool(this.playerTeam);
				const need = def.age >= 4 ? "Needs age 5" : def.age >= 3 ? "Needs age 4" : def.age >= 2 ? "Needs age 3" : "Needs Village Age";
				cmds.push({
					id: btn.id,
					label: mageTowers ? "Mage Tower" : btn.label,
					cost: costText(def.cost),
					disabled: locked || broke,
					hint: locked ? need : broke ? "Not enough" : mageTowers ? "Shoots fire bolts" : btn.use
				});
			}
		}
		if (sel.some((u) => u.kind === "scout" && u.team === this.playerTeam)) {
			const scouts = sel.filter((u) => u.kind === "scout");
			const hiding = scouts.every((u) => u.stealth);
			const wait = Math.max(0, ...scouts.map((u) => u.vanishCd || 0));
			cmds.push({
				id: "hide",
				label: hiding ? "Reveal" : "Stealth",
				cost: hiding ? "Slow" : "",
				disabled: false,
				hint: hiding ? "Come out of hiding" : "Hide and move at 20% speed"
			});
			cmds.push({
				id: "vanish",
				label: "Vanish",
				cost: wait > 0 ? `${Math.ceil(wait)}s` : "",
				disabled: wait > 0 && scouts.every((u) => (u.vanishCd || 0) > 0),
				hint: "Drop combat and disappear",
				pie: wait > 0 ? 1 - wait / 180 : 1
			});
		}
		if (sel.some((u) => u.kind === "hero" && u.team === this.playerTeam && u.hp > 0)) {
			const h = sel.find((u) => u.kind === "hero" && u.hp > 0);
			const lv = this.levelOf(h);
			cmds.push({
				id: "cleave",
				label: "Cleave",
				cost: (h.cleaveCd || 0) > 0 ? `${Math.ceil(h.cleaveCd)}s` : "",
				disabled: (h.cleaveCd || 0) > 0,
				hint: "Hit every enemy around the hero",
				pie: (h.cleaveCd || 0) > 0 ? 1 - h.cleaveCd / 8 : 1
			});
			cmds.push({
				id: "cry",
				label: "War Cry",
				cost: lv < 2 ? "Lv 2" : (h.cryCd || 0) > 0 ? `${Math.ceil(h.cryCd)}s` : "",
				disabled: lv < 2 || (h.cryCd || 0) > 0,
				hint: "Nearby allies deal more damage",
				pie: (h.cryCd || 0) > 0 ? 1 - h.cryCd / 16 : 1
			});
			cmds.push({
				id: "charge",
				label: "Charge",
				cost: (h.chargeCd || 0) > 0 ? `${Math.ceil(h.chargeCd)}s` : "",
				disabled: (h.chargeCd || 0) > 0,
				hint: "Dash forward and slow enemies",
				pie: (h.chargeCd || 0) > 0 ? 1 - h.chargeCd / 12 : 1
			});
			cmds.push({
				id: "mend",
				label: "Mend",
				cost: lv < 3 ? "Lv 3" : (h.mendCd || 0) > 0 ? `${Math.ceil(h.mendCd)}s` : "",
				disabled: lv < 3 || (h.mendCd || 0) > 0,
				hint: "Heal the hero and nearby allies",
				pie: (h.mendCd || 0) > 0 ? 1 - h.mendCd / 18 : 1
			});
			cmds.push({
				id: "wave",
				label: "Shockwave",
				cost: lv < 4 ? "Lv 4" : (h.waveCd || 0) > 0 ? `${Math.ceil(h.waveCd)}s` : "",
				disabled: lv < 4 || (h.waveCd || 0) > 0,
				hint: "A blast in the direction the hero faces",
				pie: (h.waveCd || 0) > 0 ? 1 - h.waveCd / 22 : 1
			});
		}
		if (one && one.team === this.playerTeam && one.gear?.length) {
			one.gear.forEach((item, i) => {
				const it = ITEMS[item];
				if (!it) return;
				cmds.push({
					id: `gear:${i}`,
					label: it.name,
					cost: "Drop",
					disabled: false,
					hint: it.hint
				});
			});
		}
		if (sel.some((u) => u.team === this.playerTeam)) {
			cmds.push({
				id: "stop",
				label: "Stop",
				cost: "",
				disabled: false,
				hint: "Stop"
			});
		}
		return {
			title,
			subtitle,
			hp: one ? Math.max(0, Math.ceil(one.hp)) : 0,
			maxHp: one ? Math.ceil(this.unitMax(one.kind, one.team, one.level, this.gearOf(one).hp)) : 0,
			team: sel[0].team,
			commands: cmds,
			queue: []
		};
	}
	wardCmd(team) {
		const rank = this.techRank(team, "ward");
		const cap = this.wardCap(team);
		return {
			id: "ward",
			label: "Shield",
			cost: `Rank ${rank}`,
			disabled: rank >= cap,
			hint: rank >= cap ? this.age[team] >= 4 ? "Highest rank" : "Next age" : "5% less magic damage per rank"
		};
	}
	trainCmd(kind) {
		const def = UNITS[kind];
		const locked = this.age[this.playerTeam] < def.age;
		const full = this.reservedPop(this.playerTeam) >= this.capOf(this.playerTeam);
		const capped = kind === "scout" && this.scoutCount(this.playerTeam) >= this.scoutLimit(this.playerTeam);
		const heroLock = kind === "hero" && this.heroBusy(this.playerTeam);
		const godLock = kind === "god" && this.godBusy(this.playerTeam);
		const job = kind === "club" || kind === "spear" || kind === "halberd" ? "Beats horses" : kind === "warrior" || kind === "guard" ? "Holds the line. Weak to bows" : kind === "sword" ? "Beats spears" : kind === "archer" || kind === "crossbow" ? "Beats foot soldiers" : kind === "cavalry" || kind === "knight" ? "Beats archers and mages" : kind === "mage" || kind === "frost" || kind === "warlock" ? "Beats foot soldiers" : "";
		const role = kind === "demigod" || kind === "avatar" || kind === "god" ? this.deityRole(this.playerTeam) : "";
		const roleHint = job || (role === "heal" ? "Heals your people" : role === "bless" ? "Blesses nearby troops" : role === "omen" ? "A long arcane curse" : role === "curse" ? "Curses and slows a foe" : kind === "ram" ? "Walks up and breaks buildings" : kind === "catapult" ? "Throws at buildings" : kind === "ballista" ? "A long bolt, better against troops" : costText(def.cost));
		return {
			id: kind,
			label: this.unitName(this.playerTeam, kind),
			cost: costText(def.cost),
			disabled: locked || full || capped || heroLock || godLock || !this.canAfford(this.playerTeam, def.cost),
			hint: locked ? def.age >= 4 ? "Age 5" : def.age >= 3 ? "Age 4" : def.age >= 2 ? "Age 3" : "Village Age" : full ? "Population full" : capped ? "Two scouts per town level" : heroLock ? this.heroFallen[this.playerTeam] ? "Revive at the altar" : "Only one hero" : godLock ? "Only one god" : roleHint
		};
	}
	localPoint(e) {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	}
	onKey(e, down) {
		const tag = e.target?.tagName;
		if (tag === "INPUT" || tag === "TEXTAREA") return;
		if (down) this.keys.add(e.code);
		else this.keys.delete(e.code);
		if (down && this.capture) {
			e.preventDefault();
			const id = this.capture;
			this.capture = "";
			this.setBind(id, e.code);
			return;
		}
		if (!down) return;
		const c = this.controls;
		if (e.code === c.idle) {
			e.preventDefault();
			this.selectIdle();
		} else if (e.code === c.pause || e.code === c.pauseAlt) {
			e.preventDefault();
			if (this.phase === "play" || this.phase === "paused") this.togglePause();
		} else if (e.code === c.cycle) {
			e.preventDefault();
			if (this.phase === "play") this.cycleKind();
		} else if (e.code === "KeyF" && this.phase === "play" && e.code !== c.panUp && e.code !== c.panDown && e.code !== c.panLeft && e.code !== c.panRight && e.code !== c.pause && e.code !== c.pauseAlt && e.code !== c.idle && e.code !== c.cycle && !c.group.includes(e.code)) {
			e.preventDefault();
			this.focusSelection();
		} else {
			const digit = groupNumber(e.code, c.group);
			if (digit < 0) return;
			e.preventDefault();
			if (this.phase !== "play") return;
			if (this.modHeld(e)) this.assignGroup(digit);
			else this.recallGroup(digit);
		}
	}
	modHeld(e) {
		if (this.controls.groupMod === "alt") return e.altKey;
		if (this.controls.groupMod === "shift") return e.shiftKey;
		return e.ctrlKey;
	}
	saveControls() {
		try {
			if (typeof localStorage === "undefined") return;
			localStorage.setItem("stickhold-controls", JSON.stringify(this.controls));
		} catch {
			/* private mode */
		}
	}
	patchControls(part) {
		this.capture = "";
		Object.assign(this.controls, part);
		if (this.controls.selectButton === this.controls.commandButton) {
			this.controls.commandButton = this.controls.selectButton === 0 ? 2 : 0;
		}
		this.saveControls();
		this.emit();
	}
	setBind(id, code) {
		const c = this.controls;
		const keys = ["panUp", "panDown", "panLeft", "panRight", "pause", "pauseAlt", "idle", "cycle"];
		if (id.startsWith("group")) {
			const i = Number(id.slice(5));
			if (!Number.isInteger(i) || i < 0 || i > 9) return;
			const prev = c.group[i];
			const other = c.group.indexOf(code);
			if (other >= 0 && other !== i) c.group[other] = prev;
			for (const k of keys) if (c[k] === code) c[k] = prev;
			c.group[i] = code;
		} else if (keys.includes(id)) {
			const prev = c[id];
			for (const k of keys) if (k !== id && c[k] === code) c[k] = prev;
			const gi = c.group.indexOf(code);
			if (gi >= 0) c.group[gi] = prev;
			c[id] = code;
		}
		this.saveControls();
		this.emit();
	}
	cycleMode(key) {
		const order = ["screen", "all", "fight"];
		const i = Math.max(0, order.indexOf(this.controls[key]));
		this.patchControls({ [key]: order[(i + 1) % order.length] });
	}
	onDown(e) {
		if (!this.canvas) return;
		const p = this.localPoint(e);
		if (e.pointerType === "touch") {
			this.pointers.set(e.pointerId, p);
			if (this.pointers.size >= 2) {
				this.beginPinch();
				return;
			}
		}
		if (this.phase === "menu" || this.phase === "win" || this.phase === "lose" || this.phase === "paused") return;
		this.ensureAudio();
		this.canvas.setPointerCapture?.(e.pointerId);
		this.shiftSelect = !!e.shiftKey;
		const kind = e.pointerType === "touch" ? "touch" : e.button === this.controls.commandButton ? "order" : "box";
		this.pointer = {
			id: e.pointerId,
			x: p.x,
			y: p.y,
			sx: p.x,
			sy: p.y,
			button: e.button,
			moved: false,
			held: false,
			kind
		};
		this.box = null;
		if (e.pointerType === "touch") {
			this.clearHold();
			this.holdTimer = window.setTimeout(() => {
				const ptr = this.pointer;
				if (!ptr || ptr.id !== e.pointerId || ptr.moved) return;
				ptr.held = true;
			}, 380);
		}
	}
	clearHold() {
		if (!this.holdTimer) return;
		clearTimeout(this.holdTimer);
		this.holdTimer = 0;
	}
	onMove(e) {
		if (!this.canvas) return;
		if (e.pointerType === "touch" && this.pointers.has(e.pointerId)) this.pointers.set(e.pointerId, this.localPoint(e));
		if (this.pinching && this.pointers.size >= 2) {
			this.applyPinch();
			return;
		}
		const rect = this.canvas.getBoundingClientRect();
		const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
		const p = this.localPoint(e);
		if (!inside) {
			this.edge = {
				x: 0,
				y: 0
			};
		} else if (e.pointerType !== "touch") {
			const m = 18;
			this.edge = {
				x: p.x < m ? -1 : p.x > rect.width - m ? 1 : 0,
				y: p.y < m ? -1 : p.y > rect.height - m ? 1 : 0
			};
			const world = this.screenToWorld(p.x, p.y);
			if (world.x >= 0 && world.y >= 0 && world.x < MAP_W && world.y < MAP_H) {
				this.hover = {
					x: Math.floor(world.x),
					y: Math.floor(world.y)
				};
			} else this.hover = null;
			this.mouse = p;
			this.hintFromTouch = false;
		}
		const ptr = this.pointer;
		if (!ptr || ptr.id !== e.pointerId) return;
		const dragged = Math.hypot(p.x - ptr.sx, p.y - ptr.sy) > (ptr.kind === "touch" && !ptr.held ? 28 : 4);
		if (dragged) ptr.moved = true;
		if (ptr.kind === "touch" && !ptr.held) {
			if (ptr.moved) {
				this.clearHold();
				this.panScreen(ptr.x - p.x, ptr.y - p.y);
				ptr.x = p.x;
				ptr.y = p.y;
			}
			return;
		}
		if (ptr.kind === "box" && ptr.moved || ptr.kind === "touch" && ptr.held && ptr.moved) {
			this.box = {
				x: ptr.sx,
				y: ptr.sy,
				x2: p.x,
				y2: p.y
			};
		}
		if (ptr.kind === "pan" && ptr.moved) {
			this.panScreen(ptr.x - p.x, ptr.y - p.y);
			ptr.x = p.x;
			ptr.y = p.y;
			this.edge = {
				x: 0,
				y: 0
			};
		}
	}
	onUp(e) {
		if (e.pointerType === "touch") this.pointers.delete(e.pointerId);
		if (this.pinching) {
			if (this.pointers.size >= 2) this.beginPinch();
			else {
				this.pinching = false;
				this.pointer = null;
				this.box = null;
			}
			return;
		}
		if (!this.pointer || this.pointer.id !== e.pointerId) return;
		const p = this.localPoint(e);
		const ptr = this.pointer;
		this.pointer = null;
		this.box = null;
		this.clearHold();
		this.edge = {
			x: 0,
			y: 0
		};
		if (this.phase !== "play") return;
		if (ptr.kind === "touch" && !(ptr.moved && !ptr.held)) {
			this.mouse = p;
			this.hintFromTouch = true;
			this.hintT = 1.8;
		}
		if (ptr.kind === "order" || ptr.kind === "pan" && !ptr.moved) {
			this.ordering = true;
			this.commandAt(p.x, p.y);
			this.ordering = false;
			return;
		}
		if (ptr.kind === "pan") return;
		if (ptr.kind === "touch") {
			if (ptr.held && ptr.moved) {
				this.selectBox(ptr.sx, ptr.sy, p.x, p.y);
				return;
			}
			if (ptr.moved) return;
			if (this.placing) {
				this.selectAt(p.x, p.y);
				return;
			}
			if (this.selectedUnits.length) {
				this.ordering = true;
				this.commandAt(p.x, p.y);
				this.ordering = false;
				return;
			}
			const unit = this.pickUnit(p.x, p.y);
			if (unit && unit.team === this.playerTeam) {
				this.pickOwned(unit);
				return;
			}
			this.selectAt(p.x, p.y);
			return;
		}
		if (ptr.moved && ptr.button === this.controls.selectButton) {
			this.selectBox(ptr.sx, ptr.sy, p.x, p.y);
			return;
		}
		if (ptr.button === this.controls.selectButton) this.selectAt(p.x, p.y, true);
		else if (ptr.button === this.controls.commandButton) {
			this.ordering = true;
			this.commandAt(p.x, p.y);
			this.ordering = false;
		}
	}
	selectBox(x, y, x2, y2) {
		const minX = Math.min(x, x2);
		const maxX = Math.max(x, x2);
		const minY = Math.min(y, y2);
		const maxY = Math.max(y, y2);
		const ids = this.units.filter((u) => {
			if (u.team !== this.playerTeam || u.hp <= 0 || u.held) return false;
			const p = this.worldToScreen(u.x, u.y);
			return p.sx >= minX && p.sx <= maxX && p.sy >= minY && p.sy <= maxY;
		}).map((u) => u.id);
		this.selectedUnits = this.shiftSelect ? [...new Set([...this.selectedUnits, ...ids])] : ids;
		this.selectedBuilding = null;
		this.emit();
	}
	assignGroup(n) {
		const ids = this.selectedUnits.filter((id) => {
			const u = this.unit(id);
			return !!u && u.team === this.playerTeam;
		});
		this.groups[n] = ids.slice();
		this.emit();
	}
	recallGroup(n) {
		const ids = (this.groups[n] ?? []).filter((id) => {
			const u = this.unit(id);
			return !!u && u.team === this.playerTeam;
		});
		this.groups[n] = ids;
		if (!ids.length) return;
		this.selectedUnits = ids.slice();
		this.selectedBuilding = null;
		this.emit();
	}
	cycleKind() {
		const first = this.selectedUnits.map((id) => this.unit(id)).find((u) => !!u && u.team === this.playerTeam);
		if (!first) return;
		const all = this.units.filter((u) => u.team === this.playerTeam && u.hp > 0 && u.kind === first.kind);
		if (!all.length) return;
		const at = all.findIndex((u) => u.id === first.id);
		const next = all[(at + 1) % all.length];
		this.selectedUnits = [next.id];
		this.selectedBuilding = null;
		this.focusTile(next.x, next.y);
		this.emit();
	}
	fighters() {
		const attacked = new Set();
		for (const u of this.units) {
			if (u.hp <= 0 || u.order.type !== "attack" || u.order.building) continue;
			attacked.add(u.order.id);
		}
		return this.units.filter((u) => u.hp > 0 && u.team === this.playerTeam && (u.order.type === "attack" || attacked.has(u.id)));
	}
	underAttack() {
		for (const u of this.units) {
			if (u.hp <= 0 || u.team === this.playerTeam || u.order?.type !== "attack" || u.order.building) continue;
			const t = this.unit(u.order.id);
			if (t && t.team === this.playerTeam) return true;
		}
		for (const s of this.shots) {
			if (s.done || s.hitBuilding || s.team === this.playerTeam) continue;
			const t = this.unit(s.hitId);
			if (t && t.team === this.playerTeam && t.hp > 0) return true;
		}
		return false;
	}
	focusFight() {
		const list = this.fighters();
		if (!list.length) {
			this.say("No one is fighting.");
			return;
		}
		const u = list[this.fightAt % list.length];
		this.fightAt = (this.fightAt + 1) % list.length;
		this.focusTile(u.x, u.y);
		this.emit();
	}
	pickOwned(u, screenOnly = false, add = false) {
		if (add) {
			this.tapAt = 0;
			this.tapId = -1;
			this.selectedUnits = this.selectedUnits.includes(u.id) ? this.selectedUnits.filter((id) => id !== u.id) : this.selectedUnits.concat(u.id);
			this.selectedBuilding = null;
			this.emit();
			return;
		}
		const now = performance.now();
		const again = this.tapId === u.id && now - this.tapAt < 450;
		this.tapAt = again ? 0 : now;
		this.tapId = again ? -1 : u.id;
		if (again && u.team === this.playerTeam) {
			const mode = screenOnly ? this.controls.doubleClick : this.controls.doubleTap;
			if (mode === "fight") {
				this.focusFight();
				this.emit();
				return;
			}
			const onlyHere = mode === "screen";
			this.selectedUnits = this.units.filter((o) => o.team === this.playerTeam && o.hp > 0 && o.kind === u.kind && (!onlyHere || this.onScreen(o.x, o.y))).map((o) => o.id);
		} else this.selectedUnits = [u.id];
		this.selectedBuilding = null;
		if (!again && u.kind !== "villager") this.blip(680, .04, .035);
		this.emit();
	}
	pickUnit(sx, sy) {
		let best = null;
		let bestD = 96;
		for (const u of this.units) {
			if (u.hp <= 0 || u.held) continue;
			if (u.team !== this.playerTeam && !this.scoutSeen(u)) continue;
			const d = this.unitDist(sx, sy, u);
			if (d < bestD) {
				bestD = d;
				best = u;
			}
		}
		return best;
	}
	unitDist(sx, sy, u) {
		const p = this.worldToScreen(u.x, u.y);
		return Math.hypot(p.sx - sx, p.sy - sy - 10);
	}
	pickBuilding(sx, sy) {
		let best = null;
		let bestD = 1e9;
		for (const b of this.buildings) {
			if (b.hp <= 0) continue;
			const d = this.buildingDist(sx, sy, b);
			const def = BLDS[b.kind];
			const rad = Math.max(84, (def.w + def.h) * 18 * this.zoom);
			if (d < rad && d < bestD) {
				bestD = d;
				best = b;
			}
		}
		return best;
	}
	buildingDist(sx, sy, b) {
		const def = BLDS[b.kind];
		const p = this.worldToScreen(b.x + def.w / 2, b.y + def.h / 2);
		return Math.hypot(sx - p.sx, (sy - (p.sy - 16 * this.zoom)) * .82);
	}
	pickDrop(sx, sy) {
		let best = null;
		let bestD = 22;
		for (const d of this.drops) {
			const p = this.worldToScreen(d.x, d.y);
			const distP = Math.hypot(p.sx - sx, p.sy - sy);
			if (distP < bestD) {
				bestD = distP;
				best = d;
			}
		}
		return best;
	}
	dropDist(sx, sy, d) {
		const p = this.worldToScreen(d.x, d.y);
		return Math.hypot(p.sx - sx, p.sy - sy);
	}
	pickNode(sx, sy) {
		let best = null;
		let bestD = 96;
		for (const n of this.nodes) {
			if (n.amount <= 0 || n.kind === "farm" || n.kind === "den") continue;
			const d = this.nodeDist(sx, sy, n);
			if (d < bestD) {
				bestD = d;
				best = n;
			}
		}
		return best;
	}
	nodeDist(sx, sy, n) {
		const wide = n.kind === "gold" || n.kind === "stone";
		const p = this.worldToScreen(n.x + (wide ? 1 : n.kind === "tree" ? 0 : .5), n.y + (wide ? 1 : n.kind === "tree" ? 0 : .5));
		const cy = n.kind === "tree" ? p.sy - 18 * this.zoom : p.sy;
		return Math.hypot(sx - p.sx, sy - cy);
	}
	selectAt(sx, sy, screenDouble = false) {
		const world = this.screenToWorld(sx, sy);
		if (this.placing) {
			this.placeBuilding(this.placing, Math.floor(world.x), Math.floor(world.y));
			return;
		}
		const node = this.pickNode(sx, sy);
		const b = this.pickBuilding(sx, sy);
		const unit = this.pickUnit(sx, sy);
		const nd = node ? this.nodeDist(sx, sy, node) : 1e9;
		const bd = b ? this.buildingDist(sx, sy, b) : 1e9;
		const ud = unit ? this.unitDist(sx, sy, unit) : 1e9;
		if (unit && unit.team === this.playerTeam && ud <= bd && ud <= nd) {
			this.pickOwned(unit, screenDouble, this.shiftSelect);
			return;
		}
		const home = this.selectedBuilding != null ? this.building(this.selectedBuilding) : null;
		const producer = !!home && home.team === this.playerTeam && (home.kind === "townhall" || home.kind === "barracks" || home.kind === "range" || home.kind === "stable" || home.kind === "school" || home.kind === "altar" || home.kind === "temple" || home.kind === "keep" || home.kind === "yard");
		if (producer && home) {
			const otherBuilding = b && b.id !== home.id && bd <= nd;
			if (!otherBuilding && !(b && b.id === home.id && bd <= nd)) {
				home.rally = { x: world.x, y: world.y };
				this.say("Gather point set.");
				this.blip(640, .04, .03);
				this.emit();
				return;
			}
		}
		if (b && bd <= nd) {
			if (this.shiftSelect) return;
			this.selectedBuilding = b.id;
			this.selectedUnits = [];
			this.blip(500, .04, .03);
			this.emit();
			return;
		}
		if (this.shiftSelect) return;
		this.selectedUnits = [];
		this.selectedBuilding = null;
		this.emit();
	}
	orderHint(sx, sy) {
		if (this.phase !== "play" || this.placing) return "";
		const node = this.pickNode(sx, sy);
		const b = this.pickBuilding(sx, sy);
		const unit = this.pickUnit(sx, sy);
		const nd = node ? this.nodeDist(sx, sy, node) : 1e9;
		const bd = b ? this.buildingDist(sx, sy, b) : 1e9;
		const ud = unit ? this.unitDist(sx, sy, unit) : 1e9;
		const stock = (n) => {
			const name = n.kind === "tree" ? "Wood" : n.kind === "gold" ? "Gold" : n.kind === "stone" ? "Stone" : n.kind === "berry" ? "Berries" : n.kind === "fish" ? "Fish" : n.kind === "farm" ? "Farm" : n.kind === "sheep" ? "Sheep" : n.kind;
			return `${name} · ${Math.max(0, Math.ceil(n.amount))}`;
		};
		const mine = this.selectedUnits.some((id) => this.unit(id)?.team === this.playerTeam);
		if (!mine) {
			if (unit && unit.team === this.playerTeam && ud <= bd && ud <= nd) return "Select";
			if (b && bd <= nd) return BLDS[b.kind].name;
			if (node && nd < 1e8 && node.kind !== "den") return stock(node);
			return "";
		}
		if (unit && unit.team !== this.playerTeam && ud <= nd && ud <= bd) return this.edgeWord(unit.kind);
		if (b && bd <= nd) {
			if (b.team !== this.playerTeam) return "Attack";
			if (b.progress < 1) return "Build";
			if (b.hp < this.bldMax(b.kind, b.team) - .5) return "Repair";
			if (b.kind === "farm") return "Farm";
			if (b.kind === "shop") return "Shop";
			return "Move";
		}
		if (node && node.kind !== "den" && nd < 1e8) return stock(node);
		return "Move";
	}
	edgeWord(kind) {
		const mine = this.selectedUnits.map((id) => this.unit(id)).filter((u) => u && u.kind !== "villager");
		if (!mine.length) return "Attack";
		const avg = mine.reduce((sum, u) => sum + this.matchup(u.kind, kind), 0) / mine.length;
		if (avg >= 1.25) return "Attack · good";
		if (avg <= 0.85) return "Attack · poor";
		return "Attack";
	}
	placeBuilding(kind, x, y) {
		if (this.age[this.playerTeam] < BLDS[kind].age) {
			this.say(BLDS[kind].age >= 4 ? "Age 5 required." : BLDS[kind].age >= 3 ? "Age 4 required." : BLDS[kind].age >= 2 ? "Age 3 required." : "Village Age required.");
			return;
		}
		if (!this.canPlace(kind, x, y)) {
			this.say("Can't build there.");
			return;
		}
		if (!this.spend(this.playerTeam, BLDS[kind].cost)) {
			this.say(`Need ${costText(BLDS[kind].cost)}.`);
			return;
		}
		const id = this.addBuilding(kind, this.playerTeam, x, y, false);
		for (const uid of this.selectedUnits) {
			const u = this.unit(uid);
			if (u && u.kind === "villager") {
				u.hold = false;
				u.next = [];
				this.setOrder(u, { type: "build", buildingId: id });
			}
		}
		this.placing = null;
		this.blip(600, .04, .04);
		this.emit();
	}
	commandAt(sx, sy) {
		if (this.placing) {
			const world = this.screenToWorld(sx, sy);
			this.placeBuilding(this.placing, Math.floor(world.x), Math.floor(world.y));
			return;
		}
		const mine = this.selectedUnits.map((id) => this.unit(id)).filter((u) => !!u && u.team === this.playerTeam);
		if (!mine.length) return;
		const world = this.screenToWorld(sx, sy);
		this.ping(world.x, world.y);
		const node = this.pickNode(sx, sy);
		const b = this.pickBuilding(sx, sy);
		const unit = this.pickUnit(sx, sy);
		const drop = this.pickDrop(sx, sy);
		const nd = node ? this.nodeDist(sx, sy, node) : 1e9;
		const bd = b ? this.buildingDist(sx, sy, b) : 1e9;
		const ud = unit ? this.unitDist(sx, sy, unit) : 1e9;
		const dd = drop ? this.dropDist(sx, sy, drop) : 1e9;
		if (drop && dd <= nd && dd <= bd && dd <= ud) {
			for (const u of mine) this.setOrder(u, { type: "pickup", dropId: drop.id });
			this.emit();
			return;
		}
		if (unit && unit.captive && ud <= nd && ud <= bd) {
			for (const u of mine) if (u.kind === "hero" || u.kind === "villager") this.setOrder(u, { type: "move", x: unit.x, y: unit.y });
			if (this.campClear(unit)) this.freeCaptive(unit);
			else this.say("Guards still hold your people.");
			this.emit();
			return;
		}
		if (unit && unit.team === this.foeTeam() && ud <= nd && ud <= bd) {
			for (const u of mine) this.setOrder(u, { type: "attack", id: unit.id, building: false });
			this.emit();
			return;
		}
		if (b && bd <= nd) {
			if (b.team === this.foeTeam()) {
				for (const u of mine) this.setOrder(u, { type: "attack", id: b.id, building: true });
				this.emit();
				return;
			}
			if (b.progress < 1) {
				for (const u of mine) if (u.kind === "villager") this.setOrder(u, { type: "build", buildingId: b.id });
				this.emit();
				return;
			}
			if (b.hp < this.bldMax(b.kind, b.team) - .5) {
				const fixers = mine.filter((u) => u.kind === "villager");
				if (fixers.length) {
					for (const u of fixers) this.setOrder(u, { type: "repair", buildingId: b.id });
					this.emit();
					return;
				}
			}
			if (b.kind === "farm") {
				const crop = this.nodes.find((n) => n.buildingId === b.id && n.amount > 0);
				if (crop) {
					for (const u of mine) if (u.kind === "villager") this.setOrder(u, { type: "gather", nodeId: crop.id });
					this.emit();
					return;
				}
			}
			if (b.kind === "shop" && b.team === this.playerTeam) {
				const shoppers = mine.filter((u) => this.isShopper(u));
				if (shoppers.length) {
					this.patrons = shoppers.map((u) => u.id);
					for (const u of shoppers) this.setOrder(u, { type: "shop", buildingId: b.id });
					this.selectedBuilding = b.id;
					this.selectedUnits = [];
					this.say(shoppers.length > 1 ? "Your warriors are at the shop." : `${this.unitName(shoppers[0].team, shoppers[0].kind)} is at the shop.`);
					this.emit();
					return;
				}
			}
			const cols = Math.max(1, Math.ceil(Math.sqrt(mine.length)));
			mine.forEach((u, i) => {
				const col = i % cols;
				const row = Math.floor(i / cols);
				this.setOrder(u, {
					type: "move",
					x: world.x + (col - (cols - 1) / 2) * .75,
					y: world.y + (row - (Math.ceil(mine.length / cols) - 1) / 2) * .75,
					attackMove: u.kind !== "villager"
				});
			});
			this.emit();
			return;
		}
		if (node && node.alive && (node.kind === "sheep" || node.kind === "nest" || node.kind === "cart" || beastOf(node.kind))) {
			if (node.yield) {
				const tamers = mine.filter((u) => u.kind === "tamer");
				if (tamers.length) {
					for (const u of tamers) {
						u.leash = node.id;
						node.keeper = node.keeper ?? u.id;
						this.setOrder(u, { type: "idle" });
					}
					this.say("The tamer is calming the beast.");
					this.emit();
					return;
				}
			}
			for (const u of mine) this.setOrder(u, { type: "gather", nodeId: node.id });
			this.emit();
			return;
		}
		const vills = mine.filter((u) => u.kind === "villager");
		if (node && node.kind !== "den" && vills.length) {
			for (const u of vills) this.setOrder(u, { type: "gather", nodeId: node.id });
			for (const u of mine) {
				if (u.kind !== "villager") this.setOrder(u, { type: "move", x: world.x, y: world.y, attackMove: true });
			}
			this.emit();
			return;
		}
		const cols = Math.max(1, Math.ceil(Math.sqrt(mine.length)));
		mine.forEach((u, i) => {
			const col = i % cols;
			const row = Math.floor(i / cols);
			const ox = (col - (cols - 1) / 2) * .75;
			const oy = (row - (Math.ceil(mine.length / cols) - 1) / 2) * .75;
			this.setOrder(u, {
				type: "move",
				x: world.x + ox,
				y: world.y + oy,
				attackMove: u.kind !== "villager"
			});
		});
		this.emit();
	}
	paint() {
		const ctx = this.ctx;
		const canvas = this.canvas;
		if (!ctx || !canvas || !this.drawFn) return;
		if (this.phase !== "menu") this.reveal();
		this.drawFn(this, ctx, canvas.clientWidth, canvas.clientHeight);
	}
	paintMinimap(ctx, w, h) {
		ctx.clearRect(0, 0, w, h);
		const sx = w / MAP_W;
		const sy = h / MAP_H;
		const step = Math.max(1, Math.ceil(MAP_W / Math.max(1, w)));
		for (let y = 0; y < MAP_H; y += step) {
			for (let x = 0; x < MAP_W; x += step) {
				const i = y * MAP_W + x;
				if (this.phase !== "menu" && this.explored[i] !== 1) {
					ctx.fillStyle = "#0c1810";
					ctx.fillRect(x * sx, y * sy, sx * step + .5, sy * step + .5);
					continue;
				}
				const t = this.tiles[i];
				ctx.fillStyle = t.terrain === "water" ? "#3480c4" : t.terrain === "sand" ? "#e7d3a2" : t.terrain === "rock" ? "#8e959c" : t.terrain === "snow" ? "#e7f1f8" : t.terrain === "marsh" ? "#3d5a3a" : t.terrain === "grave" ? "#5a5362" : t.terrain === "dirt" ? "#c6a56f" : t.node >= 0 && this.nodes[t.node]?.kind === "tree" && this.nodes[t.node].amount > 0 ? "#2f7a34" : this.weather().snow ? "#d5e4c4" : "#67a84a";
				ctx.fillRect(x * sx, y * sy, sx * step + .5, sy * step + .5);
			}
		}
		for (const b of this.buildings) {
			if (b.hp <= 0) continue;
			if (this.phase !== "menu" && !this.footSeen(b)) continue;
			const d = BLDS[b.kind];
			ctx.fillStyle = this.isEgypt(b.team) ? "#1a4f7a" : b.team === 0 ? "#2a5bd7" : "#c4502a";
			ctx.fillRect(b.x * sx, b.y * sy, d.w * sx, d.h * sy);
		}
		for (const n of this.nodes) {
			if (!beastOf(n.kind) || !n.alive) continue;
			const i = n.y * MAP_W + n.x;
			if (this.phase !== "menu" && this.explored[i] !== 1) continue;
			ctx.fillStyle = n.kind === "troll" ? "#3f7a4a" : n.kind === "spider" ? "#241f28" : n.kind === "boar" ? "#6b4a32" : "#c46a28";
			ctx.fillRect(n.x * sx, n.y * sy, Math.max(2, sx * 1.6), Math.max(2, sy * 1.6));
		}
		for (const n of this.nodes) {
			if (n.kind !== "nest" || !n.alive) continue;
			const i = n.y * MAP_W + n.x;
			if (this.phase !== "menu" && this.explored[i] !== 1) continue;
			ctx.fillStyle = "#3e2a1c";
			ctx.fillRect(n.x * sx, n.y * sy, Math.max(3, sx * 2), Math.max(3, sy * 2));
		}
		for (const n of this.nodes) {
			if (!BOSSES[n.kind] || !n.alive) continue;
			const i = n.y * MAP_W + n.x;
			if (this.phase !== "menu" && this.explored[i] !== 1) continue;
			ctx.fillStyle = "#e2b340";
			ctx.fillRect(n.x * sx - 1, n.y * sy - 1, Math.max(4, sx * 2.4), Math.max(4, sy * 2.4));
		}
		for (const n of this.nodes) {
			if (n.kind !== "cart" || !n.alive) continue;
			ctx.fillStyle = "#e2b340";
			ctx.fillRect(n.x * sx, n.y * sy, Math.max(3, sx * 1.8), Math.max(3, sy * 1.8));
		}
		for (const d of this.drops) {
			const i = Math.floor(d.y) * MAP_W + Math.floor(d.x);
			if (this.phase !== "menu" && this.explored[i] !== 1) continue;
			ctx.fillStyle = "#e2b340";
			ctx.fillRect(d.x * sx, d.y * sy, Math.max(2, sx), Math.max(2, sy));
		}
		for (const u of this.units) {
			if (u.hp <= 0) continue;
			if (u.kind === "scout" && u.team !== this.playerTeam && !this.scoutSeen(u)) continue;
			if (this.phase !== "menu" && u.team !== this.playerTeam && !this.inSight(u.x, u.y)) continue;
			ctx.fillStyle = this.isEgypt(u.team) ? "#e6d3a1" : u.team === 0 ? "#d7e4ff" : "#ffd0c2";
			ctx.fillRect(u.x * sx - 1, u.y * sy - 1, 2, 2);
		}
		const { w: vw, h: vh } = this.viewSize();
		const hw = vw / this.zoom / TW / 2;
		const hh = vh / this.zoom / TH / 2;
		ctx.strokeStyle = "#1c1915";
		ctx.lineWidth = 1;
		ctx.strokeRect((this.fx - hw) * sx, (this.fy - hh) * sy, hw * 2 * sx, hh * 2 * sy);
	}
	minimapClick(px, py, w, h) {
		this.fx = Math.min(MAP_W - 1, Math.max(0, px / w * MAP_W));
		this.fy = Math.min(MAP_H - 1, Math.max(0, py / h * MAP_H));
	}
}


export type UnitKind = "villager" | "club" | "warrior" | "sword" | "cavalry" | "knight" | "archer" | "crossbow" | "scout" | "tamer" | "halberd" | "mage" | "frost" | "priest" | "warlock" | "guard" | "spear" | "hero" | "demigod" | "avatar" | "god" | "ram" | "catapult" | "ballista";
export type BldKind = "townhall" | "house" | "dump" | "farm" | "barracks" | "range" | "stable" | "school" | "smith" | "husbandry" | "tower" | "wall" | "altar" | "shop" | "keep" | "temple" | "yard";
export type NodeKind = "tree" | "berry" | "gold" | "stone" | "sheep" | "farm" | "fish" | "lion" | "wolf" | "boar" | "spider" | "troll" | "nest" | "alpha" | "brood" | "gore" | "chief" | "cart";
export type ResKind = "food" | "wood" | "gold" | "stone";
export type CmdId = string;
export type Order =
  | { type: "idle" }
  | { type: "move"; x: number; y: number; attackMove: boolean }
  | { type: "gather"; nodeId: number }
  | { type: "drop"; resume: number }
  | { type: "build"; buildingId: number; resume?: number }
  | { type: "repair"; buildingId: number }
  | { type: "rally"; x: number; y: number }
  | { type: "attack"; id: number; building: boolean }
  | { type: "enter"; buildingId: number; as: "spear" | "villager" | "stay" }
  | { type: "held"; buildingId: number; as: "spear" | "villager" | "stay" }
  | { type: "pickup"; dropId: number }
  | { type: "shop"; buildingId: number };
export type Node = {
  id: number;
  kind: NodeKind;
  x: number;
  y: number;
  amount: number;
  max: number;
  base?: number;
  buildingId: number;
  hp: number;
  alive: boolean;
  bite?: number;
  pace?: number;
  rare?: boolean;
  aura?: number;
};
export type Unit = {
  id: number;
  kind: UnitKind;
  team: 0 | 1;
  x: number;
  y: number;
  hp: number;
  right: boolean;
  anim: number;
  order: Order;
  path: { x: number; y: number }[];
  pathI: number;
  repath: number;
  carry: number;
  carryKind: ResKind | null;
  toolNode: number;
  attackCd: number;
  hit: number;
  down: number;
  stealth: boolean;
  ambush: boolean;
  spell: number;
  held?: number;
  holdT?: number;
  safe?: number;
  job?: Order | null;
  stashHp?: number;
  vanished?: boolean;
  vanishCd?: number;
  level?: number;
  xp?: number;
  cleaveCd?: number;
  cryCd?: number;
  waveCd?: number;
  cry?: number;
  chargeCd?: number;
  mendCd?: number;
  slow?: number;
  banner?: number;
  dread?: number;
  want?: string | null;
  gear?: string[];
};
export type Building = {
  id: number;
  kind: BldKind;
  team: 0 | 1;
  x: number;
  y: number;
  hp: number;
  progress: number;
  queue: UnitKind[];
  trainT: number;
  ageT: number;
  attackCd: number;
  hit: number;
  rally: { x: number; y: number } | null;
  lore: boolean;
  detect?: boolean;
  reviveT?: number;
};
export type SnapCmd = { id: string; label: string; cost: string; disabled: boolean; hint: string; pie?: number };
export type Snap = {
  phase: string;
  food: number;
  wood: number;
  gold: number;
  stone: number;
  pop: number;
  cap: number;
  age: number;
  ageT: number;
  time: number;
  toast: string;
  dare: string;
  fury: number;
  rpg?: boolean;
  bosses?: string;
  need: string;
  alarm: boolean;
  placing: string | null;
  speed: number;
  sfx: number;
  music: number;
  controls: Controls;
  capture: string;
  selection: null | {
    title: string;
    subtitle: string;
    hp: number;
    maxHp: number;
    team: number;
    commands: SnapCmd[];
    queue: string[];
  };
};
