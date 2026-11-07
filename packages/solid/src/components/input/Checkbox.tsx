import { splitProps, type Component, type JSX } from "solid-js";
import { isServer } from "solid-js/web";
import clsx from "clsx";
import type { UIColorProps } from "~/types";

export interface CheckboxProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type">,
    UIColorProps {
  /** 原生不确定状态，与 checked 独立，显示横线。 */
  indeterminate?: boolean;
}

/** 原生复选框，不包含标签或外层容器。 */
export const Checkbox: Component<CheckboxProps> = (props) => {
  const [localProps, uiProps, restProps] = splitProps(
    props,
    ["children", "class", "classList", "indeterminate"],
    ["color"],
  );

  return (
    <input
      class={clsx("ui-checkbox", localProps.class)}
      classList={localProps.classList}
      data-color={uiProps.color}
      // indeterminate 是 DOM property，不能作为 HTML attribute 序列化。
      {...(isServer ? {} : { indeterminate: localProps.indeterminate })}
      {...restProps}
      type="checkbox"
    />
  );
};
