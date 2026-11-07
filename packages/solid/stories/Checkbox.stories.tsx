import { createSignal, createUniqueId } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Checkbox, LabelWrapper, type CheckboxProps } from "~";

const meta = {
  title: "Components/Input/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "text" },
    checked: { control: "boolean" },
    indeterminate: {
      control: "boolean",
      description: "原生半选状态，横线优先于勾选图案；checked 仍决定表单提交值。",
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  args: { color: "primary", indeterminate: false, "aria-label": "接收产品更新" },
  render: (args: CheckboxProps) => {
    const id = createUniqueId();
    return (
      <LabelWrapper label="接收产品更新" labelProps={{ for: args.id ?? id }}>
        <Checkbox {...args} id={args.id ?? id} />
      </LabelWrapper>
    );
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { checked: true, disabled: true } };
export const Indeterminate: Story = { args: { checked: false, indeterminate: true } };
export const IndeterminateChecked: Story = { args: { checked: true, indeterminate: true } };
export const DisabledIndeterminate: Story = { args: { indeterminate: true, disabled: true } };

export const Controlled: Story = {
  render: (args: CheckboxProps) => {
    const id = createUniqueId();
    const [checked, setChecked] = createSignal(false);
    return (
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <LabelWrapper label="接收产品更新" labelProps={{ for: args.id ?? id }}>
          <Checkbox
            {...args}
            id={args.id ?? id}
            checked={checked()}
            onChange={(event) => setChecked(event.currentTarget.checked)}
          />
        </LabelWrapper>
        <output aria-live="polite">{checked() ? "已订阅" : "未订阅"}</output>
      </div>
    );
  },
};
