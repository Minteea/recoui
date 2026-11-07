import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "~";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "filled", "light", "outline", "ghost", "text"],
    },
    color: {
      control: "select",
      options: ["neutral", "primary", "success", "warning", "error", "info"],
    },
    "data-radius": { control: "text" },
    "data-width": { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Button",
    variant: "default",
    color: "primary",
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = { args: { variant: "filled" } };
export const Light: Story = { args: { variant: "light" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Text: Story = { args: { variant: "text" } };
export const Disabled: Story = { args: { disabled: true } };
export const Rounded: Story = { args: { "data-radius": "rounded" } };
export const Icon: Story = {
  args: { children: "+", "data-width": "icon", "aria-label": "Add" },
};
