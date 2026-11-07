import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal, createUniqueId, For } from "solid-js";
import { Dynamic } from "solid-js/web";
import styles from "../shared/preview.module.css";

interface TablistArgs {
  variant: "default" | "filled" | "underline" | "wrapped";
  element: "button" | "a" | "div" | "label";
  orientation: "horizontal" | "vertical";
  direction: "ltr" | "rtl";
  disabled: boolean;
  color?: string;
}

function TablistExample(props: TablistArgs) {
  const id = createUniqueId();
  const [selected, setSelected] = createSignal(0);
  const tabs = [
    { label: "概览", content: "这里是项目概览。" },
    { label: "设置", content: "这里是项目设置。" },
    { label: "暂不可用", content: "此标签已禁用。", disabled: true },
    { label: "活动记录", content: "这里是最近的活动记录。" },
  ];
  const isDisabled = (index: number) => {
    const tab = tabs[index];
    return props.disabled || !tab || !!tab.disabled;
  };

  const onKeyDown = (event: KeyboardEvent & { currentTarget: HTMLElement }) => {
    if (event.currentTarget.getAttribute("aria-disabled") === "true") return;
    const key = event.key;
    if (key === " " || key === "Enter") {
      event.preventDefault();
      event.currentTarget.click();
      return;
    }

    const vertical = props.orientation === "vertical";
    let offset = 0;
    if (vertical) {
      if (key === "ArrowDown") offset = 1;
      if (key === "ArrowUp") offset = -1;
    } else {
      if (key === "ArrowRight") offset = props.direction === "rtl" ? -1 : 1;
      if (key === "ArrowLeft") offset = props.direction === "rtl" ? 1 : -1;
    }
    if (!offset && key !== "Home" && key !== "End") return;
    event.preventDefault();

    const available = Array.from(
      event.currentTarget.parentElement!.querySelectorAll<HTMLElement>(
        ':scope > .ui-tab:not(:disabled, [aria-disabled="true"])',
      ),
    );
    const index = available.indexOf(event.currentTarget);
    const next =
      key === "Home"
        ? 0
        : key === "End"
        ? available.length - 1
        : (index + offset + available.length) % available.length;
    available[next]?.focus();
  };

  return (
    <div class={styles.preview} dir={props.direction}>
      <span class={styles.markup}>
        {props.element}.ui-tab · aria-selected · disabled / aria-disabled
      </span>
      <div
        style={{
          display: "flex",
          "flex-direction": props.orientation === "vertical" ? "row" : "column",
          gap: "1rem",
          "min-inline-size": "0",
        }}
      >
        <div
          class="ui-tabs-list"
          role="tablist"
          aria-label="项目信息"
          aria-orientation={props.orientation}
          aria-disabled={props.disabled}
          data-color={props.color}
          data-variant={props.variant}
          style={{ "flex-shrink": 0 }}
        >
          <For each={tabs}>
            {(tab, index) => (
              <Dynamic
                component={props.element}
                class="ui-tab"
                role="tab"
                id={`${id}-tab-${index()}`}
                type={props.element === "button" ? "button" : undefined}
                href={props.element === "a" ? `#${id}-panel-${index()}` : undefined}
                disabled={props.element === "button" ? isDisabled(index()) : undefined}
                aria-disabled={isDisabled(index())}
                aria-selected={selected() === index()}
                aria-controls={`${id}-panel-${index()}`}
                tabIndex={!isDisabled(index()) && selected() === index() ? 0 : -1}
                onClick={(event: MouseEvent & { currentTarget: HTMLElement }) => {
                  event.preventDefault();
                  if (!isDisabled(index())) setSelected(index());
                }}
                onFocus={() => {
                  if (!isDisabled(index())) setSelected(index());
                }}
                onKeyDown={onKeyDown}
              >
                {tab.label}
              </Dynamic>
            )}
          </For>
        </div>
        <div style={{ "min-inline-size": "0", flex: "1" }}>
          <For each={tabs}>
            {(tab, index) => (
              <div
                role="tabpanel"
                id={`${id}-panel-${index()}`}
                aria-labelledby={`${id}-tab-${index()}`}
                hidden={selected() !== index()}
                tabIndex={0}
                style={{ padding: "0.75rem", "overflow-wrap": "anywhere" }}
              >
                {tab.content}
              </div>
            )}
          </For>
        </div>
      </div>
      <p class={styles.markup}>
        使用方向键切换标签，Home / End 跳转首尾，自动跳过禁用项。Tab 键进入当前标签或离开标签组。
      </p>
    </div>
  );
}

const meta = {
  title: "Styles/Input/Tablist",
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: "select", options: ["default", "filled", "underline", "wrapped"] },
    element: { control: "select", options: ["button", "a", "div", "label"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    direction: { control: "select", options: ["ltr", "rtl"] },
    disabled: { control: "boolean" },
    color: { control: "text", description: "标签组的 data-color，可使用命名颜色或自定义颜色" },
  },
  args: {
    variant: "default",
    element: "button",
    orientation: "horizontal",
    direction: "ltr",
    disabled: false,
  },
  render: (args: TablistArgs) => <TablistExample {...args} />,
} satisfies Meta<TablistArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Variants: Story = {
  parameters: { controls: { exclude: ["variant"] } },
  render: (args: TablistArgs) => (
    <div class={styles.preview}>
      <For each={["default", "filled", "underline", "wrapped"] as const}>
        {(variant) => <TablistExample {...args} variant={variant} />}
      </For>
    </div>
  ),
};
export const Elements: Story = {
  parameters: { controls: { exclude: ["element"] } },
  render: (args: TablistArgs) => (
    <div class={styles.preview}>
      <For each={["button", "a", "div", "label"] as const}>
        {(element) => <TablistExample {...args} element={element} />}
      </For>
    </div>
  ),
};
export const Vertical: Story = { args: { orientation: "vertical" } };
