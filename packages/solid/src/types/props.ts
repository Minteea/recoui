
/** 色彩类型 */
export type ColorType = "neutral" | "primary" | "success" | "danger" | "error" | "warning" | "info";

/** UI 颜色属性 */
export interface UIColorProps {
  color?: ColorType | string;
}

/** UI 圆角属性 */
export interface UIRadiusProps {
  radius?: "rounded" | string;
}

