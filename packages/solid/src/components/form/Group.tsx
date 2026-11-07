import { splitProps, type Component, type JSX } from "solid-js";
import clsx from "clsx";

export interface GroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

/** 按方向排列控件的布局容器。 */
export const Group: Component<GroupProps> = (props) => {
  const [localProps, restProps] = splitProps(props, [
    "children",
    "class",
    "classList",
    "orientation",
  ]);

  return (
    <div
      class={clsx("ui-group", localProps.class)}
      classList={localProps.classList}
      data-orientation={localProps.orientation}
      {...restProps}
    >
      {localProps.children}
    </div>
  );
};
