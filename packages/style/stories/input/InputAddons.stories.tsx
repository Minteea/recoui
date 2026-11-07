import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { IconMail, IconMinus, IconPlus, IconSearch, IconX } from "@tabler/icons-solidjs";
import { createEffect, createSignal, createUniqueId } from "solid-js";
import styles from "../shared/preview.module.css";

interface AddonArgs {
  variant: "default" | "filled" | "unstyled";
  color: string;
  radius?: string;
  status?: "error" | "warning";
  buttonWidth: string;
  disabled: boolean;
  text: string;
}

const appearance = (args: AddonArgs) => ({
  class: "ui-input",
  "data-variant": args.variant,
  "data-color": args.color,
  "data-radius": args.radius,
});

const controlState = (args: AddonArgs) => ({
  disabled: args.disabled,
  "aria-invalid": args.status === "error" || undefined,
  "data-warning": args.status === "warning" ? "" : undefined,
});

const meta = {
  title: "Styles/Input/Input Addons",
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: "select", options: ["default", "filled", "unstyled"] },
    color: { control: "text" },
    radius: { control: "text" },
    status: { control: "select", options: [undefined, "error", "warning"] },
    buttonWidth: {
      control: "text",
      description: "ui-addon-button 的 data-width，可使用 default、icon、block 或 CSS 尺寸。",
    },
    disabled: { control: "boolean" },
    text: { control: "text" },
  },
  args: {
    variant: "default",
    color: "primary",
    buttonWidth: "icon",
    disabled: false,
    text: "可以清除这段内容",
  },
  render: (args: AddonArgs) => {
    const id = createUniqueId();
    return (
      <div class={styles.preview}>
        <div class={styles.grid}>
          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-domain`}>
              纯文本前缀和后缀
            </label>
            <div {...appearance(args)}>
              <span class="ui-addon" aria-hidden="true">
                https://
              </span>
              <input {...controlState(args)} id={`${id}-domain`} placeholder="example" />
              <span class="ui-addon" aria-hidden="true">
                .com
              </span>
            </div>
          </div>
          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-amount`}>
              修饰组内组合 span
            </label>
            <div {...appearance(args)}>
              <span class="ui-addon" aria-hidden="true">
                <span>¥</span>
                <span>CNY</span>
              </span>
              <input
                {...controlState(args)}
                id={`${id}-amount`}
                inputMode="decimal"
                placeholder="输入金额"
              />
              <span class="ui-addon" aria-hidden="true">
                元
              </span>
            </div>
          </div>
          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-email`}>
              第三方图标使用默认 24px 尺寸
            </label>
            <div {...appearance(args)}>
              <span class="ui-addon">
                <IconMail aria-hidden="true" />
              </span>
              <input
                {...controlState(args)}
                id={`${id}-email`}
                type="email"
                placeholder="name@example.com"
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
} satisfies Meta<AddonArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { controls: { exclude: ["text", "buttonWidth"] } },
};

export const Buttons: Story = {
  render: (args: AddonArgs) => {
    const id = createUniqueId();
    const [text, setText] = createSignal(args.text);
    const [visible, setVisible] = createSignal(false);
    const [quantity, setQuantity] = createSignal(2);
    const [message, setMessage] = createSignal("");
    let clearInput!: HTMLInputElement;
    let searchInput!: HTMLInputElement;
    createEffect(() => setText(args.text));

    return (
      <div class={styles.preview}>
        <div class={styles.grid}>
          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-clear`}>
              清除按钮 · 可调整 data-width
            </label>
            <div {...appearance(args)}>
              <input
                {...controlState(args)}
                id={`${id}-clear`}
                ref={clearInput}
                value={text()}
                onInput={(event) => setText(event.currentTarget.value)}
              />
              <span class="ui-addon">
                <button
                  class="ui-addon-button"
                  type="button"
                  data-width={args.buttonWidth}
                  aria-label="清除内容"
                  disabled={args.disabled || !text()}
                  onClick={() => {
                    setText("");
                    clearInput.focus();
                  }}
                >
                  <IconX size={16} aria-hidden="true" />
                </button>
              </span>
            </div>
          </div>
          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-password`}>
              默认宽度的文本按钮
            </label>
            <div {...appearance(args)}>
              <input
                {...controlState(args)}
                id={`${id}-password`}
                type={visible() ? "text" : "password"}
                value="reco-ui"
              />
              <span class="ui-addon">
                <button
                  class="ui-addon-button"
                  type="button"
                  aria-pressed={visible()}
                  disabled={args.disabled}
                  onClick={() => setVisible(!visible())}
                >
                  {visible() ? "隐藏" : "显示"}
                </button>
              </span>
            </div>
          </div>
          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-search`}>
              前置图标按钮与固定宽度按钮
            </label>
            <div {...appearance(args)}>
              <span class="ui-addon">
                <button
                  class="ui-addon-button"
                  type="button"
                  data-width="icon"
                  aria-label="聚焦搜索框"
                  disabled={args.disabled}
                  onClick={() => searchInput.focus()}
                >
                  <IconSearch size={16} aria-hidden="true" />
                </button>
              </span>
              <input
                {...controlState(args)}
                id={`${id}-search`}
                ref={searchInput}
                type="search"
                placeholder="输入关键词"
              />
              <span class="ui-addon">
                <button
                  class="ui-addon-button"
                  type="button"
                  data-width="4rem"
                  disabled={args.disabled}
                  onClick={() => setMessage(`搜索：${searchInput.value || "未填写关键词"}`)}
                >
                  搜索
                </button>
              </span>
            </div>
          </div>
          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-quantity`}>
              一个修饰组内的多个按钮
            </label>
            <div {...appearance(args)} style={{ "--ui-height": "3rem" }}>
              <input
                {...controlState(args)}
                id={`${id}-quantity`}
                type="number"
                min="0"
                value={quantity()}
                onInput={(event) => setQuantity(event.currentTarget.valueAsNumber || 0)}
              />
              <span class="ui-addon">
                <button
                  class="ui-addon-button"
                  type="button"
                  data-width="icon"
                  aria-label="减少数量"
                  disabled={args.disabled || quantity() <= 0}
                  onClick={() => setQuantity(Math.max(0, quantity() - 1))}
                >
                  <IconMinus size={16} aria-hidden="true" />
                </button>
                <button
                  class="ui-addon-button"
                  type="button"
                  data-width="icon"
                  aria-label="增加数量"
                  disabled={args.disabled}
                  onClick={() => setQuantity(quantity() + 1)}
                >
                  <IconPlus size={16} aria-hidden="true" />
                </button>
              </span>
            </div>
          </div>
        </div>
        <output aria-live="polite">{message()}</output>
      </div>
    );
  },
};
