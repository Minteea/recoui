import type { Preview } from "storybook-solidjs-vite";
import "@recoui/style/scss";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { matchers: { color: /(background|color)$/i } },
    a11y: { test: "todo" },
  },
};

export default preview;
