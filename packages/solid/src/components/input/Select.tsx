import { createRenderEffect, splitProps, type Component, type JSX } from "solid-js";
import { isServer } from "solid-js/web";
import clsx from "clsx";
import type { UIColorProps, UIRadiusProps } from "~/types";
import { ariaValue } from "~/utils";
import type { InputVariantType } from "./Input";

export type SelectVariantType = InputVariantType;

export interface SelectProps
  extends JSX.SelectHTMLAttributes<HTMLSelectElement>,
    UIColorProps,
    UIRadiusProps {
  variant?: SelectVariantType;
  status?: "error" | "warning";
  width?: string | "block";
}

/** 原生选择框，选项通过 children 中的 option、optgroup 提供。 */
export const Select: Component<SelectProps> = (props) => {
  const [localProps, uiProps, restProps] = splitProps(
    props,
    ["children", "class", "classList", "value", "aria-invalid"],
    ["variant", "color", "radius", "width", "status"],
  );

  let select!: HTMLSelectElement;
  const element = (
    <select
      ref={select}
      class={clsx("ui-input", localProps.class)}
      classList={localProps.classList}
      data-variant={uiProps.variant}
      data-color={uiProps.color}
      data-radius={uiProps.radius}
      data-width={uiProps.width}
      aria-invalid={uiProps.status === "error" ? true : ariaValue(localProps["aria-invalid"])}
      data-warning={uiProps.status === "warning" ? "" : undefined}
      value={isServer ? localProps.value : undefined}
      {...restProps}
    >
      {localProps.children}
    </select>
  );

  // multiple 先生效，再插入原生选项，最后绑定 value；不接管选项或选中状态。
  if (!isServer) {
    createRenderEffect(() => {
      const value = localProps.value;
      if (value !== undefined) select.value = String(value);
    });
  }

  return element;
};
