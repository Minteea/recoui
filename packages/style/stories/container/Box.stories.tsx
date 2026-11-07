import type { Meta, StoryObj } from "storybook-solidjs-vite";
import styles from "../shared/preview.module.css";

function BoxPreview(props: { className: string }) {
  return (
    <div class={styles.preview}>
      <span class={styles.markup}>{props.className}</span>
      <div style={{ background: "var(--color-input-fill)", padding: "1.5rem" }}>
        <div class={props.className} style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 0.5rem", "font-size": "1rem" }}>卡片容器</h3>
          <p style={{ margin: "0" }}>这里可以放置任意内容。</p>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Styles/Container/Box",
  parameters: { layout: "padded" },
  render: () => <BoxPreview className="ui-box" />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithBorder: Story = { render: () => <BoxPreview className="ui-box ui-border" /> };
export const BorderOnly: Story = { render: () => <BoxPreview className="ui-border" /> };
