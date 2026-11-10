import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { endModalBody } from "./end-card.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

const TALE_HOME = "Your people are home. The wild is yours.";
const TALE_CLEAR = "The wild is clear. The champion stands.";
const TALE_FALL = "The champion is gone, and the altar with them.";
const HALL_WIN = "Their hall has fallen.";
const HALL_LOSE = "Your town hall is lost.";
const SKIRMISH_WIN = "Their hall is down.";
const SKIRMISH_LOSE = "They took your hall. A tower and a few soldiers help hold the crossing.";

describe("end modal copy", () => {
	it("uses a Tale win toast instead of the hall sentence", () => {
		assert.equal(endModalBody("win", TALE_HOME, true), TALE_HOME);
		assert.equal(endModalBody("win", TALE_CLEAR, true), TALE_CLEAR);
		assert.equal(endModalBody("win", TALE_HOME, true).includes("hall"), false);
		assert.equal(endModalBody("win", TALE_CLEAR, true).includes("hall"), false);
	});

	it("uses the champion toast for a Tale loss, and the hall toast when the hall fell", () => {
		assert.equal(endModalBody("lose", TALE_FALL, true), TALE_FALL);
		assert.equal(endModalBody("lose", HALL_LOSE, true), HALL_LOSE);
	});

	it("falls back without quoting a mid-match toast or a Tale hall victory", () => {
		assert.equal(endModalBody("win", "", true), TALE_CLEAR);
		assert.equal(endModalBody("win", "Gather wood and food. A dare is waiting under the resources.", true), TALE_CLEAR);
		assert.equal(endModalBody("lose", "", true), TALE_FALL);
		assert.equal(endModalBody("win", "", false), SKIRMISH_WIN);
		assert.equal(endModalBody("lose", "", false), SKIRMISH_LOSE);
		assert.equal(endModalBody("win", HALL_WIN, false), HALL_WIN);
		assert.equal(endModalBody("lose", HALL_LOSE, false), HALL_LOSE);
	});

	it("points the Stickhold overlay at the helper", () => {
		const source = readFileSync(join(root, "src/components/stickhold.tsx"), "utf8");
		assert.match(source, /endModalBody\(phase, snap\?\.toast \?\? "", !!snap\?\.rpg\)/);
		assert.equal(source.includes(SKIRMISH_WIN), false);
		assert.equal(source.includes("They took your hall."), false);
	});
});

describe("public name", () => {
	it("titles the share card Stickhold and drops the pumpkin favicon", () => {
		const site = JSON.parse(readFileSync(join(root, "src/lib/og/site.json"), "utf8"));
		assert.equal(site.title, "Stickhold");
		assert.equal(site.type, "x:game");
		assert.equal(site.card, "custom");
		const icon = readFileSync(join(root, "public/favicon.svg"), "utf8");
		assert.match(icon, /#2a5bd7/i);
		assert.equal(icon.includes("#e07a2f"), false);
		assert.equal(/pumpkin/i.test(icon), false);
	});
});
