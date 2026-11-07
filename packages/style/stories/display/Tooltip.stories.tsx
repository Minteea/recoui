import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { IconInfoCircle } from "@tabler/icons-solidjs";
import { createEffect, createSignal, createUniqueId, For, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import styles from "../shared/preview.module.css";

type Side = "top" | "bottom" | "left" | "right";

interface TooltipArgs {
  text: string;
  side: Side;
  maxWidth: string;
  disabled: boolean;
  direction: "ltr" | "rtl";
}

function WrappedTooltip(props: TooltipArgs & { label?: string }) {
  const id = createUniqueId();
  const [dismissed, setDismissed] = createSignal(false);
  return (
    <span
      class="ui-tooltip-wrapper"
      data-tooltip={props.text}
      data-side={props.side}
      data-state={dismissed() ? "closed" : undefined}
      style={{ "--ui-tooltip-max-width": props.maxWidth }}
      tabIndex={props.disabled ? 0 : undefined}
      aria-label={props.disabled ? props.label ?? "包裹式提示" : undefined}
      aria-describedby={props.disabled ? id : undefined}
      onPointerEnter={() => setDismissed(false)}
      onFocusIn={() => setDismissed(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !dismissed() && props.text) {
          event.preventDefault();
          event.stopPropagation();
          setDismissed(true);
        }
      }}
    >
      <button class="ui-button" type="button" disabled={props.disabled} aria-describedby={id}>
        {props.label ?? "包裹式提示"}
      </button>
      <span id={id} hidden>
        {props.text}
      </span>
    </span>
  );
}

function PortalTooltip(props: TooltipArgs) {
  const id = createUniqueId();
  const [visible, setVisible] = createSignal(false);
  const [position, setPosition] = createSignal({ left: 0, top: 0 });
  let trigger!: HTMLSpanElement;
  let tooltip!: HTMLDivElement;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;
  let dismissed = false;

  const cancelHide = () => clearTimeout(hideTimer);
  const show = () => {
    cancelHide();
    if (!dismissed && props.text) setVisible(true);
  };
  const scheduleHide = () => {
    cancelHide();
    hideTimer = setTimeout(() => {
      if (!trigger.matches(":hover, :focus-within") && !tooltip.matches(":hover"))
        setVisible(false);
    }, 120);
  };
  const updatePosition = () => {
    if (!visible()) return;
    const anchor = trigger.getBoundingClientRect();
    const tip = tooltip.getBoundingClientRect();
    const gap = 8;
    let side = props.side;
    if (side === "top" && anchor.top < tip.height + gap) side = "bottom";
    else if (side === "bottom" && innerHeight - anchor.bottom < tip.height + gap) side = "top";
    else if (side === "left" && anchor.left < tip.width + gap) side = "right";
    else if (side === "right" && innerWidth - anchor.right < tip.width + gap) side = "left";
    let left = anchor.left + (anchor.width - tip.width) / 2;
    let top = anchor.top + (anchor.height - tip.height) / 2;
    if (side === "top") top = anchor.top - tip.height - gap;
    if (side === "bottom") top = anchor.bottom + gap;
    if (side === "left") left = anchor.left - tip.width - gap;
    if (side === "right") left = anchor.right + gap;
    setPosition({
      left: Math.max(gap, Math.min(left, innerWidth - tip.width - gap)),
      top: Math.max(gap, Math.min(top, innerHeight - tip.height - gap)),
    });
  };

  createEffect(() => {
    if (!props.text) {
      setVisible(false);
      return;
    }
    if (!visible()) return;
    props.side;
    props.text;
    props.maxWidth;
    queueMicrotask(updatePosition);
    const observer = new ResizeObserver(updatePosition);
    observer.observe(trigger);
    observer.observe(tooltip);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    onCleanup(() => {
      observer.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    });
  });
  const onEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && visible()) {
      event.preventDefault();
      event.stopPropagation();
      dismissed = true;
      setVisible(false);
    }
  };
  document.addEventListener("keydown", onEscape, true);
  onCleanup(() => {
    cancelHide();
    document.removeEventListener("keydown", onEscape, true);
  });

  return (
    <>
      <span
        ref={trigger}
        style={{ display: "inline-flex", "inline-size": "fit-content" }}
        tabIndex={props.disabled ? 0 : undefined}
        aria-label={props.disabled ? "Portal 提示" : undefined}
        aria-describedby={props.disabled ? id : undefined}
        onPointerEnter={() => {
          dismissed = false;
          show();
        }}
        onPointerLeave={scheduleHide}
        onFocusIn={() => {
          dismissed = false;
          show();
        }}
        onFocusOut={scheduleHide}
      >
        <button
          class="ui-button"
          type="button"
          aria-describedby={id}
          disabled={props.disabled}
          style={{ gap: "0.375rem" }}
        >
          <IconInfoCircle size={16} aria-hidden="true" /> Portal 提示
        </button>
      </span>
      <Portal>
        <div
          ref={tooltip}
          id={id}
          class="ui-tooltip"
          role="tooltip"
          dir={props.direction}
          hidden={!visible()}
          style={{
            left: `${position().left}px`,
            top: `${position().top}px`,
            "--ui-tooltip-max-width": props.maxWidth,
          }}
          onPointerEnter={show}
          onPointerLeave={scheduleHide}
        >
          {props.text}
        </div>
      </Portal>
    </>
  );
}

function TooltipExamples(props: TooltipArgs) {
  return (
    <div class={styles.preview} dir={props.direction}>
      <div class={styles.grid}>
        <div
          class={styles.example}
          style={{ "align-items": "center", "justify-items": "center", padding: "3rem 1rem" }}
        >
          <span class={styles.markup}>.ui-tooltip-wrapper · ::after</span>
          <WrappedTooltip {...props} />
        </div>
        <div
          class={styles.example}
          style={{
            "align-items": "center",
            "justify-items": "center",
            padding: "3rem 1rem",
            overflow: "hidden",
          }}
        >
          <span class={styles.markup}>.ui-tooltip · Solid Portal</span>
          <PortalTooltip {...props} />
        </div>
      </div>
      <div class={styles.grid}>
        <For each={["top", "bottom", "left", "right"] as const}>
          {(side) => (
            <div
              class={styles.example}
              style={{ "align-items": "center", "justify-items": "center", padding: "3rem 1rem" }}
            >
              <WrappedTooltip {...props} side={side} label={side} />
            </div>
          )}
        </For>
      </div>
      <p class={styles.markup}>悬停或使用 Tab 键聚焦以查看提示；Esc 关闭提示并保留目标上的焦点。</p>
    </div>
  );
}

const meta = {
  title: "Styles/Display/Tooltip",
  parameters: { layout: "padded" },
  argTypes: {
    text: { control: "text", description: "包裹式通过 data-tooltip 提供文字；独立式使用元素内容" },
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    maxWidth: { control: "text", description: "--ui-tooltip-max-width" },
    disabled: { control: "boolean" },
    direction: { control: "select", options: ["ltr", "rtl"] },
  },
  args: {
    text: "查看此操作的说明",
    side: "top",
    maxWidth: "20rem",
    disabled: false,
    direction: "ltr",
  },
  render: (args: TooltipArgs) => <TooltipExamples {...args} />,
} satisfies Meta<TooltipArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongText: Story = {
  args: {
    text: "较长的说明文字会根据最大宽度自动换行，也可以展示 https://example.com/projects/a-very-long-project-name-without-spaces 等较长的内容。",
    maxWidth: "14rem",
  },
};
export const DisabledTarget: Story = { args: { disabled: true } };
