import type { InputControlProps, InputProps, InputType, NativeInputProps } from "~";

type Assert<T extends true> = T;

// 由包级 tsc 检查，不作为运行时测试执行。
export type InputTypeContract = [
  Assert<"button" extends InputType ? false : true>,
  Assert<"range" extends InputType ? false : true>,
  Assert<"button" extends NonNullable<InputProps["type"]> ? false : true>,
  Assert<"range" extends NonNullable<InputProps["type"]> ? false : true>,
  Assert<string extends InputType ? false : true>,
  Assert<
    "text" | "email" | "password" | "number" | "date" | "file" extends InputType ? true : false
  >,
  Assert<undefined extends InputProps["type"] ? true : false>,
  Assert<"button" extends NonNullable<NativeInputProps["type"]> ? false : true>,
  Assert<"range" extends NonNullable<NativeInputProps["type"]> ? false : true>,
  Assert<"button" extends NonNullable<InputControlProps["type"]> ? false : true>,
  Assert<"range" extends NonNullable<InputControlProps["type"]> ? false : true>,
  Assert<"file" | "color" extends NonNullable<NativeInputProps["type"]> ? true : false>,
  Assert<"text" | "email" extends NonNullable<InputControlProps["type"]> ? true : false>,
  Assert<undefined extends NativeInputProps["type"] ? true : false>,
  Assert<undefined extends InputControlProps["type"] ? true : false>,
];
