import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createEffect, createSignal, createUniqueId, For } from "solid-js";
import styles from "../shared/preview.module.css";

interface SliderArgs {
  value: number;
  disabled: boolean;
  color?: string;
  thumbWidth: string;
  direction: "ltr" | "rtl";
}

function SliderExamples(props: SliderArgs) {
  const id = createUniqueId();
  const [value, setValue] = createSignal(props.value);
  const [temperature, setTemperature] = createSignal(40);
  const [message, setMessage] = createSignal("");
  createEffect(() => setValue(Math.min(100, Math.max(0, props.value))));

  return (
    <div class={styles.preview} dir={props.direction}>
      <form
        class="ui-form"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setMessage(`表单值：${data.get("volume") ?? "禁用，不参与提交"}`);
        }}
        onReset={() => {
          setValue(Math.min(100, Math.max(0, props.value)));
          setMessage("已恢复初始值");
        }}
      >
        <div class="ui-field">
          <label class="ui-field-label" for={`${id}-volume`}>
            音量：{value()}%
          </label>
          <div
            class="ui-slider"
            data-color={props.color}
            style={{
              "--ui-slider-position": `${value()}%`,
              "--ui-thumb-width": props.thumbWidth,
            }}
          >
            <div class="ui-slider-track">
              <div class="ui-slider-range" />
            </div>
            <div class="ui-slider-thumb" />
            <input
              id={`${id}-volume`}
              name="volume"
              type="range"
              min="0"
              max="100"
              value={value()}
              disabled={props.disabled}
              aria-describedby={`${id}-description`}
              onInput={(event) => setValue(event.currentTarget.valueAsNumber)}
            />
          </div>
          <p class="ui-field-description" id={`${id}-description`}>
            可拖动、点击轨道或使用方向键。内嵌 input 视觉隐藏，保留键盘和表单行为。
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button class="ui-button" type="submit">
            读取表单值
          </button>
          <button class="ui-button" type="reset">
            重置
          </button>
        </div>
        <p role="status">{message()}</p>
      </form>

      <div class="ui-field">
        <label class="ui-field-label" for={`${id}-temperature`}>
          自定义范围 20–80：{temperature()}
        </label>
        <div
          class="ui-slider"
          data-color={props.color}
          style={{
            "--ui-slider-position": `${((temperature() - 20) / 60) * 100}%`,
            "--ui-thumb-width": props.thumbWidth,
          }}
        >
          <div class="ui-slider-track">
            <div class="ui-slider-range" />
          </div>
          <div class="ui-slider-thumb" />
          <input
            id={`${id}-temperature`}
            type="range"
            min="20"
            max="80"
            step="5"
            value={temperature()}
            disabled={props.disabled}
            onInput={(event) => setTemperature(event.currentTarget.valueAsNumber)}
          />
        </div>
        <p class="ui-field-description">
          通过 (value - min) / (max - min) × 100% 同步位置变量，CSS 负责显示。
        </p>
      </div>

      <fieldset class="ui-fieldset" disabled>
        <legend class="ui-legend">继承 fieldset 的禁用状态</legend>
        <div class="ui-slider" data-color={props.color} style={{ "--ui-slider-position": "65%" }}>
          <div class="ui-slider-track">
            <div class="ui-slider-range" />
          </div>
          <div class="ui-slider-thumb" />
          <input type="range" value="65" aria-label="禁用示例" />
        </div>
      </fieldset>
    </div>
  );
}

function NativeSliderExamples(props: SliderArgs) {
  const id = createUniqueId();
  const [value, setValue] = createSignal(props.value);
  createEffect(() => setValue(Math.min(100, Math.max(0, props.value))));
  const sliderStyle = () => ({
    "--ui-slider-position": `${value()}%`,
    "--ui-thumb-width": props.thumbWidth,
  });

  return (
    <div class={styles.preview} dir={props.direction}>
      <div class="ui-field">
        <label class="ui-field-label" for={`${id}-native`}>
          原生 input.ui-slider：{value()}%
        </label>
        <input
          class="ui-slider"
          id={`${id}-native`}
          type="range"
          min="0"
          max="100"
          value={value()}
          data-color={props.color}
          style={sliderStyle()}
          disabled={props.disabled}
          onInput={(event) => setValue(event.currentTarget.valueAsNumber)}
        />
      </div>
      <div class="ui-field">
        <label class="ui-field-label" for={`${id}-composite`}>
          组合式 div.ui-slider：{value()}%
        </label>
        <div class="ui-slider" data-color={props.color} style={sliderStyle()}>
          <div class="ui-slider-track">
            <div class="ui-slider-range" />
          </div>
          <div class="ui-slider-thumb" />
          <input
            id={`${id}-composite`}
            type="range"
            min="0"
            max="100"
            value={value()}
            disabled={props.disabled}
            onInput={(event) => setValue(event.currentTarget.valueAsNumber)}
          />
        </div>
      </div>
    </div>
  );
}

function SliderPositions(props: SliderArgs) {
  return (
    <div class={styles.preview} dir={props.direction}>
      <div class={styles.grid}>
        <For each={[0, 25, 50, 75, 100]}>
          {(position) => (
            <div class={styles.example}>
              <span class={styles.markup}>纯样式 · {position}%</span>
              <div
                class="ui-slider"
                aria-hidden="true"
                data-color={props.color}
                style={{
                  "--ui-slider-position": `${position}%`,
                  "--ui-thumb-width": props.thumbWidth,
                }}
              >
                <div class="ui-slider-track">
                  <div class="ui-slider-range" />
                </div>
                <div class="ui-slider-thumb" />
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

function HiddenValueSlider(props: SliderArgs) {
  const [value, setValue] = createSignal(props.value);
  createEffect(() => setValue(Math.min(100, Math.max(0, props.value))));
  return (
    <div class={styles.preview} dir={props.direction}>
      <div
        class="ui-slider"
        data-color={props.color}
        style={{ "--ui-slider-position": value() + "%", "--ui-thumb-width": props.thumbWidth }}
      >
        <div class="ui-slider-track">
          <div class="ui-slider-range" />
        </div>
        <button
          class="ui-slider-thumb"
          type="button"
          aria-label="增加滑块位置"
          disabled={props.disabled}
          onClick={() => setValue(value() >= 100 ? 0 : Math.min(100, value() + 25))}
        />
        <input type="hidden" name="position" value={value()} disabled={props.disabled} />
      </div>
      <output>当前位置 {value()}%</output>
    </div>
  );
}

const meta = {
  title: "Styles/Input/Slider",
  parameters: { layout: "padded" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    disabled: { control: "boolean" },
    color: { control: "text", description: "data-color，例如 primary、success 或自定义颜色" },
    thumbWidth: { control: "text", description: "--ui-thumb-width，例如 1rem、24px" },
    direction: { control: "select", options: ["ltr", "rtl"] },
  },
  args: { value: 40, disabled: false, thumbWidth: "1rem", direction: "ltr" },
  render: (args: SliderArgs) => <SliderExamples {...args} />,
} satisfies Meta<SliderArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NativeInput: Story = {
  render: (args: SliderArgs) => <NativeSliderExamples {...args} />,
};
export const Positions: Story = {
  parameters: { controls: { exclude: ["value", "disabled"] } },
  render: (args: SliderArgs) => <SliderPositions {...args} />,
};
export const HiddenValue: Story = { render: (args: SliderArgs) => <HiddenValueSlider {...args} /> };
