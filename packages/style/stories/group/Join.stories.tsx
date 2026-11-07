import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal, createUniqueId, Show } from "solid-js";
import styles from "../shared/preview.module.css";

interface GroupArgs {
  variant: "default" | "outline" | "filled" | "light" | "ghost" | "text";
  inputVariant: "default" | "filled" | "unstyled";
  color?: string;
  radius?: string;
  disabled: boolean;
  direction: "ltr" | "rtl";
}

function JoinExamples(props: GroupArgs, showInputs = false) {
  const id = createUniqueId();
  const [quantity, setQuantity] = createSignal(2);
  const [message, setMessage] = createSignal("");
  let searchInput: HTMLInputElement | undefined;
  let wrappedInput: HTMLInputElement | undefined;

  const buttonAttributes = () => ({
    class: "ui-button",
    "data-variant": props.variant,
    "data-color": props.color,
    "data-radius": props.radius,
    disabled: props.disabled,
    type: "button" as const,
  });
  const inputAttributes = () => ({
    class: "ui-input",
    "data-variant": props.inputVariant,
    "data-color": props.color,
    "data-radius": props.radius,
  });

  return (
    <div class={styles.preview} dir={props.direction}>
      <div class={styles.grid}>
        <Show when={!showInputs}>
          <div class={styles.example}>
            <span class={styles.markup}>多个按钮直接拼接</span>
            <div class={styles.sample}>
              <div class="ui-join" role="group" aria-label="按钮拼接">
                <button {...buttonAttributes()} onClick={() => setMessage("已点击左侧按钮")}>
                  左
                </button>
                <button {...buttonAttributes()} onClick={() => setMessage("已点击中间按钮")}>
                  中
                </button>
                <button {...buttonAttributes()} onClick={() => setMessage("已点击右侧按钮")}>
                  右
                </button>
              </div>
            </div>
          </div>

          <div class={styles.example}>
            <span class={styles.markup}>图标按钮 · data-width="icon"</span>
            <div class={styles.sample}>
              <div class="ui-join" role="group" aria-label="图标按钮组">
                <button
                  {...buttonAttributes()}
                  data-width="icon"
                  aria-label="上一项"
                  onClick={() => setMessage("上一项")}
                >
                  ‹
                </button>
                <button
                  {...buttonAttributes()}
                  data-width="icon"
                  aria-label="播放"
                  onClick={() => setMessage("已点击播放")}
                >
                  ▶
                </button>
                <button
                  {...buttonAttributes()}
                  data-width="icon"
                  aria-label="下一项"
                  onClick={() => setMessage("下一项")}
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          <div class={styles.example}>
            <span class={styles.markup}>只有一个按钮时保留完整圆角</span>
            <div class={styles.sample}>
              <div class="ui-join" role="group" aria-label="单个按钮">
                <button {...buttonAttributes()} onClick={() => setMessage("已点击单个按钮")}>
                  单个按钮
                </button>
              </div>
            </div>
          </div>
        </Show>
        <Show when={showInputs}>
          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-quantity`}>
              按钮与数字输入框
            </label>
            <div class={styles.sample}>
              <div class="ui-join" role="group" aria-label="数量调整">
                <button
                  {...buttonAttributes()}
                  data-width="icon"
                  aria-label="减少数量"
                  onClick={() => setQuantity(quantity() - 1)}
                >
                  −
                </button>
                <input
                  {...inputAttributes()}
                  id={`${id}-quantity`}
                  type="number"
                  value={quantity()}
                  disabled={props.disabled}
                  onInput={(event) => setQuantity(event.currentTarget.valueAsNumber || 0)}
                />
                <button
                  {...buttonAttributes()}
                  data-width="icon"
                  aria-label="增加数量"
                  onClick={() => setQuantity(quantity() + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-search`}>
              输入框与搜索按钮
            </label>
            <div class={styles.sample}>
              <div class="ui-join" role="group" aria-label="搜索">
                <input
                  {...inputAttributes()}
                  id={`${id}-search`}
                  type="search"
                  ref={searchInput}
                  placeholder="输入关键词"
                  disabled={props.disabled}
                />
                <button
                  {...buttonAttributes()}
                  onClick={() => setMessage(`搜索：${searchInput?.value || "未填写关键词"}`)}
                >
                  搜索
                </button>
              </div>
            </div>
          </div>

          <div class={styles.example}>
            <span class={styles.markup}>多个输入框拼接</span>
            <div class={styles.sample}>
              <div class="ui-join" role="group" aria-label="姓名">
                <input
                  {...inputAttributes()}
                  aria-label="姓"
                  placeholder="姓"
                  disabled={props.disabled}
                />
                <input
                  {...inputAttributes()}
                  aria-label="名"
                  placeholder="名"
                  disabled={props.disabled}
                />
              </div>
            </div>
          </div>

          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-fixed`}>
              输入框保留自定义宽度
            </label>
            <div class={styles.sample}>
              <div class="ui-join" role="group" aria-label="固定宽度输入">
                <button
                  {...buttonAttributes()}
                  data-width="icon"
                  aria-label="聚焦输入框"
                  onClick={() => document.getElementById(`${id}-fixed`)?.focus()}
                >
                  @
                </button>
                <input
                  {...inputAttributes()}
                  id={`${id}-fixed`}
                  data-width="6rem"
                  placeholder="6rem"
                  disabled={props.disabled}
                />
                <button
                  {...buttonAttributes()}
                  data-width="icon"
                  aria-label="确认"
                  onClick={() => setMessage("已确认")}
                >
                  ✓
                </button>
              </div>
            </div>
          </div>

          <div class={styles.example}>
            <label class={styles.markup} for={`${id}-wrapped`}>
              含修饰组的 div.ui-input
            </label>
            <div class={styles.sample}>
              <div class="ui-join" role="group" aria-label="组合输入">
                <div {...inputAttributes()}>
                  <span class="ui-addon" aria-hidden="true">
                    @
                  </span>
                  <input
                    id={`${id}-wrapped`}
                    ref={wrappedInput}
                    placeholder="账号"
                    disabled={props.disabled}
                  />
                  <span class="ui-addon">
                    <button
                      class="ui-addon-button"
                      type="button"
                      data-width="icon"
                      aria-label="聚焦账号输入"
                      disabled={props.disabled}
                      onClick={() => wrappedInput?.focus()}
                    >
                      +
                    </button>
                  </span>
                </div>
                <button
                  {...buttonAttributes()}
                  onClick={() => setMessage(`账号：${wrappedInput?.value || "未填写账号"}`)}
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </Show>
      </div>
      <p role="status">{message()}</p>
    </div>
  );
}

const meta = {
  title: "Styles/Group/Join",
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "filled", "light", "ghost", "text"],
    },
    inputVariant: { control: "select", options: ["default", "filled", "unstyled"] },
    color: { control: "text", description: "组内控件的 data-color" },
    radius: { control: "text", description: "组内控件的 data-radius，拼接处保持直角" },
    disabled: { control: "boolean" },
    direction: { control: "select", options: ["ltr", "rtl"] },
  },
  args: { variant: "default", inputVariant: "default", disabled: false, direction: "ltr" },
  render: (args: GroupArgs) => JoinExamples(args),
} satisfies Meta<GroupArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { parameters: { controls: { exclude: ["inputVariant"] } } };
export const WithInputs: Story = { render: (args: GroupArgs) => JoinExamples(args, true) };
