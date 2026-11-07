import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal, createUniqueId, For } from "solid-js";
import styles from "../shared/preview.module.css";

interface RadioArgs {
  label: string;
  color: string;
  checked: boolean;
  disabled: boolean;
}

const meta = {
  title: "Styles/Input/Radio",
  parameters: { layout: "padded" },
  argTypes: {
    label: { control: "text" },
    color: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { label: "电子邮件", color: "primary", checked: false, disabled: false },
  render: (args: RadioArgs) => {
    const id = createUniqueId();
    return (
      <div class={styles.preview}>
        <span class="ui-label-wrapper">
          <input
            class="ui-radio"
            id={id}
            name={id}
            type="radio"
            value="email"
            data-color={args.color}
            checked={args.checked}
            disabled={args.disabled}
          />
          <label class="ui-label" for={id}>
            {args.label}
          </label>
        </span>
      </div>
    );
  },
} satisfies Meta<RadioArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Group: Story = {
  parameters: { controls: { exclude: ["label", "checked"] } },
  render: (args: RadioArgs) => {
    const id = createUniqueId();
    const [value, setValue] = createSignal("email");
    return (
      <div class={styles.preview}>
        <div class="ui-group" role="radiogroup" aria-label="通知方式">
          <For
            each={[
              { value: "email", label: "电子邮件" },
              { value: "push", label: "应用推送" },
              { value: "sms", label: "短信（不可用）", disabled: true },
            ]}
          >
            {(option) => (
              <span class="ui-label-wrapper">
                <input
                  class="ui-radio"
                  id={`${id}-${option.value}`}
                  name={id}
                  type="radio"
                  value={option.value}
                  data-color={args.color}
                  checked={value() === option.value}
                  disabled={args.disabled || option.disabled}
                  onChange={(event) => setValue(event.currentTarget.value)}
                />
                <label class="ui-label" for={`${id}-${option.value}`}>
                  {option.label}
                </label>
              </span>
            )}
          </For>
        </div>
        <output aria-live="polite">当前值：{value()}</output>
      </div>
    );
  },
};
