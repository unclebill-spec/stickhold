import { createRoot } from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Stickhold } from "@/components/stickhold";
import "./styles.css";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Stickhold,
});

const stickholdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stickhold",
  component: Stickhold,
});

const routeTree = rootRoute.addChildren([indexRoute, stickholdRoute]);

function pagesBasepath(): string {
  const base = import.meta.env.BASE_URL || "/";
  if (base === "/") return "/";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

const router = createRouter({
  routeTree,
  basepath: pagesBasepath(),
  defaultNotFoundComponent: Stickhold,
});

const root = document.getElementById("root");
if (!root) throw new Error("Stickhold root is missing");
createRoot(root).render(<RouterProvider router={router} />);
