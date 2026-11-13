import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";
import type { ControlSize } from "../types";
import styles from "./Control.module.css";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectBoxProps extends Omit<
  ComponentProps<"select">,
  "size" | "children"
> {
  options: readonly SelectOption[];
  /** Shown as the empty first option, so "nothing selected" is a visible state. */
  placeholder?: string;
  size?: ControlSize;
}

/**
 * Native `<select>`: keyboard, screen-reader and mobile behaviour come for free,
 * which a custom listbox would have to re-implement.
 */
export function SelectBox({
  options,
  placeholder,
  size = "medium",
  className,
  ...rest
}: SelectBoxProps) {
  return (
    <select className={cx(styles.control, styles[size], className)} {...rest}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
