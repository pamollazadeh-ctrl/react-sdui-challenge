import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";
import type { ControlSize } from "../types";
import styles from "./Control.module.css";

export interface TextInputProps extends Omit<ComponentProps<"input">, "size"> {
  size?: ControlSize;
}

/** Single-line input. Native `size` is replaced by the design-system size scale. */
export function TextInput({
  size = "medium",
  className,
  ...rest
}: TextInputProps) {
  return (
    <input className={cx(styles.control, styles[size], className)} {...rest} />
  );
}
