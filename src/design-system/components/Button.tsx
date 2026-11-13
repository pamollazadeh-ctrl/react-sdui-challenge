import type { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.css";

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary";
  /** Disables the button and shows a spinner; prevents double submits. */
  loading?: boolean;
}

export function Button({
  variant = "primary",
  loading = false,
  type = "button",
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.button, styles[variant], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <LoaderCircle className={styles.spinner} size={18} aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
