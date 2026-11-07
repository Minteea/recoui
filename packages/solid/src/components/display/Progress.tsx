import { splitProps, type Component, type JSX } from "solid-js";
import { isServer } from "solid-js/web";
import clsx from "clsx";
import type { UIColorProps } from "~/types";

export interface ProgressProps
  extends JSX.ProgressHTMLAttributes<HTMLProgressElement>,
    UIColorProps {}

/** 原生进度条，未提供 value 时保留不确定进度状态。 */
export const Progress: Component<ProgressProps> = (props) => {
  const [localProps, uiProps, restProps] = splitProps(
    props,
    ["children", "class", "classList", "value", "max"],
    ["color"],
  );

  // 客户端通过 attribute 支持移除数值；Solid 1.8 SSR 使用普通属性名。
  const numericAttributes = () => ({
    [isServer ? "value" : "attr:value"]: localProps.value,
    [isServer ? "max" : "attr:max"]: localProps.max,
  });

  return (
    <progress
      class={clsx("ui-progress", localProps.class)}
      classList={localProps.classList}
      data-color={uiProps.color}
      {...numericAttributes()}
      {...restProps}
    >
      {localProps.children}
    </progress>
  );
};
