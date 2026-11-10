export type PlayMode = "realm" | "rpg";
export type People = "stick" | "dynasty" | "coven" | "egypt";
export type Mood = "passive" | "normal" | "aggressive";

export type MatchSetup = {
  playMode: PlayMode;
  side: 0 | 1;
  people: People;
  mood: Mood;
  sizeStep: number;
  diffStep: number;
};

const PEOPLE: Record<People, string> = {
  stick: "Stickhold",
  dynasty: "Dynasty",
  coven: "Circle",
  egypt: "Egypt",
};

const MOOD: Record<Mood, string> = {
  passive: "Passive",
  normal: "Normal",
  aggressive: "Hunts",
};

/** Lowest filled slot, 1-based. Saves have no timestamp, so slot 1 wins ties. */
export function continueSlot(filled: readonly boolean[]): number | null {
  const index = filled.findIndex(Boolean);
  return index < 0 ? null : index + 1;
}

/** Filled slots other than the continue slot. */
export function otherSaveSlots(filled: readonly boolean[]): number[] {
  const keep = continueSlot(filled);
  const slots: number[] = [];
  filled.forEach((on, index) => {
    const slot = index + 1;
    if (on && slot !== keep) slots.push(slot);
  });
  return slots;
}

export function startLabel(mode: PlayMode): string {
  return mode === "rpg" ? "Start tale" : "Start skirmish";
}

export function sizeShort(step: number): string {
  if (step <= 0) return "Small map";
  if (step <= 1) return "Medium map";
  if (step <= 2) return "Large map";
  return "Insanity map";
}

export function foeShort(step: number): string {
  if (step <= 0) return "Easy foe";
  if (step <= 1) return "Medium foe";
  if (step <= 2) return "Hard foe";
  return "Insanity foe";
}

/** Choices without the mode word, for the button under Start skirmish / Start tale. */
export function matchDetail(setup: MatchSetup): string {
  const parts = [setup.side === 0 ? "South" : "North", PEOPLE[setup.people]];
  if (setup.playMode === "realm") {
    parts.push(MOOD[setup.mood], sizeShort(setup.sizeStep), foeShort(setup.diffStep));
  } else {
    parts.push(sizeShort(setup.sizeStep));
  }
  return parts.join(" · ");
}

export function matchSummary(setup: MatchSetup): string {
  const mode = setup.playMode === "rpg" ? "Tale" : "Skirmish";
  return `${mode} · ${matchDetail(setup)}`;
}
