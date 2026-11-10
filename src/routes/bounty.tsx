import { createFileRoute } from "@tanstack/react-router";
import { BountyGame } from "@/components/bounty-game";

export const Route = createFileRoute("/bounty")({
  component: BountyGame,
  head: () => ({
    meta: [
      { title: "Halloweens Bounty" },
      { name: "description", content: "A night raid for gold, lumber, and one hero." },
    ],
  }),
});
