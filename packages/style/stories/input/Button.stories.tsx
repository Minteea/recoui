import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { IconBell, IconDownload, IconPlus } from "@tabler/icons-solidjs";
import { For } from "solid-js";
import styles from "../shared/preview.module.css";

const variants = ["default", "outline", "filled", "light", "ghost", "text"] as const;

interface ButtonArgs {
  text: string;
  variant: (typeof variants)[number];
  color: string;
  radius?: string;
  width?: string;
  disabled: boolean;
}

const attributes = (args: ButtonArgs) => ({
  class: "ui-button",
  "data-variant": args.variant,
  "data-color": args.color,
  "data-radius": args.radius,
  "data-width": args.width,
});

const meta = {
  title: "Styles/Input/Button",
  parameters: { layout: "padded" },
  argTypes: {
    text: { control: "text" },
    variant: { control: "select", options: variants },
    color: { control: "text" },
    radius: { control: "text", description: "data-radius，支持 rounded 和 CSS 尺寸。" },
    width: { control: "text", description: "data-width，支持 block、icon 和 CSS 尺寸。" },
    disabled: { control: "boolean" },
  },
  args: { text: "保存", variant: "default", color: "primary", disabled: false },
  render: (args: ButtonArgs) => (
    <div class={styles.preview}>
      <div>
        <button {...attributes(args)} type="button" disabled={args.disabled}>
          {args.text}
        </button>
      </div>
    </div>
  ),
} satisfies Meta<ButtonArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  parameters: { controls: { exclude: ["text", "variant", "color"] } },
  render: (args: ButtonArgs) => (
    <div class={styles.preview}>
      <For each={variants}>
        {(variant) => (
          <section class={styles.group}>
            <span class={styles.markup}>{variant}</span>
            <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem" }}>
              <For each={["neutral", "primary", "success", "warning", "error", "#9c36b5"]}>
                {(color) => (
                  <button
                    {...attributes(args)}
                    type="button"
                    data-variant={variant}
                    data-color={color}
                    disabled={args.disabled}
                  >
                    {color}
                  </button>
                )}
              </For>
            </div>
          </section>
        )}
      </For>
    </div>
  ),
};

export const Geometry: Story = {
  argTypes: {
    radius: { description: "宽度对比行中按钮的 data-radius。" },
    width: { description: "圆角对比行中按钮的 data-width。" },
  },
  render: (args: ButtonArgs) => (
    <div class={styles.preview} style={{ width: "min(32rem, 100%)" }}>
      <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.75rem" }}>
        <For each={["default", "rounded", "0", "4px", "1rem"]}>
          {(radius) => (
            <button
              {...attributes(args)}
              type="button"
              data-radius={radius}
              disabled={args.disabled}
            >
              {radius}
            </button>
          )}
        </For>
      </div>
      <For each={["default", "block", "icon", "12rem", "50%"]}>
        {(width) => (
          <div class={styles.group}>
            <span class={styles.markup}>data-width="{width}"</span>
            <div>
              <button
                {...attributes(args)}
                type="button"
                data-width={width}
                disabled={args.disabled}
                aria-label={width === "icon" ? "添加" : undefined}
              >
                {width === "icon" ? <IconPlus size={16} aria-hidden="true" /> : args.text}
              </button>
            </div>
          </div>
        )}
      </For>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args: ButtonArgs) => (
    <div class={styles.preview}>
      <div style={{ display: "flex", "flex-wrap": "wrap", "align-items": "center", gap: "1rem" }}>
        <button
          {...attributes(args)}
          type="button"
          disabled={args.disabled}
          style={{ gap: "0.375rem" }}
        >
          <IconDownload size={16} aria-hidden="true" /> {args.text}
        </button>
        <button
          {...attributes(args)}
          type="button"
          data-width="icon"
          disabled={args.disabled}
          aria-label="通知"
        >
          <IconBell aria-hidden="true" />
        </button>
        <button
          {...attributes(args)}
          type="button"
          data-width="icon"
          data-radius="rounded"
          disabled={args.disabled}
          aria-label="添加"
        >
          <IconPlus size={16} aria-hidden="true" />
        </button>
      </div>
      <span class={styles.markup}>
        Tabler 图标使用 currentColor，支持显式尺寸与默认 24px 尺寸。
      </span>
    </div>
  ),
};

export const AsElements: Story = {
  parameters: { controls: { exclude: ["text"] } },
  render: (args: ButtonArgs) => (
    <div class={styles.preview}>
      <div style={{ display: "flex", "flex-wrap": "wrap", "align-items": "center", gap: "1rem" }}>
        <button {...attributes(args)} type="button" disabled={args.disabled}>
          button
        </button>
        <input {...attributes(args)} type="button" value="input" disabled={args.disabled} />
        <div
          {...attributes(args)}
          aria-disabled={args.disabled || undefined}
          tabIndex={args.disabled ? -1 : 0}
        >
          div
        </div>
        <span
          {...attributes(args)}
          aria-disabled={args.disabled || undefined}
          tabIndex={args.disabled ? -1 : 0}
        >
          span
        </span>
      </div>
    </div>
  ),
};
