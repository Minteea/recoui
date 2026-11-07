import { splitProps, type Component, type JSX } from "solid-js";
import { isServer } from "solid-js/web";
import clsx from "clsx";
import type { UIColorProps } from "~/types";

export interface MeterProps extends JSX.MeterHTMLAttributes<HTMLMeterElement>, UIColorProps {}

/** 原生度量条，保留 min、max、low、high、optimum 等原生属性。 */
export const Meter: Component<MeterProps> = (props) => {
  const [localProps, uiProps, restProps] = splitProps(
    props,
    ["children", "class", "classList", "value", "min", "max", "low", "high", "optimum"],
    ["color"],
  );

  // 客户端通过 attribute 支持移除数值；Solid 1.8 SSR 使用普通属性名。
  const numericAttributes = () => ({
    [isServer ? "value" : "attr:value"]: localProps.value,
    [isServer ? "min" : "attr:min"]: localProps.min,
    [isServer ? "max" : "attr:max"]: localProps.max,
    [isServer ? "low" : "attr:low"]: localProps.low,
    [isServer ? "high" : "attr:high"]: localProps.high,
    [isServer ? "optimum" : "attr:optimum"]: localProps.optimum,
  });

  return (
    <meter
      class={clsx("ui-meter", localProps.class)}
      classList={localProps.classList}
      data-color={uiProps.color}
      {...numericAttributes()}
      // Solid 1.8 的 meter JSX 声明使用 HTMLElement，保留公开属性的 HTMLMeterElement 类型。
      {...(restProps as JSX.IntrinsicElements["meter"])}
    >
      {localProps.children}
    </meter>
  );
};
