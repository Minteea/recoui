import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createRenderEffect, createUniqueId, For } from "solid-js";
import styles from "../shared/preview.module.css";

interface CheckboxArgs {
  label: string;
  color: string;
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
}

function CheckboxExample(props: CheckboxArgs) {
  const id = createUniqueId();
  let input!: HTMLInputElement;
  const element = (
    <span class="ui-label-wrapper">
      <input
        ref={input}
        id={id}
        class="ui-checkbox"
        type="checkbox"
        data-color={props.color}
        checked={props.checked}
        disabled={props.disabled}
      />
      <label class="ui-label" for={id}>
        {props.label}
      </label>
    </span>
  );
  createRenderEffect(() => {
    input.indeterminate = props.indeterminate;
  });
  return element;
}

const meta = {
  title: "Styles/Input/Checkbox",
  parameters: { layout: "padded" },
  argTypes: {
    label: { control: "text" },
    color: { control: "text" },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean", description: "原生 DOM property，半选时显示横线。" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "接收产品更新",
    color: "primary",
    checked: false,
    indeterminate: false,
    disabled: false,
  },
  render: (args: CheckboxArgs) => (
    <div class={styles.preview}>
      <CheckboxExample {...args} />
    </div>
  ),
} satisfies Meta<CheckboxArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Indeterminate: Story = { args: { indeterminate: true } };

export const States: Story = {
  parameters: { controls: { exclude: ["label", "checked", "indeterminate", "disabled"] } },
  render: (args: CheckboxArgs) => (
    <div class={styles.preview}>
      <div class={styles.group} style={{ "justify-items": "start" }}>
        <For
          each={[
            { label: "未选中", checked: false, indeterminate: false, disabled: false },
            { label: "已选中", checked: true, indeterminate: false, disabled: false },
            { label: "半选", checked: false, indeterminate: true, disabled: false },
            { label: "禁用已选中", checked: true, indeterminate: false, disabled: true },
            { label: "禁用半选", checked: false, indeterminate: true, disabled: true },
          ]}
        >
          {(state) => <CheckboxExample {...args} {...state} />}
        </For>
      </div>
    </div>
  ),
};
