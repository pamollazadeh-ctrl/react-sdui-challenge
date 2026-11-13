import type { ReactNode } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { cx } from "@/lib/cx";
import styles from "./Alert.module.css";

export interface AlertProps {
  tone: "error" | "success";
  children: ReactNode;
}

/**
 * Inline feedback banner. Errors use `role="alert"` (announced immediately),
 * success uses `role="status"` (announced politely, without interrupting).
 */
export function Alert({ tone, children }: AlertProps) {
  const Icon = tone === "error" ? CircleAlert : CircleCheck;
  return (
    <div
      className={cx(styles.alert, styles[tone])}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon className={styles.icon} size={18} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
