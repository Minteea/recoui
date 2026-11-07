import { batch, createSignal, createUniqueId, splitProps, type Component } from "solid-js";
import { Group, type GroupProps } from "./Group";
import { RadioGroupContext } from "./RadioGroupContext";

export interface RadioGroupProps extends GroupProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

/** 组合 Radio 子组件，共享组名、选中值和表单状态。 */
export const RadioGroup: Component<RadioGroupProps> = (props) => {
  const [localProps, restProps] = splitProps(props, [
    "children",
    "orientation",
    "name",
    "value",
    "defaultValue",
    "onValueChange",
    "disabled",
    "required",
  ]);
  const generatedName = createUniqueId();
  const defaultValue = localProps.defaultValue;
  const [selectionVersion, setSelectionVersion] = createSignal(0);

  const context = {
    get name() {
      return localProps.name ?? generatedName;
    },
    get value() {
      return localProps.value;
    },
    defaultValue,
    get disabled() {
      return localProps.disabled;
    },
    get required() {
      return localProps.required;
    },
    selectionVersion,
    onChange: (event: Event & { currentTarget: HTMLInputElement }) => {
      if (!event.currentTarget.checked || event.currentTarget.disabled) return;

      batch(() => {
        localProps.onValueChange?.(event.currentTarget.value);
        // 受控值未更新时，也同步所有选项的原生 checked 状态。
        setSelectionVersion((value) => value + 1);
      });
    },
  };

  return (
    <RadioGroupContext.Provider value={context}>
      <Group
        role="radiogroup"
        orientation={localProps.orientation}
        aria-orientation={localProps.orientation ?? "horizontal"}
        aria-disabled={localProps.disabled || undefined}
        aria-required={localProps.required || undefined}
        {...restProps}
      >
        {localProps.children}
      </Group>
    </RadioGroupContext.Provider>
  );
};
