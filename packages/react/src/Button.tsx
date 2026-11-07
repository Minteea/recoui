import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "filled" | "light" | "outline" | "ghost" | "text";
  color?: string;
  "data-radius"?: string;
  "data-width"?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, color, children, ...props },
  ref,
) {
  return (
    <button
      className={["ui-button", className].filter(Boolean).join(" ")}
      data-variant={variant}
      data-color={color}
      {...props}
      ref={ref}
    >
      {children}
    </button>
  );
});
