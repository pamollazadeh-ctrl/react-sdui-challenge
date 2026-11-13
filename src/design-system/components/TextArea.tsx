import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";
import styles from "./Control.module.css";

export type TextAreaProps = ComponentProps<"textarea">;

/** Multi-line input sharing the text control look. */
export function TextArea({ className, ...rest }: TextAreaProps) {
  return (
    <textarea
      className={cx(styles.control, styles.medium, className)}
      {...rest}
    />
  );
}
