import { createFileRoute } from "@tanstack/react-router";
import { Stickhold } from "@/components/stickhold";

export const Route = createFileRoute("/stickhold")({
  component: Stickhold,
  head: () => ({ meta: [{ title: "Stickhold" }] }),
});
