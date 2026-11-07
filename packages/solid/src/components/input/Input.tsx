import { Show, splitProps, type Component, type JSX } from "solid-js";
import clsx from "clsx";
import { ariaValue } from "~/utils";
import type { InputType, NativeInputProps } from "./NativeInput";

export type { InputType, InputVariantType } from "./NativeInput";

type InputAppearanceProps = Pick<NativeInputProps, "color" | "variant" | "radius" | "width"> & {
  "data-color"?: string;
  "data-variant"?: string;
  "data-radius"?: string;
  "data-width"?: string;
};

export interface InputRootProps extends JSX.HTMLAttributes<HTMLDivElement>, InputAppearanceProps {}

export type InputAddonProps = JSX.HTMLAttributes<HTMLSpanElement>;

export interface InputControlProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "color" | "width"> {
  type?: InputType;
  status?: NativeInputProps["status"];
}

export interface InputProps extends InputControlProps, InputAppearanceProps {
  leftSection?: JSX.Element;
  rightSection?: JSX.Element;
  rootProps?: Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    "children" | "class" | "classList" | "style"
  >;
}

const Root: Component<InputRootProps> = (props) => {
  const [localProps, uiProps, restProps] = splitProps(
    props,
    ["children", "class", "classList"],
    ["color", "variant", "radius", "width"],
  );

  return (
    <div
      class={clsx("ui-input", localProps.class)}
      classList={localProps.classList}
      data-color={uiProps.color}
      data-variant={uiProps.variant}
      data-radius={uiProps.radius}
      data-width={uiProps.width}
      {...restProps}
    >
      {localProps.children}
    </div>
  );
};

const Addon: Component<InputAddonProps> = (props) => {
  const [localProps, restProps] = splitProps(props, ["children", "class", "classList"]);

  return (
    <span
      class={clsx("ui-addon", localProps.class)}
      classList={localProps.classList}
      {...restProps}
    >
      {localProps.children}
    </span>
  );
};

const Control: Component<InputControlProps> = (props) => {
  const [localProps, restProps] = splitProps(props, ["children", "status", "aria-invalid"]);

  return (
    <input
      aria-invalid={localProps.status === "error" ? true : ariaValue(localProps["aria-invalid"])}
      data-warning={localProps.status === "warning" ? "" : undefined}
      {...restProps}
    />
  );
};

const InputComponent: Component<InputProps> = (props) => {
  const [localProps, appearanceProps, inputProps] = splitProps(
    props,
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
    <Root {...localProps.rootProps} {...appearanceProps}>
      <Show when={localProps.leftSection != null && typeof localProps.leftSection !== "boolean"}>
        <Addon>{localProps.leftSection}</Addon>
      </Show>
      <Control {...inputProps} />
      <Show when={localProps.rightSection != null && typeof localProps.rightSection !== "boolean"}>
        <Addon>{localProps.rightSection}</Addon>
      </Show>
    </Root>
  );
};

/** 组合输入框，外观应用于根元素，原生输入属性应用于内部 input。 */
export const Input = Object.assign(InputComponent, { Root, Addon, Input: Control });
