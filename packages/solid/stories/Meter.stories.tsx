import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Meter, type MeterProps } from "~";

const meta = {
  title: "Components/Display/Meter",
  component: Meter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "原生 meter 通过 min/max/low/high/optimum 表达数值区间。本例代表容量占用，低于 40 为理想区间，高于 80 为高占用。",
      },
    },
  },
  argTypes: {
    color: { control: "text" },
    min: { control: "number" },
    max: { control: "number" },
    low: { control: "number" },
    high: { control: "number" },
    optimum: { control: "number" },
    value: { control: "number" },
  },
  args: {
    min: 0,
    max: 100,
    low: 40,
    high: 80,
    optimum: 20,
    value: 30,
    color: "success",
    "aria-label": "容量占用",
  },
  render: (args: MeterProps) => (
    <div style={{ display: "grid", gap: "0.75rem", width: "min(20rem, 80vw)" }}>
      <span>
        容量占用：{args.value} / {args.max}
      </span>
      <Meter {...args}>{args.value}%</Meter>
    </div>
  ),
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Suboptimal: Story = { args: { value: 60 } };
export const HighUsage: Story = { args: { value: 90 } };
export const CustomColor: Story = { args: { color: "#9c36b5" } };
