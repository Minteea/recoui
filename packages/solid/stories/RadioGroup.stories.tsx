import { createEffect, createSignal, createUniqueId, splitProps, type JSX } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import { Button, Group, LabelWrapper, Radio, RadioGroup, type RadioGroupProps } from "~";

function RadioOption(props: { value: string; label: JSX.Element; disabled?: boolean }) {
  const id = createUniqueId();
  return (
    <LabelWrapper label={props.label} labelProps={{ for: id }}>
      <Radio id={id} value={props.value} disabled={props.disabled} />
    </LabelWrapper>
  );
}

function ChannelOptions() {
  return (
    <>
      <RadioOption value="email" label="电子邮件" />
      <RadioOption value="push" label="应用推送" />
      <RadioOption value="sms" label="短信（暂不可用）" disabled />
    </>
  );
}

const meta = {
  title: "Components/Form/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "RadioGroup 通过子级 Radio 组合选项，共享组名、选中值、禁用和必填状态。orientation 控制排列方向，value 与 onValueChange 用于受控选择，defaultValue 设置初始选择。",
      },
    },
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    name: { control: "text" },
    value: { control: "select", options: [undefined, "email", "push"] },
    defaultValue: { control: "select", options: [undefined, "email", "push"] },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    children: { control: false, table: { disable: true } },
  },
  args: {
    orientation: "horizontal",
    defaultValue: "email",
    disabled: false,
    required: false,
    "aria-label": "通知方式",
    onValueChange: fn(),
  },
  render: (args: RadioGroupProps) => (
    <RadioGroup {...args}>
      <ChannelOptions />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Vertical: Story = { args: { orientation: "vertical" } };
export const Disabled: Story = { args: { disabled: true } };

export const Controlled: Story = {
  args: { value: "email" },
  parameters: { controls: { exclude: ["defaultValue"] } },
  render: (args: RadioGroupProps) => {
    const [value, setValue] = createSignal(args.value ?? "email");
    createEffect(() => setValue(args.value ?? "email"));
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        <RadioGroup
          {...args}
          value={value()}
          onValueChange={(next) => {
            setValue(next);
            args.onValueChange?.(next);
          }}
        >
          <ChannelOptions />
        </RadioGroup>
        <output aria-live="polite">当前值：{value()}</output>
      </div>
    );
  },
};

export const IndependentGroups: Story = {
  parameters: { controls: { exclude: ["name", "value", "defaultValue"] } },
  render: (args: RadioGroupProps) => {
    const [, groupProps] = splitProps(args, ["name", "value", "defaultValue", "aria-label"]);
    const id = createUniqueId();
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <span id={`${id}-work`}>工作通知</span>
          <RadioGroup {...groupProps} defaultValue="email" aria-labelledby={`${id}-work`}>
            <ChannelOptions />
          </RadioGroup>
        </div>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <span id={`${id}-personal`}>个人通知</span>
          <RadioGroup {...groupProps} defaultValue="push" aria-labelledby={`${id}-personal`}>
            <ChannelOptions />
          </RadioGroup>
        </div>
      </div>
    );
  },
};

export const NativeForm: Story = {
  parameters: { controls: { exclude: ["name", "value"] } },
  render: (args: RadioGroupProps) => {
    const [, groupProps] = splitProps(args, ["name", "value"]);
    const [submitted, setSubmitted] = createSignal("提交后显示表单值");
    let form!: HTMLFormElement;
    const readForm = () => setSubmitted(String(new FormData(form).get("channel") ?? "（未选择）"));
    return (
      <form
        ref={form}
        style={{ display: "grid", gap: "1rem" }}
        onSubmit={(event) => {
          event.preventDefault();
          readForm();
        }}
        // reset 事件触发后，下一任务读取浏览器恢复的默认值。
        onReset={() => setTimeout(readForm, 0)}
      >
        <RadioGroup {...groupProps} name="channel">
          <ChannelOptions />
        </RadioGroup>
        <Group>
          <Button type="submit">提交</Button>
          <Button type="reset" variant="ghost">
            重置
          </Button>
        </Group>
        <output aria-live="polite">{submitted()}</output>
      </form>
    );
  },
};
