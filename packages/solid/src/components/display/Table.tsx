import { splitProps, type Component, type JSX } from "solid-js";
import clsx from "clsx";

export interface TableProps extends JSX.HTMLAttributes<HTMLTableElement> {}

/** 原生表格，表头、行和单元格通过 children 中的原生标签提供。 */
export const Table: Component<TableProps> = (props) => {
  const [localProps, restProps] = splitProps(props, ["children", "class", "classList"]);

  return (
    <table
      class={clsx("ui-table", localProps.class)}
      classList={localProps.classList}
      {...restProps}
    >
      {localProps.children}
    </table>
  );
};
