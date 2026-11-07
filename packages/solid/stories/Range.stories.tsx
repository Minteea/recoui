import { createEffect, createSignal } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Range, type RangeProps } from "~";

function RangeExample(props: RangeProps) {
  const [value, setValue] = createSignal(Number(props.value ?? 25));
  createEffect(() => setValue(Number(props.value ?? 25)));
  const minimum = () => Number(props.min ?? 0);
  const maximum = () => Number(props.max ?? 100);
  const position = () =>
    maximum() > minimum()
      ? Math.max(0, Math.min(100, ((value() - minimum()) / (maximum() - minimum())) * 100))
      : 0;

  return (
    <label class="ui-field" style={{ width: "min(20rem, 80vw)" }}>
      <span class="ui-field-label">音量：{value()}</span>
      <Range
        {...props}
        value={value()}
        style={{ "--ui-slider-position": `${position()}%` }}
        onInput={(event) => setValue(event.currentTarget.valueAsNumber)}
      />
    </label>
  );
}

const meta = {
  title: "Components/Input/Range",
  component: Range,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Range 仅输出原生 input[type=range]。本示例在调用侧维护数值，并通过 --ui-slider-position 同步填充百分比；键盘、步长和禁用行为由浏览器处理。",
      },
    },
  },
  argTypes: {
    color: { control: "text" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    value: { control: "number" },
    disabled: { control: "boolean" },
  },
  args: { min: 0, max: 100, step: 1, value: 25, color: "primary", "aria-label": "音量" },
  render: (args: RangeProps) => <RangeExample {...args} />,
} satisfies Meta<typeof Range>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Controlled: Story = { args: { min: 20, max: 80, value: 35, step: 5 } };
export const Disabled: Story = { args: { disabled: true } };
export const CustomColor: Story = { args: { color: "#9c36b5", value: 65 } };
