import { createSignal, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox, Meter, Progress, Radio, Range, Select } from "~";

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

describe("native atomic controls", () => {
  it("uses native checkbox toggling, radio exclusivity and successful form controls", () => {
    const [disabled, setDisabled] = createSignal(false);
    const onChange = vi.fn();
    let checkboxRef: HTMLInputElement | undefined;
    const host = mount(() => (
      <form>
        <Checkbox
          ref={checkboxRef}
          name="alerts"
          value="email"
          color="success"
          class="custom-checkbox"
          classList={{ emphasized: true }}
          disabled={disabled()}
          onChange={onChange}
        />
        <Checkbox name="ignored" value="disabled" checked disabled />
        <Radio name="plan" value="basic" checked />
        <Radio name="plan" value="pro" />
      </form>
    ));
    const form = host.querySelector("form")!;
    const checkbox = form.querySelector<HTMLInputElement>("[name=alerts]")!;
    const basic = form.querySelector<HTMLInputElement>("[value=basic]")!;
    const pro = form.querySelector<HTMLInputElement>("[value=pro]")!;

    expect(checkboxRef).toBe(checkbox);
    expect([...form.children].every((element) => element.tagName === "INPUT")).toBe(true);
    expect(checkbox.type).toBe("checkbox");
    expect(pro.type).toBe("radio");
    expect(checkbox.classList.contains("ui-checkbox")).toBe(true);
    expect(checkbox.classList.contains("custom-checkbox")).toBe(true);
    expect(checkbox.classList.contains("emphasized")).toBe(true);
    expect(checkbox.dataset.color).toBe("success");
    expect(new FormData(form).has("alerts")).toBe(false);

    checkbox.click();
    pro.click();
    expect(checkbox.checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(basic.checked).toBe(false);
    expect(pro.checked).toBe(true);
    expect([...new FormData(form).entries()]).toEqual([
      ["alerts", "email"],
      ["plan", "pro"],
    ]);

    setDisabled(true);
    checkbox.click();
    expect(checkbox.checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(new FormData(form).has("alerts")).toBe(false);
  });

  it("keeps range values and events native while forwarding the caller's position style", () => {
    const [value, setValue] = createSignal(10);
    const onInput = vi.fn<JSX.EventHandler<HTMLInputElement, InputEvent>>((event) =>
      setValue(event.currentTarget.valueAsNumber),
    );
    let rangeRef: HTMLInputElement | undefined;
    const host = mount(() => (
      <form>
        <Range
          ref={rangeRef}
          name="volume"
          min="0"
          max="20"
          step="0.5"
          value={value()}
          class="custom-range"
          classList={{ emphasized: true }}
          color="warning"
          style={{ "--ui-slider-position": `${value() * 5}%`, width: "12rem" }}
          onInput={onInput}
        />
      </form>
    ));
    const form = host.querySelector("form")!;
    const range = form.querySelector("input")!;

    expect(rangeRef).toBe(range);
    expect(form.children.length).toBe(1);
    expect(range.type).toBe("range");
    expect(range.classList.contains("ui-slider")).toBe(true);
    expect(range.classList.contains("custom-range")).toBe(true);
    expect(range.classList.contains("emphasized")).toBe(true);
    expect(range.dataset.color).toBe("warning");
    expect(range.min).toBe("0");
    expect(range.max).toBe("20");
    expect(range.step).toBe("0.5");
    expect(range.style.getPropertyValue("--ui-slider-position")).toBe("50%");

    setValue(0);
    expect(range.value).toBe("0");
    expect(range.style.getPropertyValue("--ui-slider-position")).toBe("0%");
    range.value = "12.5";
    range.dispatchEvent(new InputEvent("input", { bubbles: true }));
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(value()).toBe(12.5);
    expect(range.style.getPropertyValue("--ui-slider-position")).toBe("62.5%");
    expect(range.style.width).toBe("12rem");
    expect(new FormData(form).get("volume")).toBe("12.5");
  });

  it("renders one select whose options and groups are supplied through native children", () => {
    const onChange = vi.fn();
    let selectRef: HTMLSelectElement | undefined;
    const host = mount(() => (
      <form>
        <Select
          ref={selectRef}
          name="team"
          class="custom-select"
          classList={{ emphasized: true }}
          variant="filled"
          color="primary"
          radius="rounded"
          width="block"
          aria-label="团队"
          onChange={onChange}
        >
          <optgroup label="产品团队">
            <option value="design">设计</option>
            <option value="engineering" selected>
              研发
            </option>
          </optgroup>
          <option value="unavailable" disabled>
            暂未开放
          </option>
        </Select>
      </form>
    ));
    const form = host.querySelector("form")!;
    const select = form.querySelector("select")!;

    expect(selectRef).toBe(select);
    expect(form.children.length).toBe(1);
    expect(form.firstElementChild).toBe(select);
    expect(select.children.length).toBe(2);
    expect(select.firstElementChild?.tagName).toBe("OPTGROUP");
    expect(select.options.length).toBe(3);
    expect(select.options[2]!.disabled).toBe(true);
    expect(select.classList.contains("ui-input")).toBe(true);
    expect(select.classList.contains("custom-select")).toBe(true);
    expect(select.classList.contains("emphasized")).toBe(true);
    expect(select.dataset).toMatchObject({
      variant: "filled",
      color: "primary",
      radius: "rounded",
      width: "block",
    });
    expect(select.hasAttribute("radius")).toBe(false);
    expect(select.hasAttribute("width")).toBe(false);
    expect(select.getAttribute("aria-label")).toBe("团队");
    expect(select.hasAttribute("aria-expanded")).toBe(false);
    expect(new FormData(form).get("team")).toBe("engineering");

    select.value = "design";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(new FormData(form).get("team")).toBe("design");
  });

  it("sets controlled select values after native option children exist", () => {
    const [value, setValue] = createSignal("b");
    const host = mount(() => (
      <Select value={value()}>
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>
    ));
    const select = host.querySelector("select")!;
    expect(select.value).toBe("b");
    setValue("a");
    expect(select.value).toBe("a");
  });

  it("retains reactive option selection, native multiple values and disabled form behavior", () => {
    const [multiple, setMultiple] = createSignal(true);
    const [selected, setSelected] = createSignal(["a", "c"]);
    const [disabled, setDisabled] = createSignal(false);
    const host = mount(() => (
      <form>
        <Select name="skills" multiple={multiple()} size={3} disabled={disabled()}>
          <option value="a" selected={selected().includes("a")}>
            A
          </option>
          <option value="b" selected={selected().includes("b")}>
            B
          </option>
          <option value="c" selected={selected().includes("c")}>
            C
          </option>
        </Select>
      </form>
    ));
    const form = host.querySelector("form")!;
    const select = form.querySelector("select")!;
    expect(select.multiple).toBe(true);
    expect(select.size).toBe(3);
    expect(new FormData(form).getAll("skills")).toEqual(["a", "c"]);
    setSelected(["b"]);
    expect(new FormData(form).getAll("skills")).toEqual(["b"]);
    setMultiple(false);
    expect(select.multiple).toBe(false);
    expect(select.value).toBe("b");
    setDisabled(true);
    expect(new FormData(form).has("skills")).toBe(false);
  });

  it("preserves explicit ARIA invalid states while applying error and warning status", () => {
    const [status, setStatus] = createSignal<"error" | "warning" | undefined>("warning");
    const [invalid, setInvalid] =
      createSignal<JSX.SelectHTMLAttributes<HTMLSelectElement>["aria-invalid"]>("grammar");
    const host = mount(() => (
      <Select status={status()} aria-invalid={invalid()}>
        <option>A</option>
      </Select>
    ));
    const select = host.querySelector("select")!;
    expect(select.getAttribute("aria-invalid")).toBe("grammar");
    expect(select.hasAttribute("data-warning")).toBe(true);
    setInvalid("false");
    setStatus("error");
    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(select.hasAttribute("data-warning")).toBe(false);
    setStatus(undefined);
    setInvalid("spelling");
    expect(select.getAttribute("aria-invalid")).toBe("spelling");
  });

  it("allows progress to enter and leave its native indeterminate state", () => {
    const [value, setValue] = createSignal<number | undefined>(undefined);
    const [max, setMax] = createSignal<number | undefined>(100);
    const host = mount(() => (
      <Progress max={max()} value={value()} color="success" aria-label="上传进度">
        上传中
      </Progress>
    ));
    const progress = host.querySelector("progress")!;
    expect(host.children.length).toBe(1);
    expect(progress.classList.contains("ui-progress")).toBe(true);
    expect(progress.dataset.color).toBe("success");
    expect(progress.textContent).toBe("上传中");
    expect(progress.hasAttribute("value")).toBe(false);
    expect(progress.position).toBe(-1);
    setValue(0);
    expect(progress.position).toBe(0);
    setValue(30);
    expect(progress.position).toBe(0.3);
    setMax(undefined);
    expect(progress.max).toBe(1);
    expect(progress.position).toBe(1);
    setValue(undefined);
    expect(progress.hasAttribute("value")).toBe(false);
    expect(progress.position).toBe(-1);
  });

  it("forwards meter thresholds and fallback content without adding a wrapper", () => {
    const [value, setValue] = createSignal<number | undefined>(18);
    const [high, setHigh] = createSignal<number | undefined>(25);
    let meterRef: HTMLMeterElement | undefined;
    const host = mount(() => (
      <Meter
        ref={meterRef}
        min={10}
        max={30}
        low={15}
        high={high()}
        optimum={20}
        value={value()}
        color="warning"
        class="custom-meter"
        classList={{ emphasized: true }}
        aria-label="容量"
      >
        当前容量
      </Meter>
    ));
    const meter = host.querySelector("meter")!;
    expect(meterRef).toBe(meter);
    expect(host.children.length).toBe(1);
    expect(meter.classList.contains("ui-meter")).toBe(true);
    expect(meter.classList.contains("custom-meter")).toBe(true);
    expect(meter.classList.contains("emphasized")).toBe(true);
    expect(meter.dataset.color).toBe("warning");
    expect([meter.min, meter.max, meter.low, meter.high, meter.optimum, meter.value]).toEqual([
      10, 30, 15, 25, 20, 18,
    ]);
    expect(meter.textContent).toBe("当前容量");
    setValue(29);
    expect(meter.value).toBe(29);
    setHigh(undefined);
    expect(meter.high).toBe(30);
    setValue(undefined);
    expect(meter.value).toBe(10);
  });
});
