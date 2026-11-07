import { createEffect, createSignal, onCleanup, Show, type JSX } from "solid-js";
import { Portal } from "solid-js/web";

export interface DropdownExampleOptions {
  implementation: "wrapper" | "portal";
  side: "bottom" | "top";
  direction: "ltr" | "rtl";
  maxHeight: string;
}

export function dismissOnOutside(
  roots: () => HTMLElement[],
  open: () => boolean,
  close: () => void,
) {
  createEffect(() => {
    if (!open()) return;
    const dismiss = (event: Event) => {
      if (!roots().some((root) => root.contains(event.target as Node))) close();
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    onCleanup(() => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
    });
  });
}

export function DropdownLayer(props: { portal: boolean; children: JSX.Element }) {
  return (
    <Show when={props.portal} fallback={props.children}>
      <Portal>{props.children}</Portal>
    </Show>
  );
}

export function dropdownPosition(
  props: DropdownExampleOptions,
  open: () => boolean,
  trigger: () => HTMLElement,
  popup: () => HTMLElement,
  matchWidth = false,
) {
  const [position, setPosition] = createSignal({
    left: 0,
    top: 0,
    width: 0,
    availableHeight: 1000,
  });
  const update = () => {
    if (!open() || props.implementation !== "portal") return;
    const anchor = trigger().getBoundingClientRect();
    if (matchWidth) popup().style.inlineSize = `${anchor.width}px`;
    const rect = popup().getBoundingClientRect();
    const gap = 4;
    const margin = 8;
    const above = Math.max(0, anchor.top - gap - margin);
    const below = Math.max(0, innerHeight - anchor.bottom - gap - margin);
    let side = props.side;
    if (side === "bottom" && rect.height > below && above > below) side = "top";
    else if (side === "top" && rect.height > above && below > above) side = "bottom";
    const availableHeight = side === "top" ? above : below;
    const height = Math.min(rect.height, availableHeight);
    const left = props.direction === "rtl" ? anchor.right - rect.width : anchor.left;
    setPosition({
      left: Math.max(margin, Math.min(left, innerWidth - rect.width - margin)),
      top: side === "top" ? anchor.top - height - gap : anchor.bottom + gap,
      width: anchor.width,
      availableHeight,
    });
  };
  createEffect(() => {
    if (!open() || props.implementation !== "portal") return;
    props.side;
    props.direction;
    props.maxHeight;
    queueMicrotask(update);
    const observer = new ResizeObserver(update);
    observer.observe(trigger());
    observer.observe(popup());
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    onCleanup(() => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    });
  });
  return (): JSX.CSSProperties =>
    props.implementation === "portal"
      ? {
          position: "fixed",
          inset: "auto",
          left: `${position().left}px`,
          top: `${position().top}px`,
          "inline-size": matchWidth ? `${position().width}px` : undefined,
          "max-block-size": `min(${props.maxHeight}, ${position().availableHeight}px)`,
          "--ui-dropdown-max-height": props.maxHeight,
        }
      : { "--ui-dropdown-max-height": props.maxHeight };
}
