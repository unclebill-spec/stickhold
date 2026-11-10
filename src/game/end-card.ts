const HALL_WIN = "Their hall has fallen.";
const HALL_LOSE = "Your town hall is lost.";
const TALE_HOME = "Your people are home. The wild is yours.";
const TALE_CLEAR = "The wild is clear. The champion stands.";
const TALE_FALL = "The champion is gone, and the altar with them.";

const SKIRMISH_WIN = "Their hall is down.";
const SKIRMISH_LOSE = "They took your hall. A tower and a few soldiers help hold the crossing.";

const ENDING = new Set([HALL_WIN, HALL_LOSE, TALE_HOME, TALE_CLEAR, TALE_FALL]);

export function endModalBody(phase: string, toast: string, rpg: boolean): string {
	if (ENDING.has(toast)) return toast;
	if (rpg) return phase === "win" ? TALE_CLEAR : TALE_FALL;
	return phase === "win" ? SKIRMISH_WIN : SKIRMISH_LOSE;
}
