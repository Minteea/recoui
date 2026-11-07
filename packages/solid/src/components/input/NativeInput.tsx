import { Component, splitProps, type JSX } from "solid-js";
import type { UIColorProps, UIRadiusProps } from "~/types";
import clsx from "clsx";
import { ariaValue } from "~/utils";

export type InputVariantType = "default" | "filled" | "unstyled";

/** 支持的原生 input 类型
 * - button/submit/reset 应使用 Button 组件
 * - range/radio/checkbox 应使用对应的原子组件
 * - image/hidden 不支持
 */
export type InputType =
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "month"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

export interface NativeInputProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type">,
    UIColorProps,
    UIRadiusProps {
  type?: InputType;
  variant?: InputVariantType;
  status?: "error" | "warning";
  width?: string | "block";
}

// 保留 JavaScript 调用方的原生类型透传行为，限制仅作用于公开类型。
function inputClass(type?: string) {
  return type === "range"
    ? "ui-slider"
    : ["button", "submit", "reset"].includes(type ?? "")
    ? "ui-button"
    : "ui-input";
}

/** 直接修饰原生 input 元素的输入框。 */
export const NativeInput: Component<NativeInputProps> = (props) => {
  const [localProps, uiProps, restProps] = splitProps(
    props,
    ["children", "class", "classList", "aria-invalid"],
    ["variant", "color", "radius", "width", "status"],
  );

  return (
    <input
      class={clsx(inputClass(props.type), localProps.class)}
      classList={localProps.classList}
      data-variant={uiProps.variant}
      data-color={uiProps.color}
      data-radius={uiProps.radius}
      data-width={uiProps.width}
      aria-invalid={uiProps.status === "error" ? true : ariaValue(localProps["aria-invalid"])}
      data-warning={uiProps.status === "warning" ? "" : undefined}
      {...restProps}
    />
  );
};
