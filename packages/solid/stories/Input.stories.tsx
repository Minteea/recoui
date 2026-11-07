import { createEffect, createSignal, createUniqueId, For, splitProps } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Field, Input, type InputProps } from "~";

function InputExample(props: InputProps) {
  const id = createUniqueId();
  return (
    <Field
      label="输入内容"
      labelProps={{ for: props.id ?? id }}
      style={{ width: "min(20rem, 80vw)" }}
    >
      <Input {...props} id={props.id ?? id} value={props.type === "file" ? "" : props.value} />
    </Field>
  );
}

function ControlledInput(props: InputProps) {
  const [value, setValue] = createSignal(String(props.value ?? ""));
  createEffect(() => setValue(String(props.value ?? "")));
  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <InputExample
        {...props}
        value={value()}
        onInput={(event) => setValue(event.currentTarget.value)}
      />
      <output aria-live="polite">当前值：{value() || "（空）"}</output>
    </div>
  );
}

function ClearableInput(props: InputProps) {
  const [value, setValue] = createSignal(String(props.value ?? ""));
  createEffect(() => setValue(String(props.value ?? "")));
  let input!: HTMLInputElement;

  return (
    <form style={{ display: "grid", gap: "0.75rem" }} onSubmit={(event) => event.preventDefault()}>
      <InputExample
        {...props}
        ref={input}
        value={value()}
        onInput={(event) => setValue(event.currentTarget.value)}
        rightSection={
          <button
            type="button"
            class="ui-addon-button"
            data-width="icon"
            aria-label="清空内容"
            disabled={props.disabled || props.readonly || !value()}
            onClick={() => {
              setValue("");
              input.focus();
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        }
      />
      <output aria-live="polite">当前值：{value() || "（空）"}</output>
    </form>
  );
}

const meta = {
  title: "Components/Input/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Input 由容器、可选的前后附加内容和原生 input 组成。外观属性、class 和 style 设置在容器上，id、ref、表单属性、ARIA 属性和输入事件设置在内部 input 上。leftSection、rightSection 支持 JSX，也可通过 Input.Root、Input.Addon、Input.Input 自由组合。",
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: [
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
      ],
    },
    variant: { control: "select", options: ["default", "filled", "unstyled"] },
    status: { control: "select", options: [undefined, "error", "warning"] },
    color: { control: "text" },
    radius: { control: "text" },
    width: { control: "text" },
    leftSection: { control: "text", description: "左侧附加内容，支持 JSX。" },
    rightSection: { control: "text", description: "右侧附加内容，支持 JSX。" },
    placeholder: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    min: { control: "text" },
    max: { control: "text" },
    step: { control: "text" },
    rootProps: { control: "object" },
  },
  args: {
    type: "text",
    placeholder: "请输入内容",
    color: "primary",
    disabled: false,
    readonly: false,
    required: false,
  },
  render: (args: InputProps) => <InputExample {...args} />,
} satisfies Meta<typeof Input>;

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

export const WithLeftSection: Story = {
  args: { type: "search", placeholder: "搜索内容" },
  argTypes: { leftSection: { control: false } },
  render: (args: InputProps) => (
    <InputExample
      {...args}
      leftSection={
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="6" />
          <path d="m15 15 5 5" />
        </svg>
      }
    />
  ),
};

export const WithRightSection: Story = {
  args: { type: "number", min: 0, value: 25, rightSection: "kg" },
};

export const WithSections: Story = {
  args: { type: "number", min: 0, value: 100, leftSection: "$", rightSection: "USD" },
};

export const Clearable: Story = {
  args: { value: "点击右侧按钮清空" },
  parameters: { controls: { exclude: ["type", "rightSection"] } },
  render: (args: InputProps) => <ClearableInput {...args} />,
};

export const Controlled: Story = {
  args: { value: "可以编辑这段内容" },
  parameters: { controls: { exclude: ["type"] } },
  render: (args: InputProps) => <ControlledInput {...args} />,
};

export const NativeTypes: Story = {
  render: (args: InputProps) => (
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
          ] satisfies InputProps[]
        }
      >
        {(example) => {
          const id = createUniqueId();
          return (
            <Field label={example.type} labelProps={{ for: id }}>
              <Input {...args} {...example} id={id} />
            </Field>
          );
        }}
      </For>
    </div>
  ),
};

export const Datalist: Story = {
  args: { placeholder: "输入或选择城市" },
  parameters: { controls: { exclude: ["type"] } },
  render: (args: InputProps) => {
    const id = createUniqueId();
    return (
      <Field label="城市" labelProps={{ for: id }} style={{ width: "min(20rem, 80vw)" }}>
        <Input {...args} id={id} list={`${id}-cities`} />
        <datalist id={`${id}-cities`}>
          <option value="上海" />
          <option value="北京" />
          <option value="杭州" />
        </datalist>
      </Field>
    );
  },
};

export const AtomicComposition: Story = {
  args: { placeholder: "example", value: "recoui" },
  parameters: { controls: { exclude: ["leftSection", "rightSection"] } },
  render: (args: InputProps) => {
    const id = createUniqueId();
    const [localProps, appearanceProps, inputProps] = splitProps(
      args,
      ["leftSection", "rightSection", "rootProps"],
      [
        "class",
        "classList",
        "style",
        "color",
        "variant",
        "radius",
        "width",
        "data-color",
        "data-variant",
        "data-radius",
        "data-width",
      ],
    );

    return (
      <Field
        label="网站地址"
        labelProps={{ for: args.id ?? id }}
        style={{ width: "min(24rem, 80vw)" }}
      >
        <Input.Root {...localProps.rootProps} {...appearanceProps}>
          <Input.Addon>https://</Input.Addon>
          <Input.Input
            {...inputProps}
            id={args.id ?? id}
            value={args.type === "file" ? "" : args.value}
          />
          <Input.Addon>.com</Input.Addon>
        </Input.Root>
      </Field>
    );
  },
};
