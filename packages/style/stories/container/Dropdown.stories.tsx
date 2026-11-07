import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconEdit,
  IconHelp,
  IconShare,
  IconTrash,
} from "@tabler/icons-solidjs";
import { createEffect, createSignal, createUniqueId, For, on, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { dismissOnOutside, DropdownLayer, dropdownPosition } from "../shared/dropdown";
import styles from "../shared/preview.module.css";

interface DropdownArgs {
  implementation: "wrapper" | "portal";
  side: "bottom" | "top";
  direction: "ltr" | "rtl";
  disabled: boolean;
  maxHeight: string;
}

const groups = [
  { id: "product", label: "产品团队" },
  { id: "support", label: "支持团队" },
  { id: "future", label: "暂未开放", disabled: true },
];
interface Team {
  value: string;
  label: string;
  group: string;
  disabled?: boolean;
}

const initialTeam: Team = { value: "engineering", label: "研发", group: "product" };
const teams: Team[] = [
  { value: "design", label: "设计", group: "product" },
  initialTeam,
  { value: "archived", label: "已归档团队", group: "product", disabled: true },
  { value: "service", label: "客户服务", group: "support" },
  { value: "automation", label: "自动化", group: "future" },
];
const isTeamDisabled = (index: number) => {
  const team = teams[index];
  return !team || !!team.disabled || !!groups.find((group) => group.id === team.group)?.disabled;
};

function SelectExample(props: DropdownArgs) {
  const id = createUniqueId();
  const [open, setOpen] = createSignal(false);
  const [selected, setSelected] = createSignal(1);
  const selectedTeam = () => teams[selected()] ?? initialTeam;
  const [active, setActive] = createSignal(1);
  const [message, setMessage] = createSignal("");
  let root!: HTMLDivElement;
  let trigger!: HTMLButtonElement;
  let popup!: HTMLDivElement;
  const available = () => teams.map((_, index) => index).filter((index) => !isTeamDisabled(index));
  const close = () => setOpen(false);
  const expand = () => {
    if (props.disabled) return;
    setActive(selected());
    setOpen(true);
  };
  const choose = (index: number) => {
    if (props.disabled || isTeamDisabled(index)) return;
    setSelected(index);
    close();
    trigger.focus();
  };
  const popupStyle = dropdownPosition(
    props,
    open,
    () => trigger,
    () => popup,
    true,
  );
  dismissOnOutside(() => [root, popup], open, close);
  createEffect(on(() => props.implementation, close, { defer: true }));
  createEffect(() => {
    if (props.disabled) close();
  });
  createEffect(() => {
    if (!open()) return;
    const index = active();
    queueMicrotask(
      () => document.getElementById(`${id}-option-${index}`)?.scrollIntoView({ block: "nearest" }),
    );
  });

  return (
    <form
      class={styles.group}
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(`表单值：${new FormData(event.currentTarget).get("team") ?? "禁用"}`);
      }}
    >
      <label class="ui-field-label" id={`${id}-label`}>
        组合式选择器
      </label>
      <div
        ref={root}
        class={props.implementation === "wrapper" ? "ui-dropdown-wrapper" : undefined}
        data-side={props.side}
        style={{ "inline-size": "100%", "max-inline-size": "20rem" }}
      >
        <button
          ref={trigger}
          id={`${id}-trigger`}
          class="ui-input"
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open()}
          aria-controls={`${id}-listbox`}
          aria-labelledby={`${id}-label ${id}-value`}
          aria-activedescendant={open() ? `${id}-option-${active()}` : undefined}
          disabled={props.disabled}
          style={{ "justify-content": "space-between" }}
          onClick={() => (open() ? close() : expand())}
          onKeyDown={(event) => {
            const key = event.key;
            if (key === "Escape") {
              if (open()) {
                event.preventDefault();
                close();
              }
              return;
            }
            if (key === "Tab") {
              close();
              return;
            }
            if (key === "Enter" || key === " ") {
              event.preventDefault();
              if (open()) choose(active());
              else expand();
              return;
            }
            if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) return;
            event.preventDefault();
            const items = available();
            const first = items[0];
            if (first === undefined) return;
            if (!open()) {
              expand();
              if (key === "Home") setActive(first);
              if (key === "End") setActive(items.at(-1) ?? first);
              return;
            }
            const index = items.indexOf(active());
            const next =
              key === "Home"
                ? first
                : key === "End"
                ? items.at(-1)
                : items[(index + (key === "ArrowDown" ? 1 : -1) + items.length) % items.length];
            if (next !== undefined) setActive(next);
          }}
        >
          <span id={`${id}-value`}>{selectedTeam().label}</span>
          <span class="ui-addon" aria-hidden="true">
            <IconChevronDown size={16} />
          </span>
        </button>
        <input type="hidden" name="team" value={selectedTeam().value} disabled={props.disabled} />
        <DropdownLayer portal={props.implementation === "portal"}>
          <div
            ref={popup}
            class="ui-dropdown"
            dir={props.direction}
            id={`${id}-listbox`}
            role="listbox"
            aria-labelledby={`${id}-label`}
            hidden={!open()}
            style={popupStyle()}
          >
            <For each={groups}>
              {(group) => (
                <div
                  class="ui-optgroup"
                  role="group"
                  aria-labelledby={`${id}-group-${group.id}`}
                  aria-disabled={group.disabled}
                >
                  <div class="ui-optgroup-legend" id={`${id}-group-${group.id}`}>
                    {group.label}
                  </div>
                  <For each={teams.filter((team) => team.group === group.id)}>
                    {(team) => {
                      const index = teams.indexOf(team);
                      return (
                        <div
                          class="ui-option"
                          id={`${id}-option-${index}`}
                          role="option"
                          aria-selected={selected() === index}
                          aria-disabled={isTeamDisabled(index)}
                          data-highlighted={active() === index}
                          onPointerDown={(event) => event.preventDefault()}
                          onPointerMove={() => {
                            if (!isTeamDisabled(index)) setActive(index);
                          }}
                          onClick={() => choose(index)}
                        >
                          <span style={{ flex: "1", "min-inline-size": "0" }}>{team.label}</span>
                          <Show when={selected() === index}>
                            <IconCheck size={16} aria-hidden="true" />
                          </Show>
                        </div>
                      );
                    }}
                  </For>
                </div>
              )}
            </For>
          </div>
        </DropdownLayer>
      </div>
      <div>
        <button class="ui-button" type="submit">
          读取表单值
        </button>
      </div>
      <p role="status" style={{ margin: "0" }}>
        {message()}
      </p>
    </form>
  );
}

function MenuExample(props: DropdownArgs) {
  const id = createUniqueId();
  const [open, setOpen] = createSignal(false);
  const [message, setMessage] = createSignal("");
  let root!: HTMLDivElement;
  let trigger!: HTMLButtonElement;
  let menu!: HTMLDivElement;
  const popupStyle = dropdownPosition(
    props,
    open,
    () => trigger,
    () => menu,
  );
  const commands = [
    { id: "edit", label: "编辑", icon: IconEdit },
    { id: "copy", label: "创建副本", icon: IconCopy },
    { id: "share", label: "共享（暂不可用）", icon: IconShare, disabled: true },
    { id: "help", label: "查看帮助", icon: IconHelp, element: "a" as const },
    { id: "delete", label: "删除", icon: IconTrash },
  ];
  const items = () =>
    Array.from(
      menu.querySelectorAll<HTMLElement>('.ui-option:not(:disabled, [aria-disabled="true"])'),
    );
  const close = (restore = false) => {
    setOpen(false);
    if (restore) trigger.focus();
  };
  const expand = (last = false) => {
    if (props.disabled) return;
    setOpen(true);
    queueMicrotask(() => (last ? items().at(-1) : items()[0])?.focus());
  };
  dismissOnOutside(
    () => [root, menu],
    open,
    () => close(),
  );
  createEffect(
    on(
      () => props.implementation,
      () => close(true),
      { defer: true },
    ),
  );
  createEffect(() => {
    if (props.disabled) close();
  });

  return (
    <div class={styles.group}>
      <span class="ui-field-label">按钮操作菜单</span>
      <div
        ref={root}
        class={props.implementation === "wrapper" ? "ui-dropdown-wrapper" : undefined}
        data-side={props.side}
        style={{ "inline-size": "fit-content" }}
      >
        <button
          ref={trigger}
          id={`${id}-trigger`}
          class="ui-button"
          type="button"
          aria-haspopup="menu"
          aria-expanded={open()}
          aria-controls={`${id}-menu`}
          disabled={props.disabled}
          style={{ gap: "0.5rem" }}
          onClick={() => (open() ? close() : expand())}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              expand(event.key === "ArrowUp");
            }
          }}
        >
          项目操作 <IconChevronDown size={16} aria-hidden="true" />
        </button>
        <DropdownLayer portal={props.implementation === "portal"}>
          <div
            ref={menu}
            class="ui-dropdown"
            dir={props.direction}
            id={`${id}-menu`}
            role="menu"
            aria-labelledby={`${id}-trigger`}
            hidden={!open()}
            style={popupStyle()}
            onKeyDown={(event) => {
              const key = event.key;
              if (key === "Escape") {
                event.preventDefault();
                close(true);
                return;
              }
              if (key === "Tab") {
                close(true);
                return;
              }
              if (key === " " && (event.target as HTMLElement).tagName === "A") {
                event.preventDefault();
                (event.target as HTMLElement).click();
                return;
              }
              if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) return;
              event.preventDefault();
              const enabled = items();
              const index = enabled.indexOf(document.activeElement as HTMLElement);
              (key === "Home"
                ? enabled[0]
                : key === "End"
                ? enabled.at(-1)!
                : enabled[
                    (index + (key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length
                  ]
              )?.focus();
            }}
          >
            <div class="ui-optgroup" role="group" aria-labelledby={`${id}-legend`}>
              <div class="ui-optgroup-legend" id={`${id}-legend`}>
                项目操作
              </div>
              <For each={commands}>
                {(command) => (
                  <>
                    <Show when={command.id === "delete"}>
                      <hr role="separator" />
                    </Show>
                    <Dynamic
                      component={command.element ?? "button"}
                      class="ui-option"
                      role="menuitem"
                      type={command.element ? undefined : "button"}
                      href={command.element ? "#help" : undefined}
                      tabIndex={-1}
                      disabled={command.element ? undefined : command.disabled}
                      aria-disabled={command.disabled}
                      onClick={(event: MouseEvent) => {
                        event.preventDefault();
                        if (command.disabled || props.disabled) return;
                        setMessage(`已选择：${command.label}`);
                        close(true);
                      }}
                    >
                      <Dynamic component={command.icon} size={16} aria-hidden="true" />
                      {command.label}
                    </Dynamic>
                  </>
                )}
              </For>
            </div>
          </div>
        </DropdownLayer>
      </div>
      <p role="status" style={{ margin: "0" }}>
        {message()}
      </p>
    </div>
  );
}

function DropdownExamples(props: DropdownArgs) {
  const id = createUniqueId();
  return (
    <div class={styles.preview} dir={props.direction}>
      <div class={styles.grid}>
        <div class={styles.example}>
          <label class="ui-field-label" for={`${id}-native`}>
            原生 select · 共享选项样式
          </label>
          <select class="ui-input" id={`${id}-native`} disabled={props.disabled}>
            <For each={groups}>
              {(group) => (
                <optgroup label={group.label} disabled={group.disabled}>
                  <Dynamic component="legend">{group.label}</Dynamic>
                  <For each={teams.filter((team) => team.group === group.id)}>
                    {(team) => (
                      <option
                        value={team.value}
                        disabled={team.disabled}
                        selected={team.value === "engineering"}
                      >
                        {team.label}
                      </option>
                    )}
                  </For>
                </optgroup>
              )}
            </For>
          </select>
          <label class="ui-field-label" for={`${id}-suggestions`}>
            原生 datalist · 同形下拉图标
          </label>
          <input
            class="ui-input"
            id={`${id}-suggestions`}
            list={`${id}-teams`}
            placeholder="输入或选择团队"
            disabled={props.disabled}
          />
          <datalist id={`${id}-teams`}>
            <For
              each={teams.filter(
                (team) =>
                  !team.disabled && !groups.find((group) => group.id === team.group)?.disabled,
              )}
            >
              {(team) => <option value={team.label} />}
            </For>
          </datalist>
        </div>
        <div class={styles.example}>
          <span class="ui-field-label">普通元素 · 选项与选项组外观</span>
          <div
            class="ui-dropdown"
            aria-hidden="true"
            style={{
              position: "static",
              "inline-size": "100%",
              "--ui-dropdown-max-height": props.maxHeight,
            }}
          >
            <For each={groups}>
              {(group) => (
                <div class="ui-optgroup" aria-disabled={group.disabled}>
                  <div class="ui-optgroup-legend">{group.label}</div>
                  <For each={teams.filter((team) => team.group === group.id)}>
                    {(team) => (
                      <div
                        class="ui-option"
                        aria-selected={team.value === "engineering"}
                        aria-disabled={team.disabled}
                      >
                        {team.label}
                      </div>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
      <div class={styles.grid}>
        <div
          class={styles.example}
          style={{ overflow: props.implementation === "portal" ? "hidden" : "visible" }}
        >
          <SelectExample {...props} />
        </div>
        <div
          class={styles.example}
          style={{ overflow: props.implementation === "portal" ? "hidden" : "visible" }}
        >
          <MenuExample {...props} />
        </div>
      </div>
      <p class={styles.markup}>
        当前实现：{props.implementation}。wrapper 使用 .ui-dropdown-wrapper
        包裹触发元素和同级菜单，Portal 将菜单渲染到外层。菜单项可以是 div、button 或
        a。方向键切换选项，Enter 确认，Esc 关闭。
      </p>
    </div>
  );
}

const meta = {
  title: "Styles/Container/Dropdown",
  parameters: { layout: "padded" },
  argTypes: {
    implementation: { control: "select", options: ["wrapper", "portal"] },
    side: { control: "select", options: ["bottom", "top"] },
    direction: { control: "select", options: ["ltr", "rtl"] },
    disabled: { control: "boolean" },
    maxHeight: { control: "text", description: "--ui-dropdown-max-height" },
  },
  args: {
    implementation: "wrapper",
    side: "bottom",
    direction: "ltr",
    disabled: false,
    maxHeight: "20rem",
  },
  render: (args: DropdownArgs) => <DropdownExamples {...args} />,
} satisfies Meta<DropdownArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const PortalDropdown: Story = { args: { implementation: "portal" } };
export const Scrollable: Story = { args: { maxHeight: "8rem" } };
