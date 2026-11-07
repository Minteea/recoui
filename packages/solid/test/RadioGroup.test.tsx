import { createSignal, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Field, Radio, RadioGroup } from "~";

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

describe("RadioGroup", () => {
  it("keeps the controlled selection when the change callback does not update value", () => {
    const onValueChange = vi.fn();
    const host = mount(() => (
      <RadioGroup value="basic" onValueChange={onValueChange} aria-label="Plan">
        <Radio value="basic" />
        <Radio value="pro" />
      </RadioGroup>
    ));
    const basic = host.querySelector<HTMLInputElement>("[value=basic]")!;
    const pro = host.querySelector<HTMLInputElement>("[value=pro]")!;

    pro.click();
    expect(onValueChange).toHaveBeenCalledWith("pro");
    expect(basic.checked).toBe(true);
    expect(pro.checked).toBe(false);
  });

  it("groups wrapped radios independently and restores native form defaults on reset", async () => {
    const onValueChange = vi.fn();
    const onOptionChange = vi.fn();
    const onGroupChange = vi.fn();
    let radioRef: HTMLInputElement | undefined;
    const host = mount(() => (
      <form>
        <RadioGroup
          defaultValue="basic"
          aria-label="Plan"
          onValueChange={onValueChange}
          onChange={(event) => onGroupChange((event.target as HTMLInputElement).value)}
        >
          <Field horizontal label="Basic" labelProps={{ for: "basic" }}>
            <Radio id="basic" value="basic" />
          </Field>
          <div>
            <label>
              <Radio
                ref={radioRef}
                value="pro"
                class="custom-radio"
                onChange={[
                  (prefix: string, event: Event & { currentTarget: HTMLInputElement }) =>
                    onOptionChange(prefix, event.currentTarget.value),
                  "option",
                ]}
              />
              Pro
            </label>
          </div>
        </RadioGroup>
        <RadioGroup defaultValue="email" aria-label="Channel">
          <Radio value="email" aria-label="Email" />
          <Radio value="push" aria-label="Push" />
        </RadioGroup>
      </form>
    ));
    const form = host.querySelector("form")!;
    const basic = form.querySelector<HTMLInputElement>("[value=basic]")!;
    const pro = form.querySelector<HTMLInputElement>("[value=pro]")!;
    const email = form.querySelector<HTMLInputElement>("[value=email]")!;
    const push = form.querySelector<HTMLInputElement>("[value=push]")!;

    expect(radioRef).toBe(pro);
    expect(pro.classList.contains("ui-radio")).toBe(true);
    expect(pro.classList.contains("custom-radio")).toBe(true);
    expect(basic.labels!.item(0)!.htmlFor).toBe("basic");
    expect(basic.name).toBeTruthy();
    expect(pro.name).toBe(basic.name);
    expect(email.name).toBeTruthy();
    expect(push.name).toBe(email.name);
    expect(email.name).not.toBe(basic.name);
    expect(basic.checked).toBe(true);
    expect(email.checked).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();

    pro.click();
    expect(pro.checked).toBe(true);
    expect(basic.checked).toBe(false);
    expect(email.checked).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith("pro");
    expect(onOptionChange).toHaveBeenLastCalledWith("option", "pro");
    expect(onGroupChange).toHaveBeenLastCalledWith("pro");
    expect([...new FormData(form).entries()]).toEqual([
      [basic.name, "pro"],
      [email.name, "email"],
    ]);

    form.reset();
    await Promise.resolve();
    expect(basic.checked).toBe(true);
    expect(pro.checked).toBe(false);
    expect(email.checked).toBe(true);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(new FormData(form).get(basic.name)).toBe("basic");
    pro.click();
    expect(pro.checked).toBe(true);
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it("reactively controls selection, required validation and disabled inheritance", () => {
    const [value, setValue] = createSignal("basic");
    const [disabled, setDisabled] = createSignal(false);
    const [orientation, setOrientation] = createSignal<"horizontal" | "vertical">("horizontal");
    const onValueChange = vi.fn((next: string) => setValue(next));
    const host = mount(() => (
      <form>
        <RadioGroup
          name="plan"
          value={value()}
          onValueChange={onValueChange}
          required
          disabled={disabled()}
          orientation={orientation()}
          aria-label="Plan"
        >
          <Radio value="basic" aria-label="Basic" />
          <Radio value="pro" aria-label="Pro" />
          <Radio value="enterprise" aria-label="Enterprise" disabled />
        </RadioGroup>
      </form>
    ));
    const form = host.querySelector("form")!;
    const group = form.querySelector<HTMLElement>("[role=radiogroup]")!;
    const basic = form.querySelector<HTMLInputElement>("[value=basic]")!;
    const pro = form.querySelector<HTMLInputElement>("[value=pro]")!;
    const enterprise = form.querySelector<HTMLInputElement>("[value=enterprise]")!;
    expect(basic.name).toBe("plan");
    expect(basic.required).toBe(true);
    expect(pro.required).toBe(true);
    expect(enterprise.disabled).toBe(true);
    expect(form.checkValidity()).toBe(true);

    setValue("pro");
    setOrientation("vertical");
    expect(pro.checked).toBe(true);
    expect(basic.checked).toBe(false);
    expect(group.dataset.orientation).toBe("vertical");
    expect(group.getAttribute("aria-orientation")).toBe("vertical");
    expect(onValueChange).not.toHaveBeenCalled();
    setValue("");
    expect(basic.checked).toBe(false);
    expect(pro.checked).toBe(false);
    expect(form.checkValidity()).toBe(false);

    setDisabled(true);
    expect(basic.disabled).toBe(true);
    expect(pro.disabled).toBe(true);
    expect(group.getAttribute("aria-disabled")).toBe("true");
    pro.click();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(new FormData(form).has("plan")).toBe(false);
    expect(form.checkValidity()).toBe(true);

    setDisabled(false);
    expect(basic.disabled).toBe(false);
    expect(pro.disabled).toBe(false);
    expect(enterprise.disabled).toBe(true);
    basic.click();
    expect(onValueChange).toHaveBeenLastCalledWith("basic");
    expect(value()).toBe("basic");
    expect(new FormData(form).get("plan")).toBe("basic");
    expect(form.checkValidity()).toBe(true);
  });
});
