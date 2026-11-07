import { splitProps, type Component, type JSX } from "solid-js";
import clsx from "clsx";

export interface CollapseProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "aria-hidden" | "inert"> {
  expanded?: boolean;
}

/** 通过 expanded 同步折叠状态、辅助技术可见性和交互状态。 */
export const Collapse: Component<CollapseProps> = (props) => {
  const [localProps, restProps] = splitProps(props, ["children", "class", "classList", "expanded"]);

  return (
    <div
      class={clsx("ui-collapse", localProps.class)}
      classList={localProps.classList}
      {...restProps}
      data-expanded={localProps.expanded ? "" : undefined}
      aria-hidden={!localProps.expanded}
      inert={!localProps.expanded}
    >
      {localProps.children}
    </div>
  );
};
