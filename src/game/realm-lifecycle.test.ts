import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Realm } from "./engine.ts";

const TECH_KEYS = ["structure", "weaponry", "siege", "fortitude", "efficiency", "economy", "ward", "rampart"];

function skirmish(seed = 11) {
	const realm = new Realm(seed);
	realm.rpg = false;
	realm.mapSpan = 108;
	realm.playerTeam = 0;
	realm.faction = "stick";
	realm.mood = "normal";
	realm.rich = 1;
	realm.mapRich = 1;
	realm.difficulty = 1;
	return realm;
}

function worldSig(realm) {
	const units = realm.units.map((u) => `${u.team}:${u.kind}@${u.x},${u.y}`).sort();
	const buildings = realm.buildings.map((b) => `${b.team}:${b.kind}@${b.x},${b.y}`).sort();
	return { units, buildings };
}

function writeRanks(realm) {
	for (const side of realm.tech) {
		side.structure = 2;
		side.weaponry = 4;
		side.siege = 1;
		side.fortitude = 3;
		side.efficiency = 2;
		side.economy = 1;
		side.ward = 2;
		side.rampart = 1;
	}
}

function assertRanksZero(realm) {
	for (const side of realm.tech) {
		for (const key of TECH_KEYS) {
			assert.equal(side[key] ?? 0, 0, `tech.${key}`);
		}
	}
}

describe("match reset", () => {
	it("same-size Skirmish start regenerates the world and clears match progress", () => {
		const realm = skirmish(11);
		const seed = realm.seed;
		realm.start();
		assert.equal(realm.phase, "play");
		assert.equal(realm.seed, 11);
		const started = worldSig(realm);
		assert.ok(started.units.length > 0);
		assert.equal(started.buildings.filter((b) => b.startsWith("0:townhall@") || b.startsWith("1:townhall@")).length, 2);

		realm.time = 90;
		realm.age = [3, 2];
		writeRanks(realm);
		realm.stock[0].food = 1;
		realm.stock[0].wood = 1;
		realm.stock[1].gold = 7;
		realm.fury = 12;
		realm.militiaLeft = 20;
		realm.militiaCd = 9;
		realm.selectedUnits = [realm.units[0].id];
		realm.selectedBuilding = realm.buildings[0].id;
		realm.groups[1] = [realm.units[0].id];
		realm.tale = { need: 4, freed: 2, home: 1, joined: 1 };
		for (const u of realm.units) {
			u.x = 1;
			u.y = 1;
		}
		realm.buildings.push({
			id: 900001,
			kind: "barracks",
			team: 0,
			x: 4,
			y: 4,
			hp: 300,
			progress: 1,
			queue: [],
			trainT: 0,
			ageT: 0,
			attackCd: 0,
			hit: 0,
			rally: null,
			lore: false,
			detect: false,
			reviveT: 0,
		});

		realm.mapSpan = 108;
		realm.start();

		assert.equal(realm.phase, "play");
		assert.equal(realm.seed, seed);
		assert.equal(realm.time, 0);
		assert.deepEqual(realm.age, [0, 0]);
		assertRanksZero(realm);
		assert.equal(realm.fury, 0);
		assert.equal(realm.militiaLeft, 0);
		assert.equal(realm.militiaCd, 0);
		assert.deepEqual(realm.selectedUnits, []);
		assert.equal(realm.selectedBuilding, null);
		assert.deepEqual(realm.groups[1], []);
		assert.equal(realm.tale, null);
		assert.equal(realm.buildings.some((b) => b.kind === "barracks" || b.id === 900001), false);
		assert.deepEqual(worldSig(realm), started);
		assert.deepEqual(realm.stock[0], { food: 200, wood: 200, gold: 80, stone: 50 });
		assert.deepEqual(realm.stock[1], { food: 200, wood: 220, gold: 80, stone: 50 });
		const hall = realm.buildings.find((b) => b.team === 0 && b.kind === "townhall");
		assert.equal(hall.x, realm.scaleN(66));
		assert.equal(hall.y, realm.scaleN(66));
	});

	it("North start places the player town hall on the north pad", () => {
		const realm = skirmish(11);
		realm.playerTeam = 1;
		realm.start();
		const hall = realm.buildings.find((b) => b.team === realm.playerTeam && b.kind === "townhall");
		assert.ok(hall);
		assert.equal(hall.x, realm.scaleN(18));
		assert.equal(hall.y, realm.scaleN(18));
		const foe = realm.buildings.find((b) => b.team === 0 && b.kind === "townhall");
		assert.ok(foe);
		assert.equal(foe.x, realm.scaleN(66));
		assert.equal(foe.y, realm.scaleN(66));
		assert.equal(realm.phase, "play");
		assert.equal(realm.seed, 11);
	});

	it("restart clears researched tech, rolls a new seed, and resets age", () => {
		const realm = skirmish(11);
		realm.start();
		writeRanks(realm);
		realm.age = [4, 4];
		realm.fury = 6;
		realm.time = 40;
		const before = realm.seed;
		realm.restart();
		assert.notEqual(realm.seed, before);
		assert.equal(realm.phase, "play");
		assert.equal(realm.time, 0);
		assert.deepEqual(realm.age, [0, 0]);
		assertRanksZero(realm);
		assert.equal(realm.fury, 0);
		assert.equal(realm.playerTeam, 0);
		assert.equal(realm.faction, "stick");
		assert.equal(realm.rpg, false);
		assert.equal(realm.mapSpan, 108);
		assert.deepEqual(realm.stock[0], { food: 200, wood: 200, gold: 80, stone: 50 });
		assert.deepEqual(realm.stock[1], { food: 200, wood: 220, gold: 80, stone: 50 });
	});

	it("Insanity restart keeps the enemy age bump and still clears tech", () => {
		const realm = skirmish(11);
		realm.playerTeam = 0;
		realm.difficulty = 3;
		realm.start();
		writeRanks(realm);
		realm.age = [2, 2];
		const before = realm.seed;
		realm.restart();
		assert.notEqual(realm.seed, before);
		assert.equal(realm.difficulty, 3);
		assertRanksZero(realm);
		assert.equal(realm.age[realm.playerTeam], 0);
		assert.equal(realm.age[realm.foeTeam()], 1);
		const foe = realm.stock[realm.foeTeam()];
		assert.equal(foe.food, 1200);
		assert.equal(foe.wood, 1220);
		assert.equal(foe.gold, 1080);
		assert.equal(foe.stone, 1050);
		assert.deepEqual(realm.stock[realm.playerTeam], { food: 200, wood: 200, gold: 80, stone: 50 });
	});
});

function tale(seed = 11) {
	const realm = skirmish(seed);
	realm.rpg = true;
	realm.mapSpan = 108;
	return realm;
}

function unitSig(units) {
	return units.map((u) => ({ id: u.id, kind: u.kind, team: u.team, x: u.x, y: u.y, hp: u.hp }));
}

function installMemoryStorage() {
	const mem = new Map();
	const store = {
		getItem(key) {
			return mem.has(key) ? mem.get(key) : null;
		},
		setItem(key, value) {
			mem.set(String(key), String(value));
		},
		removeItem(key) {
			mem.delete(String(key));
		},
		clear() {
			mem.clear();
		},
		key(index) {
			return [...mem.keys()][index] ?? null;
		},
		get length() {
			return mem.size;
		},
	};
	const had = Object.prototype.hasOwnProperty.call(globalThis, "localStorage");
	const prev = globalThis.localStorage;
	globalThis.localStorage = store;
	return {
		mem,
		restore() {
			if (had) globalThis.localStorage = prev;
			else delete globalThis.localStorage;
		},
	};
}

function standOnPad(realm, originX, originY) {
	const cx = originX + 1.5;
	const cy = originY + 1.5;
	let best = null;
	let bestD = Infinity;
	for (let y = originY - 1; y <= originY + 3; y++) {
		for (let x = originX - 1; x <= originX + 3; x++) {
			if (!realm.walkable(x, y)) continue;
			const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
			if (d < bestD) {
				bestD = d;
				best = { x: x + 0.5, y: y + 0.5, tx: x, ty: y };
			}
		}
	}
	return best;
}

describe("tale fate", () => {
	it("starts a tale with one player hall, a hero, and tale progress", () => {
		const realm = tale(11);
		realm.start();
		const halls = realm.buildings.filter((b) => b.kind === "townhall");
		assert.equal(halls.length, 1);
		assert.equal(halls[0].team, realm.playerTeam);
		assert.equal(realm.buildings.some((b) => b.team === realm.foeTeam() && b.kind === "townhall"), false);
		const hero = realm.units.find((u) => u.team === realm.playerTeam && u.kind === "hero" && u.hp > 0);
		assert.ok(hero);
		assert.ok(realm.tale);
		assert.equal(typeof realm.tale.need, "number");
		assert.equal(realm.phase, "play");
	});

	it("wins a tale when boss nodes are dead and nobody is waiting", () => {
		const realm = tale(11);
		realm.start();
		const bosses = realm.bossNodes();
		assert.ok(bosses.length > 0, "seed 11 tale has boss nodes");
		for (const node of bosses) {
			node.alive = false;
			assert.ok(node.amount > 0);
		}
		for (const unit of realm.units) {
			unit.captive = false;
			if (unit.rescued) unit.settled = true;
		}
		const waiting = realm.units.some((u) => u.hp > 0 && (u.captive || (u.rescued && !u.settled)));
		assert.equal(waiting, false);
		assert.ok(realm.bossNodes().length > 0);
		assert.ok(realm.bossNodes().every((n) => !n.alive));
		realm.rpgFate();
		assert.equal(realm.phase, "win");
		const toast = realm.tale?.need
			? "Your people are home. The wild is yours."
			: "The wild is clear. The champion stands.";
		assert.equal(realm.toast, toast);
	});

	it("loses a tale when the hero is gone, heroFallen is set, and the altar is gone", () => {
		const realm = tale(11);
		realm.start();
		assert.equal(realm.phase, "play");
		assert.ok(realm.bossNodes().some((n) => n.alive));
		const hero = realm.units.find((u) => u.team === realm.playerTeam && u.kind === "hero");
		assert.ok(hero);
		assert.ok(realm.buildings.some((b) => b.team === realm.playerTeam && b.kind === "altar" && b.hp > 0));
		realm.units = realm.units.filter((u) => u.id !== hero.id);
		realm.buildings = realm.buildings.filter((b) => !(b.team === realm.playerTeam && b.kind === "altar"));
		realm.heroFallen[realm.playerTeam] = { level: 1, xp: 0 };
		realm.rpgFate();
		assert.equal(realm.phase, "lose");
		assert.equal(realm.toast, "The champion is gone, and the altar with them.");
	});
});

describe("same-step halls", () => {
	it("a same-step trade of both town halls is a loss", () => {
		const realm = skirmish(11);
		realm.start();
		const halls = realm.buildings.filter((b) => b.kind === "townhall");
		assert.deepEqual(halls.map((b) => b.team), [realm.playerTeam, realm.foeTeam()]);
		for (const hall of halls) hall.hp = 0;
		realm.reap();
		assert.equal(realm.phase, "lose");
		assert.equal(realm.toast, "Your town hall is lost.");
		assert.equal(realm.buildings.some((b) => b.kind === "townhall"), false);
	});
});

describe("save and load", () => {
	it("restores a 54-map save from an in-memory localStorage", () => {
		const stub = installMemoryStorage();
		try {
			const realm = skirmish(11);
			realm.mapSpan = 54;
			realm.start();
			assert.equal(realm.tiles.length, 54 * 54);
			assert.equal(realm.phase, "play");
			const before = unitSig(realm.units);
			assert.ok(before.length > 0);
			assert.equal(realm.saveGame(1), true);
			const raw = stub.mem.get("stickhold-save");
			assert.equal(typeof raw, "string");
			const data = JSON.parse(raw);
			assert.equal(data.terrain.length, 54 * 54);
			realm.units = [];
			realm.phase = "menu";
			assert.equal(realm.loadGame(1), true);
			assert.equal(realm.phase, "play");
			assert.equal(realm.tiles.length, 54 * 54);
			assert.equal(realm.mapSpan, 54);
			assert.deepEqual(unitSig(realm.units), before);
		} finally {
			stub.restore();
		}
	});

	it("records save payload size for 216 and 432", { timeout: 180000 }, () => {
		const stub = installMemoryStorage();
		try {
			const recorded = [];
			for (const span of [216, 432]) {
				const realm = skirmish(11);
				realm.mapSpan = span;
				realm.start();
				assert.equal(realm.tiles.length, span * span);
				const saved = realm.saveGame(1);
				const raw = stub.mem.get("stickhold-save") || "";
				const bytes = Buffer.byteLength(raw);
				let terrain = 0;
				if (raw) terrain = JSON.parse(raw).terrain?.length ?? 0;
				recorded.push({ span, saved, bytes, terrain });
				assert.equal(typeof saved, "boolean");
				if (saved) {
					assert.equal(terrain, span * span);
					assert.equal(bytes > span * span, true);
				}
			}
			assert.equal(recorded.length, 2);
		} finally {
			stub.restore();
		}
	});
});

describe("findPath pads", () => {
	const known = {
		54: { from: [34, 32], to: [10, 8], length: 29 },
		108: { from: [67, 65], to: [19, 17], length: 55 },
	};
	for (const span of [54, 108]) {
		it(`seed 11 finds a path from the south pad to the north pad on ${span}`, () => {
			const realm = skirmish(11);
			realm.mapSpan = span;
			realm.start();
			const south = standOnPad(realm, realm.scaleN(66), realm.scaleN(66));
			const north = standOnPad(realm, realm.scaleN(18), realm.scaleN(18));
			assert.ok(south, "south pad has a walkable cell");
			assert.ok(north, "north pad has a walkable cell");
			const path = realm.findPath(south.x, south.y, north.x, north.y, null, null);
			assert.ok(Array.isArray(path));
			const expect = known[span];
			assert.deepEqual([south.tx, south.ty], expect.from);
			assert.deepEqual([north.tx, north.ty], expect.to);
			assert.equal(path.length, expect.length);
			for (const point of path) {
				assert.equal(typeof point.x, "number");
				assert.equal(typeof point.y, "number");
			}
			assert.equal(path[path.length - 1].x, north.x);
			assert.equal(path[path.length - 1].y, north.y);
		});
	}
});
