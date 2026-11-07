import { createSignal, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox, Input, NativeInput, type NativeInputProps } from "~";

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  dispose = undefined;
  document.body.replaceChildren();
});

function mount(element: () => JSX.Element) {
  const host = document.createElement("div");
  document.body.append(host);
  dispose = render(element, host);
  return host;
}

describe("NativeInput", () => {
  it("forwards native form behavior and events while mapping appearance props", () => {
    const [value, setValue] = createSignal("hello@example.com");
    let inputRef: HTMLInputElement | undefined;
    const onInput = vi.fn<JSX.EventHandler<HTMLInputElement, InputEvent>>((event) =>
      setValue(event.currentTarget.value),
    );
    const host = mount(() => (
      <form>
        <NativeInput
          ref={inputRef}
          type="email"
          name="email"
          required
          value={value()}
          onInput={onInput}
          variant="filled"
          radius="rounded"
          width="12rem"
          class="custom-input"
          classList={{ active: true }}
        />
      </form>
    ));
    const form = host.querySelector("form")!;
    const input = form.querySelector("input")!;
    expect(inputRef).toBe(input);
    expect(form.children.length).toBe(1);
    expect(input.classList.contains("ui-input")).toBe(true);
    expect(input.classList.contains("custom-input")).toBe(true);
    expect(input.classList.contains("active")).toBe(true);
    expect(input.dataset).toMatchObject({ variant: "filled", radius: "rounded", width: "12rem" });
    expect(input.hasAttribute("radius")).toBe(false);
    expect(input.hasAttribute("width")).toBe(false);
    expect(new FormData(form).get("email")).toBe("hello@example.com");
    expect(input.checkValidity()).toBe(true);
    input.value = "invalid-email";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(value()).toBe("invalid-email");
    expect(input.validity.typeMismatch).toBe(true);
    setValue("updated@example.com");
    expect(input.value).toBe("updated@example.com");
  });

  it("does not add runtime type restrictions for JavaScript callers", () => {
    const buttonProps = { type: "button", value: "Run" } as unknown as NativeInputProps;
    const rangeProps = {
      type: "range",
      min: 0,
      max: 100,
      value: 40,
    } as unknown as NativeInputProps;
    const host = mount(() => (
      <>
        <NativeInput {...buttonProps} />
        <NativeInput {...rangeProps} />
      </>
    ));
    const inputs = host.querySelectorAll("input");
    expect(inputs[0]!.type).toBe("button");
    expect(inputs[1]!.type).toBe("range");
    expect(inputs[1]!.value).toBe("40");
  });
});

describe("Input", () => {
  it("routes appearance to the root and keeps native form behavior on the control", () => {
    const [value, setValue] = createSignal("hello@example.com");
    const [status, setStatus] = createSignal<"error" | "warning">("error");
    const [disabled, setDisabled] = createSignal(false);
    let inputRef: HTMLInputElement | undefined;
    let rootRef: HTMLDivElement | undefined;
    const onInput = vi.fn<JSX.EventHandler<HTMLInputElement, InputEvent>>((event) =>
      setValue(event.currentTarget.value),
    );
    const host = mount(() => (
      <form>
        <Input
          ref={inputRef}
          id="email"
          type="email"
          name="email"
          placeholder="name@example.com"
          autocomplete="email"
          aria-describedby="email-help"
          required
          disabled={disabled()}
          value={value()}
          onInput={onInput}
          status={status()}
          color="primary"
          data-color="success"
          variant="filled"
          radius="rounded"
          width="12rem"
          class="custom-input"
          classList={{ active: true }}
          style={{ "max-width": "20rem" }}
          rootProps={{ ref: (element) => (rootRef = element), role: "group" }}
          leftSection={<span>@</span>}
          rightSection="mail"
        />
      </form>
    ));
    const form = host.querySelector("form")!;
    const root = form.firstElementChild as HTMLDivElement;
    const input = root.querySelector("input")!;

    expect(rootRef).toBe(root);
    expect(inputRef).toBe(input);
    expect(root.tagName).toBe("DIV");
    expect(root.classList.contains("ui-input")).toBe(true);
    expect(root.classList.contains("custom-input")).toBe(true);
    expect(root.classList.contains("active")).toBe(true);
    expect(root.style.maxWidth).toBe("20rem");
    expect(root.dataset).toMatchObject({
      color: "success",
      variant: "filled",
      radius: "rounded",
      width: "12rem",
    });
    expect(root.getAttribute("role")).toBe("group");
    expect(root.hasAttribute("id")).toBe(false);
    expect(root.hasAttribute("placeholder")).toBe(false);
    expect(root.hasAttribute("name")).toBe(false);
    expect(root.hasAttribute("required")).toBe(false);
    expect(root.hasAttribute("status")).toBe(false);
    expect([...root.children].map((element) => element.tagName)).toEqual(["SPAN", "INPUT", "SPAN"]);
    expect(root.firstElementChild!.classList.contains("ui-addon")).toBe(true);
    expect(root.lastElementChild!.textContent).toBe("mail");
    expect(input.classList.contains("ui-input")).toBe(false);
    expect(input.hasAttribute("style")).toBe(false);
    expect(input.hasAttribute("data-color")).toBe(false);
    expect(input.hasAttribute("data-width")).toBe(false);
    expect(input.id).toBe("email");
    expect(input.placeholder).toBe("name@example.com");
    expect(input.autocomplete).toBe("email");
    expect(input.getAttribute("aria-describedby")).toBe("email-help");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.required).toBe(true);
    expect(new FormData(form).get("email")).toBe("hello@example.com");

    input.value = "invalid-email";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(value()).toBe("invalid-email");
    expect(input.validity.typeMismatch).toBe(true);
    setValue("updated@example.com");
    expect(input.value).toBe("updated@example.com");
    setStatus("warning");
    expect(input.hasAttribute("aria-invalid")).toBe(false);
    expect(input.hasAttribute("data-warning")).toBe(true);
    setDisabled(true);
    expect(input.disabled).toBe(true);
    expect(new FormData(form).has("email")).toBe(false);
  });

  it("updates optional sections without replacing the control or its edited value", () => {
    const [leftSection, setLeftSection] = createSignal<JSX.Element>(0);
    const [rightSection, setRightSection] = createSignal<JSX.Element>(false);
    const host = mount(() => (
      <Input leftSection={leftSection()} rightSection={rightSection()} placeholder="Edit me" />
    ));
    const root = host.firstElementChild!;
    const input = root.querySelector("input")!;
    input.value = "edited content";
    expect(root.children.length).toBe(2);
    expect(root.firstElementChild!.textContent).toBe("0");

    setLeftSection(null);
    setRightSection(<strong>suffix</strong>);
    expect([...root.children].map((element) => element.tagName)).toEqual(["INPUT", "SPAN"]);
    expect(root.lastElementChild!.querySelector("strong")!.textContent).toBe("suffix");
    setLeftSection(<span>prefix</span>);
    setRightSection(undefined);
    expect([...root.children].map((element) => element.tagName)).toEqual(["SPAN", "INPUT"]);
    expect(root.querySelector("input")).toBe(input);
    expect(input.value).toBe("edited content");
  });

  it("allows atomic composition with native control and addon refs", () => {
    let inputRef: HTMLInputElement | undefined;
    let addonRef: HTMLSpanElement | undefined;
    const onInput = vi.fn();
    const host = mount(() => (
      <Input.Root color="success" width="block">
        <Input.Addon ref={addonRef} class="prefix">
          https://
        </Input.Addon>
        <Input.Input
          ref={inputRef}
          name="website"
          type="url"
          class="custom-control"
          classList={{ active: true }}
          onInput={onInput}
        />
      </Input.Root>
    ));
    const root = host.firstElementChild!;
    const input = root.querySelector("input")!;
    expect(inputRef).toBe(input);
    expect(addonRef).toBe(root.firstElementChild);
    expect(addonRef!.classList.contains("ui-addon")).toBe(true);
    expect(addonRef!.classList.contains("prefix")).toBe(true);
    expect(input.name).toBe("website");
    expect(input.classList.contains("custom-control")).toBe(true);
    expect(input.classList.contains("active")).toBe(true);
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    expect(onInput).toHaveBeenCalledTimes(1);
  });
});

describe("Checkbox indeterminate", () => {
  it("updates the native property independently of checked and form submission", () => {
    const [indeterminate, setIndeterminate] = createSignal<boolean | undefined>(true);
    const [checked, setChecked] = createSignal(false);
    let checkboxRef: HTMLInputElement | undefined;
    const host = mount(() => (
      <form>
        <Checkbox
          ref={checkboxRef}
          name="selection"
          value="all"
          checked={checked()}
          indeterminate={indeterminate()}
        />
      </form>
    ));
    const form = host.querySelector("form")!;
    const checkbox = form.querySelector("input")!;
    expect(checkboxRef).toBe(checkbox);
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox.hasAttribute("indeterminate")).toBe(false);
    expect(new FormData(form).has("selection")).toBe(false);
    setChecked(true);
    expect(checkbox.indeterminate).toBe(true);
    expect(new FormData(form).get("selection")).toBe("all");
    setIndeterminate(false);
    expect(checkbox.indeterminate).toBe(false);
    expect(checkbox.checked).toBe(true);
    setIndeterminate(true);
    expect(checkbox.indeterminate).toBe(true);
    setIndeterminate(undefined);
    expect(checkbox.indeterminate).toBe(false);
  });

  it("keeps native click and disabled behavior for indeterminate checkboxes", () => {
    const [disabled, setDisabled] = createSignal(true);
    const onChange = vi.fn();
    const host = mount(() => (
      <Checkbox indeterminate checked disabled={disabled()} onChange={onChange} />
    ));
    const checkbox = host.querySelector("input")!;
    checkbox.click();
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox.checked).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
    setDisabled(false);
    checkbox.click();
    expect(checkbox.indeterminate).toBe(false);
    expect(checkbox.checked).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
