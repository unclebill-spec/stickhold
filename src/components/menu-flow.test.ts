import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  continueSlot,
  foeShort,
  matchDetail,
  matchSummary,
  otherSaveSlots,
  sizeShort,
  startLabel,
  type MatchSetup,
} from "./menu-flow.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

const skirmish: MatchSetup = {
  playMode: "realm",
  side: 0,
  people: "stick",
  mood: "aggressive",
  sizeStep: 1,
  diffStep: 2,
};

const tale: MatchSetup = {
  playMode: "rpg",
  side: 1,
  people: "coven",
  mood: "normal",
  sizeStep: 3,
  diffStep: 3,
};

describe("menu save slots", () => {
  it("continues the lowest filled slot", () => {
    assert.equal(continueSlot([false, false, false]), null);
    assert.equal(continueSlot([true, false, false]), 1);
    assert.equal(continueSlot([false, true, false]), 2);
    assert.equal(continueSlot([false, false, true]), 3);
    assert.equal(continueSlot([true, true, true]), 1);
    assert.equal(continueSlot([false, true, true]), 2);
  });

  it("lists the other filled slots", () => {
    assert.deepEqual(otherSaveSlots([false, false, false]), []);
    assert.deepEqual(otherSaveSlots([true, false, false]), []);
    assert.deepEqual(otherSaveSlots([true, true, true]), [2, 3]);
    assert.deepEqual(otherSaveSlots([false, true, true]), [3]);
    assert.deepEqual(otherSaveSlots([true, false, true]), [3]);
  });
});

describe("menu match summary", () => {
  it("names the one-click start", () => {
    assert.equal(startLabel("realm"), "Start skirmish");
    assert.equal(startLabel("rpg"), "Start tale");
  });

  it("keeps skirmish choices and drops foe mood from a tale", () => {
    assert.equal(sizeShort(0), "Small map");
    assert.equal(sizeShort(1), "Medium map");
    assert.equal(sizeShort(2), "Large map");
    assert.equal(sizeShort(3), "Insanity map");
    assert.equal(foeShort(0), "Easy foe");
    assert.equal(foeShort(3), "Insanity foe");
    assert.equal(
      matchDetail(skirmish),
      "South · Stickhold · Hunts · Medium map · Hard foe",
    );
    assert.equal(matchSummary(skirmish), "Skirmish · South · Stickhold · Hunts · Medium map · Hard foe");
    assert.equal(matchDetail(tale), "North · Circle · Insanity map");
    assert.equal(matchSummary(tale), "Tale · North · Circle · Insanity map");
    assert.equal(matchDetail(tale).includes("Normal"), false);
    assert.equal(matchDetail(tale).includes("Insanity foe"), false);
  });
});

describe("menu overlay wiring", () => {
  it("still launches, resumes, and renders the end card through the engine helpers", () => {
    const source = readFileSync(join(root, "src/components/stickhold.tsx"), "utf8");
    assert.match(source, /g\.playerTeam = side/);
    assert.match(source, /g\.faction = people/);
    assert.match(source, /g\.rpg = playMode === "rpg"/);
    assert.match(source, /g\.mood = mood/);
    assert.match(source, /g\.provoked = false/);
    assert.match(source, /g\.start\(\)/);
    assert.match(source, /g\.restart\(\)/);
    assert.match(source, /g\.toMenu\(\)/);
    assert.match(source, /g\.loadGame\(/);
    assert.match(source, /g\.togglePause\(\)/);
    assert.match(source, /endModalBody\(phase, snap\?\.toast \?\? "", !!snap\?\.rpg\)/);
    assert.equal(source.includes("Their hall is down."), false);
    assert.equal(source.includes("They took your hall."), false);
    assert.equal(/halloween|bounty|pumpkin|#e07a2f/i.test(source), false);
  });
});
