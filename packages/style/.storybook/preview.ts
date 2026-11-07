import type { Preview } from "storybook-solidjs-vite";
import "~/styles/index.scss";

const preview: Preview = {
  parameters: {
    layout: "padded",
    options: {
      storySort: {
        method: "alphabetical",
        order: ["Styles", ["Input", "Display", "Container", "Form", "Group"]],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },

    a11y: {
      test: "todo",
    },
  },
};

export default preview;
