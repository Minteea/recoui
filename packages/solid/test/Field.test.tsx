import { createSignal, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox, Field, Input } from "~";

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

describe("Field", () => {
  it("reactively changes orientation while preserving controls, focus and submitted values", () => {
    const [horizontal, setHorizontal] = createSignal(false);
    const initialized = vi.fn();
    let inputRef: HTMLInputElement | undefined;
    const StatefulInput = () => {
      initialized();
      return <Input ref={inputRef} id="name" name="name" aria-describedby="name-description" />;
    };
    const host = mount(() => (
      <form>
        <Field
          horizontal={horizontal()}
          label="Name"
          description="Your display name"
          labelProps={{ for: "name" }}
          descriptionProps={{ id: "name-description" }}
        >
          <StatefulInput />
        </Field>
        <Field
          horizontal={horizontal()}
          label="Updates"
          description="Receive updates"
          labelProps={{ for: "updates" }}
          descriptionProps={{ id: "updates-description" }}
        >
          <Checkbox
            id="updates"
            name="updates"
            value="yes"
            aria-describedby="updates-description"
          />
        </Field>
      </form>
    ));
    const form = host.querySelector("form")!;
    const root = form.children[0] as HTMLDivElement;
    const checkboxRoot = form.children[1] as HTMLDivElement;
    const input = root.querySelector("input")!;
    const checkbox = checkboxRoot.querySelector("input")!;
    const inputContainer = input.parentElement!;
    input.value = "Edited name";
    checkbox.click();
    input.focus();

    expect([...root.children].map((element) => element.tagName)).toEqual(["LABEL", "DIV", "P"]);
    expect(root.querySelector(".ui-field-content")).toBeNull();

    for (const orientation of [true, false, true, false]) {
      expect(document.activeElement).toBe(input);
      setHorizontal(orientation);
      expect(root.dataset.orientation).toBe(orientation ? "horizontal" : undefined);
      expect(root.querySelector("input")).toBe(input);
      expect(inputRef).toBe(input);
      expect(input.value).toBe("Edited name");
      expect(document.activeElement).toBe(input);
      expect(checkboxRoot.querySelector("input")).toBe(checkbox);
      expect(checkbox.checked).toBe(true);
      expect(initialized).toHaveBeenCalledTimes(1);
      expect(input.labels!.item(0)!.htmlFor).toBe("name");
      expect(input.getAttribute("aria-describedby")).toBe("name-description");
      expect(root.querySelector("#name-description")!.textContent).toBe("Your display name");
      expect([...new FormData(form).entries()]).toEqual([
        ["name", "Edited name"],
        ["updates", "yes"],
      ]);

      if (orientation) {
        expect(root.firstElementChild).toBe(inputContainer);
        const content = root.lastElementChild!;
        expect(content.classList.contains("ui-field-content")).toBe(true);
        expect([...content.children].map((element) => element.tagName)).toEqual(["LABEL", "P"]);
        checkbox.labels!.item(0)!.click();
        expect(checkbox.checked).toBe(false);
        checkbox.labels!.item(0)!.click();
        input.focus();
      } else {
        expect([...root.children].map((element) => element.tagName)).toEqual(["LABEL", "DIV", "P"]);
        expect(root.querySelector(".ui-field-content")).toBeNull();
      }
    }
  });

  it("updates JSX content and uppercase props without leaking them onto the root", () => {
    const [label, setLabel] = createSignal<JSX.Element>(undefined);
    const [description, setDescription] = createSignal<JSX.Element>(undefined);
    const [horizontal, setHorizontal] = createSignal(true);
    const [richLabel, setRichLabel] = createSignal(false);
    const [labelText, setLabelText] = createSignal("Rich label");
    const host = mount(() => (
      <Field
        horizontal={horizontal()}
        label="Legacy label"
        description="Legacy description"
        Label={richLabel() ? <strong>{labelText()}</strong> : label()}
        Description={description()}
      >
        <Checkbox aria-label="Updates" />
      </Field>
    ));
    const root = host.firstElementChild!;
    const readLabel = () => root.querySelector(".ui-field-label")?.textContent;
    const readDescription = () => root.querySelector(".ui-field-description")?.textContent;
    expect(readLabel()).toBe("Legacy label");
    expect(readDescription()).toBe("Legacy description");

    setRichLabel(true);
    setDescription(
      <span>
        Read <a href="#help">help</a>
      </span>,
    );
    expect(root.querySelector(".ui-field-label strong")!.textContent).toBe("Rich label");
    const labelElement = root.querySelector(".ui-field-label strong")!;
    expect(root.querySelector(".ui-field-description a")!.getAttribute("href")).toBe("#help");
    setHorizontal(false);
    expect(root.querySelector(":scope > .ui-field-label strong")!.textContent).toBe("Rich label");
    expect(root.querySelector(":scope > .ui-field-description a")!.textContent).toBe("help");
    expect(root.querySelector(".ui-field-label strong")).toBe(labelElement);
    setLabelText("Updated rich label");
    expect(labelElement.textContent).toBe("Updated rich label");
    setHorizontal(true);
    setLabelText("Updated again");
    expect(root.querySelector(".ui-field-label strong")).toBe(labelElement);
    expect(labelElement.textContent).toBe("Updated again");

    setRichLabel(false);
    setLabel(0);
    setDescription(0);
    expect(readLabel()).toBe("0");
    expect(readDescription()).toBe("0");
    setLabel(null);
    setDescription(false);
    expect(root.querySelector(".ui-field-label")).toBeNull();
    expect(root.querySelector(".ui-field-description")).toBeNull();
    setLabel(undefined);
    setDescription(undefined);
    expect(readLabel()).toBe("Legacy label");
    expect(readDescription()).toBe("Legacy description");
    expect(root.hasAttribute("horizontal")).toBe(false);
    expect(root.hasAttribute("label")).toBe(false);
    expect(root.hasAttribute("description")).toBe(false);
  });

  it("supports reactive atomic orientation and native content attributes", () => {
    const [orientation, setOrientation] = createSignal<"horizontal" | "vertical">("horizontal");
    const onClick = vi.fn();
    let contentRef: HTMLDivElement | undefined;
    const host = mount(() => (
      <Field.Root orientation={orientation()}>
        <Checkbox id="atomic-updates" />
        <Field.Content
          ref={contentRef}
          class="custom-content"
          classList={{ active: true }}
          onClick={onClick}
        >
          <Field.Label for="atomic-updates">Updates</Field.Label>
          <Field.Description>Receive product updates</Field.Description>
        </Field.Content>
      </Field.Root>
    ));
    const root = host.firstElementChild as HTMLDivElement;
    const content = root.lastElementChild as HTMLDivElement;
    expect(contentRef).toBe(content);
    expect(content.classList.contains("ui-field-content")).toBe(true);
    expect(content.classList.contains("custom-content")).toBe(true);
    expect(content.classList.contains("active")).toBe(true);
    expect(root.dataset.orientation).toBe("horizontal");
    expect(root.hasAttribute("orientation")).toBe(false);
    content.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    setOrientation("vertical");
    expect(root.dataset.orientation).toBe("vertical");
    expect(root.lastElementChild).toBe(content);
  });
});
