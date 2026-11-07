import { defineConfig } from "tsup";
import { generateTsupOptions, parsePresetOptions } from "tsup-preset-solid";

// Keep the checked-in exports stable: builds never rewrite package.json.
export default defineConfig((config) =>
  generateTsupOptions(
    parsePresetOptions(
      {
        entries: [{ entry: "src/index.tsx", dev_entry: true, server_entry: true }],
        drop_console: true,
      },
      !!config.watch,
    ),
  ),
);
