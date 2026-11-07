import { splitProps, type Component, type JSX } from "solid-js";
import clsx from "clsx";
import type { UIColorProps } from "~/types";

export interface RangeProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type">,
    UIColorProps {}

/** 原生滑块，填充位置通过 style 中的 --ui-slider-position 设置。 */
export const Range: Component<RangeProps> = (props) => {
  const [localProps, uiProps, restProps] = splitProps(
    props,
    ["children", "class", "classList"],
    ["color"],
  );

  return (
    <input
      class={clsx("ui-slider", localProps.class)}
      classList={localProps.classList}
      data-color={uiProps.color}
      {...restProps}
      type="range"
    />
  );
};
