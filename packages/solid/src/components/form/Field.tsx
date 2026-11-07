import { children, Show, splitProps, type Component, type JSX } from "solid-js";
import clsx from "clsx";

export interface FieldRootProps extends JSX.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

export type FieldContentProps = JSX.HTMLAttributes<HTMLDivElement>;
export type FieldLabelProps = JSX.LabelHTMLAttributes<HTMLLabelElement>;
export type FieldDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement>;

export interface FieldProps extends Omit<FieldRootProps, "orientation"> {
  horizontal?: boolean;
  label?: JSX.Element;
  description?: JSX.Element;
  /** 优先于 label。 */
  Label?: JSX.Element;
  /** 优先于 description。 */
  Description?: JSX.Element;
  labelProps?: Omit<FieldLabelProps, "children">;
  descriptionProps?: Omit<FieldDescriptionProps, "children">;
}

const Root: Component<FieldRootProps> = (props) => {
  const [localProps, restProps] = splitProps(props, [
    "children",
    "class",
    "classList",
    "orientation",
  ]);

  return (
    <div
      class={clsx("ui-field", localProps.class)}
      classList={localProps.classList}
      data-orientation={localProps.orientation}
      {...restProps}
    >
      {localProps.children}
    </div>
  );
};

const Content: Component<FieldContentProps> = (props) => {
  const [localProps, restProps] = splitProps(props, ["children", "class", "classList"]);

  return (
    <div
      class={clsx("ui-field-content", localProps.class)}
      classList={localProps.classList}
      {...restProps}
    >
      {localProps.children}
    </div>
  );
};

const Label: Component<FieldLabelProps> = (props) => {
  const [localProps, restProps] = splitProps(props, ["children", "class", "classList"]);

  return (
    <label
      class={clsx("ui-field-label", localProps.class)}
      classList={localProps.classList}
      {...restProps}
    >
      {localProps.children}
    </label>
  );
};

const Description: Component<FieldDescriptionProps> = (props) => {
  const [localProps, restProps] = splitProps(props, ["children", "class", "classList"]);

  return (
    <p
      class={clsx("ui-field-description", localProps.class)}
      classList={localProps.classList}
      {...restProps}
    >
      {localProps.children}
    </p>
  );
};

const FieldComponent: Component<FieldProps> = (props) => {
  const [localProps, restProps] = splitProps(props, [
    "children",
    "class",
    "classList",
    "horizontal",
    "label",
    "description",
    "Label",
    "Description",
    "labelProps",
    "descriptionProps",
  ]);

  const labelContent = children(() => {
    const content = localProps.Label;
    return content === undefined ? localProps.label : content;
  });
  const descriptionContent = children(() => {
    const content = localProps.Description;
    return content === undefined ? localProps.description : content;
  });

  const renderLabel = () => (
    <Show when={labelContent() != null && typeof labelContent() !== "boolean"}>
      <Label {...localProps.labelProps}>{labelContent()}</Label>
    </Show>
  );
  const renderDescription = () => (
    <Show when={descriptionContent() != null && typeof descriptionContent() !== "boolean"}>
      <Description {...localProps.descriptionProps}>{descriptionContent()}</Description>
    </Show>
  );

  // 独立插入各个可变区域，布局切换时保留控件的 DOM 位置和原生焦点。
  return (
    <div
      class={clsx("ui-field", localProps.class)}
      classList={localProps.classList}
      data-orientation={localProps.horizontal ? "horizontal" : undefined}
      {...restProps}
    >
      <Show when={!localProps.horizontal}>{renderLabel()}</Show>
      {localProps.children}
      <Show when={localProps.horizontal} fallback={renderDescription()}>
        <Content>
          {renderLabel()}
          {renderDescription()}
        </Content>
      </Show>
    </div>
  );
};

/** 通过属性组合字段内容，也可使用原子组件自由组织结构。 */
export const Field = Object.assign(FieldComponent, { Root, Content, Label, Description });
