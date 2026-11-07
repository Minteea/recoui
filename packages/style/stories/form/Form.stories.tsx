import { createSignal, createUniqueId, For } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import styles from "../shared/preview.module.css";

interface FormArgs {
  disabled: boolean;
}

function FormExample(props: FormArgs) {
  const id = createUniqueId();
  const [result, setResult] = createSignal("填写后提交表单");

  return (
    <div class={styles.preview} style={{ width: "min(28rem, 100%)" }}>
      <form
        class="ui-form"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setResult(
            `邮箱：${data.get("email") ?? "未填写"}，通知：${
              data.has("updates") ? "开启" : "关闭"
            }`,
          );
        }}
        onReset={() => setResult("已重置表单")}
      >
        <fieldset class="ui-fieldset" disabled={props.disabled}>
          <legend class="ui-legend">账户设置</legend>
          <div class="ui-form">
            <div class="ui-field">
              <label class="ui-field-label" for={`${id}-email`}>
                邮箱
              </label>
              <input
                class="ui-input"
                id={`${id}-email`}
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                aria-describedby={`${id}-email-description`}
              />
              <p class="ui-field-description" id={`${id}-email-description`}>
                fieldset 的禁用状态会传递到内部控件。
              </p>
            </div>
            <span class="ui-label-wrapper">
              <input class="ui-checkbox" id={`${id}-updates`} name="updates" type="checkbox" />
              <label class="ui-label" for={`${id}-updates`}>
                接收项目更新
              </label>
            </span>
            <div class="ui-group">
              <button class="ui-button" type="submit">
                保存
              </button>
              <button class="ui-button" type="reset" data-variant="ghost">
                重置
              </button>
            </div>
          </div>
        </fieldset>
        <output aria-live="polite">{result()}</output>
      </form>
    </div>
  );
}

function IndicatorExamples() {
  const id = createUniqueId();
  return (
    <div class={styles.preview} style={{ width: "min(32rem, 100%)" }}>
      <div class="ui-field">
        <label class="ui-field-label" for={`${id}-progress`}>
          上传进度 60%
        </label>
        <progress class="ui-progress" id={`${id}-progress`} value={60} max={100}>
          60%
        </progress>
      </div>
      <div class="ui-field">
        <label class="ui-field-label" for={`${id}-pending`}>
          不确定进度
        </label>
        <progress class="ui-progress" id={`${id}-pending`}>
          上传中
        </progress>
      </div>
      <For each={[20, 60, 90]}>
        {(value) => (
          <div class="ui-field">
            <label class="ui-field-label" for={`${id}-meter-${value}`}>
              容量使用 {value}%
            </label>
            <meter
              class="ui-meter"
              id={`${id}-meter-${value}`}
              min={0}
              max={100}
              low={30}
              high={80}
              optimum={10}
              value={value}
            >
              {value}%
            </meter>
          </div>
        )}
      </For>
    </div>
  );
}

const meta = {
  title: "Styles/Form/Form",
  argTypes: { disabled: { control: "boolean" } },
  args: { disabled: false },
  render: (args: FormArgs) => <FormExample {...args} />,
} satisfies Meta<FormArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Indicators: Story = {
  parameters: { controls: { disable: true } },
  render: () => <IndicatorExamples />,
};
