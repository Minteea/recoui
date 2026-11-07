import { createSignal, createUniqueId } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import styles from "../shared/preview.module.css";

interface LabelWrapperArgs {
  label: string;
  disabled: boolean;
  ariaDisabled: boolean;
}

function SpanExamples(props: LabelWrapperArgs) {
  const id = createUniqueId();

  return (
    <div class={styles.preview}>
      <div class={styles.group} style={{ "justify-items": "start" }}>
        <span class="ui-label-wrapper">
          <input
            class="ui-checkbox"
            id={`${id}-checkbox`}
            name="notifications"
            type="checkbox"
            disabled={props.disabled}
            aria-disabled={props.ariaDisabled || undefined}
          />
          <label class="ui-label" for={`${id}-checkbox`}>
            {props.label}
          </label>
        </span>

        <span class="ui-label-wrapper">
          <input
            class="ui-radio"
            id={`${id}-email`}
            name={`${id}-channel`}
            type="radio"
            value="email"
            checked
            disabled={props.disabled}
            aria-disabled={props.ariaDisabled || undefined}
          />
          <label class="ui-label" for={`${id}-email`}>
            电子邮件
          </label>
        </span>

        <span class="ui-label-wrapper">
          <input
            class="ui-radio"
            id={`${id}-push`}
            name={`${id}-channel`}
            type="radio"
            value="push"
            disabled={props.disabled}
            aria-disabled={props.ariaDisabled || undefined}
          />
          <label class="ui-label" for={`${id}-push`}>
            应用推送
          </label>
        </span>

        <span class="ui-label-wrapper">
          <input
            class="ui-switch"
            id={`${id}-switch`}
            name="automatic-updates"
            type="checkbox"
            role="switch"
            disabled={props.disabled}
            aria-disabled={props.ariaDisabled || undefined}
          />
          <label class="ui-label" for={`${id}-switch`}>
            自动更新
          </label>
        </span>

        <span class="ui-label-wrapper">
          <span class="ui-input" data-width="12rem">
            <input
              id={`${id}-account`}
              name="account"
              placeholder="输入账号"
              disabled={props.disabled}
              aria-disabled={props.ariaDisabled || undefined}
            />
          </span>
          <label class="ui-label" for={`${id}-account`}>
            账号
          </label>
        </span>
      </div>
    </div>
  );
}

function WrappingLabelExamples(props: LabelWrapperArgs) {
  const id = createUniqueId();

  return (
    <div class={styles.preview}>
      <div class={styles.group} style={{ "justify-items": "start" }}>
        <label class="ui-label-wrapper">
          <input
            class="ui-checkbox"
            name="notifications"
            type="checkbox"
            disabled={props.disabled}
            aria-disabled={props.ariaDisabled || undefined}
          />
          <span class="ui-label">{props.label}</span>
        </label>

        <label class="ui-label-wrapper">
          <input
            class="ui-radio"
            name={`${id}-channel`}
            type="radio"
            value="email"
            checked
            disabled={props.disabled}
            aria-disabled={props.ariaDisabled || undefined}
          />
          <span class="ui-label">电子邮件</span>
        </label>

        <label class="ui-label-wrapper">
          <input
            class="ui-radio"
            name={`${id}-channel`}
            type="radio"
            value="push"
            disabled={props.disabled}
            aria-disabled={props.ariaDisabled || undefined}
          />
          <span class="ui-label">应用推送</span>
        </label>

        <label class="ui-label-wrapper">
          <input
            class="ui-switch"
            name="automatic-updates"
            type="checkbox"
            role="switch"
            disabled={props.disabled}
            aria-disabled={props.ariaDisabled || undefined}
          />
          <span class="ui-label">自动更新</span>
        </label>
      </div>
    </div>
  );
}

const meta = {
  title: "Styles/Input/LabelWrapper",
  parameters: { layout: "padded" },
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    ariaDisabled: { control: "boolean" },
  },
  args: { label: "接收项目通知", disabled: false, ariaDisabled: false },
  render: (args: LabelWrapperArgs) => <SpanExamples {...args} />,
} satisfies Meta<LabelWrapperArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WrappingLabel: Story = {
  render: (args: LabelWrapperArgs) => <WrappingLabelExamples {...args} />,
};

export const AriaDisabled: Story = {
  args: { ariaDisabled: true },
  render: (args: LabelWrapperArgs) => {
    const id = createUniqueId();
    const [checked, setChecked] = createSignal(false);

    return (
      <div class={styles.preview}>
        <span class="ui-label-wrapper">
          <button
            class="ui-switch"
            type="button"
            role="switch"
            id={id}
            aria-checked={checked()}
            aria-disabled={args.ariaDisabled || undefined}
            disabled={args.disabled}
            onClick={() => {
              if (!args.ariaDisabled && !args.disabled) setChecked(!checked());
            }}
          />
          <label class="ui-label" for={id}>
            {args.label}
          </label>
        </span>
      </div>
    );
  },
};

export const LongLabel: Story = {
  args: { label: "接收项目通知和重要更新，也可以随时在设置中修改这个选项。" },
  render: (args: LabelWrapperArgs) => {
    const id = createUniqueId();

    return (
      <div class={styles.preview}>
        <span class="ui-label-wrapper" style={{ width: "16rem" }}>
          <input
            class="ui-checkbox"
            id={id}
            name="notifications"
            type="checkbox"
            disabled={args.disabled}
            aria-disabled={args.ariaDisabled || undefined}
          />
          <label class="ui-label" for={id}>
            {args.label}
          </label>
        </span>
      </div>
    );
  },
};
