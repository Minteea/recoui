import { createUniqueId, For } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import styles from "../shared/preview.module.css";

interface FieldArgs {
  label: string;
  description: string;
  variant: "default" | "filled" | "unstyled";
  disabled: boolean;
  fontSize?: string;
}

function FieldExample(props: FieldArgs) {
  const id = createUniqueId();
  return (
    <div
      class={styles.preview}
      style={{ width: "min(24rem, 100%)", "--font-size-input": props.fontSize }}
    >
      <div class="ui-field">
        <label class="ui-field-label" for={id}>
          {props.label}
        </label>
        <input
          class="ui-input"
          id={id}
          type="email"
          placeholder="you@example.com"
          data-variant={props.variant}
          disabled={props.disabled}
          aria-describedby={props.description ? `${id}-description` : undefined}
        />
        <p class="ui-field-description" id={`${id}-description`}>
          {props.description}
        </p>
      </div>
    </div>
  );
}

function MixedFields(props: FieldArgs) {
  const id = createUniqueId();
  return (
    <div
      class={styles.preview}
      style={{ width: "min(40rem, 100%)", "--font-size-input": props.fontSize }}
    >
      <div class={styles.grid}>
        <div class="ui-field">
          <label class="ui-field-label" for={`${id}-account`}>
            账号
          </label>
          <div class="ui-input" data-variant={props.variant}>
            <span class="ui-addon" aria-hidden="true">
              @
            </span>
            <input
              id={`${id}-account`}
              placeholder="输入账号"
              disabled={props.disabled}
              aria-describedby={`${id}-account-description`}
            />
          </div>
          <p class="ui-field-description" id={`${id}-account-description`}>
            标签与组合输入框分别组织。
          </p>
        </div>
        <div class="ui-field">
          <label class="ui-field-label" for={`${id}-framework`}>
            开发框架
          </label>
          <select
            class="ui-input"
            id={`${id}-framework`}
            data-variant={props.variant}
            disabled={props.disabled}
            aria-describedby={`${id}-framework-description`}
          >
            <option>Solid</option>
            <option>React</option>
            <option>Vue</option>
          </select>
          <p class="ui-field-description" id={`${id}-framework-description`}>
            原生 select 同样可以作为字段控件。
          </p>
        </div>
        <div class="ui-field">
          <label class="ui-field-label" for={`${id}-notes`}>
            项目描述
          </label>
          <textarea
            class="ui-input"
            id={`${id}-notes`}
            rows={3}
            placeholder="介绍一下项目"
            data-variant={props.variant}
            disabled={props.disabled}
            aria-describedby={`${id}-notes-description`}
          />
          <p class="ui-field-description" id={`${id}-notes-description`}>
            说明可以换行，输入区域保留多行布局。
          </p>
        </div>
      </div>
    </div>
  );
}

function HorizontalFields(props: FieldArgs) {
  const id = createUniqueId();
  return (
    <div
      class={styles.preview}
      style={{ width: "min(28rem, 100%)", "--font-size-input": props.fontSize }}
    >
      <div class={styles.group}>
        <For
          each={[
            { class: "ui-checkbox", type: "checkbox" as const, label: props.label },
            { class: "ui-radio", type: "radio" as const, label: "电子邮件" },
            { class: "ui-switch", type: "checkbox" as const, label: "自动更新" },
          ]}
        >
          {(control, index) => (
            <div class="ui-field" data-orientation="horizontal">
              <input
                class={control.class}
                type={control.type}
                id={`${id}-${index()}`}
                name={`${id}-${index()}`}
                role={control.class === "ui-switch" ? "switch" : undefined}
                disabled={props.disabled}
                aria-describedby={props.description ? `${id}-${index()}-description` : undefined}
              />
              <div class="ui-field-content">
                <label class="ui-field-label" for={`${id}-${index()}`}>
                  {control.label}
                </label>
                <p class="ui-field-description" id={`${id}-${index()}-description`}>
                  {props.description}
                </p>
              </div>
            </div>
          )}
        </For>
        <div class="ui-field" data-orientation="horizontal">
          <input
            class="ui-checkbox"
            type="checkbox"
            id={`${id}-compact`}
            disabled={props.disabled}
          />
          <label class="ui-field-label" for={`${id}-compact`}>
            直接放置标签
          </label>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Styles/Form/Field",
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    variant: { control: "select", options: ["default", "filled", "unstyled"] },
    disabled: { control: "boolean" },
    fontSize: { control: "text", description: "--font-size-input，同步调整标签和输入控件字号。" },
  },
  args: {
    label: "邮箱",
    description: "用于接收项目通知和更新信息。",
    variant: "default",
    disabled: false,
  },
  render: (args: FieldArgs) => <FieldExample {...args} />,
} satisfies Meta<FieldArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MixedControls: Story = {
  parameters: { controls: { exclude: ["label", "description"] } },
  render: (args: FieldArgs) => <MixedFields {...args} />,
};
export const Horizontal: Story = {
  args: { label: "接收项目通知" },
  parameters: { controls: { exclude: ["variant"] } },
  render: (args: FieldArgs) => <HorizontalFields {...args} />,
};
