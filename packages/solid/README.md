# @recoui/solid

基于 `@recoui/style` 的 Solid 原子组件包，提供 Button、Input、Checkbox、Radio、Range、Select、Progress 和 Meter。

在应用入口引入一次共享样式：

```tsx
import "@recoui/style/style.css";
import { Button } from "@recoui/solid";

<Button variant="filled" color="primary">
  保存
</Button>;
```

各组件只返回对应的原生元素，不自动添加标签、说明或外层容器。原生属性、事件、ref、class/classList 均可直接使用；color 属性映射到 data-color。

Input 的 type 在 TypeScript 中排除 button 和 range，请分别使用 Button、Range。此限制不增加运行时拦截。Input 的 radius/width 分别映射为 data-radius/data-width。

Checkbox 支持独立于 checked 的原生半选属性：

```tsx
<Checkbox indeterminate aria-label="部分选中" />
```

indeterminate 在客户端设置为 DOM property，不序列化为 HTML attribute。点击会按原生行为退出半选状态，表单是否提交该项仍由 checked 决定。

Select 通过原生 option/optgroup 子元素设置选项，不提供 options 数据配置：

```tsx
import { Select } from "@recoui/solid";

<Select name="fruit" variant="filled" radius="rounded" aria-label="水果">
  <option value="">请选择</option>
  <optgroup label="水果">
    <option value="apple">苹果</option>
    <option value="orange">橙子</option>
  </optgroup>
</Select>;
```

Select 支持与 Input 一致的 variant/status，并将 radius/width 映射为 data-radius/data-width。Checkbox、Radio、Range 固定各自的 input 类型；Radio 使用相同 name 即可组成原生单选组。

Range 沿用样式库的填充位置变量，由调用方与原生 value 同步：

```tsx
import { createSignal } from "solid-js";
import { Range } from "@recoui/solid";

export function Volume() {
  const [value, setValue] = createSignal(40);
  return (
    <Range
      aria-label="音量"
      min={0}
      max={100}
      value={value()}
      style={{ "--ui-slider-position": `${value()}%` }}
      onInput={(event) => setValue(event.currentTarget.valueAsNumber)}
    />
  );
}
```

自定义 min/max 时，百分比按 `(value - min) / (max - min) * 100` 计算。Range 不接管原生状态或事件；Progress 不传 value 时保留原生的不确定进度状态，Meter 保留原生阈值及降级文字。

在仓库根目录运行 `pnpm storybook:solid`，可在 36007 端口查看组件示例。

发布产物包含浏览器、Node SSR 和保留 Solid JSX 的入口，框架运行时不会打入组件包。
