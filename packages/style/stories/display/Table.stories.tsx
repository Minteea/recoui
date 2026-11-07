import type { Meta, StoryObj } from "storybook-solidjs-vite";
import styles from "../shared/preview.module.css";

const meta = {
  title: "Styles/Display/Table",
  parameters: { layout: "padded" },
  render: () => (
    <div class={styles.preview}>
      <table class="ui-table">
        <caption>组件开发进度</caption>
        <thead>
          <tr>
            <th scope="col">组件</th>
            <th scope="col">分类</th>
            <th scope="col">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Button</th>
            <td>Input</td>
            <td>已完成</td>
          </tr>
          <tr>
            <th scope="row">Table</th>
            <td>Display</td>
            <td>开发中</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>共 2 个组件</td>
          </tr>
        </tfoot>
      </table>
    </div>
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SpanningCells: Story = {
  render: () => (
    <div class={styles.preview}>
      <table class="ui-table">
        <caption>各框架的组件支持情况</caption>
        <thead>
          <tr>
            <th scope="col" rowSpan={2}>
              分类
            </th>
            <th scope="col" rowSpan={2}>
              组件
            </th>
            <th scope="colgroup" colSpan={2}>
              框架
            </th>
          </tr>
          <tr>
            <th scope="col">Solid</th>
            <th scope="col">React</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="rowgroup" rowSpan={2}>
              Input
            </th>
            <th scope="row">Button</th>
            <td>已支持</td>
            <td>已支持</td>
          </tr>
          <tr>
            <th scope="row">Input</th>
            <td>已支持</td>
            <td>开发中</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
