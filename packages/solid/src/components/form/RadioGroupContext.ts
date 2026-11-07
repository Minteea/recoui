import { createContext, type Accessor, type JSX } from "solid-js";

interface RadioGroupContextValue {
  readonly name: string;
  readonly value: string | undefined;
  readonly defaultValue: string | undefined;
  readonly disabled: boolean | undefined;
  readonly required: boolean | undefined;
  selectionVersion: Accessor<number>;
  onChange: JSX.ChangeEventHandler<HTMLInputElement, Event>;
}

export const RadioGroupContext = createContext<RadioGroupContextValue>();
