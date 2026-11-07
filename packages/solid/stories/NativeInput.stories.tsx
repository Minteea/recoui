import { createEffect, createSignal, createUniqueId, For } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { NativeInput, type NativeInputProps } from "~";

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

function NativeInputExample(props: NativeInputProps) {
  return (
    <label class="ui-field" style={{ width: "min(20rem, 80vw)" }}>
      <span class="ui-field-label">输入内容</span>
      <NativeInput {...props} value={props.type === "file" ? "" : props.value} />
    </label>
  );
}

function ControlledNativeInput(props: NativeInputProps) {
  const [value, setValue] = createSignal(String(props.value ?? ""));
  createEffect(() => setValue(String(props.value ?? "")));
  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <NativeInputExample
        {...props}
        value={value()}
        onInput={(event) => setValue(event.currentTarget.value)}
      />
      <output aria-live="polite">当前值：{value() || "（空）"}</output>
    </div>
  );
}

const meta = {
  title: "Components/Input/NativeInput",
  component: NativeInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "原子化 NativeInput 只输出原生 input，标签和说明由调用方组合。Button 和 Range 请使用对应组件；本预览的 type 控制只列出常用输入类型。文件输入不接受程序设置的非空 value。",
      },
    },
  },
  argTypes: {
    type: { control: "select", options: inputTypes },
    variant: { control: "select", options: ["default", "filled", "unstyled"] },
    status: { control: "select", options: [undefined, "error", "warning"] },
    color: { control: "text" },
    radius: { control: "text" },
    width: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    min: { control: "text" },
    max: { control: "text" },
    step: { control: "text" },
  },
  args: {
    type: "text",
    placeholder: "请输入内容",
    color: "primary",
    disabled: false,
    readonly: false,
    required: false,
  },
  render: (args: NativeInputProps) => <NativeInputExample {...args} />,
} satisfies Meta<typeof NativeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
export const WithValue: Story = { args: { value: "Hello Solid" } };
export const Email: Story = { args: { type: "email", placeholder: "name@example.com" } };
export const Password: Story = { args: { type: "password", placeholder: "请输入密码" } };
export const Search: Story = { args: { type: "search", placeholder: "搜索内容" } };
export const Number: Story = { args: { type: "number", min: 0, max: 100, step: 1, value: 3 } };
export const Date: Story = { args: { type: "date", value: "2026-11-07" } };
export const Filled: Story = { args: { variant: "filled" } };
export const Unstyled: Story = { args: { variant: "unstyled" } };
export const Disabled: Story = { args: { disabled: true, value: "不可编辑" } };
export const Readonly: Story = { args: { readonly: true, value: "只读内容" } };
export const Required: Story = { args: { type: "email", required: true, placeholder: "必填邮箱" } };
export const Error: Story = { args: { status: "error", value: "请检查输入内容" } };
export const Warning: Story = { args: { status: "warning", value: "请核对输入内容" } };
export const Rounded: Story = { args: { radius: "rounded" } };
export const CustomWidth: Story = { args: { width: "12rem" } };
export const BlockWidth: Story = { args: { width: "block" } };

export const NativeTypes: Story = {
  render: (args: NativeInputProps) => (
    <div
      style={{
        display: "grid",
        "grid-template-columns": "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))",
        gap: "1rem",
        width: "min(48rem, 85vw)",
      }}
    >
      <For
        each={
          [
            { type: "text", value: "普通文本" },
            { type: "email", value: "hello@example.com" },
            { type: "password", placeholder: "手动输入以查看原生密码图标" },
            { type: "search", value: "搜索内容" },
            { type: "tel", placeholder: "+86 138 0000 0000" },
            { type: "url", value: "https://example.com" },
            { type: "number", value: 3, min: 0, max: 10, step: 1 },
            { type: "file", value: "", multiple: true },
            { type: "color", value: "#228be6" },
            { type: "date", value: "2026-11-07" },
            { type: "time", value: "09:30" },
            { type: "datetime-local", value: "2026-11-07T09:30" },
            { type: "month", value: "2026-11" },
            { type: "week", value: "2026-W45" },
          ] satisfies NativeInputProps[]
        }
      >
        {(example) => (
          <label class="ui-field">
            <span class="ui-field-label">{example.type}</span>
            <NativeInput {...args} {...example} />
          </label>
        )}
      </For>
    </div>
  ),
};

export const Datalist: Story = {
  args: { placeholder: "输入或选择城市" },
  parameters: { controls: { exclude: ["type"] } },
  render: (args: NativeInputProps) => {
    const id = createUniqueId();
    return (
      <label class="ui-field" style={{ width: "min(20rem, 80vw)" }}>
        <span class="ui-field-label">城市</span>
        <NativeInput {...args} list={`${id}-cities`} />
        <datalist id={`${id}-cities`}>
          <option value="上海" />
          <option value="北京" />
          <option value="杭州" />
        </datalist>
      </label>
    );
  },
};

export const Controlled: Story = {
  args: { value: "可以编辑这段内容" },
  parameters: { controls: { exclude: ["type"] } },
  render: (args: NativeInputProps) => <ControlledNativeInput {...args} />,
};
