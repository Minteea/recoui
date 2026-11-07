import { createSignal, createUniqueId, splitProps } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button, Collapse, Input, type CollapseProps } from "~";

const meta = {
  title: "Components/Display/Collapse",
  component: Collapse,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "expanded 默认为 false，同步控制 data-expanded、aria-hidden 和 inert。",
      },
    },
  },
  argTypes: {
    expanded: { control: "boolean" },
    children: { control: false, table: { disable: true } },
  },
  args: {
    expanded: true,
    class: "ui-box ui-border",
    style: { padding: "1rem" },
  },
  render: (args: CollapseProps) => (
    <div>
      <p>通过 Controls 切换 expanded，查看折叠状态。</p>
      <Collapse {...args}>
        <p style={{ margin: "0 0 1rem" }}>展开后可以访问内部内容和控件。</p>
        <Input aria-label="示例内容" placeholder="输入内容" />
      </Collapse>
    </div>
  ),
} satisfies Meta<typeof Collapse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Collapsed: Story = { args: { expanded: false } };

export const Interactive: Story = {
  parameters: { controls: { exclude: ["expanded"] } },
  render: (args: CollapseProps) => {
    const [expanded, setExpanded] = createSignal(false);
    const id = createUniqueId();
    const [, restProps] = splitProps(args, ["expanded", "children", "id"]);

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        <Button
          type="button"
          aria-expanded={expanded()}
          aria-controls={id}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded() ? "收起内容" : "展开内容"}
        </Button>
        <Collapse {...restProps} id={id} expanded={expanded()}>
          <p style={{ margin: "0 0 1rem" }}>输入后收起并重新展开，内容会保留。</p>
          <Input aria-label="保留的内容" placeholder="输入内容" />
        </Collapse>
      </div>
    );
  },
};
