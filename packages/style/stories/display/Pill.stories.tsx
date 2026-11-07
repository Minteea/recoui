import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { IconCheck, IconChevronDown, IconPlus, IconTags, IconX } from "@tabler/icons-solidjs";
import { createEffect, createMemo, createSignal, createUniqueId, For, on, Show } from "solid-js";
import {
  dismissOnOutside,
  DropdownLayer,
  dropdownPosition,
  type DropdownExampleOptions,
} from "../shared/dropdown";
import styles from "../shared/preview.module.css";

interface PillArgs extends DropdownExampleOptions {
  variant: "default" | "light" | "filled" | "outline";
  inputVariant: "default" | "filled" | "unstyled";
  color?: string;
  "data-radius"?: string;
  disabled: boolean;
  initialValues: string[];
  width: string;
}

type Mode = "tags" | "multi" | "combo";
const keyOf = (value: string) => value.trim().toLocaleLowerCase();
const choices: { value: string; group: string; disabled?: boolean }[] = [
  { value: "SolidJS", group: "框架" },
  { value: "Vue", group: "框架" },
  { value: "React", group: "框架" },
  { value: "Angular", group: "框架", disabled: true },
  { value: "TypeScript", group: "工具" },
  { value: "Sass", group: "工具" },
  { value: "Storybook", group: "工具" },
];
interface Row {
  key: string;
  value: string;
  label: string;
  group: string;
  disabled?: boolean;
  create?: boolean;
}

function ValueInputExample(props: PillArgs & { mode: Mode }) {
  const id = createUniqueId();
  const [values, setValues] = createSignal<string[]>([]);
  const [query, setQuery] = createSignal("");
  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal<string>();
  const [message, setMessage] = createSignal("");
  let container!: HTMLDivElement;
  let input!: HTMLInputElement;
  let popup!: HTMLDivElement;
  let composing = false;
  const editable = () => props.mode !== "multi";
  const hasDropdown = () => props.mode !== "tags";
  const title = () =>
    props.mode === "tags"
      ? "TagsInput"
      : props.mode === "multi"
      ? "MultiSelect"
      : "多选 Autocomplete Combobox";
  const close = () => setOpen(false);
  const focusControl = () => {
    if (!props.disabled) (editable() ? input : container)?.focus();
  };
  const initial = () => {
    const seen = new Set<string>();
    return props.initialValues.flatMap((raw) => {
      const value = raw.trim();
      const key = keyOf(value);
      if (!key || seen.has(key)) return [];
      const known = choices.find((choice) => keyOf(choice.value) === key);
      if (props.mode === "multi" && (!known || known.disabled)) return [];
      if (props.mode === "combo" && known?.disabled) return [];
      seen.add(key);
      return [props.mode === "tags" ? value : known?.value ?? value];
    });
  };
  createEffect(
    on(
      () => props.initialValues,
      () => {
        setValues(initial());
        setQuery("");
        close();
      },
    ),
  );
  createEffect(on(() => props.implementation, close, { defer: true }));
  createEffect(() => {
    if (props.disabled) close();
  });

  const rows = createMemo<Row[]>(() => {
    if (!hasDropdown()) return [];
    const term = keyOf(query());
    const selected = new Set(values().map(keyOf));
    const result: Row[] = choices
      .filter(
        (choice) =>
          props.mode === "multi" ||
          (!selected.has(keyOf(choice.value)) && keyOf(choice.value).includes(term)),
      )
      .map((choice) => ({ ...choice, key: `option:${choice.value}`, label: choice.value }));
    if (
      props.mode === "combo" &&
      term &&
      !selected.has(term) &&
      !choices.some((choice) => keyOf(choice.value) === term)
    ) {
      result.push({
        key: "create",
        value: query().trim(),
        label: `添加“${query().trim()}”`,
        group: "新值",
        create: true,
      });
    }
    return result;
  });
  const enabled = () => rows().filter((row) => !row.disabled);
  const activeRow = () => enabled().find((row) => row.key === active());
  const activeId = () => {
    const index = rows().findIndex((row) => row.key === active());
    return open() && index >= 0 ? `${id}-option-${index}` : undefined;
  };
  const popupStyle = dropdownPosition(
    props,
    open,
    () => container,
    () => popup,
    true,
  );
  dismissOnOutside(() => [container, popup], open, close);
  createEffect(() => {
    const available = enabled();
    if (open() && !available.some((row) => row.key === active())) setActive(available[0]?.key);
  });
  createEffect(() => {
    const optionId = activeId();
    if (optionId)
      queueMicrotask(() => document.getElementById(optionId)?.scrollIntoView({ block: "nearest" }));
  });

  const add = (entries: string[], restoreFocus = true) => {
    if (props.disabled) return;
    const next = [...values()];
    const seen = new Set(next.map(keyOf));
    const added: string[] = [];
    let unavailable = false;
    for (const raw of entries) {
      const value = raw.trim();
      const key = keyOf(value);
      if (!key || seen.has(key)) continue;
      const known = choices.find((choice) => keyOf(choice.value) === key);
      if (props.mode !== "tags" && (known?.disabled || (props.mode === "multi" && !known))) {
        unavailable = true;
        continue;
      }
      const normalized = props.mode === "tags" ? value : known?.value ?? value;
      next.push(normalized);
      added.push(normalized);
      seen.add(key);
    }
    if (added.length) setValues(next);
    if (!unavailable || added.length) setQuery("");
    setMessage(
      added.length
        ? `已添加：${added.join("、")}`
        : unavailable
        ? "该选项不可用"
        : "值已存在或为空",
    );
    if (restoreFocus) focusControl();
  };
  const remove = (value: string) => {
    if (props.disabled) return;
    focusControl();
    setValues(values().filter((item) => item !== value));
    setMessage(`已移除：${value}`);
  };
  const choose = (row: Row) => {
    if (props.disabled || row.disabled) return;
    if (props.mode === "multi" && values().includes(row.value)) remove(row.value);
    else add([row.value]);
  };
  const expand = () => {
    if (props.disabled || !hasDropdown()) return;
    setOpen(true);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (props.disabled || composing || event.isComposing || event.keyCode === 229) return;
    const key = event.key;
    if (key === "Escape") {
      if (open()) {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
      return;
    }
    if (key === "Tab") {
      if (props.mode === "tags" && query().trim()) add([query()], false);
      close();
      return;
    }
    if (key === "Backspace" && !query() && values().length) {
      event.preventDefault();
      remove(values().at(-1)!);
      return;
    }
    if (
      hasDropdown() &&
      (key === "ArrowDown" ||
        key === "ArrowUp" ||
        (props.mode === "multi" && (key === "Home" || key === "End")))
    ) {
      event.preventDefault();
      const available = enabled();
      if (!open()) {
        expand();
        setActive(key === "End" || key === "ArrowUp" ? available.at(-1)?.key : available[0]?.key);
        return;
      }
      const index = available.findIndex((row) => row.key === active());
      setActive(
        key === "Home"
          ? available[0]?.key
          : key === "End"
          ? available.at(-1)?.key
          : available[
              (index + (key === "ArrowDown" ? 1 : -1) + available.length) % available.length
            ]?.key,
      );
      return;
    }
    if (props.mode === "multi" && (key === "Enter" || key === " ")) {
      event.preventDefault();
      if (!open()) expand();
      else if (activeRow()) choose(activeRow()!);
      return;
    }
    if (editable() && (key === "Enter" || key === "," || key === "，")) {
      if (props.mode === "combo" && key === "Enter" && open() && activeRow()) {
        event.preventDefault();
        choose(activeRow()!);
      } else if (query().trim() || key !== "Enter") {
        event.preventDefault();
        add([query()]);
      }
    }
  };

  return (
    <form
      class="ui-field"
      data-example={props.mode}
      style={{ "inline-size": "100%", "max-inline-size": props.width, gap: "0.75rem" }}
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(
          `表单值：${JSON.stringify(new FormData(event.currentTarget).getAll(props.mode))}`,
        );
      }}
      onReset={() => {
        setValues(initial());
        setQuery("");
        close();
        setMessage("已恢复初始值");
      }}
    >
      <label
        class="ui-field-label"
        id={`${id}-label`}
        for={editable() ? `${id}-input` : undefined}
        onClick={() => {
          if (!editable()) focusControl();
        }}
      >
        {title()}
      </label>
      <div
        class={
          hasDropdown() && props.implementation === "wrapper" ? "ui-dropdown-wrapper" : undefined
        }
        data-side={props.side}
        style={{ "inline-size": "100%" }}
      >
        <div
          ref={container}
          class="ui-input"
          data-variant={props.inputVariant}
          data-color={props.color}
          role={editable() ? undefined : "combobox"}
          tabIndex={editable() ? undefined : props.disabled ? -1 : 0}
          aria-disabled={props.disabled}
          aria-labelledby={editable() ? undefined : `${id}-label`}
          aria-describedby={editable() ? undefined : `${id}-description`}
          aria-haspopup={editable() ? undefined : "listbox"}
          aria-expanded={editable() ? undefined : open()}
          aria-controls={editable() ? undefined : `${id}-listbox`}
          aria-activedescendant={editable() ? undefined : activeId()}
          onClick={(event) => {
            if (props.disabled || (event.target as HTMLElement).closest("button")) return;
            focusControl();
            if (props.mode === "multi") setOpen(!open());
            else if (hasDropdown()) expand();
          }}
          onKeyDown={(event) => {
            if (!editable() && event.target === container) onKeyDown(event);
          }}
        >
          <Show when={props.mode === "tags"}>
            <span class="ui-addon" aria-hidden="true">
              <IconTags size={16} />
            </span>
          </Show>
          <For each={values()}>
            {(value) => (
              <span
                class="ui-pill"
                data-variant={props.variant}
                data-color={props.color}
                data-radius={props["data-radius"]}
                aria-disabled={props.disabled}
              >
                <span>{value}</span>
                <button
                  class="ui-pill-button"
                  type="button"
                  disabled={props.disabled}
                  aria-label={`移除 ${value}`}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={(event) => {
                    event.stopPropagation();
                    remove(value);
                  }}
                >
                  <IconX size={12} aria-hidden="true" />
                </button>
              </span>
            )}
          </For>
          <Show when={!editable() && !values().length}>
            <span style={{ flex: "1", color: "var(--color-disabled)" }}>请选择</span>
          </Show>
          <Show when={editable()}>
            <input
              ref={input}
              id={`${id}-input`}
              value={query()}
              disabled={props.disabled}
              autocomplete="off"
              placeholder={props.mode === "tags" ? "输入后按 Enter 添加" : "搜索或输入新值"}
              aria-labelledby={`${id}-label`}
              aria-describedby={`${id}-description`}
              role={hasDropdown() ? "combobox" : undefined}
              aria-autocomplete={hasDropdown() ? "list" : undefined}
              aria-haspopup={hasDropdown() ? "listbox" : undefined}
              aria-expanded={hasDropdown() ? open() : undefined}
              aria-controls={hasDropdown() ? `${id}-listbox` : undefined}
              aria-activedescendant={hasDropdown() ? activeId() : undefined}
              onCompositionStart={() => {
                composing = true;
              }}
              onCompositionEnd={() => {
                composing = false;
              }}
              onInput={(event) => {
                setQuery(event.currentTarget.value);
                setActive(undefined);
                if (hasDropdown()) expand();
              }}
              onFocus={() => {
                if (hasDropdown()) expand();
              }}
              onKeyDown={onKeyDown}
              onPaste={(event) => {
                if (props.disabled || composing) return;
                const text = event.clipboardData?.getData("text") ?? "";
                if (!/[,，\r\n]/.test(text)) return;
                event.preventDefault();
                const input = event.currentTarget;
                const combined =
                  input.value.slice(0, input.selectionStart ?? input.value.length) +
                  text +
                  input.value.slice(input.selectionEnd ?? input.value.length);
                add(combined.split(/[,，\r\n]+/));
              }}
            />
          </Show>
          <span class="ui-addon">
            <button
              class="ui-addon-button"
              type="button"
              data-width="icon"
              aria-label="清除全部值"
              disabled={props.disabled || (!values().length && !query())}
              onPointerDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.stopPropagation();
                if (props.disabled) return;
                focusControl();
                setValues([]);
                setQuery("");
                setMessage("已清除全部值");
              }}
            >
              <IconX size={14} aria-hidden="true" />
            </button>
            <Show when={hasDropdown()}>
              <button
                class="ui-addon-button"
                type="button"
                data-width="icon"
                aria-label="切换选项列表"
                aria-haspopup="listbox"
                aria-expanded={open()}
                aria-controls={`${id}-listbox`}
                disabled={props.disabled}
                tabIndex={-1}
                onPointerDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.stopPropagation();
                  const previous = open();
                  focusControl();
                  setOpen(!previous);
                }}
              >
                <IconChevronDown size={14} aria-hidden="true" />
              </button>
            </Show>
          </span>
        </div>
        <Show when={hasDropdown()}>
          <DropdownLayer portal={props.implementation === "portal"}>
            <div
              ref={popup}
              class="ui-dropdown"
              role="listbox"
              id={`${id}-listbox`}
              dir={props.direction}
              aria-labelledby={`${id}-label`}
              aria-multiselectable="true"
              hidden={!open()}
              style={popupStyle()}
            >
              <For each={["框架", "工具", "新值"]}>
                {(group) => (
                  <Show when={rows().some((row) => row.group === group)}>
                    <div class="ui-optgroup" role="group" aria-labelledby={`${id}-group-${group}`}>
                      <div class="ui-optgroup-legend" id={`${id}-group-${group}`}>
                        {group}
                      </div>
                      <For each={rows().filter((row) => row.group === group)}>
                        {(row) => (
                          <div
                            class="ui-option"
                            id={`${id}-option-${rows().findIndex((item) => item.key === row.key)}`}
                            role="option"
                            aria-selected={values().includes(row.value)}
                            aria-disabled={row.disabled}
                            data-highlighted={active() === row.key}
                            onPointerDown={(event) => event.preventDefault()}
                            onPointerMove={() => {
                              if (!row.disabled) setActive(row.key);
                            }}
                            onClick={() => choose(row)}
                          >
                            <Show when={row.create}>
                              <IconPlus size={16} aria-hidden="true" />
                            </Show>
                            <span style={{ flex: "1", "min-inline-size": "0" }}>{row.label}</span>
                            <Show when={values().includes(row.value)}>
                              <IconCheck size={16} aria-hidden="true" />
                            </Show>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>
                )}
              </For>
              <Show when={!rows().length}>
                <p style={{ margin: "0", padding: "0.5rem", color: "var(--color-disabled)" }}>
                  没有可添加的选项
                </p>
              </Show>
            </div>
          </DropdownLayer>
        </Show>
      </div>
      <For each={values()}>
        {(value) => (
          <input type="hidden" name={props.mode} value={value} disabled={props.disabled} />
        )}
      </For>
      <p class="ui-field-description" id={`${id}-description`}>
        {props.mode === "tags"
          ? "Enter、逗号或粘贴分隔文字添加，自动去重；空输入时 Backspace 删除末项。"
          : props.mode === "multi"
          ? "可反复勾选，无文字输入；方向键移动，空格切换选择，Esc 关闭。"
          : "输入文字筛选建议，也可添加新值；支持多选、去重、关闭按钮和 Backspace。"}
      </p>
      <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem" }}>
        <button class="ui-button" type="submit">
          读取表单值
        </button>
        <button class="ui-button" type="reset" disabled={props.disabled}>
          重置
        </button>
      </div>
      <p role="status" style={{ margin: "0", "font-size": "0.75rem", "overflow-wrap": "anywhere" }}>
        {message()}
      </p>
    </form>
  );
}

function PillExamples(props: PillArgs) {
  const [showActionPill, setShowActionPill] = createSignal(true);
  return (
    <div class={styles.preview} dir={props.direction}>
      <div class={styles.group}>
        <span class={styles.markup}>Badge 与 Pill 共用外观；Pill 表示输入值</span>
        <div
          style={{ display: "flex", "flex-wrap": "wrap", gap: "0.75rem", "align-items": "center" }}
        >
          <span
            class="ui-badge"
            data-variant={props.variant}
            data-color={props.color}
            data-radius={props["data-radius"]}
          >
            Badge
          </span>
          <span
            class="ui-pill"
            data-variant={props.variant}
            data-color={props.color}
            data-radius={props["data-radius"]}
          >
            Pill
          </span>
          <Show
            when={showActionPill()}
            fallback={
              <button
                class="ui-addon-button"
                type="button"
                onClick={() => setShowActionPill(true)}
                disabled={props.disabled}
              >
                恢复示例标签
              </button>
            }
          >
            <span
              class="ui-pill"
              data-variant={props.variant}
              data-color={props.color}
              data-radius={props["data-radius"]}
              aria-disabled={props.disabled}
            >
              <span>带操作按钮</span>
              <button
                class="ui-pill-button"
                type="button"
                aria-label="移除示例标签"
                disabled={props.disabled}
                onClick={() => setShowActionPill(false)}
              >
                <IconX size={12} aria-hidden="true" />
              </button>
            </span>
          </Show>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Styles/Display/Pill",
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: "select", options: ["default", "light", "filled", "outline"] },
    inputVariant: { control: "select", options: ["default", "filled", "unstyled"] },
    color: { control: "text" },
    "data-radius": {
      control: "text",
      description: "与 Badge 一致：default / 空值使用默认圆角，rounded 全圆角，其他值为 CSS 尺寸",
    },
    implementation: { control: "select", options: ["wrapper", "portal"] },
    side: { control: "select", options: ["bottom", "top"] },
    direction: { control: "select", options: ["ltr", "rtl"] },
    disabled: { control: "boolean" },
    initialValues: { control: "object" },
    width: { control: "text", description: "输入容器最大宽度，缩小后观察 Pill 换行" },
    maxHeight: { control: "text", description: "下拉列表最大高度" },
  },
  args: {
    variant: "default",
    inputVariant: "default",
    implementation: "wrapper",
    side: "bottom",
    direction: "ltr",
    disabled: false,
    initialValues: ["SolidJS", "TypeScript"],
    width: "28rem",
    maxHeight: "14rem",
  },
  render: (args: PillArgs) => <PillExamples {...args} />,
} satisfies Meta<PillArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    controls: {
      exclude: ["inputVariant", "implementation", "side", "initialValues", "width", "maxHeight"],
    },
  },
};
export const PortalValues: Story = {
  args: { implementation: "portal" },
  render: (args: PillArgs) => (
    <div class={styles.preview} dir={args.direction}>
      <ValueInputExample {...args} mode="multi" />
    </div>
  ),
};
export const Wrapping: Story = {
  args: { width: "15rem", initialValues: ["SolidJS", "TypeScript", "Sass", "Storybook"] },
  parameters: { controls: { exclude: ["implementation", "side", "maxHeight"] } },
  render: (args: PillArgs) => (
    <div class={styles.preview} dir={args.direction}>
      <ValueInputExample {...args} mode="tags" />
    </div>
  ),
};
export const TagsInput: Story = {
  parameters: { controls: { exclude: ["implementation", "side", "maxHeight"] } },
  render: (args: PillArgs) => (
    <div class={styles.preview} dir={args.direction}>
      <ValueInputExample {...args} mode="tags" />
    </div>
  ),
};
export const MultiSelect: Story = {
  render: (args: PillArgs) => (
    <div class={styles.preview} dir={args.direction}>
      <ValueInputExample {...args} mode="multi" />
    </div>
  ),
};
export const AutocompleteCombobox: Story = {
  render: (args: PillArgs) => (
    <div class={styles.preview} dir={args.direction}>
      <ValueInputExample {...args} mode="combo" />
    </div>
  ),
};
