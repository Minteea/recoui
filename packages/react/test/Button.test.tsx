import { act, createRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "~";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe("Button", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("forwards native attributes, custom classes and ref alongside appearance attributes", () => {
    const ref = createRef<HTMLButtonElement>();
    act(() =>
      root.render(
        <Button
          ref={ref}
          className="custom-button"
          variant="filled"
          color="success"
          data-radius="rounded"
          data-width="icon"
          type="submit"
          name="action"
          value="save"
          aria-label="Save changes"
        >
          Save
        </Button>,
      ),
    );

    const button = container.querySelector("button")!;
    expect(ref.current).toBe(button);
    expect(button.classList.contains("ui-button")).toBe(true);
    expect(button.classList.contains("custom-button")).toBe(true);
    expect(button.dataset).toMatchObject({
      variant: "filled",
      color: "success",
      radius: "rounded",
      width: "icon",
    });
    expect(button.type).toBe("submit");
    expect(button.name).toBe("action");
    expect(button.value).toBe("save");
    expect(button.getAttribute("aria-label")).toBe("Save changes");
    expect(button.textContent).toBe("Save");
  });

  it("forwards click events and respects disabled after updating props", () => {
    const onClick = vi.fn();
    act(() => root.render(<Button onClick={onClick}>Save</Button>));
    act(() => container.querySelector("button")!.click());
    expect(onClick).toHaveBeenCalledTimes(1);

    act(() =>
      root.render(
        <Button disabled variant="ghost" onClick={onClick}>
          Saved
        </Button>,
      ),
    );
    const button = container.querySelector("button")!;
    act(() => button.click());
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button.disabled).toBe(true);
    expect(button.dataset.variant).toBe("ghost");
    expect(button.textContent).toBe("Saved");
  });
});
