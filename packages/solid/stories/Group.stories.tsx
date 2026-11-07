import { createUniqueId } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button, Checkbox, Group, Input, LabelWrapper, type GroupProps } from "~";

const meta = {
  title: "Components/Form/Group",
  component: Group,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Group 使用 flex 排列子控件，间距为 1rem，orientation 控制横向或纵向布局。",
      },
    },
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    class: { control: "text" },
    children: { control: false, table: { disable: true } },
  },
  args: {
    orientation: "horizontal",
    role: "group",
    "aria-label": "搜索操作",
  },
  render: (args: GroupProps) => (
    <Group {...args}>
      <Input width="12rem" placeholder="搜索内容" aria-label="搜索内容" />
      <Button type="button">搜索</Button>
      <Button type="button" variant="ghost">
        清空
      </Button>
    </Group>
  ),
} satisfies Meta<typeof Group>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Vertical: Story = { args: { orientation: "vertical" } };

export const WithFields: Story = {
  args: { "aria-label": "通知偏好" },
  render: (args: GroupProps) => {
    const id = createUniqueId();
    return (
      <Group {...args}>
        <LabelWrapper label="电子邮件" labelProps={{ for: `${id}-email` }}>
          <Checkbox id={`${id}-email`} name="email-updates" />
        </LabelWrapper>
        <LabelWrapper label="应用推送" labelProps={{ for: `${id}-push` }}>
          <Checkbox id={`${id}-push`} name="push-updates" />
        </LabelWrapper>
      </Group>
    );
  },
};
