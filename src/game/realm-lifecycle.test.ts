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
