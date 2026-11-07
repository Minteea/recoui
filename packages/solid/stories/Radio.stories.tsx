import { createSignal, createUniqueId } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { LabelWrapper, Radio, type RadioProps } from "~";

const meta = {
  title: "Components/Input/Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { color: "primary", "aria-label": "邮件通知" },
  render: (args: RadioProps) => {
    const id = createUniqueId();
    return (
      <LabelWrapper label="邮件通知" labelProps={{ for: args.id ?? id }}>
        <Radio {...args} id={args.id ?? id} />
      </LabelWrapper>
    );
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { checked: true, disabled: true } };

export const NativeGroup: Story = {
  render: (args: RadioProps) => {
    const name = createUniqueId();
    const [channel, setChannel] = createSignal("email");
    return (
      <fieldset style={{ border: "0", margin: "0", padding: "0" }}>
        <legend style={{ "margin-bottom": "0.75rem" }}>通知方式</legend>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <LabelWrapper label="邮件" labelProps={{ for: `${args.id ?? name}-email` }}>
            <Radio
              {...args}
              id={`${args.id ?? name}-email`}
              name={name}
              value="email"
              aria-label="邮件"
              checked={channel() === "email"}
              onChange={(event) => setChannel(event.currentTarget.value)}
            />
          </LabelWrapper>
          <LabelWrapper label="应用推送" labelProps={{ for: `${args.id ?? name}-push` }}>
            <Radio
              {...args}
              id={`${args.id ?? name}-push`}
              name={name}
              value="push"
              aria-label="应用推送"
              checked={channel() === "push"}
              onChange={(event) => setChannel(event.currentTarget.value)}
            />
          </LabelWrapper>
          <LabelWrapper label="短信（不可用）" labelProps={{ for: `${args.id ?? name}-sms` }}>
            <Radio
              {...args}
              id={`${args.id ?? name}-sms`}
              name={name}
              value="sms"
              aria-label="短信"
              disabled
            />
          </LabelWrapper>
          <output aria-live="polite">
            当前选择：{channel() === "email" ? "邮件" : "应用推送"}
          </output>
        </div>
      </fieldset>
    );
  },
};
