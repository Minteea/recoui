import { For } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import { Button, type ButtonProps } from "~";

const meta = {
  title: "Components/Input/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "filled", "light", "outline", "ghost", "text"],
    },
    color: { control: "text" },
    disabled: { control: "boolean" },
    "data-radius": { control: "text" },
    "data-width": { control: "text" },
  },
  args: { children: "Button", color: "primary", onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = { args: { variant: "filled" } };
export const Disabled: Story = { args: { variant: "filled", disabled: true } };
export const Rounded: Story = { args: { "data-radius": "rounded" } };
export const Icon: Story = { args: { children: "+", "data-width": "icon", "aria-label": "添加" } };

export const Variants: Story = {
  render: (args: ButtonProps) => (
    <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.75rem" }}>
      <For each={["default", "filled", "light", "outline", "ghost", "text"] as const}>
        {(variant) => (
          <Button {...args} variant={variant}>
            {variant}
          </Button>
        )}
      </For>
    </div>
  ),
};
