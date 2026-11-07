import { createSignal, createUniqueId } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import styles from "../shared/preview.module.css";

interface CollapseArgs {
  expanded: boolean;
}

const meta = {
  title: "Styles/Display/Collapse",
  parameters: { layout: "padded" },
  argTypes: {
    expanded: {
      control: "boolean",
      description: "data-expanded 存在时展开，移除时折叠。",
    },
  },
  args: { expanded: true },
  render: (args: CollapseArgs) => (
    <div class={styles.preview}>
      <p style={{ margin: "0" }}>通过 Controls 切换 expanded，查看折叠状态。</p>
      <div
        class="ui-collapse ui-box ui-border"
        data-expanded={args.expanded ? "" : undefined}
        aria-hidden={!args.expanded}
        inert={!args.expanded}
        style={{ padding: "1rem" }}
      >
        <p style={{ margin: "0 0 1rem" }}>展开后可以访问内部内容和控件。</p>
        <input class="ui-input" aria-label="示例内容" placeholder="输入内容" />
      </div>
    </div>
  ),
} satisfies Meta<CollapseArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Collapsed: Story = { args: { expanded: false } };

export const Interactive: Story = {
  parameters: { controls: { exclude: ["expanded"] } },
  render: () => {
    const [expanded, setExpanded] = createSignal(false);
    const id = createUniqueId();

    return (
      <div class={styles.preview}>
        <div>
          <button
            class="ui-button"
            type="button"
            aria-expanded={expanded()}
            aria-controls={id}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded() ? "收起内容" : "展开内容"}
          </button>
        </div>
        <div
          id={id}
          class="ui-collapse ui-box ui-border"
          data-expanded={expanded() ? "" : undefined}
          aria-hidden={!expanded()}
          inert={!expanded()}
          style={{ padding: "1rem" }}
        >
          <p style={{ margin: "0 0 1rem" }}>输入后收起并重新展开，内容会保留。</p>
          <input class="ui-input" aria-label="保留的内容" placeholder="输入内容" />
        </div>
      </div>
    );
  },
};
