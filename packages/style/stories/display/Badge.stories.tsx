import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { IconCheck } from "@tabler/icons-solidjs";
import { For } from "solid-js";
import { Dynamic } from "solid-js/web";
import styles from "../shared/preview.module.css";

interface BadgeArgs {
  element: "span" | "div";
  text: string;
  variant: "default" | "light" | "filled" | "outline";
  color?: string;
  "data-radius"?: string;
}

const variants = ["default", "light", "filled", "outline"] as const;

function BadgePreview(props: BadgeArgs) {
  return (
    <div class={styles.preview}>
      <div>
        <Dynamic
          component={props.element}
          class="ui-badge"
          data-variant={props.variant}
          data-color={props.color}
          data-radius={props["data-radius"]}
        >
          {props.text}
        </Dynamic>
      </div>
    </div>
  );
}

const meta = {
  title: "Styles/Display/Badge",
  parameters: { layout: "padded" },
  argTypes: {
    element: { control: "select", options: ["span", "div"] },
    text: { control: "text" },
    variant: { control: "select", options: variants },
    color: { control: "text", description: "data-color，支持主题名称与 CSS 颜色" },
    "data-radius": {
      control: "text",
      description: "default 使用默认圆角，rounded 使用全圆角，其他值为 CSS 圆角尺寸。",
    },
  },
  args: { element: "span", text: "Badge", variant: "default", color: "primary" },
  render: (args: BadgeArgs) => <BadgePreview {...args} />,
} satisfies Meta<BadgeArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  parameters: { controls: { exclude: ["element", "text", "variant", "color"] } },
  render: (args: BadgeArgs) => (
    <div class={styles.preview}>
      <For each={variants}>
        {(variant) => (
          <section class={styles.group}>
            <span class={styles.markup}>{variant}</span>
            <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem" }}>
              <For each={["neutral", "primary", "success", "warning", "danger", "info", "#987654"]}>
                {(color) => (
                  <span
                    class="ui-badge"
                    data-variant={variant}
                    data-color={color}
                    data-radius={args["data-radius"]}
                  >
                    {color}
                  </span>
                )}
              </For>
            </div>
          </section>
        )}
      </For>
    </div>
  ),
};

export const Composition: Story = {
  parameters: { controls: { exclude: ["element"] } },
  render: (args: BadgeArgs) => (
    <div class={styles.preview}>
      <div class={styles.grid}>
        <For each={["span", "div"] as const}>
          {(element) => (
            <div class={styles.example}>
              <span class={styles.markup}>{element}.ui-badge</span>
              <Dynamic
                component={element}
                class="ui-badge"
                data-variant={args.variant}
                data-color={args.color}
                data-radius={args["data-radius"]}
              >
                {args.text}
              </Dynamic>
            </div>
          )}
        </For>
      </div>
      <div
        style={{ display: "flex", "flex-wrap": "wrap", "align-items": "center", gap: "0.75rem" }}
      >
        <span class="ui-badge" data-color="success">
          <IconCheck size={12} aria-hidden="true" /> 已完成
        </span>
        <span
          class="ui-badge"
          data-color="danger"
          data-variant="filled"
          aria-label="99 条以上未读消息"
        >
          99+
        </span>
        <button class="ui-button" type="button" style={{ gap: "0.5rem" }}>
          收件箱{" "}
          <span class="ui-badge" data-color="primary" data-variant="filled">
            12
          </span>
        </button>
      </div>
    </div>
  ),
};
