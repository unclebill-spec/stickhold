import { createFileRoute } from "@tanstack/react-router";
import { Stickhold } from "@/components/stickhold";

export const Route = createFileRoute("/")({
  component: Stickhold,
  head: () => ({
    meta: [
      { title: "Stickhold" },
      { name: "description", content: "A small stick-figure realm. Gather, build, and take the enemy town hall." },
    ],
  }),
});
