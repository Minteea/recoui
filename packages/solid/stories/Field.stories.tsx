import { createEffect, createSignal, createUniqueId, splitProps } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Checkbox, Field, Input, Radio, Select, type FieldProps } from "~";

const describedBy = (props: FieldProps, id: string) => {
  const description = props.Description !== undefined ? props.Description : props.description;
  return description != null && typeof description !== "boolean" ? id : undefined;
};

const meta = {
  title: "Components/Form/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Field 通过 label、description 或 Label、Description 属性组合标签、控件和说明，内容支持 JSX。horizontal 控制布局方向。通过 labelProps 的 for、descriptionProps 的 id 和控件的 aria-describedby 显式关联；也可使用 Field.Root、Field.Content、Field.Label、Field.Description 自由组合。",
      },
    },
  },
  argTypes: {
    class: { control: "text" },
    horizontal: { control: "boolean", description: "将控件与标签说明水平排列。" },
    label: { control: "text", description: "标签内容，支持文本和 JSX。" },
    description: { control: "text", description: "说明内容，支持文本和 JSX。" },
    Label: { control: "text", description: "标签内容，设置后优先于 label。" },
    Description: { control: "text", description: "说明内容，设置后优先于 description。" },
    labelProps: { control: "object" },
    descriptionProps: { control: "object" },
    children: { control: false, table: { disable: true } },
  },
  args: {
    horizontal: false,
    label: "电子邮箱",
    description: "用于接收账户通知。",
    style: { width: "min(20rem, 80vw)" },
  },
  render: (args: FieldProps) => {
    const id = createUniqueId();
    const descriptionId = `${id}-description`;
    return (
      <Field
        {...args}
        labelProps={{ ...args.labelProps, for: id }}
        descriptionProps={{ ...args.descriptionProps, id: descriptionId }}
      >
        <Input
          id={id}
          name="email"
          type="email"
          width="block"
          placeholder="name@example.com"
          aria-describedby={describedBy(args, descriptionId)}
        />
      </Field>
    );
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithSelect: Story = {
  args: {
    label: "开发框架",
    description: "选项由原生 option 标签提供。",
  },
  render: (args: FieldProps) => {
    const id = createUniqueId();
    const descriptionId = `${id}-description`;
    return (
      <Field
        {...args}
        labelProps={{ ...args.labelProps, for: id }}
        descriptionProps={{ ...args.descriptionProps, id: descriptionId }}
      >
        <Select
          id={id}
          name="framework"
          width="block"
          value="solid"
          aria-describedby={describedBy(args, descriptionId)}
        >
          <option value="">请选择框架</option>
          <option value="solid">Solid</option>
          <option value="react">React</option>
        </Select>
      </Field>
    );
  },
};

export const WithCheckbox: Story = {
  args: {
    label: "接收产品更新",
    description: "点击标签也可以切换复选框。",
  },
  render: (args: FieldProps) => {
    const id = createUniqueId();
    const descriptionId = `${id}-description`;
    return (
      <Field
        {...args}
        labelProps={{ ...args.labelProps, for: id }}
        descriptionProps={{ ...args.descriptionProps, id: descriptionId }}
      >
        <Checkbox id={id} name="updates" aria-describedby={describedBy(args, descriptionId)} />
      </Field>
    );
  },
};

export const WithoutDescription: Story = {
  args: { label: "昵称", description: undefined },
  render: (args: FieldProps) => {
    const id = createUniqueId();
    const descriptionId = `${id}-description`;
    return (
      <Field
        {...args}
        labelProps={{ ...args.labelProps, for: id }}
        descriptionProps={{ ...args.descriptionProps, id: descriptionId }}
      >
        <Input
          id={id}
          name="nickname"
          width="block"
          placeholder="请输入昵称"
          aria-describedby={describedBy(args, descriptionId)}
        />
      </Field>
    );
  },
};

export const RichContent: Story = {
  argTypes: {
    label: { control: false },
    description: { control: false },
    Label: { control: false },
    Description: { control: false },
  },
  render: (args: FieldProps) => {
    const id = createUniqueId();
    const descriptionId = `${id}-description`;
    return (
      <Field
        {...args}
        label={
          <>
            <strong>电子邮箱</strong>
            <span aria-hidden="true">*</span>
          </>
        }
        description={
          <>
            用于接收<strong>重要通知</strong>，请阅读
            <a href="#privacy" onClick={(event) => event.preventDefault()}>
              隐私说明
            </a>
            。
          </>
        }
        labelProps={{ ...args.labelProps, for: id }}
        descriptionProps={{ ...args.descriptionProps, id: descriptionId }}
      >
        <Input
          id={id}
          name="email"
          type="email"
          width="block"
          required
          placeholder="name@example.com"
          aria-describedby={descriptionId}
        />
      </Field>
    );
  },
};

export const AtomicComposition: Story = {
  argTypes: {
    horizontal: { control: false },
    label: { control: false },
    description: { control: false },
    Label: { control: false },
    Description: { control: false },
    labelProps: { control: false },
    descriptionProps: { control: false },
  },
  render: (args: FieldProps) => {
    const [, rootProps] = splitProps(args, [
      "horizontal",
      "label",
      "description",
      "Label",
      "Description",
      "labelProps",
      "descriptionProps",
    ]);
    const id = createUniqueId();
    const descriptionId = `${id}-description`;
    return (
      <Field.Root {...rootProps}>
        <Field.Label for={id}>电子邮箱</Field.Label>
        <Input
          id={id}
          name="email"
          type="email"
          width="block"
          placeholder="name@example.com"
          aria-describedby={descriptionId}
        />
        <Field.Description id={descriptionId}>也可自由组合原子组件。</Field.Description>
      </Field.Root>
    );
  },
};

export const HorizontalCheckbox: Story = {
  ...WithCheckbox,
  args: {
    ...WithCheckbox.args,
    horizontal: true,
  },
};

export const HorizontalRadio: Story = {
  args: {
    horizontal: true,
    label: "按月订阅",
    description: "每个月接收一次项目进展。",
  },
  render: (args: FieldProps) => {
    const id = createUniqueId();
    const descriptionId = `${id}-description`;
    return (
      <Field
        {...args}
        labelProps={{ ...args.labelProps, for: id }}
        descriptionProps={{ ...args.descriptionProps, id: descriptionId }}
      >
        <Radio
          id={id}
          name="frequency"
          value="monthly"
          checked
          aria-describedby={describedBy(args, descriptionId)}
        />
      </Field>
    );
  },
};

export const HorizontalSwitch: Story = {
  args: {
    horizontal: true,
    Label: "启用项目通知",
    Description: "开启后接收项目更新、任务提醒和重要公告，较长的说明会在内容区域内换行。",
  },
  render: (args: FieldProps) => {
    const id = createUniqueId();
    const descriptionId = `${id}-description`;
    return (
      <Field
        {...args}
        labelProps={{ ...args.labelProps, for: id }}
        descriptionProps={{ ...args.descriptionProps, id: descriptionId }}
      >
        <input
          class="ui-switch"
          type="checkbox"
          id={id}
          name="notifications"
          checked
          aria-describedby={describedBy(args, descriptionId)}
        />
      </Field>
    );
  },
};

export const ReactiveOrientation: Story = {
  args: {
    label: "接收产品更新",
    description: "先勾选复选框，再切换布局。",
  },
  render: (args: FieldProps) => {
    const id = createUniqueId();
    const descriptionId = `${id}-description`;
    const [horizontal, setHorizontal] = createSignal(!!args.horizontal);
    const [checked, setChecked] = createSignal(false);
    createEffect(() => setHorizontal(!!args.horizontal));

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        <button
          class="ui-button"
          type="button"
          aria-pressed={horizontal()}
          onClick={() => setHorizontal(!horizontal())}
        >
          切换为{horizontal() ? "垂直" : "水平"}布局
        </button>
        <Field
          {...args}
          horizontal={horizontal()}
          labelProps={{ ...args.labelProps, for: id }}
          descriptionProps={{ ...args.descriptionProps, id: descriptionId }}
        >
          <Checkbox
            id={id}
            name="updates"
            aria-describedby={describedBy(args, descriptionId)}
            onChange={(event) => setChecked(event.currentTarget.checked)}
          />
        </Field>
        <output aria-live="polite">{checked() ? "已勾选" : "未勾选"}</output>
      </div>
    );
  },
};

export const HorizontalAtomicComposition: Story = {
  argTypes: AtomicComposition.argTypes,
  render: (args: FieldProps) => {
    const [, rootProps] = splitProps(args, [
      "horizontal",
      "label",
      "description",
      "Label",
      "Description",
      "labelProps",
      "descriptionProps",
    ]);
    const id = createUniqueId();
    const descriptionId = `${id}-description`;
    return (
      <Field.Root {...rootProps} orientation="horizontal">
        <Checkbox id={id} name="updates" aria-describedby={descriptionId} />
        <Field.Content>
          <Field.Label for={id}>接收产品更新</Field.Label>
          <Field.Description id={descriptionId}>通过原子组件组合横向字段。</Field.Description>
        </Field.Content>
      </Field.Root>
    );
  },
};
