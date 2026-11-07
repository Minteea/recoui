import { createSignal, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox, LabelWrapper, Radio, RadioGroup } from "~";

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

describe("LabelWrapper", () => {
  it("updates label content while preserving the control, checked state and focus", () => {
    const [label, setLabel] = createSignal<JSX.Element>("Updates");
    const [rich, setRich] = createSignal(false);
    const [text, setText] = createSignal("Important updates");
    const initialized = vi.fn();
    const onLabelClick = vi.fn();
    let rootRef: HTMLSpanElement | undefined;
    let labelRef: HTMLLabelElement | undefined;
    let checkboxRef: HTMLInputElement | undefined;
    const StatefulCheckbox = () => {
      initialized();
      return <Checkbox ref={checkboxRef} id="updates" name="updates" value="yes" />;
    };
    const host = mount(() => (
      <form>
        <LabelWrapper
          ref={rootRef}
          class="custom-wrapper"
          classList={{ active: true }}
          label={rich() ? <strong>{text()}</strong> : label()}
          labelProps={{
            for: "updates",
            ref: (element) => (labelRef = element),
            onClick: onLabelClick,
          }}
        >
          <StatefulCheckbox />
        </LabelWrapper>
      </form>
    ));
    const form = host.querySelector("form")!;
    const root = form.firstElementChild as HTMLSpanElement;
    const input = root.querySelector("input")!;
    const initialLabel = root.querySelector("label")!;

    expect(rootRef).toBe(root);
    expect(labelRef).toBe(initialLabel);
    expect(root.classList.contains("custom-wrapper")).toBe(true);
    expect(root.classList.contains("active")).toBe(true);
    expect(input.labels!.item(0)).toBe(initialLabel);
    initialLabel.click();
    expect(input.checked).toBe(true);
    expect(onLabelClick).toHaveBeenCalledTimes(1);
    input.focus();

    setLabel("Changed label");
    expect(root.querySelector("label")!.textContent).toBe("Changed label");
    setRich(true);
    expect(root.querySelector("label strong")!.textContent).toBe("Important updates");
    setText("Updated rich text");
    expect(root.querySelector("label strong")!.textContent).toBe("Updated rich text");
    setRich(false);

    for (const content of [null, 0, false, undefined, "Restored label"]) {
      setLabel(content);
      const renderedLabel = root.querySelector("label");
      if (content === 0 || typeof content === "string") {
        expect(renderedLabel!.textContent).toBe(String(content));
        expect(root.lastElementChild).toBe(renderedLabel);
      } else {
        expect(renderedLabel).toBeNull();
      }
      expect(root.firstElementChild).toBe(input);
      expect(checkboxRef).toBe(input);
      expect(input.checked).toBe(true);
      expect(document.activeElement).toBe(input);
    }
    expect(initialized).toHaveBeenCalledTimes(1);
    expect(new FormData(form).get("updates")).toBe("yes");
    expect(root.hasAttribute("label")).toBe(false);
  });

  it("preserves RadioGroup context and native label activation in full and atomic composition", () => {
    const onValueChange = vi.fn();
    const Options = () => (
      <>
        <LabelWrapper label="Email" labelProps={{ for: "email" }}>
          <Radio id="email" value="email" />
        </LabelWrapper>
        <LabelWrapper.Root>
          <Radio id="push" value="push" />
          <LabelWrapper.Label for="push">Push</LabelWrapper.Label>
        </LabelWrapper.Root>
      </>
    );
    const host = mount(() => (
      <form>
        <RadioGroup name="channel" defaultValue="email" onValueChange={onValueChange}>
          <Options />
        </RadioGroup>
      </form>
    ));
    const form = host.querySelector("form")!;
    const email = form.querySelector<HTMLInputElement>("[value=email]")!;
    const push = form.querySelector<HTMLInputElement>("[value=push]")!;
    expect(email.name).toBe("channel");
    expect(push.name).toBe("channel");
    expect(email.checked).toBe(true);

    push.labels!.item(0)!.click();
    expect(push.checked).toBe(true);
    expect(email.checked).toBe(false);
    expect(onValueChange).toHaveBeenCalledWith("push");
    expect(new FormData(form).get("channel")).toBe("push");
    form.reset();
    expect(email.checked).toBe(true);
    expect(push.checked).toBe(false);
    expect(new FormData(form).get("channel")).toBe("email");
  });
});
