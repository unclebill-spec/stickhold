import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * GitHub Pages serves `404.html` for unknown paths. The copy keeps the same
 * `/stickhold/` asset URLs as `index.html`, so `/stickhold/stickhold` still boots.
 */
function spaFallbackPlugin(): Plugin {
  return {
    name: "stickhold-spa-fallback",
    apply: "build",
    closeBundle() {
      const dir = resolve(process.cwd(), "dist");
      copyFileSync(resolve(dir, "index.html"), resolve(dir, "404.html"));
    },
  };
}

/**
 * Client-only Vite build for https://unclebill-spec.github.io/stickhold/.
 * The TanStack Start + Nitro config in `vite.config.ts` stays the dev server.
 * This config does not start a Node, Nitro, or Vercel runtime.
 */
export default defineConfig({
  base: "/stickhold/",
  resolve: { tsconfigPaths: true },
  define: {
    "import.meta.env.VITE_AUTH_ENABLED": JSON.stringify("false"),
  },
  plugins: [tailwindcss(), viteReact(), spaFallbackPlugin()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4673,
    strictPort: true,
  },
});
