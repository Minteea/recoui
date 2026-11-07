import { Component, splitProps, type JSX } from "solid-js";
import type { UIColorProps, UIRadiusProps } from "~/types";
import clsx from "clsx";

export type ButtonVariantType = "default" | "filled" | "light" | "outline" | "ghost" | "text";

export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    UIColorProps,
    UIRadiusProps {
  variant?: ButtonVariantType;
  width?: string | "icon" | "block";
}

/** 按钮组件 */
export const Button: Component<ButtonProps> = (props) => {
  const [localProps, uiProps, restProps] = splitProps(
    props,
    ["children", "class", "classList"],
    ["variant", "color", "radius", "width"],
  );

  return (
    <button
      class={clsx("ui-button", localProps.class)}
      classList={localProps.classList}
      data-variant={uiProps.variant}
      data-color={uiProps.color}
      data-radius={uiProps.radius}
      data-width={uiProps.width}
      {...restProps}
    >
      {localProps.children}
    </button>
  );
};
