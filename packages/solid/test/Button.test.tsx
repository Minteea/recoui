import { createSignal, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "~";

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
  return host.querySelector("button")!;
}

describe("Button", () => {
  it("forwards native attributes, refs and classes while mapping appearance props", () => {
    let buttonRef: HTMLButtonElement | undefined;
    const button = mount(() => (
      <Button
        ref={buttonRef}
        type="submit"
        name="action"
        value="save"
        class="custom"
        classList={{ active: true }}
        variant="filled"
        color="success"
        data-radius="rounded"
        data-width="block"
        aria-label="保存内容"
      >
        保存
      </Button>
    ));

    expect(buttonRef).toBe(button);
    expect(button.classList.contains("ui-button")).toBe(true);
    expect(button.classList.contains("custom")).toBe(true);
    expect(button.classList.contains("active")).toBe(true);
    expect(button.getAttribute("data-variant")).toBe("filled");
    expect(button.getAttribute("data-color")).toBe("success");
    expect(button.hasAttribute("variant")).toBe(false);
    expect(button.hasAttribute("color")).toBe(false);
    expect(button.getAttribute("data-radius")).toBe("rounded");
    expect(button.getAttribute("data-width")).toBe("block");
    expect(button.getAttribute("aria-label")).toBe("保存内容");
    expect(button.type).toBe("submit");
    expect(button.name).toBe("action");
    expect(button.value).toBe("save");
    expect(button.textContent).toBe("保存");
  });

  it("updates reactive props and retains native disabled click behavior", () => {
    const [disabled, setDisabled] = createSignal(false);
    const [label, setLabel] = createSignal("保存");
    const onClick = vi.fn();
    const button = mount(() => (
      <Button disabled={disabled()} onClick={onClick}>
        {label()}
      </Button>
    ));

    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    setDisabled(true);
    setLabel("已禁用");
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe("已禁用");
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
