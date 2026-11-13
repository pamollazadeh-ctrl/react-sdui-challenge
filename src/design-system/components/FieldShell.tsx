import type { CSSProperties, ReactNode } from "react";
import { errorIdFor, hintIdFor } from "../a11y";
import styles from "./FieldShell.module.css";

export interface FieldShellProps {
  /** Id of the control inside; the label and messages are linked to it. */
  id: string;
  label: string;
  required?: boolean;
  error?: string | undefined;
  hint?: string | undefined;
  style?: CSSProperties | undefined;
  children: ReactNode;
}

/**
 * Label + control + message layout shared by every field type.
 * Keeping it in one place guarantees consistent spacing and error semantics.
 */
export function FieldShell({
  id,
  label,
  required,
  error,
  hint,
  style,
  children,
}: FieldShellProps) {
  return (
    <div className={styles.field} style={style}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {" *"}
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={hintIdFor(id)} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorIdFor(id)} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
