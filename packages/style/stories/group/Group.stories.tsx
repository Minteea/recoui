import { createUniqueId } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import styles from "../shared/preview.module.css";

interface GroupArgs {
  orientation: "horizontal" | "vertical";
  disabled: boolean;
}

function GroupExamples(props: GroupArgs) {
  return (
    <div class={styles.preview}>
      <div class="ui-group" data-orientation={props.orientation}>
        <button class="ui-button" type="button" disabled={props.disabled}>
          保存
        </button>
        <button class="ui-button" type="button" data-variant="ghost" disabled={props.disabled}>
          取消
        </button>
        <input
          class="ui-input"
          name="keyword"
          placeholder="搜索内容"
          aria-label="搜索内容"
          data-width="12rem"
          disabled={props.disabled}
        />
        <label style={{ display: "inline-flex", "align-items": "center", gap: "0.5rem" }}>
          <input class="ui-checkbox" type="checkbox" name="remember" disabled={props.disabled} />
          记住选择
        </label>
      </div>
    </div>
  );
}

function RadioExamples(props: GroupArgs) {
  const name = createUniqueId();
  const labelStyle = { display: "inline-flex", "align-items": "center", gap: "0.5rem" };

  return (
    <div class={styles.preview}>
      <div
        class="ui-group"
        data-orientation={props.orientation}
        role="radiogroup"
        aria-label="通知方式"
        aria-orientation={props.orientation}
      >
        <label style={labelStyle}>
          <input
            class="ui-radio"
            type="radio"
            name={name}
            value="email"
            checked
            disabled={props.disabled}
          />
          邮件
        </label>
        <label style={labelStyle}>
          <input class="ui-radio" type="radio" name={name} value="push" disabled={props.disabled} />
          应用推送
        </label>
        <label style={labelStyle}>
          <input class="ui-radio" type="radio" name={name} value="sms" disabled />
          短信
        </label>
      </div>
    </div>
  );
}

const meta = {
  title: "Styles/Group/Group",
  parameters: { layout: "padded" },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    disabled: { control: "boolean" },
  },
  args: { orientation: "horizontal", disabled: false },
  render: (args: GroupArgs) => <GroupExamples {...args} />,
} satisfies Meta<GroupArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const RadioOptions: Story = { render: (args: GroupArgs) => <RadioExamples {...args} /> };
