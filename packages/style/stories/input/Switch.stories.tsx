import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createEffect, createSignal, createUniqueId } from "solid-js";
import styles from "../shared/preview.module.css";

interface SwitchArgs {
  checked: boolean;
  disabled: boolean;
  color?: string;
  direction: "ltr" | "rtl";
}

function SwitchExamples(props: SwitchArgs) {
  const id = createUniqueId();
  const [checked, setChecked] = createSignal(props.checked);
  createEffect(() => setChecked(props.checked));

  const toggle = () => {
    if (!props.disabled) setChecked(!checked());
  };
  const keyToggle = (event: KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      toggle();
    }
  };

  return (
    <div class={styles.preview} dir={props.direction}>
      <div class={styles.grid}>
        <div class={styles.example}>
          <label class={styles.markup} for={`${id}-native`}>
            原生 checkbox · ::after thumb
          </label>
          <input
            class="ui-switch"
            id={`${id}-native`}
            type="checkbox"
            role="switch"
            data-color={props.color}
            checked={checked()}
            disabled={props.disabled}
            onChange={(event) => setChecked(event.currentTarget.checked)}
          />
        </div>

        <div class={styles.example}>
          <span class={styles.markup} id={`${id}-button-label`}>
            button · 显式 thumb
          </span>
          <button
            class="ui-switch"
            type="button"
            role="switch"
            aria-checked={checked()}
            aria-labelledby={`${id}-button-label`}
            data-color={props.color}
            disabled={props.disabled}
            onClick={toggle}
          >
            <span class="ui-switch-thumb" />
          </button>
        </div>

        <div class={styles.example}>
          <span class={styles.markup} id={`${id}-pressed-label`}>
            button · aria-pressed · ::after thumb
          </span>
          <button
            class="ui-switch"
            type="button"
            aria-pressed={checked()}
            aria-labelledby={`${id}-pressed-label`}
            data-color={props.color}
            disabled={props.disabled}
            onClick={toggle}
          />
        </div>

        <div class={styles.example}>
          <label class={styles.markup} for={`${id}-label-input`}>
            label · 嵌套 checkbox · 显式 thumb
          </label>
          <label class="ui-switch" data-color={props.color}>
            <input
              id={`${id}-label-input`}
              type="checkbox"
              role="switch"
              checked={checked()}
              disabled={props.disabled}
              onChange={(event) => setChecked(event.currentTarget.checked)}
            />
            <span class="ui-switch-thumb" />
          </label>
        </div>

        <div class={styles.example}>
          <label class={styles.markup} for={`${id}-span-input`}>
            span · 嵌套 checkbox · ::after thumb
          </label>
          <span class="ui-switch" data-color={props.color}>
            <input
              id={`${id}-span-input`}
              type="checkbox"
              role="switch"
              checked={checked()}
              disabled={props.disabled}
              onChange={(event) => setChecked(event.currentTarget.checked)}
            />
          </span>
        </div>

        <div class={styles.example}>
          <label class={styles.markup} for={`${id}-deep-input`}>
            div · 多层嵌套 input 和 thumb
          </label>
          <div class="ui-switch" data-color={props.color}>
            <span>
              <input
                id={`${id}-deep-input`}
                type="checkbox"
                role="switch"
                checked={checked()}
                disabled={props.disabled}
                onChange={(event) => setChecked(event.currentTarget.checked)}
              />
            </span>
            <span>
              <span class="ui-switch-thumb" />
            </span>
          </div>
        </div>

        <div class={styles.example}>
          <span class={styles.markup} id={`${id}-span-label`}>
            span · ARIA 状态和键盘交互
          </span>
          <span
            class="ui-switch"
            role="switch"
            aria-checked={checked()}
            aria-disabled={props.disabled}
            aria-labelledby={`${id}-span-label`}
            data-color={props.color}
            tabIndex={props.disabled ? -1 : 0}
            onClick={toggle}
            onKeyDown={keyToggle}
          >
            <span class="ui-switch-thumb" />
          </span>
        </div>

        <div class={styles.example}>
          <span class={styles.markup} id={`${id}-large-label`}>
            自定义轨道尺寸
          </span>
          <button
            class="ui-switch"
            type="button"
            role="switch"
            aria-checked={checked()}
            aria-labelledby={`${id}-large-label`}
            data-color={props.color}
            disabled={props.disabled}
            onClick={toggle}
            style={{ "--ui-switch-width": "3rem", "--ui-switch-height": "1.75rem" }}
          >
            <span class="ui-switch-thumb" />
          </button>
        </div>
      </div>
    </div>
  );
}

function NativeSwitchExample(props: SwitchArgs) {
  const id = createUniqueId();
  const [checked, setChecked] = createSignal(props.checked);
  createEffect(() => setChecked(props.checked));
  return (
    <div class={styles.preview} dir={props.direction}>
      <span class="ui-label-wrapper">
        <input
          class="ui-switch"
          id={id}
          type="checkbox"
          role="switch"
          data-color={props.color}
          checked={checked()}
          disabled={props.disabled}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
        <label class="ui-label" for={id}>
          启用通知
        </label>
      </span>
    </div>
  );
}

function SwitchFormExample(props: SwitchArgs) {
  const id = createUniqueId();
  const [message, setMessage] = createSignal("");
  return (
    <div class={styles.preview} dir={props.direction}>
      <form
        class="ui-form"
        onSubmit={(event) => {
          event.preventDefault();
          setMessage(
            new FormData(event.currentTarget).has("notifications")
              ? "提交：已开启通知"
              : "提交：已关闭通知",
          );
        }}
      >
        <div class="ui-field">
          <label class="ui-field-label" for={`${id}-form-input`}>
            原生表单提交与重置
          </label>
          <label class="ui-switch" data-color={props.color}>
            <input
              id={`${id}-form-input`}
              name="notifications"
              value="enabled"
              type="checkbox"
              role="switch"
              ref={(input) => {
                input.defaultChecked = true;
              }}
              disabled={props.disabled}
              aria-describedby={`${id}-form-description`}
            />
          </label>
          <p class="ui-field-description" id={`${id}-form-description`}>
            此示例由原生 checkbox 管理状态，可提交表单或重置为默认开启。
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button class="ui-button" type="submit">
            读取表单值
          </button>
          <button class="ui-button" type="reset" onClick={() => setMessage("已恢复默认开启状态")}>
            重置
          </button>
        </div>
        <p role="status">{message()}</p>
      </form>
    </div>
  );
}

const meta = {
  title: "Styles/Input/Switch",
  parameters: { layout: "padded" },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    color: { control: "text", description: "data-color，例如 primary、success 或自定义颜色" },
    direction: { control: "select", options: ["ltr", "rtl"] },
  },
  args: { checked: true, disabled: false, direction: "ltr" },
  render: (args: SwitchArgs) => <NativeSwitchExample {...args} />,
} satisfies Meta<SwitchArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Elements: Story = { render: (args: SwitchArgs) => <SwitchExamples {...args} /> };
export const NativeForm: Story = {
  parameters: { controls: { exclude: ["checked"] } },
  render: (args: SwitchArgs) => <SwitchFormExample {...args} />,
};
