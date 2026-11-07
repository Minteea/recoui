import { createUniqueId, splitProps } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Checkbox, LabelWrapper, type LabelWrapperProps } from "~";

const meta = {
  title: "Components/Form/LabelWrapper",
  component: LabelWrapper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "LabelWrapper 通过 label 属性为控件添加文字或 JSX 标签。labelProps 的 for 与控件的 id 显式关联，也可使用 LabelWrapper.Root 和 LabelWrapper.Label 自由组合。",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "标签内容，支持文本和 JSX。" },
    labelProps: { control: "object" },
    class: { control: "text" },
    children: { control: false, table: { disable: true } },
  },
  args: { label: "接收产品更新" },
  render: (args: LabelWrapperProps) => {
    const id = createUniqueId();
    return (
      <LabelWrapper {...args} labelProps={{ ...args.labelProps, for: id }}>
        <Checkbox id={id} name="updates" />
      </LabelWrapper>
    );
  },
} satisfies Meta<typeof LabelWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Disabled: Story = {
  render: (args: LabelWrapperProps) => {
    const id = createUniqueId();
    return (
      <LabelWrapper {...args} labelProps={{ ...args.labelProps, for: id }}>
        <Checkbox id={id} name="updates" disabled />
      </LabelWrapper>
    );
  },
};

export const RichContent: Story = {
  argTypes: { label: { control: false } },
  render: (args: LabelWrapperProps) => {
    const id = createUniqueId();
    return (
      <LabelWrapper
        {...args}
        label={
          <>
            接收<strong>重要更新</strong>
            <span aria-hidden="true"> *</span>
          </>
        }
        labelProps={{ ...args.labelProps, for: id }}
      >
        <Checkbox id={id} name="updates" required />
      </LabelWrapper>
    );
  },
};

export const AtomicComposition: Story = {
  render: (args: LabelWrapperProps) => {
    const id = createUniqueId();
    const [localProps, rootProps] = splitProps(args, ["label", "labelProps"]);
    return (
      <LabelWrapper.Root {...rootProps}>
        <Checkbox id={id} name="updates" />
        <LabelWrapper.Label {...localProps.labelProps} for={id}>
          {localProps.label}
        </LabelWrapper.Label>
      </LabelWrapper.Root>
    );
  },
};
