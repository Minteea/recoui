import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { IconX } from "@tabler/icons-solidjs";
import { createEffect, createSignal, createUniqueId, For, on, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";
import styles from "../shared/preview.module.css";

interface ModalArgs {
  element: "dialog" | "div";
  width: string;
  longContent: boolean;
  closeOnBackdrop: boolean;
}

function ModalContent(props: {
  id: string;
  longContent: boolean;
  close: () => void;
  confirm: (value: string) => void;
}) {
  return (
    <form
      style={{ display: "grid", gap: "1rem" }}
      onSubmit={(event) => {
        event.preventDefault();
        props.confirm(String(new FormData(event.currentTarget).get("name") ?? ""));
      }}
    >
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "justify-content": "space-between",
          gap: "1rem",
        }}
      >
        <h2 id={`${props.id}-title`} tabIndex={-1} style={{ margin: "0", "font-size": "1.125rem" }}>
          编辑项目
        </h2>
        <button
          class="ui-addon-button"
          type="button"
          data-width="icon"
          aria-label="关闭模态框"
          onClick={props.close}
        >
          <IconX size={16} aria-hidden="true" />
        </button>
      </div>
      <p id={`${props.id}-description`} style={{ margin: "0", "line-height": "1.5" }}>
        修改项目名称，完成后保存。
      </p>
      <div class="ui-field">
        <label class="ui-field-label" for={`${props.id}-name`}>
          项目名称
        </label>
        <input class="ui-input" id={`${props.id}-name`} name="name" value="示例项目" required />
      </div>
      <Show when={props.longContent}>
        <For each={Array.from({ length: 12 }, (_, index) => index + 1)}>
          {(index) => (
            <p style={{ margin: "0", "line-height": "1.75" }}>
              第 {index}{" "}
              段内容：这里可以放置项目说明、表单或其他内容。内容较长时，模态框保持在视口范围内，并在内部滚动。
            </p>
          )}
        </For>
      </Show>
      <div
        style={{
          display: "flex",
          "justify-content": "flex-end",
          "flex-wrap": "wrap",
          gap: "0.5rem",
        }}
      >
        <button class="ui-button" type="button" onClick={props.close}>
          取消
        </button>
        <button class="ui-button" type="submit" data-variant="filled" data-color="primary">
          保存
        </button>
      </div>
    </form>
  );
}

function ModalExample(props: ModalArgs) {
  const id = createUniqueId();
  const [open, setOpen] = createSignal(false);
  const [message, setMessage] = createSignal("");
  let background!: HTMLDivElement;
  let dialog: HTMLDialogElement | undefined;
  let panel: HTMLDivElement | undefined;
  let trigger: HTMLElement | undefined;

  const close = () => {
    dialog?.close();
    setOpen(false);
  };
  const focusInitial = () => {
    const root = props.element === "dialog" ? dialog : panel;
    root?.querySelector<HTMLElement>(props.longContent ? "h2" : "input")?.focus();
  };

  createEffect(on(() => props.element, close, { defer: true }));
  createEffect(() => {
    if (!open()) return;
    const previousOverflow = document.body.style.overflow;
    const previousInert = background.inert;
    document.body.style.overflow = "hidden";
    if (props.element === "div") background.inert = true;

    const containFocus = (event: FocusEvent) => {
      if (props.element === "div" && panel && !panel.contains(event.target as Node)) focusInitial();
    };
    document.addEventListener("focusin", containFocus);
    queueMicrotask(() => {
      if (open()) focusInitial();
    });
    onCleanup(() => {
      document.removeEventListener("focusin", containFocus);
      document.body.style.overflow = previousOverflow;
      background.inert = previousInert;
      if (trigger?.isConnected) trigger.focus();
    });
  });
  onCleanup(() => dialog?.close());

  const onKeyDown = (event: KeyboardEvent) => {
    const root = props.element === "dialog" ? dialog : panel;
    if (event.key === "Escape" && props.element === "div") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab" && root) {
      const controls = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), [tabindex="0"]',
        ),
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !controls.includes(document.activeElement as HTMLElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  };

  const content = () => (
    <ModalContent
      id={id}
      longContent={props.longContent}
      close={close}
      confirm={(value) => {
        setMessage(`已保存：${value}`);
        close();
      }}
    />
  );

  return (
    <>
      <div ref={background} class={styles.preview}>
        <span class={styles.markup}>{props.element}.ui-modal</span>
        <button
          class="ui-button"
          type="button"
          style={{ "inline-size": "fit-content" }}
          onClick={(event) => {
            trigger = event.currentTarget;
            if (props.element === "dialog") dialog?.showModal();
            setOpen(true);
          }}
        >
          打开模态框
        </button>
        <p style={{ margin: "0" }}>打开后可使用关闭按钮、Esc 或遮罩关闭，焦点会返回打开按钮。</p>
        <p role="status">{message()}</p>
      </div>

      <Portal>
        <Show
          when={props.element === "dialog"}
          fallback={
            <div
              class="ui-modal-backdrop"
              hidden={!open()}
              onClick={(event) => {
                if (props.closeOnBackdrop && event.target === event.currentTarget) close();
              }}
            >
              <div
                ref={panel}
                class="ui-modal"
                hidden={!open()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${id}-title`}
                aria-describedby={`${id}-description`}
                style={{ "--ui-modal-width": props.width }}
                onKeyDown={onKeyDown}
              >
                {content()}
              </div>
            </div>
          }
        >
          <dialog
            ref={dialog}
            class="ui-modal"
            aria-labelledby={`${id}-title`}
            aria-describedby={`${id}-description`}
            style={{ "--ui-modal-width": props.width }}
            onClose={() => setOpen(false)}
            onKeyDown={onKeyDown}
            onClick={(event) => {
              if (!props.closeOnBackdrop || event.target !== event.currentTarget) return;
              const rect = event.currentTarget.getBoundingClientRect();
              if (
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom
              )
                close();
            }}
          >
            {content()}
          </dialog>
        </Show>
      </Portal>
    </>
  );
}

const meta = {
  title: "Styles/Container/Modal",
  parameters: { layout: "padded" },
  argTypes: {
    element: { control: "select", options: ["dialog", "div"] },
    width: { control: "text", description: "--ui-modal-width，最大宽度受视口约束" },
    longContent: { control: "boolean" },
    closeOnBackdrop: { control: "boolean" },
  },
  args: { element: "dialog", width: "32rem", longContent: false, closeOnBackdrop: true },
  render: (args: ModalArgs) => <ModalExample {...args} />,
} satisfies Meta<ModalArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dialog: Story = {};
export const Div: Story = { args: { element: "div" } };
export const LongContent: Story = { args: { longContent: true } };
