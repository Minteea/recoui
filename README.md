# RecoUI

基于 pnpm workspace 的样式与组件库。

| 包              | 目录             | 内容                                        |
| --------------- | ---------------- | ------------------------------------------- |
| `@recoui/style` | `packages/style` | 与框架无关的 CSS/SCSS，以及现有完整样式演示 |
| `@recoui/solid` | `packages/solid` | 基于样式库的 Solid 原生原子组件             |
| `@recoui/react` | `packages/react` | 基于样式库的 React 组件，目前只有 Button    |

两个组件包通过 `workspace:*` 依赖 `@recoui/style`，框架运行时作为 peer dependency。`style/dev/components` 中的旧 Solid 封装仅供样式演示使用，不属于发布内容。

## 本地开发

需要 Node.js 22 或更高版本，以及 pnpm 11。统一在仓库根目录安装依赖：

```bash
pnpm install
pnpm build
```

每个包有独立的 Storybook：

| 命令                                       | 预览             | 端口         |
| ------------------------------------------ | ---------------- | ------------ |
| `pnpm storybook` 或 `pnpm storybook:style` | 样式库           | 36006        |
| `pnpm storybook:solid`                     | Solid 原子组件   | 36007        |
| `pnpm storybook:react`                     | React Button     | 36008        |
| `pnpm storybook:all`                       | 同时启动三个预览 | 上述三个端口 |

`pnpm dev` 保留样式库的 Vite 演示页面，端口为 37001。Storybook 直接使用样式包的 SCSS 源码，无需先构建 CSS。

```bash
pnpm build             # 按依赖顺序构建三个包
pnpm typecheck         # 检查三个包的类型
pnpm test              # 运行 Solid/React 组件测试
pnpm lint              # 类型和组件源码检查
pnpm build-storybook   # 分别输出到各包的 storybook-static
pnpm format:check
```

也可以单独操作一个包，例如 `pnpm --filter @recoui/solid build`。

## 包内路径别名

每个包的 `~` 都指向自己的 `src` 目录，例如 Solid 包内：

```ts
import { Button } from "~/components/input";
import type { UIColorProps } from "~/types";
```

各包的 `tsconfig.json` 分别声明 `paths`，因此不会误指向仓库根目录的 `src`。各包的 `vite.config.ts` 提供相同映射，Storybook、Vitest 和样式开发页复用该配置；tsup 构建读取包内 TSConfig 的路径映射，发布产物无需消费者配置 `~`。

## 使用样式

在应用入口引入一次 CSS，即可直接使用样式类：

```ts
import "@recoui/style/style.css";
```

```html
<button class="ui-button" data-variant="filled">保存</button>
```

样式包也通过 `@recoui/style/scss` 提供 SCSS 入口；`@recoui/style/scss/*` 对应 `src/styles/*` 下的源文件。

## 使用组件

组件包不自动导入 CSS。应用需要同时依赖样式包和所用框架包，并在入口引入样式：

```tsx
import "@recoui/style/style.css";
import { Button } from "@recoui/solid";
// React 应用改为：import { Button } from "@recoui/react";

export function Example() {
  return (
    <Button variant="filled" color="primary">
      保存
    </Button>
  );
}
```

Button 支持原生按钮属性、variant/color 以及 data-radius/data-width。Solid 使用 class/classList，React 使用 className；两个版本均支持 ref。

Solid 还提供 Input、Checkbox、Radio、Range、Select、Progress 和 Meter；它们只返回原生元素。Select 的选项通过原生 option/optgroup 子元素提供，详细示例见 [Solid 包说明](packages/solid/README.md)。

## 发布内容

仓库根包为 private。`@recoui/style` 仅发布生成的 CSS 与 SCSS 源码；两个框架包仅发布构建产物和类型声明。Solid 提供上述原子组件，React 目前只提供 Button。各包的 `prepack` 会先构建当前包；发布前可在根目录运行 `pnpm build` 完成整套构建。
