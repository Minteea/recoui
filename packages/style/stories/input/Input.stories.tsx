import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createUniqueId, For } from "solid-js";
import styles from "../shared/preview.module.css";

const inputTypes = [
  "text",
  "email",
  "password",
  "search",
  "tel",
  "url",
  "number",
  "file",
  "color",
  "date",
  "time",
  "datetime-local",
  "month",
  "week",
] as const;

interface InputArgs {
  type: (typeof inputTypes)[number];
  variant: "default" | "filled" | "unstyled";
  color: string;
  radius?: string;
  width?: string;
  status?: "error" | "warning";
  value?: string;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  min?: string;
  max?: string;
  step?: string;
}

const appearance = (args: InputArgs) => ({
  class: "ui-input",
  "data-variant": args.variant,
  "data-color": args.color,
  "data-radius": args.radius,
  "data-width": args.width,
});

function StyledInput(props: InputArgs & { id?: string; list?: string }) {
  const value = () =>
    props.type === "file" ? "" : props.value ?? (props.type === "color" ? "#228be6" : "");
  return (
    <input
      {...appearance(props)}
      id={props.id}
      list={props.list}
      type={props.type}
      value={value()}
      placeholder={props.placeholder}
      disabled={props.disabled}
      readonly={props.readonly}
      min={props.min}
      max={props.max}
      step={props.step}
      aria-invalid={props.status === "error" || undefined}
      data-warning={props.status === "warning" ? "" : undefined}
    />
  );
}

const meta = {
  title: "Styles/Input/Input",
  parameters: { layout: "padded" },
  argTypes: {
    type: { control: "select", options: inputTypes },
    variant: { control: "select", options: ["default", "filled", "unstyled"] },
    color: { control: "text" },
    radius: { control: "text", description: "data-radius" },
    width: { control: "text", description: "data-width" },
    status: { control: "select", options: [undefined, "error", "warning"] },
    value: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    min: { control: "text" },
    max: { control: "text" },
    step: { control: "text" },
  },
  args: {
    type: "text",
    variant: "default",
    color: "primary",
    placeholder: "请输入内容",
    disabled: false,
    readonly: false,
  },
  render: (args: InputArgs) => {
    const id = createUniqueId();
    return (
      <div class={styles.preview} style={{ width: "min(20rem, 100%)" }}>
        <div class="ui-field">
          <label class="ui-label" for={id}>
            输入内容
          </label>
          <StyledInput {...args} id={id} />
        </div>
      </div>
    );
  },
} satisfies Meta<InputArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  parameters: { controls: { exclude: ["variant"] } },
  render: (args: InputArgs) => {
    const id = createUniqueId();
    return (
      <div class={styles.preview}>
        <div class={styles.grid}>
          <For each={["default", "filled", "unstyled"] as const}>
            {(variant) => (
              <div class={styles.example}>
                <label class={styles.markup} for={`${id}-${variant}`}>
                  {variant}
                </label>
                <StyledInput {...args} id={`${id}-${variant}`} variant={variant} />
              </div>
            )}
          </For>
        </div>
      </div>
    );
  },
};

export const NativeTypes: Story = {
  parameters: { controls: { exclude: ["type"] } },
  argTypes: {
    value: { description: "password/tel 的初始值，其他输入类型使用各自的预设值。" },
  },
  render: (args: InputArgs) => {
    const id = createUniqueId();
    const examples = [
      { type: "text", value: "普通文本" },
      { type: "email", value: "hello@example.com" },
      { type: "password", placeholder: "手动输入以查看原生眼睛" },
      { type: "search", value: "搜索内容" },
      { type: "tel", placeholder: "+86 138 0000 0000" },
      { type: "url", value: "https://example.com" },
      { type: "number", value: "3", min: "0", max: "10", step: "1" },
      { type: "file", value: "" },
      { type: "color", value: "#228be6" },
      { type: "date", value: "2026-11-07" },
      { type: "time", value: "09:30" },
      { type: "datetime-local", value: "2026-11-07T09:30" },
      { type: "month", value: "2026-11" },
      { type: "week", value: "2026-W45" },
    ] satisfies Array<Partial<InputArgs> & { type: InputArgs["type"] }>;
    return (
      <div class={styles.preview}>
        <div class={styles.grid}>
          <For each={examples}>
            {(example) => (
              <div class={styles.example}>
                <label class={styles.markup} for={`${id}-${example.type}`}>
                  {example.type}
                </label>
                <StyledInput {...args} {...example} id={`${id}-${example.type}`} />
              </div>
            )}
          </For>
          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-textarea`}>
              textarea
            </label>
            <textarea
              {...appearance(args)}
              id={`${id}-textarea`}
              rows={3}
              value={"第一行\n第二行"}
              disabled={args.disabled}
              readonly={args.readonly}
            />
          </div>
          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-select`}>
              select / optgroup / option
            </label>
            <select {...appearance(args)} id={`${id}-select`} disabled={args.disabled}>
              <optgroup label="框架">
                <option value="solid" selected>
                  Solid
                </option>
                <option value="react">React</option>
              </optgroup>
              <option value="other" disabled>
                其他（不可用）
              </option>
            </select>
          </div>
        </div>
      </div>
    );
  },
};

export const States: Story = {
  parameters: { controls: { exclude: ["type", "value", "min", "max", "step"] } },
  render: (args: InputArgs) => {
    const id = createUniqueId();
    const states = [
      { label: "正常", value: "可编辑内容" },
      { label: "禁用", value: "不可编辑", disabled: true },
      { label: "只读", value: "可聚焦和选择文字", readonly: true },
      { label: "错误", value: "请检查输入内容", status: "error" },
      { label: "警告", value: "请核对输入内容", status: "warning" },
      { label: "原生校验", type: "email", value: "invalid-email" },
    ] satisfies Array<Partial<InputArgs> & { label: string }>;
    return (
      <div class={styles.preview}>
        <div class={styles.grid}>
          <For each={states}>
            {(state, index) => (
              <div class={styles.example}>
                <label class={styles.markup} for={`${id}-${index()}`}>
                  {state.label}
                </label>
                <StyledInput {...args} type="text" {...state} id={`${id}-${index()}`} />
                <label class={styles.markup} for={`${id}-nested-${index()}`}>
                  组合式输入框
                </label>
                <div {...appearance(args)}>
                  <input
                    id={`${id}-nested-${index()}`}
                    type={state.type ?? "text"}
                    value={state.value}
                    disabled={args.disabled || ("disabled" in state && state.disabled)}
                    readonly={args.readonly || ("readonly" in state && state.readonly)}
                    aria-invalid={state.status === "error" || undefined}
                    data-warning={state.status === "warning" ? "" : undefined}
                  />
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    );
  },
};

export const Datalist: Story = {
  parameters: { controls: { exclude: ["type", "min", "max", "step"] } },
  args: { placeholder: "输入或选择城市" },
  render: (args: InputArgs) => {
    const id = createUniqueId();
    return (
      <div class={styles.preview} style={{ width: "min(20rem, 100%)" }}>
        <div class="ui-field">
          <label class="ui-label" for={id}>
            城市
          </label>
          <StyledInput {...args} id={id} type="text" list={`${id}-cities`} />
        </div>
        <datalist id={`${id}-cities`}>
          <option value="上海" />
          <option value="北京" />
          <option value="杭州" />
        </datalist>
      </div>
    );
  },
};

export const AsElements: Story = {
  parameters: { controls: { exclude: ["type", "value", "min", "max", "step"] } },
  render: (args: InputArgs) => {
    const id = createUniqueId();
    return (
      <div class={styles.preview} style={{ "--height-input": "4rem" }}>
        <div class={styles.grid}>
          <div class={styles.example}>
            <span class={styles.markup}>div.ui-input</span>
            <div
              {...appearance(args)}
              aria-disabled={args.disabled || undefined}
              tabIndex={args.disabled ? -1 : 0}
            >
              垂直居中
            </div>
          </div>
          <div class={styles.example}>
            <span class={styles.markup}>span.ui-input</span>
            <span
              {...appearance(args)}
              aria-disabled={args.disabled || undefined}
              tabIndex={args.disabled ? -1 : 0}
            >
              垂直居中
            </span>
          </div>
          <div class={styles.example}>
            <span class={styles.markup}>button.ui-input</span>
            <button {...appearance(args)} type="button" disabled={args.disabled}>
              垂直居中
            </button>
          </div>
          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-input`}>
              input.ui-input
            </label>
            <StyledInput {...args} id={`${id}-input`} type="text" value="垂直居中" />
          </div>
          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-textarea`}>
              textarea.ui-input
            </label>
            <textarea
              {...appearance(args)}
              id={`${id}-textarea`}
              rows={3}
              value={"第一行从顶部开始\n第二行正常换行"}
              disabled={args.disabled}
              readonly={args.readonly}
            />
          </div>
        </div>
      </div>
    );
  },
};
