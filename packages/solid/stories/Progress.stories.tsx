import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Progress, type ProgressProps } from "~";

const meta = {
  title: "Components/Display/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "text" },
    value: { control: "number" },
    max: { control: "number" },
  },
  args: { max: 100, value: 60, color: "primary", "aria-label": "上传进度" },
  render: (args: ProgressProps) => (
    <div style={{ display: "grid", gap: "0.75rem", width: "min(20rem, 80vw)" }}>
      <span>
        {args.value === undefined ? "正在上传…" : `上传进度：${args.value} / ${args.max}`}
      </span>
      <Progress {...args}>{args.value === undefined ? "正在上传" : `${args.value}%`}</Progress>
    </div>
  ),
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Complete: Story = { args: { value: 100, color: "success" } };
export const Indeterminate: Story = { args: { value: undefined } };
export const CustomColor: Story = { args: { color: "#9c36b5" } };
