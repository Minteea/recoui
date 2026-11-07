import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Collapse } from "~";

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  dispose = undefined;
  document.body.replaceChildren();
});

describe("Collapse", () => {
  it("renders one div and forwards native attributes, refs, classes and events", () => {
    let reference: HTMLDivElement | undefined;
    const onClick = vi.fn();
    dispose = render(
      () => (
        <Collapse
          ref={reference}
          id="details"
          class="custom"
          classList={{ active: true }}
          aria-label="详情"
          style={{ padding: "1rem" }}
          onClick={onClick}
        >
          <input value="保留的内容" />
        </Collapse>
      ),
      document.body,
    );
    const element = document.body.firstElementChild as HTMLDivElement;

    expect(reference).toBe(element);
    expect(document.body.querySelectorAll("div")).toHaveLength(1);
    expect(element.classList.contains("ui-collapse")).toBe(true);
    expect(element.classList.contains("custom")).toBe(true);
    expect(element.classList.contains("active")).toBe(true);
    expect(element.id).toBe("details");
    expect(element.getAttribute("aria-label")).toBe("详情");
    expect(element.style.padding).toBe("1rem");
    expect(element.hasAttribute("data-expanded")).toBe(false);
    expect(element.getAttribute("aria-hidden")).toBe("true");
    expect(element.inert).toBe(true);
    expect(element.firstElementChild?.tagName).toBe("INPUT");
    element.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("reactively synchronizes all state attributes while retaining child state", () => {
    const [expanded, setExpanded] = createSignal<boolean | undefined>(undefined);
    dispose = render(
      () => (
        <Collapse expanded={expanded()}>
          <input />
        </Collapse>
      ),
      document.body,
    );
    const element = document.body.firstElementChild as HTMLDivElement;
    const input = element.querySelector("input")!;
    input.value = "保留的内容";

    for (const value of [true, false, true, undefined]) {
      setExpanded(value);
      expect(element.hasAttribute("data-expanded")).toBe(!!value);
      expect(element.getAttribute("aria-hidden")).toBe(String(!value));
      expect(element.inert).toBe(!value);
      expect(element.hasAttribute("expanded")).toBe(false);
      expect(element.querySelector("input")).toBe(input);
      expect(input.value).toBe("保留的内容");
    }
  });
});
