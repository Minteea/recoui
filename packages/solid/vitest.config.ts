import { defineConfig, mergeConfig } from "vitest/config";
import solid from "vite-plugin-solid";
import viteConfig from "./vite.config";

export default defineConfig(({ mode }) => {
  const ssr = mode === "ssr";

  return mergeConfig(viteConfig, {
    plugins: [solid({ hot: false, solid: { generate: ssr ? "ssr" : "dom" } })],
    resolve: { conditions: ssr ? ["node"] : ["browser", "development"] },
    test: {
      environment: ssr ? "node" : "jsdom",
      include: [ssr ? "test/**/*.ssr.test.tsx" : "test/**/*.test.tsx"],
      exclude: ssr ? [] : ["test/**/*.ssr.test.tsx"],
      // Use native DOM assertions; keep the Solid runtime external without
      // opting into vite-plugin-solid's optional testing-library setup.
      server: { deps: { external: [/solid-js/] } },
      setupFiles: [],
    },
  });
});
