import { createRenderEffect, splitProps, useContext, type Component, type JSX } from "solid-js";
import { isServer } from "solid-js/web";
import clsx from "clsx";
import type { UIColorProps } from "~/types";
import { RadioGroupContext } from "../form/RadioGroupContext";

export interface RadioProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type">,
    UIColorProps {}

/** 原生单选框，通过 name 分组，在 RadioGroup 中继承组的选中值和表单状态。 */
export const Radio: Component<RadioProps> = (props) => {
  const [localProps, uiProps, restProps] = splitProps(
    props,
    ["children", "class", "classList", "checked", "name", "disabled", "required"],
    ["color"],
  );
  const group = useContext(RadioGroupContext);
  let input!: HTMLInputElement;

  const checkedProps = () => {
    if (!group) return { checked: localProps.checked };
    if (!isServer) return {};

    const value = group.value ?? group.defaultValue;
    return { checked: value !== undefined && value === String(props.value ?? "on") };
  };

  const element = (
    <input
      ref={input}
      class={clsx("ui-radio", localProps.class)}
      classList={localProps.classList}
      data-color={uiProps.color}
      {...restProps}
      {...checkedProps()}
      {...(group ? { "on:change": group.onChange } : {})}
      name={group?.name ?? localProps.name}
      disabled={group?.disabled || localProps.disabled}
      required={group?.required || localProps.required}
      type="radio"
    />
  );

  if (group && !isServer) {
    createRenderEffect(() => {
      const value = group.value;
      const selected = (value ?? group.defaultValue) === String(props.value ?? "on");

      // defaultChecked 同步原生默认值，供 form.reset() 恢复非受控选择。
      input.defaultChecked = selected;
      if (value !== undefined) {
        group.selectionVersion();
        input.checked = selected;
      }
    });
  }

  return element;
};
