import { children, Show, splitProps, type Component, type JSX } from "solid-js";
import clsx from "clsx";

export type LabelWrapperRootProps = JSX.HTMLAttributes<HTMLSpanElement>;
export type LabelWrapperLabelProps = JSX.LabelHTMLAttributes<HTMLLabelElement>;

export interface LabelWrapperProps extends LabelWrapperRootProps {
  label?: JSX.Element;
  labelProps?: Omit<LabelWrapperLabelProps, "children">;
}

const Root: Component<LabelWrapperRootProps> = (props) => {
  const [localProps, restProps] = splitProps(props, ["children", "class", "classList"]);

  return (
    <span
      class={clsx("ui-label-wrapper", localProps.class)}
      classList={localProps.classList}
      {...restProps}
    >
      {localProps.children}
    </span>
  );
};

const Label: Component<LabelWrapperLabelProps> = (props) => {
  const [localProps, restProps] = splitProps(props, ["children", "class", "classList"]);

  return (
    <label
      class={clsx("ui-label", localProps.class)}
      classList={localProps.classList}
      {...restProps}
    >
      {localProps.children}
    </label>
  );
};

const LabelWrapperComponent: Component<LabelWrapperProps> = (props) => {
  const [localProps, restProps] = splitProps(props, ["children", "label", "labelProps"]);
  const labelContent = children(() => localProps.label);

  return (
    <Root {...restProps}>
      {localProps.children}
      <Show when={labelContent() != null && typeof labelContent() !== "boolean"}>
        <Label {...localProps.labelProps}>{labelContent()}</Label>
      </Show>
    </Root>
  );
};

/** 控件在前、标签在后，通过 labelProps.for 关联控件的 id。 */
export const LabelWrapper = Object.assign(LabelWrapperComponent, { Root, Label });
