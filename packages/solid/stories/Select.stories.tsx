import { splitProps } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Select, type SelectProps } from "~";

const meta = {
  title: "Components/Input/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "仅封装原生 select。选项通过 children 中的原生 option、optgroup 设置；没有 options 数据属性或额外下拉菜单结构。",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["default", "filled", "unstyled"] },
    status: { control: "select", options: [undefined, "error", "warning"] },
    color: { control: "text" },
    radius: { control: "text" },
    width: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  args: { color: "primary", "aria-label": "开发技术", value: "solid" },
  render: (args: SelectProps) => (
    <label class="ui-field" style={{ width: "min(20rem, 80vw)" }}>
      <span class="ui-field-label">开发技术</span>
      <Select {...args}>
        <option value="">请选择</option>
        <optgroup label="框架">
          <option value="solid">Solid</option>
          <option value="react">React</option>
          <option value="unavailable" disabled>
            暂未开放
          </option>
        </optgroup>
        <optgroup label="语言">
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
        </optgroup>
      </Select>
    </label>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = { args: { variant: "filled" } };
export const Unstyled: Story = { args: { variant: "unstyled" } };
export const Disabled: Story = { args: { disabled: true } };
export const Error: Story = { args: { status: "error" } };
export const Warning: Story = { args: { status: "warning" } };
export const Rounded: Story = { args: { radius: "rounded" } };

export const Multiple: Story = {
  render: (args: SelectProps) => {
    const [, rest] = splitProps(args, ["value", "children"]);
    return (
      <label class="ui-field" style={{ width: "min(20rem, 80vw)" }}>
        <span class="ui-field-label">开发技术（可多选）</span>
        <Select {...rest} name="technologies" multiple size={5}>
          <optgroup label="框架">
            <option value="solid" selected>
              Solid
            </option>
            <option value="react">React</option>
          </optgroup>
          <optgroup label="语言">
            <option value="typescript" selected>
              TypeScript
            </option>
            <option value="javascript">JavaScript</option>
          </optgroup>
        </Select>
        <span class="ui-field-description">使用 Ctrl / Command 配合点击，可选择多个选项。</span>
      </label>
    );
  },
};
